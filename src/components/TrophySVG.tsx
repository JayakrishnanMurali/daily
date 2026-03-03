/**
 * Inline SVG trophy components for each tier.
 * Unlocked: vibrant fills, glowing drop-shadow.
 * Locked: silhouetted with dashed stroke, heavily dimmed.
 */

import type { TrophyId } from "../store/useAppStore";
import { TROPHY_DEFINITIONS } from "../lib/trophyUtils";

interface TrophySVGProps {
  trophyId: TrophyId;
  unlocked: boolean;
  size?: number;
}

const TIER_COLORS = {
  bronze: {
    primary: "hsl(25 65% 52%)",
    secondary: "hsl(25 55% 38%)",
    highlight: "hsl(30 80% 72%)",
    glow: "hsl(25 65% 52% / 0.45)",
    dimmed: "hsl(25 20% 22%)",
  },
  silver: {
    primary: "hsl(220 18% 72%)",
    secondary: "hsl(220 12% 50%)",
    highlight: "hsl(220 25% 88%)",
    glow: "hsl(220 18% 72% / 0.45)",
    dimmed: "hsl(220 12% 22%)",
  },
  gold: {
    primary: "hsl(45 100% 55%)",
    secondary: "hsl(38 90% 40%)",
    highlight: "hsl(50 100% 78%)",
    glow: "hsl(45 100% 55% / 0.55)",
    dimmed: "hsl(38 30% 18%)",
  },
  obsidian: {
    primary: "hsl(260 65% 68%)",
    secondary: "hsl(260 55% 45%)",
    highlight: "hsl(280 80% 82%)",
    glow: "hsl(260 65% 68% / 0.55)",
    dimmed: "hsl(260 25% 15%)",
  },
};

export function TrophySVG({ trophyId, unlocked, size = 80 }: TrophySVGProps) {
  const def = TROPHY_DEFINITIONS[trophyId];
  const colors = TIER_COLORS[def.tier];

  const filterId = `glow-${trophyId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={unlocked ? `${def.label} trophy (unlocked)` : `${def.label} trophy (locked)`}
      style={
        unlocked
          ? { filter: `drop-shadow(0 0 12px ${colors.glow}) drop-shadow(0 0 4px ${colors.glow})` }
          : {}
      }
    >
      <defs>
        <linearGradient id={`${filterId}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={unlocked ? colors.highlight : colors.dimmed} />
          <stop offset="60%" stopColor={unlocked ? colors.primary : colors.dimmed} />
          <stop offset="100%" stopColor={unlocked ? colors.secondary : "hsl(0 0% 10%)"} />
        </linearGradient>
        <linearGradient id={`${filterId}-stand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={unlocked ? colors.secondary : colors.dimmed} />
          <stop offset="100%" stopColor={unlocked ? colors.primary : "hsl(0 0% 8%)"} />
        </linearGradient>
      </defs>

      {/* Trophy cup body */}
      <path
        d={`M20 8 L60 8 L56 48 Q55 55 40 56 Q25 55 24 48 Z`}
        fill={`url(#${filterId}-body)`}
        stroke={unlocked ? colors.secondary : "hsl(0 0% 30%)"}
        strokeWidth={unlocked ? "1.5" : "1"}
        strokeDasharray={unlocked ? "none" : "4 3"}
        opacity={unlocked ? 1 : 0.4}
      />

      {/* Cup inner shadow */}
      <path
        d="M25 12 L55 12 L52 44 Q51 50 40 51 Q29 50 28 44 Z"
        fill={unlocked ? "hsl(0 0% 0% / 0.12)" : "transparent"}
      />

      {/* Cup highlight — left shine */}
      {unlocked && (
        <path
          d="M26 14 L30 14 L28 42 Q28 46 30 48 L26 48 Q22 44 23 38 Z"
          fill={colors.highlight}
          opacity="0.25"
        />
      )}

      {/* Left handle */}
      <path
        d="M20 18 Q6 18 6 30 Q6 42 20 42"
        stroke={`url(#${filterId}-body)`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity={unlocked ? 1 : 0.3}
      />

      {/* Right handle */}
      <path
        d="M60 18 Q74 18 74 30 Q74 42 60 42"
        stroke={`url(#${filterId}-body)`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity={unlocked ? 1 : 0.3}
      />

      {/* Stem */}
      <rect
        x="34"
        y="56"
        width="12"
        height="14"
        rx="3"
        fill={`url(#${filterId}-stand)`}
        opacity={unlocked ? 1 : 0.3}
        strokeDasharray={unlocked ? "none" : "3 2"}
        stroke={unlocked ? "none" : "hsl(0 0% 30%)"}
        strokeWidth="0.5"
      />

      {/* Base */}
      <rect
        x="24"
        y="70"
        width="32"
        height="10"
        rx="5"
        fill={`url(#${filterId}-stand)`}
        opacity={unlocked ? 1 : 0.3}
        strokeDasharray={unlocked ? "none" : "3 2"}
        stroke={unlocked ? "none" : "hsl(0 0% 30%)"}
        strokeWidth="0.5"
      />

      {/* Tier icon inside cup */}
      <TierIcon tier={def.tier} unlocked={unlocked} colors={colors} />

      {/* Lock overlay for locked state */}
      {!unlocked && (
        <g opacity="0.6">
          <rect x="33" y="24" width="14" height="12" rx="2" fill="hsl(0 0% 15%)" stroke="hsl(0 0% 35%)" strokeWidth="1.5" />
          <path d="M36 24 Q36 19 40 19 Q44 19 44 24" stroke="hsl(0 0% 35%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="30" r="2" fill="hsl(0 0% 45%)" />
        </g>
      )}
    </svg>
  );
}

function TierIcon({
  tier,
  unlocked,
  colors,
}: {
  tier: "bronze" | "silver" | "gold" | "obsidian";
  unlocked: boolean;
  colors: typeof TIER_COLORS.bronze;
}) {
  if (!unlocked) return null;

  const cx = 40;
  const cy = 30;

  if (tier === "bronze") {
    // Simple flame icon
    return (
      <path
        d={`M${cx} ${cy - 10} C${cx - 4} ${cy - 5} ${cx - 7} ${cy} ${cx - 5} ${cy + 6} C${cx - 2} ${cy + 10} ${cx + 2} ${cy + 10} ${cx + 5} ${cy + 6} C${cx + 7} ${cy} ${cx + 4} ${cy - 5} ${cx} ${cy - 10}Z`}
        fill={colors.highlight}
        opacity="0.7"
      />
    );
  }

  if (tier === "silver") {
    // 7-pointed star
    return (
      <polygon
        points={`${cx},${cy - 9} ${cx + 2.5},${cy - 3} ${cx + 9},${cy - 3} ${cx + 4},${cy + 1} ${cx + 6},${cy + 8} ${cx},${cy + 4} ${cx - 6},${cy + 8} ${cx - 4},${cy + 1} ${cx - 9},${cy - 3} ${cx - 2.5},${cy - 3}`}
        fill={colors.highlight}
        opacity="0.75"
      />
    );
  }

  if (tier === "gold") {
    // Bold crown shape
    return (
      <path
        d={`M${cx - 9} ${cy + 8} L${cx - 9} ${cy - 2} L${cx - 5} ${cy + 3} L${cx} ${cy - 8} L${cx + 5} ${cy + 3} L${cx + 9} ${cy - 2} L${cx + 9} ${cy + 8} Z`}
        fill={colors.highlight}
        opacity="0.8"
      />
    );
  }

  // Obsidian: diamond / crystal
  return (
    <path
      d={`M${cx} ${cy - 10} L${cx + 8} ${cy - 2} L${cx} ${cy + 9} L${cx - 8} ${cy - 2} Z`}
      fill={colors.highlight}
      opacity="0.8"
    />
  );
}
