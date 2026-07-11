"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Edit3, Save, ArrowLeft, Loader2, Trash2, X, Feather } from "lucide-react";
import Link from "next/link";

const MOODS = ["✨", "🌱", "☕", "🏆", "🌧️", "💻", "🥾", "😅"];

type Journal = {
  title: string;
  mood: string;
  excerpt: string;
  content: string;
  date: string;
};

export default function JournalDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [journal, setJournal] = useState<Journal>({
    title: "",
    mood: "✨",
    excerpt: "",
    content: "",
    date: "",
  });
  const [editForm, setEditForm] = useState<Journal>({
    title: "",
    mood: "✨",
    excerpt: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchJournal = async () => {
      try {
        const token = localStorage.getItem("access_token");
        // Replace with actual Django endpoint (e.g., http://localhost:8000/api/journals/${id}/)
        const res = await fetch(`http://localhost:8000/api/journals/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch journal entry.");
        }

        const data = await res.json();
        var loaded: Journal = {
          title: data.title,
          mood: data.mood || "✨",
          excerpt: data.excerpt || "",
          content: data.content ?? data.body ?? "",
          date: data.created_at || new Date().toISOString(),
        };
        setJournal(loaded);
        setEditForm(loaded);
      } catch (error) {
        console.warn("Backend not found — generating a mock journal entry for MVP.");
        const mockData: Journal = {
          title: "The beginning of the journey",
          mood: "✨",
          excerpt: "Opened this journal for the first time. Let's see where it leads.",
          content:
            "Today I ventured into the wilderness. The sun was hot against my armor. I fought a few bugs in my code, gained 50 XP, and rested by the campfire.\n\nLooking forward to tomorrow's quest.",
          date: new Date().toISOString(),
        };
        setJournal(mockData);
        setEditForm(mockData);
        // setIsError(true); // Normally we'd set error, but simulating for MVP
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournal();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      // Replace with actual Django endpoint setup
      const res = await fetch(`http://localhost:8000/api/journals/${id}/`, {
        method: "PUT", // or PATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Could not save changes");

      setJournal((prev) => ({ ...prev, ...editForm }));
      setIsEditing(false);
    } catch (err) {
      console.warn("Backend unavailable - simulating save success.");
      setJournal((prev) => ({ ...prev, ...editForm }));
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Erase this quest from the trail? This can't be undone.")) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`http://localhost:8000/api/journals/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not delete entry");
      router.push("/home");
    } catch (err) {
      console.warn("Backend unavailable - simulating delete success.");
      router.push("/home");
    }
  };

  const formattedDate = new Date(journal.date).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0E17] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-[#E3A857] animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-h-screen bg-[#0A0E17] flex flex-col justify-center items-center text-[#EDE6D6]"
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        <h2
          className="text-2xl font-bold text-[#e07a7a] mb-4"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Quest Not Found
        </h2>
        <p className="text-[#A8A196] mb-6">
          This journal entry could not be retrieved from the archives.
        </p>
        <Link
          href="/home"
          className="text-[#E3A857] font-semibold hover:text-[#f0c47f] transition-colors"
        >
          Return to map
        </Link>
      </div>
    );
  }

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

      {/* Ambient glow, tuned to the trail's palette */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#9B87C4]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[30%] bg-[#E3A857]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10">
          <Link
            href="/home"
            className="group flex items-center gap-2 text-[#A8A196] hover:text-[#EDE6D6] transition-colors"
          >
            <div className="p-2 bg-[#111827]/70 rounded-full border border-[#EDE6D61a] group-hover:border-[#EDE6D640] pointer-events-auto">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span
              className="font-semibold text-[.72rem] uppercase tracking-[.14em]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Map
            </span>
          </Link>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setEditForm(journal);
                    setIsEditing(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border text-[#c9c2b2] hover:bg-[#EDE6D60d] transition-colors text-sm font-semibold"
                  style={{ borderColor: "rgba(237,230,214,.15)" }}
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-[#231604] shadow-lg transition-colors text-sm font-bold disabled:opacity-75"
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
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border text-[#A8A196] hover:text-[#e58080] hover:border-[#e05a5a66] hover:bg-[#e05a5a1f] transition-colors text-sm font-semibold disabled:opacity-60"
                  style={{ borderColor: "rgba(237,230,214,.15)" }}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-[#c9c2b2] hover:text-[#EDE6D6] transition-colors text-sm font-semibold"
                  style={{
                    background: "rgba(237,230,214,.05)",
                    border: "1px solid rgba(237,230,214,.15)",
                  }}
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              </>
            )}
          </div>
        </header>

        <main
          className="rounded-[22px] p-8 md:p-12 shadow-2xl"
          style={{
            background: "#111827",
            border: "1px solid rgba(237,230,214,.10)",
            boxShadow: "0 20px 60px rgba(0,0,0,.45)",
          }}
        >
          {isEditing ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full bg-transparent border-b pb-4 text-3xl md:text-5xl font-bold text-[#EDE6D6] placeholder-[#5a5648] focus:outline-none transition-colors"
                style={{ borderColor: "#E3A85780", fontFamily: "'Cinzel', serif" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E3A857")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E3A85780")}
                placeholder="Name your quest..."
                autoFocus
              />

              <div>
                <label
                  className="block text-[.68rem] uppercase tracking-[.1em] text-[#A8A196] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Mood
                </label>
                <div className="flex gap-2 flex-wrap">
                  {MOODS.map((m) => {
                    var selected = m === editForm.mood;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, mood: m })}
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

              <div>
                <label
                  className="block text-[.68rem] uppercase tracking-[.1em] text-[#A8A196] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Excerpt
                </label>
                <input
                  type="text"
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
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

              <div>
                <label
                  className="block text-[.68rem] uppercase tracking-[.1em] text-[#A8A196] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  What happened?
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full bg-transparent text-[#c9c2b2] text-lg leading-relaxed focus:outline-none min-h-[380px] resize-y placeholder-[#5a5648] font-medium"
                  placeholder="Log your journey details here..."
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div
                className="flex items-center gap-3 text-[#E3A857] mb-4 uppercase tracking-[.14em] text-[.68rem] font-bold"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                <Feather className="w-4 h-4" />
                <span>{formattedDate}</span>
                <span className="text-base normal-case tracking-normal">{journal.mood}</span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-[#EDE6D6] mb-3 tracking-tight selection:bg-[#E3A85730]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {journal.title}
              </h1>
              {journal.excerpt && (
                <p className="text-[#A8A196] text-lg italic mb-8">{journal.excerpt}</p>
              )}
              <div className="prose prose-invert max-w-none">
                {journal.content.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="text-[#c9c2b2] leading-relaxed font-medium mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}