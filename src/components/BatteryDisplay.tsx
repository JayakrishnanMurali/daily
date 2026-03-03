/**
 * Animated battery SVG that displays the user's current "charge" level (0–3).
 * Colors and animations shift based on charge level.
 */
import { motion } from "framer-motion";

interface BatteryDisplayProps {
  charge: number; // 0, 1, 2, or 3
}

const LEVEL_COLORS = {
  0: { fill: "hsl(0 75% 50%)",   glow: "hsl(0 75% 50% / 0.4)",   label: "hsl(0 70% 60%)" },
  1: { fill: "hsl(25 90% 52%)",  glow: "hsl(25 90% 52% / 0.3)",  label: "hsl(25 85% 62%)" },
  2: { fill: "hsl(38 95% 52%)",  glow: "hsl(38 95% 52% / 0.3)",  label: "hsl(38 90% 62%)" },
  3: { fill: "hsl(145 65% 48%)", glow: "hsl(145 65% 48% / 0.4)", label: "hsl(145 60% 58%)" },
};

const LEVEL_LABELS = ["Empty", "Low", "Mid", "Full"];

export function BatteryDisplay({ charge }: BatteryDisplayProps) {
  const safeCharge = Math.max(0, Math.min(3, charge)) as 0 | 1 | 2 | 3;
  const { fill, glow, label: labelColor } = LEVEL_COLORS[safeCharge];

  // Fill fraction: 0, 1/3, 2/3, or full — with slight inset from edges
  const fillPercent = (safeCharge / 3) * 100;

  // Battery body inner dimensions (SVG space)
  // Outer body: x=2, y=4, w=44, h=22, rx=4
  // Inner fill area: x=5, y=7, w=38, h=16
  const innerFillWidth = (fillPercent / 100) * 38; // max 38

  const isDangerous = safeCharge === 0;
  const isFull = safeCharge === 3;

  return (
    <div className="flex items-center gap-2">
      {/* Battery SVG */}
      <motion.div
        animate={
          isDangerous
            ? { opacity: [1, 0.5, 1] }
            : isFull
            ? { filter: [`drop-shadow(0 0 3px ${glow})`, `drop-shadow(0 0 8px ${glow})`, `drop-shadow(0 0 3px ${glow})`] }
            : {}
        }
        transition={
          isDangerous
            ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
            : isFull
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
        style={isFull ? { filter: `drop-shadow(0 0 5px ${glow})` } : {}}
      >
        <svg width="52" height="30" viewBox="0 0 52 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Battery body outline */}
          <rect
            x="1.5"
            y="3.5"
            width="44"
            height="23"
            rx="5"
            stroke={fill}
            strokeWidth="1.5"
            fill="hsl(222 44% 7%)"
            opacity="0.9"
          />

          {/* Terminal nub */}
          <rect
            x="46"
            y="11"
            width="4.5"
            height="8"
            rx="2"
            fill={fill}
            opacity="0.7"
          />

          {/* Fill level */}
          <motion.rect
            x="4"
            y="7"
            height="16"
            rx="2.5"
            fill={fill}
            initial={{ width: 0 }}
            animate={{ width: Math.max(0, innerFillWidth) }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Charging bolt when full */}
          {isFull && (
            <motion.path
              d="M25 10 L21 16 L24.5 16 L22 21 L28 14.5 L24.5 14.5 Z"
              fill="hsl(222 47% 4%)"
              opacity="0.85"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          {/* "X" mark when empty */}
          {isDangerous && (
            <g opacity="0.7">
              <line x1="18" y1="11" x2="29" y2="19" stroke="hsl(222 44% 7%)" strokeWidth="2" strokeLinecap="round" />
              <line x1="29" y1="11" x2="18" y2="19" stroke="hsl(222 44% 7%)" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Charge label */}
      <div className="flex flex-col leading-none">
        <span
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: labelColor }}
        >
          {LEVEL_LABELS[safeCharge]}
        </span>
        <span className="text-[9px] text-muted-foreground font-medium">charge</span>
      </div>
    </div>
  );
}
