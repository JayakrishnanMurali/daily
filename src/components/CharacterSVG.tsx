import React from "react";

// ─── Types ─────────────────────────────────────────────────────────────────
export type AvatarMood =
  | "sleeping"
  | "alert"
  | "working"
  | "anxious"
  | "celebrating"
  | "sad"
  | "neutral";

export interface CharacterSVGProps {
  mood: AvatarMood;
  size?: number;
  skinColor?: string;
  equippedEyes?: string | null;
  equippedMouth?: string | null;
  equippedHair?: string | null;
  equippedOutfit?: string | null;
  equippedHat?: string | null;
  equippedAccessory?: string | null;
}

// ─── Skin color map ─────────────────────────────────────────────────────────
const SKIN_FILL: Record<string, string> = {
  amber:    "hsl(38 90% 88%)",
  coral:    "hsl(12 80% 88%)",
  peach:    "hsl(25 80% 90%)",
  mint:     "hsl(160 45% 85%)",
  lavender: "hsl(265 40% 88%)",
  sky:      "hsl(200 60% 86%)",
  sage:     "hsl(140 30% 84%)",
  warm:     "hsl(30 55% 86%)",
};

function getSkinFill(colorKey: string | undefined): string {
  return SKIN_FILL[colorKey ?? "amber"] ?? "hsl(38 90% 88%)";
}

// Slightly darker shade for body shading
function getSkinShade(colorKey: string | undefined): string {
  const shades: Record<string, string> = {
    amber:    "hsl(38 70% 78%)",
    coral:    "hsl(12 60% 78%)",
    peach:    "hsl(25 60% 82%)",
    mint:     "hsl(160 30% 75%)",
    lavender: "hsl(265 25% 78%)",
    sky:      "hsl(200 40% 76%)",
    sage:     "hsl(140 20% 74%)",
    warm:     "hsl(30 40% 76%)",
  };
  return shades[colorKey ?? "amber"] ?? "hsl(38 70% 78%)";
}

// ─── Snoo proportions (viewBox 0 0 140 210) ────────────────────────────────
// Head center: (70, 62), rx=38, ry=46 — big organic oval, dominant
// Ears: small bumps at sides (~31,72) and (~109,72)
// Antenna: line from top of head (70,16) up to (70,-8), circle r=7 at top
// Eyes: two large ovals inside head
// Mouth: small curve below eyes
// Body: small bean shape below head, ~(70,128), rx=16, ry=14
// Arms: thin from sides of body, mitten hands
// Legs: thin from body bottom, smooth feet
// Total: 2 heads tall (head ~104px tall, body+legs ~104px)

// ─── Ground shadow ──────────────────────────────────────────────────────────
function GroundShadow() {
  return (
    <ellipse cx="70" cy="200" rx="24" ry="5" fill="hsl(222 47% 4%)" opacity="0.3" />
  );
}

// ─── Antenna ───────────────────────────────────────────────────────────────
function Antenna({ mood, skinFill, skinShade, equippedHat }: {
  mood: AvatarMood;
  skinFill: string;
  skinShade: string;
  equippedHat: string | null | undefined;
}) {
  // Astronaut hides antenna
  if (equippedHat === "hat_astro") return null;

  // Bend antenna based on mood
  const antennaBend = mood === "sleeping" ? "Q 80 0 85 -12"
    : mood === "celebrating" ? "Q 60 -2 55 -14"
    : mood === "sad" ? "Q 75 2 78 -10"
    : "";

  const antennaTip = mood === "sleeping"
    ? { cx: 85, cy: -12 }
    : mood === "celebrating"
    ? { cx: 55, cy: -14 }
    : mood === "sad"
    ? { cx: 78, cy: -10 }
    : { cx: 70, cy: -10 };

  return (
    <g>
      {antennaBend ? (
        <path
          d={`M 70 16 ${antennaBend}`}
          stroke={skinShade}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <line x1="70" y1="16" x2="70" y2="-8" stroke={skinShade} strokeWidth="3.5" strokeLinecap="round" />
      )}
      <circle cx={antennaTip.cx} cy={antennaTip.cy} r="7" fill={skinFill} stroke={skinShade} strokeWidth="2" />
    </g>
  );
}

// ─── Head (large Snoo oval) ─────────────────────────────────────────────────
function Head({ skinFill, skinShade }: { skinFill: string; skinShade: string }) {
  return (
    <g>
      {/* Ear bumps — rendered before head so head overlaps them slightly */}
      <ellipse cx="32" cy="72" rx="11" ry="9" fill={skinFill} stroke={skinShade} strokeWidth="1.5" />
      <ellipse cx="108" cy="72" rx="11" ry="9" fill={skinFill} stroke={skinShade} strokeWidth="1.5" />
      {/* Main head oval */}
      <ellipse cx="70" cy="62" rx="38" ry="46" fill={skinFill} />
      {/* Very subtle shading on lower half for depth */}
      <ellipse cx="70" cy="85" rx="34" ry="22" fill={skinShade} opacity="0.18" />
    </g>
  );
}

// ─── Hair (layered on head, under hat) ─────────────────────────────────────
function Hair({ equippedHair, equippedHat, skinShade }: {
  equippedHair: string | null | undefined;
  equippedHat: string | null | undefined;
  skinShade: string;
}) {
  if (equippedHat === "hat_astro") return null;

  const hairDark = "hsl(222 40% 14%)";
  const hairMid  = "hsl(222 35% 22%)";

  switch (equippedHair) {
    case "hair_messy":
      return (
        <g fill={hairDark}>
          <ellipse cx="70" cy="16" rx="36" ry="10" />
          <path d="M34 28 Q26 8 40 12 Q36 22 38 28 Z" />
          <path d="M52 14 Q48 -4 60 2 Q56 14 56 20 Z" />
          <path d="M80 13 Q84 -5 76 1 Q80 12 80 18 Z" />
          <path d="M100 26 Q112 6 104 10 Q106 22 100 26 Z" />
        </g>
      );
    case "hair_spiky":
      return (
        <g fill={hairDark}>
          <ellipse cx="70" cy="18" rx="34" ry="8" />
          <path d="M44 22 L38 -2 L50 16 Z" />
          <path d="M58 14 L56 -8 L66 10 Z" />
          <path d="M70 12 L70 -10 L78 10 Z" />
          <path d="M82 14 L84 -8 L92 12 Z" />
          <path d="M96 22 L102 -2 L92 18 Z" />
        </g>
      );
    case "hair_bob":
      return (
        <g>
          <path d="M32 62 Q32 10 70 8 Q108 10 108 62 Q108 80 96 82 Q70 86 44 82 Q32 80 32 62 Z" fill={hairDark} />
          <path d="M34 62 Q34 14 70 12 Q106 14 106 62" fill={hairMid} opacity="0.35" />
        </g>
      );
    case "hair_ponytail":
      return (
        <g>
          <path d="M34 58 Q34 12 70 10 Q106 12 106 58 Q88 50 70 52 Q52 50 34 58 Z" fill={hairDark} />
          <path d="M106 50 Q120 44 116 64 Q110 80 104 72 Q114 62 108 52 Z" fill={hairDark} />
          <circle cx="106" cy="52" r="4" fill="hsl(350 70% 55%)" />
        </g>
      );
    case "hair_mohawk":
      return (
        <g>
          <path d="M34 58 Q34 20 70 18 Q106 20 106 58 Q88 52 70 54 Q52 52 34 58 Z" fill={hairDark} />
          <path d="M63 18 Q65 -4 70 -8 Q75 -4 77 18 Q73 14 70 14 Q67 14 63 18 Z" fill="hsl(350 80% 52%)" />
        </g>
      );
    case "hair_curly":
      return (
        <g fill={hairDark}>
          <path d="M34 58 Q32 14 70 10 Q108 14 106 58 Q88 50 70 52 Q52 50 34 58 Z" />
          <circle cx="40" cy="34" r="13" />
          <circle cx="56" cy="18" r="13" />
          <circle cx="70" cy="12" r="14" />
          <circle cx="84" cy="18" r="13" />
          <circle cx="100" cy="34" r="13" />
          <circle cx="40" cy="34" r="8" fill={hairMid} />
          <circle cx="56" cy="18" r="8" fill={hairMid} />
          <circle cx="70" cy="12" r="9" fill={hairMid} />
          <circle cx="84" cy="18" r="8" fill={hairMid} />
          <circle cx="100" cy="34" r="8" fill={hairMid} />
        </g>
      );
    case "hair_long":
      return (
        <g>
          <path d="M34 58 Q32 12 70 8 Q108 12 106 58 Q88 50 70 52 Q52 50 34 58 Z" fill={hairDark} />
          <path d="M34 58 Q22 88 26 128 Q32 148 40 150 Q34 128 36 100 Q34 80 34 58 Z" fill={hairDark} />
          <path d="M106 58 Q118 88 114 128 Q108 148 100 150 Q106 128 104 100 Q106 80 106 58 Z" fill={hairDark} />
        </g>
      );
    default:
      return null;
  }
}

// ─── Eyes ──────────────────────────────────────────────────────────────────
// Snoo's signature feature: two large ovals with contrasting color
function Eyes({ mood, equippedEyes, skinFill }: {
  mood: AvatarMood;
  equippedEyes: string | null | undefined;
  skinFill: string;
}) {
  // Sleeping always overrides
  if (mood === "sleeping") {
    return (
      <g stroke="hsl(222 47% 20%)" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M52 58 Q60 53 68 58" />
        <path d="M72 58 Q80 53 88 58" />
      </g>
    );
  }

  // Sad: droopy with tears
  if (mood === "sad") {
    return (
      <g>
        {renderEyeBase(equippedEyes)}
        <path d="M50 56 Q60 64 70 58" fill="hsl(215 18% 42%)" opacity="0.4" />
        <path d="M70 56 Q80 64 90 58" fill="hsl(215 18% 42%)" opacity="0.4" />
        <ellipse cx="54" cy="76" rx="2.5" ry="4.5" fill="hsl(210 80% 65%)" opacity="0.85" />
        <ellipse cx="86" cy="76" rx="2.5" ry="4.5" fill="hsl(210 80% 65%)" opacity="0.85" />
      </g>
    );
  }

  // Celebrating: star overlay
  if (mood === "celebrating") {
    return (
      <g>
        {renderEyeBase(equippedEyes)}
        <text x="60" y="68" textAnchor="middle" fontSize="14" fill="hsl(50 100% 68%)">★</text>
        <text x="80" y="68" textAnchor="middle" fontSize="14" fill="hsl(50 100% 68%)">★</text>
      </g>
    );
  }

  // Anxious: wide + sweat
  if (mood === "anxious") {
    return (
      <g>
        {renderEyeBase(equippedEyes, true)}
      </g>
    );
  }

  // Working: squint on one side
  if (mood === "working") {
    return (
      <g>
        {renderEyeBase(equippedEyes)}
        <path d="M50 54 Q60 58 70 55" fill="hsl(222 47% 20%)" opacity="0.4" />
      </g>
    );
  }

  return renderEyeBase(equippedEyes);
}

function renderEyeBase(equippedEyes: string | null | undefined, wide = false): React.ReactElement {
  const eyeRy = wide ? 14 : 11;
  const eyeRx = wide ? 10 : 9;

  switch (equippedEyes) {
    case "eyes_sleepy":
      return (
        <g>
          <ellipse cx="60" cy="60" rx="9" ry="9" fill="hsl(222 47% 14%)" />
          <ellipse cx="80" cy="60" rx="9" ry="9" fill="hsl(222 47% 14%)" />
          <path d="M51 56 Q60 64 69 56" fill="hsl(222 47% 14%)" opacity="0.35" />
          <path d="M71 56 Q80 64 89 56" fill="hsl(222 47% 14%)" opacity="0.35" />
          <circle cx="63" cy="57" r="2" fill="white" opacity="0.7" />
          <circle cx="83" cy="57" r="2" fill="white" opacity="0.7" />
        </g>
      );
    case "eyes_wide":
      return (
        <g>
          <ellipse cx="60" cy="60" rx="11" ry="13" fill="hsl(222 47% 14%)" />
          <ellipse cx="80" cy="60" rx="11" ry="13" fill="hsl(222 47% 14%)" />
          <circle cx="64" cy="55" r="3.5" fill="white" />
          <circle cx="84" cy="55" r="3.5" fill="white" />
        </g>
      );
    case "eyes_sparkle":
      return (
        <g>
          <ellipse cx="60" cy="60" rx="10" ry="11" fill="hsl(222 47% 14%)" />
          <ellipse cx="80" cy="60" rx="10" ry="11" fill="hsl(222 47% 14%)" />
          <text x="60" y="65" textAnchor="middle" fontSize="10" fill="hsl(50 100% 72%)">✦</text>
          <text x="80" y="65" textAnchor="middle" fontSize="10" fill="hsl(50 100% 72%)">✦</text>
        </g>
      );
    case "eyes_heart":
      return (
        <g>
          <text x="60" y="70" textAnchor="middle" fontSize="16" fill="hsl(350 80% 55%)">♥</text>
          <text x="80" y="70" textAnchor="middle" fontSize="16" fill="hsl(350 80% 55%)">♥</text>
        </g>
      );
    case "eyes_wink":
      return (
        <g>
          <ellipse cx="60" cy="60" rx="9" ry="11" fill="hsl(222 47% 14%)" />
          <circle cx="63" cy="56" r="2.5" fill="white" opacity="0.8" />
          <path d="M71 60 Q80 54 89 60" stroke="hsl(222 47% 14%)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );
    case "eyes_glasses":
      return (
        <g>
          <ellipse cx="60" cy="60" rx="9" ry="11" fill="hsl(222 47% 14%)" />
          <ellipse cx="80" cy="60" rx="9" ry="11" fill="hsl(222 47% 14%)" />
          <circle cx="63" cy="56" r="2" fill="white" opacity="0.8" />
          <circle cx="83" cy="56" r="2" fill="white" opacity="0.8" />
          <ellipse cx="60" cy="60" rx="12" ry="14" fill="none" stroke="hsl(222 47% 18%)" strokeWidth="2" />
          <ellipse cx="80" cy="60" rx="12" ry="14" fill="none" stroke="hsl(222 47% 18%)" strokeWidth="2" />
          <line x1="72" y1="60" x2="68" y2="60" stroke="hsl(222 47% 18%)" strokeWidth="2" />
          <line x1="48" y1="56" x2="42" y2="53" stroke="hsl(222 47% 18%)" strokeWidth="1.5" />
          <line x1="92" y1="56" x2="98" y2="53" stroke="hsl(222 47% 18%)" strokeWidth="1.5" />
        </g>
      );
    case "eyes_shades":
      return (
        <g>
          <rect x="46" y="50" width="28" height="18" rx="6" fill="hsl(222 47% 10%)" />
          <rect x="66" y="50" width="28" height="18" rx="6" fill="hsl(222 47% 10%)" />
          <line x1="74" y1="58" x2="66" y2="58" stroke="hsl(222 47% 10%)" strokeWidth="3" />
          <path d="M50 53 Q56 50 60 54" stroke="hsl(0 0% 65%)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55" />
          <path d="M70 53 Q76 50 80 54" stroke="hsl(0 0% 65%)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55" />
        </g>
      );
    default: {
      // Default Snoo eyes: large dark ovals with white highlight
      return (
        <g>
          <ellipse cx="60" cy="60" rx={eyeRx} ry={eyeRy} fill="hsl(222 47% 14%)" />
          <ellipse cx="80" cy="60" rx={eyeRx} ry={eyeRy} fill="hsl(222 47% 14%)" />
          <circle cx="64" cy={wide ? 53 : 55} r="2.5" fill="white" opacity="0.85" />
          <circle cx="84" cy={wide ? 53 : 55} r="2.5" fill="white" opacity="0.85" />
        </g>
      );
    }
  }
}

// ─── Mouth ─────────────────────────────────────────────────────────────────
function Mouth({ mood, equippedMouth }: {
  mood: AvatarMood;
  equippedMouth: string | null | undefined;
}) {
  const moodOverride = getMoodMouthOverride(mood);
  if (moodOverride) return moodOverride;
  return renderMouthBase(equippedMouth);
}

function getMoodMouthOverride(mood: AvatarMood): React.ReactElement | null {
  switch (mood) {
    case "sleeping":
      return <ellipse cx="70" cy="84" rx="5" ry="3.5" fill="hsl(222 47% 20%)" opacity="0.45" />;
    case "sad":
      return (
        <path d="M57 86 Q70 78 83 86"
          stroke="hsl(222 47% 20%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      );
    case "anxious":
      return (
        <path d="M58 84 Q64 89 70 84 Q76 79 82 84"
          stroke="hsl(222 47% 20%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      );
    case "celebrating":
      return (
        <g>
          <path d="M55 80 Q70 96 85 80" fill="hsl(222 47% 16%)" />
          <rect x="59" y="80" width="22" height="8" rx="2" fill="hsl(0 0% 97%)" />
        </g>
      );
    default:
      return null;
  }
}

function renderMouthBase(equippedMouth: string | null | undefined): React.ReactElement {
  switch (equippedMouth) {
    case "mouth_grin":
      return (
        <g>
          <path d="M54 80 Q70 96 86 80" fill="hsl(222 47% 16%)" />
          <rect x="58" y="80" width="24" height="9" rx="2" fill="hsl(0 0% 97%)" />
        </g>
      );
    case "mouth_o":
      return <ellipse cx="70" cy="85" rx="7" ry="8" fill="hsl(222 47% 16%)" />;
    case "mouth_smirk":
      return (
        <path d="M61 82 Q72 90 82 82"
          stroke="hsl(222 47% 20%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      );
    case "mouth_tongue":
      return (
        <g>
          <path d="M56 80 Q70 94 84 80" fill="hsl(222 47% 16%)" />
          <ellipse cx="70" cy="90" rx="8" ry="5.5" fill="hsl(350 65% 58%)" />
        </g>
      );
    case "mouth_cat":
      return (
        <g stroke="hsl(222 47% 20%)" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M61 82 Q66 88 70 82" />
          <path d="M70 82 Q74 88 79 82" />
          <line x1="70" y1="80" x2="70" y2="82" />
        </g>
      );
    case "mouth_teeth":
      return (
        <g>
          <path d="M55 80 Q70 94 85 80" fill="hsl(222 47% 16%)" />
          <rect x="59" y="80" width="22" height="7" rx="1.5" fill="hsl(0 0% 97%)" />
          <line x1="66" y1="80" x2="66" y2="87" stroke="hsl(222 47% 16%)" strokeWidth="1" />
          <line x1="70" y1="80" x2="70" y2="87" stroke="hsl(222 47% 16%)" strokeWidth="1" />
          <line x1="74" y1="80" x2="74" y2="87" stroke="hsl(222 47% 16%)" strokeWidth="1" />
        </g>
      );
    case "mouth_whistle":
      return <circle cx="70" cy="85" r="5" fill="hsl(222 47% 16%)" />;
    default:
      // Snoo's default small smile
      return (
        <path d="M60 82 Q70 91 80 82"
          stroke="hsl(222 47% 20%)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      );
  }
}

// ─── Body (small Snoo bean torso) ──────────────────────────────────────────
function Body({ skinFill, skinShade, equippedOutfit }: {
  skinFill: string;
  skinShade: string;
  equippedOutfit: string | null | undefined;
}) {
  const bodyColor = getOutfitBodyColor(equippedOutfit, skinFill);
  const detailColor = getOutfitDetailColor(equippedOutfit);
  const legColor = getLegColor(equippedOutfit, skinShade);

  return (
    <g>
      {/* Small Snoo bean body */}
      <ellipse cx="70" cy="130" rx="18" ry="16" fill={bodyColor} />
      {/* Subtle shading */}
      <ellipse cx="70" cy="136" rx="14" ry="8" fill={skinShade} opacity="0.15" />

      {/* Outfit details */}
      {renderOutfitDetails(equippedOutfit, detailColor)}

      {/* Legs — thin Snoo style */}
      <rect x="59" y="143" width="9" height="36" rx="4.5" fill={legColor} />
      <rect x="72" y="143" width="9" height="36" rx="4.5" fill={legColor} />

      {/* Feet — smooth Snoo blobs */}
      <ellipse cx="63" cy="180" rx="11" ry="7" fill={legColor} />
      <ellipse cx="77" cy="180" rx="11" ry="7" fill={legColor} />
    </g>
  );
}

function getOutfitBodyColor(equippedOutfit: string | null | undefined, fallback: string): string {
  switch (equippedOutfit) {
    case "outfit_hoodie":   return "hsl(220 28% 32%)";
    case "outfit_suit":     return "hsl(222 42% 20%)";
    case "outfit_jersey":   return "hsl(0 72% 46%)";
    case "outfit_dress":    return "hsl(280 42% 60%)";
    case "outfit_armor":    return "hsl(220 16% 46%)";
    case "outfit_cape":     return "hsl(270 52% 32%)";
    case "outfit_labcoat":  return "hsl(210 22% 90%)";
    default:                return fallback;
  }
}

function getOutfitDetailColor(equippedOutfit: string | null | undefined): string {
  switch (equippedOutfit) {
    case "outfit_hoodie":   return "hsl(220 25% 22%)";
    case "outfit_suit":     return "hsl(38 90% 60%)";
    case "outfit_jersey":   return "hsl(0 0% 95%)";
    case "outfit_dress":    return "hsl(320 50% 75%)";
    case "outfit_armor":    return "hsl(220 15% 64%)";
    case "outfit_cape":     return "hsl(270 60% 56%)";
    case "outfit_labcoat":  return "hsl(210 30% 60%)";
    default:                return "hsl(38 70% 60%)";
  }
}

function getLegColor(equippedOutfit: string | null | undefined, fallback: string): string {
  switch (equippedOutfit) {
    case "outfit_hoodie":   return "hsl(222 32% 22%)";
    case "outfit_suit":     return "hsl(222 42% 18%)";
    case "outfit_jersey":   return "hsl(220 62% 28%)";
    case "outfit_dress":    return "hsl(280 36% 50%)";
    case "outfit_armor":    return "hsl(220 16% 36%)";
    case "outfit_cape":     return "hsl(270 46% 24%)";
    case "outfit_labcoat":  return "hsl(220 26% 28%)";
    default:                return fallback;
  }
}

function renderOutfitDetails(equippedOutfit: string | null | undefined, detailColor: string) {
  switch (equippedOutfit) {
    case "outfit_hoodie":
      return (
        <g>
          <line x1="66" y1="120" x2="63" y2="132" stroke={detailColor} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="74" y1="120" x2="77" y2="132" stroke={detailColor} strokeWidth="1.5" strokeLinecap="round" />
          <rect x="62" y="132" width="16" height="9" rx="3" fill={detailColor} opacity="0.5" />
        </g>
      );
    case "outfit_suit":
      return (
        <g>
          <path d="M70 116 L62 126 L70 130 Z" fill={detailColor} opacity="0.7" />
          <path d="M70 116 L78 126 L70 130 Z" fill={detailColor} opacity="0.7" />
          <path d="M70 126 L67 140 L70 143 L73 140 Z" fill="hsl(0 70% 50%)" />
        </g>
      );
    case "outfit_jersey":
      return (
        <g>
          <text x="70" y="136" textAnchor="middle" fontSize="10" fontWeight="bold" fill={detailColor} fontFamily="monospace">7</text>
          <line x1="52" y1="122" x2="88" y2="122" stroke={detailColor} strokeWidth="2" opacity="0.4" />
        </g>
      );
    case "outfit_dress":
      return (
        <path d="M64 132 Q70 127 76 132 Q70 137 64 132 Z" fill={detailColor} opacity="0.7" />
      );
    case "outfit_armor":
      return (
        <g>
          <line x1="70" y1="114" x2="70" y2="146" stroke={detailColor} strokeWidth="2" opacity="0.6" />
          <line x1="52" y1="128" x2="88" y2="128" stroke={detailColor} strokeWidth="1.5" opacity="0.4" />
          <rect x="47" y="114" width="10" height="7" rx="2" fill={detailColor} opacity="0.7" />
          <rect x="83" y="114" width="10" height="7" rx="2" fill={detailColor} opacity="0.7" />
        </g>
      );
    case "outfit_cape":
      return <circle cx="70" cy="118" r="3.5" fill={detailColor} />;
    case "outfit_labcoat":
      return (
        <g>
          <path d="M66 114 L58 132" stroke={detailColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M74 114 L82 132" stroke={detailColor} strokeWidth="1.5" strokeLinecap="round" />
          <rect x="54" y="128" width="10" height="9" rx="2" fill="none" stroke={detailColor} strokeWidth="1.5" />
          <line x1="57" y1="128" x2="57" y2="137" stroke="hsl(200 80% 55%)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

// ─── Cape back layer ────────────────────────────────────────────────────────
function CapeBack({ equippedOutfit }: { equippedOutfit: string | null | undefined }) {
  if (equippedOutfit !== "outfit_cape") return null;
  return (
    <path
      d="M56 120 Q34 152 42 192 Q58 182 70 186 Q82 182 98 192 Q106 152 84 120 Z"
      fill="hsl(0 70% 42%)"
      opacity="0.88"
    />
  );
}

// ─── Arms (Snoo style — thin with mitten hands) ─────────────────────────────
function Arms({ mood, skinFill, skinShade, equippedAccessory }: {
  mood: AvatarMood;
  skinFill: string;
  skinShade: string;
  equippedAccessory: string | null | undefined;
}) {
  const armStroke = { stroke: skinShade, strokeWidth: 6, strokeLinecap: "round" as const, fill: "none" };
  const handFill = skinFill;

  switch (mood) {
    case "celebrating":
      return (
        <g>
          <path d="M52 122 Q36 106 28 94" {...armStroke} />
          <ellipse cx="26" cy="91" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
          <path d="M88 122 Q104 106 112 94" {...armStroke} />
          <ellipse cx="114" cy="91" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
        </g>
      );
    case "sleeping":
      return (
        <g>
          <path d="M52 126 Q40 138 36 150" {...armStroke} />
          <ellipse cx="34" cy="153" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
          <path d="M88 126 Q100 138 104 150" {...armStroke} />
          <ellipse cx="106" cy="153" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
        </g>
      );
    case "anxious":
      return (
        <g>
          <path d="M52 122 Q38 108 34 98" {...armStroke} />
          <ellipse cx="32" cy="95" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
          <path d="M88 122 Q102 108 106 98" {...armStroke} />
          <ellipse cx="108" cy="95" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
        </g>
      );
    case "working":
      return (
        <g>
          <path d="M52 122 Q36 112 30 100" {...armStroke} />
          <ellipse cx="28" cy="97" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
          {/* Notebook */}
          <rect x="10" y="88" width="20" height="24" rx="2" fill="hsl(48 90% 72%)" />
          <line x1="14" y1="95" x2="26" y2="95" stroke="hsl(38 60% 42%)" strokeWidth="1.5" />
          <line x1="14" y1="101" x2="26" y2="101" stroke="hsl(38 60% 42%)" strokeWidth="1.5" />
          <path d="M88 122 Q104 134 106 148" {...armStroke} />
          <ellipse cx="107" cy="151" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
        </g>
      );
    case "sad":
      return (
        <g>
          <path d="M52 126 Q42 142 40 156" {...armStroke} />
          <ellipse cx="38" cy="159" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
          <path d="M88 126 Q98 142 100 156" {...armStroke} />
          <ellipse cx="102" cy="159" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
        </g>
      );
    default: {
      // neutral / alert — arms relaxed at sides
      const rightHandX = equippedAccessory === "acc_coffee" || equippedAccessory === "acc_sword" ? 108 : 106;
      return (
        <g>
          <path d="M52 124 Q40 136 38 150" {...armStroke} />
          <ellipse cx="37" cy="153" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
          <path d={`M88 124 Q100 136 ${rightHandX} 150`} {...armStroke} />
          <ellipse cx={rightHandX + 1} cy="153" rx="7" ry="6" fill={handFill} stroke={skinShade} strokeWidth="1.5" />
          {/* Handheld items */}
          {equippedAccessory === "acc_coffee" && (
            <g transform="translate(106, 148)">
              {renderHandheldItem("acc_coffee")}
            </g>
          )}
          {equippedAccessory === "acc_sword" && (
            <g transform="translate(106, 140)">
              {renderHandheldItem("acc_sword")}
            </g>
          )}
        </g>
      );
    }
  }
}

function renderHandheldItem(accessoryId: string) {
  switch (accessoryId) {
    case "acc_coffee":
      return (
        <g>
          <rect x="-8" y="-6" width="16" height="17" rx="3" fill="hsl(30 60% 35%)" />
          <rect x="-6" y="-4" width="12" height="5" rx="1" fill="hsl(200 60% 75%)" opacity="0.8" />
          <path d="M6 0 Q12 4 6 8" stroke="hsl(30 60% 35%)" strokeWidth="2" fill="none" />
          <path d="-2 -9 Q0 -13 2 -9" stroke="hsl(0 0% 80%)" strokeWidth="1.5" fill="none" opacity="0.55" />
        </g>
      );
    case "acc_sword":
      return (
        <g>
          <line x1="0" y1="0" x2="0" y2="-32" stroke="hsl(220 15% 72%)" strokeWidth="3" strokeLinecap="round" />
          <rect x="-7" y="-4" width="14" height="4" rx="2" fill="hsl(38 80% 55%)" />
          <path d="M0 -32 L4 -23 L0 -28 L-4 -23 Z" fill="hsl(220 15% 86%)" />
        </g>
      );
    default:
      return null;
  }
}

// ─── Wings (behind body) ────────────────────────────────────────────────────
function WingsBack({ equippedAccessory }: { equippedAccessory: string | null | undefined }) {
  if (equippedAccessory !== "acc_wings") return null;
  return (
    <g opacity="0.92">
      <path d="M52 122 Q26 104 22 72 Q28 98 46 114 Z" fill="hsl(45 60% 92%)" />
      <path d="M52 122 Q16 116 12 90 Q22 108 48 118 Z" fill="hsl(45 50% 84%)" />
      <path d="M88 122 Q114 104 118 72 Q112 98 94 114 Z" fill="hsl(45 60% 92%)" />
      <path d="M88 122 Q124 116 128 90 Q118 108 92 118 Z" fill="hsl(45 50% 84%)" />
    </g>
  );
}

// ─── Backpack (behind body) ─────────────────────────────────────────────────
function BackpackBack({ equippedAccessory }: { equippedAccessory: string | null | undefined }) {
  if (equippedAccessory !== "acc_backpack") return null;
  return (
    <g>
      <rect x="82" y="116" width="22" height="30" rx="5" fill="hsl(200 62% 38%)" />
      <rect x="84" y="118" width="18" height="26" rx="3" fill="hsl(200 56% 44%)" />
      <rect x="85" y="130" width="16" height="11" rx="2" fill="hsl(200 62% 36%)" />
      <line x1="86" y1="116" x2="83" y2="148" stroke="hsl(200 50% 28%)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="100" y1="116" x2="97" y2="148" stroke="hsl(200 50% 28%)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

// ─── Hat ───────────────────────────────────────────────────────────────────
function Hat({ equippedHat, skinFill, skinShade }: {
  equippedHat: string | null | undefined;
  skinFill: string;
  skinShade: string;
}) {
  switch (equippedHat) {
    case "hat_beanie":
      return (
        <g>
          <path d="M32 56 Q34 14 70 12 Q106 14 108 56 Q88 50 70 52 Q52 50 32 56 Z" fill="hsl(220 62% 44%)" />
          <path d="M32 49 Q52 44 70 44 Q88 44 108 49" stroke="hsl(220 62% 32%)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M32 42 Q52 37 70 37 Q88 37 108 42" stroke="hsl(220 62% 32%)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="70" cy="12" r="10" fill="hsl(0 0% 94%)" />
          <circle cx="70" cy="12" r="6.5" fill="hsl(0 0% 84%)" />
        </g>
      );
    case "hat_crown":
      return (
        <g>
          <rect x="46" y="28" width="48" height="15" rx="3" fill="hsl(45 100% 54%)" />
          <path d="M46 28 L46 12 L56 25 L70 8 L84 25 L94 12 L94 28 Z" fill="hsl(45 100% 54%)" />
          <circle cx="70" cy="16" r="5.5" fill="hsl(350 80% 55%)" />
          <circle cx="52" cy="22" r="4" fill="hsl(200 80% 55%)" />
          <circle cx="88" cy="22" r="4" fill="hsl(145 60% 50%)" />
          <line x1="50" y1="30" x2="90" y2="30" stroke="hsl(45 100% 72%)" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </g>
      );
    case "hat_wizard":
      return (
        <g>
          <ellipse cx="70" cy="32" rx="36" ry="8" fill="hsl(265 56% 30%)" />
          <path d="M70 -12 L92 32 L48 32 Z" fill="hsl(265 56% 30%)" />
          <path d="M70 -12 L79 12 Q70 16 61 12 Z" fill="hsl(265 62% 42%)" opacity="0.5" />
          <text x="62" y="24" fontSize="8" fill="hsl(50 100% 72%)" opacity="0.9">★</text>
          <text x="74" y="18" fontSize="6" fill="hsl(50 100% 72%)" opacity="0.7">★</text>
        </g>
      );
    case "hat_cap":
      return (
        <g>
          <path d="M32 50 Q32 14 70 12 Q108 14 108 50 Q88 44 70 46 Q52 44 32 50 Z" fill="hsl(0 0% 18%)" />
          <path d="M28 50 Q70 42 112 50 Q100 60 28 60 Z" fill="hsl(0 0% 14%)" />
          <circle cx="70" cy="30" r="9" fill="hsl(0 0% 12%)" />
          <text x="70" y="34" textAnchor="middle" fontSize="9" fill="hsl(38 90% 56%)" fontWeight="bold">D</text>
        </g>
      );
    case "hat_headband":
      return (
        <path d="M34 40 Q70 33 106 40 Q106 48 70 47 Q34 48 34 40 Z" fill="hsl(350 65% 52%)" />
      );
    case "hat_horns":
      return (
        <g fill="hsl(0 0% 87%)">
          <path d="M44 28 Q34 0 50 8 Q48 18 44 28 Z" />
          <path d="M44 28 Q42 10 48 9 Q50 18 44 28 Z" fill="hsl(0 0% 72%)" />
          <path d="M96 28 Q106 0 90 8 Q92 18 96 28 Z" />
          <path d="M96 28 Q98 10 92 9 Q90 18 96 28 Z" fill="hsl(0 0% 72%)" />
        </g>
      );
    case "hat_astro":
      return (
        <g>
          <ellipse cx="70" cy="56" rx="50" ry="54" fill="hsl(210 22% 84%)" opacity="0.28" />
          <ellipse cx="70" cy="56" rx="48" ry="52" fill="none" stroke="hsl(210 22% 76%)" strokeWidth="3" />
          <path d="M34 46 Q34 4 70 2 Q106 4 106 46 Q106 72 70 74 Q34 72 34 46 Z" fill="hsl(200 62% 28%)" opacity="0.68" />
          <path d="M42 26 Q54 16 72 16" stroke="hsl(0 0% 92%)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M34 68 Q54 78 70 78 Q86 78 106 68 Q96 76 70 78 Q44 76 34 68 Z" fill="hsl(210 22% 74%)" />
        </g>
      );
    default:
      return null;
  }
}

// ─── Head accessories ───────────────────────────────────────────────────────
function HeadAccessory({ equippedAccessory }: { equippedAccessory: string | null | undefined }) {
  switch (equippedAccessory) {
    case "acc_halo":
      return (
        <ellipse cx="70" cy="8" rx="24" ry="7"
          fill="none" stroke="hsl(45 100% 64%)" strokeWidth="4.5" opacity="0.92" />
      );
    case "acc_headphones":
      return (
        <g>
          <path d="M30 56 Q32 10 70 8 Q108 10 110 56"
            stroke="hsl(222 47% 22%)" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="22" y="52" width="14" height="18" rx="5" fill="hsl(222 47% 22%)" />
          <rect x="104" y="52" width="14" height="18" rx="5" fill="hsl(222 47% 22%)" />
          <rect x="24" y="54" width="10" height="14" rx="3" fill="hsl(0 0% 22%)" />
          <rect x="106" y="54" width="10" height="14" rx="3" fill="hsl(0 0% 22%)" />
        </g>
      );
    default:
      return null;
  }
}

// ─── Body accessories ───────────────────────────────────────────────────────
function BodyAccessory({ equippedAccessory }: { equippedAccessory: string | null | undefined }) {
  if (equippedAccessory === "acc_scarf") {
    return (
      <g>
        <path d="M44 112 Q70 106 96 112 Q96 122 70 124 Q44 122 44 112 Z" fill="hsl(350 65% 52%)" />
        <path d="M78 114 Q86 126 82 140 Q78 148 74 143 Q76 130 74 118 Z" fill="hsl(350 55% 45%)" />
      </g>
    );
  }
  return null;
}

// ─── Mood extras ────────────────────────────────────────────────────────────
function MoodExtras({ mood }: { mood: AvatarMood }) {
  switch (mood) {
    case "sleeping":
      return (
        <g fill="hsl(220 30% 62%)" fontWeight="bold">
          <text x="106" y="46" fontSize="14" opacity="0.9">Z</text>
          <text x="116" y="32" fontSize="10" opacity="0.7">Z</text>
          <text x="123" y="20" fontSize="7" opacity="0.5">Z</text>
        </g>
      );
    case "celebrating":
      return (
        <g>
          <text x="18" y="38" fontSize="14">🎉</text>
          <text x="106" y="36" fontSize="12">✨</text>
          <circle cx="24" cy="58" r="3" fill="hsl(350 80% 60%)" opacity="0.8" />
          <circle cx="116" cy="52" r="2.5" fill="hsl(200 80% 60%)" opacity="0.8" />
          <circle cx="20" cy="76" r="2" fill="hsl(120 60% 55%)" opacity="0.7" />
        </g>
      );
    case "anxious":
      return (
        <g>
          <path d="M100 46 Q103 40 106 46 Q106 52 103 53 Q100 52 100 46 Z" fill="hsl(200 60% 66%)" opacity="0.88" />
          <line x1="108" y1="68" x2="118" y2="66" stroke="hsl(222 30% 52%)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <line x1="108" y1="76" x2="120" y2="76" stroke="hsl(222 30% 52%)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <line x1="108" y1="84" x2="118" y2="86" stroke="hsl(222 30% 52%)" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </g>
      );
    case "sad":
      return (
        <g>
          <ellipse cx="70" cy="-12" rx="28" ry="14" fill="hsl(220 15% 36%)" opacity="0.7" />
          <ellipse cx="52" cy="-8" rx="16" ry="10" fill="hsl(220 15% 40%)" opacity="0.7" />
          <ellipse cx="88" cy="-8" rx="16" ry="10" fill="hsl(220 15% 40%)" opacity="0.7" />
          <line x1="56" y1="6" x2="53" y2="17" stroke="hsl(210 60% 66%)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="70" y1="6" x2="67" y2="19" stroke="hsl(210 60% 66%)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="84" y1="6" x2="81" y2="17" stroke="hsl(210 60% 66%)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>
      );
    default:
      return null;
  }
}

// ─── Main component ─────────────────────────────────────────────────────────
export function CharacterSVG({
  mood = "neutral",
  size = 140,
  skinColor = "amber",
  equippedEyes,
  equippedMouth,
  equippedHair,
  equippedOutfit,
  equippedHat,
  equippedAccessory,
}: CharacterSVGProps) {
  const svgWidth  = size;
  const svgHeight = size * 1.5;
  const skinFill  = getSkinFill(skinColor);
  const skinShade = getSkinShade(skinColor);

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox="0 0 140 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* Layer 1: Ground shadow */}
      <GroundShadow />

      {/* Layer 2: Behind-body accessories */}
      <WingsBack equippedAccessory={equippedAccessory} />
      <BackpackBack equippedAccessory={equippedAccessory} />
      <CapeBack equippedOutfit={equippedOutfit} />

      {/* Layer 3: Body (torso + legs + feet) */}
      <Body skinFill={skinFill} skinShade={skinShade} equippedOutfit={equippedOutfit} />

      {/* Layer 4: Arms */}
      <Arms mood={mood} skinFill={skinFill} skinShade={skinShade} equippedAccessory={equippedAccessory} />

      {/* Layer 5: Body accessories (scarf) */}
      <BodyAccessory equippedAccessory={equippedAccessory} />

      {/* Layer 6: Antenna (under head/hair/hat) */}
      <Antenna mood={mood} skinFill={skinFill} skinShade={skinShade} equippedHat={equippedHat} />

      {/* Layer 7: Head (ear bumps + main oval) */}
      <Head skinFill={skinFill} skinShade={skinShade} />

      {/* Layer 8: Hair */}
      <Hair equippedHair={equippedHair} equippedHat={equippedHat} skinShade={skinShade} />

      {/* Layer 9: Face */}
      <Eyes mood={mood} equippedEyes={equippedEyes} skinFill={skinFill} />
      <Mouth mood={mood} equippedMouth={equippedMouth} />

      {/* Layer 10: Hat */}
      <Hat equippedHat={equippedHat} skinFill={skinFill} skinShade={skinShade} />

      {/* Layer 11: Head accessories (halo, headphones) */}
      <HeadAccessory equippedAccessory={equippedAccessory} />

      {/* Layer 12: Mood extras */}
      <MoodExtras mood={mood} />
    </svg>
  );
}

// ─── Store preview components ────────────────────────────────────────────────

function PreviewSVG({ children, viewBox = "0 0 48 48" }: {
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg width="48" height="48" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export function EyesPreview({ eyesId }: { eyesId: string }) {
  return (
    <PreviewSVG viewBox="38 42 44 36">
      {renderEyeBase(eyesId)}
    </PreviewSVG>
  );
}

export function MouthPreview({ mouthId }: { mouthId: string }) {
  return (
    <PreviewSVG viewBox="48 70 44 32">
      {renderMouthBase(mouthId)}
    </PreviewSVG>
  );
}

export function HairPreview({ hairId }: { hairId: string }) {
  return (
    <PreviewSVG viewBox="28 0 84 72">
      <ellipse cx="70" cy="62" rx="38" ry="46" fill="hsl(38 90% 88%)" />
      <Hair equippedHair={hairId} equippedHat={null} skinShade="hsl(38 70% 78%)" />
    </PreviewSVG>
  );
}

export function OutfitPreview({ outfitId }: { outfitId: string }) {
  const bodyColor  = getOutfitBodyColor(outfitId, "hsl(38 90% 88%)");
  const detailColor = getOutfitDetailColor(outfitId);
  return (
    <PreviewSVG viewBox="48 112 44 36">
      <ellipse cx="70" cy="130" rx="18" ry="16" fill={bodyColor} />
      {renderOutfitDetails(outfitId, detailColor)}
    </PreviewSVG>
  );
}

export function HatPreview({ hatId }: { hatId: string }) {
  return (
    <PreviewSVG viewBox="28 -14 84 80">
      <ellipse cx="70" cy="62" rx="38" ry="46" fill="hsl(38 90% 88%)" />
      <Hat equippedHat={hatId} skinFill="hsl(38 90% 88%)" skinShade="hsl(38 70% 78%)" />
    </PreviewSVG>
  );
}

export function AccPreview({ accId }: { accId: string }) {
  return (
    <PreviewSVG viewBox="0 0 140 210">
      <ellipse cx="70" cy="130" rx="18" ry="16" fill="hsl(38 90% 88%)" />
      <WingsBack equippedAccessory={accId} />
      <BackpackBack equippedAccessory={accId} />
      {(accId === "acc_halo" || accId === "acc_headphones") && (
        <>
          <ellipse cx="70" cy="62" rx="38" ry="46" fill="hsl(38 90% 88%)" />
          <HeadAccessory equippedAccessory={accId} />
        </>
      )}
      {accId === "acc_scarf" && <BodyAccessory equippedAccessory={accId} />}
      {(accId === "acc_coffee" || accId === "acc_sword") && (
        <g transform="translate(106, 148)">
          {renderHandheldItem(accId)}
        </g>
      )}
    </PreviewSVG>
  );
}
