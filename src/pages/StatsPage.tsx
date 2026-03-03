import { motion } from "framer-motion";
import { Flame, Zap, Calendar, TrendingUp, Trophy } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { getLastNDates, formatDateLabel } from "../lib/dateUtils";

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  accentColor = "text-foreground",
}: {
  icon: typeof Flame;
  label: string;
  value: string | number;
  subValue?: string;
  accentColor?: string;
}) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-1">
      <div className="flex items-center gap-1.5">
        <Icon size={13} className={accentColor} />
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
      <p className={`text-2xl font-black tabular-nums ${accentColor}`}>{value}</p>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </div>
  );
}

function HistoryHeatmap() {
  const { history } = useAppStore();
  const historyMap = new Map(history.map((r) => [r.date, r]));
  const last28 = getLastNDates(28);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-muted-foreground" />
        <h3 className="text-sm font-bold text-foreground">Last 28 Days</h3>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {/* Day labels */}
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[9px] text-muted-foreground/50 text-center font-bold">
            {d}
          </div>
        ))}

        {/* Day cells */}
        {last28.map((date, index) => {
          const record = historyMap.get(date);
          const isToday = index === last28.length - 1;
          const completed = record?.completed ?? false;
          const isFuture = false; // All dates in last28 are past or today

          return (
            <motion.div
              key={date}
              title={`${formatDateLabel(date)}${completed ? " ✓" : ""}`}
              className="aspect-square rounded-md flex items-center justify-center relative"
              style={{
                background: completed
                  ? "hsl(38 95% 52%)"
                  : "hsl(222 44% 10%)",
                border: isToday ? "1.5px solid hsl(38 95% 52% / 0.5)" : "1px solid transparent",
                boxShadow: completed
                  ? "0 0 8px hsl(38 95% 52% / 0.35)"
                  : "none",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: isFuture ? 0.2 : 1 }}
              transition={{ delay: index * 0.02 }}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-amber" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(222 44% 10%)" }} />
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
}

function RecentHistory() {
  const { history } = useAppStore();
  const recent = [...history].reverse().slice(0, 10);

  if (recent.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No history yet. Complete your first task!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp size={14} className="text-muted-foreground" />
        <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
      </div>

      <div className="space-y-2">
        {recent.map((record, index) => (
          <motion.div
            key={record.date}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-card border border-border/40"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: record.completed
                    ? "hsl(38 95% 52%)"
                    : "hsl(0 60% 45%)",
                }}
              />
              <span className="text-xs font-medium text-foreground">
                {formatDateLabel(record.date)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {record.completed && (
                <div className="flex items-center gap-1">
                  <Zap size={11} className="text-amber" />
                  <span className="text-xs font-bold text-amber">+{record.xpEarned}</span>
                </div>
              )}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Flame
                    key={i}
                    size={10}
                    strokeWidth={1.5}
                    className={i < record.heartsAtEnd ? "text-amber" : "text-muted-foreground/20"}
                  />
                ))}
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: record.completed
                    ? "hsl(38 95% 52% / 0.12)"
                    : "hsl(0 60% 30% / 0.2)",
                  color: record.completed ? "hsl(38 95% 60%)" : "hsl(0 60% 55%)",
                }}
              >
                {record.completed ? "Done" : "Missed"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function StatsPage() {
  const { currentStreak, longestStreak, totalXp, hearts, history, unlockedTrophies } =
    useAppStore();

  const completedDays = history.filter((r) => r.completed).length;
  const completionRate =
    history.length > 0 ? Math.round((completedDays / history.length) * 100) : 0;

  return (
    <div className="flex flex-col px-4 py-5 gap-6">
      {/* Header */}
      <h1 className="text-2xl font-black text-foreground tracking-tight">Stats</h1>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={currentStreak}
          subValue="days"
          accentColor="text-amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Best Streak"
          value={longestStreak}
          subValue="days"
          accentColor="text-foreground"
        />
        <StatCard
          icon={Zap}
          label="Total XP"
          value={totalXp.toLocaleString()}
          accentColor="text-amber"
        />
        <StatCard
          icon={Calendar}
          label="Completion Rate"
          value={`${completionRate}%`}
          subValue={`${completedDays} of ${history.length} days`}
          accentColor="text-foreground"
        />
        <StatCard
          icon={Flame}
          label="Flames"
          value={`${hearts} / 3`}
          accentColor="text-amber"
        />
        <StatCard
          icon={Trophy}
          label="Trophies"
          value={unlockedTrophies.length}
          subValue="unlocked"
          accentColor="text-amber"
        />
      </div>

      {/* 28-day heatmap */}
      <div className="bg-card border border-border/60 rounded-2xl p-4">
        <HistoryHeatmap />
      </div>

      {/* Recent history list */}
      <RecentHistory />

      <div className="h-2" />
    </div>
  );
}
