export function defaultSave() {
  return {
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
  };
}

const allowedDailyChallenges = new Set([
  "sparkle_sprint",
  "perfect_beats",
  "rescue_rush",
  "pompom_pop",
  "treasure_dive",
  "combo_builder"
]);
const allowedUniformThemes = new Set(["sunrise", "reef", "royal"]);
const allowedPomThemes = new Set(["classic", "ocean", "sunset"]);
const allowedTrailThemes = new Set(["sparkle", "starlight", "coral"]);

export function safeSave(save) {
  const base = defaultSave();
  const incoming = save && typeof save === "object" ? save : {};
  const number = (value, fallback = 0, max = 99_999_999) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, Math.min(max, Math.floor(parsed)));
  };
  const stringArray = (value, fallback = [], max = 120) => {
    if (!Array.isArray(value)) return fallback;
    return value
      .map(item => String(item || "").replace(/[^\w .'-]/g, "").trim())
      .filter(Boolean)
      .slice(0, max);
  };
  const clampPercent = (value, fallback) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, Math.min(100, Math.round(parsed)));
  };
  const cleanDate = value => (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null);
  const safeChoice = (value, allowed, fallback) => (allowed.has(value) ? value : fallback);
  const incomingSettings = incoming.settings && typeof incoming.settings === "object" ? incoming.settings : {};
  const incomingDaily = incoming.daily && typeof incoming.daily === "object" ? incoming.daily : {};
  const incomingCustom = incoming.customization && typeof incoming.customization === "object" ? incoming.customization : {};
  const legacySoundOff = incomingSettings.sound === false;
  const sfxEnabled = incomingSettings.sfxEnabled !== undefined ? Boolean(incomingSettings.sfxEnabled) : !legacySoundOff;
  const musicEnabled = incomingSettings.musicEnabled !== undefined ? Boolean(incomingSettings.musicEnabled) : !legacySoundOff;
  const activeChallenges = stringArray(incomingDaily.activeChallenges, [], 3).filter(id => allowedDailyChallenges.has(id));
  const progressSource = incomingDaily.progress && typeof incomingDaily.progress === "object" ? incomingDaily.progress : {};
  const dailyProgress = {};
  for (const challengeId of activeChallenges) {
    dailyProgress[challengeId] = number(progressSource[challengeId], 0, 9999);
  }

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
    unlockedAnimals: stringArray(incoming.unlockedAnimals, base.unlockedAnimals, 40),
    seaAnimalCards: stringArray(incoming.seaAnimalCards, [], 120),
    stickerBook: stringArray(incoming.stickerBook, [], 120),
    badges: stringArray(incoming.badges, [], 120),
    labFacts: stringArray(incoming.labFacts, [], 120),
    lastPlayedAt: typeof incoming.lastPlayedAt === "string" ? incoming.lastPlayedAt.slice(0, 40) : null,
    missions: {
      shellSprint: number(incoming.missions?.shellSprint),
      cheerChain: number(incoming.missions?.cheerChain),
      animalAlly: number(incoming.missions?.animalAlly),
      cleanReef: number(incoming.missions?.cleanReef),
      treasureTrail: number(incoming.missions?.treasureTrail)
    },
    daily: {
      dateKey: cleanDate(incomingDaily.dateKey),
      streak: number(incomingDaily.streak, 0, 999),
      completedToday: Boolean(incomingDaily.completedToday),
      lastCompletedDate: cleanDate(incomingDaily.lastCompletedDate),
      activeChallenges,
      progress: dailyProgress
    },
    customization: {
      uniformTheme: safeChoice(incomingCustom.uniformTheme, allowedUniformThemes, base.customization.uniformTheme),
      pomTheme: safeChoice(incomingCustom.pomTheme, allowedPomThemes, base.customization.pomTheme),
      trailTheme: safeChoice(incomingCustom.trailTheme, allowedTrailThemes, base.customization.trailTheme)
    },
    settings: {
      reducedMotion: Boolean(incomingSettings.reducedMotion),
      sound: incomingSettings.sound !== false && (sfxEnabled || musicEnabled),
      sfxEnabled,
      musicEnabled,
      sfxVolume: clampPercent(incomingSettings.sfxVolume, base.settings.sfxVolume),
      musicVolume: clampPercent(incomingSettings.musicVolume, base.settings.musicVolume)
    }
  };
}

export function publicProfile(profile) {
  return {
    reefCode: profile.reefCode,
    displayName: profile.displayName,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    save: profile.save
  };
}
