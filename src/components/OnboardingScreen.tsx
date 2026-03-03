import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { CharacterSVG } from "./CharacterSVG";
import { Flame } from "lucide-react";

export function OnboardingScreen() {
  const [taskInput, setTaskInput] = useState("");
  const { onboard } = useAppStore();

  const handleStart = () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    onboard(trimmed);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12 relative overflow-hidden"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, hsl(38 95% 52% / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Logo area */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Flame size={28} className="text-amber" style={{ filter: "drop-shadow(0 0 8px hsl(38 95% 52% / 0.6))" }} />
            <h1 className="text-3xl font-black tracking-tight text-foreground">Daily</h1>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Ruthless. Rewarding. Yours.
          </p>
        </motion.div>

        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CharacterSVG mood="neutral" size={90} />
        </motion.div>

        {/* Pitch */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-foreground">What are you learning?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Define the one daily habit you&apos;ll commit to.
            Miss a day and a flame dies. All out — start over.
          </p>
        </motion.div>

        {/* Task input */}
        <motion.div
          className="w-full space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="text"
            className="w-full bg-secondary border border-border rounded-2xl px-4 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            placeholder="e.g. Read 20 pages, practice guitar, write 500 words..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            maxLength={80}
          />

          <motion.button
            onClick={handleStart}
            disabled={!taskInput.trim()}
            className={`w-full py-4 rounded-2xl text-base font-bold tracking-wide transition-all duration-200 ${
              taskInput.trim()
                ? "bg-primary text-primary-foreground glow-amber"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
            whileTap={taskInput.trim() ? { scale: 0.97 } : {}}
          >
            Start My Streak →
          </motion.button>
        </motion.div>

        {/* Hearts rule callout */}
        <motion.div
          className="flex items-start gap-3 bg-secondary/60 border border-border/50 rounded-2xl p-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-xl">🔥</div>
          <div>
            <p className="text-xs font-semibold text-foreground">You start with 3 flames</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each missed day extinguishes 1 flame. All out? Your streak resets to zero.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
