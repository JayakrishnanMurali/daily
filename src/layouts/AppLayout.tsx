import { useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Flame, Trophy, Activity, ShoppingBag } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { DevastatedScreen } from "../components/DevastatedScreen";
import { CelebrationOverlay } from "../components/CelebrationOverlay";
import { OnboardingScreen } from "../components/OnboardingScreen";

export function AppLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { checkDailyStreak, devastatedMode, showCelebration, hasOnboarded } = useAppStore();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => { checkDailyStreak(); }, [checkDailyStreak]);

  // Reset scroll to top on every route change so pages don't inherit
  // the previous page's scroll position (causes top-clipping on iOS PWA).
  useEffect(() => { mainRef.current?.scrollTo({ top: 0 }); }, [pathname]);

  const navItems = [
    { path: "/",         label: "Daily",    icon: Flame       },
    { path: "/trophies", label: "Trophies", icon: Trophy      },
    { path: "/store",    label: "Store",    icon: ShoppingBag },
    { path: "/stats",    label: "Stats",    icon: Activity    },
  ];

  if (!hasOnboarded) return <OnboardingScreen />;

  return (
    <div
      className="fixed inset-0 flex flex-col w-full max-w-md mx-auto overflow-hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {devastatedMode  && <DevastatedScreen />}
      {showCelebration && <CelebrationOverlay />}

      <main ref={mainRef} className="flex-1 overflow-y-auto overscroll-contain pb-1">
        {children}
      </main>

      <nav
        className="shrink-0 border-t border-border/50 bg-card/80 backdrop-blur-xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 active:scale-90"
              >
                <Icon
                  size={20}
                  className={isActive ? "text-amber drop-shadow-[0_0_8px_hsl(38_95%_52%/0.8)]" : "text-muted-foreground"}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                <span className={`text-[9px] font-semibold tracking-wide ${isActive ? "text-amber" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
