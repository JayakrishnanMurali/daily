/**
 * FlameDisplay — 3 Lucide Flame icons representing the user's remaining
 * protection against streak breaks.
 * Lit: amber glow. Extinguished: ashen gray. Last flame: urgent flicker.
 */
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface FlameDisplayProps {
  flames: number; // 0, 1, 2, or 3
}

export function FlameDisplay({ flames }: FlameDisplayProps) {
  const safeFlames = Math.max(0, Math.min(3, flames));

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 3 }).map((_, i) => {
        const isLit = i < safeFlames;
        const isLastFlame = safeFlames === 1 && i === 0;

        return (
          <motion.div
            key={i}
            animate={
              isLastFlame
                ? { opacity: [1, 0.45, 1], scale: [1, 0.92, 1] }
                : isLit
                ? { scale: [1, 1.04, 1] }
                : {}
            }
            transition={
              isLastFlame
                ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
                : isLit
                ? { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }
                : {}
            }
            style={
              isLit
                ? { filter: "drop-shadow(0 0 6px hsl(38 95% 52% / 0.7))" }
                : {}
            }
          >
            <Flame
              size={24}
              strokeWidth={1.75}
              className={isLit ? "text-amber fill-amber" : "text-muted-foreground/25"}
              style={isLit ? { fill: "hsl(38 95% 52%)", color: "hsl(30 100% 50%)" } : { fill: "hsl(222 30% 16%)" }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
