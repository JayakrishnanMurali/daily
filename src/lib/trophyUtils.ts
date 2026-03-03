import type { AppState, TrophyId } from "../store/useAppStore";

export const TROPHY_DEFINITIONS: Record<
  TrophyId,
  { label: string; description: string; tier: "bronze" | "silver" | "gold" | "obsidian" }
> = {
  first_task:   { label: "First Flame",    description: "Complete your very first daily task.",                tier: "bronze"  },
  streak_3:     { label: "Ember",          description: "Maintain a 3-day streak.",                            tier: "bronze"  },
  night_owl:    { label: "Night Owl",      description: "Complete your tasks after 10 PM on 3 days.",          tier: "bronze"  },
  early_bird:   { label: "Dawn Keeper",    description: "Complete your tasks before 7 AM on 3 days.",          tier: "bronze"  },
  streak_7:     { label: "Ablaze",         description: "Maintain a 7-day streak.",                            tier: "silver"  },
  perfect_week: { label: "Ironclad",       description: "Complete 7 consecutive days without losing a flame.", tier: "silver"  },
  xp_master:    { label: "XP Master",      description: "Accumulate 1 000 total XP.",                         tier: "silver"  },
  task_juggler: { label: "Juggler",        description: "Complete 3 or more tasks in a single day.",           tier: "silver"  },
  streak_30:    { label: "Inferno",        description: "Maintain a 30-day streak.",                           tier: "gold"    },
  heart_recovery:{ label: "Reborn",        description: "Recover from 1 flame back to full strength.",         tier: "gold"    },
  streak_100:   { label: "Eternal",        description: "Maintain a 100-day streak.",                          tier: "obsidian"},
  streak_365:   { label: "Transcendent",   description: "Maintain a full year — 365 days without stopping.",  tier: "obsidian"},
};

/** Checks which new trophies should be unlocked given the current state */
export function checkTrophyUnlocks(
  state: Pick<AppState, "currentStreak" | "unlockedTrophies" | "hearts" | "history" | "totalXp">
): TrophyId[] {
  const newTrophies: TrophyId[] = [];
  const already = new Set(state.unlockedTrophies);

  // ── Streak milestones ──────────────────────────────────────────────────
  if (!already.has("first_task") && state.history.length >= 1)          newTrophies.push("first_task");
  if (!already.has("streak_3")   && state.currentStreak >= 3)           newTrophies.push("streak_3");
  if (!already.has("streak_7")   && state.currentStreak >= 7)           newTrophies.push("streak_7");
  if (!already.has("streak_30")  && state.currentStreak >= 30)          newTrophies.push("streak_30");
  if (!already.has("streak_100") && state.currentStreak >= 100)         newTrophies.push("streak_100");
  if (!already.has("streak_365") && state.currentStreak >= 365)         newTrophies.push("streak_365");

  // ── XP milestone ──────────────────────────────────────────────────────
  if (!already.has("xp_master") && state.totalXp >= 1000)               newTrophies.push("xp_master");

  // ── Perfect week ──────────────────────────────────────────────────────
  if (!already.has("perfect_week") && state.history.length >= 7) {
    const lastSeven = state.history.slice(-7);
    if (lastSeven.length === 7 && lastSeven.every((d) => d.completed))   newTrophies.push("perfect_week");
  }

  // ── Behavioral: time-of-day ───────────────────────────────────────────
  const completedRecords = state.history.filter((d) => d.completed);

  if (!already.has("night_owl")) {
    const lateNights = completedRecords.filter((d) => (d.completionHour ?? 12) >= 22).length;
    if (lateNights >= 3) newTrophies.push("night_owl");
  }

  if (!already.has("early_bird")) {
    const earlyDays = completedRecords.filter((d) => (d.completionHour ?? 12) < 7).length;
    if (earlyDays >= 3) newTrophies.push("early_bird");
  }

  // ── Behavioral: multi-task juggler ────────────────────────────────────
  if (!already.has("task_juggler")) {
    const juggled = completedRecords.some((d) => (d.taskCount ?? 1) >= 3);
    if (juggled) newTrophies.push("task_juggler");
  }

  return newTrophies;
}
