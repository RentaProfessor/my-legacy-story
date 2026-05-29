import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// delete_device — full teardown of a paired device and all its data.
//
// Authorizes with the device's own pairing token (same pattern as upload_chunk /
// finalize_recording / get_recording), NOT a user session — so it works whether
// the app is signed in normally or running in admin mode (no session). The app
// already holds the pairing token in the loaded device row.
//
// Uses the service role to delete everything RLS can't reach from the client:
//   1. WAV files in `recordings`        (recordings/<account_id>/*.wav)
//   2. orphaned PCM in `recording_chunks` (recording_chunks/<hardware_id>/<session>/*.pcm)
//   3. recordings rows for the account
//   4. the devices row
//
// Headers: x-hardware-id, x-pair-token   Body: {}
// Response: { ok: true, deleted: { wavs, chunkFiles, rows } }
//
// Deploy: supabase functions deploy delete_device --no-verify-jwt
// NOTE: recordings have no device_id, so rows/WAVs are deleted per-account
// (fine for one-device-per-account today).

// This function is called from the app via supabase-js, which sends headers
// like x-client-info / x-supabase-api-version on every request. Echo back
// whatever the preflight asks for so the browser never blocks us (the old
// fixed list omitted x-client-info, which silently failed the CORS preflight).
function cors(req: Request) {
  const requested = req.headers.get("Access-Control-Request-Headers");
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      requested ??
      "authorization, x-client-info, apikey, content-type, x-supabase-api-version, x-hardware-id, x-pair-token",
  };
}

Deno.serve(async (req) => {
  const CORS = cors(req);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const hwId = req.headers.get("x-hardware-id");
  const token = req.headers.get("x-pair-token");
  if (!hwId || !token) return json({ error: "missing headers" }, 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Authenticate via the device's pairing token.
  const { data: dev } = await admin
    .from("devices")
    .select("id, user_id, pairing_token")
    .eq("hardware_id", hwId)
    .maybeSingle();

  if (!dev || dev.pairing_token !== token) {
    return new Response("unauthorized", { status: 401, headers: CORS });
  }

  let wavs = 0;
  let chunkFiles = 0;

  // 1. WAVs in recordings/<account_id>/
  const { data: wavList } = await admin.storage
    .from("recordings")
    .list(dev.user_id, { limit: 1000 });
  if (wavList && wavList.length > 0) {
    const paths = wavList.map((f) => `${dev.user_id}/${f.name}`);
    await admin.storage.from("recordings").remove(paths);
    wavs = paths.length;
  }

  // 2. Orphaned PCM in recording_chunks/<hardware_id>/<session>/
  const { data: sessions } = await admin.storage
    .from("recording_chunks")
    .list(hwId, { limit: 1000 });
  for (const s of sessions ?? []) {
    const { data: files } = await admin.storage
      .from("recording_chunks")
      .list(`${hwId}/${s.name}`, { limit: 2000 });
    if (files && files.length > 0) {
      const paths = files.map((f) => `${hwId}/${s.name}/${f.name}`);
      await admin.storage.from("recording_chunks").remove(paths);
      chunkFiles += paths.length;
    }
  }

  // 3. recordings rows
  const { count: rows } = await admin
    .from("recordings")
    .delete({ count: "exact" })
    .eq("account_id", dev.user_id);

  // 4. the device row
  await admin.from("devices").delete().eq("id", dev.id);

  return json({ ok: true, deleted: { wavs, chunkFiles, rows: rows ?? 0 } });
});
