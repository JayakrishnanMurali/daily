/**
 * Ignis — the Daily app mascot. Fully redesigned for maximum expressiveness.
 *
 * Key improvements over v1:
 *   - Wider, more grounded body with richer colour layering
 *   - Distinct eyebrows that shift per mood
 *   - Mouth that clearly shows emotion
 *   - Chunkier arms with small "hand" nubs
 *   - Per-mood body colour tint
 */

export type MascotMood =
  | "sleeping"     // Early morning, no tasks done yet
  | "alert"        // Daytime, ready and waiting
  | "working"      // Afternoon, head-down grind
  | "anxious"      // Late night, deadline urgency
  | "celebrating"  // All tasks complete
  | "sad"          // Devastated / streak lost
  | "neutral";     // Brand new user, no streak yet

interface MascotSVGProps {
  mood: MascotMood;
  size?: number;
}

// ─── Per-mood colour palette ───────────────────────────────────────────────
const MOOD_COLORS: Record<MascotMood, {
  body: string; inner: string; belly: string; hot: string; arm: string;
}> = {
  neutral:     { body: "hsl(38 90% 50%)",   inner: "hsl(38 95% 60%)",   belly: "hsl(50 100% 75%)", hot: "hsl(50 100% 82%)", arm: "hsl(30 90% 48%)"  },
  alert:       { body: "hsl(34 95% 52%)",   inner: "hsl(38 95% 62%)",   belly: "hsl(50 100% 76%)", hot: "hsl(50 100% 84%)", arm: "hsl(28 90% 48%)"  },
  working:     { body: "hsl(32 92% 50%)",   inner: "hsl(36 90% 60%)",   belly: "hsl(48 100% 74%)", hot: "hsl(50 100% 82%)", arm: "hsl(28 90% 46%)"  },
  anxious:     { body: "hsl(28 95% 52%)",   inner: "hsl(34 95% 60%)",   belly: "hsl(45 100% 72%)", hot: "hsl(48 100% 80%)", arm: "hsl(24 90% 46%)"  },
  celebrating: { body: "hsl(40 100% 56%)",  inner: "hsl(46 100% 66%)",  belly: "hsl(55 100% 80%)", hot: "hsl(55 100% 90%)", arm: "hsl(36 100% 52%)" },
  sad:         { body: "hsl(215 18% 38%)",  inner: "hsl(215 15% 48%)",  belly: "hsl(215 12% 58%)", hot: "hsl(215 10% 65%)", arm: "hsl(215 18% 34%)" },
  sleeping:    { body: "hsl(36 80% 46%)",   inner: "hsl(38 85% 56%)",   belly: "hsl(48 95% 72%)",  hot: "hsl(50 100% 80%)", arm: "hsl(30 80% 43%)"  },
};

export function MascotSVG({ mood, size = 140 }: MascotSVGProps) {
  const c = MOOD_COLORS[mood];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Ignis, feeling ${mood}`}
    >
      {/* Ground shadow */}
      <ellipse cx="70" cy="153" rx="28" ry="5" fill="hsl(38 95% 52% / 0.12)" />

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      {/* Outer body */}
      <path
        d="M70 16 C44 20 26 46 26 78 C26 110 44 138 70 143 C96 138 114 110 114 78 C114 46 96 20 70 16Z"
        fill={c.body}
      />
      {/* Side flame wisps */}
      <path d="M26 78 C18 68 14 54 22 46 C26 58 28 68 28 78Z" fill={c.inner} opacity="0.55" />
      <path d="M114 78 C122 68 126 54 118 46 C114 58 112 68 112 78Z" fill={c.inner} opacity="0.55" />
      {/* Inner glow layer */}
      <path
        d="M70 28 C52 32 38 54 38 80 C38 106 50 128 70 133 C90 128 102 106 102 80 C102 54 88 32 70 28Z"
        fill={c.inner}
        opacity="0.4"
      />
      {/* Hot-core highlight */}
      <path
        d="M70 44 C60 50 54 64 54 80 C54 96 62 114 70 118 C78 114 86 96 86 80 C86 64 80 50 70 44Z"
        fill={c.hot}
        opacity="0.28"
      />
      {/* Belly */}
      <ellipse cx="70" cy="104" rx="22" ry="26" fill={c.belly} opacity="0.38" />

      {/* ── Flame tail tips (bottom) ─────────────────────────────────────── */}
      <FlameBase mood={mood} color={c.arm} />

      {/* ── Arms ─────────────────────────────────────────────────────────── */}
      <Arms mood={mood} color={c.arm} />

      {/* ── Face ─────────────────────────────────────────────────────────── */}
      <Eyebrows mood={mood} />
      <Eyes mood={mood} />
      <Mouth mood={mood} />

      {/* ── Extras (sparkles, ZZZ, sweat, etc.) ─────────────────────────── */}
      <Extras mood={mood} />
    </svg>
  );
}

// ─── Flame base / tail ────────────────────────────────────────────────────
function FlameBase({ mood, color }: { mood: MascotMood; color: string }) {
  if (mood === "sad") return null;
  return (
    <g opacity="0.8">
      <path d="M54 132 C48 140 42 150 50 152 C55 153 60 149 64 143" fill={color} />
      <path d="M86 132 C92 140 98 150 90 152 C85 153 80 149 76 143" fill={color} />
    </g>
  );
}

// ─── Arms ──────────────────────────────────────────────────────────────────
function Arms({ mood, color }: { mood: MascotMood; color: string }) {
  const sw = 12;

  const handDot = (cx: number, cy: number) => (
    <circle cx={cx} cy={cy} r="5" fill={color} />
  );

  if (mood === "sleeping") {
    return (
      <g>
        <path d="M34 96 Q26 108 28 118" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(29, 119)}
        <path d="M106 96 Q114 108 112 118" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(111, 119)}
      </g>
    );
  }
  if (mood === "celebrating") {
    return (
      <g>
        <path d="M34 90 Q18 66 22 50" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(22, 49)}
        <path d="M106 90 Q122 66 118 50" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(118, 49)}
      </g>
    );
  }
  if (mood === "sad") {
    return (
      <g>
        <path d="M34 98 Q22 114 24 124" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(24, 125)}
        <path d="M106 98 Q118 114 116 124" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(116, 125)}
      </g>
    );
  }
  if (mood === "anxious") {
    return (
      <g>
        <path d="M34 92 Q20 82 18 70" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(18, 69)}
        <path d="M106 92 Q120 82 122 70" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(122, 69)}
      </g>
    );
  }
  if (mood === "working") {
    // One arm resting, one slightly raised
    return (
      <g>
        <path d="M34 96 Q20 90 18 80" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(18, 79)}
        <path d="M106 94 Q120 86 122 74" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        {handDot(122, 73)}
      </g>
    );
  }
  // Default / alert / neutral
  return (
    <g>
      <path d="M34 94 Q20 88 18 76" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      {handDot(18, 75)}
      <path d="M106 94 Q120 88 122 76" stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      {handDot(122, 75)}
    </g>
  );
}

// ─── Eyebrows ─────────────────────────────────────────────────────────────
function Eyebrows({ mood }: { mood: MascotMood }) {
  const browColor = "hsl(222 47% 12%)";
  const sw = 2.5;
  const cap = "round" as const;

  // Left brow: x 50–66, Right brow: x 74–90, y around 64–70
  if (mood === "sleeping") return null; // hidden when sleeping

  if (mood === "celebrating") {
    // Highly arched — surprised joy
    return (
      <g stroke={browColor} strokeWidth={sw} strokeLinecap={cap} fill="none">
        <path d="M50 65 Q58 59 66 65" />
        <path d="M74 65 Q82 59 90 65" />
      </g>
    );
  }
  if (mood === "sad") {
    // Pinched toward centre, outer ends drop
    return (
      <g stroke={browColor} strokeWidth={sw} strokeLinecap={cap} fill="none">
        <path d="M50 68 Q56 65 64 70" />
        <path d="M76 70 Q84 65 90 68" />
      </g>
    );
  }
  if (mood === "anxious") {
    // Tight, inner corners pressing down toward nose
    return (
      <g stroke={browColor} strokeWidth={sw + 0.5} strokeLinecap={cap} fill="none">
        <path d="M50 66 Q57 70 65 67" />
        <path d="M75 67 Q83 70 90 66" />
      </g>
    );
  }
  if (mood === "working") {
    // One slightly lower — asymmetric concentration look
    return (
      <g stroke={browColor} strokeWidth={sw} strokeLinecap={cap} fill="none">
        <path d="M50 67 Q58 64 66 67" />
        <path d="M74 68 Q82 65 90 68" />
      </g>
    );
  }
  // neutral / alert — gentle relaxed arch
  return (
    <g stroke={browColor} strokeWidth={sw} strokeLinecap={cap} fill="none">
      <path d="M50 67 Q58 63 66 67" />
      <path d="M74 67 Q82 63 90 67" />
    </g>
  );
}

// ─── Eyes ─────────────────────────────────────────────────────────────────
function Eyes({ mood }: { mood: MascotMood }) {
  const sclera = "hsl(0 0% 96%)";
  const iris = "hsl(222 47% 12%)";
  const tear = "hsl(210 80% 65%)";

  // Closed sleep eyes
  if (mood === "sleeping") {
    return (
      <g stroke={iris} strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M52 76 Q58 71 64 76" />
        <path d="M76 76 Q82 71 88 76" />
      </g>
    );
  }

  // Star eyes for celebrating
  if (mood === "celebrating") {
    const starL = (cx: number, cy: number) => (
      <polygon
        points={`${cx},${cy - 9} ${cx + 2.5},${cy - 3} ${cx + 9},${cy - 3} ${cx + 3.5},${cy + 1} ${cx + 6},${cy + 8} ${cx},${cy + 4} ${cx - 6},${cy + 8} ${cx - 3.5},${cy + 1} ${cx - 9},${cy - 3} ${cx - 2.5},${cy - 3}`}
        fill="hsl(48 100% 68%)"
      />
    );
    return <g>{starL(58, 76)}{starL(82, 76)}</g>;
  }

  // Sad — droopy with tears
  if (mood === "sad") {
    return (
      <g>
        <ellipse cx="58" cy="76" rx="9" ry="10" fill={sclera} />
        <ellipse cx="60" cy="78" rx="5" ry="6" fill={iris} />
        <ellipse cx="62" cy="75.5" rx="1.8" ry="1.8" fill="white" opacity="0.55" />
        {/* Droopy lower lid */}
        <path d="M49 80 Q58 86 67 80" stroke="hsl(215 18% 38%)" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Tear */}
        <path d="M56 85 Q54 92 55 98" stroke={tear} strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="82" cy="76" rx="9" ry="10" fill={sclera} />
        <ellipse cx="84" cy="78" rx="5" ry="6" fill={iris} />
        <ellipse cx="86" cy="75.5" rx="1.8" ry="1.8" fill="white" opacity="0.55" />
        <path d="M73 80 Q82 86 91 80" stroke="hsl(215 18% 38%)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M84 85 Q86 92 85 98" stroke={tear} strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  // Anxious — wide open, visible whites all around
  if (mood === "anxious") {
    return (
      <g>
        <ellipse cx="58" cy="75" rx="10" ry="11" fill={sclera} />
        <ellipse cx="58" cy="76" rx="6" ry="7" fill={iris} />
        <ellipse cx="60.5" cy="73.5" rx="2" ry="2" fill="white" opacity="0.6" />
        <ellipse cx="82" cy="75" rx="10" ry="11" fill={sclera} />
        <ellipse cx="82" cy="76" rx="6" ry="7" fill={iris} />
        <ellipse cx="84.5" cy="73.5" rx="2" ry="2" fill="white" opacity="0.6" />
        {/* Sweat drop */}
        <path d="M93 66 Q95 71 93 75 Q91 71 93 66Z" fill={tear} opacity="0.85" />
      </g>
    );
  }

  // Working — slight squint (focused lid line)
  if (mood === "working") {
    return (
      <g>
        <ellipse cx="58" cy="76" rx="9" ry="9" fill={sclera} />
        <ellipse cx="58" cy="77" rx="5.5" ry="5.5" fill={iris} />
        <ellipse cx="60" cy="75" rx="1.8" ry="1.8" fill="white" opacity="0.6" />
        {/* Focused eyelid */}
        <path d="M49 73 Q58 70 67 73" stroke="hsl(32 60% 32%)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="82" cy="76" rx="9" ry="9" fill={sclera} />
        <ellipse cx="82" cy="77" rx="5.5" ry="5.5" fill={iris} />
        <ellipse cx="84" cy="75" rx="1.8" ry="1.8" fill="white" opacity="0.6" />
        <path d="M73 73 Q82 70 91 73" stroke="hsl(32 60% 32%)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  // Default — large, friendly open eyes
  return (
    <g>
      <ellipse cx="58" cy="76" rx="9" ry="10" fill={sclera} />
      <ellipse cx="59" cy="77" rx="5.5" ry="6.5" fill={iris} />
      <ellipse cx="61" cy="74.5" rx="2" ry="2" fill="white" opacity="0.55" />
      <ellipse cx="82" cy="76" rx="9" ry="10" fill={sclera} />
      <ellipse cx="83" cy="77" rx="5.5" ry="6.5" fill={iris} />
      <ellipse cx="85" cy="74.5" rx="2" ry="2" fill="white" opacity="0.55" />
    </g>
  );
}

// ─── Mouth ────────────────────────────────────────────────────────────────
function Mouth({ mood }: { mood: MascotMood }) {
  const mouthColor = "hsl(222 47% 14%)";
  const sw = 2.2;
  const cap = "round" as const;

  if (mood === "sleeping") {
    // Small relaxed round mouth
    return <ellipse cx="70" cy="100" rx="4" ry="3" fill={mouthColor} opacity="0.35" />;
  }
  if (mood === "celebrating") {
    // Big wide grin — open oval mouth
    return (
      <g>
        {/* Upper lip arc */}
        <path d="M58 97 Q70 105 82 97" stroke={mouthColor} strokeWidth={sw} strokeLinecap={cap} fill="none" />
        {/* Lower lip — open mouth */}
        <path d="M60 97 Q70 112 80 97" fill={mouthColor} opacity="0.7" />
        {/* Teeth line */}
        <line x1="60" y1="100" x2="80" y2="100" stroke="white" strokeWidth="1.2" opacity="0.6" />
      </g>
    );
  }
  if (mood === "sad") {
    // Pronounced downward curve
    return (
      <path
        d="M60 106 Q70 98 80 106"
        stroke={mouthColor}
        strokeWidth={sw + 0.5}
        strokeLinecap={cap}
        fill="none"
      />
    );
  }
  if (mood === "anxious") {
    // Tight grimace — nearly flat with slight downward tension
    return (
      <path
        d="M61 101 Q65 104 70 102 Q75 100 79 103"
        stroke={mouthColor}
        strokeWidth={sw}
        strokeLinecap={cap}
        fill="none"
      />
    );
  }
  if (mood === "working") {
    // One-side upward quirk — focused concentration
    return (
      <path
        d="M62 101 Q68 99 72 100 Q78 102 80 99"
        stroke={mouthColor}
        strokeWidth={sw}
        strokeLinecap={cap}
        fill="none"
      />
    );
  }
  if (mood === "neutral") {
    // Gentle hint of a smile
    return (
      <path
        d="M62 101 Q70 105 78 101"
        stroke={mouthColor}
        strokeWidth={sw}
        strokeLinecap={cap}
        fill="none"
      />
    );
  }
  // alert — confident small smile
  return (
    <path
      d="M61 100 Q70 106 79 100"
      stroke={mouthColor}
      strokeWidth={sw}
      strokeLinecap={cap}
      fill="none"
    />
  );
}

// ─── Extras ───────────────────────────────────────────────────────────────
function Extras({ mood }: { mood: MascotMood }) {
  if (mood === "sleeping") {
    return (
      <g fill="hsl(38 60% 62%)" opacity="0.65" fontFamily="sans-serif" fontWeight="bold">
        <text x="96" y="56" fontSize="11">z</text>
        <text x="104" y="42" fontSize="15">z</text>
        <text x="113" y="26" fontSize="19">Z</text>
      </g>
    );
  }
  if (mood === "celebrating") {
    return (
      <g>
        <circle cx="24" cy="50" r="3"   fill="hsl(45 100% 75%)" />
        <circle cx="116" cy="46" r="4"  fill="hsl(45 100% 75%)" />
        <circle cx="19"  cy="68" r="2"  fill="hsl(38 95% 62%)" />
        <circle cx="121" cy="64" r="2.5" fill="hsl(38 95% 62%)" />
        {/* Four-point stars */}
        <path d="M21 54 L24 50 L27 54 L24 58Z" fill="hsl(50 100% 88%)" opacity="0.85" />
        <path d="M113 40 L116 36 L119 40 L116 44Z" fill="hsl(50 100% 88%)" opacity="0.85" />
        <path d="M16 60 L19 56 L22 60 L19 64Z" fill="hsl(38 95% 70%)" opacity="0.7" />
      </g>
    );
  }
  if (mood === "anxious") {
    // Motion lines to the right
    return (
      <g stroke="hsl(28 70% 42%)" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <path d="M112 56 L119 53" />
        <path d="M114 65 L121 64" />
        <path d="M113 74 L120 75" />
      </g>
    );
  }
  if (mood === "sad") {
    // Dark rain cloud above head
    return (
      <g opacity="0.45">
        <ellipse cx="70" cy="15" rx="18" ry="9"  fill="hsl(215 20% 28%)" />
        <ellipse cx="58" cy="18" rx="10" ry="8"  fill="hsl(215 20% 28%)" />
        <ellipse cx="82" cy="18" rx="10" ry="8"  fill="hsl(215 20% 28%)" />
        <line x1="65" y1="25" x2="63" y2="34" stroke="hsl(210 60% 55%)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="70" y1="27" x2="68" y2="36" stroke="hsl(210 60% 55%)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="75" y1="25" x2="73" y2="34" stroke="hsl(210 60% 55%)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    );
  }
  if (mood === "working") {
    // Small open notebook held by the left hand
    return (
      <g transform="translate(0 0)">
        <rect x="4"  y="96" width="16" height="20" rx="2" fill="hsl(222 44% 12%)" stroke="hsl(38 70% 42%)" strokeWidth="1.5" />
        <line x1="7"  y1="102" x2="17" y2="102" stroke="hsl(38 70% 56%)" strokeWidth="1" />
        <line x1="7"  y1="107" x2="17" y2="107" stroke="hsl(38 70% 56%)" strokeWidth="1" />
        <line x1="7"  y1="112" x2="14" y2="112" stroke="hsl(38 70% 56%)" strokeWidth="1" />
      </g>
    );
  }
  return null;
}
