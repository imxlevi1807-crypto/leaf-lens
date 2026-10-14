export function LeafIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20 4C10 4 4 10 4 17c0 1 .2 2 .6 3 1-4 4-8 9-10-4 3-6 6-7.5 10.5.9.3 2.1.5 3.4.5 7 0 10.5-7 10.5-17Z" />
    </svg>
  );
}

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-forest-800 text-moss-400 ring-1 ring-forest-700">
        <LeafIcon />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">LeafLens</span>
    </div>
  );
}
