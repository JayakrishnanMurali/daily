import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { CharacterSVG } from "./CharacterSVG";
import { playDevastationSound } from "../lib/audioUtils";
import { useEffect } from "react";

const REQUIRED_STATEMENT = "I will not skip a day again";

export function DevastatedScreen() {
  const [inputValue, setInputValue] = useState("");
  const { exitDevastatedMode, skinColor, equippedEyes, equippedMouth, equippedHair, equippedOutfit, equippedHat, equippedAccessory } = useAppStore();

  useEffect(() => {
    playDevastationSound();
  }, []);

  const isStatementCorrect = inputValue.trim().toLowerCase() === REQUIRED_STATEMENT.toLowerCase();

  const handleCommit = () => {
    if (!isStatementCorrect) return;
    exitDevastatedMode();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{
        background: "hsl(0 0% 3%)",
        filter: "grayscale(0.85) saturate(0.3)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 0% / 0.7) 100%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 w-full max-w-sm">
        {/* Mascot — sad */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <CharacterSVG
            mood="sad"
            size={80}
            skinColor={skinColor}
            equippedEyes={equippedEyes}
            equippedMouth={equippedMouth}
            equippedHair={equippedHair}
            equippedOutfit={equippedOutfit}
            equippedHat={equippedHat}
            equippedAccessory={equippedAccessory}
          />
        </motion.div>

        {/* Streak broken display */}
        <div className="text-center">
          <div className="text-7xl font-black text-white opacity-20 tabular-nums">0</div>
          <p className="text-base font-semibold text-red-400 mt-1 tracking-wide uppercase">
            Streak Lost
          </p>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            You broke the chain.
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Your flames died out. Your streak has been reset to zero.
            <br />
            To continue, make a commitment.
          </p>
        </div>

        {/* Commitment input */}
        <div className="w-full space-y-2">
          <p className="text-xs text-gray-600 text-center font-mono">
            Type exactly: <span className="text-gray-400">"{REQUIRED_STATEMENT}"</span>
          </p>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-700 resize-none focus:outline-none focus:border-red-800 transition-colors"
            rows={2}
            placeholder="Type your commitment here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* Unlock button */}
        <motion.button
          onClick={handleCommit}
          disabled={!isStatementCorrect}
          className={`w-full py-4 rounded-2xl text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
            isStatementCorrect
              ? "bg-red-900 text-red-100 border border-red-700"
              : "bg-white/5 text-gray-700 border border-white/5 cursor-not-allowed"
          }`}
          whileTap={isStatementCorrect ? { scale: 0.97 } : {}}
        >
          {isStatementCorrect ? "Begin Again →" : "Type the commitment to continue"}
        </motion.button>
      </div>
    </motion.div>
  );
}
