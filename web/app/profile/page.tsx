"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Flame,
  BookOpen,
  Award,
  Edit3,
  Save,
  ArrowLeft,
  Sparkles,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  bio: string;
  avatar_url: string;
}

interface JournalEntry {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  mood: string;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchProfileAndData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch User Info
        const userRes = await fetch("http://localhost:8000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setProfile(userData);
          setBioInput(userData.bio || "");
          setNameInput(userData.username || "");
        }

        // Fetch Journals
        const journalRes = await fetch("http://localhost:8000/api/journals/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (journalRes.ok) {
          const journalData = await journalRes.json();
          setJournals(journalData);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndData();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: bioInput,
          first_name: nameInput,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      setProfile(updated);
      setIsEditing(false);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update profile", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Compute RPG stats
  const totalEntries = journals.length;
  const currentLevel = Math.max(1, totalEntries + 1);
  const currentXp = totalEntries * 150;
  const nextLevelXp = Math.ceil((currentXp + 1) / 1000) * 1000 || 1000;
  const xpProgress = Math.min(100, Math.round(((currentXp % 1000) / 1000) * 100));

  // Determine user rank based on total entries
  const getRank = (count: number) => {
    if (count >= 20) return "MASTER PATHFINDER";
    if (count >= 10) return "WAYFARER";
    if (count >= 5) return "MEADOW EXPLORER";
    return "NOVICE NOCTURNE";
  };

  const getInitials = (name: string) => {
    if (!name) return "WA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-[#ede6d6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#e3a857] border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-[#a8a196]">Loading Wayfarer Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#ede6d6] px-4 py-8 md:py-12 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#1e1830] to-transparent opacity-50 pointer-events-none rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#a8a196] hover:text-[#e3a857] transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Level Map
          </Link>
          <div className="text-right">
            <span className="font-mono text-xs text-[#e3a857] tracking-widest uppercase block">
              Character Overview
            </span>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#e3a857]/10 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#9b87c4] to-[#5f5390] flex items-center justify-center text-[#0a0e17] font-serif font-bold text-2xl md:text-3xl shadow-lg shadow-[#9b87c4]/20 border border-white/20">
                  {getInitials(profile?.username || "")}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#e3a857] text-[#111827] font-mono font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md">
                  LV.{currentLevel}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#ede6d6]">
                    {profile?.username || "Wayfarer"}
                  </h1>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#e3a857]/15 border border-[#e3a857]/30 text-[#e3a857]">
                    {getRank(totalEntries)}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#a8a196] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#e3a857]" /> {profile?.email || "No email linked"}
                </p>
                <p className="text-xs text-[#a8a196] mt-2 italic max-w-md">
                  {profile?.bio || '"No bio written yet. Click edit to record your oath."'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#e3a857] hover:text-[#e3a857] transition-all self-start md:self-center"
            >
              <Edit3 className="w-4 h-4" /> {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-white/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#a8a196] mb-1.5 uppercase">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#0a0e17] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#ede6d6] focus:outline-none focus:border-[#e3a857]"
                    placeholder="Your character name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#a8a196] mb-1.5 uppercase">
                    Bio / Oath
                  </label>
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full bg-[#0a0e17] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#ede6d6] focus:outline-none focus:border-[#e3a857]"
                    placeholder="Short bio or oath"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e3a857] to-[#b9803c] text-[#111827] font-mono text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {message && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {message.text}
            </div>
          )}
        </div>

        {/* XP Progress Bar */}
        <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#e3a857] flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4" /> Experience Points
            </span>
            <span className="text-[#a8a196]">
              {currentXp} / {nextLevelXp} XP ({xpProgress}%)
            </span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#e3a857] via-[#f0c47f] to-[#e3a857] rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-1">
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-mono text-2xl font-bold text-[#ede6d6]">
              {journals.length > 0 ? "1🔥" : "0🔥"}
            </span>
            <span className="font-mono text-[10px] text-[#a8a196] uppercase tracking-wider">
              Day Streak
            </span>
          </div>

          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-mono text-2xl font-bold text-[#ede6d6]">{totalEntries}</span>
            <span className="font-mono text-[10px] text-[#a8a196] uppercase tracking-wider">
              Total Waypoints
            </span>
          </div>

          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-1">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-mono text-2xl font-bold text-[#ede6d6]">LV.{currentLevel}</span>
            <span className="font-mono text-[10px] text-[#a8a196] uppercase tracking-wider">
              Character Level
            </span>
          </div>

          <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-1">
              <User className="w-5 h-5" />
            </div>
            <span className="font-mono text-2xl font-bold text-[#ede6d6]">ACTIVE</span>
            <span className="font-mono text-[10px] text-[#a8a196] uppercase tracking-wider">
              Account Status
            </span>
          </div>
        </div>

        {/* Waypoint Journal History Timeline */}
        <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-serif font-bold text-[#ede6d6] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#e3a857]" /> Recorded Waypoints
            </h2>
            <Link
              href="/journal/new"
              className="text-xs font-mono text-[#e3a857] hover:underline"
            >
              + Create New Entry
            </Link>
          </div>

          {journals.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-white/10 rounded-xl space-y-2">
              <p className="text-sm font-mono text-[#a8a196]">No waypoints recorded yet.</p>
              <Link
                href="/journal/new"
                className="inline-block text-xs font-mono text-[#e3a857] hover:underline"
              >
                Write your first journal entry →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  onClick={() => router.push(`/journal/${journal.id}`)}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#e3a857]/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{journal.mood || "✨"}</span>
                      <h3 className="font-serif font-bold text-sm text-[#ede6d6] group-hover:text-[#e3a857] transition-colors">
                        {journal.title}
                      </h3>
                    </div>
                    <p className="text-xs text-[#a8a196] line-clamp-1">{journal.excerpt || journal.content}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-mono text-[#a8a196]">
                      {new Date(journal.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-mono text-[#e3a857] opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
