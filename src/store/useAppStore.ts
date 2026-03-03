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
export type CosmeticCategory = "frame" | "aura" | "backdrop";

export type CosmeticId =
  // Avatar frames
  | "frame_ember"      // Amber thin ring      — 100 XP
  | "frame_blaze"      // Gold pulsing ring     — 350 XP
  | "frame_arcane"     // Purple geometric      — 700 XP
  | "frame_prismatic"  // Rainbow animated      — 1 400 XP
  | "frame_circuit"    // Electric cyan circuit — 450 XP
  | "frame_nature"     // Forest green organic  — 400 XP
  | "frame_storm"      // Lightning white ring  — 850 XP
  // Mascot auras
  | "aura_fire"        // Orange ambient        — 150 XP
  | "aura_frost"       // Cool blue ambient     — 150 XP
  | "aura_void"        // Deep purple           — 350 XP
  | "aura_solar"       // Radiant gold          — 600 XP
  | "aura_nature"      // Forest green          — 250 XP
  | "aura_storm"       // Electric cyan         — 500 XP
  | "aura_blood"       // Deep crimson          — 400 XP
  // Dashboard backdrops
  | "bg_ember"         // Warm amber radial     — 200 XP
  | "bg_cosmos"        // Deep space starfield  — 400 XP
  | "bg_aurora"        // Northern lights teal  — 550 XP
  | "bg_inferno";      // Intense inferno red   — 750 XP

export interface CosmeticDefinition {
  id: CosmeticId;
  label: string;
  description: string;
  category: CosmeticCategory;
  cost: number;
}

export const COSMETIC_DEFINITIONS: CosmeticDefinition[] = [
  // ── Frames ────────────────────────────────────────────────────────────────
  { id: "frame_ember",     label: "Ember Ring",      description: "A soft amber ring — your first mark of fire.",     category: "frame",    cost: 100  },
  { id: "frame_nature",    label: "Wildwood Ring",   description: "A deep forest-green ring. Calm and grounded.",     category: "frame",    cost: 400  },
  { id: "frame_blaze",     label: "Blaze Crown",     description: "A pulsing gold ring that breathes with fire.",     category: "frame",    cost: 350  },
  { id: "frame_circuit",   label: "Circuit Band",    description: "Electric cyan — wired for relentless output.",     category: "frame",    cost: 450  },
  { id: "frame_arcane",    label: "Arcane Seal",     description: "A purple geometric border forged in the void.",    category: "frame",    cost: 700  },
  { id: "frame_storm",     label: "Storm Halo",      description: "Crackling white lightning. Power barely contained.",category: "frame",   cost: 850  },
  { id: "frame_prismatic", label: "Prismatic Halo",  description: "A shifting rainbow reserved for the legendary.",  category: "frame",    cost: 1400 },
  // ── Auras ─────────────────────────────────────────────────────────────────
  { id: "aura_fire",       label: "Fire Aura",       description: "Warm orange energy — born from the flame.",       category: "aura",     cost: 150  },
  { id: "aura_frost",      label: "Frost Aura",      description: "Icy blue discipline for the coldest mindset.",    category: "aura",     cost: 150  },
  { id: "aura_nature",     label: "Grove Aura",      description: "Forest-green calm. Patient growth.",              category: "aura",     cost: 250  },
  { id: "aura_blood",      label: "Blood Aura",      description: "Crimson intensity. No mercy for failure.",        category: "aura",     cost: 400  },
  { id: "aura_void",       label: "Void Aura",       description: "Dark purple energy leaking from another plane.",  category: "aura",     cost: 350  },
  { id: "aura_storm",      label: "Storm Aura",      description: "Electric cyan voltage — always in motion.",       category: "aura",     cost: 500  },
  { id: "aura_solar",      label: "Solar Aura",      description: "Blinding radiance for the truly committed.",      category: "aura",     cost: 600  },
  // ── Backdrops ─────────────────────────────────────────────────────────────
  { id: "bg_ember",        label: "Ember Sky",       description: "Warm amber glow behind your mascot.",             category: "backdrop", cost: 200  },
  { id: "bg_cosmos",       label: "Deep Space",      description: "A starfield stretching into the infinite.",       category: "backdrop", cost: 400  },
  { id: "bg_aurora",       label: "Aurora Veil",     description: "Teal-green northern lights dancing softly.",      category: "backdrop", cost: 550  },
  { id: "bg_inferno",      label: "Inferno Core",    description: "A hellfire backdrop for the unbreakable.",        category: "backdrop", cost: 750  },
];

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
  completionHour?: number; // 0–23, hour when all tasks were completed
  taskCount?: number;      // how many tasks were completed that day
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

  // Cosmetics
  ownedCosmetics: CosmeticId[];
  equippedFrame: CosmeticId | null;
  equippedAura: CosmeticId | null;
  equippedBackdrop: CosmeticId | null;

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
      equippedFrame: null,
      equippedAura: null,
      equippedBackdrop: null,

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
        if (category === "frame")    set({ equippedFrame: id });
        else if (category === "aura") set({ equippedAura: id });
        else                          set({ equippedBackdrop: id });
      },
    }),
    {
      name: "daily-app-storage",
      version: 4,
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
          old["equippedFrame"] = null;
          old["equippedAura"] = null;
        }
        if (fromVersion < 4) {
          old["equippedBackdrop"] = null;
        }
        return old as unknown as AppState;
      },
    }
  )
);
