import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, Lock, Sparkles } from "lucide-react";
import {
  useAppStore,
  COSMETIC_DEFINITIONS,
  SKIN_COLORS,
  type CosmeticId,
  type CosmeticCategory,
} from "../store/useAppStore";
import {
  CharacterSVG,
  EyesPreview,
  MouthPreview,
  HairPreview,
  OutfitPreview,
  HatPreview,
  AccPreview,
} from "../components/CharacterSVG";

// ─── Scene gradients used in Dashboard ─────────────────────────────────────
export const BG_DASHBOARD_GRADIENTS: Record<string, string> = {
  bg_ember:
    "radial-gradient(ellipse at 50% 0%, hsl(38 95% 52% / 0.28) 0%, transparent 70%)",
  bg_sunset:
    "radial-gradient(ellipse at 50% 0%, hsl(20 90% 60% / 0.28) 0%, transparent 70%)",
  bg_cosmos:
    "radial-gradient(ellipse at 50% 0%, hsl(265 70% 55% / 0.28) 0%, transparent 70%)",
  bg_aurora:
    "radial-gradient(ellipse at 50% 0%, hsl(160 60% 45% / 0.26) 0%, transparent 70%)",
  bg_inferno:
    "radial-gradient(ellipse at 50% 0%, hsl(0 80% 50% / 0.30) 0%, transparent 70%)",
};

// ─── Tab config ─────────────────────────────────────────────────────────────
const TABS: { id: CosmeticCategory; label: string; emoji: string }[] = [
  { id: "eyes", label: "Eyes", emoji: "👁" },
  { id: "mouth", label: "Mouth", emoji: "😊" },
  { id: "hair", label: "Hair", emoji: "💇" },
  { id: "outfit", label: "Outfit", emoji: "👕" },
  { id: "hat", label: "Hat", emoji: "🎩" },
  { id: "accessory", label: "Items", emoji: "🎒" },
  { id: "scene", label: "Scene", emoji: "🌅" },
];

// ─── Mini preview renderer per category ─────────────────────────────────────
function renderItemPreview(item: {
  id: CosmeticId;
  category: CosmeticCategory;
}) {
  switch (item.category) {
    case "eyes":
      return <EyesPreview eyesId={item.id} />;
    case "mouth":
      return <MouthPreview mouthId={item.id} />;
    case "hair":
      return <HairPreview hairId={item.id} />;
    case "outfit":
      return <OutfitPreview outfitId={item.id} />;
    case "hat":
      return <HatPreview hatId={item.id} />;
    case "accessory":
      return <AccPreview accId={item.id} />;
    case "scene":
      return <ScenePreview sceneId={item.id} />;
  }
}

function ScenePreview({ sceneId }: { sceneId: string }) {
  const gradient = BG_DASHBOARD_GRADIENTS[sceneId] ?? "";
  return (
    <div
      className="w-12 h-12 rounded-xl"
      style={{
        background: gradient || "hsl(222 47% 10%)",
        border: "1.5px solid hsl(222 47% 18%)",
      }}
    />
  );
}

// ─── Cosmetic item card ─────────────────────────────────────────────────────
interface CosmeticItemCardProps {
  itemId: CosmeticId;
  category: CosmeticCategory;
  label: string;
  cost: number;
  isEquipped: boolean;
  isOwned: boolean;
  isPreviewing: boolean;
  canAfford: boolean;
  onAction: () => void;
}

function CosmeticItemCard({
  itemId,
  category,
  label,
  cost,
  isEquipped,
  isOwned,
  isPreviewing,
  canAfford,
  onAction,
}: CosmeticItemCardProps) {
  const borderColor = isEquipped
    ? "border-amber-400/60"
    : isPreviewing
      ? "border-white/40"
      : isOwned
        ? "border-white/10"
        : "border-white/6";

  const bgColor = isEquipped
    ? "bg-amber-400/10"
    : isPreviewing
      ? "bg-white/[0.08]"
      : "bg-white/[0.04]";

  return (
    <motion.button
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-colors relative ${borderColor} ${bgColor}`}
      onClick={onAction}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Equipped badge */}
      {isEquipped && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
          <Check size={9} strokeWidth={3} className="text-black" />
        </div>
      )}

      {/* Item preview */}
      <div className="w-12 h-12 flex items-center justify-center">
        {renderItemPreview({ id: itemId, category })}
      </div>

      {/* Label */}
      <span className="text-[10px] font-semibold text-white/70 truncate w-full text-center leading-tight">
        {label}
      </span>

      {/* Action area */}
      {isEquipped ? (
        <span className="text-[9px] font-black text-amber-400 tracking-wide">
          ON
        </span>
      ) : isPreviewing ? (
        <span className="text-[9px] font-black text-white/60 tracking-wide">
          TRY
        </span>
      ) : isOwned ? (
        <span className="text-[9px] text-white/40 font-medium">EQUIP</span>
      ) : canAfford ? (
        <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-400">
          <Zap size={8} fill="currentColor" />
          {cost}
        </span>
      ) : (
        <span className="flex items-center gap-0.5 text-[9px] font-medium text-white/25">
          <Lock size={8} />
          {cost}
        </span>
      )}
    </motion.button>
  );
}

// ─── "None" / default option card ───────────────────────────────────────────
function DefaultItemCard({
  category,
  isEquipped,
  onEquip,
}: {
  category: CosmeticCategory;
  isEquipped: boolean;
  onEquip: () => void;
}) {
  return (
    <motion.button
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-colors relative ${
        isEquipped
          ? "border-amber-400/60 bg-amber-400/10"
          : "border-white/6 bg-white/[0.04]"
      }`}
      onClick={onEquip}
      whileTap={{ scale: 0.95 }}
    >
      {isEquipped && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
          <Check size={9} strokeWidth={3} className="text-black" />
        </div>
      )}
      <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-dashed border-white/20">
        <span className="text-white/25 text-lg">∅</span>
      </div>
      <span className="text-[10px] font-semibold text-white/40 truncate w-full text-center">
        None
      </span>
      <span className="text-[9px] text-white/25">FREE</span>
    </motion.button>
  );
}

// ─── Skin color picker ──────────────────────────────────────────────────────
function SkinColorPicker({
  currentSkinKey,
  onSelect,
}: {
  currentSkinKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap px-2">
      {Object.entries(SKIN_COLORS).map(([key, { fill, label }]) => (
        <button
          key={key}
          title={label}
          onClick={() => onSelect(key)}
          className="relative rounded-full transition-transform active:scale-90"
          style={{ width: 28, height: 28 }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: fill,
              boxShadow:
                currentSkinKey === key
                  ? `0 0 0 2.5px hsl(222 47% 8%), 0 0 0 4.5px ${fill}`
                  : undefined,
            }}
          />
          {currentSkinKey === key && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check size={12} strokeWidth={3} className="text-black/60" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Buy confirmation bar ────────────────────────────────────────────────────
function BuyConfirmationSheet({
  itemId,
  onBuy,
  onCancel,
}: {
  itemId: CosmeticId;
  onBuy: () => void;
  onCancel: () => void;
}) {
  const { totalXp } = useAppStore();
  const def = COSMETIC_DEFINITIONS.find((d) => d.id === itemId)!;
  const canAfford = totalXp >= def.cost;

  return createPortal(
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom) + 4.5rem)",
        pointerEvents: "none",
      }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 36 }}
    >
      <div
        className="w-full max-w-md flex items-center gap-3 px-4 py-3 rounded-2xl"
        style={{
          background: "hsl(222 44% 10%)",
          border: "1px solid hsl(0 0% 100% / 0.1)",
          boxShadow: "0 -8px 32px hsl(0 0% 0% / 0.5)",
          pointerEvents: "auto",
        }}
      >
        {/* Item info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{def.label}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Zap size={11} fill="hsl(38 95% 52%)" className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{def.cost}</span>
            <span className="text-xs text-white/35">XP</span>
            {!canAfford && (
              <span className="text-[10px] text-red-400 ml-1">
                not enough XP
              </span>
            )}
          </div>
        </div>

        {/* Cancel */}
        <motion.button
          onClick={onCancel}
          whileTap={{ scale: 0.93 }}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-white/45 bg-white/[0.06]"
        >
          Cancel
        </motion.button>

        {/* Buy */}
        <motion.button
          onClick={canAfford ? onBuy : undefined}
          whileTap={canAfford ? { scale: 0.95 } : {}}
          className="px-4 py-2 rounded-xl text-xs font-bold"
          style={{
            background: canAfford ? "hsl(38 95% 52%)" : "hsl(222 44% 16%)",
            color: canAfford ? "#000" : "hsl(0 0% 100% / 0.2)",
          }}
        >
          Buy &amp; Equip
        </motion.button>
      </div>
    </motion.div>,
    document.body,
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function StorePage() {
  const {
    totalXp,
    ownedCosmetics,
    skinColor,
    equippedEyes,
    equippedMouth,
    equippedHair,
    equippedOutfit,
    equippedHat,
    equippedAccessory,
    equippedScene,
    purchaseCosmetic,
    equipCosmetic,
    setSkinColor,
  } = useAppStore();

  const [activeCategory, setActiveCategory] =
    useState<CosmeticCategory>("eyes");
  const [previewId, setPreviewId] = useState<CosmeticId | null>(null);

  const categoryItems = COSMETIC_DEFINITIONS.filter(
    (d) => d.category === activeCategory,
  );

  function getEquippedForCategory(
    category: CosmeticCategory,
  ): CosmeticId | null {
    switch (category) {
      case "eyes":
        return equippedEyes;
      case "mouth":
        return equippedMouth;
      case "hair":
        return equippedHair;
      case "outfit":
        return equippedOutfit;
      case "hat":
        return equippedHat;
      case "accessory":
        return equippedAccessory;
      case "scene":
        return equippedScene;
    }
  }

  // Build character preview props — overlay the previewed item on current equipment
  const previewDef = previewId
    ? COSMETIC_DEFINITIONS.find((d) => d.id === previewId)
    : null;
  const previewOverride: Record<string, CosmeticId | null> = previewDef
    ? {
        equippedEyes: previewDef.category === "eyes" ? previewId : equippedEyes,
        equippedMouth:
          previewDef.category === "mouth" ? previewId : equippedMouth,
        equippedHair: previewDef.category === "hair" ? previewId : equippedHair,
        equippedOutfit:
          previewDef.category === "outfit" ? previewId : equippedOutfit,
        equippedHat: previewDef.category === "hat" ? previewId : equippedHat,
        equippedAccessory:
          previewDef.category === "accessory" ? previewId : equippedAccessory,
      }
    : {
        equippedEyes,
        equippedMouth,
        equippedHair,
        equippedOutfit,
        equippedHat,
        equippedAccessory,
      };

  const previewScene =
    previewDef?.category === "scene" ? previewId : equippedScene;

  function handleItemAction(
    itemId: CosmeticId,
    category: CosmeticCategory,
    isOwned: boolean,
  ) {
    if (!isOwned) {
      // Preview only — let the user decide to buy
      setPreviewId(previewId === itemId ? null : itemId);
    } else {
      // Already owned — equip/unequip immediately
      setPreviewId(null);
      const currentlyEquipped = getEquippedForCategory(category);
      equipCosmetic(category, currentlyEquipped === itemId ? null : itemId);
    }
  }

  function handleBuyConfirm() {
    if (!previewId || !previewDef) return;
    purchaseCosmetic(previewId);
    // Equip right after purchase (store updates synchronously)
    equipCosmetic(previewDef.category, previewId);
    setPreviewId(null);
  }

  const activeTabSceneGradient = previewScene
    ? BG_DASHBOARD_GRADIENTS[previewScene]
    : undefined;

  return (
    <div className="flex flex-col min-h-full pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            Store
          </h1>
          <p className="text-xs text-white/40 mt-0.5">Make it yours</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/25 rounded-full px-3 py-1.5">
          <Zap size={12} fill="hsl(38 95% 52%)" className="text-amber-400" />
          <span className="text-sm font-black text-amber-400">
            {totalXp.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Live character preview */}
      <div
        className="flex items-center justify-center pt-2 pb-4 mx-4 rounded-3xl"
        style={{
          background: activeTabSceneGradient ?? "hsl(222 47% 6%)",
          border: "1px solid hsl(222 47% 12%)",
          minHeight: 200,
        }}
      >
        <motion.div
          key={`${previewId ?? ""}-${equippedEyes}-${equippedMouth}-${equippedHair}-${equippedOutfit}-${equippedHat}-${equippedAccessory}-${skinColor}`}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <CharacterSVG
            mood="neutral"
            size={110}
            skinColor={skinColor}
            equippedEyes={previewOverride.equippedEyes as CosmeticId | null}
            equippedMouth={previewOverride.equippedMouth as CosmeticId | null}
            equippedHair={previewOverride.equippedHair as CosmeticId | null}
            equippedOutfit={previewOverride.equippedOutfit as CosmeticId | null}
            equippedHat={previewOverride.equippedHat as CosmeticId | null}
            equippedAccessory={
              previewOverride.equippedAccessory as CosmeticId | null
            }
          />
        </motion.div>
      </div>

      {/* Skin color picker */}
      <div className="px-4 py-3">
        <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest mb-2.5 text-center">
          Skin Color
        </p>
        <SkinColorPicker currentSkinKey={skinColor} onSelect={setSkinColor} />
      </div>

      {/* Tab navigation */}
      <div className="px-4 pb-1">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id);
                setPreviewId(null);
              }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === tab.id
                  ? "bg-amber-400 text-black"
                  : "bg-white/[0.06] text-white/50 hover:bg-white/10"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Buy confirmation — slides up from bottom when previewing an unowned item */}
      <AnimatePresence>
        {previewId && !ownedCosmetics.includes(previewId) && (
          <BuyConfirmationSheet
            itemId={previewId}
            onBuy={handleBuyConfirm}
            onCancel={() => setPreviewId(null)}
          />
        )}
      </AnimatePresence>

      {/* Item grid */}
      <div className="px-4 pt-2 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-3 gap-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* "None" option — always first */}
            <DefaultItemCard
              category={activeCategory}
              isEquipped={getEquippedForCategory(activeCategory) === null}
              onEquip={() => equipCosmetic(activeCategory, null)}
            />

            {categoryItems.map((item) => {
              const isOwned = ownedCosmetics.includes(item.id);
              const isEquipped =
                getEquippedForCategory(activeCategory) === item.id;
              const canAfford = totalXp >= item.cost;
              const isPreviewing = previewId === item.id;

              return (
                <CosmeticItemCard
                  key={item.id}
                  itemId={item.id}
                  category={item.category}
                  label={item.label}
                  cost={item.cost}
                  isEquipped={isEquipped}
                  isOwned={isOwned}
                  isPreviewing={isPreviewing}
                  canAfford={canAfford}
                  onAction={() =>
                    handleItemAction(item.id, item.category, isOwned)
                  }
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
