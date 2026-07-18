"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAudio } from "./AudioContext";
import { Play, Pause } from "lucide-react";

export default function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDarkRealm, setIsDarkRealm] = useState(true);
  const [questReminders, setQuestReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { isPlaying, togglePlay } = useAudio();
  const settingsWrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsWrapRef.current && !settingsWrap.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAuthToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    // Real auth would happen here
  };

  // Skip rendering navbar if on a landing or auth page, optional. We will render it globally for now as requested.
  // Hide on landing page (has its own nav) and auth pages
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/journal')
  ) return null;

  return (
    <nav className="topnav" id="topnav" style={{ transform: "translateY(0)", opacity: 1 }}>
      <Link href="/home" className="brand">
        <div className="mark">
          <i className="fa-solid fa-compass"></i>
        </div>
        <div>
          <h1>Waypoint</h1>
          <span>YOUR STORY, MAPPED</span>
        </div>
      </Link>
      
      <div className="search-wrap">
        <div className={`search-pill ${searchExpanded ? "expanded" : ""}`} id="searchPill">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            id="searchInput"
            placeholder="Search your quests..."
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchExpanded(true)}
            onBlur={() => setSearchExpanded(false)}
            onKeyDown={handleSearch}
          />
          <span className="hint">↵</span>
        </div>
      </div>
      
      <div className="nav-right">
        <button
          className="icon-btn"
          title={isPlaying ? "Pause music" : "Play music"}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        {isLoggedIn ? (
          <>
            <div className="settings-wrap" ref={settingsWrapRef}>
              <button
                className="icon-btn"
                id="settingsBtn"
                aria-haspopup="true"
                aria-expanded={settingsOpen}
                title="Settings"
                onClick={(e) => {
                  e.stopPropagation();
                  setSettingsOpen(!settingsOpen);
                }}
              >
                <i className="fa-solid fa-gear"></i>
              </button>

              <div className={`settings-panel ${settingsOpen ? "open" : ""}`} id="settingsPanel">
                <h4>Preferences</h4>
                <div className="toggle-row">
                  <span>Dark realm</span>
                  <button
                    className={`switch ${isDarkRealm ? "on" : ""}`}
                    onClick={() => setIsDarkRealm(!isDarkRealm)}
                  />
                </div>
                <div className="toggle-row">
                  <span>Quest reminders</span>
                  <button
                    className={`switch ${questReminders ? "on" : ""}`}
                    onClick={() => setQuestReminders(!questReminders)}
                  />
                </div>
                <div className="toggle-row">
                  <span>Sound effects</span>
                  <button
                    className={`switch ${soundEffects ? "on" : ""}`}
                    onClick={() => setSoundEffects(!soundEffects)}
                  />
                </div>
              </div>
            </div>

            <div className="profile-wrap" id="profileWrap" tabIndex={0}>
              <button className="avatar-btn" aria-haspopup="true" title="Profile">
                <div className="avatar-glyph">WA</div>
              </button>
              <div className="profile-card" id="profileCard">
                <div className="profile-head">
                  <div className="avatar-lg">WA</div>
                  <div>
                    <h3 id="profileName">Wren Ashcombe</h3>
                    <p id="profileRank">LV.10 · WAYFARER</p>
                  </div>
                </div>
                <div className="xp-row">
                  <div className="xp-labels">
                    <span>XP</span>
                    <span>640 / 1000</span>
                  </div>
                  <div className="xp-bar">
                    <div className="xp-fill"></div>
                  </div>
                </div>
                <div className="stat-grid">
                  <div className="stat-box">
                    <div className="v">10🔥</div>
                    <div className="l">Day streak</div>
                  </div>
                  <div className="stat-box">
                    <div className="v">10</div>
                    <div className="l">Entries</div>
                  </div>
                </div>
                <button className="auth-btn signin" id="authBtn" onClick={handleAuthToggle}>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <Link href="/login" className="auth-btn" style={{ textDecoration: "none" }}>
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            <span>Log in</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
