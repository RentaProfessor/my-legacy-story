import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": [
    "authorization", "x-client-info", "apikey", "content-type",
    "x-hardware-id", "x-pair-token", "x-session-id", "x-acct",
    "x-duration", "x-chapter", "x-book-name", "x-chapter-name",
  ].join(", "),
};

// 16 kHz mono 16-bit PCM — must match device firmware constants.
const SAMPLE_RATE    = 16000;
const NUM_CHANNELS   = 1;
const BITS_PER_SAMPLE = 16;

/** Build a 44-byte WAV header for the given number of raw PCM bytes. */
function buildWavHeader(pcmByteCount: number): Uint8Array {
  const byteRate  = SAMPLE_RATE * NUM_CHANNELS * (BITS_PER_SAMPLE / 8);
  const blockAlign = NUM_CHANNELS * (BITS_PER_SAMPLE / 8);

  const header = new ArrayBuffer(44);
  const view   = new DataView(header);
  const bytes  = new Uint8Array(header);
  const enc    = new TextEncoder();

  bytes.set(enc.encode("RIFF"), 0);
  view.setUint32(4,  36 + pcmByteCount, true); // ChunkSize = 36 + data size
  bytes.set(enc.encode("WAVE"), 8);
  bytes.set(enc.encode("fmt "), 12);
  view.setUint32(16, 16,            true);      // Subchunk1Size (PCM = 16)
  view.setUint16(20, 1,             true);      // AudioFormat = PCM
  view.setUint16(22, NUM_CHANNELS,  true);
  view.setUint32(24, SAMPLE_RATE,   true);
  view.setUint32(28, byteRate,      true);
  view.setUint16(32, blockAlign,    true);
  view.setUint16(34, BITS_PER_SAMPLE, true);
  bytes.set(enc.encode("data"), 36);
  view.setUint32(40, pcmByteCount,  true);      // Subchunk2Size = actual PCM bytes

  return bytes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  // ── Parse required headers ──────────────────────────────────────────────────
  const hardwareId  = req.headers.get("x-hardware-id");
  const pairToken   = req.headers.get("x-pair-token");
  const sessionId   = req.headers.get("x-session-id");
  const acct        = req.headers.get("x-acct");          // account UUID
  const durationStr = req.headers.get("x-duration") ?? "0";
  const chapterStr  = req.headers.get("x-chapter")  ?? "0";
  const bookName    = req.headers.get("x-book-name")    ?? null;
  const chapterName = req.headers.get("x-chapter-name") ?? null;

  if (!hardwareId || !pairToken || !sessionId || !acct) {
    return json({ error: "missing required headers" }, 400);
  }

  const duration   = parseInt(durationStr, 10) || 0;
  const chapterIdx = parseInt(chapterStr,  10) || 0;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ── Authenticate device ─────────────────────────────────────────────────────
  const { data: device, error: authErr } = await supabase
    .from("devices")
    .select("id, user_id")
    .eq("hardware_id", hardwareId)
    .eq("pairing_token", pairToken)
    .maybeSingle();

  if (authErr || !device) {
    return json({ error: "unauthorized" }, 401);
  }

  // ── Idempotency check — if already finalized return the existing row ────────
  const storagePath = `${acct}/${sessionId}.wav`;

  const { data: existing } = await supabase
    .from("recordings")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) {
    return json({ id: existing.id, already_complete: true }, 200);
  }

  // ── List PCM chunks ─────────────────────────────────────────────────────────
  const { data: chunkFiles, error: listErr } = await supabase.storage
    .from("recording_chunks")
    .list(`${hardwareId}/${sessionId}`, { limit: 2000 });

  if (listErr || !chunkFiles || chunkFiles.length === 0) {
    return json({ error: "no chunks found for this session" }, 404);
  }

  // Sort numerically by chunk index (lexicographic sort breaks for idx >= 10).
  const sorted = [...chunkFiles].sort((a, b) => {
    const ai = parseInt(a.name.replace(".pcm", ""), 10);
    const bi = parseInt(b.name.replace(".pcm", ""), 10);
    return ai - bi;
  });

  // ── Download + concatenate PCM ──────────────────────────────────────────────
  const pcmChunks: Uint8Array[] = [];
  let totalPcmBytes = 0;

  for (const file of sorted) {
    const { data: blob, error: dlErr } = await supabase.storage
      .from("recording_chunks")
      .download(`${hardwareId}/${sessionId}/${file.name}`);

    if (dlErr || !blob) {
      console.error(`Failed to download chunk ${file.name}:`, dlErr?.message);
      continue;
    }

    const arr = new Uint8Array(await blob.arrayBuffer());
    pcmChunks.push(arr);
    totalPcmBytes += arr.byteLength;
  }

  if (totalPcmBytes === 0) {
    return json({ error: "all chunk downloads failed" }, 500);
  }

  // ── Assemble WAV ────────────────────────────────────────────────────────────
  const wavHeader = buildWavHeader(totalPcmBytes);
  const wav = new Uint8Array(44 + totalPcmBytes);
  wav.set(wavHeader, 0);
  let offset = 44;
  for (const chunk of pcmChunks) {
    wav.set(chunk, offset);
    offset += chunk.byteLength;
  }

  // ── Upload WAV to storage ───────────────────────────────────────────────────
  const { error: wavErr } = await supabase.storage
    .from("recordings")
    .upload(storagePath, wav, {
      contentType: "audio/wav",
      upsert: false, // unique path per session, never overwrite
    });

  if (wavErr) {
    console.error("WAV upload failed:", wavErr.message);
    return json({ error: wavErr.message }, 500);
  }

  // ── Insert recordings row ───────────────────────────────────────────────────
  const { data: recRow, error: insertErr } = await supabase
    .from("recordings")
    .insert({
      account_id:       acct,
      session_id:       sessionId,
      book_name:        bookName,
      chapter_idx:      chapterIdx,
      chapter_name:     chapterName,
      storage_path:     storagePath,
      duration_seconds: duration,
    })
    .select("id")
    .single();

  if (insertErr) {
    console.error("recordings insert failed:", insertErr.message);
    return json({ error: insertErr.message }, 500);
  }

  // Transcription is handled client-side by the iOS app (Apple SFSpeech) once
  // the recordings row appears via Realtime — see ManageDevice.tsx. We do NOT
  // transcribe here: running both an Edge-side Whisper pass and the iOS pass
  // would double-write `transcription` (last-writer-wins race) and require an
  // OPENAI_API_KEY this project no longer needs.
  const recordingId = recRow.id;

  // ── Clean up raw PCM chunks ─────────────────────────────────────────────────
  // Non-blocking — orphans are handled by a daily GC job anyway.
  EdgeRuntime.waitUntil(
    (async () => {
      const paths = sorted.map((f) => `${hardwareId}/${sessionId}/${f.name}`);
      await supabase.storage.from("recording_chunks").remove(paths);
    })()
  );

  return json({ id: recordingId }, 200);
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
