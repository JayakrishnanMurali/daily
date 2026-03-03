import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Flame, Trophy, Share2, X } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { FlameDisplay } from "./FlameDisplay";

interface ShareCardProps {
  onClose: () => void;
}

export function ShareCard({ onClose }: ShareCardProps) {
  const {
    currentStreak,
    dailyTasks,
    hearts,
    unlockedTrophies,
    totalXp,
    longestStreak,
  } = useAppStore();

  const handleShare = async () => {
    const taskList = dailyTasks.map((t) => `  ${t.title}`).join("\n");
    const shareText =
      `${currentStreak}-day streak on Daily\n\n` +
      `My tasks:\n${taskList}\n\n` +
      `Trophies: ${unlockedTrophies.length}  ·  XP: ${totalXp.toLocaleString()}  ·  Best: ${longestStreak} days\n\n` +
      `#DailyStreak #BuildInPublic`;

    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "My Daily Streak" });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText).catch(() => {});
      // Could show a toast here
    }
  };

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
      style={{
        background: "hsl(222 47% 4% / 0.85)",
        backdropFilter: "blur(8px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Card — stops propagation so tapping the card doesn't dismiss */}
      <motion.div
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* ── Snapshot card (the shareable visual) ── */}
        <div
          className="relative p-6 space-y-5"
          style={{
            background:
              "linear-gradient(145deg, hsl(222 47% 6%), hsl(222 44% 9%))",
            border: "1px solid hsl(0 0% 100% / 0.08)",
            borderBottom: "none",
            borderRadius: "24px 24px 0 0",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground p-1 rounded-lg"
          >
            <X size={18} />
          </button>

          {/* Branding */}
          <div className="flex items-center gap-2">
            <Flame
              size={16}
              className="text-amber"
              style={{ filter: "drop-shadow(0 0 6px hsl(38 95% 52% / 0.6))" }}
            />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              Daily
            </span>
          </div>

          {/* Streak hero */}
          <div className="text-center py-2">
            <div
              className="text-8xl font-black tabular-nums"
              style={{
                color: "hsl(38 95% 52%)",
                textShadow:
                  "0 0 40px hsl(38 95% 52% / 0.5), 0 0 80px hsl(38 95% 52% / 0.2)",
              }}
            >
              {currentStreak}
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
              day streak
            </p>
          </div>

          {/* Tasks */}
          <div className="space-y-1.5">
            {dailyTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-amber/60 shrink-0 mt-0.5" />
                <span className="text-xs text-foreground/80 font-medium">
                  {task.title}
                </span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <Trophy size={13} className="text-muted-foreground" />
              <span className="text-xs font-bold text-foreground">
                {unlockedTrophies.length}
              </span>
              <span className="text-xs text-muted-foreground">trophies</span>
            </div>
            <FlameDisplay flames={hearts} />
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-amber">
                {totalXp.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">XP</span>
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div
          className="px-4 py-4 flex gap-3"
          style={{
            background: "hsl(222 44% 9%)",
            border: "1px solid hsl(0 0% 100% / 0.08)",
            borderTop: "none",
            borderRadius: "0 0 24px 24px",
          }}
        >
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm glow-amber"
          >
            <Share2 size={16} />
            {navigator.share ? "Share" : "Copy to Clipboard"}
          </motion.button>
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-3.5 rounded-2xl bg-secondary text-muted-foreground font-semibold text-sm border border-border"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
