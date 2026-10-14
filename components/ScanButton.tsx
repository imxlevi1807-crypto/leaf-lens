"use client";

import { useRef, type ChangeEvent } from "react";

interface ScanButtonProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export default function ScanButton({ onFile, disabled }: ScanButtonProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so selecting the same photo twice still fires onChange
    e.target.value = "";
    if (file) onFile(file);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 lg:items-start">
      {/* `capture` opens the rear camera on phones; desktop falls back to a file picker */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        tabIndex={-1}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => cameraRef.current?.click()}
        className="group inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-full bg-moss-400 px-10 text-lg font-semibold text-forest-950 shadow-lg shadow-black/30 transition hover:bg-moss-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss-300 active:scale-[0.98] disabled:opacity-50 sm:w-auto sm:min-w-72"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
          aria-hidden="true"
        >
          <path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.5-2Z" />
          <circle cx="12" cy="12.5" r="3.5" />
        </svg>
        Scan Plant
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => galleryRef.current?.click()}
        className="rounded-md px-2 py-1 text-sm font-medium text-sage underline decoration-forest-600 underline-offset-4 transition hover:text-ivory focus-visible:outline-2 focus-visible:outline-moss-400"
      >
        Upload from gallery instead
      </button>
    </div>
  );
}
