"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to register the service worker on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if ("serviceWorker" in navigator && "serviceWorker" in window) {
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  }

  return null;
}
