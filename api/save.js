import { cleanCode, verifySessionToken } from "./_lib/auth.js";
import { methodNotAllowed, readJson, sendJson } from "./_lib/http.js";
import { publicProfile, safeSave } from "./_lib/save.js";
import { getProfile, upsertProfile } from "./_lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res, ["POST"]);
    return;
  }

  try {
    const body = await readJson(req);
    const reefCode = cleanCode(body.reefCode);
    if (!verifySessionToken(body.token, reefCode)) {
      sendJson(res, 401, { error: "Please sign in again to sync progress." });
      return;
    }

    const profile = await getProfile(reefCode);
    if (!profile) {
      sendJson(res, 404, { error: "Profile not found." });
      return;
    }

    profile.save = safeSave(body.save);
    profile.updatedAt = new Date().toISOString();
    const saved = await upsertProfile(profile);
    sendJson(res, 200, { profile: publicProfile(saved) });
  } catch (error) {
    const message = error?.message || "Server error.";
    const status =
      message.includes("Invalid JSON") || message.includes("too large")
        ? 400
        : 500;
    sendJson(res, status, { error: message });
  }
}
