"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const REGEX_IOS = /iPad|iPhone|iPod/;
const PWA_DECISION_KEY = "pwa-install-decision";

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
  const [showModal, setShowModal] = useState(false);
  const [hasUserDecided, setHasUserDecided] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const detectedIOS =
      REGEX_IOS.test(navigator.userAgent) &&
      !(window as WindowWithMSStream).MSStream;

    setIsIOS(detectedIOS);
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    const savedDecision = localStorage.getItem(PWA_DECISION_KEY);
    if (savedDecision) {
      setHasUserDecided(true);
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setIsDeferredPromptAvailable(true);
      setShowModal(true);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    if (detectedIOS && !savedDecision) {
      setShowModal(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      console.log(`Install prompt was: ${result.outcome}`);
      localStorage.setItem(PWA_DECISION_KEY, result.outcome);
      setInstallPrompt(null);
      setIsDeferredPromptAvailable(false);
    } else {
      localStorage.setItem(PWA_DECISION_KEY, "accepted");
    }
    setHasUserDecided(true);
    setShowModal(false);
  };

  const handleCancelClick = () => {
    localStorage.setItem(PWA_DECISION_KEY, "dismissed");
    setHasUserDecided(true);
    setShowModal(false);
  };

  const canShowPrompt = isDeferredPromptAvailable || isIOS;
  const isNotInstalled = !isStandalone;
  const userHasNotDecided = !hasUserDecided;
  const shouldShowModal =
    isNotInstalled && userHasNotDecided && showModal && canShowPrompt;

  if (!shouldShowModal) {
    return null;
  }

  const handleOpenChange = () => {
    // Modal no se puede cerrar sin decidir
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={true}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Install App</DialogTitle>
          <DialogDescription>
            {isDeferredPromptAvailable
              ? "Install our application for a better experience. You'll have quick access from your home screen."
              : "To install this app on your iOS device, tap the share button and then 'Add to Home Screen'."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button onClick={handleCancelClick} type="button" variant="outline">
            Not now
          </Button>
          <Button onClick={handleInstallClick} type="button">
            Install
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
