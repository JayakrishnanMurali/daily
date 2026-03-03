import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { CharacterSVG } from "./CharacterSVG";
import { TrophySVG } from "./TrophySVG";
import { TROPHY_DEFINITIONS } from "../lib/trophyUtils";
import { playCelebrationSound, playTrophySound } from "../lib/audioUtils";

// Confetti particle
function ConfettiParticle({ index }: { index: number }) {
  const colors = [
    "hsl(38 95% 52%)",
    "hsl(45 100% 65%)",
    "hsl(280 65% 68%)",
    "hsl(160 60% 55%)",
    "hsl(340 75% 65%)",
  ];
  const color = colors[index % colors.length];
  const x = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const duration = 1.5 + Math.random() * 1;
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute top-0 rounded-sm"
      style={{
        left: `${x}%`,
        width: size,
        height: size * 0.6,
        background: color,
        rotate: rotation,
      }}
      initial={{ y: -20, opacity: 1 }}
      animate={{
        y: "110vh",
        opacity: [1, 1, 0],
        rotate: rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
      }}
      transition={{ duration, delay, ease: "easeIn" }}
    />
  );
}

export function CelebrationOverlay() {
  const {
    dismissCelebration, newlyUnlockedTrophies, currentStreak, clearNewTrophies,
    skinColor, equippedEyes, equippedMouth, equippedHair, equippedOutfit, equippedHat, equippedAccessory,
  } = useAppStore();

  useEffect(() => {
    playCelebrationSound();
    if (newlyUnlockedTrophies.length > 0) {
      setTimeout(playTrophySound, 600);
    }

    const timer = setTimeout(() => {
      dismissCelebration();
      clearNewTrophies();
    }, 3500);

    return () => clearTimeout(timer);
  }, [dismissCelebration, clearNewTrophies, newlyUnlockedTrophies.length]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "hsl(222 47% 4% / 0.92)", backdropFilter: "blur(4px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={dismissCelebration}
    >
      {/* Confetti rain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <ConfettiParticle key={i} index={i} />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-5 px-6">
        {/* Mascot celebrating */}
        <motion.div
          animate={{ y: [0, -12, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 0.6, repeat: 3, ease: "easeInOut" }}
        >
          <CharacterSVG
            mood="celebrating"
            size={90}
            skinColor={skinColor}
            equippedEyes={equippedEyes}
            equippedMouth={equippedMouth}
            equippedHair={equippedHair}
            equippedOutfit={equippedOutfit}
            equippedHat={equippedHat}
            equippedAccessory={equippedAccessory}
          />
        </motion.div>

        {/* Streak number */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <div className="text-7xl font-black text-amber tabular-nums" style={{ textShadow: "0 0 30px hsl(38 95% 52% / 0.6)" }}>
            {currentStreak}
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">
            day streak
          </p>
        </motion.div>

        {/* "Task Complete" label */}
        <motion.div
          className="bg-amber/10 border border-amber/30 rounded-2xl px-6 py-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <p className="text-amber font-bold text-base tracking-wide">Task Complete ✓</p>
        </motion.div>

        {/* Trophy unlocks */}
        <AnimatePresence>
          {newlyUnlockedTrophies.map((trophyId, index) => (
            <motion.div
              key={trophyId}
              className="flex items-center gap-3 bg-card border border-border/60 rounded-2xl px-4 py-3 glow-amber-sm"
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.15, type: "spring", stiffness: 260 }}
            >
              <TrophySVG trophyId={trophyId} unlocked size={40} />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Trophy Unlocked
                </p>
                <p className="text-sm font-bold text-foreground">
                  {TROPHY_DEFINITIONS[trophyId].label}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground mt-2 animate-pulse">Tap to continue</p>
      </div>
    </motion.div>
  );
}
