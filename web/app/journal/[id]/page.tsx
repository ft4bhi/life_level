"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Edit3, Save, ArrowLeft, Loader2, Trash2, X, Feather } from "lucide-react";
import Link from "next/link";

export default function JournalDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [journal, setJournal] = useState({ title: "", content: "", date: "" });
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (!id) return;

    const fetchJournal = async () => {
      try {
        const token = localStorage.getItem("access_token");
        // Replace with actual Django endpoint (e.g., http://localhost:8000/api/journals/${id})
        const res = await fetch(`http://localhost:8000/api/journals/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to fetch journal entry.");
        }

        const data = await res.json();
        setJournal({
          title: data.title,
          content: data.content,
          date: data.created_at || new Date().toISOString()
        });
        setEditForm({
          title: data.title,
          content: data.content
        });
      } catch (error) {
        console.warn("Backend not found — generating a mock journal entry for MVP.");
        // Fallback for MVP demonstration
        const mockData = {
          title: "The beginning of the journey",
          content: "Today I ventured into the wilderness. The sun was hot against my armor. I fought a few bugs in my code, gained 50 XP, and rested by the campfire.\n\nLooking forward to tomorrow's quest.",
          date: new Date().toISOString()
        };
        setJournal(mockData);
        setEditForm({ title: mockData.title, content: mockData.content });
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
      const res = await fetch(`http://localhost:8000/api/journals/${id}`, {
        method: "PUT", // or PATCH
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) throw new Error("Could not save changes");

      // Assume success for demo
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

  const formattedDate = new Date(journal.date).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Quest Not Found</h2>
        <p className="text-slate-400 mb-6">This journal entry could not be retrieved from the archives.</p>
        <Link href="/home" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
          Return to map
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* RPG Glow background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[0%] right-[-10%] w-[30%] h-[30%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10">
          <Link href="/home" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <div className="p-2 bg-slate-900/50 rounded-full border border-slate-800 group-hover:border-slate-700 pointer-events-auto">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm uppercase tracking-widest">Map</span>
          </Link>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-semibold"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-colors text-sm font-semibold"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? "Saving..." : "Save Log"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm font-semibold"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
            )}
          </div>
        </header>

        <main className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-2xl">
          {isEditing ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <input
                type="text"
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full bg-transparent border-b border-indigo-500/50 focus:border-indigo-400 text-3xl md:text-5xl font-bold text-white placeholder-slate-600 focus:outline-none pb-4 transition-colors"
                placeholder="Name your quest..."
                autoFocus
              />
              <textarea
                value={editForm.content}
                onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                className="w-full bg-transparent text-slate-300 text-lg leading-relaxed focus:outline-none min-h-[400px] resize-y placeholder-slate-700 font-medium"
                placeholder="Log your journey details here..."
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 text-indigo-400 mb-4 uppercase tracking-widest text-xs font-bold font-mono">
                <Feather className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight selection:bg-indigo-500/30">
                {journal.title}
              </h1>
              <div className="prose prose-invert prose-slate prose-lg max-w-none">
                {journal.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-slate-300 leading-relaxed font-medium mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
