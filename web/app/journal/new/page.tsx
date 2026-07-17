"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const MOODS = ["✨", "🌱", "☕", "🏆", "🌧️", "💻", "🥾", "😅"];

export default function NewJournalPage() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    mood: "✨",
    excerpt: "",
    content: "",
  });

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/api/journals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, date: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch {
      // Backend not available yet — silently continue for MVP
      console.warn("Backend unavailable — simulating save.");
    } finally {
      setIsSaving(false);
      router.push("/home");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0A0E17] p-6 md:p-12 relative overflow-hidden"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#9B87C4]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[30%] bg-[#E3A857]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <Link
            href="/home"
            className="group flex items-center gap-2 text-[#A8A196] hover:text-[#EDE6D6] transition-colors"
          >
            <div className="p-2 bg-[#111827]/70 rounded-full border border-[#EDE6D61a] group-hover:border-[#EDE6D640]">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span
              className="font-semibold text-[.72rem] uppercase tracking-[.14em]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Map
            </span>
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving || !form.title.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[#231604] text-sm font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(150deg, #E3A857, #B9803C)",
              boxShadow: "0 10px 24px rgba(227,168,87,.3)",
            }}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Log"}
          </button>
        </header>

        {/* Form */}
        <main
          className="rounded-[22px] p-8 md:p-12 shadow-2xl space-y-8"
          style={{
            background: "#111827",
            border: "1px solid rgba(237,230,214,.10)",
            boxShadow: "0 20px 60px rgba(0,0,0,.45)",
          }}
        >
          {/* Title */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-transparent border-b pb-4 text-3xl md:text-5xl font-bold text-[#EDE6D6] placeholder-[#5a5648] focus:outline-none transition-colors"
            style={{ borderColor: "#E3A85780", fontFamily: "'Cinzel', serif" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#E3A857")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E3A85780")}
            placeholder="Name your quest..."
            autoFocus
          />

          {/* Mood */}
          <div>
            <label
              className="block text-[.68rem] uppercase tracking-[.1em] text-[#A8A196] mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Mood
            </label>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map((m) => {
                const selected = m === form.mood;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setForm({ ...form, mood: m })}
                    className="w-11 h-11 rounded-[10px] grid place-items-center text-lg transition-colors"
                    style={{
                      background: selected
                        ? "rgba(227,168,87,.16)"
                        : "rgba(237,230,214,.05)",
                      border: selected
                        ? "1px solid #E3A857"
                        : "1px solid rgba(237,230,214,.10)",
                    }}
                    aria-pressed={selected}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label
              className="block text-[.68rem] uppercase tracking-[.1em] text-[#A8A196] mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Excerpt
            </label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              maxLength={140}
              className="w-full rounded-xl px-4 py-3 text-[#EDE6D6] placeholder-[#5a5648] focus:outline-none transition-colors"
              style={{
                background: "rgba(237,230,214,.05)",
                border: "1px solid rgba(237,230,214,.10)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#E3A857")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(237,230,214,.10)")
              }
              placeholder="The one line that shows on the trail..."
            />
          </div>

          {/* Body */}
          <div>
            <label
              className="block text-[.68rem] uppercase tracking-[.1em] text-[#A8A196] mb-3"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              What happened?
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-transparent text-[#c9c2b2] text-lg leading-relaxed focus:outline-none min-h-[380px] resize-y placeholder-[#5a5648] font-medium"
              placeholder="Log your journey details here..."
            />
          </div>
        </main>
      </div>
    </div>
  );
}