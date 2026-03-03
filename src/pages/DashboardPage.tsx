import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Pencil,
  Check,
  ShoppingCart,
  Zap,
  BatteryCharging,
  Share2,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { MascotSVG, type MascotMood } from "../components/MascotSVG";
import { FlameDisplay } from "../components/FlameDisplay";
import { AvatarFrame } from "../components/AvatarFrame";
import { ShareCard } from "../components/ShareCard";
import { WeekendWager } from "../components/WeekendWager";
import { getCurrentHour } from "../lib/dateUtils";

function getMascotMood(
  todayCompleted: boolean,
  currentStreak: number,
  hearts: number
): MascotMood {
  if (hearts === 0) return "sad";
  if (todayCompleted) return "celebrating";
  const hour = getCurrentHour();
  if (currentStreak === 0) return "neutral";
  if (hour < 10) return "sleeping";
  if (hour < 15) return "alert";
  if (hour < 21) return "working";
  return "anxious";
}

function XpBadge({ totalXp }: { totalXp: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-secondary/80 border border-border/60 rounded-full px-3 py-1.5">
      <Zap size={13} className="text-amber fill-amber" />
      <span className="text-xs font-bold text-foreground tabular-nums">{totalXp.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground">XP</span>
    </div>
  );
}

function StreakDisplay({ currentStreak, todayCompleted }: { currentStreak: number; todayCompleted: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="tabular-nums font-black leading-none"
        style={{
          fontSize: currentStreak >= 100 ? "5rem" : currentStreak >= 10 ? "5.5rem" : "6rem",
          color: todayCompleted ? "hsl(38 95% 52%)" : "hsl(0 0% 85%)",
          textShadow: todayCompleted
            ? "0 0 40px hsl(38 95% 52% / 0.5), 0 0 80px hsl(38 95% 52% / 0.2)"
            : "none",
          transition: "all 0.4s ease",
        }}
        key={currentStreak}
        initial={{ scale: 0.85, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {currentStreak}
      </motion.div>
      <div className="flex items-center gap-1.5 mt-1">
        <Flame size={14} className={todayCompleted ? "text-amber" : "text-muted-foreground"} strokeWidth={2} />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          day streak
        </span>
      </div>
    </div>
  );
}

function TaskRow({
  task,
  isCompleted,
  canDelete,
  locked,
}: {
  task: { id: string; title: string };
  isCompleted: boolean;
  canDelete: boolean;
  locked: boolean;
}) {
  const { toggleTaskCompletion, removeDailyTask, updateDailyTask } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(task.title);

  const handleSaveEdit = () => {
    updateDailyTask(task.id, editDraft);
    setEditing(false);
  };

  return (
    <motion.div layout className="flex items-center gap-3 py-2.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
      {/* Completion toggle */}
      <motion.button onClick={() => !locked && toggleTaskCompletion(task.id)} className="shrink-0" whileTap={!locked ? { scale: 0.85 } : {}}>
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <motion.div key="checked" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: "spring", stiffness: 400 }}>
              <CheckCircle2 size={22} className="text-amber" style={{ filter: "drop-shadow(0 0 5px hsl(38 95% 52% / 0.6))" }} />
            </motion.div>
          ) : (
            <motion.div key="unchecked" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <Circle size={22} className="text-muted-foreground/40" strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Title or edit input */}
      {editing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit();
              if (e.key === "Escape") { setEditing(false); setEditDraft(task.title); }
            }}
            className="flex-1 bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
            autoFocus
            maxLength={80}
          />
          <button onClick={handleSaveEdit} className="text-amber p-1"><Check size={15} /></button>
          <button onClick={() => { setEditing(false); setEditDraft(task.title); }} className="text-muted-foreground p-1"><X size={15} /></button>
        </div>
      ) : (
        <>
          <span
            className="flex-1 text-sm font-medium leading-snug transition-all duration-300"
            style={{
              color: isCompleted ? "hsl(38 95% 52%)" : "hsl(0 0% 85%)",
              textDecoration: isCompleted ? "line-through" : "none",
              textDecorationColor: "hsl(38 95% 52% / 0.4)",
            }}
          >
            {task.title}
          </span>

          {!locked && !isCompleted && (
            <div className="flex items-center gap-0.5 shrink-0">
              <button onClick={() => { setEditing(true); setEditDraft(task.title); }} className="p-1.5 text-muted-foreground/35 hover:text-muted-foreground rounded-lg transition-colors">
                <Pencil size={12} />
              </button>
              {canDelete && (
                <button onClick={() => removeDailyTask(task.id)} className="p-1.5 text-muted-foreground/35 hover:text-red-400 rounded-lg transition-colors">
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function DailyTaskCard() {
  const { dailyTasks, completedTaskIds, todayCompleted, totalXp, hearts, buyHeart, addDailyTask } = useAppStore();
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addDailyTask(newTaskTitle);
    setNewTaskTitle("");
    setAddingTask(false);
  };

  const canAddMore = dailyTasks.length < 5;
  const completedCount = completedTaskIds.filter((id) => dailyTasks.some((t) => t.id === id)).length;

  return (
    <div
      className="rounded-2xl p-4 border"
      style={{
        background: "hsl(222 44% 7%)",
        borderColor: todayCompleted ? "hsl(38 95% 52% / 0.3)" : "hsl(0 0% 100% / 0.07)",
        boxShadow: todayCompleted ? "0 0 24px hsl(38 95% 52% / 0.12)" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1 pb-2 border-b border-border/30">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Today's Tasks
          </p>
          {!todayCompleted && dailyTasks.length > 1 && (
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">
              {completedCount} / {dailyTasks.length} done
            </p>
          )}
        </div>
        {canAddMore && (
          <button
            onClick={() => setAddingTask(true)}
            className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground/50 hover:text-primary border border-border/40 hover:border-primary/40 rounded-lg px-2 py-1 transition-all"
          >
            <Plus size={11} />
            {todayCompleted ? "For tomorrow" : "Add task"}
          </button>
        )}
      </div>

      {/* Task list */}
      <div className="divide-y divide-border/20">
        {dailyTasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            isCompleted={completedTaskIds.includes(task.id)}
            canDelete={dailyTasks.length > 1}
            locked={false}
          />
        ))}

        {/* Add task input row */}
        <AnimatePresence>
          {addingTask && (
            <motion.div
              className="flex items-center gap-2 py-2.5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Plus size={22} className="text-muted-foreground/25 shrink-0" />
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                  if (e.key === "Escape") { setAddingTask(false); setNewTaskTitle(""); }
                }}
                placeholder="New task..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/35 focus:outline-none"
                autoFocus
                maxLength={80}
              />
              <button onClick={handleAddTask} className="text-amber p-1 shrink-0"><Check size={15} /></button>
              <button onClick={() => { setAddingTask(false); setNewTaskTitle(""); }} className="text-muted-foreground/60 p-1 shrink-0"><X size={15} /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* All done banner */}
      <AnimatePresence>
        {todayCompleted && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber/10 border border-amber/25 mt-3"
          >
            <CheckCircle2 size={16} className="text-amber" />
            <span className="text-sm font-bold text-amber">All done for today</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restore flame */}
      {hearts < 3 && totalXp >= 150 && (
        <motion.button
          onClick={buyHeart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground border border-border/60 hover:border-border mt-3 transition-all"
        >
          <ShoppingCart size={13} />
          <span>Restore Flame — 150 XP</span>
          <BatteryCharging size={13} className="text-amber" />
        </motion.button>
      )}
    </div>
  );
}

export function DashboardPage() {
  const { currentStreak, todayCompleted, hearts, totalXp, longestStreak, equippedFrame, equippedAura, equippedBackdrop } =
    useAppStore();

  const BACKDROP_GRADIENTS: Record<string, string> = {
    bg_ember:   "radial-gradient(ellipse at 50% 60%, hsl(38 95% 52% / 0.18) 0%, hsl(25 90% 45% / 0.08) 55%, transparent 80%)",
    bg_cosmos:  "radial-gradient(ellipse at 50% 60%, hsl(265 70% 40% / 0.22) 0%, hsl(240 60% 20% / 0.1) 55%, transparent 80%)",
    bg_aurora:  "radial-gradient(ellipse at 50% 60%, hsl(160 70% 45% / 0.18) 0%, hsl(180 60% 35% / 0.08) 55%, transparent 80%)",
    bg_inferno: "radial-gradient(ellipse at 50% 60%, hsl(0 80% 50% / 0.22)  0%, hsl(20 90% 40% / 0.1) 55%, transparent 80%)",
  };
  const [showShare, setShowShare] = useState(false);
  const mascotMood = getMascotMood(todayCompleted, currentStreak, hearts);
  const hour = getCurrentHour();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col px-4 py-5 gap-5">
      {/* Share card overlay */}
      <AnimatePresence>
        {showShare && <ShareCard onClose={() => setShowShare(false)} />}
      </AnimatePresence>

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <FlameDisplay flames={hearts} />
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setShowShare(true)}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl text-muted-foreground/60 hover:text-muted-foreground border border-border/40 hover:border-border transition-all"
          >
            <Share2 size={15} />
          </motion.button>
          <XpBadge totalXp={totalXp} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-medium">{greeting}</p>

      {/* Mascot + Streak */}
      <div className="relative flex flex-col items-center gap-2 py-2">
        {/* Backdrop gradient */}
        {equippedBackdrop && (
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: BACKDROP_GRADIENTS[equippedBackdrop] }}
          />
        )}
        <motion.div
          animate={
            mascotMood === "celebrating" ? { y: [0, -8, 0] }
              : mascotMood === "sleeping" ? { rotate: [0, 2, -2, 0] }
              : mascotMood === "anxious" ? { x: [0, -2, 2, 0] }
              : {}
          }
          transition={
            mascotMood === "celebrating" ? { duration: 0.8, repeat: Infinity }
              : mascotMood === "sleeping" ? { duration: 4, repeat: Infinity }
              : mascotMood === "anxious" ? { duration: 0.3, repeat: Infinity }
              : {}
          }
        >
          <AvatarFrame equippedFrame={equippedFrame} equippedAura={equippedAura} size={130}>
            <MascotSVG mood={mascotMood} size={130} />
          </AvatarFrame>
        </motion.div>
        <StreakDisplay currentStreak={currentStreak} todayCompleted={todayCompleted} />
      </div>

      <DailyTaskCard />
      <WeekendWager />

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border/60 rounded-2xl p-3 space-y-0.5">
          <p className="text-xs text-muted-foreground">Best Streak</p>
          <p className="text-xl font-black text-foreground tabular-nums">{longestStreak}</p>
          <p className="text-xs text-muted-foreground">days</p>
        </div>
        <div className="bg-card border border-border/60 rounded-2xl p-3 space-y-0.5">
          <p className="text-xs text-muted-foreground">Total XP</p>
          <p className="text-xl font-black text-amber tabular-nums">{totalXp.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">earned</p>
        </div>
      </div>

      <div className="h-2" />
    </div>
  );
}
