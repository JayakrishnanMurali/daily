import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getTodayDate, getYesterdayDate, daysBetween, getCurrentHour } from "../lib/dateUtils";
import { checkTrophyUnlocks } from "../lib/trophyUtils";

// ─── Trophy IDs ────────────────────────────────────────────────────────────
export type TrophyId =
  | "first_task"
  | "streak_3"
  | "streak_7"
  | "perfect_week"
  | "streak_30"
  | "heart_recovery"
  | "streak_100"
  | "streak_365"
  // Rare behavioral trophies
  | "night_owl"     // Complete tasks 3× after 10 PM
  | "early_bird"    // Complete tasks 3× before 7 AM
  | "xp_master"     // Accumulate 1 000 total XP
  | "task_juggler"; // Complete 3+ tasks in a single day

// ─── Cosmetics ─────────────────────────────────────────────────────────────
export type CosmeticCategory = "eyes" | "mouth" | "hair" | "outfit" | "hat" | "accessory" | "scene";

export type CosmeticId =
  // Eyes
  | "eyes_sleepy"      // Half-lidded, relaxed           — 75 XP
  | "eyes_wide"        // Big round with sparkle          — 100 XP
  | "eyes_sparkle"     // Stars in their eyes             — 175 XP
  | "eyes_heart"       // Heart-shaped eyes               — 200 XP
  | "eyes_wink"        // One eye closed, mischievous     — 125 XP
  | "eyes_glasses"     // Round wireframe glasses         — 250 XP
  | "eyes_shades"      // Dark cool sunglasses            — 300 XP
  // Mouths
  | "mouth_grin"       // Wide toothy grin                — 75 XP
  | "mouth_o"          // Surprised little O              — 75 XP
  | "mouth_smirk"      // One-sided smirk                 — 100 XP
  | "mouth_tongue"     // Playful tongue out              — 150 XP
  | "mouth_cat"        // Cute cat-style mouth            — 200 XP
  | "mouth_teeth"      // Big cheerful smile              — 150 XP
  | "mouth_whistle"    // Puckered for whistling          — 100 XP
  // Hair
  | "hair_messy"       // Tousled and carefree            — 100 XP
  | "hair_spiky"       // Sharp energy spikes             — 150 XP
  | "hair_bob"         // Clean rounded bob               — 200 XP
  | "hair_ponytail"    // Perky side ponytail             — 200 XP
  | "hair_mohawk"      // Bold center strip               — 300 XP
  | "hair_curly"       // Cloud of curls                  — 200 XP
  | "hair_long"        // Flowing long hair               — 250 XP
  // Outfits
  | "outfit_hoodie"    // Cozy pullover hoodie            — 200 XP
  | "outfit_suit"      // Sharp blazer and tie            — 350 XP
  | "outfit_jersey"    // Sports team jersey              — 200 XP
  | "outfit_dress"     // Cute A-line dress               — 300 XP
  | "outfit_armor"     // Legendary plate armor           — 500 XP
  | "outfit_cape"      // Dramatic flowing cape           — 400 XP
  | "outfit_labcoat"   // Scientific lab coat             — 300 XP
  // Hats
  | "hat_beanie"       // Warm knit beanie                — 150 XP
  | "hat_crown"        // Royal golden crown              — 400 XP
  | "hat_wizard"       // Mystical wizard hat             — 350 XP
  | "hat_cap"          // Classic baseball cap            — 150 XP
  | "hat_headband"     // Simple headband                 — 100 XP
  | "hat_horns"        // Mischievous horns               — 300 XP
  | "hat_astro"        // Astronaut helmet                — 500 XP
  // Accessories
  | "acc_backpack"     // Ready-for-anything backpack     — 200 XP
  | "acc_wings"        // Feathery angel wings            — 400 XP
  | "acc_halo"         // Floating golden halo            — 300 XP
  | "acc_sword"        // Heroic broadsword               — 350 XP
  | "acc_coffee"       // Steaming coffee mug             — 150 XP
  | "acc_scarf"        // Cozy wrapped scarf              — 200 XP
  | "acc_headphones"   // Music headphones                — 250 XP
  // Scenes (backgrounds)
  | "bg_ember"         // Warm amber radial               — 200 XP
  | "bg_cosmos"        // Deep space starfield            — 400 XP
  | "bg_aurora"        // Northern lights teal            — 550 XP
  | "bg_inferno"       // Intense inferno red             — 750 XP
  | "bg_sunset";       // Golden hour sunset              — 300 XP

export interface CosmeticDefinition {
  id: CosmeticId;
  label: string;
  description: string;
  category: CosmeticCategory;
  cost: number;
}

export const COSMETIC_DEFINITIONS: CosmeticDefinition[] = [
  // ── Eyes ──────────────────────────────────────────────────────────────────
  { id: "eyes_sleepy",    label: "Sleepy Eyes",    description: "Half-lidded, totally relaxed.",              category: "eyes",      cost: 75  },
  { id: "eyes_wide",      label: "Wide Eyes",      description: "Big round eyes full of wonder.",             category: "eyes",      cost: 100 },
  { id: "eyes_sparkle",   label: "Sparkle Eyes",   description: "Star reflections — always amazed.",          category: "eyes",      cost: 175 },
  { id: "eyes_heart",     label: "Heart Eyes",     description: "You're absolutely smitten.",                 category: "eyes",      cost: 200 },
  { id: "eyes_wink",      label: "Wink",           description: "One eye closed. Mischievous.",               category: "eyes",      cost: 125 },
  { id: "eyes_glasses",   label: "Glasses",        description: "Round wireframe glasses. Big brain energy.", category: "eyes",      cost: 250 },
  { id: "eyes_shades",    label: "Shades",         description: "Dark rectangular shades. Too cool.",         category: "eyes",      cost: 300 },
  // ── Mouths ────────────────────────────────────────────────────────────────
  { id: "mouth_grin",     label: "Big Grin",       description: "Ear-to-ear toothy grin.",                   category: "mouth",     cost: 75  },
  { id: "mouth_o",        label: "Surprised O",    description: "Whoa — wasn't expecting that!",              category: "mouth",     cost: 75  },
  { id: "mouth_smirk",    label: "Smirk",          description: "Asymmetric half-smile. You know things.",    category: "mouth",     cost: 100 },
  { id: "mouth_tongue",   label: "Tongue Out",     description: "Playful and a little chaotic.",              category: "mouth",     cost: 150 },
  { id: "mouth_cat",      label: "Cat Mouth",      description: "Cute little w-shaped cat mouth.",            category: "mouth",     cost: 200 },
  { id: "mouth_teeth",    label: "Cheesy Smile",   description: "Full-on cheerful big smile.",                category: "mouth",     cost: 150 },
  { id: "mouth_whistle",  label: "Whistle",        description: "Cool, calm, and whistling away.",            category: "mouth",     cost: 100 },
  // ── Hair ──────────────────────────────────────────────────────────────────
  { id: "hair_messy",     label: "Messy",          description: "Tousled bedhead. Effortlessly cool.",        category: "hair",      cost: 100 },
  { id: "hair_spiky",     label: "Spiky",          description: "Sharp upward spikes. Pure energy.",          category: "hair",      cost: 150 },
  { id: "hair_bob",       label: "Bob",            description: "Clean rounded bob cut.",                     category: "hair",      cost: 200 },
  { id: "hair_ponytail",  label: "Ponytail",       description: "Perky side ponytail.",                       category: "hair",      cost: 200 },
  { id: "hair_mohawk",    label: "Mohawk",         description: "Bold center strip. Maximum personality.",    category: "hair",      cost: 300 },
  { id: "hair_curly",     label: "Curly",          description: "Bouncy cloud of curls.",                     category: "hair",      cost: 200 },
  { id: "hair_long",      label: "Long",           description: "Flowing long hair for the dramatic.",        category: "hair",      cost: 250 },
  // ── Outfits ───────────────────────────────────────────────────────────────
  { id: "outfit_hoodie",  label: "Hoodie",         description: "Cozy pullover hoodie. Grind mode.",          category: "outfit",    cost: 200 },
  { id: "outfit_suit",    label: "Suit",           description: "Sharp blazer and tie. CEO energy.",          category: "outfit",    cost: 350 },
  { id: "outfit_jersey",  label: "Jersey",         description: "Sports team jersey. Let's go.",              category: "outfit",    cost: 200 },
  { id: "outfit_dress",   label: "Dress",          description: "Cute A-line dress.",                         category: "outfit",    cost: 300 },
  { id: "outfit_armor",   label: "Armor",          description: "Legendary plate armor. Unbreakable.",        category: "outfit",    cost: 500 },
  { id: "outfit_cape",    label: "Cape",           description: "Dramatic flowing cape. Heroic.",             category: "outfit",    cost: 400 },
  { id: "outfit_labcoat", label: "Lab Coat",       description: "Scientific lab coat. Always experimenting.", category: "outfit",    cost: 300 },
  // ── Hats ──────────────────────────────────────────────────────────────────
  { id: "hat_beanie",     label: "Beanie",         description: "Warm knit beanie. Cozy and focused.",        category: "hat",       cost: 150 },
  { id: "hat_crown",      label: "Crown",          description: "Royal golden crown. You earned it.",         category: "hat",       cost: 400 },
  { id: "hat_wizard",     label: "Wizard Hat",     description: "Mystical pointed hat. Ancient power.",       category: "hat",       cost: 350 },
  { id: "hat_cap",        label: "Cap",            description: "Classic baseball cap. Everyday grind.",      category: "hat",       cost: 150 },
  { id: "hat_headband",   label: "Headband",       description: "Simple headband. Locked in.",                category: "hat",       cost: 100 },
  { id: "hat_horns",      label: "Horns",          description: "Mischievous devil horns.",                   category: "hat",       cost: 300 },
  { id: "hat_astro",      label: "Astronaut",      description: "Glass dome helmet. Beyond limits.",          category: "hat",       cost: 500 },
  // ── Accessories ───────────────────────────────────────────────────────────
  { id: "acc_backpack",   label: "Backpack",       description: "Ready for anything. Always prepared.",       category: "accessory", cost: 200 },
  { id: "acc_wings",      label: "Angel Wings",    description: "Feathery wings. You're ascending.",          category: "accessory", cost: 400 },
  { id: "acc_halo",       label: "Halo",           description: "Floating golden halo. Pure goodness.",       category: "accessory", cost: 300 },
  { id: "acc_sword",      label: "Sword",          description: "Heroic broadsword. Slaying goals daily.",    category: "accessory", cost: 350 },
  { id: "acc_coffee",     label: "Coffee",         description: "Steaming mug. Fuel for the grind.",          category: "accessory", cost: 150 },
  { id: "acc_scarf",      label: "Scarf",          description: "Cozy wrapped scarf. Warm vibes.",            category: "accessory", cost: 200 },
  { id: "acc_headphones", label: "Headphones",     description: "Music headphones. In the zone.",             category: "accessory", cost: 250 },
  // ── Scenes ────────────────────────────────────────────────────────────────
  { id: "bg_ember",       label: "Ember",          description: "Warm amber glow. Your flame burns bright.",  category: "scene",     cost: 200 },
  { id: "bg_sunset",      label: "Sunset",         description: "Golden hour warmth. Endless drive.",         category: "scene",     cost: 300 },
  { id: "bg_cosmos",      label: "Deep Space",     description: "A starfield stretching into the infinite.",  category: "scene",     cost: 400 },
  { id: "bg_aurora",      label: "Aurora",         description: "Northern lights dancing softly.",            category: "scene",     cost: 550 },
  { id: "bg_inferno",     label: "Inferno",        description: "Hellfire backdrop for the unbreakable.",     category: "scene",     cost: 750 },
];

// ─── Skin colors (free, not a cosmetic purchase) ───────────────────────────
export const SKIN_COLORS: Record<string, { fill: string; label: string }> = {
  amber:    { fill: "hsl(38 90% 62%)",  label: "Amber"    },
  coral:    { fill: "hsl(12 80% 68%)",  label: "Coral"    },
  peach:    { fill: "hsl(25 80% 75%)",  label: "Peach"    },
  mint:     { fill: "hsl(160 45% 65%)", label: "Mint"     },
  lavender: { fill: "hsl(265 40% 72%)", label: "Lavender" },
  sky:      { fill: "hsl(200 60% 68%)", label: "Sky"      },
  sage:     { fill: "hsl(140 30% 62%)", label: "Sage"     },
  warm:     { fill: "hsl(30 55% 60%)",  label: "Warm"     },
};

// ─── Data models ───────────────────────────────────────────────────────────
export interface DailyTask {
  id: string;
  title: string;
}

export interface DayRecord {
  date: string;
  completed: boolean;
  heartsAtEnd: number;
  xpEarned: number;
  completionHour?: number;
  taskCount?: number;
}

export interface Wager {
  amount: number;
  fridayDate: string;
  saturdayCompleted: boolean;
  sundayCompleted: boolean;
  resolved: boolean;
}

// ─── State interface ────────────────────────────────────────────────────────
export interface AppState {
  hasOnboarded: boolean;
  dailyTasks: DailyTask[];
  completedTaskIds: string[];
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  lastCheckedDate: string | null;
  hearts: number;
  totalXp: number;
  todayCompleted: boolean;
  history: DayRecord[];
  unlockedTrophies: TrophyId[];
  newlyUnlockedTrophies: TrophyId[];
  devastatedMode: boolean;
  showCelebration: boolean;
  activeWager: Wager | null;

  // Avatar cosmetics
  ownedCosmetics: CosmeticId[];
  skinColor: string;
  equippedEyes: CosmeticId | null;
  equippedMouth: CosmeticId | null;
  equippedHair: CosmeticId | null;
  equippedOutfit: CosmeticId | null;
  equippedHat: CosmeticId | null;
  equippedAccessory: CosmeticId | null;
  equippedScene: CosmeticId | null;

  // Actions
  onboard: (firstTask: string) => void;
  addDailyTask: (title: string) => void;
  removeDailyTask: (id: string) => void;
  updateDailyTask: (id: string, title: string) => void;
  toggleTaskCompletion: (id: string) => void;
  checkDailyStreak: () => void;
  exitDevastatedMode: () => void;
  buyHeart: () => void;
  startWager: (amount: number) => void;
  resolveWager: (saturdayDone: boolean, sundayDone: boolean) => void;
  dismissCelebration: () => void;
  clearNewTrophies: () => void;
  purchaseCosmetic: (id: CosmeticId) => void;
  equipCosmetic: (category: CosmeticCategory, id: CosmeticId | null) => void;
  setSkinColor: (colorKey: string) => void;
  resetAccount: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const MAX_TASKS = 5;
const XP_PER_DAY_BASE = 100;

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function calculateXpForStreak(streak: number): number {
  return XP_PER_DAY_BASE + Math.floor(streak / 7) * 25;
}

function runDayComplete(get: () => AppState, set: (p: Partial<AppState>) => void) {
  const state = get();
  if (state.todayCompleted) return;

  const today = getTodayDate();
  const completionHour = getCurrentHour();
  const newStreak = state.currentStreak + 1;
  const xpEarned = calculateXpForStreak(newStreak);
  const taskCount = state.completedTaskIds.filter((id) =>
    state.dailyTasks.some((t) => t.id === id)
  ).length;

  const newHistoryEntry: DayRecord = {
    date: today,
    completed: true,
    heartsAtEnd: state.hearts,
    xpEarned,
    completionHour,
    taskCount,
  };

  let newHearts = state.hearts;
  const newTotalXp = state.totalXp + xpEarned;
  const newLongest = Math.max(state.longestStreak, newStreak);

  const nextState = {
    todayCompleted: true,
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastCompletedDate: today,
    totalXp: newTotalXp,
    history: [...state.history, newHistoryEntry],
    hearts: newHearts,
    showCelebration: true,
  };

  const potentialState = { ...state, ...nextState };
  const newTrophies = checkTrophyUnlocks({ ...potentialState, history: potentialState.history });

  if (newTrophies.includes("perfect_week") && newHearts < 3) {
    newHearts = Math.min(3, newHearts + 1);
  }
  if (state.hearts === 1 && newHearts > 1 && !state.unlockedTrophies.includes("heart_recovery")) {
    newTrophies.push("heart_recovery");
  }

  set({
    ...nextState,
    hearts: newHearts,
    unlockedTrophies: [...state.unlockedTrophies, ...newTrophies],
    newlyUnlockedTrophies: newTrophies,
  });
}

// ─── Store ──────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      dailyTasks: [],
      completedTaskIds: [],
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      lastCheckedDate: null,
      hearts: 3,
      totalXp: 0,
      todayCompleted: false,
      history: [],
      unlockedTrophies: [],
      newlyUnlockedTrophies: [],
      devastatedMode: false,
      showCelebration: false,
      activeWager: null,
      ownedCosmetics: [],
      skinColor: "amber",
      equippedEyes: null,
      equippedMouth: null,
      equippedHair: null,
      equippedOutfit: null,
      equippedHat: null,
      equippedAccessory: null,
      equippedScene: null,

      onboard: (firstTask) => set({
        hasOnboarded: true,
        dailyTasks: [{ id: generateId(), title: firstTask }],
        completedTaskIds: [],
        lastCheckedDate: getTodayDate(),
      }),

      addDailyTask: (title) => {
        const state = get();
        if (state.dailyTasks.length >= MAX_TASKS) return;
        const trimmed = title.trim();
        if (!trimmed) return;
        set({ dailyTasks: [...state.dailyTasks, { id: generateId(), title: trimmed }] });
      },

      removeDailyTask: (id) => {
        const state = get();
        if (state.dailyTasks.length <= 1) return;
        set({
          dailyTasks: state.dailyTasks.filter((t) => t.id !== id),
          completedTaskIds: state.completedTaskIds.filter((cid) => cid !== id),
        });
      },

      updateDailyTask: (id, title) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const state = get();
        set({ dailyTasks: state.dailyTasks.map((t) => t.id === id ? { ...t, title: trimmed } : t) });
      },

      toggleTaskCompletion: (id) => {
        const state = get();
        if (state.todayCompleted) return;
        const alreadyDone = state.completedTaskIds.includes(id);
        const newCompletedIds = alreadyDone
          ? state.completedTaskIds.filter((cid) => cid !== id)
          : [...state.completedTaskIds, id];
        set({ completedTaskIds: newCompletedIds });
        const allTaskIds = get().dailyTasks.map((t) => t.id);
        const allDone = allTaskIds.length > 0 && allTaskIds.every((tid) => newCompletedIds.includes(tid));
        if (allDone) runDayComplete(get, set);
      },

      checkDailyStreak: () => {
        const state = get();
        const today = getTodayDate();
        if (state.lastCheckedDate === today) return;

        let missedDays = 0;
        if (state.lastCompletedDate !== null && state.lastCompletedDate !== today) {
          const yesterday = getYesterdayDate();
          if (state.lastCompletedDate !== yesterday) {
            missedDays = daysBetween(state.lastCompletedDate, today) - 1;
          }
        }

        const updates: Partial<AppState> = {
          lastCheckedDate: today,
          todayCompleted: false,
          completedTaskIds: [],
        };

        if (missedDays > 0) {
          const newHearts = state.hearts - missedDays;
          if (newHearts <= 0) {
            updates.hearts = 0;
            updates.currentStreak = 0;
            updates.devastatedMode = true;
          } else {
            updates.hearts = newHearts;
          }
        }
        set(updates);
      },

      exitDevastatedMode: () => set({
        devastatedMode: false,
        hearts: 1,
        currentStreak: 0,
        lastCompletedDate: null,
        lastCheckedDate: getTodayDate(),
        todayCompleted: false,
        completedTaskIds: [],
      }),

      buyHeart: () => {
        const state = get();
        if (state.totalXp < 150 || state.hearts >= 3) return;
        set({ totalXp: state.totalXp - 150, hearts: Math.min(3, state.hearts + 1) });
      },

      startWager: (amount) => {
        const state = get();
        if (state.totalXp < amount) return;
        set({
          activeWager: { amount, fridayDate: getTodayDate(), saturdayCompleted: false, sundayCompleted: false, resolved: false },
        });
      },

      resolveWager: (saturdayDone, sundayDone) => {
        const state = get();
        if (!state.activeWager) return;
        const wager = state.activeWager;
        const won = saturdayDone && sundayDone;
        const newXp = won ? state.totalXp + wager.amount * 2 : Math.max(0, state.totalXp - wager.amount);
        const newHearts = won ? state.hearts : Math.max(0, state.hearts - 1);
        const devastated = !won && newHearts === 0;
        set({
          activeWager: { ...wager, saturdayCompleted: saturdayDone, sundayCompleted: sundayDone, resolved: true },
          totalXp: newXp,
          hearts: newHearts,
          devastatedMode: devastated,
          currentStreak: devastated ? 0 : state.currentStreak,
        });
        setTimeout(() => set({ activeWager: null }), 3000);
      },

      dismissCelebration: () => set({ showCelebration: false }),
      clearNewTrophies: () => set({ newlyUnlockedTrophies: [] }),

      purchaseCosmetic: (id) => {
        const state = get();
        if (state.ownedCosmetics.includes(id)) return;
        const def = COSMETIC_DEFINITIONS.find((c) => c.id === id);
        if (!def || state.totalXp < def.cost) return;
        set({
          totalXp: state.totalXp - def.cost,
          ownedCosmetics: [...state.ownedCosmetics, id],
        });
      },

      equipCosmetic: (category, id) => {
        const slotMap: Record<CosmeticCategory, keyof AppState> = {
          eyes:      "equippedEyes",
          mouth:     "equippedMouth",
          hair:      "equippedHair",
          outfit:    "equippedOutfit",
          hat:       "equippedHat",
          accessory: "equippedAccessory",
          scene:     "equippedScene",
        };
        set({ [slotMap[category]]: id });
      },

      setSkinColor: (colorKey) => set({ skinColor: colorKey }),

      resetAccount: () => set({
        hasOnboarded: false,
        dailyTasks: [],
        completedTaskIds: [],
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        lastCheckedDate: null,
        hearts: 3,
        totalXp: 0,
        todayCompleted: false,
        history: [],
        unlockedTrophies: [],
        newlyUnlockedTrophies: [],
        devastatedMode: false,
        showCelebration: false,
        activeWager: null,
        ownedCosmetics: [],
        skinColor: "amber",
        equippedEyes: null,
        equippedMouth: null,
        equippedHair: null,
        equippedOutfit: null,
        equippedHat: null,
        equippedAccessory: null,
        equippedScene: null,
      }),
    }),
    {
      name: "daily-app-storage",
      version: 5,
      migrate: (persisted: unknown, fromVersion: number) => {
        const old = persisted as Record<string, unknown>;
        if (fromVersion < 2) {
          const firstTitle = typeof old["dailyTask"] === "string" && old["dailyTask"]
            ? old["dailyTask"] : "My daily habit";
          old["dailyTasks"] = [{ id: generateId(), title: firstTitle }];
          old["completedTaskIds"] = [];
          delete old["dailyTask"];
          delete old["previousHearts"];
        }
        if (fromVersion < 3) {
          old["ownedCosmetics"] = [];
        }
        if (fromVersion < 5) {
          // Remove old frame/aura/backdrop system
          delete old["equippedFrame"];
          delete old["equippedAura"];
          delete old["equippedBackdrop"];
          // Initialize new avatar slots
          old["skinColor"] = "amber";
          old["equippedEyes"] = null;
          old["equippedMouth"] = null;
          old["equippedHair"] = null;
          old["equippedOutfit"] = null;
          old["equippedHat"] = null;
          old["equippedAccessory"] = null;
          old["equippedScene"] = null;
          // Preserve only bg_ scene items from old owned cosmetics
          const prevOwned = (old["ownedCosmetics"] as string[]) || [];
          old["ownedCosmetics"] = prevOwned.filter((id: string) => id.startsWith("bg_"));
        }
        return old as unknown as AppState;
      },
    }
  )
);
