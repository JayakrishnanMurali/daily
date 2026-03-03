/**
 * AvatarFrame — wraps the mascot with the equipped cosmetic frame + aura.
 * Purely visual; has no gameplay effect.
 */
import { motion } from "framer-motion";
import type { CosmeticId } from "../store/useAppStore";

const FRAME_STYLES: Record<
  string,
  { border: string; shadow: string; animate?: boolean }
> = {
  frame_ember: {
    border: "2px solid hsl(38 95% 52% / 0.75)",
    shadow: "0 0 10px hsl(38 95% 52% / 0.4), 0 0 20px hsl(38 95% 52% / 0.15)",
  },
  frame_nature: {
    border: "2.5px solid hsl(145 60% 44%)",
    shadow: "0 0 12px hsl(145 60% 44% / 0.4), 0 0 24px hsl(145 60% 44% / 0.15)",
  },
  frame_blaze: {
    border: "2.5px solid hsl(45 100% 58%)",
    shadow: "0 0 16px hsl(45 100% 55% / 0.6), 0 0 32px hsl(45 100% 55% / 0.2)",
    animate: true,
  },
  frame_circuit: {
    border: "2.5px solid hsl(188 90% 52%)",
    shadow: "0 0 14px hsl(188 90% 52% / 0.55), 0 0 28px hsl(188 90% 52% / 0.2)",
    animate: true,
  },
  frame_arcane: {
    border: "2.5px solid hsl(265 70% 62%)",
    shadow: "0 0 16px hsl(265 70% 62% / 0.55), 0 0 32px hsl(265 70% 62% / 0.2)",
  },
  frame_storm: {
    border: "2.5px solid hsl(195 100% 88%)",
    shadow: "0 0 18px hsl(195 100% 80% / 0.7), 0 0 36px hsl(195 100% 80% / 0.2)",
    animate: true,
  },
  frame_prismatic: {
    border: "2.5px solid transparent",
    shadow: "0 0 20px hsl(38 95% 52% / 0.4), 0 0 40px hsl(265 70% 62% / 0.2)",
    animate: true,
  },
};

const AURA_GRADIENTS: Record<string, string> = {
  aura_fire:   "radial-gradient(ellipse at center, hsl(25 100% 50% / 0.28) 0%, transparent 68%)",
  aura_frost:  "radial-gradient(ellipse at center, hsl(200 90% 60% / 0.22) 0%, transparent 68%)",
  aura_nature: "radial-gradient(ellipse at center, hsl(145 60% 44% / 0.24) 0%, transparent 68%)",
  aura_blood:  "radial-gradient(ellipse at center, hsl(0 80% 50% / 0.26)   0%, transparent 68%)",
  aura_void:   "radial-gradient(ellipse at center, hsl(265 70% 55% / 0.25) 0%, transparent 68%)",
  aura_storm:  "radial-gradient(ellipse at center, hsl(188 90% 60% / 0.27) 0%, transparent 68%)",
  aura_solar:  "radial-gradient(ellipse at center, hsl(50 100% 65% / 0.3)  0%, transparent 68%)",
};

interface AvatarFrameProps {
  equippedFrame: CosmeticId | null;
  equippedAura: CosmeticId | null;
  size: number;
  children: React.ReactNode;
}

export function AvatarFrame({ equippedFrame, equippedAura, size, children }: AvatarFrameProps) {
  const frameStyle = equippedFrame ? FRAME_STYLES[equippedFrame] : null;
  const auraGradient = equippedAura ? AURA_GRADIENTS[equippedAura] : null;

  const isPrismatic = equippedFrame === "frame_prismatic";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Aura layer — behind everything */}
      {auraGradient && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: auraGradient,
            width: size * 1.5,
            height: size * 1.5,
            top: -(size * 0.25),
            left: -(size * 0.25),
          }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.97, 1.03, 0.97] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Prismatic rainbow ring (CSS animation via inline style keyframe) */}
      {isPrismatic && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            padding: 3,
            background: "conic-gradient(from 0deg, hsl(38 95% 52%), hsl(265 70% 62%), hsl(200 90% 60%), hsl(145 65% 48%), hsl(38 95% 52%))",
            borderRadius: "50%",
            width: size,
            height: size,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          {/* Inner mask to show only the ring */}
          <div
            className="w-full h-full rounded-full"
            style={{ background: "hsl(222 44% 4%)" }}
          />
        </motion.div>
      )}

      {/* Regular frame ring */}
      {frameStyle && !isPrismatic && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: frameStyle.border,
            boxShadow: frameStyle.shadow,
            borderRadius: "50%",
          }}
          animate={frameStyle.animate ? { opacity: [0.7, 1, 0.7], scale: [0.98, 1, 0.98] } : {}}
          transition={frameStyle.animate ? { duration: 2, repeat: Infinity } : {}}
        />
      )}

      {/* The mascot itself */}
      {children}
    </div>
  );
}
