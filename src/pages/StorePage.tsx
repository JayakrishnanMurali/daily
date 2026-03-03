import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, CheckCircle2, Zap, Lock } from "lucide-react";
import { useAppStore, COSMETIC_DEFINITIONS, type CosmeticId, type CosmeticCategory } from "../store/useAppStore";

const CATEGORY_LABELS: Record<CosmeticCategory, string> = {
  frame:    "Avatar Frames",
  aura:     "Mascot Auras",
  backdrop: "Backdrops",
};

const CATEGORY_DESC: Record<CosmeticCategory, string> = {
  frame:    "Decorative rings displayed around your mascot on the Dashboard.",
  aura:     "Ambient glow effects that radiate from behind your mascot.",
  backdrop: "Background gradient shown behind the mascot hero area.",
};

// ── Preview swatches ───────────────────────────────────────────────────────
const COSMETIC_PREVIEWS: Record<CosmeticId, React.ReactNode> = {
  // Frames
  frame_ember: (
    <div className="w-10 h-10 rounded-full" style={{ border: "2px solid hsl(38 95% 52% / 0.8)", boxShadow: "0 0 8px hsl(38 95% 52% / 0.45)" }} />
  ),
  frame_nature: (
    <div className="w-10 h-10 rounded-full" style={{ border: "2.5px solid hsl(145 60% 42%)", boxShadow: "0 0 8px hsl(145 60% 42% / 0.4)" }} />
  ),
  frame_blaze: (
    <motion.div
      className="w-10 h-10 rounded-full"
      style={{ border: "2.5px solid hsl(45 100% 58%)", boxShadow: "0 0 12px hsl(45 100% 55% / 0.65)" }}
      animate={{ opacity: [0.65, 1, 0.65] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  ),
  frame_circuit: (
    <div className="w-10 h-10 rounded-full" style={{ border: "2.5px solid hsl(188 90% 52%)", boxShadow: "0 0 10px hsl(188 90% 52% / 0.5)" }}>
      <div className="w-full h-full rounded-full" style={{ background: "repeating-conic-gradient(hsl(188 90% 52% / 0.12) 0 15deg, transparent 15deg 30deg)" }} />
    </div>
  ),
  frame_arcane: (
    <div className="w-10 h-10 rounded-full" style={{ border: "2.5px solid hsl(265 70% 62%)", boxShadow: "0 0 12px hsl(265 70% 62% / 0.55)" }} />
  ),
  frame_storm: (
    <motion.div
      className="w-10 h-10 rounded-full"
      style={{ border: "2.5px solid hsl(195 100% 88%)", boxShadow: "0 0 14px hsl(195 100% 80% / 0.7)" }}
      animate={{ opacity: [0.55, 1, 0.55], boxShadow: ["0 0 8px hsl(195 100% 80% / 0.4)", "0 0 18px hsl(195 100% 80% / 0.8)", "0 0 8px hsl(195 100% 80% / 0.4)"] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
  ),
  frame_prismatic: (
    <motion.div
      className="w-10 h-10 rounded-full"
      style={{ background: "conic-gradient(hsl(38 95% 52%), hsl(265 70% 62%), hsl(200 90% 60%), hsl(145 65% 48%), hsl(38 95% 52%))" }}
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    />
  ),
  // Auras
  aura_fire: (
    <div className="w-10 h-10 rounded-full" style={{ background: "radial-gradient(circle, hsl(25 100% 50% / 0.75) 0%, transparent 70%)" }} />
  ),
  aura_frost: (
    <div className="w-10 h-10 rounded-full" style={{ background: "radial-gradient(circle, hsl(200 90% 60% / 0.7) 0%, transparent 70%)" }} />
  ),
  aura_nature: (
    <div className="w-10 h-10 rounded-full" style={{ background: "radial-gradient(circle, hsl(145 60% 44% / 0.7) 0%, transparent 70%)" }} />
  ),
  aura_blood: (
    <motion.div
      className="w-10 h-10 rounded-full"
      style={{ background: "radial-gradient(circle, hsl(0 80% 50% / 0.75) 0%, transparent 70%)" }}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  ),
  aura_void: (
    <div className="w-10 h-10 rounded-full" style={{ background: "radial-gradient(circle, hsl(265 70% 55% / 0.7) 0%, transparent 70%)" }} />
  ),
  aura_storm: (
    <motion.div
      className="w-10 h-10 rounded-full"
      style={{ background: "radial-gradient(circle, hsl(188 90% 60% / 0.75) 0%, transparent 70%)" }}
      animate={{ scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 0.9, repeat: Infinity }}
    />
  ),
  aura_solar: (
    <motion.div
      className="w-10 h-10 rounded-full"
      style={{ background: "radial-gradient(circle, hsl(50 100% 65% / 0.8) 0%, transparent 70%)" }}
      animate={{ scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  ),
  // Backdrops
  bg_ember: (
    <div className="w-10 h-10 rounded-xl" style={{ background: "radial-gradient(ellipse at center, hsl(38 95% 52% / 0.55) 0%, hsl(25 90% 40% / 0.2) 60%, transparent 100%)" }} />
  ),
  bg_cosmos: (
    <div className="w-10 h-10 rounded-xl relative overflow-hidden" style={{ background: "hsl(240 50% 8%)" }}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white" style={{ width: 2, height: 2, top: `${15 + i * 15}%`, left: `${10 + i * 18}%`, opacity: 0.6 + i * 0.08 }} />
      ))}
    </div>
  ),
  bg_aurora: (
    <div className="w-10 h-10 rounded-xl" style={{ background: "linear-gradient(160deg, hsl(160 70% 35% / 0.5) 0%, hsl(180 70% 40% / 0.3) 50%, hsl(200 80% 30% / 0.15) 100%)" }} />
  ),
  bg_inferno: (
    <div className="w-10 h-10 rounded-xl" style={{ background: "radial-gradient(ellipse at center, hsl(0 90% 50% / 0.55) 0%, hsl(20 95% 40% / 0.3) 50%, transparent 100%)" }} />
  ),
};

// ── Card ───────────────────────────────────────────────────────────────────
function CosmeticCard({ id }: { id: CosmeticId }) {
  const {
    totalXp, ownedCosmetics,
    equippedFrame, equippedAura, equippedBackdrop,
    purchaseCosmetic, equipCosmetic,
  } = useAppStore();

  const def = COSMETIC_DEFINITIONS.find((c) => c.id === id)!;
  const isOwned = ownedCosmetics.includes(id);
  const isEquipped = equippedFrame === id || equippedAura === id || equippedBackdrop === id;
  const canAfford = totalXp >= def.cost;

  const handleAction = () => {
    if (!isOwned) {
      purchaseCosmetic(id);
    } else {
      const current =
        def.category === "frame"    ? equippedFrame :
        def.category === "aura"     ? equippedAura  : equippedBackdrop;
      equipCosmetic(def.category, current === id ? null : id);
    }
  };

  return (
    <motion.div
      className="flex items-center gap-3 rounded-2xl p-3 border transition-all"
      style={{
        background: isEquipped ? "hsl(222 44% 10%)" : "hsl(222 44% 7%)",
        borderColor: isEquipped ? "hsl(38 95% 52% / 0.4)" : "hsl(0 0% 100% / 0.06)",
        boxShadow: isEquipped ? "0 0 16px hsl(38 95% 52% / 0.1)" : "none",
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/60">
        {COSMETIC_PREVIEWS[id]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-foreground">{def.label}</p>
          {isEquipped && (
            <span className="text-[9px] font-black uppercase tracking-wider text-amber px-1.5 py-0.5 rounded-full bg-amber/10 border border-amber/20">
              On
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{def.description}</p>
      </div>

      <motion.button
        onClick={handleAction}
        disabled={!isOwned && !canAfford}
        whileTap={{ scale: 0.93 }}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
          isEquipped
            ? "bg-secondary text-muted-foreground border border-border"
            : isOwned
            ? "bg-primary/15 text-primary border border-primary/30"
            : canAfford
            ? "bg-primary text-primary-foreground"
            : "bg-secondary/50 text-muted-foreground/50 cursor-not-allowed"
        }`}
      >
        {isEquipped ? (
          "Remove"
        ) : isOwned ? (
          <><CheckCircle2 size={12} /> Equip</>
        ) : canAfford ? (
          <><Zap size={11} className="fill-primary-foreground" /> {def.cost}</>
        ) : (
          <><Lock size={11} /> {def.cost}</>
        )}
      </motion.button>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export function StorePage() {
  const { totalXp, ownedCosmetics } = useAppStore();
  const categories: CosmeticCategory[] = ["frame", "aura", "backdrop"];

  return (
    <div className="flex flex-col px-4 py-5 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
            <ShoppingBag size={22} className="text-amber" />
            Store
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Cosmetics only — no gameplay advantage.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary border border-border rounded-full px-3 py-1.5">
          <Zap size={13} className="text-amber fill-amber" />
          <span className="text-sm font-black text-foreground tabular-nums">{totalXp.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">XP</span>
        </div>
      </div>

      {/* Owned count */}
      <div className="flex items-center gap-2 bg-secondary/50 border border-border/40 rounded-2xl px-4 py-3">
        <CheckCircle2 size={14} className="text-amber shrink-0" />
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">{ownedCosmetics.length}</span> of{" "}
          {COSMETIC_DEFINITIONS.length} cosmetics owned
        </p>
      </div>

      {/* Categories */}
      {categories.map((category) => {
        const items = COSMETIC_DEFINITIONS.filter((c) => c.category === category);
        return (
          <div key={category} className="space-y-3">
            <div>
              <h2 className="text-sm font-black text-foreground uppercase tracking-wide">
                {CATEGORY_LABELS[category]}
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">{CATEGORY_DESC[category]}</p>
            </div>
            <AnimatePresence>
              <div className="space-y-2">
                {items.map((c) => <CosmeticCard key={c.id} id={c.id} />)}
              </div>
            </AnimatePresence>
          </div>
        );
      })}

      <div className="h-2" />
    </div>
  );
}
