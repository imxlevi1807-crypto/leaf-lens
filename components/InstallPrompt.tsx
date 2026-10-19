// components/InstallPrompt.tsx
"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA
    const inStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(inStandalone);

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture Android/Chrome install event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed or dismissed
  if (isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div className="fixed top-4 inset-x-4 z-50 mx-auto max-w-md rounded-2xl bg-forest-900/95 p-3.5 border-2 border-emerald-500/60 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌿</span>
          <div className="text-left">
            <h4 className="text-xs font-black text-ivory">Install LeafLens App</h4>
            <p className="text-[11px] text-sage">Add to home screen for fullscreen camera scan</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {deferredPrompt ? (
            <button
              type="button"
              onClick={handleInstallClick}
              className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-black text-slate-950 shadow-md active:scale-95"
            >
              Install
            </button>
          ) : isIOS ? (
            <span className="text-[10px] font-bold text-amber-300">
              Tap Share ➔ Add to Home
            </span>
          ) : null}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-sage hover:text-ivory text-xs p-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}