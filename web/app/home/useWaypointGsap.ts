import { useEffect, useRef } from "react";
import { ZONES, NODES } from "./waypointData";

export function useWaypointGsap() {
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
}
