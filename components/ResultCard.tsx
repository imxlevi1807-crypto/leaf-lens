"use client";

import { useState } from "react";
import type { PlantAnalysis, Severity } from "@/lib/types";
import { LeafIcon } from "./Logo";

const severityStyles: Record<Severity, { label: string; badge: string; dot: string }> = {
  healthy: { label: "Healthy", badge: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30", dot: "bg-emerald-400" },
  low: { label: "Mild issue", badge: "bg-lime-400/10 text-lime-300 ring-lime-400/30", dot: "bg-lime-400" },
  moderate: { label: "Needs attention", badge: "bg-amber-400/10 text-amber-300 ring-amber-400/30", dot: "bg-amber-400" },
  high: { label: "Urgent care", badge: "bg-red-400/10 text-red-300 ring-red-400/30", dot: "bg-red-400" },
};

interface ResultCardProps {
  result: PlantAnalysis;
  previewUrl: string | null;
  onReset: () => void;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function ResultCard({ result, previewUrl, onReset }: ResultCardProps) {
  const severity = severityStyles[result.severity] ?? severityStyles.moderate;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const quickQuestions = [
    "Should I cut off the damaged leaves?",
    "Can I use regular dish soap for spray?",
    "How often should I water this week?",
  ];

  async function handleSendQuestion(questionToSend?: string) {
    const q = (questionToSend || inputQuestion).trim();
    if (!q || isAsking) return;

    const newHistory: Message[] = [...messages, { role: "user", text: q }];
    setMessages(newHistory);
    setInputQuestion("");
    setIsAsking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          plantContext: result,
          chatHistory: newHistory,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "I had trouble checking that. Could you ask once more?" }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Network hiccup. Please try asking again." }]);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-forest-900 border-2 border-forest-700 shadow-2xl lg:grid lg:grid-cols-[2fr_3fr]">
      {/* Plant Photo */}
      <div className="relative aspect-[4/3] bg-forest-800 lg:aspect-auto lg:min-h-full">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={`Photo of your ${result.plant_name}`}
            className="absolute inset-0 size-full object-cover"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
        <header className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1 ${severity.badge}`}>
              <span className={`size-2 rounded-full ${severity.dot}`} />
              {severity.label}
            </span>
            {result.location_summary && (
              <span className="rounded-full bg-forest-800 px-3 py-1 text-xs font-semibold text-sage border border-forest-700">
                {result.location_summary.balcony} Balcony • {result.location_summary.floor} • {result.location_summary.city}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ivory sm:text-4xl">
            {result.plant_name}
          </h1>
        </header>

        {/* Diagnosis */}
        <section className="rounded-2xl bg-forest-800/60 p-4 border border-forest-700">
          <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400">Diagnosis</h2>
          <p className="mt-1.5 leading-relaxed text-ivory text-sm sm:text-base font-medium">{result.diagnosis}</p>
        </section>

        {/* Environmental Cause */}
        {result.environmental_insight && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-sage">Why this happened on your balcony</h2>
            <p className="mt-1 text-sm leading-relaxed text-ivory/90 font-medium">
              {result.environmental_insight}
            </p>
          </section>
        )}

        {/* One Action for Today */}
        <section className="rounded-2xl bg-forest-800 p-4 border-2 border-emerald-500/50 shadow-md">
          <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <span>⚡</span> Action for today
          </h2>
          <p className="mt-1.5 text-sm sm:text-base font-bold text-ivory leading-relaxed">{result.todays_action}</p>
        </section>

        {/* Remedy Steps */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-wider text-sage">Remedy steps</h2>
          <ol className="mt-2.5 flex flex-col gap-2">
            {result.remedy_steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed text-ivory">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-forest-700 text-xs font-black text-emerald-400">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Prevention Tip */}
        <section className="flex gap-3 border-t border-forest-800 pt-4">
          <LeafIcon className="mt-0.5 size-5 shrink-0 text-emerald-400" />
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-sage">Long-term tip</h2>
            <p className="mt-0.5 text-xs font-medium leading-relaxed text-ivory/90">{result.prevention_tip}</p>
          </div>
        </section>

        {/* Follow-up Questions Chat */}
        <section className="mt-2 rounded-2xl bg-forest-950/70 p-4 border-2 border-forest-700 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
              💬 Have questions about this diagnosis?
            </h3>
            <span className="text-[10px] text-sage font-semibold">Ask in everyday words</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuestion(q)}
                disabled={isAsking}
                className="rounded-full bg-forest-800/80 px-2.5 py-1 text-[11px] font-semibold text-ivory border border-forest-600 hover:border-emerald-400 active:scale-95 transition-all text-left"
              >
                + {q}
              </button>
            ))}
          </div>

          {messages.length > 0 && (
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 pt-2 border-t border-forest-800">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col text-xs leading-relaxed rounded-xl p-2.5 max-w-[90%] ${
                    m.role === "user"
                      ? "ml-auto bg-emerald-500 text-slate-950 font-bold"
                      : "mr-auto bg-forest-800 text-ivory border border-forest-700 font-medium"
                  }`}
                >
                  <span className="text-[9px] uppercase font-black opacity-75 mb-0.5">
                    {m.role === "user" ? "You" : "LeafLens"}
                  </span>
                  <span>{m.text}</span>
                </div>
              ))}
              {isAsking && (
                <div className="mr-auto text-xs text-sage italic animate-pulse">
                  LeafLens is typing...
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion();
            }}
            className="flex items-center gap-2 mt-1"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="e.g. Can I just spray haldi water?"
              className="flex-1 rounded-xl bg-forest-800 px-3 py-2 text-xs font-semibold text-ivory placeholder:text-sage border border-forest-600 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={isAsking || !inputQuestion.trim()}
              className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-black text-slate-950 transition hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        </section>

        {/* Scan Another Button */}
        <button
          type="button"
          onClick={onReset}
          className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-forest-800 px-8 font-bold text-ivory border-2 border-forest-700 transition hover:bg-forest-700 active:scale-[0.98] sm:w-fit"
        >
          Scan another plant
        </button>
      </div>
    </article>
  );
}