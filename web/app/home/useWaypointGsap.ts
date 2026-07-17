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
          tl.from("#topnav", { y: -100, opacity: 0, duration: 0.7 })
            .to("#eyebrow", { opacity: 1, duration: 0.8 }, "-=.35");
        } else {
          gsap.set(["#eyebrow"], { opacity: 1, y: 0 });
        }

        /* ============= MODAL (read-only for past nodes) ============= */
        var overlay = document.getElementById("modalOverlay")!;
        var modalCard = document.getElementById("modalCard")!;

        function openReadModal(idx: number) {
          var n = NODES[idx];
          modalCard.innerHTML =
            '<div class="modal-top">' +
            "<div><h3>" + n.title + '</h3><div class="modal-meta">' + n.date + "  ·  " + n.mood + "</div></div>" +
            '<button class="modal-close" id="closeModal"><i class="fa-solid fa-xmark"></i></button>' +
            "</div>" +
            '<p class="modal-body-text">' + n.body + "</p>";
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
          if (val === "today") {
            window.location.href = "/journal/new";
          } else {
            openReadModal(parseInt(val, 10));
          }
        }
        nodesContainer.addEventListener("click", onNodesContainerClick);



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
          overlay.removeEventListener("click", onOverlayClick);
          document.removeEventListener("keydown", onDocKeydown);
          nodesContainer.removeEventListener("click", onNodesContainerClick);
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
