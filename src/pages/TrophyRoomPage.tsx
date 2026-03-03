import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useAppStore, type TrophyId } from "../store/useAppStore";
import { TrophySVG } from "../components/TrophySVG";
import { TROPHY_DEFINITIONS } from "../lib/trophyUtils";

const ALL_TROPHIES: TrophyId[] = [
  "first_task",
  "streak_3",
  "night_owl",
  "early_bird",
  "streak_7",
  "perfect_week",
  "xp_master",
  "task_juggler",
  "streak_30",
  "heart_recovery",
  "streak_100",
  "streak_365",
];

const TIER_ORDER = { bronze: 0, silver: 1, gold: 2, obsidian: 3 };

const TIER_LABELS: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  obsidian: "Obsidian",
};

const TIER_COLORS: Record<string, string> = {
  bronze: "hsl(25 65% 52%)",
  silver: "hsl(220 18% 72%)",
  gold: "hsl(45 100% 55%)",
  obsidian: "hsl(260 65% 68%)",
};

function TrophyCard({ trophyId, unlocked }: { trophyId: TrophyId; unlocked: boolean }) {
  const def = TROPHY_DEFINITIONS[trophyId];
  const tierColor = TIER_COLORS[def.tier];

  return (
    <motion.div
      className="relative flex flex-col items-center gap-2 rounded-2xl p-4 border transition-all duration-300"
      style={{
        background: unlocked ? "hsl(222 44% 8%)" : "hsl(222 44% 5%)",
        borderColor: unlocked ? `${tierColor}35` : "hsl(0 0% 100% / 0.05)",
        boxShadow: unlocked
          ? `0 0 20px ${tierColor}22, 0 0 4px ${tierColor}15`
          : "none",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileTap={unlocked ? { scale: 0.97 } : {}}
    >
      {/* Lock badge for locked state */}
      {!unlocked && (
        <div className="absolute top-2.5 right-2.5">
          <Lock size={11} className="text-muted-foreground/50" />
        </div>
      )}

      {/* Tier pill */}
      <div
        className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{
          background: unlocked ? `${tierColor}18` : "hsl(0 0% 100% / 0.04)",
          color: unlocked ? tierColor : "hsl(0 0% 30%)",
        }}
      >
        {TIER_LABELS[def.tier]}
      </div>

      {/* Trophy SVG */}
      <TrophySVG trophyId={trophyId} unlocked={unlocked} size={72} />

      {/* Title */}
      <div className="text-center">
        <p
          className="text-sm font-black leading-tight"
          style={{ color: unlocked ? "hsl(0 0% 92%)" : "hsl(0 0% 28%)" }}
        >
          {def.label}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-snug">
          {def.description}
        </p>
      </div>
    </motion.div>
  );
}

function TrophySection({
  tier,
  trophies,
  unlockedSet,
}: {
  tier: string;
  trophies: TrophyId[];
  unlockedSet: Set<TrophyId>;
}) {
  const tierColor = TIER_COLORS[tier];
  const anyUnlocked = trophies.some((id) => unlockedSet.has(id));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className="h-px flex-1"
          style={{ background: anyUnlocked ? `${tierColor}30` : "hsl(0 0% 100% / 0.05)" }}
        />
        <span
          className="text-xs font-black uppercase tracking-widest px-2"
          style={{ color: anyUnlocked ? tierColor : "hsl(0 0% 30%)" }}
        >
          {TIER_LABELS[tier]}
        </span>
        <div
          className="h-px flex-1"
          style={{ background: anyUnlocked ? `${tierColor}30` : "hsl(0 0% 100% / 0.05)" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {trophies.map((id) => (
          <TrophyCard key={id} trophyId={id} unlocked={unlockedSet.has(id)} />
        ))}
      </div>
    </div>
  );
}

export function TrophyRoomPage() {
  const { unlockedTrophies, currentStreak } = useAppStore();
  const unlockedSet = new Set(unlockedTrophies as TrophyId[]);

  // Group by tier, ordered
  const byTier = ALL_TROPHIES.reduce<Record<string, TrophyId[]>>((acc, id) => {
    const tier = TROPHY_DEFINITIONS[id].tier;
    (acc[tier] ??= []).push(id);
    return acc;
  }, {});

  const tiers = Object.keys(TIER_ORDER).sort(
    (a, b) => TIER_ORDER[a as keyof typeof TIER_ORDER] - TIER_ORDER[b as keyof typeof TIER_ORDER]
  );

  return (
    <div className="flex flex-col px-4 py-5 gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Trophy Room</h1>
        <p className="text-xs text-muted-foreground">
          {unlockedTrophies.length} of {ALL_TROPHIES.length} unlocked · Streak {currentStreak}
        </p>
      </div>

      {/* Trophy grid by tier */}
      {tiers.map((tier) => (
        <TrophySection
          key={tier}
          tier={tier}
          trophies={byTier[tier] ?? []}
          unlockedSet={unlockedSet}
        />
      ))}

      <div className="h-2" />
    </div>
  );
}
