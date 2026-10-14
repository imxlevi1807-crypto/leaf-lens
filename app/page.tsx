"use client";

import { useEffect, useState, useRef } from "react";
import Logo from "@/components/Logo";
import LensGraphic from "@/components/LensGraphic";
import LoadingScreen from "@/components/LoadingScreen";
import ResultCard from "@/components/ResultCard";
import WhyLeafLens from "@/components/whyleaflens";
import PlantContextManager from "@/components/PlantContextManager";
import BotanicalFrame from "@/components/BotanicalFrame";
import { analyzePlant } from "@/lib/analyze";
import type { PlantAnalysis, PlantContext } from "@/lib/types";

type Status = "idle" | "loading" | "result" | "error";
type Tab = "home" | "plants" | "advice";

const INITIAL_PLANTS: PlantContext[] = [
  {
    id: "plant-1",
    name: "Balcony Monstera",
    city: "Delhi",
    floor: "4th – 9th Floor",
    balconyDirection: "East",
    plantType: "",
    autoDetectType: true,
  },
];

const NOTIFICATIONS = [
  {
    id: "notif-1",
    plant: "Balcony Monstera",
    type: "water",
    title: "Watering Due Today",
    desc: "Top 5 cm soil is dry. Water slowly until it drains.",
    urgent: true,
  },
  {
    id: "notif-2",
    plant: "Balcony Monstera",
    type: "sun",
    title: "Rotate Pot 90°",
    desc: "Encourages even foliage growth toward East morning light.",
    urgent: false,
  },
  {
    id: "notif-3",
    plant: "General Garden",
    type: "wind",
    title: "High Wind Alert (Floor 4+)",
    desc: "Higher balconies dry soil 30% faster. Check moisture daily.",
    urgent: false,
  },
];

const ADVICE_CARDS = [
  {
    tag: "New Plant Parent?",
    title: "3 Unkillable Starter Plants",
    desc: "Snake Plant, ZZ Plant, and Golden Pothos survive missed waterings and low light effortlessly.",
    badge: "Beginner",
  },
  {
    tag: "Watering Rule #1",
    title: "The 2-Inch Finger Test",
    desc: "Stick your finger 5 cm into the soil. If it feels cool and damp, hold off on watering.",
    badge: "Essential",
  },
  {
    tag: "Balcony Hack",
    title: "Afternoon Sun Warning",
    desc: "West balconies burn thin tropical leaves between 1 PM and 4 PM. Filter sunlight with a sheer shade.",
    badge: "Sunlight",
  },
  {
    tag: "Drainage Secret",
    title: "Empty the Saucer",
    desc: "Never let root balls sit in runoff water for over 20 minutes—it suffocates oxygen intake.",
    badge: "Root Health",
  },
  {
    tag: "Yellow Leaf Panic?",
    title: "Bottom Leaves Drop Naturally",
    desc: "Plants shed oldest lower foliage to channel nutrients into brand-new top growth.",
    badge: "Diagnosis",
  },
];

export default function HomePage() {
  const [status, setStatus] = useState<Status>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PlantAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [plants, setPlants] = useState<PlantContext[]>(INITIAL_PLANTS);
  const [activePlantId, setActivePlantId] = useState<string>("plant-1");

  // Only 3 Tabs: Home, Plants, Advice
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const activePlant = plants.find((p) => p.id === activePlantId) || plants[0];

  const handleAddPlant = () => {
    const newId = `plant-${Date.now()}`;
    const newPlant: PlantContext = {
      id: newId,
      name: `Plant #${plants.length + 1}`,
      city: plants[0]?.city || "Delhi",
      floor: plants[0]?.floor || "1st – 3rd Floor",
      balconyDirection: "South",
      plantType: "",
      autoDetectType: true,
    };
    setPlants((prev) => [...prev, newPlant]);
    setActivePlantId(newId);
  };

  const handleRemovePlant = (id: string) => {
    setPlants((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (activePlantId === id && filtered.length > 0) {
        setActivePlantId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleUpdatePlant = (id: string, updates: Partial<PlantContext>) => {
    setPlants((prev) =>
      prev.map((plant) => (plant.id === id ? { ...plant, ...updates } : plant))
    );
  };

  async function handleScan(context: PlantContext, file: File) {
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setStatus("loading");

    try {
      const analysis = await analyzePlant(file, context);
      setResult(analysis);
      setStatus("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setError(null);
    setPreviewUrl(null);
    setActiveTab("home");
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <BotanicalFrame />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-28 pt-2 sm:px-8 lg:pb-12">
        {/* App Header Bar */}
        <header className="flex items-center justify-between py-4">
          <button
            type="button"
            onClick={reset}
            aria-label="LeafLens home"
            className="rounded-lg focus-visible:outline-2 focus-visible:outline-moss-400"
          >
            <Logo />
          </button>

          {/* Theme Switcher */}
          <div
            role="radiogroup"
            aria-label="Theme mode"
            className={`inline-flex items-center rounded-full p-1 shadow-md ${
              theme === "dark"
                ? "bg-black/75 border border-amber-500/30"
                : "bg-forest-800 border-2 border-forest-700"
            }`}
          >
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                theme === "dark"
                  ? "bg-forest-700 text-ivory border border-amber-400/60 shadow-sm"
                  : "text-sage hover:text-ivory"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-3">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black transition-all ${
                theme === "light"
                  ? "bg-moss-400 text-[#06150e] border border-amber-400/60 shadow-md"
                  : "text-sage hover:text-ivory"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-3 text-[#06150e]">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <span>Light</span>
            </button>
          </div>
        </header>

        {status === "result" && result ? (
          <section className="pb-16 pt-2">
            <ResultCard result={result} previewUrl={previewUrl} onReset={reset} />
          </section>
        ) : status === "error" ? (
          <section className="flex flex-1 items-center justify-center pb-20">
            <div
              role="alert"
              className="w-full max-w-sm rounded-3xl bg-forest-900 p-6 text-center border-2 border-forest-700 shadow-2xl"
            >
              <h1 className="font-display text-2xl font-bold text-ivory">Scan failed</h1>
              <p className="mt-2 text-sm text-sage">{error}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-emerald-500 font-black text-slate-950 shadow-md"
              >
                Try again
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* ======================================================== */}
            {/* TAB 1: HOME PAGE (Prominent Scanner + Paragraphs Below)  */}
            {/* ======================================================== */}
            {activeTab === "home" && (
              <div className="flex flex-col gap-10 animate-in fade-in duration-200">
                {/* 1. Header Headline */}
                <div className="text-center sm:text-left">
                  <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ivory sm:text-5xl">
                    Know what your plant is trying to tell you.
                  </h1>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-sage sm:text-base max-w-2xl">
                    Photograph a leaf for an AI diagnosis, a step-by-step remedy, and microclimate care tailored to your floor level and balcony orientation.
                  </p>
                </div>

                {/* 2. THE PROMINENT PLANT IMAGE SCANNER */}
                <section
                  id="scanner-hero"
                  className="rounded-3xl bg-forest-900/90 p-5 sm:p-8 border-2 border-forest-700 shadow-2xl backdrop-blur-md"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Viewfinder Lens Graphic (Prominent Visual Scanner) */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center">
                      <div className="relative p-2">
                        <LensGraphic />
                        <div className="absolute inset-0 grid place-items-center pointer-events-none">
                          <span className="rounded-full bg-forest-950/80 px-3.5 py-1 text-xs font-black text-emerald-400 border border-emerald-500/40 backdrop-blur-sm shadow-lg">
                            AI Optical Scanner
                          </span>
                        </div>
                      </div>

                      {/* Primary Camera & Gallery Upload Triggers */}
                      <div className="mt-6 flex w-full max-w-xs items-center gap-3">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex-1 flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-forest-700 via-forest-600 to-forest-700 font-extrabold text-ivory shadow-lg border-2 border-amber-400/60 transition-all hover:border-amber-400 active:scale-95"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-5 text-emerald-400">
                            <path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.5-2Z" />
                            <circle cx="12" cy="12.5" r="3.5" />
                          </svg>
                          <span>Scan Leaf</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          title="Upload photo from gallery"
                          className="grid size-14 shrink-0 place-items-center rounded-full bg-forest-800 text-ivory border-2 border-forest-700 shadow-md transition-all hover:border-emerald-500 active:scale-95"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6 text-emerald-400">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                        </button>
                      </div>

                      <p className="mt-2.5 text-center text-xs font-semibold text-sage">
                        Works in daylight with one leaf filling the frame
                      </p>
                    </div>

                    {/* Integrated Plant & Microclimate Configuration */}
                    <div className="lg:col-span-7">
                      <PlantContextManager
                        plants={plants}
                        activePlantId={activePlantId}
                        onSelectPlant={setActivePlantId}
                        onAddPlant={handleAddPlant}
                        onRemovePlant={handleRemovePlant}
                        onUpdatePlant={handleUpdatePlant}
                        onScan={handleScan}
                        disabled={status === "loading"}
                        isMobile={false}
                      />
                    </div>
                  </div>
                </section>

                {/* 3. PARAGRAPHS RIGHT AFTER THE PROMINENT SCANNER */}
                <section className="pt-2">
                  <WhyLeafLens />
                </section>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: PLANTS (Manage Garden + Watering Tasks)           */}
            {/* ======================================================== */}
            {activeTab === "plants" && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                {/* Watering & Care Tasks */}
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Watering & Care Tasks
                  </h2>
                  <div className="mt-2.5 flex flex-col gap-2">
                    {notifications.length === 0 ? (
                      <div className="rounded-2xl bg-forest-900 p-4 text-center border-2 border-forest-700 text-xs text-sage">
                        All plant care tasks are up to date!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start justify-between rounded-2xl p-3.5 border-2 transition-all ${
                            n.urgent
                              ? "bg-forest-900 border-emerald-500/60 shadow-md"
                              : "bg-forest-900/80 border-forest-700"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="grid size-8 place-items-center rounded-xl bg-forest-800 border border-forest-600 shrink-0 text-emerald-400 mt-0.5">
                              {n.type === "water" ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
                                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                                </svg>
                              ) : n.type === "sun" ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4 text-amber-400">
                                  <circle cx="12" cy="12" r="4" />
                                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
                                  <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                                  <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                                  <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                                </svg>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs font-black text-ivory">{n.title}</h3>
                                <span className="text-[10px] rounded bg-forest-800 px-1.5 py-0.5 text-emerald-400 font-bold border border-forest-600">
                                  {n.plant}
                                </span>
                              </div>
                              <p className="mt-0.5 text-xs text-sage">{n.desc}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => dismissNotification(n.id)}
                            className="text-[10px] font-bold text-emerald-400 hover:text-white rounded-full bg-forest-800 px-2.5 py-1 border border-forest-600 active:scale-90"
                          >
                            Done ✓
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Full Garden & Microclimate Editor */}
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-ivory mb-2">
                    Manage Balcony Context & Species
                  </h2>
                  <PlantContextManager
                    plants={plants}
                    activePlantId={activePlantId}
                    onSelectPlant={setActivePlantId}
                    onAddPlant={handleAddPlant}
                    onRemovePlant={handleRemovePlant}
                    onUpdatePlant={handleUpdatePlant}
                    onScan={handleScan}
                    disabled={status === "loading"}
                    isMobile={false}
                  />
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: ADVICE (Plant Care Advice Cards)                  */}
            {/* ======================================================== */}
            {activeTab === "advice" && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ivory sm:text-3xl">
                    New Plant Parent? Start Here
                  </h2>
                  <p className="mt-1 text-xs text-sage sm:text-sm">
                    Essential apartment and balcony care tips to keep tropical foliage thriving.
                  </p>
                </div>

                {/* Grid of Advice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ADVICE_CARDS.map((card, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl bg-forest-900 p-5 border-2 border-forest-700 shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                            {card.tag}
                          </span>
                          <span className="rounded-full bg-forest-800 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/40">
                            {card.badge}
                          </span>
                        </div>
                        <h3 className="mt-3 text-base font-extrabold text-ivory leading-snug">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-sage">
                          {card.desc}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-forest-800 flex items-center justify-between text-[11px] font-bold text-emerald-400">
                        <span>Tip #{idx + 1}</span>
                        <span>Read guidance ➔</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* ONLY 3 BOTTOM NAVIGATION ICONS: Home, Plants, Advice     */}
            {/* ======================================================== */}
            <nav className="fixed inset-x-0 bottom-0 z-40 bg-forest-950/95 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t-2 border-forest-800/80 backdrop-blur-lg lg:hidden">
              <div className="mx-auto grid grid-cols-3 max-w-sm items-center">
                {/* 1. Home Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("home")}
                  className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                    activeTab === "home" ? "text-emerald-400 font-black scale-105" : "text-sage hover:text-ivory"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-5">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="text-[10px] mt-1 font-bold">Home</span>
                </button>

                {/* 2. Plants Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("plants")}
                  className={`relative flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                    activeTab === "plants" ? "text-emerald-400 font-black scale-105" : "text-sage hover:text-ivory"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-5">
                    <path d="M11 20A7 7 0 0 1 4 13a7 7 0 0 1 7-7c3.87 0 7 3.13 7 7a7 7 0 0 1-7 7Z" />
                    <path d="M12 9v11" />
                  </svg>
                  <span className="text-[10px] mt-1 font-bold">Plants</span>
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-8 size-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>

                {/* 3. Advice Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("advice")}
                  className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                    activeTab === "advice" ? "text-emerald-400 font-black scale-105" : "text-sage hover:text-ivory"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-5">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                  <span className="text-[10px] mt-1 font-bold">Advice</span>
                </button>
              </div>
            </nav>

            {/* Hidden Input Triggers for Scanner */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file && activePlant) handleScan(activePlant, file);
              }}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file && activePlant) handleScan(activePlant, file);
              }}
              className="hidden"
            />
          </>
        )}

        {status === "loading" && <LoadingScreen previewUrl={previewUrl} />}
      </main>
    </>
  );
}