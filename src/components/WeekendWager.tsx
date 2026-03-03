import { useState } from "react";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { isFriday, isSaturday, isSunday } from "../lib/dateUtils";

export function WeekendWager() {
  const { totalXp, activeWager, startWager, resolveWager, todayCompleted } = useAppStore();
  const [wagerAmount, setWagerAmount] = useState(50);

  const isWeekendWagerVisible = isFriday() || isSaturday() || isSunday();
  if (!isWeekendWagerVisible) return null;

  // Friday: show wager start UI
  if (isFriday() && !activeWager) {
    const canWager = totalXp >= wagerAmount;
    const maxWager = Math.min(totalXp, 500);

    return (
      <motion.div
        className="bg-card-elevated rounded-2xl p-4 border border-primary/20 space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <Swords size={18} className="text-amber" />
          <h3 className="font-bold text-sm text-foreground">Weekend Wager</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Complete your task on Saturday <em>and</em> Sunday — double your bet.
          Miss either day — lose the XP and a flame.
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Wager amount</span>
            <span className="font-bold text-amber">{wagerAmount} XP</span>
          </div>
          <input
            type="range"
            min={10}
            max={maxWager}
            step={10}
            value={wagerAmount}
            onChange={(e) => setWagerAmount(Number(e.target.value))}
            className="w-full accent-amber h-1.5 rounded-full appearance-none bg-secondary cursor-pointer"
            disabled={!canWager}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Win: +{wagerAmount * 2} XP</span>
            <span>Lose: −{wagerAmount} XP &amp; 🔥</span>
          </div>
        </div>

        <motion.button
          onClick={() => canWager && startWager(wagerAmount)}
          disabled={!canWager}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
            canWager
              ? "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
          whileTap={canWager ? { scale: 0.97 } : {}}
        >
          {canWager ? "Place Wager" : "Not enough XP"}
        </motion.button>
      </motion.div>
    );
  }

  // Saturday or Sunday with active wager: show status
  if (activeWager && !activeWager.resolved) {
    const dayLabel = isSaturday() ? "Saturday" : "Sunday";
    const dayDone = isSaturday() ? activeWager.saturdayCompleted : activeWager.sundayCompleted;

    return (
      <motion.div
        className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2">
          <Swords size={18} className="text-amber" />
          <h3 className="font-bold text-sm text-foreground">Wager Active — {dayLabel}</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          You wagered <strong className="text-amber">{activeWager.amount} XP</strong>.
          {dayDone
            ? " ✓ Today's done — keep it up!"
            : " Complete your task today to protect your wager."}
        </p>
        {todayCompleted && !dayDone && (
          <motion.button
            onClick={() =>
              resolveWager(
                isSaturday() ? true : activeWager.saturdayCompleted,
                isSunday() ? true : activeWager.sundayCompleted
              )
            }
            className="w-full py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground glow-amber-sm"
            whileTap={{ scale: 0.97 }}
          >
            Claim {dayLabel} ✓
          </motion.button>
        )}
      </motion.div>
    );
  }

  return null;
}
