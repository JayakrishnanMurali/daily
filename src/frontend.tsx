/**
 * Entry point for the Daily app.
 * Sets up React root, TanStack Router, and registers the PWA service worker.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import "./index.css";

// Inject PWA manifest link dynamically (Bun can't bundle absolute-path links in HTML)
const manifestLink = document.createElement("link");
manifestLink.rel = "manifest";
manifestLink.href = "/manifest.json";
document.head.appendChild(manifestLink);

// Register PWA service worker — production only.
// In dev mode, unregister any stale SW so HMR works correctly.
if ("serviceWorker" in navigator) {
  if (import.meta.hot) {
    // Dev: kill any cached service worker so it never serves stale bundles
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((reg) => reg.unregister());
    });
  } else {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
}

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

if (import.meta.hot) {
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  createRoot(elem).render(app);
}
