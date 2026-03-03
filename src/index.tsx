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

    // Serve favicon
    "/favicon.svg": new Response(await Bun.file("./public/favicon.svg").text(), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    }),

    // Serve PWA / iOS homescreen PNG icons
    "/apple-touch-icon.png": new Response(await Bun.file("./public/apple-touch-icon.png").bytes(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    }),
    "/icon-192.png": new Response(await Bun.file("./public/icon-192.png").bytes(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    }),
    "/icon-512.png": new Response(await Bun.file("./public/icon-512.png").bytes(), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    }),

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
