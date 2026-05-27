import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";
import { safeSave } from "./save.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(repoRoot, "data");
const dbPath = path.join(dataDir, "profiles.json");

const hasPostgres = Boolean(
  process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL
);
const postgresUrl =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";
const sql = hasPostgres ? neon(postgresUrl) : null;

let schemaPromise = null;

function mode() {
  if (hasPostgres) return "postgres";
  if (process.env.VERCEL) return "missing";
  return "file";
}

function ensureConfigured() {
  if (mode() === "missing") {
    throw new Error(
      "Persistent storage is not configured. Add a Postgres integration in Vercel and set POSTGRES_URL."
    );
  }
}

function normalizeProfile(profile) {
  return {
    reefCode: String(profile.reefCode || ""),
    displayName: String(profile.displayName || "").slice(0, 24),
    pinSalt: String(profile.pinSalt || ""),
    pinHash: String(profile.pinHash || ""),
    createdAt: profile.createdAt || new Date().toISOString(),
    updatedAt: profile.updatedAt || new Date().toISOString(),
    save: safeSave(profile.save)
  };
}

async function ensureSchema() {
  if (mode() !== "postgres") return;
  if (!schemaPromise) {
    schemaPromise = sql`
      CREATE TABLE IF NOT EXISTS camora_profiles (
        reef_code TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        pin_salt TEXT NOT NULL,
        pin_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        save_json JSONB NOT NULL
      )
    `;
  }
  await schemaPromise;
}

async function ensureFileDb() {
  await mkdir(dataDir, { recursive: true });
  try {
    await stat(dbPath);
  } catch {
    await writeFile(dbPath, JSON.stringify({ profiles: {} }, null, 2));
  }
}

async function readFileDb() {
  await ensureFileDb();
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

async function writeFileDb(db) {
  await ensureFileDb();
  const tmp = `${dbPath}.tmp`;
  await writeFile(tmp, JSON.stringify(db, null, 2));
  await rename(tmp, dbPath);
}

function rowToProfile(row) {
  return normalizeProfile({
    reefCode: row.reef_code,
    displayName: row.display_name,
    pinSalt: row.pin_salt,
    pinHash: row.pin_hash,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || ""),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at || ""),
    save: row.save_json
  });
}

export async function isCodeTaken(reefCode) {
  ensureConfigured();
  if (mode() === "postgres") {
    await ensureSchema();
    const rows = await sql`
      SELECT 1 FROM camora_profiles WHERE reef_code = ${reefCode} LIMIT 1
    `;
    return rows.length > 0;
  }

  const db = await readFileDb();
  return Boolean(db.profiles[reefCode]);
}

export async function getProfile(reefCode) {
  ensureConfigured();
  if (mode() === "postgres") {
    await ensureSchema();
    const rows = await sql`
      SELECT reef_code, display_name, pin_salt, pin_hash, created_at, updated_at, save_json
      FROM camora_profiles
      WHERE reef_code = ${reefCode}
      LIMIT 1
    `;
    return rows.length ? rowToProfile(rows[0]) : null;
  }

  const db = await readFileDb();
  const profile = db.profiles[reefCode];
  return profile ? normalizeProfile(profile) : null;
}

export async function upsertProfile(profile) {
  ensureConfigured();
  const normalized = normalizeProfile(profile);
  if (mode() === "postgres") {
    await ensureSchema();
    await sql`
      INSERT INTO camora_profiles (
        reef_code,
        display_name,
        pin_salt,
        pin_hash,
        created_at,
        updated_at,
        save_json
      )
      VALUES (
        ${normalized.reefCode},
        ${normalized.displayName},
        ${normalized.pinSalt},
        ${normalized.pinHash},
        ${normalized.createdAt},
        ${normalized.updatedAt},
        ${JSON.stringify(normalized.save)}::jsonb
      )
      ON CONFLICT (reef_code) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        pin_salt = EXCLUDED.pin_salt,
        pin_hash = EXCLUDED.pin_hash,
        created_at = EXCLUDED.created_at,
        updated_at = EXCLUDED.updated_at,
        save_json = EXCLUDED.save_json
    `;
    return normalized;
  }

  const db = await readFileDb();
  db.profiles[normalized.reefCode] = normalized;
  await writeFileDb(db);
  return normalized;
}

export async function listLeaderboard(limit = 12) {
  ensureConfigured();
  const top = Math.max(1, Math.min(50, Number(limit) || 12));
  if (mode() === "postgres") {
    await ensureSchema();
    const rows = await sql`
      SELECT
        display_name,
        reef_code,
        COALESCE((save_json->>'highScore')::INT, 0) AS high_score,
        COALESCE((save_json->>'animalsRescued')::INT, 0) AS animals_rescued,
        COALESCE(jsonb_array_length(COALESCE(save_json->'badges', '[]'::jsonb)), 0) AS badges_count
      FROM camora_profiles
      ORDER BY
        COALESCE((save_json->>'highScore')::INT, 0) DESC,
        COALESCE((save_json->>'animalsRescued')::INT, 0) DESC
      LIMIT ${top}
    `;
    return rows.map(row => ({
      displayName: row.display_name,
      reefCode: `${String(row.reef_code).slice(0, 4)}...`,
      highScore: Number(row.high_score) || 0,
      animalsRescued: Number(row.animals_rescued) || 0,
      badges: Number(row.badges_count) || 0
    }));
  }

  const db = await readFileDb();
  return Object.values(db.profiles)
    .map(profile => ({
      displayName: profile.displayName,
      reefCode: `${profile.reefCode.slice(0, 4)}...`,
      highScore: profile.save?.highScore || 0,
      animalsRescued: profile.save?.animalsRescued || 0,
      badges: profile.save?.badges?.length || 0
    }))
    .sort((a, b) => b.highScore - a.highScore || b.animalsRescued - a.animalsRescued)
    .slice(0, top);
}
