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


      {/* MODAL — used for reading past journal entries */}
      <div className="modal-overlay" id="modalOverlay">
        <div className="modal-card" id="modalCard"></div>
      </div>

    </>
  );
}