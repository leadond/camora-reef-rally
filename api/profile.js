import { cleanCode } from "./_lib/auth.js";
import { methodNotAllowed, sendJson } from "./_lib/http.js";
import { publicProfile } from "./_lib/save.js";
import { getProfile } from "./_lib/store.js";

function queryValue(req, key) {
  if (req.query && key in req.query) {
    return req.query[key];
  }
  const url = new URL(req.url || "/", "http://localhost");
  return url.searchParams.get(key);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    methodNotAllowed(res, ["GET"]);
    return;
  }

  try {
    const reefCode = cleanCode(queryValue(req, "reefCode"));
    const profile = await getProfile(reefCode);
    if (!profile) {
      sendJson(res, 404, { error: "Profile not found." });
      return;
    }
    sendJson(res, 200, { profile: publicProfile(profile) });
  } catch (error) {
    sendJson(res, 500, { error: error?.message || "Server error." });
  }
}
