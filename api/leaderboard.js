import { methodNotAllowed, sendJson } from "./_lib/http.js";
import { listLeaderboard } from "./_lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    methodNotAllowed(res, ["GET"]);
    return;
  }

  try {
    const scores = await listLeaderboard(12);
    sendJson(res, 200, { scores });
  } catch (error) {
    sendJson(res, 500, { error: error?.message || "Server error." });
  }
}
