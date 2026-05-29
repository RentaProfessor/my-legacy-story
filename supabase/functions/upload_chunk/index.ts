import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": [
    "authorization", "x-client-info", "apikey", "content-type",
    "x-hardware-id", "x-pair-token", "x-session-id", "x-chunk-idx",
  ].join(", "),
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  // ── Parse required headers ──────────────────────────────────────────────────
  const hardwareId = req.headers.get("x-hardware-id");
  const pairToken  = req.headers.get("x-pair-token");
  const sessionId  = req.headers.get("x-session-id");
  const chunkIdx   = req.headers.get("x-chunk-idx");

  if (!hardwareId || !pairToken || !sessionId || chunkIdx === null) {
    return json({ error: "missing required headers" }, 400);
  }

  // Validate chunkIdx is a non-negative integer to prevent path traversal.
  const idx = parseInt(chunkIdx, 10);
  if (isNaN(idx) || idx < 0 || String(idx) !== chunkIdx) {
    return json({ error: "invalid x-chunk-idx" }, 400);
  }

  // ── Authenticate device ─────────────────────────────────────────────────────
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: device, error: authErr } = await supabase
    .from("devices")
    .select("id")
    .eq("hardware_id", hardwareId)
    .eq("pairing_token", pairToken)
    .maybeSingle();

  if (authErr || !device) {
    return json({ error: "unauthorized" }, 401);
  }

  // ── Store PCM chunk (upsert = idempotent on retry) ──────────────────────────
  const pcmData = await req.arrayBuffer();
  const path = `${hardwareId}/${sessionId}/${idx}.pcm`;

  const { error: uploadErr } = await supabase.storage
    .from("recording_chunks")
    .upload(path, pcmData, {
      contentType: "application/octet-stream",
      upsert: true,
    });

  if (uploadErr) {
    console.error("Storage upload failed:", uploadErr.message);
    return json({ error: uploadErr.message }, 500);
  }

  return json({ ok: true, chunk: idx }, 200);
});

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
