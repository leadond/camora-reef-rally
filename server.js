import http from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "data");
const dbPath = path.join(dataDir, "profiles.json");
const port = Number(process.env.PORT || 4177);

const sessions = new Map();
const maxBodyBytes = 800_000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const defaultSave = () => ({
  level: 1,
  xp: 0,
  highScore: 0,
  bestCombo: 0,
  totalSparkles: 0,
  starShards: 0,
  pearlCrowns: 0,
  coralGems: 0,
  pompomStash: 0,
  gamesPlayed: 0,
  perfectCheers: 0,
  animalsRescued: 0,
  unlockedAnimals: ["Kai the Turtle"],
  seaAnimalCards: [],
  stickerBook: [],
  badges: [],
  labFacts: [],
  lastPlayedAt: null,
  missions: {
    shellSprint: 0,
    cheerChain: 0,
    animalAlly: 0,
    cleanReef: 0,
    treasureTrail: 0
  },
  settings: {
    reducedMotion: false,
    sound: true
  }
});

async function ensureDb() {
  await mkdir(dataDir, { recursive: true });
  try {
    await stat(dbPath);
  } catch {
    await writeFile(dbPath, JSON.stringify({ profiles: {} }, null, 2));
  }
}

async function readDb() {
  await ensureDb();
  const raw = await readFile(dbPath, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.profiles || typeof parsed.profiles !== "object") {
      return { profiles: {} };
    }
    return parsed;
  } catch {
    return { profiles: {} };
  }
}

async function writeDb(db) {
  await ensureDb();
  const tmp = `${dbPath}.tmp`;
  await writeFile(tmp, JSON.stringify(db, null, 2));
  await rename(tmp, dbPath);
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(body);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", chunk => {
      size += chunk.length;
      if (size > maxBodyBytes) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function cleanName(name) {
  return String(name || "")
    .replace(/[^\w .'-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
}

function cleanCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 10);
}

function assertPin(pin) {
  const value = String(pin || "").trim();
  return /^[0-9A-Za-z!@#$%*?_-]{4,20}$/.test(value) ? value : null;
}

function hashPin(pin, salt) {
  return crypto
    .pbkdf2Sync(pin, salt, 120_000, 32, "sha256")
    .toString("hex");
}

function makeCode(existingProfiles) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 100; attempt += 1) {
    let code = "CR";
    const bytes = crypto.randomBytes(6);
    for (const byte of bytes) {
      code += alphabet[byte % alphabet.length];
    }
    if (!existingProfiles[code]) return code;
  }
  throw new Error("Could not create a unique Reef Code.");
}

function makeToken(code) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, {
    code,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24
  });
  return token;
}

function requireSession(body) {
  const token = String(body?.token || "");
  const code = cleanCode(body?.reefCode);
  const session = sessions.get(token);
  if (!session || session.code !== code || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return false;
  }
  session.expiresAt = Date.now() + 1000 * 60 * 60 * 24;
  return true;
}

function safeSave(save) {
  const base = defaultSave();
  const incoming = save && typeof save === "object" ? save : {};
  const number = (value, fallback = 0, max = 99_999_999) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, Math.min(max, Math.floor(parsed)));
  };
  const stringArray = (value, fallback = [], max = 40) => {
    if (!Array.isArray(value)) return fallback;
    return value
      .map(item => String(item || "").replace(/[^\w .'-]/g, "").trim())
      .filter(Boolean)
      .slice(0, max);
  };

  return {
    level: number(incoming.level, 1, 999),
    xp: number(incoming.xp, 0, 999_999),
    highScore: number(incoming.highScore),
    bestCombo: number(incoming.bestCombo, 0, 9999),
    totalSparkles: number(incoming.totalSparkles),
    starShards: number(incoming.starShards),
    pearlCrowns: number(incoming.pearlCrowns),
    coralGems: number(incoming.coralGems),
    pompomStash: number(incoming.pompomStash),
    gamesPlayed: number(incoming.gamesPlayed, 0, 999_999),
    perfectCheers: number(incoming.perfectCheers),
    animalsRescued: number(incoming.animalsRescued),
    unlockedAnimals: stringArray(incoming.unlockedAnimals, base.unlockedAnimals),
    seaAnimalCards: stringArray(incoming.seaAnimalCards, [], 120),
    stickerBook: stringArray(incoming.stickerBook, [], 120),
    badges: stringArray(incoming.badges, []),
    labFacts: stringArray(incoming.labFacts, []),
    lastPlayedAt: typeof incoming.lastPlayedAt === "string" ? incoming.lastPlayedAt.slice(0, 40) : null,
    missions: {
      shellSprint: number(incoming.missions?.shellSprint),
      cheerChain: number(incoming.missions?.cheerChain),
      animalAlly: number(incoming.missions?.animalAlly),
      cleanReef: number(incoming.missions?.cleanReef),
      treasureTrail: number(incoming.missions?.treasureTrail)
    },
    settings: {
      reducedMotion: Boolean(incoming.settings?.reducedMotion),
      sound: incoming.settings?.sound !== false
    }
  };
}

function publicProfile(profile) {
  return {
    reefCode: profile.reefCode,
    displayName: profile.displayName,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    save: profile.save
  };
}

async function handleCreate(req, res) {
  const body = await readRequestBody(req);
  const displayName = cleanName(body.displayName);
  const pin = assertPin(body.pin);
  if (displayName.length < 2 || !pin) {
    sendJson(res, 400, {
      error: "Choose a display name and a 4+ character secret PIN."
    });
    return;
  }

  const db = await readDb();
  const reefCode = makeCode(db.profiles);
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
  db.profiles[reefCode] = profile;
  await writeDb(db);
  sendJson(res, 201, {
    token: makeToken(reefCode),
    profile: publicProfile(profile)
  });
}

async function handleLogin(req, res) {
  const body = await readRequestBody(req);
  const reefCode = cleanCode(body.reefCode);
  const pin = String(body.pin || "").trim();
  const db = await readDb();
  const profile = db.profiles[reefCode];
  if (!profile || hashPin(pin, profile.pinSalt) !== profile.pinHash) {
    sendJson(res, 401, {
      error: "That Reef Code and PIN did not match."
    });
    return;
  }
  sendJson(res, 200, {
    token: makeToken(reefCode),
    profile: publicProfile(profile)
  });
}

async function handleSave(req, res) {
  const body = await readRequestBody(req);
  if (!requireSession(body)) {
    sendJson(res, 401, { error: "Please sign in again to sync progress." });
    return;
  }
  const reefCode = cleanCode(body.reefCode);
  const db = await readDb();
  const profile = db.profiles[reefCode];
  if (!profile) {
    sendJson(res, 404, { error: "Profile not found." });
    return;
  }
  profile.save = safeSave(body.save);
  profile.updatedAt = new Date().toISOString();
  await writeDb(db);
  sendJson(res, 200, { profile: publicProfile(profile) });
}

async function handleProfile(req, res, url) {
  const reefCode = cleanCode(url.searchParams.get("reefCode"));
  const db = await readDb();
  const profile = db.profiles[reefCode];
  if (!profile) {
    sendJson(res, 404, { error: "Profile not found." });
    return;
  }
  sendJson(res, 200, { profile: publicProfile(profile) });
}

async function handleLeaderboard(_req, res) {
  const db = await readDb();
  const scores = Object.values(db.profiles)
    .map(profile => ({
      displayName: profile.displayName,
      reefCode: `${profile.reefCode.slice(0, 4)}...`,
      highScore: profile.save?.highScore || 0,
      animalsRescued: profile.save?.animalsRescued || 0,
      badges: profile.save?.badges?.length || 0
    }))
    .sort((a, b) => b.highScore - a.highScore || b.animalsRescued - a.animalsRescued)
    .slice(0, 12);
  sendJson(res, 200, { scores });
}

async function serveStatic(req, res, url) {
  const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(publicDir, normalized);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const file = await stat(filePath);
    if (file.isDirectory()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": mimeTypes[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "no-store" : "public, max-age=300"
    });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (req.method === "POST" && url.pathname === "/api/create") {
      await handleCreate(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/login") {
      await handleLogin(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/save") {
      await handleSave(req, res);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/profile") {
      await handleProfile(req, res, url);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/leaderboard") {
      await handleLeaderboard(req, res);
      return;
    }
    if (req.method === "GET" || req.method === "HEAD") {
      await serveStatic(req, res, url);
      return;
    }
    sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error." });
  }
});

await ensureDb();
server.listen(port, "127.0.0.1", () => {
  console.log(`Camora's Reef Rally is running at http://127.0.0.1:${port}`);
});
