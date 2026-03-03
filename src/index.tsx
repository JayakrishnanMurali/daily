import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: 3001,
  routes: {
    // Serve PWA manifest
    "/manifest.json": new Response(
      await Bun.file("./public/manifest.json").text(),
      {
        headers: {
          "Content-Type": "application/manifest+json",
          "Cache-Control": "public, max-age=3600",
        },
      }
    ),

    // Serve service worker
    "/sw.js": new Response(await Bun.file("./public/sw.js").text(), {
      headers: {
        "Content-Type": "application/javascript",
        // SW must be served from root scope without caching
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Service-Worker-Allowed": "/",
      },
    }),

    // Serve index.html for all other routes (SPA client-side routing)
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🔥 Daily running at ${server.url}`);
