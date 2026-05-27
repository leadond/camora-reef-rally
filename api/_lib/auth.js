import crypto from "node:crypto";

const tokenTtlMs = 1000 * 60 * 60 * 24 * 14;

export function cleanName(name) {
  return String(name || "")
    .replace(/[^\w .'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
}

export function cleanCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

export function assertPin(pin) {
  const value = String(pin || "").trim();
  return /^[0-9A-Za-z!@#$%*?_-]{4,20}$/.test(value) ? value : null;
}

export function hashPin(pin, salt) {
  return crypto
    .pbkdf2Sync(pin, salt, 120_000, 32, "sha256")
    .toString("hex");
}

export function createCodeCandidate() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CR";
  const bytes = crypto.randomBytes(6);
  for (const byte of bytes) {
    code += alphabet[byte % alphabet.length];
  }
  return code;
}

export function makeCode(isTaken) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const code = createCodeCandidate();
    if (!isTaken(code)) return code;
  }
  throw new Error("Could not create a unique Reef Code.");
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET || process.env.AUTH_SECRET || "";
  if (secret) {
    return secret;
  }
  if (process.env.VERCEL) {
    throw new Error("SESSION_SECRET is not configured.");
  }
  return "local-dev-session-secret";
}

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

function sign(data) {
  return crypto.createHmac("sha256", getSessionSecret()).update(data).digest("base64url");
}

export function createSessionToken(reefCode) {
  const payload = {
    reefCode: cleanCode(reefCode),
    exp: Date.now() + tokenTtlMs,
    v: 1
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionToken(token, reefCode) {
  const raw = String(token || "").trim();
  const parts = raw.split(".");
  if (parts.length !== 2) {
    return false;
  }
  const [body, signature] = parts;
  const expected = sign(body);
  if (!safeEqual(signature, expected)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload || payload.v !== 1) {
      return false;
    }
    if (!payload.exp || payload.exp < Date.now()) {
      return false;
    }
    return cleanCode(payload.reefCode) === cleanCode(reefCode);
  } catch {
    return false;
  }
}
