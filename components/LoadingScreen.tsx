"use client";

import { useState, useEffect } from "react";

interface LoadingScreenProps {
  previewUrl: string | null;
}

const SCAN_STEPS = [
  "Inspecting leaf venation & color patterns...",
  "Scanning for fungal spots & pest damage...",
  "Factoring in balcony sunlight & wind exposure...",
  "Formulating organic home remedy...",
];

export default function LoadingScreen({ previewUrl }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);

  // Cycle through inspection stages every 1.8s so the user sees continuous activity
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-forest-950/95 px-6 backdrop-blur-md"
    >
      {/* 1. Main Scanning Viewfinder Window */}
      <div className="relative size-64 sm:size-80 overflow-hidden rounded-3xl bg-forest-900 border-2 border-forest-700 shadow-[0_0_40px_rgba(34,197,94,0.25)]">
        {/* The User's Uploaded Leaf Photo */}
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Scanning leaf"
            className="size-full object-cover opacity-75 filter saturate-110"
          />
        )}

        {/* Holographic Green Scanning Grid Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(to right, #22c55e 1px, transparent 1px), linear-gradient(to bottom, #22c55e 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Viewfinder Corner Brackets */}
        <span className="absolute left-3 top-3 size-6 rounded-tl-lg border-l-2 border-t-2 border-emerald-400" />
        <span className="absolute right-3 top-3 size-6 rounded-tr-lg border-r-2 border-t-2 border-emerald-400" />
        <span className="absolute bottom-3 left-3 size-6 rounded-bl-lg border-b-2 border-l-2 border-emerald-400" />
        <span className="absolute bottom-3 right-3 size-6 rounded-br-lg border-b-2 border-r-2 border-emerald-400" />

        {/* Pulsing Center Reticle Target */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="size-16 rounded-full border border-dashed border-emerald-400/50 animate-spin [animation-duration:8s]" />
          <div className="absolute size-8 rounded-full border border-emerald-400/80 animate-ping [animation-duration:2s]" />
        </div>

        {/* Moving Laser Beam Sweep with Glowing Gradient Sheet */}
        <div className="pointer-events-none absolute inset-x-0 animate-scan">
          {/* Glowing Light Trail */}
          <div className="h-16 w-full bg-gradient-to-t from-emerald-400/30 to-transparent" />
          {/* Core Laser Line */}
          <div className="h-0.5 w-full bg-emerald-300 shadow-[0_0_18px_3px_rgba(52,211,153,0.9)]" />
        </div>

        {/* Corner HUD Badge */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Analysis</span>
        </div>
      </div>

      {/* 2. Dynamic Status Information & Stepper */}
      <div className="flex max-w-sm flex-col items-center text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ivory sm:text-3xl">
          Analyzing your plant...
        </h2>

        {/* Active Stage Stepper Message */}
        <p className="mt-2.5 min-h-[1.5rem] text-sm font-semibold text-emerald-400 animate-in fade-in duration-300">
          {SCAN_STEPS[stepIndex]}
        </p>

        {/* Smooth Looping Progress Bar */}
        <div className="mt-5 h-1.5 w-56 overflow-hidden rounded-full bg-forest-800 border border-forest-700">
          <div className="h-full w-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 animate-pulse" />
        </div>

        <p className="mt-3 text-xs text-sage">
          Factoring in temperature, wind velocity, and balcony light
        </p>
      </div>
    </div>
  );
}