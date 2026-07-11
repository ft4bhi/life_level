"use client";

import { useWaypointGsap } from "./useWaypointGsap";
import "./waypoint.css";

// npm install gsap
// This component ports the standalone HTML/CSS/JS "Waypoint" page into a
// single Next.js (app router) client component. All original markup,
// styling and behavior are preserved as closely as possible.

export default function WaypointPage() {
  useWaypointGsap();

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      {/* BACKGROUND */}
      <div className="bg-layers" aria-hidden="true">
        <div className="bg-layer" id="layer-meadow"></div>
        <div className="bg-layer" id="layer-woods"></div>
        <div className="bg-layer" id="layer-dunes"></div>
        <div className="bg-layer" id="layer-frost"></div>
        <div className="bg-layer" id="layer-hollow"></div>
      </div>
      <div className="zone-pill" id="zonePill">
        <span className="dot"></span>
        <span id="zoneText">Meadow Trailhead</span>
      </div>

      {/* NAV */}
      <nav className="topnav" id="topnav">
        <div className="brand">
          <div className="mark">
            <i className="fa-solid fa-compass"></i>
          </div>
          <div>
            <h1>Waypoint</h1>
            <span>YOUR STORY, MAPPED</span>
          </div>
        </div>
        <div className="search-wrap">
          <div className="search-pill" id="searchPill">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="searchInput" placeholder="Search your quests..." autoComplete="off" />
            <span className="hint">↵</span>
          </div>
        </div>
        <div className="nav-right">
          <div className="settings-wrap">
            <button className="icon-btn" id="settingsBtn" aria-haspopup="true" aria-expanded="false" title="Settings">
              <i className="fa-solid fa-gear"></i>
            </button>
            <div className="settings-panel" id="settingsPanel">
              <h4>Preferences</h4>
              <div className="toggle-row">
                <span>Dark realm</span>
                <button className="switch on" data-toggle></button>
              </div>
              <div className="toggle-row">
                <span>Quest reminders</span>
                <button className="switch on" data-toggle></button>
              </div>
              <div className="toggle-row">
                <span>Sound effects</span>
                <button className="switch" data-toggle></button>
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
              <button className="auth-btn signin" id="authBtn">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span id="authBtnText">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO / TOP OF TRAIL */}
      <div className="eyebrow-wrap" id="eyebrow">
        <p className="eyebrow">Chapter continues</p>
        <h2>Your Journey So Far</h2>
        <p>
          Ten waypoints behind you, one more just ahead. Follow the trail down through where you&apos;ve been —
          or step onto today&apos;s marker to keep going.
        </p>
      </div>

      {/* LEVEL MAP */}
      <main className="level-map" id="levelMap">
        <svg className="trail-svg" id="trailSvg">
          <defs>
            <linearGradient id="trailGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E3A857" />
              <stop offset="25%" stopColor="#6FA98A" />
              <stop offset="50%" stopColor="#C97B5A" />
              <stop offset="75%" stopColor="#8FB6C9" />
              <stop offset="100%" stopColor="#9B87C4" />
            </linearGradient>
          </defs>
          <path className="trail-path-bg" id="trailBg"></path>
          <path className="trail-path-fg" id="trailFg"></path>
        </svg>
        <div className="wayfinder" id="wayfinder">
          <i className="fa-solid fa-compass"></i>
        </div>
        <div className="nodes" id="nodesContainer"></div>
        <div className="origin-marker" id="originMarker">
          <i className="fa-solid fa-star"></i>
          <p>The journey begins</p>
        </div>
      </main>

      {/* FAB */}
      <div className="fab-wrap">
        <span className="fab-label">Record a quest</span>
        <button className="fab" id="fabBtn" title="New journal entry" aria-label="Record a new quest">
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {/* MODAL */}
      <div className="modal-overlay" id="modalOverlay">
        <div className="modal-card" id="modalCard"></div>
      </div>
      <div className="toast" id="toast">
        <i className="fa-solid fa-circle-check"></i>
        <span id="toastText">Saved</span>
      </div>

    </>
  );
}