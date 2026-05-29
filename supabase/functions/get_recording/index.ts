import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// get_recording — device-side chapter playback.
//
// All recordings in a chapter play as ONE continuous timeline: the device
// starts at the first recording and the user can fast-forward/seek across all
// of them, then play from anywhere. So we return EVERY recording for the
// chapter, ordered oldest -> newest (first take first), each with a signed URL
// and its duration, plus the total so the firmware can build a seek bar.
//
// Headers: x-hardware-id, x-pair-token, x-chapter (0-based active chapter).
// Body: {}
// Response:
//   { found: true, count, total_duration_sec, recordings: [ { url, duration_sec }, ... ] }
//   { found: false }   when the chapter has no recordings
//
// Schema note: `recordings` has no device_id column — it links to the owning
// user via account_id (= devices.user_id). Single-device-per-account assumed.
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

  // Authenticate the device, resolve owning user.
  const { data: dev } = await supa
    .from("devices")
    .select("id, user_id, pairing_token")
    .eq("hardware_id", hwId)
    .maybeSingle();

  if (!dev || dev.pairing_token !== token) {
    return new Response("unauthorized", { status: 401, headers: CORS });
  }

  // ALL recordings for this account + chapter, oldest first (playback order).
  const { data: recs } = await supa
    .from("recordings")
    .select("storage_path, duration_seconds")
    .eq("account_id", dev.user_id)
    .eq("chapter_idx", chapter)
    .order("created_at", { ascending: true });

  if (!recs || recs.length === 0) return json({ found: false });

  // Sign all paths in one call; map back by path to preserve playback order.
  const paths = recs.map((r) => r.storage_path);
  const { data: signed, error: signErr } = await supa.storage
    .from("recordings")
    .createSignedUrls(paths, 3600);

  if (signErr || !signed) {
    return json({ found: false, error: "could not sign urls" }, 500);
  }

  const urlByPath = new Map(signed.map((s) => [s.path, s.signedUrl]));

  const recordings = recs
    .map((r) => ({
      url: urlByPath.get(r.storage_path) ?? null,
      duration_sec: r.duration_seconds,
    }))
    .filter((r) => r.url); // drop any that failed to sign

  if (recordings.length === 0) {
    return json({ found: false, error: "no signable recordings" }, 500);
  }

  const total = recordings.reduce((sum, r) => sum + (r.duration_sec || 0), 0);

  return json({
    found: true,
    count: recordings.length,
    total_duration_sec: total,
    recordings,
  });
});
