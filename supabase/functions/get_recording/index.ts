import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// get_recording — device-side playback.
// The device sends its hardware id + pair token + the active chapter index.
// We return a signed URL (1h) to the most recent WAV for that chapter so the
// firmware can stream it to I2S.
//
// NOTE on the schema: the `recordings` table has NO `device_id` column — it
// links to the owning user via `account_id` (= devices.user_id). So we resolve
// the device -> user_id, then look up recordings by account_id + chapter_idx.
// (Single-device-per-account is assumed today; if a user pairs multiple
// devices, recordings for the same chapter_idx are shared across them — see the
// note to the firmware dev about adding a device_id column if we need per-device
// isolation.)
//
// Deploy: supabase functions deploy get_recording --no-verify-jwt

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-hardware-id, x-pair-token, x-chapter",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const hwId = req.headers.get("x-hardware-id");
  const token = req.headers.get("x-pair-token");
  const chapter = parseInt(req.headers.get("x-chapter") ?? "0", 10) || 0;

  if (!hwId || !token) return json({ error: "missing headers" }, 400);

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Authenticate the device (hardware_id + pairing_token), resolve owning user.
  const { data: dev } = await supa
    .from("devices")
    .select("id, user_id, pairing_token")
    .eq("hardware_id", hwId)
    .maybeSingle();

  if (!dev || dev.pairing_token !== token) {
    return new Response("unauthorized", { status: 401, headers: CORS });
  }

  // Most recent recording for this account + chapter.
  const { data: rec } = await supa
    .from("recordings")
    .select("storage_path, duration_seconds")
    .eq("account_id", dev.user_id)
    .eq("chapter_idx", chapter)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!rec) return json({ found: false });

  const { data: signed, error: signErr } = await supa.storage
    .from("recordings")
    .createSignedUrl(rec.storage_path, 3600);

  if (signErr || !signed?.signedUrl) {
    return json({ found: false, error: "could not sign url" }, 500);
  }

  return json({
    found: true,
    url: signed.signedUrl,
    duration_sec: rec.duration_seconds,
  });
});
