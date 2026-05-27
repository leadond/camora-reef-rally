const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const els = {
  authModal: document.querySelector("#authModal"),
  authMessage: document.querySelector("#authMessage"),
  createTab: document.querySelector("#createTab"),
  loginTab: document.querySelector("#loginTab"),
  createForm: document.querySelector("#createForm"),
  loginForm: document.querySelector("#loginForm"),
  createName: document.querySelector("#createName"),
  createPin: document.querySelector("#createPin"),
  loginCode: document.querySelector("#loginCode"),
  loginPin: document.querySelector("#loginPin"),
  playerName: document.querySelector("#playerName"),
  reefCode: document.querySelector("#reefCode"),
  audioSettingsBtn: document.querySelector("#audioSettingsBtn"),
  howToPlayBtn: document.querySelector("#howToPlayBtn"),
  saveNowBtn: document.querySelector("#saveNowBtn"),
  signOutBtn: document.querySelector("#signOutBtn"),
  scoreText: document.querySelector("#scoreText"),
  comboText: document.querySelector("#comboText"),
  spiritText: document.querySelector("#spiritText"),
  bestText: document.querySelector("#bestText"),
  levelText: document.querySelector("#levelText"),
  levelNow: document.querySelector("#levelNow"),
  xpMeter: document.querySelector("#xpMeter"),
  xpCopy: document.querySelector("#xpCopy"),
  chapterMap: document.querySelector("#chapterMap"),
  chapterStatus: document.querySelector("#chapterStatus"),
  missionList: document.querySelector("#missionList"),
  dailyStreak: document.querySelector("#dailyStreak"),
  dailyChallengeList: document.querySelector("#dailyChallengeList"),
  animalGrid: document.querySelector("#animalGrid"),
  collectibleGrid: document.querySelector("#collectibleGrid"),
  uniformSelect: document.querySelector("#uniformSelect"),
  pomSelect: document.querySelector("#pomSelect"),
  trailSelect: document.querySelector("#trailSelect"),
  badgeList: document.querySelector("#badgeList"),
  leaderboard: document.querySelector("#leaderboard"),
  pauseOverlay: document.querySelector("#pauseOverlay"),
  overlayTitle: document.querySelector("#overlayTitle"),
  overlayCopy: document.querySelector("#overlayCopy"),
  playBtn: document.querySelector("#playBtn"),
  practiceBtn: document.querySelector("#practiceBtn"),
  stopRunBtn: document.querySelector("#stopRunBtn"),
  levelBanner: document.querySelector("#levelBanner"),
  levelBannerTitle: document.querySelector("#levelBannerTitle"),
  levelBannerCopy: document.querySelector("#levelBannerCopy"),
  leftBtn: document.querySelector("#leftBtn"),
  rightBtn: document.querySelector("#rightBtn"),
  cheerBtn: document.querySelector("#cheerBtn"),
  helpModal: document.querySelector("#helpModal"),
  closeHelpBtn: document.querySelector("#closeHelpBtn"),
  audioModal: document.querySelector("#audioModal"),
  closeAudioBtn: document.querySelector("#closeAudioBtn"),
  sfxToggle: document.querySelector("#sfxToggle"),
  sfxVolume: document.querySelector("#sfxVolume"),
  sfxVolumeValue: document.querySelector("#sfxVolumeValue"),
  musicToggle: document.querySelector("#musicToggle"),
  musicVolume: document.querySelector("#musicVolume"),
  musicVolumeValue: document.querySelector("#musicVolumeValue"),
  reducedMotionToggle: document.querySelector("#reducedMotionToggle"),
  toast: document.querySelector("#toast")
};

const animalRoster = [
  { name: "Kai the Turtle", icon: "T", color: "#4ce3a0", fact: "Sea turtles can sense Earth's magnetic field." },
  { name: "Nova the Dolphin", icon: "D", color: "#38c8ff", fact: "Dolphins use clicks and whistles to explore." },
  { name: "Zuri the Octopus", icon: "O", color: "#ff7d64", fact: "Octopuses can solve puzzles and open jars." },
  { name: "Mimi the Manta", icon: "M", color: "#b556f1", fact: "Manta rays can recognize themselves in mirrors." },
  { name: "Sunny the Seahorse", icon: "S", color: "#ffd34f", fact: "Seahorses hold onto grass with curled tails." },
  { name: "Glimmer the Jelly", icon: "J", color: "#ff64a6", fact: "Some jellyfish glow through bioluminescence." }
];

const collectibleMeta = [
  { id: "starShards", label: "Star Shards", marker: "SS", color: "#ffd34f" },
  { id: "pearlCrowns", label: "Pearl Crowns", marker: "PC", color: "#f7f8ff" },
  { id: "coralGems", label: "Coral Gems", marker: "CG", color: "#ff6f8a" },
  { id: "pompomStash", label: "Pom Poms", marker: "PP", color: "#ff9ab5" },
  { id: "seaAnimalCards", label: "Sea Cards", marker: "SC", color: "#64d8ff" },
  { id: "stickerBook", label: "Sticker Cards", marker: "ST", color: "#7f8bff" }
];

const stickerPool = [
  "Wave Captain",
  "Cheer Spark",
  "Coral Boss",
  "Reef Scientist",
  "Ocean Glow",
  "Spirit Splash",
  "Turbo Tides",
  "Smart Current",
  "Bright Rescue",
  "Shimmer Squad"
];

const badgeRules = [
  { id: "Sparkle Starter", test: save => save.totalSparkles >= 250 },
  { id: "Pom-Pom Tide", test: save => save.perfectCheers >= 25 },
  { id: "Cheer Collector", test: save => save.pompomStash >= 30 },
  { id: "Reef Rescuer", test: save => save.animalsRescued >= 20 },
  { id: "Treasure Hunter", test: save => save.starShards + save.pearlCrowns + save.coralGems >= 120 },
  { id: "Sea Card Deck", test: save => save.seaAnimalCards.length >= animalRoster.length },
  { id: "Sticker Queen", test: save => save.stickerBook.length >= 6 },
  { id: "Brainy Current", test: save => save.labFacts.length >= 4 },
  { id: "Daily Wave", test: save => (save.daily?.streak || 0) >= 3 },
  { id: "Level Legend", test: save => save.level >= 5 },
  { id: "Ocean Legend", test: save => save.highScore >= 5000 }
];

const missionMeta = [
  { id: "shellSprint", label: "Sparkle Shells", goal: 500 },
  { id: "cheerChain", label: "Perfect Cheers", goal: 30 },
  { id: "animalAlly", label: "Animal Rescues", goal: 20 },
  { id: "cleanReef", label: "Clean Reef Saves", goal: 25 },
  { id: "treasureTrail", label: "Treasure Vault", goal: 60 }
];

const chapterMeta = [
  { id: "Coral Cove", start: 1, end: 3, color: "#ff7d64", copy: "Warm-up waters with quick sparkle lanes." },
  { id: "Dolphin Dash", start: 4, end: 6, color: "#38c8ff", copy: "Faster lanes and bouncy rhythm notes." },
  { id: "Starlight Kelp", start: 7, end: 9, color: "#7f8bff", copy: "Treasure-heavy tides and bigger distractions." },
  { id: "Crystal Trench", start: 10, end: 12, color: "#4ce3a0", copy: "Long runs with giant sea encounters." },
  { id: "Aurora Abyss", start: 13, end: 16, color: "#b556f1", copy: "Elite chapters for true reef legends." }
];

const uniformThemes = {
  sunrise: { top: "#ff5e70", bottom: "#ffd34f", stripe: "#ffffff", accent: "#264a85" },
  reef: { top: "#20b26b", bottom: "#45e1c5", stripe: "#ffffff", accent: "#0f5d7c" },
  royal: { top: "#7a78ff", bottom: "#c46ef7", stripe: "#ffe766", accent: "#233f7f" }
};

const pomThemes = {
  classic: ["#ffffff", "#ffd34f", "#ff5e70", "#4ce3a0"],
  ocean: ["#ffffff", "#8be8ff", "#64d8ff", "#336dd9"],
  sunset: ["#fff2ca", "#ff9ab5", "#ff7d64", "#ffd34f"]
};

const trailThemes = {
  sparkle: ["#ffd34f", "#64d8ff"],
  starlight: ["#f7f8ff", "#7f8bff", "#9be7ff"],
  coral: ["#ff9ab5", "#ff6f8a", "#ffe06b"]
};

const dailyChallengePool = [
  { id: "sparkle_sprint", metric: "sparkles", goal: 260, label: "Gather 260 Sparkles" },
  { id: "perfect_beats", metric: "perfect_cheer", goal: 10, label: "Hit 10 Perfect Cheers" },
  { id: "rescue_rush", metric: "rescues", goal: 6, label: "Rescue 6 Sea Animals" },
  { id: "pompom_pop", metric: "pompoms", goal: 5, label: "Collect 5 Pom Poms" },
  { id: "treasure_dive", metric: "treasures", goal: 10, label: "Find 10 Treasure Items" },
  { id: "combo_builder", metric: "combo_peak", goal: 14, label: "Reach a 14x Combo", peak: true }
];

const dailyChallengeLookup = Object.fromEntries(dailyChallengePool.map(challenge => [challenge.id, challenge]));

const musicPattern = [
  { freq: 392, type: "triangle", gain: 0.27, duration: 0.24 },
  { freq: 440, type: "triangle", gain: 0.24, duration: 0.24 },
  { freq: 523.25, type: "triangle", gain: 0.26, duration: 0.3 },
  { rest: true },
  { freq: 523.25, type: "triangle", gain: 0.27, duration: 0.22 },
  { freq: 587.33, type: "triangle", gain: 0.24, duration: 0.22 },
  { freq: 659.25, type: "triangle", gain: 0.25, duration: 0.3 },
  { rest: true },
  { freq: 659.25, type: "sine", gain: 0.18, duration: 0.22 },
  { freq: 587.33, type: "sine", gain: 0.16, duration: 0.22 },
  { freq: 523.25, type: "sine", gain: 0.19, duration: 0.28 },
  { rest: true }
];

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
  daily: {
    dateKey: null,
    streak: 0,
    completedToday: false,
    lastCompletedDate: null,
    activeChallenges: [],
    progress: {}
  },
  customization: {
    uniformTheme: "sunrise",
    pomTheme: "classic",
    trailTheme: "sparkle"
  },
  settings: {
    reducedMotion: false,
    sound: true,
    sfxEnabled: true,
    musicEnabled: true,
    sfxVolume: 70,
    musicVolume: 55
  }
});

const state = {
  token: null,
  profile: null,
  save: defaultSave(),
  playing: false,
  practice: false,
  gameOver: false,
  score: 0,
  combo: 0,
  spirit: 3,
  lane: 1,
  laneX: [0, 0, 0],
  targetX: 0,
  camoraX: 0,
  camoraY: 0,
  time: 0,
  lastFrame: performance.now(),
  spawnTimer: 0,
  noteTimer: 0,
  speed: 270,
  tideLevel: 1,
  items: [],
  distractions: [],
  trail: [],
  particles: [],
  floaters: [],
  ambientEncounters: [],
  encounterTimer: 0,
  distractionTimer: 0,
  trailTimer: 0,
  cheerPulse: 0,
  levelPulse: 0,
  levelBannerTimer: 0,
  screenShake: 0,
  helpOpen: false,
  audioOpen: false,
  pendingSave: false,
  audioContext: null,
  sfxGain: null,
  musicGain: null,
  masterGain: null,
  musicLoopTimer: null,
  nextMusicNoteAt: 0,
  musicStep: 0,
  dailyCompletionAnnouncedFor: null,
  camoraFace: null,
  camoraFaceLoaded: false
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function xpForLevel(level) {
  return 220 + Math.max(0, level - 1) * 140;
}

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDate(key) {
  if (typeof key !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const stamp = Date.parse(`${key}T00:00:00`);
  if (!Number.isFinite(stamp)) return null;
  return new Date(stamp);
}

function dayGap(fromKey, toKey) {
  const from = toDate(fromKey);
  const to = toDate(toKey);
  if (!from || !to) return null;
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

function hashSeed(value) {
  let hash = 2166136261;
  const text = String(value || "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function chapterIndexForLevel(level) {
  for (let index = 0; index < chapterMeta.length; index += 1) {
    const chapter = chapterMeta[index];
    if (level >= chapter.start && level <= chapter.end) return index;
  }
  return chapterMeta.length - 1;
}

function chapterForLevel(level) {
  return chapterMeta[chapterIndexForLevel(level)];
}

function challengeListForDate(dayKey) {
  const picks = [];
  const used = new Set();
  let seed = hashSeed(dayKey);
  while (picks.length < 3 && used.size < dailyChallengePool.length) {
    const index = seed % dailyChallengePool.length;
    const challenge = dailyChallengePool[index];
    if (challenge && !used.has(challenge.id)) {
      picks.push(challenge.id);
      used.add(challenge.id);
    }
    seed = Math.imul(seed ^ 2246822519, 3266489917) >>> 0;
  }
  return picks.length ? picks : dailyChallengePool.slice(0, 3).map(challenge => challenge.id);
}

function ensureDailyChallenges() {
  const today = dateKey();
  const daily = state.save.daily;
  if (!daily.dateKey || daily.dateKey !== today) {
    daily.dateKey = today;
    daily.completedToday = false;
    daily.activeChallenges = challengeListForDate(today);
    daily.progress = {};
    for (const challengeId of daily.activeChallenges) {
      daily.progress[challengeId] = 0;
    }
    state.dailyCompletionAnnouncedFor = null;
  }
  if (!Array.isArray(daily.activeChallenges) || !daily.activeChallenges.length) {
    daily.activeChallenges = challengeListForDate(today);
  }
  if (!daily.progress || typeof daily.progress !== "object") {
    daily.progress = {};
  }
  for (const challengeId of daily.activeChallenges) {
    const challenge = dailyChallengeLookup[challengeId];
    if (!challenge) continue;
    const current = Number(daily.progress[challengeId]);
    daily.progress[challengeId] = Number.isFinite(current) ? clamp(Math.floor(current), 0, challenge.goal) : 0;
  }
}

function checkDailyCompletion(announce = true) {
  ensureDailyChallenges();
  const daily = state.save.daily;
  if (daily.completedToday) return false;
  const done = daily.activeChallenges.every(challengeId => {
    const challenge = dailyChallengeLookup[challengeId];
    if (!challenge) return false;
    return (daily.progress[challengeId] || 0) >= challenge.goal;
  });
  if (!done) return false;
  daily.completedToday = true;
  const today = daily.dateKey || dateKey();
  const gap = dayGap(daily.lastCompletedDate, today);
  daily.streak = gap === 1 ? daily.streak + 1 : 1;
  daily.lastCompletedDate = today;
  const shardReward = 8 + daily.streak * 2;
  state.save.starShards += shardReward;
  if (daily.streak >= 3) state.save.pompomStash += 1;
  if (announce && state.dailyCompletionAnnouncedFor !== today) {
    const bonus = daily.streak >= 3 ? " +1 Pom Pom bonus!" : "";
    toast(`Daily quests complete! +${shardReward} Star Shards.${bonus}`);
    burst(state.camoraX || canvas.clientWidth * 0.5, (state.camoraY || canvas.clientHeight * 0.76) - 80, "#ffe766", 32);
    state.dailyCompletionAnnouncedFor = today;
  }
  return true;
}

function updateDailyChallenge(metric, amount = 1, mode = "add") {
  if (state.practice) return;
  ensureDailyChallenges();
  const daily = state.save.daily;
  if (daily.completedToday) return;
  let changed = false;
  for (const challengeId of daily.activeChallenges) {
    const challenge = dailyChallengeLookup[challengeId];
    if (!challenge || challenge.metric !== metric) continue;
    const current = daily.progress[challengeId] || 0;
    const next =
      mode === "peak" ? Math.max(current, amount) : clamp(current + amount, 0, challenge.goal);
    if (next !== current) {
      daily.progress[challengeId] = clamp(next, 0, challenge.goal);
      changed = true;
    }
  }
  if (!changed) return;
  const completed = checkDailyCompletion(true);
  if (completed) {
    checkBadges();
    renderCollectibles();
    renderBadges();
  }
  renderDailyChallenges();
  storeSession();
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => els.toast.classList.remove("show"), 2800);
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const w = rect.width;
  const h = rect.height;
  state.laneX = [w * 0.23, w * 0.5, w * 0.77];
  state.camoraY = h * 0.79;
  if (!state.camoraX) state.camoraX = state.laneX[state.lane];
  state.targetX = state.laneX[state.lane];
}

function setupFloaters() {
  state.floaters = Array.from({ length: 40 }, () => ({
    x: rand(0, canvas.clientWidth || 800),
    y: rand(0, canvas.clientHeight || 700),
    r: rand(1.5, 6),
    speed: rand(8, 32),
    alpha: rand(0.16, 0.5)
  }));
}

function createAmbientEncounter(level = state.save.level || 1) {
  const w = canvas.clientWidth || 960;
  const h = canvas.clientHeight || 700;
  const direction = Math.random() < 0.5 ? 1 : -1;
  const animal = pick(animalRoster);
  const layer = rand(0, 1);
  const bigChance = clamp((level - 4) * 0.035, 0, 0.42);
  const giantBoost = Math.random() < bigChance ? rand(1.35, 2.05) : 1;
  const size = rand(24, 54) * (0.85 + layer * 0.65) * giantBoost;
  const schoolCount = Math.random() < 0.42 ? Math.floor(rand(3, 8)) : 1;
  const speed = rand(18, 48) + layer * 20 + level * 0.95;
  const x = direction > 0 ? -size - rand(30, 240) : w + size + rand(30, 240);
  const y = rand(h * 0.14, h * 0.68);
  return {
    animal,
    direction,
    x,
    y,
    size,
    schoolCount,
    speed,
    alpha: clamp(0.13 + layer * 0.28, 0.12, 0.42),
    phase: rand(0, Math.PI * 2),
    layer
  };
}

function setupAmbientEncounters() {
  const target = 9;
  state.ambientEncounters = [];
  for (let i = 0; i < target; i += 1) {
    state.ambientEncounters.push(createAmbientEncounter(Math.max(1, state.save.level)));
  }
  state.encounterTimer = rand(2.8, 5.4);
}

function updateAmbientEncounters(dt, w, h) {
  if (!state.ambientEncounters.length) {
    setupAmbientEncounters();
  }

  state.encounterTimer -= dt;
  if (state.encounterTimer <= 0) {
    state.ambientEncounters.push(createAmbientEncounter(Math.max(1, state.save.level)));
    const cooldown = clamp(5.6 - state.save.level * 0.22, 2.1, 5.6);
    state.encounterTimer = rand(cooldown * 0.8, cooldown * 1.2);
  }

  for (const encounter of state.ambientEncounters) {
    encounter.x += encounter.speed * dt * encounter.direction;
    encounter.y += Math.sin(state.time * 0.9 + encounter.phase) * dt * (8 + encounter.layer * 9);
    if (encounter.y < h * 0.1) encounter.y = h * 0.1;
    if (encounter.y > h * 0.72) encounter.y = h * 0.72;
    if (
      (encounter.direction > 0 && encounter.x - encounter.size * 2 > w + 180) ||
      (encounter.direction < 0 && encounter.x + encounter.size * 2 < -180)
    ) {
      encounter.dead = true;
    }
  }

  state.ambientEncounters = state.ambientEncounters.filter(encounter => !encounter.dead);
  while (state.ambientEncounters.length < 7) {
    state.ambientEncounters.push(createAmbientEncounter(Math.max(1, state.save.level)));
  }
}

function activeUniformTheme() {
  return uniformThemes[state.save.customization.uniformTheme] || uniformThemes.sunrise;
}

function activePomPalette() {
  return pomThemes[state.save.customization.pomTheme] || pomThemes.classic;
}

function activeTrailPalette() {
  return trailThemes[state.save.customization.trailTheme] || trailThemes.sparkle;
}

function updateTrail(dt) {
  state.trailTimer += dt;
  const trailRate = state.save.settings.reducedMotion ? 0.07 : 0.03;
  if (state.playing && state.trailTimer >= trailRate) {
    const palette = activeTrailPalette();
    state.trailTimer = 0;
    state.trail.push({
      x: state.camoraX + rand(-5, 5),
      y: state.camoraY + 12 + rand(-2, 3),
      r: state.save.settings.reducedMotion ? rand(6, 10) : rand(8, 14),
      life: state.save.settings.reducedMotion ? 0.4 : 0.55,
      hue: pick(palette)
    });
  }
  for (const trail of state.trail) {
    trail.life -= dt;
    trail.y += 24 * dt;
  }
  state.trail = state.trail.filter(trail => trail.life > 0);
}

function loadCamoraFace() {
  const image = new Image();
  image.decoding = "async";
  image.src = "/assets/camora.png";
  image.onload = () => {
    state.camoraFaceLoaded = true;
  };
  image.onerror = () => {
    state.camoraFaceLoaded = false;
  };
  state.camoraFace = image;
}

function mergeSave(save) {
  const base = defaultSave();
  const settingsRaw = { ...base.settings, ...(save?.settings || {}) };
  const customRaw = save?.customization && typeof save.customization === "object" ? save.customization : {};
  const dailyRaw = save?.daily && typeof save.daily === "object" ? save.daily : {};
  const clampPercent = (value, fallback) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return clamp(Math.round(parsed), 0, 100);
  };
  const number = (value, fallback = 0, max = 99_999_999) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return clamp(Math.floor(parsed), 0, max);
  };
  const cleanDate = value => (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null);
  const pickChoice = (value, choices, fallback) => (choices.includes(value) ? value : fallback);
  const activeChallengesRaw = Array.isArray(dailyRaw.activeChallenges) ? dailyRaw.activeChallenges : [];
  const activeChallenges = activeChallengesRaw
    .map(item => String(item || ""))
    .filter(id => Boolean(dailyChallengeLookup[id]))
    .slice(0, 3);
  const progressRaw = dailyRaw.progress && typeof dailyRaw.progress === "object" ? dailyRaw.progress : {};
  const dailyProgress = {};
  for (const challengeId of activeChallenges) {
    const challenge = dailyChallengeLookup[challengeId];
    if (!challenge) continue;
    dailyProgress[challengeId] = clamp(number(progressRaw[challengeId], 0, challenge.goal), 0, challenge.goal);
  }
  const legacySoundOff = save?.settings?.sound === false;
  const sfxEnabled = settingsRaw.sfxEnabled !== undefined ? Boolean(settingsRaw.sfxEnabled) : !legacySoundOff;
  const musicEnabled = settingsRaw.musicEnabled !== undefined ? Boolean(settingsRaw.musicEnabled) : !legacySoundOff;
  const merged = {
    ...base,
    ...save,
    level: clamp(Number(save?.level || base.level), 1, 999),
    xp: clamp(Number(save?.xp || base.xp), 0, 999999),
    missions: { ...base.missions, ...(save?.missions || {}) },
    settings: {
      reducedMotion: Boolean(settingsRaw.reducedMotion),
      sound: settingsRaw.sound !== false && (sfxEnabled || musicEnabled),
      sfxEnabled,
      musicEnabled,
      sfxVolume: clampPercent(settingsRaw.sfxVolume, base.settings.sfxVolume),
      musicVolume: clampPercent(settingsRaw.musicVolume, base.settings.musicVolume)
    },
    daily: {
      dateKey: cleanDate(dailyRaw.dateKey),
      streak: number(dailyRaw.streak, 0, 999),
      completedToday: Boolean(dailyRaw.completedToday),
      lastCompletedDate: cleanDate(dailyRaw.lastCompletedDate),
      activeChallenges,
      progress: dailyProgress
    },
    customization: {
      uniformTheme: pickChoice(customRaw.uniformTheme, Object.keys(uniformThemes), base.customization.uniformTheme),
      pomTheme: pickChoice(customRaw.pomTheme, Object.keys(pomThemes), base.customization.pomTheme),
      trailTheme: pickChoice(customRaw.trailTheme, Object.keys(trailThemes), base.customization.trailTheme)
    },
    unlockedAnimals: Array.isArray(save?.unlockedAnimals) ? save.unlockedAnimals : base.unlockedAnimals,
    seaAnimalCards: Array.isArray(save?.seaAnimalCards) ? save.seaAnimalCards : [],
    stickerBook: Array.isArray(save?.stickerBook) ? save.stickerBook : [],
    badges: Array.isArray(save?.badges) ? save.badges : [],
    labFacts: Array.isArray(save?.labFacts) ? save.labFacts : []
  };
  return merged;
}

function clearSession() {
  localStorage.removeItem("camoraReefSession");
}

function volumePercentToGain(percent) {
  const normalized = clamp(Number(percent) || 0, 0, 100) / 100;
  return normalized * normalized;
}

function ensureAudioSystem() {
  try {
    if (!state.audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      const context = new AudioCtor();
      const masterGain = context.createGain();
      const sfxGain = context.createGain();
      const musicGain = context.createGain();
      sfxGain.connect(masterGain);
      musicGain.connect(masterGain);
      masterGain.connect(context.destination);
      state.audioContext = context;
      state.masterGain = masterGain;
      state.sfxGain = sfxGain;
      state.musicGain = musicGain;
    }
    if (state.audioContext.state === "suspended") {
      state.audioContext.resume().catch(() => {});
    }
    return state.audioContext;
  } catch {
    return null;
  }
}

function stopMusicLoop() {
  if (state.musicLoopTimer) {
    clearInterval(state.musicLoopTimer);
    state.musicLoopTimer = null;
  }
}

function queueMusicNote(context, at, step) {
  const note = musicPattern[step % musicPattern.length];
  if (!note || note.rest) return;
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = note.type || "triangle";
  osc.frequency.setValueAtTime(note.freq || 440, at);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, note.gain || 0.2), at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + (note.duration || 0.25));
  osc.connect(gain).connect(state.musicGain);
  osc.start(at);
  osc.stop(at + (note.duration || 0.25) + 0.02);
}

function scheduleMusicLookahead() {
  const context = state.audioContext;
  if (!context || !state.save.settings.musicEnabled || !state.musicGain) return;
  const horizon = context.currentTime + 0.8;
  while (state.nextMusicNoteAt < horizon) {
    queueMusicNote(context, state.nextMusicNoteAt, state.musicStep);
    state.musicStep = (state.musicStep + 1) % musicPattern.length;
    state.nextMusicNoteAt += 0.32;
  }
}

function startMusicLoop() {
  const context = ensureAudioSystem();
  if (!context || !state.save.settings.musicEnabled) return;
  if (state.musicLoopTimer) return;
  state.nextMusicNoteAt = context.currentTime + 0.05;
  state.musicStep = 0;
  scheduleMusicLookahead();
  state.musicLoopTimer = setInterval(scheduleMusicLookahead, 120);
}

function applyAudioMix() {
  const context = state.audioContext;
  if (!context || !state.sfxGain || !state.musicGain || !state.masterGain) return;
  const sfxGain = state.save.settings.sfxEnabled ? volumePercentToGain(state.save.settings.sfxVolume) : 0;
  const musicGain = state.save.settings.musicEnabled ? volumePercentToGain(state.save.settings.musicVolume) * 0.55 : 0;
  state.masterGain.gain.setTargetAtTime(1, context.currentTime, 0.03);
  state.sfxGain.gain.setTargetAtTime(sfxGain, context.currentTime, 0.03);
  state.musicGain.gain.setTargetAtTime(musicGain, context.currentTime, 0.06);
  if (state.save.settings.musicEnabled) startMusicLoop();
  else stopMusicLoop();
}

function renderAudioSettings() {
  const settings = state.save.settings;
  els.sfxToggle.checked = settings.sfxEnabled;
  els.musicToggle.checked = settings.musicEnabled;
  els.sfxVolume.value = String(settings.sfxVolume);
  els.musicVolume.value = String(settings.musicVolume);
  els.sfxVolumeValue.textContent = `${settings.sfxVolume}%`;
  els.musicVolumeValue.textContent = `${settings.musicVolume}%`;
  els.reducedMotionToggle.checked = Boolean(settings.reducedMotion);
  els.sfxVolume.disabled = !settings.sfxEnabled;
  els.musicVolume.disabled = !settings.musicEnabled;
}

function updateAudioSettings(patch = {}) {
  state.save.settings = mergeSave({
    settings: {
      ...state.save.settings,
      ...patch
    }
  }).settings;
  state.save.settings.sound = state.save.settings.sfxEnabled || state.save.settings.musicEnabled;
  renderAudioSettings();
  ensureAudioSystem();
  applyAudioMix();
  storeSession();
}

function openAudioSettings() {
  if (state.audioOpen) return;
  closeHelp();
  state.audioOpen = true;
  renderAudioSettings();
  els.audioModal.classList.remove("hidden");
}

function closeAudioSettings() {
  state.audioOpen = false;
  els.audioModal.classList.add("hidden");
}

async function signOutPlayer() {
  if (!state.profile) {
    toast("No active player is signed in.");
    return;
  }
  if (state.pendingSave) {
    toast("Syncing progress. Try sign out again in a second.");
    return;
  }
  if (state.profile && state.token) {
    await syncSave(false);
  }
  closeHelp();
  closeAudioSettings();
  stopMusicLoop();
  state.playing = false;
  state.gameOver = false;
  state.token = null;
  state.profile = null;
  state.save = defaultSave();
  ensureDailyChallenges();
  state.items = [];
  state.distractions = [];
  setupAmbientEncounters();
  state.trail = [];
  state.particles = [];
  state.combo = 0;
  state.score = 0;
  state.spirit = 3;
  state.time = 0;
  els.playerName.textContent = "Guest";
  els.reefCode.textContent = "No Reef Code";
  clearSession();
  renderPanels();
  updateHud();
  renderAudioSettings();
  applyAudioMix();
  switchAuth("create");
  els.createForm.reset();
  els.loginForm.reset();
  els.authModal.classList.remove("hidden");
  showReady("Ready?", "Create a Reef Code to start saving progress.");
  toast("Signed out. Another player can sign in.");
}

async function api(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Something went sideways.");
  }
  return data;
}

function storeSession() {
  if (!state.profile || !state.token) return;
  localStorage.setItem(
    "camoraReefSession",
    JSON.stringify({
      token: state.token,
      profile: state.profile,
      save: state.save
    })
  );
}

function loadCachedSession() {
  try {
    const cached = JSON.parse(localStorage.getItem("camoraReefSession") || "null");
    if (!cached?.profile?.reefCode || !cached?.save) return false;
    state.token = cached.token || null;
    state.profile = cached.profile;
    state.save = mergeSave(cached.save);
    ensureDailyChallenges();
    setupAmbientEncounters();
    return true;
  } catch {
    return false;
  }
}

function applyProfile(profile, token) {
  state.profile = profile;
  state.token = token;
  state.save = mergeSave(profile.save);
  ensureDailyChallenges();
  setupAmbientEncounters();
  els.authModal.classList.add("hidden");
  els.playerName.textContent = profile.displayName;
  els.reefCode.textContent = profile.reefCode;
  renderAudioSettings();
  ensureAudioSystem();
  applyAudioMix();
  storeSession();
  renderPanels();
  refreshLeaderboard();
  showReady("Squad Synced", "Camora is ready to rally the reef.");
}

async function createProfile(event) {
  event.preventDefault();
  els.authMessage.textContent = "";
  try {
    const data = await api("/api/create", {
      displayName: els.createName.value,
      pin: els.createPin.value
    });
    applyProfile(data.profile, data.token);
    toast(`Reef Code: ${data.profile.reefCode}`);
  } catch (error) {
    els.authMessage.textContent = error.message;
  }
}

async function loginProfile(event) {
  event.preventDefault();
  els.authMessage.textContent = "";
  try {
    const data = await api("/api/login", {
      reefCode: els.loginCode.value,
      pin: els.loginPin.value
    });
    applyProfile(data.profile, data.token);
    toast("Progress loaded.");
  } catch (error) {
    els.authMessage.textContent = error.message;
  }
}

function switchAuth(mode) {
  const create = mode === "create";
  els.createTab.classList.toggle("active", create);
  els.loginTab.classList.toggle("active", !create);
  els.createForm.classList.toggle("hidden", !create);
  els.loginForm.classList.toggle("hidden", create);
  els.authMessage.textContent = "";
}

async function syncSave(forceToast = false) {
  if (!state.profile || !state.token || state.pendingSave) return;
  state.pendingSave = true;
  try {
    const data = await api("/api/save", {
      reefCode: state.profile.reefCode,
      token: state.token,
      save: state.save
    });
    state.profile = data.profile;
    state.save = mergeSave(data.profile.save);
    storeSession();
    renderPanels();
    if (forceToast) toast("Progress synced.");
  } catch (error) {
    if (forceToast) toast(error.message);
  } finally {
    state.pendingSave = false;
  }
}

async function refreshLeaderboard() {
  try {
    const response = await fetch("/api/leaderboard", { cache: "no-store" });
    const data = await response.json();
    els.leaderboard.innerHTML = "";
    if (!data.scores?.length) {
      const li = document.createElement("li");
      li.textContent = "No scores posted yet.";
      els.leaderboard.append(li);
      return;
    }
    data.scores.forEach(score => {
      const li = document.createElement("li");
      li.textContent = `${score.displayName}: ${formatNumber(score.highScore)}`;
      els.leaderboard.append(li);
    });
  } catch {
    els.leaderboard.innerHTML = "<li>Leaderboard unavailable.</li>";
  }
}

function renderChapterMap() {
  els.chapterMap.innerHTML = "";
  const currentLevel = state.save.level;
  const currentChapter = chapterForLevel(currentLevel);
  for (const chapter of chapterMeta) {
    const node = document.createElement("div");
    const isComplete = currentLevel > chapter.end;
    const isCurrent = currentLevel >= chapter.start && currentLevel <= chapter.end;
    node.className = `chapter-node ${isCurrent ? "current" : isComplete ? "complete" : "locked"}`;
    node.innerHTML = `
      <span class="chapter-dot" style="background:${chapter.color}"></span>
      <span>${chapter.id}</span>
      <strong>L${chapter.start}-${chapter.end}</strong>
    `;
    els.chapterMap.append(node);
  }

  const chapterSpan = Math.max(1, currentChapter.end - currentChapter.start + 1);
  const chapterUnits =
    clamp(currentLevel - currentChapter.start, 0, chapterSpan) +
    clamp(state.save.xp / Math.max(1, xpForLevel(currentLevel)), 0, 1);
  const chapterProgress = clamp((chapterUnits / chapterSpan) * 100, 0, 100);
  els.chapterStatus.textContent = `${currentChapter.id}: ${Math.round(chapterProgress)}% complete in this chapter.`;
}

function renderMissions() {
  els.missionList.innerHTML = "";
  for (const mission of missionMeta) {
    const value = clamp(state.save.missions[mission.id] || 0, 0, mission.goal);
    const item = document.createElement("div");
    item.className = "mission";
    item.innerHTML = `
      <div class="mission-top"><span>${mission.label}</span><span>${value}/${mission.goal}</span></div>
      <div class="meter"><span style="width:${(value / mission.goal) * 100}%"></span></div>
    `;
    els.missionList.append(item);
  }
}

function renderDailyChallenges() {
  ensureDailyChallenges();
  const daily = state.save.daily;
  els.dailyChallengeList.innerHTML = "";
  els.dailyStreak.textContent = `Streak ${daily.streak}`;
  for (const challengeId of daily.activeChallenges) {
    const challenge = dailyChallengeLookup[challengeId];
    if (!challenge) continue;
    const value = clamp(daily.progress[challengeId] || 0, 0, challenge.goal);
    const mission = document.createElement("div");
    const complete = value >= challenge.goal;
    mission.className = `mission${complete ? " complete" : ""}`;
    mission.innerHTML = `
      <div class="mission-top"><span>${challenge.label}</span><strong>${value}/${challenge.goal}</strong></div>
      <div class="meter"><span style="width:${(value / challenge.goal) * 100}%"></span></div>
    `;
    els.dailyChallengeList.append(mission);
  }
}

function renderCustomizationStudio() {
  els.uniformSelect.value = state.save.customization.uniformTheme;
  els.pomSelect.value = state.save.customization.pomTheme;
  els.trailSelect.value = state.save.customization.trailTheme;
}

function updateCustomization(patch) {
  state.save.customization = {
    ...state.save.customization,
    ...patch
  };
  state.save = mergeSave(state.save);
  renderCustomizationStudio();
  storeSession();
}

function renderAnimals() {
  els.animalGrid.innerHTML = "";
  for (const animal of animalRoster) {
    const unlocked = state.save.unlockedAnimals.includes(animal.name);
    const chip = document.createElement("div");
    chip.className = `animal-chip${unlocked ? "" : " locked"}`;
    chip.title = unlocked ? animal.fact : "Rescue this friend in the reef.";
    chip.innerHTML = `
      <span class="animal-emoji" style="background:linear-gradient(135deg, ${animal.color}, white)">${animal.icon}</span>
      <span>${unlocked ? animal.name.split(" the ")[0] : "Locked"}</span>
    `;
    els.animalGrid.append(chip);
  }
}

function renderCollectibles() {
  els.collectibleGrid.innerHTML = "";
  for (const meta of collectibleMeta) {
    const source = state.save[meta.id];
    const value = Array.isArray(source) ? source.length : source || 0;
    const chip = document.createElement("div");
    chip.className = "collectible-chip";
    chip.innerHTML = `
      <span class="collectible-emoji" style="background:linear-gradient(135deg, ${meta.color}, white)">${meta.marker}</span>
      <span>${meta.label}</span>
      <strong>${formatNumber(value)}</strong>
    `;
    els.collectibleGrid.append(chip);
  }
}

function renderBadges() {
  els.badgeList.innerHTML = "";
  const badges = state.save.badges.length ? state.save.badges : ["No badges yet"];
  for (const badge of badges) {
    const chip = document.createElement("div");
    chip.className = "badge-chip";
    chip.textContent = badge;
    els.badgeList.append(chip);
  }
}

function renderLevelPath() {
  const level = state.save.level;
  const required = xpForLevel(level);
  const progress = clamp((state.save.xp / required) * 100, 0, 100);
  els.levelText.textContent = String(level);
  els.levelNow.textContent = `Level ${level}`;
  els.xpMeter.style.width = `${progress}%`;
  els.xpCopy.textContent = `${formatNumber(state.save.xp)} / ${formatNumber(required)} XP`;
}

function renderPanels() {
  renderChapterMap();
  renderMissions();
  renderDailyChallenges();
  renderAnimals();
  renderCollectibles();
  renderCustomizationStudio();
  renderBadges();
  renderLevelPath();
  els.bestText.textContent = formatNumber(state.save.highScore);
}

function showReady(title, copy) {
  state.playing = false;
  els.overlayTitle.textContent = title;
  els.overlayCopy.textContent = copy;
  els.playBtn.textContent = state.gameOver ? "Play Again" : "Play";
  els.pauseOverlay.classList.remove("hidden");
  state.levelBannerTimer = 0;
  if (els.levelBanner) els.levelBanner.classList.add("hidden");
  if (els.stopRunBtn) els.stopRunBtn.disabled = true;
}

function hideOverlay() {
  els.pauseOverlay.classList.add("hidden");
  if (els.stopRunBtn) els.stopRunBtn.disabled = false;
}

function openHelp() {
  if (state.helpOpen) return;
  closeAudioSettings();
  state.helpOpen = true;
  els.helpModal.classList.remove("hidden");
}

function closeHelp() {
  if (!state.helpOpen) return;
  state.helpOpen = false;
  els.helpModal.classList.add("hidden");
}

function showLevelAdvance(level, copy = "Speed and distractions increased") {
  if (!els.levelBanner) return;
  els.levelBannerTitle.textContent = `Level ${level}`;
  els.levelBannerCopy.textContent = copy;
  els.levelBanner.classList.remove("hidden");
  state.levelBannerTimer = 2.2;
}

function stopCurrentRun() {
  if (!state.playing) {
    toast("No active run to stop.");
    return;
  }
  endRound("stopped");
}

function resetRound(practice = false) {
  ensureDailyChallenges();
  state.practice = practice;
  state.gameOver = false;
  state.playing = true;
  state.score = 0;
  state.combo = 0;
  state.spirit = practice ? 99 : 3;
  state.lane = 1;
  state.items = [];
  state.distractions = [];
  state.trail = [];
  state.particles = [];
  state.time = 0;
  state.spawnTimer = 0.35;
  state.noteTimer = 1.2;
  state.distractionTimer = rand(3.4, 6.2);
  state.encounterTimer = rand(1.8, 4.2);
  state.trailTimer = 0;
  state.speed = 290;
  state.tideLevel = Math.max(1, state.save.level);
  state.cheerPulse = 0;
  state.levelPulse = 0;
  state.levelBannerTimer = 0;
  state.screenShake = 0;
  state.targetX = state.laneX[state.lane];
  state.camoraX = state.targetX;
  if (!practice) {
    state.save.gamesPlayed += 1;
  }
  hideOverlay();
  if (!practice && state.save.level > 1) {
    const chapter = chapterForLevel(state.save.level);
    showLevelAdvance(state.save.level, `${chapter.id}: ${chapter.copy}`);
  }
  updateHud();
}

function updateHud() {
  els.scoreText.textContent = formatNumber(state.score);
  els.comboText.textContent = `${state.combo}x`;
  els.spiritText.textContent = state.practice ? "INF" : String(state.spirit);
  els.bestText.textContent = formatNumber(Math.max(state.save.highScore, state.score));
  els.levelText.textContent = String(state.save.level);
  renderLevelPath();
}

function moveLane(direction) {
  if (!state.playing) return;
  state.lane = clamp(state.lane + direction, 0, 2);
  state.targetX = state.laneX[state.lane];
}

function gainXp(amount) {
  if (state.practice) return;
  const startingLevel = state.save.level;
  const startingChapter = chapterForLevel(startingLevel);
  state.save.xp += amount;
  let leveled = false;
  while (state.save.xp >= xpForLevel(state.save.level)) {
    state.save.xp -= xpForLevel(state.save.level);
    state.save.level += 1;
    state.levelPulse = 1;
    leveled = true;
  }
  if (leveled) {
    const nextChapter = chapterForLevel(state.save.level);
    const chapterChanged = nextChapter.id !== startingChapter.id;
    toast(
      chapterChanged
        ? `New chapter unlocked: ${nextChapter.id}!`
        : `Level up! Camora reached Level ${state.save.level}.`
    );
    showLevelAdvance(
      state.save.level,
      chapterChanged ? `${nextChapter.id} unlocked!` : `${nextChapter.id} gets tougher now.`
    );
    burst(state.camoraX, state.camoraY - 70, "#ffe766", 36);
    renderChapterMap();
  }
}

function cheer() {
  if (!state.playing) return;
  state.cheerPulse = 1;
  let hit = false;
  for (const item of state.items) {
    if (item.type !== "note" || item.hit) continue;
    const distanceY = Math.abs(item.y - state.camoraY + 4);
    const distanceX = Math.abs(item.x - state.camoraX);
    if (distanceY < 88 && distanceX < 92) {
      item.hit = true;
      item.dead = true;
      hit = true;
      addScore(85, "PERFECT");
      state.combo += 1;
      state.save.perfectCheers += 1;
      state.save.missions.cheerChain += 1;
      gainXp(14);
      updateDailyChallenge("perfect_cheer", 1);
      burst(item.x, item.y, "#ffd34f", 18);
      chime(640, 0.08, "triangle");
    }
  }

  if (!hit) {
    state.combo = Math.max(0, state.combo - 1);
    burst(state.camoraX, state.camoraY - 50, "rgba(255,255,255,0.9)", 7);
    chime(220, 0.04, "sine");
  }
  updateDailyChallenge("combo_peak", state.combo, "peak");
  updateHud();
}

function addScore(amount, label = "") {
  const comboBoost = 1 + Math.min(2.8, state.combo * 0.085);
  state.score += Math.floor(amount * comboBoost);
  if (label) {
    state.particles.push({
      type: "text",
      text: label,
      x: state.camoraX + rand(-28, 28),
      y: state.camoraY - 88,
      vy: -44,
      life: 0.8,
      color: "#ffffff"
    });
  }
}

function unlockAnimal(animal) {
  if (!state.save.unlockedAnimals.includes(animal.name)) {
    state.save.unlockedAnimals.push(animal.name);
    toast(`${animal.name} joined the Ocean Squad.`);
  }
  if (!state.save.labFacts.includes(animal.fact)) {
    state.save.labFacts.push(animal.fact);
  }
}

function unlockSticker() {
  const fresh = stickerPool.filter(name => !state.save.stickerBook.includes(name));
  if (!fresh.length) {
    state.save.starShards += 3;
    return;
  }
  const sticker = pick(fresh);
  state.save.stickerBook.push(sticker);
  toast(`Sticker unlocked: ${sticker}`);
}

function unlockSeaCard(animal) {
  const cardName = `${animal.name} Card`;
  if (!state.save.seaAnimalCards.includes(cardName)) {
    state.save.seaAnimalCards.push(cardName);
    toast(`Sea card unlocked: ${animal.name}`);
    return;
  }
  // Duplicate cards still feel rewarding.
  state.save.starShards += 2;
}

function spawnDistraction(w, h) {
  const level = state.save.level;
  if (level < 3) return;
  const animal = pick(animalRoster);
  const direction = Math.random() < 0.5 ? 1 : -1;
  const baseSize = clamp(92 + level * 12, 110, 300);
  const giantBoost = level >= 6 && Math.random() < clamp((level - 5) * 0.08, 0.1, 0.55) ? rand(1.2, 1.7) : 1;
  const size = rand(baseSize * 0.82, baseSize * 1.16) * giantBoost;
  const speed = rand(24, 46) + level * 4.4;
  const startX = direction > 0 ? -size - 80 : w + size + 80;
  const startY = rand(h * 0.2, h * 0.58);
  state.distractions.push({
    animal,
    direction,
    x: startX,
    y: startY,
    size,
    speed,
    alpha: rand(0.19, 0.4),
    phase: rand(0, Math.PI * 2),
    dead: false
  });
}

function checkBadges() {
  const before = new Set(state.save.badges);
  for (const rule of badgeRules) {
    if (!before.has(rule.id) && rule.test(state.save)) {
      state.save.badges.push(rule.id);
      toast(`Badge unlocked: ${rule.id}`);
    }
  }
}

function spawnItem(kind = null) {
  const lane = Math.floor(rand(0, 3));
  const x = state.laneX[lane];
  const roll = Math.random();
  const levelBonus = clamp((state.save.level - 1) * 0.012, 0, 0.1);
  let type = kind;
  if (!type) {
    let gate = 0;
    gate += 0.13 + levelBonus * 0.45;
    if (roll < gate) type = "obstacle";
    else {
      gate += 0.09;
      if (roll < gate) type = "animal";
      else {
        gate += 0.08;
        if (roll < gate) type = "clean";
        else {
          gate += 0.1;
          if (roll < gate) type = "gem";
          else {
            gate += 0.08;
            if (roll < gate) type = "pearl";
            else {
              const pompomChance = state.save.level >= 2 ? clamp(0.07 + (state.save.level - 2) * 0.01, 0.07, 0.14) : 0;
              gate += pompomChance;
              if (roll < gate) type = "pompom";
              else {
                const seaCardChance = state.save.level >= 3 ? clamp(0.05 + (state.save.level - 3) * 0.008, 0.05, 0.11) : 0;
                gate += seaCardChance;
                if (roll < gate) type = "seaCard";
                else {
                  gate += state.save.level >= 4 ? 0.05 : 0.03;
                  if (roll < gate) type = "sticker";
                  else type = "shell";
                }
              }
            }
          }
        }
      }
    }
  }

  const item = {
    type,
    lane,
    x,
    y: -80,
    r: type === "obstacle" ? 34 : 30,
    wobble: rand(0, Math.PI * 2),
    spin: rand(-2, 2),
    facing: Math.random() < 0.5 ? -1 : 1,
    animal: type === "animal" || type === "seaCard" ? pick(animalRoster) : null,
    hit: false,
    dead: false
  };

  if (type === "note") {
    item.r = 38;
    item.y = -70;
  }
  if (type === "pompom") {
    item.r = 28;
  }
  if (type === "seaCard") {
    item.r = 31;
  }
  state.items.push(item);
}

function burst(x, y, color, count = 12) {
  for (let i = 0; i < count; i += 1) {
    state.particles.push({
      type: "dot",
      x,
      y,
      vx: rand(-120, 120),
      vy: rand(-180, 40),
      r: rand(2, 7),
      life: rand(0.45, 0.9),
      color
    });
  }
}

function collect(item) {
  item.dead = true;
  if (item.type === "shell") {
    state.combo += 1;
    addScore(35, state.combo >= 8 ? "RALLY" : "");
    state.save.totalSparkles += 10;
    state.save.starShards += 1;
    state.save.missions.shellSprint += 10;
    state.save.missions.treasureTrail += 1;
    gainXp(12);
    updateDailyChallenge("sparkles", 10);
    burst(item.x, item.y, "#ffd34f", 10);
    chime(440 + Math.min(state.combo, 12) * 24, 0.035, "sine");
  }
  if (item.type === "animal") {
    state.combo += 2;
    addScore(140, "RESCUE");
    state.save.animalsRescued += 1;
    state.save.missions.animalAlly += 1;
    state.save.missions.treasureTrail += 1;
    gainXp(26);
    updateDailyChallenge("rescues", 1);
    unlockAnimal(item.animal);
    burst(item.x, item.y, item.animal.color, 20);
    chime(720, 0.07, "triangle");
  }
  if (item.type === "clean") {
    state.combo += 1;
    addScore(70, "CLEAN");
    state.save.missions.cleanReef += 1;
    gainXp(18);
    burst(item.x, item.y, "#4ce3a0", 14);
    chime(520, 0.05, "square");
  }
  if (item.type === "gem") {
    state.combo += 1;
    addScore(95, "GEM");
    state.save.coralGems += 1;
    state.save.missions.treasureTrail += 1;
    gainXp(24);
    updateDailyChallenge("treasures", 1);
    burst(item.x, item.y, "#ff6f8a", 16);
    chime(560, 0.05, "triangle");
  }
  if (item.type === "pearl") {
    state.combo += 2;
    addScore(155, "PEARL");
    state.save.pearlCrowns += 1;
    state.save.missions.treasureTrail += 1;
    gainXp(34);
    updateDailyChallenge("treasures", 1);
    burst(item.x, item.y, "#f7f8ff", 20);
    chime(770, 0.06, "sine");
  }
  if (item.type === "pompom") {
    state.combo += 1;
    addScore(110, "POMPOM");
    state.save.pompomStash += 1;
    state.save.missions.treasureTrail += 1;
    gainXp(22);
    updateDailyChallenge("pompoms", 1);
    updateDailyChallenge("treasures", 1);
    burst(item.x, item.y, "#ff9ab5", 18);
    chime(690, 0.06, "square");
  }
  if (item.type === "seaCard") {
    state.combo += 2;
    addScore(175, "SEA CARD");
    state.save.missions.treasureTrail += 2;
    gainXp(32);
    updateDailyChallenge("treasures", 1);
    unlockSeaCard(item.animal || pick(animalRoster));
    burst(item.x, item.y, "#64d8ff", 20);
    chime(820, 0.07, "triangle");
  }
  if (item.type === "sticker") {
    state.combo += 2;
    addScore(220, "STICKER");
    state.save.missions.treasureTrail += 2;
    gainXp(38);
    updateDailyChallenge("treasures", 1);
    unlockSticker();
    burst(item.x, item.y, "#7f8bff", 22);
    chime(880, 0.08, "square");
  }
  updateDailyChallenge("combo_peak", state.combo, "peak");
  updateHud();
}

function hitObstacle(item) {
  item.dead = true;
  state.combo = 0;
  state.screenShake = 0.35;
  burst(item.x, item.y, "#ff5e70", 18);
  chime(120, 0.08, "sawtooth");
  if (!state.practice) {
    state.spirit -= 1;
  }
  if (state.spirit <= 0) {
    endRound();
  }
  updateHud();
}

function endRound(reason = "complete") {
  state.playing = false;
  state.gameOver = true;
  if (els.stopRunBtn) els.stopRunBtn.disabled = true;
  const oldBest = state.save.highScore;
  state.save.highScore = Math.max(state.save.highScore, state.score);
  state.save.bestCombo = Math.max(state.save.bestCombo, state.combo);
  state.save.lastPlayedAt = new Date().toISOString();
  checkBadges();
  renderPanels();
  storeSession();
  syncSave(false);
  refreshLeaderboard();
  let bestLine = state.score > oldBest ? "New high score. The reef heard that one." : "Great rally. The next run is waiting.";
  let title = "Reef Rally Complete";
  if (reason === "stopped") {
    title = "Run Stopped";
    bestLine = "You can jump back in whenever you want.";
  }
  showReady(title, `${bestLine} Score: ${formatNumber(state.score)}.`);
}

function updateGame(dt) {
  if (state.helpOpen || state.audioOpen) return;
  updateTrail(dt);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  state.time += dt;
  updateAmbientEncounters(dt, w, h);
  if (!state.playing) return;
  state.tideLevel = state.save.level + Math.floor(state.time / 34);
  state.speed = 272 + state.tideLevel * 24 + Math.min(140, state.combo * 3.5);
  state.camoraX = lerp(state.camoraX, state.targetX, 1 - Math.pow(0.001, dt));
  state.cheerPulse = Math.max(0, state.cheerPulse - dt * 2.8);
  state.levelPulse = Math.max(0, state.levelPulse - dt * 1.6);
  state.levelBannerTimer = Math.max(0, state.levelBannerTimer - dt);
  if (state.levelBannerTimer <= 0 && els.levelBanner && !els.levelBanner.classList.contains("hidden")) {
    els.levelBanner.classList.add("hidden");
  }
  state.screenShake = Math.max(0, state.screenShake - dt);

  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnItem();
    const levelSpeed = clamp(state.save.level * 0.015, 0, 0.25);
    const gap = clamp(0.82 - levelSpeed - state.combo * 0.007, 0.31, 0.82);
    state.spawnTimer = rand(gap * 0.7, gap * 1.15);
  }

  state.noteTimer -= dt;
  if (state.noteTimer <= 0) {
    spawnItem("note");
    const noteGap = clamp(3.2 - state.save.level * 0.14, 1.6, 3.2);
    state.noteTimer = rand(noteGap * 0.8, noteGap * 1.2);
  }

  state.distractionTimer -= dt;
  if (state.save.level >= 3 && state.distractionTimer <= 0) {
    spawnDistraction(w, h);
    const cooldown = clamp(8 - state.save.level * 0.46, 2.6, 8);
    state.distractionTimer = rand(cooldown * 0.75, cooldown * 1.2);
  }

  for (const item of state.items) {
    const wiggle = Math.sin(state.time * 3 + item.wobble) * 18;
    item.y += (state.speed + (item.type === "note" ? 50 : 0)) * dt;
    item.x = state.laneX[item.lane] + wiggle;
    const dx = item.x - state.camoraX;
    const dy = item.y - state.camoraY;
    const distance = Math.hypot(dx, dy);
    if (!item.dead && distance < item.r + 42 && item.type !== "note") {
      if (item.type === "obstacle") hitObstacle(item);
      else collect(item);
    }
    if (!item.dead && item.type === "note" && item.y > h + 50) {
      item.dead = true;
      state.combo = Math.max(0, state.combo - 1);
      updateHud();
    }
    if (item.y > h + 120) item.dead = true;
  }
  state.items = state.items.filter(item => !item.dead);

  for (const distraction of state.distractions) {
    const drift = Math.sin(state.time * 1.4 + distraction.phase) * 12;
    distraction.y += drift * dt;
    distraction.x += distraction.speed * dt * distraction.direction;
    if (
      (distraction.direction > 0 && distraction.x - distraction.size > w + 120) ||
      (distraction.direction < 0 && distraction.x + distraction.size < -120)
    ) {
      distraction.dead = true;
    }
  }
  state.distractions = state.distractions.filter(distraction => !distraction.dead);

  for (const p of state.particles) {
    p.life -= dt;
    p.x += (p.vx || 0) * dt;
    p.y += (p.vy || 0) * dt;
    if (p.type === "dot") p.vy += 260 * dt;
  }
  state.particles = state.particles.filter(p => p.life > 0);

  for (const floater of state.floaters) {
    floater.y -= floater.speed * dt;
    floater.x += Math.sin(state.time + floater.r) * dt * 10;
    if (floater.y < -20) {
      floater.y = h + 20;
      floater.x = rand(0, w);
    }
  }

  if (!state.practice && state.time > 4.5) {
    state.save.highScore = Math.max(state.save.highScore, state.score);
  }
  updateHud();
}

function drawBackground(w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#2de0df");
  g.addColorStop(0.44, "#0aa6cc");
  g.addColorStop(1, "#12609a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.28;
  for (let i = 0; i < 7; i += 1) {
    const y = ((state.time * 24 + i * 130) % (h + 180)) - 140;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= w + 40; x += 40) {
      ctx.lineTo(x, y + Math.sin(x * 0.018 + state.time + i) * 16);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = i % 2 ? "#ffffff" : "#9dfff0";
    ctx.stroke();
  }
  ctx.restore();

  for (const floater of state.floaters) {
    ctx.globalAlpha = floater.alpha;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(floater.x, floater.y, floater.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawWaterLightShafts(w, h);
  drawAmbientEncounters();
  drawDistractions();
  drawCoralGarden(w, h);
  drawLaneMarkers(w, h);
  drawVignette(w, h);
}

function drawWaterLightShafts(w, h) {
  ctx.save();
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 6; i += 1) {
    const centerX = ((state.time * 20 + i * (w * 0.23)) % (w + 220)) - 110;
    const width = 120 + (i % 3) * 40;
    const beam = ctx.createLinearGradient(centerX - width, 0, centerX + width, h);
    beam.addColorStop(0, "rgba(255,255,255,0)");
    beam.addColorStop(0.48, "rgba(255,255,255,0.72)");
    beam.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(centerX - width, -10);
    ctx.lineTo(centerX + width, -10);
    ctx.lineTo(centerX + width * 0.45, h + 20);
    ctx.lineTo(centerX - width * 0.45, h + 20);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawVignette(w, h) {
  ctx.save();
  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.45, h * 0.2, w * 0.5, h * 0.5, h * 0.9);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(8,26,52,0.4)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function drawCoralGarden(w, h) {
  ctx.save();
  ctx.translate(0, h - 120);
  const coralColors = ["#ff5e70", "#ffd34f", "#4ce3a0", "#b556f1", "#ff8d65"];
  for (let i = 0; i < 18; i += 1) {
    const x = (i / 17) * w + Math.sin(i) * 16;
    const height = 42 + (i % 5) * 15;
    ctx.strokeStyle = coralColors[i % coralColors.length];
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, 120);
    ctx.bezierCurveTo(x - 12, 82, x + 18, 50, x, 120 - height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, 92);
    ctx.lineTo(x - 22, 74);
    ctx.moveTo(x, 84);
    ctx.lineTo(x + 24, 62);
    ctx.stroke();
  }
  ctx.fillStyle = "#f3d985";
  ctx.beginPath();
  ctx.ellipse(w * 0.5, 124, w * 0.72, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawLaneMarkers(w, h) {
  ctx.save();
  ctx.globalAlpha = 0.26;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 18]);
  for (const x of state.laneX) {
    ctx.beginPath();
    ctx.moveTo(x, 20);
    ctx.quadraticCurveTo(w * 0.5, h * 0.44, x, h - 38);
    ctx.stroke();
  }
  ctx.restore();
}

function drawShell(x, y, r, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time) * 0.12);
  const g = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.2, 0, 0, r);
  g.addColorStop(0, "#fff6ba");
  g.addColorStop(0.55, "#ffd34f");
  g.addColorStop(1, "#ff8d65");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  for (let i = 0; i <= 8; i += 1) {
    const angle = -Math.PI / 2 + (i / 8) * Math.PI;
    const radius = i % 2 ? r * 0.88 : r;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.quadraticCurveTo(0, r * 0.62, -r, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawClean(x, y, r, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time);
  ctx.fillStyle = "#4ce3a0";
  roundRect(-r * 0.72, -r * 0.5, r * 1.44, r, 10);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-r * 0.3, -r * 0.72, r * 0.6, r * 0.2);
  ctx.fillStyle = "#143357";
  ctx.font = `${r * 0.6}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("!", 0, 0);
  ctx.restore();
}

function drawObstacle(x, y, r, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time) * 0.2);
  ctx.fillStyle = "#ff5e70";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  roundRect(-r * 0.56, -r * 0.92, r * 1.12, r * 1.84, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  roundRect(-r * 0.24, -r * 0.68, r * 0.48, r * 0.5, 8);
  ctx.fill();
  ctx.restore();
}

function drawNote(x, y, r, time) {
  const pulse = 1 + Math.sin(time * 7) * 0.06;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = "rgba(255,255,255,0.34)";
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffd34f";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `${r * 0.82}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GO", 0, 2);
  ctx.restore();
}

function drawGem(x, y, r, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(time * 0.9);
  ctx.fillStyle = "#ff6f8a";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6;
    const radius = i % 2 ? r * 0.62 : r;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPearl(x, y, r, time) {
  ctx.save();
  ctx.translate(x, y);
  const g = ctx.createRadialGradient(-r * 0.24, -r * 0.24, r * 0.2, 0, 0, r);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(1, "#d9e3ff");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.rotate(Math.sin(time) * 0.18);
  ctx.strokeStyle = "#7586cc";
  ctx.beginPath();
  ctx.moveTo(-r * 1.1, -r * 0.5);
  ctx.lineTo(-r * 0.4, -r * 0.9);
  ctx.lineTo(r * 0.4, -r * 0.9);
  ctx.lineTo(r * 1.1, -r * 0.5);
  ctx.stroke();
  ctx.restore();
}

function drawSticker(x, y, r, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 2.5) * 0.2);
  ctx.fillStyle = "#7f8bff";
  roundRect(-r * 0.9, -r * 0.9, r * 1.8, r * 1.8, 10);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = `${r * 0.48}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ST", 0, 0);
  ctx.restore();
}

function drawPompomCollectible(x, y, r, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 3.5) * 0.25);
  const colors = ["#ffffff", "#ff9ab5", "#ffd34f", "#64d8ff"];
  for (let i = 0; i < 20; i += 1) {
    const a = (i / 20) * Math.PI * 2;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSeaEye(x, y, size) {
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#102746";
  ctx.beginPath();
  ctx.arc(x + size * 0.24, y, size * 0.46, 0, Math.PI * 2);
  ctx.fill();
}

function drawSeaTurtle(animal, size, time) {
  const flap = Math.sin(time * 6) * 0.2;
  const shellW = size * 0.52;
  const shellH = size * 0.34;

  ctx.save();
  ctx.rotate(Math.sin(time * 2.2) * 0.08);
  ctx.fillStyle = "#69ddb2";
  ctx.beginPath();
  ctx.ellipse(-shellW * 0.36, -shellH * 0.84, shellW * 0.22, shellH * 0.44, -0.9 + flap, 0, Math.PI * 2);
  ctx.ellipse(-shellW * 0.36, shellH * 0.84, shellW * 0.22, shellH * 0.44, 0.9 - flap, 0, Math.PI * 2);
  ctx.ellipse(shellW * 0.2, -shellH * 0.98, shellW * 0.2, shellH * 0.38, -0.45 - flap * 0.5, 0, Math.PI * 2);
  ctx.ellipse(shellW * 0.2, shellH * 0.98, shellW * 0.2, shellH * 0.38, 0.45 + flap * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = animal.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, shellW, shellH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  for (let i = 0; i < 4; i += 1) {
    const x = -shellW * 0.25 + i * shellW * 0.18;
    ctx.beginPath();
    ctx.arc(x, -shellH * 0.08 + Math.sin(i) * shellH * 0.14, shellH * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#6fdcb7";
  ctx.beginPath();
  ctx.arc(shellW * 0.9, -shellH * 0.04, shellH * 0.42, 0, Math.PI * 2);
  ctx.fill();
  drawSeaEye(shellW * 1.02, -shellH * 0.13, shellH * 0.13);

  ctx.fillStyle = "#3ea27d";
  ctx.beginPath();
  ctx.moveTo(-shellW * 1.1, 0);
  ctx.lineTo(-shellW * 1.35, -shellH * 0.18);
  ctx.lineTo(-shellW * 1.35, shellH * 0.18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDolphin(animal, size, time) {
  const tailSwing = Math.sin(time * 7.2) * size * 0.08;
  ctx.save();
  ctx.rotate(Math.sin(time * 1.7) * 0.05);

  ctx.fillStyle = animal.color;
  ctx.beginPath();
  ctx.moveTo(-size * 0.58, 0);
  ctx.quadraticCurveTo(-size * 0.12, -size * 0.48, size * 0.58, -size * 0.06);
  ctx.quadraticCurveTo(size * 0.72, 0, size * 0.58, size * 0.12);
  ctx.quadraticCurveTo(size * 0.04, size * 0.36, -size * 0.58, size * 0.06);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#7fe0ff";
  ctx.beginPath();
  ctx.moveTo(-size * 0.18, size * 0.07);
  ctx.quadraticCurveTo(size * 0.32, size * 0.24, size * 0.56, size * 0.04);
  ctx.quadraticCurveTo(size * 0.18, size * 0.29, -size * 0.2, size * 0.12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#3ea8d8";
  ctx.beginPath();
  ctx.moveTo(-size * 0.6, 0);
  ctx.lineTo(-size * 0.95, -size * 0.25 - tailSwing);
  ctx.lineTo(-size * 0.74, -size * 0.02);
  ctx.lineTo(-size * 0.95, size * 0.25 + tailSwing);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#3ea8d8";
  ctx.beginPath();
  ctx.moveTo(size * 0.03, -size * 0.1);
  ctx.lineTo(-size * 0.08, -size * 0.44);
  ctx.lineTo(size * 0.18, -size * 0.18);
  ctx.closePath();
  ctx.fill();

  drawSeaEye(size * 0.41, -size * 0.08, size * 0.05);
  ctx.restore();
}

function drawOctopus(animal, size, time) {
  ctx.save();
  ctx.fillStyle = animal.color;
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.14, size * 0.42, size * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineCap = "round";
  ctx.strokeStyle = animal.color;
  ctx.lineWidth = size * 0.12;
  for (let i = 0; i < 6; i += 1) {
    const t = i / 5;
    const startX = -size * 0.34 + t * size * 0.68;
    const sway = Math.sin(time * 5 + i * 0.9) * size * 0.14;
    ctx.beginPath();
    ctx.moveTo(startX, size * 0.02);
    ctx.quadraticCurveTo(startX + sway, size * 0.34, startX - sway * 0.4, size * 0.66);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.24)";
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(-size * 0.21 + i * size * 0.14, -size * 0.23, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSeaEye(-size * 0.11, -size * 0.16, size * 0.055);
  drawSeaEye(size * 0.11, -size * 0.16, size * 0.055);
  ctx.restore();
}

function drawManta(animal, size, time) {
  const wing = Math.sin(time * 4.4) * size * 0.1;
  ctx.save();
  ctx.fillStyle = animal.color;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.26);
  ctx.bezierCurveTo(size * 0.62, -size * 0.5 + wing, size * 0.72, size * 0.2 + wing, size * 0.16, size * 0.24);
  ctx.quadraticCurveTo(0, size * 0.3, -size * 0.16, size * 0.24);
  ctx.bezierCurveTo(-size * 0.72, size * 0.2 - wing, -size * 0.62, -size * 0.5 - wing, 0, -size * 0.26);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.2);
  ctx.bezierCurveTo(size * 0.32, -size * 0.24, size * 0.34, size * 0.08, 0, size * 0.16);
  ctx.bezierCurveTo(-size * 0.34, size * 0.08, -size * 0.32, -size * 0.24, 0, -size * 0.2);
  ctx.fill();

  ctx.strokeStyle = "#7244a3";
  ctx.lineWidth = size * 0.05;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, size * 0.18);
  ctx.quadraticCurveTo(size * 0.08, size * 0.52, size * 0.02, size * 0.72);
  ctx.stroke();

  drawSeaEye(size * 0.07, -size * 0.08, size * 0.04);
  ctx.restore();
}

function drawSeahorse(animal, size, time) {
  const sway = Math.sin(time * 4.5) * size * 0.06;
  ctx.save();
  ctx.translate(0, sway);
  ctx.strokeStyle = animal.color;
  ctx.lineWidth = size * 0.24;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-size * 0.2, -size * 0.2);
  ctx.quadraticCurveTo(-size * 0.02, -size * 0.08, -size * 0.04, size * 0.18);
  ctx.quadraticCurveTo(-size * 0.08, size * 0.34, size * 0.08, size * 0.48);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(size * 0.12, size * 0.47, size * 0.14, Math.PI * 0.2, Math.PI * 2.05);
  ctx.stroke();

  ctx.fillStyle = animal.color;
  ctx.beginPath();
  ctx.arc(-size * 0.24, -size * 0.24, size * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-size * 0.36, -size * 0.21, size * 0.11, size * 0.05, -0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffe27f";
  ctx.beginPath();
  ctx.moveTo(-size * 0.03, -size * 0.05);
  ctx.lineTo(size * 0.18, -size * 0.16);
  ctx.lineTo(size * 0.01, size * 0.05);
  ctx.closePath();
  ctx.fill();

  drawSeaEye(-size * 0.18, -size * 0.27, size * 0.04);
  ctx.restore();
}

function drawJelly(animal, size, time) {
  const pulse = 1 + Math.sin(time * 4) * 0.07;
  ctx.save();
  ctx.scale(pulse, 1);
  ctx.fillStyle = animal.color;
  ctx.beginPath();
  ctx.moveTo(-size * 0.36, -size * 0.02);
  ctx.quadraticCurveTo(-size * 0.34, -size * 0.44, 0, -size * 0.44);
  ctx.quadraticCurveTo(size * 0.34, -size * 0.44, size * 0.36, -size * 0.02);
  for (let i = 0; i < 5; i += 1) {
    const x = size * (0.36 - i * 0.18);
    const r = size * (i % 2 ? 0.07 : 0.1);
    ctx.quadraticCurveTo(x - size * 0.09, size * 0.09 + r, x - size * 0.18, -size * 0.02);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.ellipse(0, -size * 0.25, size * 0.21, size * 0.1, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = animal.color;
  ctx.lineWidth = size * 0.05;
  ctx.lineCap = "round";
  for (let i = 0; i < 4; i += 1) {
    const x = -size * 0.2 + i * size * 0.13;
    const sway = Math.sin(time * 5 + i * 1.1) * size * 0.12;
    ctx.beginPath();
    ctx.moveTo(x, size * 0.03);
    ctx.quadraticCurveTo(x + sway, size * 0.34, x - sway * 0.4, size * 0.62);
    ctx.stroke();
  }

  drawSeaEye(-size * 0.09, -size * 0.13, size * 0.04);
  drawSeaEye(size * 0.09, -size * 0.13, size * 0.04);
  ctx.restore();
}

function drawFishFallback(animal, size, time) {
  const tailSwing = Math.sin(time * 6) * size * 0.1;
  ctx.save();
  ctx.fillStyle = animal.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.42, size * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-size * 0.38, 0);
  ctx.lineTo(-size * 0.65, -size * 0.2 - tailSwing);
  ctx.lineTo(-size * 0.65, size * 0.2 + tailSwing);
  ctx.closePath();
  ctx.fill();
  drawSeaEye(size * 0.2, -size * 0.07, size * 0.04);
  ctx.restore();
}

function drawSeaCreature(animal, size, time, facing = 1) {
  if (!animal) return;
  const name = animal.name || "";
  ctx.save();
  ctx.scale(facing >= 0 ? 1 : -1, 1);
  if (name.includes("Turtle")) drawSeaTurtle(animal, size, time);
  else if (name.includes("Dolphin")) drawDolphin(animal, size, time);
  else if (name.includes("Octopus")) drawOctopus(animal, size, time);
  else if (name.includes("Manta")) drawManta(animal, size, time);
  else if (name.includes("Seahorse")) drawSeahorse(animal, size, time);
  else if (name.includes("Jelly")) drawJelly(animal, size, time);
  else drawFishFallback(animal, size, time);
  ctx.restore();
}

function drawSeaCardCollectible(item, time) {
  const animal = item.animal || animalRoster[0];
  const r = item.r;
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(Math.sin(time * 2.8) * 0.15);
  ctx.fillStyle = "#64d8ff";
  roundRect(-r * 0.82, -r, r * 1.64, r * 1.9, 8);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  roundRect(-r * 0.64, -r * 0.72, r * 1.28, r * 1.02, 7);
  ctx.fill();
  drawSeaCreature(animal, r * 0.9, time, item.facing || 1);
  ctx.fillStyle = "#143357";
  ctx.font = `900 ${r * 0.34}px sans-serif`;
  ctx.fillText("CARD", 0, r * 0.56);
  ctx.restore();
}

function drawAmbientEncounters() {
  for (const encounter of state.ambientEncounters) {
    ctx.save();
    ctx.translate(encounter.x, encounter.y);
    ctx.globalAlpha = encounter.alpha;
    if (encounter.schoolCount > 1) {
      for (let i = 0; i < encounter.schoolCount; i += 1) {
        const tailOffset = i * encounter.size * 0.72 * -encounter.direction;
        const waveX = Math.sin(state.time * 2.2 + encounter.phase + i) * encounter.size * 0.12;
        const waveY = Math.sin(state.time * 2.6 + encounter.phase * 1.4 + i * 0.9) * encounter.size * 0.14;
        const yOffset = ((i % 2) - 0.5) * encounter.size * 0.34;
        ctx.save();
        ctx.translate(tailOffset + waveX, yOffset + waveY);
        drawSeaCreature(encounter.animal, encounter.size * 0.56, state.time + encounter.phase + i * 0.24, encounter.direction);
        ctx.restore();
      }
    } else {
      drawSeaCreature(encounter.animal, encounter.size, state.time + encounter.phase, encounter.direction);
    }
    ctx.restore();
  }
}

function drawDistractions() {
  for (const distraction of state.distractions) {
    ctx.save();
    ctx.translate(distraction.x, distraction.y);
    ctx.globalAlpha = distraction.alpha;
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 0, distraction.size * 1.02, distraction.size * 0.66, 0, 0, Math.PI * 2);
    ctx.fill();
    drawSeaCreature(
      distraction.animal,
      distraction.size * 0.9,
      state.time + distraction.phase,
      distraction.direction > 0 ? 1 : -1
    );
    ctx.restore();
  }
}

function drawAnimalBubble(item, time) {
  const animal = item.animal || animalRoster[0];
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(0, 0, item.r * 1.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.82)";
  ctx.lineWidth = 3;
  ctx.stroke();
  drawSeaCreature(animal, item.r * 1.15, time + item.wobble, item.facing || 1);
  ctx.restore();
}

function drawItem(item) {
  const time = state.time + item.wobble;
  if (item.type === "shell") drawShell(item.x, item.y, item.r, time);
  if (item.type === "clean") drawClean(item.x, item.y, item.r, time);
  if (item.type === "obstacle") drawObstacle(item.x, item.y, item.r, time);
  if (item.type === "animal") drawAnimalBubble(item, time);
  if (item.type === "note") drawNote(item.x, item.y, item.r, time);
  if (item.type === "gem") drawGem(item.x, item.y, item.r, time);
  if (item.type === "pearl") drawPearl(item.x, item.y, item.r, time);
  if (item.type === "pompom") drawPompomCollectible(item.x, item.y, item.r, time);
  if (item.type === "seaCard") drawSeaCardCollectible(item, time);
  if (item.type === "sticker") drawSticker(item.x, item.y, item.r, time);
}

function drawCamoraPortrait(x, y, radius) {
  ctx.save();
  ctx.translate(x, y);
  const glow = state.levelPulse > 0 ? 6 + state.levelPulse * 12 : 0;
  if (glow > 0) {
    ctx.shadowBlur = glow;
    ctx.shadowColor = "#ffe766";
  }
  ctx.fillStyle = "#203051";
  ctx.beginPath();
  ctx.arc(0, 0, radius + 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.clip();
  if (state.camoraFaceLoaded && state.camoraFace) {
    const image = state.camoraFace;
    const scale = Math.max((radius * 2) / image.width, (radius * 2) / image.height);
    const drawW = image.width * scale;
    const drawH = image.height * scale;
    const dx = -drawW / 2;
    const dy = -drawH * 0.26;
    ctx.drawImage(image, dx, dy, drawW, drawH);
  } else {
    ctx.fillStyle = "#9b5b3d";
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(x, y - radius - 6);
  ctx.fillStyle = "#ff4f88";
  ctx.beginPath();
  ctx.moveTo(-22, 0);
  ctx.quadraticCurveTo(-4, -18, 0, 0);
  ctx.quadraticCurveTo(7, -18, 22, 0);
  ctx.quadraticCurveTo(7, 9, 0, 2);
  ctx.quadraticCurveTo(-9, 9, -22, 0);
  ctx.fill();
  ctx.fillStyle = "#ffd34f";
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCamora(x, y, time) {
  ctx.save();
  ctx.translate(x, y);
  const moveDelta = clamp((state.targetX - state.camoraX) / 64, -1, 1);
  const strideSpeed = state.playing ? 10.5 : 4.2;
  const stride = Math.sin(time * strideSpeed) * (state.playing ? 1 : 0.35);
  const bounce = Math.sin(time * 8) * (state.playing ? 4.5 : 1.8);
  const cheerLift = clamp(state.cheerPulse, 0, 1);
  const torsoLean = moveDelta * 0.12;
  const uniform = activeUniformTheme();
  const pomColors = activePomPalette();

  ctx.translate(0, bounce);
  ctx.rotate(torsoLean);

  if (state.cheerPulse > 0) {
    ctx.globalAlpha = state.cheerPulse * 0.65;
    ctx.strokeStyle = "#fff5a6";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(0, -28, 78 + (1 - state.cheerPulse) * 90, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const skinTone = "#bd6f46";
  const outline = "#243251";

  ctx.strokeStyle = outline;
  ctx.lineCap = "round";

  // Legs and shoes.
  ctx.lineWidth = 10;
  const leftStride = stride * 6;
  const rightStride = -stride * 6;
  ctx.beginPath();
  ctx.moveTo(-10, 43);
  ctx.quadraticCurveTo(-16 + leftStride * 0.24, 70, -14 + leftStride, 93);
  ctx.moveTo(10, 43);
  ctx.quadraticCurveTo(16 + rightStride * 0.24, 70, 14 + rightStride, 93);
  ctx.stroke();

  ctx.fillStyle = "#fff6f8";
  roundRect(-27 + leftStride, 91, 19, 11, 6);
  ctx.fill();
  roundRect(8 + rightStride, 91, 19, 11, 6);
  ctx.fill();
  ctx.strokeStyle = outline;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Uniform skirt.
  const skirt = ctx.createLinearGradient(0, 20, 0, 53);
  skirt.addColorStop(0, "#ffffff");
  skirt.addColorStop(1, "#ffd1dc");
  ctx.fillStyle = skirt;
  ctx.beginPath();
  ctx.moveTo(-26, 20);
  ctx.lineTo(26, 20);
  ctx.lineTo(17, 53);
  ctx.lineTo(-17, 53);
  ctx.closePath();
  ctx.fill();

  // Torso with a shaped silhouette.
  const bodyGradient = ctx.createLinearGradient(0, -58, 0, 24);
  bodyGradient.addColorStop(0, uniform.top);
  bodyGradient.addColorStop(1, uniform.bottom);
  ctx.fillStyle = bodyGradient;
  ctx.beginPath();
  ctx.moveTo(-32, -46);
  ctx.quadraticCurveTo(-38, -8, -27, 20);
  ctx.quadraticCurveTo(-16, 35, 0, 35);
  ctx.quadraticCurveTo(16, 35, 27, 20);
  ctx.quadraticCurveTo(38, -8, 32, -46);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = uniform.stripe;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-27, -18);
  ctx.lineTo(27, -18);
  ctx.stroke();
  ctx.strokeStyle = uniform.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-28, -12);
  ctx.lineTo(28, -12);
  ctx.stroke();

  // Arms.
  const cheerRaise = cheerLift * 1.05;
  const leftArmX = -52 - cheerRaise * 9;
  const rightArmX = 52 + cheerRaise * 9;
  const handY = 9 - cheerRaise * 30;
  ctx.strokeStyle = skinTone;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-28, -30);
  ctx.quadraticCurveTo(-44, -20 - cheerRaise * 6, leftArmX, handY);
  ctx.moveTo(28, -30);
  ctx.quadraticCurveTo(44, -20 - cheerRaise * 6, rightArmX, handY);
  ctx.stroke();

  ctx.fillStyle = skinTone;
  ctx.beginPath();
  ctx.arc(leftArmX, handY, 6, 0, Math.PI * 2);
  ctx.arc(rightArmX, handY, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffe8c2";
  ctx.beginPath();
  ctx.ellipse(0, -50, 13, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#143357";
  ctx.font = "900 20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("C", 0, 4);

  drawPom(leftArmX - 7, handY + 3, 22, time + 0.6, pomColors);
  drawPom(rightArmX + 7, handY + 3, 22, time + 1.9, pomColors);
  drawCamoraPortrait(0, -88, 36);
  ctx.restore();
}

function drawPom(x, y, r, time, palette = pomThemes.classic) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 5) * 0.35);
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 2;
    ctx.strokeStyle = palette[i % palette.length];
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.restore();
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.save();
    ctx.globalAlpha = clamp(p.life, 0, 1);
    if (p.type === "text") {
      ctx.fillStyle = p.color;
      ctx.strokeStyle = "rgba(20,51,87,0.45)";
      ctx.lineWidth = 4;
      ctx.font = "950 26px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillText(p.text, p.x, p.y);
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function drawTrail() {
  for (const trail of state.trail) {
    ctx.save();
    ctx.globalAlpha = clamp(trail.life * 0.75, 0, 1);
    const g = ctx.createRadialGradient(trail.x, trail.y, 0, trail.x, trail.y, trail.r);
    g.addColorStop(0, trail.hue);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(trail.x, trail.y, trail.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawTopGameText(w) {
  ctx.save();
  const chapter = chapterForLevel(state.save.level);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "900 18px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Tide ${state.tideLevel}`, 24, 34);
  ctx.textAlign = "center";
  ctx.fillText(`${chapter.id} | L${state.save.level}`, w * 0.5, 34);
  ctx.textAlign = "right";
  ctx.fillText(`${state.combo}x Rally`, w - 24, 34);
  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function draw() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  if (state.screenShake > 0) {
    ctx.translate(rand(-7, 7) * state.screenShake * 3, rand(-7, 7) * state.screenShake * 3);
  }
  drawBackground(w, h);
  for (const item of state.items) drawItem(item);
  drawTrail();
  drawCamora(state.camoraX || state.laneX[state.lane], state.camoraY || h * 0.78, state.time);
  drawParticles();
  drawTopGameText(w);
  ctx.restore();
}

function loop(now) {
  const dt = Math.min(0.034, (now - state.lastFrame) / 1000 || 0);
  state.lastFrame = now;
  updateGame(dt);
  draw();
  requestAnimationFrame(loop);
}

function chime(freq, duration, type = "sine") {
  if (!state.save.settings.sfxEnabled) return;
  try {
    const ctxAudio = ensureAudioSystem();
    if (!ctxAudio || !state.sfxGain) return;
    const osc = ctxAudio.createOscillator();
    const gain = ctxAudio.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctxAudio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctxAudio.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctxAudio.currentTime + duration);
    osc.connect(gain).connect(state.sfxGain);
    osc.start();
    osc.stop(ctxAudio.currentTime + duration + 0.02);
  } catch {
    state.save.settings.sfxEnabled = false;
    state.save.settings.musicEnabled = false;
    state.save.settings.sound = false;
    stopMusicLoop();
  }
}

function isTypingTarget(target) {
  if (!target || !(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function keyHandler(event) {
  const key = event.key.toLowerCase();
  if (state.helpOpen) {
    if (event.key === "Escape" || key === "h") {
      event.preventDefault();
      closeHelp();
    }
    return;
  }
  if (state.audioOpen) {
    if (event.key === "Escape" || key === "m") {
      event.preventDefault();
      closeAudioSettings();
    }
    return;
  }
  // Let players type normally in forms without triggering gameplay hotkeys.
  if (isTypingTarget(event.target)) {
    return;
  }
  if (key === "m") {
    event.preventDefault();
    openAudioSettings();
    return;
  }
  if (key === "h") {
    event.preventDefault();
    openHelp();
    return;
  }
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    event.preventDefault();
    moveLane(-1);
  }
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    event.preventDefault();
    moveLane(1);
  }
  if (event.key === " " || event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
    event.preventDefault();
    if (!state.playing && els.authModal.classList.contains("hidden")) {
      resetRound(false);
    } else {
      cheer();
    }
  }
  if (key === "p") {
    if (state.playing) showReady("Paused", "The reef is holding your place.");
    else if (els.authModal.classList.contains("hidden")) resetRound(state.practice);
  }
  if (event.key === "Escape") {
    event.preventDefault();
    stopCurrentRun();
  }
}

let touchStart = null;
function touchStartHandler(event) {
  if (state.helpOpen || state.audioOpen) return;
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
}

function touchEndHandler(event) {
  if (state.helpOpen || state.audioOpen) return;
  if (!touchStart) return;
  const touch = event.changedTouches[0];
  const dx = touch.clientX - touchStart.x;
  const dy = touch.clientY - touchStart.y;
  if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
    moveLane(dx > 0 ? 1 : -1);
  } else if (Math.abs(dy) < 44) {
    cheer();
  }
  touchStart = null;
}

function bindEvents() {
  window.addEventListener("resize", () => {
    resizeCanvas();
    setupFloaters();
    setupAmbientEncounters();
  });
  window.addEventListener("keydown", keyHandler);
  canvas.addEventListener("touchstart", touchStartHandler, { passive: true });
  canvas.addEventListener("touchend", touchEndHandler, { passive: true });

  els.leftBtn.addEventListener("click", () => moveLane(-1));
  els.rightBtn.addEventListener("click", () => moveLane(1));
  els.cheerBtn.addEventListener("click", cheer);
  els.audioSettingsBtn.addEventListener("click", () => {
    ensureAudioSystem();
    openAudioSettings();
  });
  els.howToPlayBtn.addEventListener("click", openHelp);
  els.signOutBtn.addEventListener("click", signOutPlayer);
  els.closeHelpBtn.addEventListener("click", closeHelp);
  els.helpModal.addEventListener("click", event => {
    if (event.target === els.helpModal) closeHelp();
  });
  els.closeAudioBtn.addEventListener("click", closeAudioSettings);
  els.audioModal.addEventListener("click", event => {
    if (event.target === els.audioModal) closeAudioSettings();
  });
  els.sfxToggle.addEventListener("change", () => {
    updateAudioSettings({ sfxEnabled: els.sfxToggle.checked });
    chime(620, 0.06, "triangle");
  });
  els.musicToggle.addEventListener("change", () => {
    updateAudioSettings({ musicEnabled: els.musicToggle.checked });
  });
  els.sfxVolume.addEventListener("input", () => {
    updateAudioSettings({ sfxVolume: Number(els.sfxVolume.value) || 0 });
  });
  els.musicVolume.addEventListener("input", () => {
    updateAudioSettings({ musicVolume: Number(els.musicVolume.value) || 0 });
  });
  els.reducedMotionToggle.addEventListener("change", () => {
    updateAudioSettings({ reducedMotion: els.reducedMotionToggle.checked });
    if (els.reducedMotionToggle.checked) {
      state.screenShake = 0;
      state.cheerPulse = 0;
    }
  });
  els.uniformSelect.addEventListener("change", () => {
    updateCustomization({ uniformTheme: els.uniformSelect.value });
  });
  els.pomSelect.addEventListener("change", () => {
    updateCustomization({ pomTheme: els.pomSelect.value });
  });
  els.trailSelect.addEventListener("change", () => {
    updateCustomization({ trailTheme: els.trailSelect.value });
  });
  els.playBtn.addEventListener("click", () => resetRound(false));
  els.practiceBtn.addEventListener("click", () => resetRound(true));
  els.stopRunBtn.addEventListener("click", stopCurrentRun);
  els.saveNowBtn.addEventListener("click", () => syncSave(true));
  els.createForm.addEventListener("submit", createProfile);
  els.loginForm.addEventListener("submit", loginProfile);
  els.createTab.addEventListener("click", () => switchAuth("create"));
  els.loginTab.addEventListener("click", () => switchAuth("login"));

  window.addEventListener("beforeunload", () => {
    storeSession();
  });
  setInterval(() => syncSave(false), 15000);
}

function boot() {
  loadCamoraFace();
  bindEvents();
  resizeCanvas();
  setupFloaters();
  ensureDailyChallenges();
  setupAmbientEncounters();
  renderPanels();
  updateHud();
  renderAudioSettings();
  if (loadCachedSession()) {
    els.authModal.classList.add("hidden");
    els.playerName.textContent = state.profile.displayName;
    els.reefCode.textContent = state.profile.reefCode;
    renderAudioSettings();
    renderPanels();
    refreshLeaderboard();
    showReady("Welcome Back", "Your reef squad progress is loaded here.");
  } else {
    showReady("Ready?", "Create a Reef Code to start saving progress.");
  }
  requestAnimationFrame(loop);
}

boot();
