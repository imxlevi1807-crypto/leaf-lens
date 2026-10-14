/** Viewfinder illustration: the one decorative moment on the home page. */
export default function LensGraphic() {
  return (
    <div className="relative size-60 shrink-0 sm:size-72 lg:size-[26rem]" aria-hidden="true">
      {/* Viewfinder corners */}
      <span className="absolute left-0 top-0 size-9 rounded-tl-xl border-l-2 border-t-2 border-moss-400" />
      <span className="absolute right-0 top-0 size-9 rounded-tr-xl border-r-2 border-t-2 border-moss-400" />
      <span className="absolute bottom-0 left-0 size-9 rounded-bl-xl border-b-2 border-l-2 border-moss-400" />
      <span className="absolute bottom-0 right-0 size-9 rounded-br-xl border-b-2 border-r-2 border-moss-400" />

      {/* Lens */}
      <div className="absolute inset-7 overflow-hidden rounded-full bg-forest-900 ring-1 ring-forest-700 lg:inset-10">
        <div className="absolute inset-3 rounded-full ring-1 ring-forest-800" />

        <svg viewBox="0 0 200 200" className="absolute inset-0 size-full p-[14%]">
          <path
            d="M100 18C152 48 172 112 100 184 28 112 48 48 100 18Z"
            fill="var(--color-forest-700)"
          />
          <path
            d="M100 34V184M100 72 130 94M100 72 70 94M100 104 136 128M100 104 64 128M100 136 124 154M100 136 76 154"
            stroke="var(--color-moss-400)"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Blight spots */}
          <circle cx="121" cy="112" r="6" fill="#c9a66b" fillOpacity="0.85" />
          <circle cx="82" cy="100" r="3.5" fill="#c9a66b" fillOpacity="0.7" />
        </svg>

        {/* Scan line */}
        <div className="absolute left-0 right-0 h-px animate-scan bg-moss-400/80 shadow-[0_0_12px_2px_rgba(156,204,138,0.45)]" />
      </div>
    </div>
  );
}
