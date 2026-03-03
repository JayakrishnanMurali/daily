import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { TrophyRoomPage } from "./pages/TrophyRoomPage";
import { StatsPage } from "./pages/StatsPage";
import StorePage from "./pages/StorePage";

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const dashboardRoute = createRoute({ getParentRoute: () => rootRoute, path: "/",          component: DashboardPage  });
const trophiesRoute  = createRoute({ getParentRoute: () => rootRoute, path: "/trophies",  component: TrophyRoomPage });
const storeRoute     = createRoute({ getParentRoute: () => rootRoute, path: "/store",     component: StorePage      });
const statsRoute     = createRoute({ getParentRoute: () => rootRoute, path: "/stats",     component: StatsPage      });

const routeTree = rootRoute.addChildren([dashboardRoute, trophiesRoute, storeRoute, statsRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router; }
}
