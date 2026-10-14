"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { LeafIcon } from "./Logo";

/* ---------- Slides ---------- */

function SlideProblem() {
  return (
    <>
      <div>
        <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          7 in 10 new plants never see month four.
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-ivory/90 sm:text-lg">
          You water on time. You pick a sunny spot. Then the leaves go yellow and nobody tells
          you why. That&apos;s not a brown thumb, it&apos;s guesswork. Around 70% of new plants die
          within three months, and almost all of them were fixable.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="grid grid-cols-5 gap-3 sm:gap-4" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => {
            const dies = i >= 3;
            return (
              <span
                key={i}
                className={`inline-block text-moss-400 ${dies ? "ll-wilt" : ""}`}
                style={dies ? { animationDelay: `${0.4 + (i - 3) * 0.18}s` } : undefined}
              >
                <LeafIcon className="size-9 sm:size-12" />
              </span>
            );
          })}
        </div>
        <p className="text-sm text-[#ff9a8b]">7 of these 10 won&apos;t make it.</p>
      </div>
    </>
  );
}

const suspects = [
  ["Drowning roots", "bg-[#7cc4e8]/15 text-[#a8dcf5] ring-[#7cc4e8]/40"],
  ["Thirsty pot", "bg-[#f4b942]/15 text-[#f8cf7a] ring-[#f4b942]/40"],
  ["Scorching sun", "bg-[#ef6f5e]/15 text-[#ff9a8b] ring-[#ef6f5e]/40"],
  ["Windy 12th floor", "bg-[#b9a6f2]/15 text-[#d3c6fa] ring-[#b9a6f2]/40"],
  ["Muggy monsoon", "bg-[#5fd0b0]/15 text-[#8fe3cb] ring-[#5fd0b0]/40"],
  ["Sneaky aphids", "bg-[#f29bb8]/15 text-[#f8bcd0] ring-[#f29bb8]/40"],
];

function SlideSuspects() {
  return (
    <>
      <div>
        <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          One yellow leaf, six possible suspects.
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-ivory/90 sm:text-lg">
          Too much water and too little water look almost identical. Generic advice makes you
          guess, and a wrong guess, like watering a pot that&apos;s already soggy, can finish the
          plant off. LeafLens narrows it down before you touch the watering can.
        </p>
      </div>
      <div className="flex flex-wrap content-center justify-center gap-3">
        {suspects.map(([label, cls], i) => (
          <span
            key={label}
            className={`ll-pop rounded-full px-4 py-2 text-sm font-medium ring-1 sm:text-base ${cls}`}
            style={{ animationDelay: `${0.15 + i * 0.09}s` }}
          >
            {label}
          </span>
        ))}
      </div>
    </>
  );
}

function SlidePlan() {
  return (
    <>
      <div>
        <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          Same crispy leaf. Different plan.
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-ivory/90 sm:text-lg">
          LeafLens reads your city&apos;s weather today, the direction your balcony faces and which
          floor you&apos;re on, then tells each person something different.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-[#7cc4e8]/10 p-4 ring-1 ring-[#7cc4e8]/35">
          <p className="font-medium text-[#a8dcf5]">Kochi, 2nd floor, shaded and humid</p>
          <p className="mt-1 text-sm leading-relaxed text-ivory/85 sm:text-base">
            Likely a fungal spot. Spray diluted buttermilk, let air move through, water less.
          </p>
        </div>
        <div className="rounded-2xl bg-[#f4b942]/10 p-4 ring-1 ring-[#f4b942]/35">
          <p className="font-medium text-[#f8cf7a]">Noida, 12th floor, west-facing, May</p>
          <p className="mt-1 text-sm leading-relaxed text-ivory/85 sm:text-base">
            Likely sun and wind scorch. Pull it out of the afternoon sun, water deeply, group the
            pots together.
          </p>
        </div>
      </div>
    </>
  );
}

const kitchen = [
  ["Neem", "aphids, mealybugs, early fungus", "bg-[#a6d86b]"],
  ["Haldi", "dust on pruning cuts", "bg-[#f4b942]"],
  ["Buttermilk, 1:10", "powdery mildew", "bg-[#e9eef2]"],
  ["Baking soda, 1 tsp/L", "powdery mildew", "bg-[#7cc4e8]"],
  ["Garlic + green chilli", "aphids, caterpillars", "bg-[#ef6f5e]"],
  ["Chulha ash", "ants and slugs", "bg-[#b4bcc2]"],
];

function SlideKitchen() {
  return (
    <>
      <div>
        <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          Your kitchen is the pharmacy.
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-ivory/90 sm:text-lg">
          No hunting for imported sprays. Every plan names the exact amount and how to use it.
          Home remedies are gentle, not instant, so test on one leaf first and spray in the
          evening.
        </p>
      </div>
      <ul className="grid content-center gap-3 sm:grid-cols-2">
        {kitchen.map(([name, use, dot], i) => (
          <li
            key={name}
            className="ll-pop flex items-start gap-3 rounded-xl bg-forest-800/70 p-3 ring-1 ring-forest-600"
            style={{ animationDelay: `${0.1 + i * 0.07}s` }}
          >
            <span className={`mt-1.5 size-3 shrink-0 rounded-full ${dot}`} />
            <span className="text-sm leading-snug sm:text-base">
              <span className="font-medium text-ivory">{name}</span>
              <br />
              <span className="text-sage">{use}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function SlideLens() {
  return (
    <>
      <div>
        <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          Google Lens names it. LeafLens fixes it.
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-ivory/90 sm:text-lg">
          Lens is great at telling you what plant you have. It can&apos;t tell you why it&apos;s
          dying on your balcony, today. That&apos;s the gap we fill.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-forest-800/70 p-4 ring-1 ring-forest-600">
          <p className="text-sm font-medium text-sage">Google Lens</p>
          <p className="mt-1 text-ivory/85">&ldquo;That&apos;s a monstera.&rdquo; Plus a pile of links to read.</p>
        </div>
        <div className="rounded-2xl bg-forest-800/70 p-4 ring-1 ring-forest-600">
          <p className="text-sm font-medium text-sage">Generic plant sites</p>
          <p className="mt-1 text-ivory/85">&ldquo;Water when the soil is dry.&rdquo; Which soil? Which city?</p>
        </div>
        <div className="rounded-2xl bg-[#f29bb8]/10 p-4 ring-1 ring-[#f29bb8]/45">
          <p className="text-sm font-medium text-[#f8bcd0]">LeafLens</p>
          <p className="mt-1 text-ivory">
            What&apos;s wrong, how bad it is, the steps in order, and one thing to do today.
          </p>
        </div>
      </div>
    </>
  );
}

const slides: { tab: string; glow: string; active: string; body: ReactNode }[] = [
  { tab: "The problem", glow: "bg-[#ef6f5e]/20", active: "bg-[#ef6f5e] text-[#2a0d09]", body: <SlideProblem /> },
  { tab: "Why they die", glow: "bg-[#f4b942]/20", active: "bg-[#f4b942] text-[#2b1c02]", body: <SlideSuspects /> },
  { tab: "Your plan", glow: "bg-[#7cc4e8]/20", active: "bg-[#7cc4e8] text-[#06222f]", body: <SlidePlan /> },
  { tab: "Kitchen fixes", glow: "bg-[#a6d86b]/20", active: "bg-[#a6d86b] text-[#13250a]", body: <SlideKitchen /> },
  { tab: "Vs Google Lens", glow: "bg-[#f29bb8]/20", active: "bg-[#f29bb8] text-[#3a0d1f]", body: <SlideLens /> },
];

/* ---------- Carousel ---------- */

const AUTO_MS = 9000;
const FLIP_MS = 220;

export default function WhyLeafLens() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const last = slides.length - 1;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (next === index || leaving) return;
      if (reduced) return setIndex(next);
      setLeaving(true);
      timer.current = setTimeout(() => {
        setIndex(next);
        setLeaving(false);
      }, FLIP_MS);
    },
    [index, leaving, reduced]
  );

  // Gentle auto-advance until the person takes over; never loops
  useEffect(() => {
    if (!auto || paused || reduced || index >= last) return;
    const id = setTimeout(() => goTo(index + 1), AUTO_MS);
    return () => clearTimeout(id);
  }, [auto, paused, reduced, index, last, goTo]);

  function manual(next: number) {
    setAuto(false);
    goTo(next);
  }

  const slide = slides[index];

  return (
    <div className="py-4 sm:py-8">
      <style>{`
        .ll-flip-in{animation:ll-in .45s cubic-bezier(.2,.7,.2,1) both;transform-origin:50% 0}
        .ll-flip-out{animation:ll-out ${FLIP_MS}ms ease-in both;transform-origin:50% 0}
        @keyframes ll-in{from{opacity:0;transform:perspective(1000px) rotateX(-16deg) translateY(14px)}to{opacity:1;transform:none}}
        @keyframes ll-out{to{opacity:0;transform:perspective(1000px) rotateX(16deg) translateY(-10px)}}
        .ll-wilt{animation:ll-wilt .8s ease forwards}
        @keyframes ll-wilt{from{color:#9ccc8a}to{color:#c08a5a;transform:rotate(20deg)}}
        .ll-pop{animation:ll-pop .4s cubic-bezier(.2,.9,.3,1.3) both}
        @keyframes ll-pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){
          .ll-flip-in,.ll-flip-out,.ll-pop{animation:none}
          .ll-wilt{animation:none;color:#c08a5a}
        }
      `}</style>

      <h1 className="sr-only">LeafLens: plant diagnosis from a photo</h1>

      <section
        aria-roledescription="carousel"
        aria-label="Why LeafLens"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative overflow-hidden rounded-3xl bg-forest-900 ring-1 ring-forest-700"
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-20 -top-20 size-80 rounded-full blur-3xl transition-colors duration-700 ${slide.glow}`}
        />

        <div
          key={index}
          role="tabpanel"
          id={`why-panel-${index}`}
          aria-labelledby={`why-tab-${index}`}
          className={`relative grid min-h-[30rem] gap-8 p-6 sm:p-10 md:min-h-[24rem] md:grid-cols-2 md:gap-12 ${
            leaving ? "ll-flip-out" : "ll-flip-in"
          }`}
        >
          {slide.body}
        </div>

        <div className="relative flex flex-col gap-4 border-t border-forest-700 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div role="tablist" aria-label="Slides" className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {slides.map((s, i) => (
              <button
                key={s.tab}
                role="tab"
                id={`why-tab-${i}`}
                aria-selected={i === index}
                aria-controls={`why-panel-${i}`}
                type="button"
                onClick={() => manual(i)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss-300 ${
                  i === index ? s.active : "bg-forest-800 text-sage hover:text-ivory"
                }`}
              >
                {s.tab}
              </button>
            ))}
          </div>

          {index < last ? (
            <button
              type="button"
              onClick={() => manual(index + 1)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-moss-400 px-6 font-semibold text-forest-950 transition hover:bg-moss-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss-300 active:scale-[0.98]"
            >
              Next
            </button>
          ) : (
            <a
              href="#scan"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-moss-400 px-6 font-semibold text-forest-950 transition hover:bg-moss-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss-300 active:scale-[0.98]"
            >
              Scan your plant
            </a>
          )}
        </div>
      </section>

      <p className="mt-4 text-center text-sm">
        <a
          href="#scan"
          className="rounded-md text-sage underline decoration-forest-600 underline-offset-4 transition hover:text-ivory focus-visible:outline-2 focus-visible:outline-moss-400"
        >
          Skip to scanning your plant
        </a>
      </p>
    </div>
  );
}
