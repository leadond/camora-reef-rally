import { cleanCode, createSessionToken, hashPin } from "./_lib/auth.js";
import { methodNotAllowed, readJson, sendJson } from "./_lib/http.js";
import { publicProfile } from "./_lib/save.js";
import { getProfile } from "./_lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res, ["POST"]);
    return;
  }

  try {
    const body = await readJson(req);
    const reefCode = cleanCode(body.reefCode);
    const pin = String(body.pin || "").trim();
    const profile = await getProfile(reefCode);
    if (!profile || hashPin(pin, profile.pinSalt) !== profile.pinHash) {
      sendJson(res, 401, { error: "That Reef Code and PIN did not match." });
      return;
    }
    sendJson(res, 200, {
      token: createSessionToken(reefCode),
      profile: publicProfile(profile)
    });
  } catch (error) {
    const message = error?.message || "Server error.";
    const status =
      message.includes("Invalid JSON") || message.includes("too large")
        ? 400
        : 500;
    sendJson(res, status, { error: message });
  }
}
