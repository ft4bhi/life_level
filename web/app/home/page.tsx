"use client";

import { useEffect, useRef } from "react";

// npm install gsap
// This component ports the standalone HTML/CSS/JS "Waypoint" page into a
// single Next.js (app router) client component. All original markup,
// styling and behavior are preserved as closely as possible.

export default function WaypointPage() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let cleanupFns: Array<() => void> = [];

    (async () => {
      const gsapModule = await import("gsap");
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.gsap ?? gsapModule.default;
      const ScrollTrigger =
        ScrollTriggerModule.ScrollTrigger ?? ScrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);

      (function () {
        "use strict";
        var reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        /* ============= DATA ============= */
        var ZONES = [
          { key: "meadow", label: "Meadow Trailhead", icon: "🌱", tint: "111,169,138", center: 0.06 },
          { key: "woods", label: "Whispering Woods", icon: "🌲", tint: "111,169,138", center: 0.28 },
          { key: "dunes", label: "Amber Dunes", icon: "🏜️", tint: "201,123,90", center: 0.5 },
          { key: "frost", label: "Frostpeak Ridge", icon: "❄️", tint: "143,182,201", center: 0.72 },
          { key: "hollow", label: "The Starfall Hollow", icon: "✨", tint: "155,135,196", center: 0.94 },
        ];
        var NODES: any[] = [
          { today: true, x: 50, zone: "meadow", mood: "+", title: "Today", date: "Not written yet", excerpt: "Your next waypoint is waiting." },
          { x: 28, zone: "meadow", mood: "🥾", title: "The Long Hike", date: "Jul 10, 2026", excerpt: "My legs ache, but the view from the ridge made every step worth it.", body: "My legs ache, but the view from the ridge made every step worth it. We started before sunrise and the trail was quiet except for our boots on gravel. Somewhere around the third mile I stopped thinking about the climb and just started noticing things — moss on the north side of the rocks, the way the wind changed above the treeline. Worth every ache." },
          { x: 70, zone: "meadow", mood: "☕", title: "Coffee with an Old Friend", date: "Jul 8, 2026", excerpt: "Three hours passed like ten minutes — some conversations don't age.", body: "Three hours passed like ten minutes — some conversations don't age. We picked up exactly where we left off two years ago, like no time had passed at all. Funny how the best friendships work that way. Left the café with my coffee cold and untouched, and I didn't mind at all." },
          { x: 24, zone: "woods", mood: "💻", title: "Deadline Crunch", date: "Jul 6, 2026", excerpt: "Shipped it at 11:58pm. Tired, but proud of what we built.", body: "Shipped it at 11:58pm. Tired, but proud of what we built. The last two hours were pure adrenaline — three of us on a call, fixing things in real time. When the deploy finally went green, nobody said anything for a second. Then everyone just started laughing." },
          { x: 68, zone: "woods", mood: "🎆", title: "Fireworks & Reflection", date: "Jul 4, 2026", excerpt: "Watched the sky light up and thought about how far this year has taken me.", body: "Watched the sky light up and thought about how far this year has taken me. Sat on the roof with a blanket and let my mind wander through the last six months — the moves, the mistakes, the small wins nobody saw. Grateful, mostly." },
          { x: 30, zone: "dunes", mood: "🌱", title: "New Month, New Habit", date: "Jul 1, 2026", excerpt: "Day one of morning runs. Ask me again in thirty days.", body: "Day one of morning runs. Ask me again in thirty days. Woke up before the alarm out of pure nervous energy. Only made it two miles but my knees are already filing a complaint. Small start, but a start." },
          { x: 72, zone: "dunes", mood: "🌧️", title: "Rainy Day Thoughts", date: "Jun 27, 2026", excerpt: "Stayed in, made soup, let my mind wander somewhere quiet.", body: "Stayed in, made soup, let my mind wander somewhere quiet. There is a particular kind of peace in a rainy afternoon with nowhere to be. Read half a book. Answered no emails. Ten out of ten, would rain again." },
          { x: 26, zone: "frost", mood: "🏆", title: "A Small Victory", date: "Jun 22, 2026", excerpt: "Finally fixed the bug that haunted me all week. Small wins count.", body: "Finally fixed the bug that haunted me all week. Small wins count. It was a single misplaced condition, of course it was. Felt the specific joy of a problem clicking into place after days of nothing." },
          { x: 66, zone: "frost", mood: "🏠", title: "Missing Home", date: "Jun 15, 2026", excerpt: "Called Mom for two hours. Some distances only a voice can close.", body: "Called Mom for two hours. Some distances only a voice can close. We talked about nothing in particular — the garden, the neighbors, a recipe I keep meaning to try. Hung up lighter than I felt all week." },
          { x: 32, zone: "hollow", mood: "😅", title: "First Week Nerves", date: "Jun 8, 2026", excerpt: "New city, new job, new everything. Trying to breathe through the unknown.", body: "New city, new job, new everything. Trying to breathe through the unknown. Got lost twice on the way to a meeting I was already nervous about. Nobody seemed to notice. Maybe that is the secret — nobody is watching as closely as you think." },
          { x: 50, zone: "hollow", mood: "✨", title: "Where It All Began", date: "Jun 1, 2026", excerpt: "Opened this journal for the first time. Let's see where it leads.", body: "Opened this journal for the first time. Let's see where it leads. No real plan, just a page and an urge to remember things properly for once. Here's to whoever I am by the time this trail runs out." },
        ];

        /* ============= LAYOUT CONSTANTS ============= */
        function spacing() {
          return window.innerWidth < 640 ? 320 : window.innerWidth < 1000 ? 380 : 460;
        }
        var TOP_PAD = 110,
          BOTTOM_PAD = 160;
        var nodesContainer = document.getElementById("nodesContainer")!;
        var levelMap = document.getElementById("levelMap")!;
        var trailBg = document.getElementById("trailBg")!;
        var trailFg = document.getElementById("trailFg") as unknown as SVGPathElement;
        var wayfinder = document.getElementById("wayfinder")!;
        var originMarker = document.getElementById("originMarker")!;
        var points: { x: number; y: number }[] = [];

        function buildLayout() {
          var SPACING = spacing();
          var totalHeight = TOP_PAD + (NODES.length - 1) * SPACING + BOTTOM_PAD;
          levelMap.style.minHeight = totalHeight + "px";
          points = NODES.map(function (n, i) {
            return { x: n.x, y: TOP_PAD + i * SPACING };
          });
          nodesContainer.innerHTML = NODES.map(function (n, i) {
            var p = points[i];
            var alignClass = n.x < 40 ? "align-r" : n.x > 60 ? "align-l" : "";
            if (n.today) {
              return (
                '<div class="level-node" data-idx="' + i + '" style="left:' + p.x + "%; top:" + p.y + 'px;">' +
                '<button class="node-hit" data-open="today">' +
                '<div class="node-badge today"><span>+</span></div>' +
                '<div class="today-tag">Write today\'s entry</div>' +
                "</button></div>"
              );
            }
            return (
              '<div class="level-node ' + alignClass + '" data-idx="' + i + '" style="left:' + p.x + "%; top:" + p.y + 'px;">' +
              '<button class="node-hit" data-open="' + i + '">' +
              '<div class="node-badge zone-' + n.zone + '"><span>' + n.mood + '</span><span class="lvl-num">LV ' + (NODES.length - i) + "</span></div>" +
              '<div class="node-title">' + n.title + "</div>" +
              '<div class="node-date">' + n.date + "</div>" +
              '<div class="node-excerpt">' + n.excerpt + "</div>" +
              "</button></div>"
            );
          }).join("");
          originMarker.style.top = points[points.length - 1].y + 90 + "px";
          var d = catmullRomPath(points);
          trailBg.setAttribute("d", d);
          trailFg.setAttribute("d", d);
          var svg = document.getElementById("trailSvg")!;
          svg.setAttribute("viewBox", "0 0 100 " + totalHeight);
          svg.setAttribute("preserveAspectRatio", "none");
          (svg as unknown as HTMLElement).style.height = totalHeight + "px";
          return totalHeight;
        }

        function catmullRomPath(pts: { x: number; y: number }[]) {
          var full = [{ x: pts[0].x, y: Math.max(0, pts[0].y - 70) }]
            .concat(pts)
            .concat([{ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y + 70 }]);
          var d = "M " + full[0].x + " " + full[0].y + " ";
          for (var i = 0; i < full.length - 1; i++) {
            var p0 = full[i - 1] || full[i];
            var p1 = full[i];
            var p2 = full[i + 1];
            var p3 = full[i + 2] || p2;
            var c1x = p1.x + (p2.x - p0.x) / 6;
            var c1y = p1.y + (p2.y - p0.y) / 6;
            var c2x = p2.x - (p3.x - p1.x) / 6;
            var c2y = p2.y - (p3.y - p1.y) / 6;
            d += "C " + c1x + " " + c1y + ", " + c2x + " " + c2y + ", " + p2.x + " " + p2.y + " ";
          }
          return d;
        }

        var totalHeight = buildLayout();

        /* ============= SCROLL-LINKED ANIMATION ============= */
        var layers: Record<string, HTMLElement> = {
          meadow: document.getElementById("layer-meadow")!,
          woods: document.getElementById("layer-woods")!,
          dunes: document.getElementById("layer-dunes")!,
          frost: document.getElementById("layer-frost")!,
          hollow: document.getElementById("layer-hollow")!,
        };
        var zonePill = document.getElementById("zonePill")!;
        var zoneText = document.getElementById("zoneText")!;
        var pathLen = trailFg.getTotalLength();
        (trailFg.style as any).strokeDasharray = pathLen;
        (trailFg.style as any).strokeDashoffset = pathLen;

        function clamp01(v: number) {
          return Math.max(0, Math.min(1, v));
        }

        function onScrollProgress(progress: number) {
          (trailFg.style as any).strokeDashoffset = pathLen * (1 - progress);
          var pt = trailFg.getPointAtLength(pathLen * progress);
          (wayfinder.style as any).left = pt.x + "%";
          (wayfinder.style as any).top = pt.y + "px";
          var bestZone: any = null,
            bestOpacity = -1;
          ZONES.forEach(function (z) {
            var dist = Math.abs(progress - z.center);
            var op = clamp01(1 - dist / 0.26);
            layers[z.key].style.opacity = String(op);
            if (op > bestOpacity) {
              bestOpacity = op;
              bestZone = z;
            }
          });
          if (bestZone) {
            zoneText.textContent = bestZone.icon + "  " + bestZone.label;
          }
          zonePill.classList.toggle("show", progress > 0.02 && progress < 0.985);
        }

        var mainTrigger = ScrollTrigger.create({
          trigger: levelMap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: function (self: any) {
            onScrollProgress(self.progress);
          },
        });
        onScrollProgress(0);

        var nodeTriggers: any[] = [];
        document.querySelectorAll(".level-node").forEach(function (el) {
          nodeTriggers.push(
            ScrollTrigger.create({
              trigger: el,
              start: "top 88%",
              onEnter: function () {
                el.classList.add("is-visible");
              },
              onLeaveBack: function () {
                el.classList.remove("is-visible");
              },
            })
          );
        });
        var originTrigger = ScrollTrigger.create({
          trigger: originMarker,
          start: "top 90%",
          onEnter: function () {
            originMarker.classList.add("is-visible");
          },
          onLeaveBack: function () {
            originMarker.classList.remove("is-visible");
          },
        });

        /* ============= PARTICLES ============= */
        var particleColors: Record<string, string> = {
          meadow: "111,169,138",
          woods: "143,201,164",
          dunes: "227,168,87",
          frost: "143,182,201",
          hollow: "155,135,196",
        };
        if (!reduceMotion) {
          Object.keys(layers).forEach(function (key) {
            var layer = layers[key];
            var count = 16;
            for (var i = 0; i < count; i++) {
              var p = document.createElement("div");
              p.className = "particle";
              var size = 2 + Math.random() * 3;
              p.style.width = size + "px";
              p.style.height = size + "px";
              p.style.left = Math.random() * 100 + "%";
              p.style.top = 20 + Math.random() * 70 + "%";
              p.style.background = "rgb(" + particleColors[key] + ")";
              p.style.boxShadow = "0 0 6px rgba(" + particleColors[key] + ",.8)";
              p.style.setProperty("--dx", Math.random() * 40 - 20 + "px");
              p.style.animationDelay = Math.random() * 9 + "s";
              p.style.animationDuration = 7 + Math.random() * 5 + "s";
              layer.appendChild(p);
            }
          });
        }

        /* ============= PAGE LOAD INTRO ============= */
        if (!reduceMotion) {
          var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to("#topnav", { y: 0, opacity: 1, duration: 0.7 })
            .to("#eyebrow", { opacity: 1, duration: 0.8 }, "-=.35")
            .fromTo(".fab", { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2)" }, "-=.4");
        } else {
          gsap.set(["#topnav", "#eyebrow"], { opacity: 1, y: 0 });
          gsap.set(".fab", { scale: 1 });
        }

        /* ============= NAV INTERACTIONS ============= */
        var settingsBtn = document.getElementById("settingsBtn")!;
        var settingsPanel = document.getElementById("settingsPanel")!;
        function onSettingsBtnClick(e: MouseEvent) {
          e.stopPropagation();
          var open = settingsPanel.classList.toggle("open");
          settingsBtn.setAttribute("aria-expanded", String(open));
        }
        settingsBtn.addEventListener("click", onSettingsBtnClick);
        var toggleBtns = Array.from(settingsPanel.querySelectorAll<HTMLButtonElement>("[data-toggle]"));
        function onToggleClick(this: HTMLButtonElement) {
          this.classList.toggle("on");
        }
        toggleBtns.forEach(function (sw) {
          sw.addEventListener("click", onToggleClick);
        });
        function onDocClick(e: MouseEvent) {
          if (!settingsPanel.contains(e.target as Node) && e.target !== settingsBtn) {
            settingsPanel.classList.remove("open");
            settingsBtn.setAttribute("aria-expanded", "false");
          }
        }
        document.addEventListener("click", onDocClick);

        var isLoggedIn = true;
        var authBtn = document.getElementById("authBtn")!;
        var authBtnText = document.getElementById("authBtnText")!;
        function onAuthClick() {
          isLoggedIn = !isLoggedIn;
          if (isLoggedIn) {
            authBtnText.textContent = "Log out";
            authBtn.classList.add("signin");
            showToast("Welcome back, Wren.", "fa-circle-check");
          } else {
            authBtnText.textContent = "Sign in";
            authBtn.classList.remove("signin");
            showToast("Signed out. See you soon.", "fa-moon");
          }
        }
        authBtn.addEventListener("click", onAuthClick);

        /* ============= SEARCH ============= */
        var searchInput = document.getElementById("searchInput") as HTMLInputElement;
        var searchPill = document.getElementById("searchPill")!;
        function onSearchFocus() {
          searchPill.classList.add("expanded");
        }
        function onSearchBlur() {
          searchPill.classList.remove("expanded");
        }
        function onSearchKeydown(e: KeyboardEvent) {
          if (e.key !== "Enter") return;
          var q = searchInput.value.trim().toLowerCase();
          if (!q) return;
          var idx = NODES.findIndex(function (n) {
            return (
              !n.today &&
              ((n.title && n.title.toLowerCase().indexOf(q) !== -1) ||
                (n.excerpt && n.excerpt.toLowerCase().indexOf(q) !== -1))
            );
          });
          if (idx === -1) {
            showToast('No quests found for "' + searchInput.value + '"', "fa-circle-xmark");
            return;
          }
          var el = nodesContainer.querySelector('.level-node[data-idx="' + idx + '"]') as HTMLElement;
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("search-hit");
          var badge = el.querySelector(".node-badge") as HTMLElement;
          badge.style.boxShadow = "0 0 0 6px rgba(227,168,87,.35)";
          setTimeout(function () {
            badge.style.boxShadow = "";
          }, 1600);
        }
        searchInput.addEventListener("focus", onSearchFocus);
        searchInput.addEventListener("blur", onSearchBlur);
        searchInput.addEventListener("keydown", onSearchKeydown);

        /* ============= MODAL ============= */
        var overlay = document.getElementById("modalOverlay")!;
        var modalCard = document.getElementById("modalCard")!;
        var selectedMood = "✨";

        function openReadModal(idx: number) {
          var n = NODES[idx];
          modalCard.innerHTML =
            '<div class="modal-top">' +
            "<div><h3>" + n.title + '</h3><div class="modal-meta">' + n.date + "  ·  " + n.mood + "</div></div>" +
            '<button class="modal-close" id="closeModal"><i class="fa-solid fa-xmark"></i></button>' +
            "</div>" +
            '<p class="modal-body-text">' + n.body + "</p>";
          openOverlay();
        }

        function openCreateModal() {
          selectedMood = "✨";
          var moods = ["✨", "🌱", "☕", "🏆", "🌧️", "💻", "🥾", "😅"];
          modalCard.innerHTML =
            '<div class="modal-top">' +
            '<div><h3>Record a Quest</h3><div class="modal-meta">Today · New entry</div></div>' +
            '<button class="modal-close" id="closeModal"><i class="fa-solid fa-xmark"></i></button>' +
            "</div>" +
            '<div class="field"><label>Title</label><input type="text" id="entryTitle" placeholder="Give today a name..." /></div>' +
            '<div class="field"><label>excerpt</label><input type="text" id="entryExcerpt" placeholder="Give a highlight of today..." /></div>'
            +
            '<div class="field"><label>Mood</label><div class="mood-row" id="moodRow">' +
            moods
              .map(function (m) {
                return '<button type="button" class="mood-opt' + (m === selectedMood ? " selected" : "") + '" data-mood="' + m + '">' + m + "</button>";
              })
              .join("") +
            "</div></div>" +
            "<div class=\"field\"><label>What happened?</label><textarea id=\"entryBody\" rows=\"4\" placeholder=\"Write it while it's fresh...\"></textarea></div>" +
            '<button class="save-btn" id="saveEntry"><i class="fa-solid fa-feather"></i> Save entry</button>';
          openOverlay();
          modalCard.querySelectorAll<HTMLButtonElement>(".mood-opt").forEach(function (btn) {
            btn.addEventListener("click", function () {
              modalCard.querySelectorAll(".mood-opt").forEach(function (b) {
                b.classList.remove("selected");
              });
              btn.classList.add("selected");
              selectedMood = btn.dataset.mood || selectedMood;
            });
          });
          document.getElementById("saveEntry")!.addEventListener("click", function () {
            closeOverlay();
            showToast("Quest recorded. Level up!", "fa-circle-check");
          });
        }

        function openOverlay() {
          overlay.classList.add("open");
          document.getElementById("closeModal")!.addEventListener("click", closeOverlay);
          document.body.style.overflow = "hidden";
        }
        function closeOverlay() {
          overlay.classList.remove("open");
          document.body.style.overflow = "";
        }
        function onOverlayClick(e: MouseEvent) {
          if (e.target === overlay) closeOverlay();
        }
        function onDocKeydown(e: KeyboardEvent) {
          if (e.key === "Escape") closeOverlay();
        }
        overlay.addEventListener("click", onOverlayClick);
        document.addEventListener("keydown", onDocKeydown);

        function onNodesContainerClick(e: MouseEvent) {
          var btn = (e.target as HTMLElement).closest("[data-open]");
          if (!btn) return;
          var val = btn.getAttribute("data-open")!;
          if (val === "today") openCreateModal();
          else openReadModal(parseInt(val, 10));
        }
        nodesContainer.addEventListener("click", onNodesContainerClick);

        var fabBtn = document.getElementById("fabBtn")!;
        fabBtn.addEventListener("click", openCreateModal);

        /* ============= TOAST ============= */
        var toast = document.getElementById("toast")!;
        var toastText = document.getElementById("toastText")!;
        var toastIcon = toast.querySelector("i")!;
        var toastTimer: any;
        function showToast(msg: string, icon?: string) {
          clearTimeout(toastTimer);
          toastText.textContent = msg;
          toastIcon.className = "fa-solid " + (icon || "fa-circle-check");
          toast.classList.add("show");
          toastTimer = setTimeout(function () {
            toast.classList.remove("show");
          }, 2600);
        }

        /* ============= RESIZE ============= */
        var resizeTimer: any;
        function onResize() {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            buildLayout();
            pathLen = trailFg.getTotalLength();
            (trailFg.style as any).strokeDasharray = pathLen;
            ScrollTrigger.refresh();
          }, 200);
        }
        window.addEventListener("resize", onResize);

        cleanupFns.push(function () {
          settingsBtn.removeEventListener("click", onSettingsBtnClick);
          toggleBtns.forEach(function (sw) {
            sw.removeEventListener("click", onToggleClick);
          });
          document.removeEventListener("click", onDocClick);
          authBtn.removeEventListener("click", onAuthClick);
          searchInput.removeEventListener("focus", onSearchFocus);
          searchInput.removeEventListener("blur", onSearchBlur);
          searchInput.removeEventListener("keydown", onSearchKeydown);
          overlay.removeEventListener("click", onOverlayClick);
          document.removeEventListener("keydown", onDocKeydown);
          nodesContainer.removeEventListener("click", onNodesContainerClick);
          fabBtn.removeEventListener("click", openCreateModal);
          window.removeEventListener("resize", onResize);
          mainTrigger.kill();
          originTrigger.kill();
          nodeTriggers.forEach(function (t) {
            t.kill();
          });
        });
      })();
    })();

    return () => {
      cleanupFns.forEach((fn) => fn());
      cleanupFns = [];
    };
  }, []);

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

      <style jsx global>{`
        :root {
          --void: #0a0e17;
          --void-2: #111827;
          --void-3: #161f30;
          --parchment: #ede6d6;
          --parchment-dim: #a8a196;
          --ember: #e3a857;
          --ember-soft: rgba(227, 168, 87, 0.16);
          --moss: #6fa98a;
          --dusk: #7086c0;
          --rune: #9b87c4;
          --clay: #c97b5a;
          --frost: #8fb6c9;
          --line: rgba(237, 230, 214, 0.1);
          --shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
          --radius: 20px;
        }
        * {
          box-sizing: border-box;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          margin: 0;
          background: var(--void);
          color: var(--parchment);
          font-family: "Manrope", sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }
        .mono {
          font-family: "JetBrains Mono", monospace;
        }
        .display {
          font-family: "Cinzel", serif;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        button {
          font-family: inherit;
          cursor: pointer;
        }
        ::selection {
          background: var(--ember-soft);
          color: var(--ember);
        }
        button:focus-visible,
        input:focus-visible,
        [tabindex]:focus-visible {
          outline: 2px solid var(--ember);
          outline-offset: 3px;
          border-radius: 8px;
        }
        .bg-layers {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .bg-layer {
          position: absolute;
          inset: -2% -2%;
          opacity: 0;
          transition: opacity 0.1s linear;
          will-change: opacity;
        }
        .bg-layer::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 70% 55% at 50% 30%,
            transparent 0%,
            rgba(10, 14, 23, 0.55) 75%,
            rgba(10, 14, 23, 0.92) 100%
          );
        }
        #layer-meadow {
          background: radial-gradient(circle at 30% 20%, #1c3326 0%, transparent 55%),
            linear-gradient(180deg, #0e1a15 0%, #0a0e17 70%);
        }
        #layer-woods {
          background: radial-gradient(circle at 70% 30%, #16332f 0%, transparent 55%),
            linear-gradient(180deg, #0a1c1c 0%, #0a0e17 70%);
        }
        #layer-dunes {
          background: radial-gradient(circle at 40% 25%, #3a2a1a 0%, transparent 55%),
            linear-gradient(180deg, #241a12 0%, #0a0e17 70%);
        }
        #layer-frost {
          background: radial-gradient(circle at 60% 20%, #17293a 0%, transparent 55%),
            linear-gradient(180deg, #0d1c28 0%, #0a0e17 70%);
        }
        #layer-hollow {
          background: radial-gradient(circle at 50% 15%, #241b3a 0%, transparent 60%),
            linear-gradient(180deg, #140f24 0%, #0a0e17 70%);
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          animation: drift 9s ease-in-out infinite;
        }
        @keyframes drift {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6);
          }
          15% {
            opacity: 0.9;
          }
          50% {
            transform: translate(var(--dx, 10px), -60px) scale(1);
          }
          85% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--dx, 10px) * 1.6), -130px) scale(0.5);
          }
        }
        .topnav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 16px 26px;
          background: linear-gradient(180deg, rgba(10, 14, 23, 0.88) 0%, rgba(10, 14, 23, 0.55) 80%, transparent 100%);
          backdrop-filter: blur(10px);
          transform: translateY(-100%);
          opacity: 0;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
        }
        .brand .mark {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, var(--ember), #b9803c);
          color: #1a1206;
          font-size: 16px;
          box-shadow: 0 6px 18px rgba(227, 168, 87, 0.35);
        }
        .brand h1 {
          font-size: 1.25rem;
          margin: 0;
          letter-spacing: 0.03em;
          font-weight: 600;
          color: var(--parchment);
        }
        .brand span {
          display: block;
          font-size: 0.68rem;
          color: var(--parchment-dim);
          font-family: "JetBrains Mono", monospace;
          letter-spacing: 0.08em;
          margin-top: 1px;
        }
        .search-wrap {
          flex: 1 1 auto;
          display: flex;
          justify-content: center;
        }
        .search-pill {
          position: relative;
          width: min(360px, 100%);
          transition: width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .search-pill.expanded {
          width: min(480px, 100%);
        }
        .search-pill input {
          width: 100%;
          background: rgba(237, 230, 214, 0.06);
          border: 1px solid var(--line);
          color: var(--parchment);
          border-radius: 999px;
          padding: 10px 16px 10px 40px;
          font-size: 0.88rem;
          font-family: "Manrope", sans-serif;
          transition: border-color 0.2s, background 0.2s;
        }
        .search-pill input::placeholder {
          color: var(--parchment-dim);
        }
        .search-pill input:focus {
          outline: none;
          border-color: var(--ember);
          background: rgba(237, 230, 214, 0.09);
        }
        .search-pill i.fa-magnifying-glass {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--parchment-dim);
          font-size: 0.82rem;
        }
        .search-pill .hint {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.65rem;
          color: var(--parchment-dim);
          font-family: "JetBrains Mono", monospace;
          border: 1px solid var(--line);
          padding: 1px 6px;
          border-radius: 5px;
          opacity: 0.7;
          pointer-events: none;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
        }
        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(237, 230, 214, 0.06);
          border: 1px solid var(--line);
          color: var(--parchment-dim);
          font-size: 0.95rem;
          transition: all 0.2s ease;
          position: relative;
        }
        .icon-btn:hover {
          color: var(--parchment);
          border-color: rgba(237, 230, 214, 0.25);
          background: rgba(237, 230, 214, 0.1);
          transform: translateY(-1px);
        }
        .settings-wrap {
          position: relative;
        }
        .settings-panel {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 220px;
          background: var(--void-2);
          border: 1px solid var(--line);
          border-radius: 16px;
          box-shadow: var(--shadow);
          padding: 14px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px) scale(0.97);
          transform-origin: top right;
          transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
          z-index: 70;
        }
        .settings-panel.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .settings-panel h4 {
          margin: 2px 0 10px;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--parchment-dim);
          font-weight: 600;
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 2px;
        }
        .toggle-row span {
          font-size: 0.84rem;
          color: var(--parchment);
        }
        .switch {
          width: 34px;
          height: 19px;
          border-radius: 99px;
          background: rgba(237, 230, 214, 0.15);
          position: relative;
          border: none;
          flex: 0 0 auto;
        }
        .switch::after {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--parchment-dim);
          top: 2.5px;
          left: 2.5px;
          transition: all 0.2s ease;
        }
        .switch.on {
          background: var(--ember-soft);
        }
        .switch.on::after {
          left: 17px;
          background: var(--ember);
        }
        .profile-wrap {
          position: relative;
        }
        .avatar-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid var(--line);
          background: linear-gradient(145deg, #3a3350, #241f36);
          display: grid;
          place-items: center;
          overflow: hidden;
        }
        .avatar-btn .avatar-glyph {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          background: linear-gradient(150deg, var(--rune), #5f5390);
          color: #fff;
          font-family: "Cinzel", serif;
          font-weight: 600;
          font-size: 0.78rem;
        }
        .profile-card {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 280px;
          background: var(--void-2);
          border: 1px solid var(--line);
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 20px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px) scale(0.97);
          transform-origin: top right;
          transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
          z-index: 70;
        }
        .profile-wrap:hover .profile-card,
        .profile-wrap:focus-within .profile-card,
        .profile-card.force-open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .profile-card:hover {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .profile-head {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .profile-head .avatar-lg {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: linear-gradient(150deg, var(--rune), #5f5390);
          display: grid;
          place-items: center;
          color: #fff;
          font-family: "Cinzel", serif;
          font-weight: 600;
          box-shadow: 0 6px 16px rgba(155, 135, 196, 0.35);
        }
        .profile-head h3 {
          margin: 0;
          font-size: 1rem;
          color: var(--parchment);
        }
        .profile-head p {
          margin: 2px 0 0;
          font-size: 0.75rem;
          color: var(--ember);
          font-family: "JetBrains Mono", monospace;
        }
        .xp-row {
          margin-top: 14px;
        }
        .xp-row .xp-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.66rem;
          color: var(--parchment-dim);
          font-family: "JetBrains Mono", monospace;
          margin-bottom: 5px;
        }
        .xp-bar {
          height: 6px;
          border-radius: 99px;
          background: rgba(237, 230, 214, 0.1);
          overflow: hidden;
        }
        .xp-fill {
          height: 100%;
          width: 64%;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--ember), #f0c47f);
        }
        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 16px 0;
        }
        .stat-box {
          background: rgba(237, 230, 214, 0.05);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 9px 11px;
        }
        .stat-box .v {
          font-family: "JetBrains Mono", monospace;
          font-size: 1.05rem;
          color: var(--parchment);
          font-weight: 600;
        }
        .stat-box .l {
          font-size: 0.63rem;
          color: var(--parchment-dim);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }
        .auth-btn {
          width: 100%;
          padding: 10px;
          border-radius: 11px;
          border: 1px solid var(--line);
          background: rgba(237, 230, 214, 0.05);
          color: var(--parchment);
          font-size: 0.83rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .auth-btn:hover {
          background: rgba(224, 90, 90, 0.12);
          border-color: rgba(224, 90, 90, 0.4);
          color: #e58080;
        }
        .auth-btn.signin:hover {
          background: var(--ember-soft);
          border-color: var(--ember);
          color: var(--ember);
        }
        .eyebrow-wrap {
          position: relative;
          z-index: 5;
          padding: 150px 26px 40px;
          text-align: center;
          opacity: 0;
        }
        .eyebrow-wrap .eyebrow {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ember);
          margin: 0 0 10px;
        }
        .eyebrow-wrap h2 {
          font-family: "Cinzel", serif;
          font-size: clamp(1.6rem, 4vw, 2.6rem);
          margin: 0;
          color: var(--parchment);
          font-weight: 600;
        }
        .eyebrow-wrap p {
          color: var(--parchment-dim);
          max-width: 480px;
          margin: 14px auto 0;
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .zone-pill {
          position: fixed;
          top: 88px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 40;
          padding: 7px 16px;
          border-radius: 99px;
          background: rgba(10, 14, 23, 0.65);
          border: 1px solid var(--line);
          backdrop-filter: blur(6px);
          font-size: 0.72rem;
          color: var(--parchment-dim);
          font-family: "JetBrains Mono", monospace;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .zone-pill.show {
          opacity: 1;
        }
        .zone-pill .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ember);
        }
        .level-map {
          position: relative;
          z-index: 5;
          padding-bottom: 220px;
        }
        .trail-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          overflow: visible;
        }
        .trail-path-bg {
          fill: none;
          stroke: rgba(237, 230, 214, 0.07);
          stroke-width: 3;
          stroke-linecap: round;
        }
        .trail-path-fg {
          fill: none;
          stroke: url(#trailGrad);
          stroke-width: 3;
          stroke-linecap: round;
          filter: drop-shadow(0 0 6px rgba(227, 168, 87, 0.45));
        }
        .wayfinder {
          position: absolute;
          z-index: 6;
          width: 26px;
          height: 26px;
          margin: -13px 0 0 -13px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #fff2d8, var(--ember) 60%, #a67535 100%);
          box-shadow: 0 0 0 4px rgba(227, 168, 87, 0.18), 0 0 24px rgba(227, 168, 87, 0.55);
          display: grid;
          place-items: center;
          transition: opacity 0.3s ease;
        }
        .wayfinder i {
          font-size: 0.6rem;
          color: #3a2506;
        }
        .nodes {
          position: relative;
          z-index: 5;
        }
        .level-node {
          position: absolute;
          transform: translate(-50%, -50%) scale(0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 200px;
          opacity: 0;
          transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .level-node.is-visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        .level-node.align-r {
          align-items: flex-start;
          text-align: left;
        }
        .level-node.align-l {
          align-items: flex-end;
          text-align: right;
        }
        .node-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--void-2);
          border: 2px solid var(--line);
          font-size: 1.5rem;
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .level-node button.node-hit {
          background: none;
          border: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .level-node.align-r button.node-hit {
          align-items: flex-start;
        }
        .level-node.align-l button.node-hit {
          align-items: flex-end;
        }
        .node-badge:hover {
          transform: translateY(-4px) scale(1.06);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
        }
        .node-badge .lvl-num {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--ember);
          color: #251705;
          font-family: "JetBrains Mono", monospace;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 99px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
        }
        .node-title {
          margin: 16px 0 4px;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--parchment);
          font-family: "Cinzel", serif;
        }
        .node-date {
          font-size: 0.68rem;
          color: var(--parchment-dim);
          font-family: "JetBrains Mono", monospace;
          letter-spacing: 0.03em;
        }
        .node-excerpt {
          font-size: 0.78rem;
          color: var(--parchment-dim);
          margin-top: 6px;
          line-height: 1.5;
        }
        .node-badge.zone-meadow {
          border-color: rgba(111, 169, 138, 0.4);
        }
        .node-badge.zone-woods {
          border-color: rgba(111, 169, 138, 0.5);
          background: linear-gradient(160deg, #16241f, var(--void-2));
        }
        .node-badge.zone-dunes {
          border-color: rgba(201, 123, 90, 0.45);
          background: linear-gradient(160deg, #2a1d14, var(--void-2));
        }
        .node-badge.zone-frost {
          border-color: rgba(143, 182, 201, 0.45);
          background: linear-gradient(160deg, #141f2a, var(--void-2));
        }
        .node-badge.zone-hollow {
          border-color: rgba(155, 135, 196, 0.5);
          background: linear-gradient(160deg, #1e1830, var(--void-2));
        }
        .node-badge.today {
          border: 2px dashed var(--ember);
          color: var(--ember);
          animation: pulse-today 2.6s ease-in-out infinite;
        }
        @keyframes pulse-today {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(227, 168, 87, 0.35);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(227, 168, 87, 0);
          }
        }
        .today-tag {
          font-size: 0.64rem;
          font-family: "JetBrains Mono", monospace;
          color: var(--ember);
          border: 1px solid rgba(227, 168, 87, 0.4);
          padding: 2px 8px;
          border-radius: 99px;
          margin-top: 14px;
        }
        .origin-marker {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 4;
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .origin-marker.is-visible {
          opacity: 1;
        }
        .origin-marker i {
          color: var(--rune);
          font-size: 1.1rem;
        }
        .origin-marker p {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.68rem;
          color: var(--parchment-dim);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 8px 0 0;
        }
        .fab-wrap {
          position: fixed;
          right: 28px;
          bottom: 30px;
          z-index: 55;
        }
        .fab {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(150deg, var(--ember), #b9803c);
          color: #231604;
          border: none;
          font-size: 1.5rem;
          display: grid;
          place-items: center;
          box-shadow: 0 10px 28px rgba(227, 168, 87, 0.4), 0 0 0 0 rgba(227, 168, 87, 0.5);
          transform: scale(0);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          animation: fab-breathe 3.4s ease-in-out infinite;
        }
        .fab:hover {
          transform: scale(1.08);
        }
        .fab:active {
          transform: scale(0.94);
        }
        @keyframes fab-breathe {
          0%,
          100% {
            box-shadow: 0 10px 28px rgba(227, 168, 87, 0.4), 0 0 0 0 rgba(227, 168, 87, 0.28);
          }
          50% {
            box-shadow: 0 10px 28px rgba(227, 168, 87, 0.4), 0 0 0 12px rgba(227, 168, 87, 0);
          }
        }
        .fab-label {
          position: fixed;
          right: 100px;
          bottom: 48px;
          z-index: 55;
          font-size: 0.72rem;
          font-family: "JetBrains Mono", monospace;
          color: var(--parchment-dim);
          background: rgba(10, 14, 23, 0.7);
          border: 1px solid var(--line);
          padding: 6px 12px;
          border-radius: 99px;
          opacity: 0;
          transform: translateX(6px);
          transition: all 0.25s ease;
          pointer-events: none;
          backdrop-filter: blur(6px);
        }
        .fab-wrap:hover .fab-label {
          opacity: 1;
          transform: translateX(0);
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(6, 8, 13, 0.72);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, visibility 0.25s;
        }
        .modal-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        .modal-card {
          width: 100%;
          max-width: 460px;
          background: var(--void-2);
          border: 1px solid var(--line);
          border-radius: 22px;
          box-shadow: var(--shadow);
          padding: 28px;
          transform: translateY(18px) scale(0.97);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          max-height: 86vh;
          overflow-y: auto;
        }
        .modal-overlay.open .modal-card {
          transform: translateY(0) scale(1);
        }
        .modal-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }
        .modal-top h3 {
          font-family: "Cinzel", serif;
          font-size: 1.2rem;
          margin: 0;
          color: var(--parchment);
        }
        .modal-close {
          background: rgba(237, 230, 214, 0.06);
          border: 1px solid var(--line);
          width: 32px;
          height: 32px;
          border-radius: 9px;
          color: var(--parchment-dim);
          display: grid;
          place-items: center;
          flex: 0 0 auto;
        }
        .modal-close:hover {
          color: var(--parchment);
        }
        .modal-meta {
          font-family: "JetBrains Mono", monospace;
          font-size: 0.72rem;
          color: var(--ember);
          margin-top: 6px;
        }
        .modal-body-text {
          margin-top: 18px;
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--parchment);
        }
        .field {
          margin-top: 18px;
        }
        .field label {
          display: block;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--parchment-dim);
          margin-bottom: 7px;
        }
        .field input,
        .field textarea {
          width: 100%;
          background: rgba(237, 230, 214, 0.05);
          border: 1px solid var(--line);
          border-radius: 12px;
          color: var(--parchment);
          padding: 11px 13px;
          font-family: "Manrope", sans-serif;
          font-size: 0.9rem;
          resize: vertical;
        }
        .field input:focus,
        .field textarea:focus {
          outline: none;
          border-color: var(--ember);
        }
        .mood-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 6px;
        }
        .mood-opt {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(237, 230, 214, 0.05);
          border: 1px solid var(--line);
          font-size: 1.05rem;
          display: grid;
          place-items: center;
        }
        .mood-opt.selected {
          border-color: var(--ember);
          background: var(--ember-soft);
        }
        .save-btn {
          margin-top: 22px;
          width: 100%;
          padding: 13px;
          border-radius: 13px;
          border: none;
          background: linear-gradient(150deg, var(--ember), #b9803c);
          color: #231604;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .save-btn:hover {
          filter: brightness(1.06);
        }
        .toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          z-index: 120;
          background: var(--void-2);
          border: 1px solid var(--line);
          padding: 12px 20px;
          border-radius: 99px;
          font-size: 0.82rem;
          color: var(--parchment);
          box-shadow: var(--shadow);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 9px;
          pointer-events: none;
        }
        .toast.show {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .toast i {
          color: var(--moss);
        }
        @media (max-width: 720px) {
          .topnav {
            padding: 13px 16px;
            gap: 10px;
          }
          .brand span {
            display: none;
          }
          .search-pill,
          .search-pill.expanded {
            width: 100%;
          }
          .search-pill .hint {
            display: none;
          }
          .eyebrow-wrap {
            padding-top: 132px;
          }
          .level-node {
            width: 150px;
          }
          .node-excerpt {
            display: none;
          }
          .zone-pill {
            top: auto;
            bottom: 110px;
          }
        }
        @media (max-width: 460px) {
          .brand h1 {
            font-size: 1.05rem;
          }
          .level-node {
            width: 128px;
          }
          .node-title {
            font-size: 0.82rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          .fab,
          .node-badge.today,
          .particle {
            animation: none !important;
          }
          .level-node {
            transition: opacity 0.3s ease;
          }
        }
      `}</style>
    </>
  );
}