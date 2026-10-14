"use client";

import { useRef, type ChangeEvent } from "react";
import type { PlantContext, BalconyDirection } from "@/lib/types";

const DIRECTIONS: { dir: BalconyDirection; sun: string }[] = [
  { dir: "East", sun: "Morning Sun" },
  { dir: "West", sun: "Afternoon Sun" },
  { dir: "South", sun: "Full Sun" },
  { dir: "North", sun: "Shade" },
  { dir: "South-East", sun: "Bright" },
  { dir: "South-West", sun: "Hot Sun" },
  { dir: "North-East", sun: "Mild" },
  { dir: "North-West", sun: "Evening" },
  { dir: "Indoor (No Balcony)", sun: "Indoor" },
];

const FLOORS = ["Ground / Yard", "1st – 3rd Floor", "4th – 9th Floor", "10th+ Floor (Windy)"];

interface Props {
  plants: PlantContext[];
  activePlantId: string;
  onSelectPlant: (id: string) => void;
  onAddPlant: () => void;
  onRemovePlant: (id: string) => void;
  onUpdatePlant: (id: string, updates: Partial<PlantContext>) => void;
  onScan: (context: PlantContext, file: File) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

export default function PlantContextManager({
  plants,
  activePlantId,
  onSelectPlant,
  onAddPlant,
  onRemovePlant,
  onUpdatePlant,
  onScan,
  disabled,
  isMobile,
}: Props) {
  const activePlant = plants.find((p) => p.id === activePlantId) || plants[0];
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file && activePlant) onScan(activePlant, file);
  };

  return (
    <div className="w-full rounded-3xl bg-forest-900/95 p-5 sm:p-7 shadow-2xl border-2 border-forest-700/80 backdrop-blur-md">
      {/* 1. Plant Selector Tabs */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-forest-700/60 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto p-1 -m-1">
          {plants.map((plant, index) => {
            const isActive = plant.id === activePlantId;
            return (
              <button
                key={plant.id}
                type="button"
                onClick={() => onSelectPlant(plant.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition-all active:scale-95 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 border-2 border-amber-300 shadow-md ring-2 ring-emerald-400/30"
                    : "bg-forest-800 text-ivory border-2 border-forest-700 hover:bg-forest-700"
                }`}
              >
                <span>{plant.name || `Plant #${index + 1}`}</span>
                {plants.length > 1 && (
                  <span
                    role="button"
                    title="Remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePlant(plant.id);
                    }}
                    className="ml-1 rounded-full p-0.5 text-[10px] opacity-70 hover:opacity-100"
                  >
                    ✕
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onAddPlant}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-forest-600 bg-forest-800 px-3 py-1.5 text-xs font-bold text-ivory transition-all active:scale-95"
        >
          <span className="text-emerald-400 font-extrabold">+</span> Add
        </button>
      </div>

      {/* 2. Plant Configuration Form */}
      {activePlant && (
        <div className="mt-5 flex flex-col gap-4 text-left">
          {/* Plant Name */}
          <div>
            <label className="block text-[11px] font-black tracking-wider uppercase text-ivory">
              Plant Name / Nickname
            </label>
            <input
              type="text"
              value={activePlant.name}
              placeholder="e.g. Balcony Monstera"
              onChange={(e) => onUpdatePlant(activePlant.id, { name: e.target.value })}
              className="mt-1.5 w-full rounded-2xl bg-forest-800 px-4 py-3 text-sm font-bold text-ivory placeholder:text-sage border-2 border-forest-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Auto-Detect Switch */}
          <div className="rounded-2xl bg-forest-800/80 p-3.5 border-2 border-forest-700">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-black tracking-wider uppercase text-ivory">
                Species Identification
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={activePlant.autoDetectType}
                onClick={() =>
                  onUpdatePlant(activePlant.id, {
                    autoDetectType: !activePlant.autoDetectType,
                    plantType: !activePlant.autoDetectType ? "" : activePlant.plantType,
                  })
                }
                className="flex items-center gap-2 select-none active:scale-95"
              >
                <span className={`text-xs font-black ${activePlant.autoDetectType ? "text-emerald-500" : "text-sage"}`}>
                  {activePlant.autoDetectType ? "Auto-Detect ON" : "Manual Type"}
                </span>

                <div
                  className={`relative flex h-6 w-11 items-center rounded-full p-0.5 border-2 transition-all ${
                    activePlant.autoDetectType
                      ? "bg-emerald-500 border-amber-300"
                      : "bg-slate-700 border-slate-500"
                  }`}
                >
                  <span
                    className={`block size-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      activePlant.autoDetectType ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>
            </div>

            {activePlant.autoDetectType ? (
              <p className="mt-2 text-xs font-semibold text-emerald-400">
                LeafLens AI will identify species automatically from the leaf photo.
              </p>
            ) : (
              <input
                type="text"
                placeholder="e.g. Ficus elastica, Snake Plant"
                value={activePlant.plantType}
                onChange={(e) => onUpdatePlant(activePlant.id, { plantType: e.target.value })}
                className="mt-2.5 w-full rounded-xl bg-forest-900 px-3.5 py-2.5 text-sm font-bold text-ivory placeholder:text-sage border-2 border-forest-700 focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>

          {/* City & Floor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black tracking-wider uppercase text-ivory">
                City
              </label>
              <input
                type="text"
                value={activePlant.city}
                placeholder="e.g. Delhi"
                onChange={(e) => onUpdatePlant(activePlant.id, { city: e.target.value })}
                className="mt-1.5 w-full rounded-2xl bg-forest-800 px-3.5 py-2.5 text-sm font-bold text-ivory placeholder:text-sage border-2 border-forest-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black tracking-wider uppercase text-ivory">
                Floor Level
              </label>
              <div className="relative mt-1.5">
                <select
                  value={activePlant.floor}
                  onChange={(e) => onUpdatePlant(activePlant.id, { floor: e.target.value })}
                  className="w-full cursor-pointer appearance-none rounded-2xl bg-forest-800 px-3.5 py-2.5 pr-8 text-xs font-bold text-ivory border-2 border-forest-700 focus:outline-none focus:border-emerald-500"
                >
                  {FLOORS.map((f) => (
                    <option key={f} value={f} className="bg-forest-900 text-ivory font-bold">
                      {f}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-500 font-black">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Balcony Direction */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-black tracking-wider uppercase text-ivory">
                Balcony Direction
              </label>
              <span className="text-[10px] font-bold text-emerald-500">Sunlight angle</span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {DIRECTIONS.map(({ dir, sun }) => {
                const isSelected = activePlant.balconyDirection === dir;
                return (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => onUpdatePlant(activePlant.id, { balconyDirection: dir })}
                    className={`flex flex-col items-center justify-center rounded-2xl p-2 text-center transition-all active:scale-95 ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 border-2 border-amber-300 shadow-md scale-[1.02]"
                        : "bg-forest-800 text-ivory border-2 border-forest-700 hover:border-emerald-500/50"
                    }`}
                  >
                    <span className={`text-xs font-black leading-tight ${isSelected ? "text-slate-950" : "text-ivory"}`}>
                      {dir}
                    </span>
                    <span className={`mt-0.5 text-[9px] font-bold leading-none ${isSelected ? "text-slate-900" : "text-sage"}`}>
                      {sun}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Scan Button (Shown only on Laptop view inside the card) */}
          {!isMobile && (
            <div className="mt-3 pt-4 border-t-2 border-forest-700/60 flex flex-col gap-3">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={disabled}
                onClick={() => cameraInputRef.current?.click()}
                className="flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 px-6 text-base font-black text-slate-950 shadow-[0_0_24px_rgba(34,197,94,0.5)] border-2 border-amber-300 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-5 text-slate-950">
                  <path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.5-2Z" />
                  <circle cx="12" cy="12.5" r="3.5" />
                </svg>
                <span>Scan {activePlant.name || "Plant"}</span>
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={() => galleryInputRef.current?.click()}
                className="text-center text-xs font-bold text-sage transition hover:text-emerald-500 underline decoration-forest-600 underline-offset-4"
              >
                Upload from file / gallery instead
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}