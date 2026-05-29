import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// delete_device — full teardown of a paired device and all its data.
//
// User-initiated from the app ("Remove this device"), so this runs WITH JWT
// verification (the app sends the signed-in user's token). We confirm the
// caller owns the device, then use the service role to delete everything the
// client can't reach via RLS:
//   1. WAV files in the `recordings` bucket  (recordings/<account_id>/*.wav)
//   2. orphaned PCM in `recording_chunks`    (recording_chunks/<hardware_id>/<session>/*.pcm)
//   3. recordings rows for the account
//   4. the devices row
//
// Body: { deviceId: string }
// Response: { ok: true, deleted: { wavs, chunkFiles, rows } }
//
// Deploy WITHOUT --no-verify-jwt (default verify ON) so only an authenticated
// user can call it. NOTE: recordings have no device_id column, so rows/WAVs are
// deleted per-account (fine for the one-device-per-account model today).

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "unauthorized" }, 401);

  const url = Deno.env.get("SUPABASE_URL")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Identify the caller. The function is deployed with verify_jwt=true, so the
  // gateway has already validated the token's signature — we just decode the
  // payload to read the user id (`sub`). This avoids any dependency on the
  // anon-key env var (which is unreliable under the new publishable-key system).
  let uid: string | null = null;
  try {
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const part = token.split(".")[1];
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/")
      .padEnd(Math.ceil(part.length / 4) * 4, "=");
    uid = JSON.parse(atob(b64)).sub ?? null;
  } catch {
    uid = null;
  }
  if (!uid) return json({ error: "unauthorized" }, 401);
  const user = { id: uid };

  let deviceId: string | undefined;
  try {
    ({ deviceId } = await req.json());
  } catch {
    return json({ error: "bad body" }, 400);
  }
  if (!deviceId) return json({ error: "missing deviceId" }, 400);

  const admin = createClient(url, service);

  // Verify ownership.
  const { data: dev } = await admin
    .from("devices")
    .select("id, user_id, hardware_id")
    .eq("id", deviceId)
    .maybeSingle();

  if (!dev) return json({ error: "device not found" }, 404);
  if (dev.user_id !== user.id) return json({ error: "forbidden" }, 403);

  let wavs = 0;
  let chunkFiles = 0;

  // 1. WAVs in recordings/<account_id>/
  const { data: wavList } = await admin.storage
    .from("recordings")
    .list(user.id, { limit: 1000 });
  if (wavList && wavList.length > 0) {
    const paths = wavList.map((f) => `${user.id}/${f.name}`);
    await admin.storage.from("recordings").remove(paths);
    wavs = paths.length;
  }

  // 2. Orphaned PCM in recording_chunks/<hardware_id>/<session>/
  const { data: sessions } = await admin.storage
    .from("recording_chunks")
    .list(dev.hardware_id, { limit: 1000 });
  for (const s of sessions ?? []) {
    const { data: files } = await admin.storage
      .from("recording_chunks")
      .list(`${dev.hardware_id}/${s.name}`, { limit: 2000 });
    if (files && files.length > 0) {
      const paths = files.map((f) => `${dev.hardware_id}/${s.name}/${f.name}`);
      await admin.storage.from("recording_chunks").remove(paths);
      chunkFiles += paths.length;
    }
  }

  // 3. recordings rows
  const { count: rows } = await admin
    .from("recordings")
    .delete({ count: "exact" })
    .eq("account_id", user.id);

  // 4. the device row
  await admin.from("devices").delete().eq("id", deviceId);

  return json({ ok: true, deleted: { wavs, chunkFiles, rows: rows ?? 0 } });
});
