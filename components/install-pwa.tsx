"use client";

import { useEffect, useState } from "react";

const REGEX_IOS = /iPad|iPhone|iPod/;

interface WindowWithMSStream extends Window {
  MSStream?: unknown;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: "accepted" | "dismissed" }>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isDeferredPromptAvailable, setIsDeferredPromptAvailable] =
    useState(false);

  useEffect(() => {
    setIsIOS(
      REGEX_IOS.test(navigator.userAgent) &&
        !(window as WindowWithMSStream).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setIsDeferredPromptAvailable(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }

    const result = await installPrompt.prompt();
    console.log(`Install prompt was: ${result.outcome}`);
    setInstallPrompt(null);
    setIsDeferredPromptAvailable(false);
  };

  const shouldShowPrompt =
    !isStandalone && (isDeferredPromptAvailable || isIOS);

  if (!shouldShowPrompt) {
    return null;
  }

  return (
    <div>
      <h3>Install App</h3>
      {isDeferredPromptAvailable && (
        <button onClick={handleInstallClick} type="button">
          Add to Home Screen
        </button>
      )}
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span aria-label="share icon" role="img">
            {" "}
            ⎋{" "}
          </span>
          and then "Add to Home Screen"
          <span aria-label="plus icon" role="img">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}
