import crypto from "node:crypto";
import {
  assertPin,
  cleanName,
  createCodeCandidate,
  createSessionToken,
  hashPin
} from "./_lib/auth.js";
import { methodNotAllowed, readJson, sendJson } from "./_lib/http.js";
import { defaultSave, publicProfile } from "./_lib/save.js";
import { isCodeTaken, upsertProfile } from "./_lib/store.js";

async function createUniqueCode() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const reefCode = createCodeCandidate();
    if (!(await isCodeTaken(reefCode))) {
      return reefCode;
    }
  }
  throw new Error("Could not create a unique Reef Code.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    methodNotAllowed(res, ["POST"]);
    return;
  }

  try {
    const body = await readJson(req);
    const displayName = cleanName(body.displayName);
    const pin = assertPin(body.pin);
    if (displayName.length < 2 || !pin) {
      sendJson(res, 400, {
        error: "Choose a display name and a 4+ character secret PIN."
      });
      return;
    }

    const reefCode = await createUniqueCode();
    const salt = crypto.randomBytes(16).toString("hex");
    const now = new Date().toISOString();
    const profile = {
      reefCode,
      displayName,
      pinSalt: salt,
      pinHash: hashPin(pin, salt),
      createdAt: now,
      updatedAt: now,
      save: defaultSave()
    };

    const saved = await upsertProfile(profile);
    sendJson(res, 201, {
      token: createSessionToken(saved.reefCode),
      profile: publicProfile(saved)
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
