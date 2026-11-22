import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";

interface TheWriteTakeTransitionProps {
  onComplete: () => void;
  key?: React.Key;
}

const STANDARD_DURATION_MS = 2380;
const REDUCED_MOTION_DURATION_MS = 520;

interface ScriptStrokeDef {
  id: string;
  d: string;
  durationMs: number;
  liftBeforeMs: number;
  strokeWidth: number;
}

// Handwritten lowercase "script" (s -> c -> r -> i -> p -> t) centered in 640x280 viewBox
const SCRIPT_STROKES: ScriptStrokeDef[] = [
  {
    id: "letter-s",
    // Lowercase 's': upper-right hook -> top curve -> spine inflection -> lower bowl -> bottom hook
    d: "M 205 130 C 199 117, 167 117, 167 134 C 167 149, 206 148, 206 165 C 206 181, 172 182, 166 168",
    durationMs: 240,
    liftBeforeMs: 0,
    strokeWidth: 3.1,
  },
  {
    id: "letter-c",
    // Lowercase 'c': upper terminal -> rounded left arc -> baseline sweep toward 'r'
    d: "M 265 131 C 257 118, 225 120, 225 150 C 225 178, 257 181, 275 162",
    durationMs: 205,
    liftBeforeMs: 30,
    strokeWidth: 3.1,
  },
  {
    id: "letter-r",
    // Lowercase 'r': downward stem -> smooth continuous retrace up into arched shoulder
    d: "M 287 122 L 285 178 C 285 158, 287 138, 296 128 C 303 120, 315 120, 323 127",
    durationMs: 215,
    liftBeforeMs: 26,
    strokeWidth: 3.1,
  },
  {
    id: "letter-i-stem",
    // Lowercase 'i' stem: x-height down to baseline with gentle exit curve
    d: "M 339 123 C 337 144, 336 162, 337 172 C 338 179, 348 179, 359 166",
    durationMs: 145,
    liftBeforeMs: 26,
    strokeWidth: 3.1,
  },
  {
    id: "letter-i-dot",
    // Lowercase 'i' dot
    d: "M 339 98 C 341 97, 343 100, 340 102",
    durationMs: 55,
    liftBeforeMs: 32,
    strokeWidth: 4.2,
  },
  {
    id: "letter-p",
    // Lowercase 'p': stem down to descender -> continuous retrace up into rounded bowl
    d: "M 375 123 L 371 226 C 372 192, 373 154, 375 138 C 383 120, 417 120, 417 149 C 417 176, 385 180, 374 169",
    durationMs: 330,
    liftBeforeMs: 34,
    strokeWidth: 3.1,
  },
  {
    id: "letter-t-stem",
    // Lowercase 't' vertical stem: ascender down to baseline terminal curve
    d: "M 449 78 C 447 112, 445 148, 445 167 C 445 178, 458 180, 471 170",
    durationMs: 185,
    liftBeforeMs: 32,
    strokeWidth: 3.1,
  },
  {
    id: "letter-t-cross",
    // Lowercase 't' horizontal crossbar
    d: "M 429 115 C 443 114, 459 113, 473 112",
    durationMs: 115,
    liftBeforeMs: 30,
    strokeWidth: 2.9,
  },
];

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function TheWriteTakeTransition({
  onComplete,
}: TheWriteTakeTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const mainPathsRef = useRef<(SVGPathElement | null)[]>([]);
  const grainPathsRef = useRef<(SVGPathElement | null)[]>([]);
  const wordGroupRef = useRef<SVGGElement | null>(null);
  const pencilGroupRef = useRef<SVGGElement | null>(null);
  const shadowEllipseRef = useRef<SVGEllipseElement | null>(null);

  useEffect(() => {
    const duration = prefersReducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : STANDARD_DURATION_MS;

    const timer = window.setTimeout(() => {
      onComplete();
    }, duration);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.clearTimeout(timer);
        onComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete, prefersReducedMotion]);

  // Synchronize pencil tip position with each stroke of the word "script"
  useEffect(() => {
    const pencilGroup = pencilGroupRef.current;
    const shadowEllipse = shadowEllipseRef.current;
    const wordGroup = wordGroupRef.current;

    if (!pencilGroup || !wordGroup) return;

    interface MeasuredStroke {
      mainEl: SVGPathElement;
      grainEl: SVGPathElement | null;
      length: number;
      startPt: { x: number; y: number };
      endPt: { x: number; y: number };
      liftStartMs: number;
      drawStartMs: number;
      drawEndMs: number;
    }

    const introDurationMs = 150;
    let cursorMs = introDurationMs;

    const measured: MeasuredStroke[] = [];

    SCRIPT_STROKES.forEach((def, idx) => {
      const mainEl = mainPathsRef.current[idx];
      const grainEl = grainPathsRef.current[idx] ?? null;
      if (!mainEl) return;

      let length = 120;
      let startPt = { x: 205, y: 130 };
      let endPt = { x: 473, y: 112 };

      try {
        length = Math.max(mainEl.getTotalLength(), 1);
        const s = mainEl.getPointAtLength(0);
        const e = mainEl.getPointAtLength(length);
        startPt = { x: s.x, y: s.y };
        endPt = { x: e.x, y: e.y };
      } catch {
        length = 120;
      }

      mainEl.style.strokeDasharray = `${length}`;
      if (grainEl) {
        grainEl.style.strokeDasharray = `${length}`;
      }

      const liftStartMs = cursorMs;
      const drawStartMs = cursorMs + def.liftBeforeMs;
      const drawEndMs = drawStartMs + def.durationMs;
      cursorMs = drawEndMs;

      measured.push({
        mainEl,
        grainEl,
        length,
        startPt,
        endPt,
        liftStartMs,
        drawStartMs,
        drawEndMs,
      });
    });

    if (measured.length === 0) return;

    const writingEndMs = measured[measured.length - 1].drawEndMs; // ~1850ms
    const holdEndMs = writingEndMs + 250; // Hold full word "script" clearly visible until ~2100ms
    const fadeEndMs = STANDARD_DURATION_MS - 30; // Smoothly fade out word + pencil together by ~2350ms

    if (prefersReducedMotion) {
      measured.forEach((m) => {
        m.mainEl.style.strokeDashoffset = "0";
        if (m.grainEl) {
          m.grainEl.style.strokeDashoffset = "0";
        }
      });
      wordGroup.style.opacity = "1";
      pencilGroup.style.opacity = "1";
      pencilGroup.setAttribute("transform", "translate(478, 108) rotate(-34)");
      if (shadowEllipse) {
        shadowEllipse.setAttribute("cx", "486");
        shadowEllipse.setAttribute("cy", "114");
      }
      return;
    }

    // Initialize all strokes hidden prior to writing
    measured.forEach((m) => {
      m.mainEl.style.strokeDashoffset = `${m.length}`;
      if (m.grainEl) {
        m.grainEl.style.strokeDashoffset = `${m.length}`;
      }
    });

    const firstStart = measured[0].startPt;
    wordGroup.style.opacity = "1";
    pencilGroup.style.opacity = "0";
    pencilGroup.setAttribute(
      "transform",
      `translate(${firstStart.x.toFixed(2)}, ${(firstStart.y - 12).toFixed(2)}) rotate(-38)`
    );

    let rafId: number | null = null;
    const startTime = performance.now();

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < introDurationMs) {
        // Phase 1: Pencil appears and settles gently onto the start of 's'
        const t = Math.min(elapsed / introDurationMs, 1);
        const eased = easeInOutQuad(t);
        const yOffset = (1 - eased) * -12;
        const xOffset = (1 - eased) * -6;

        pencilGroup.style.opacity = `${eased.toFixed(3)}`;
        pencilGroup.setAttribute(
          "transform",
          `translate(${(firstStart.x + xOffset).toFixed(2)}, ${(firstStart.y + yOffset).toFixed(2)}) rotate(-38)`
        );
        if (shadowEllipse) {
          shadowEllipse.setAttribute(
            "cx",
            `${(firstStart.x + 8).toFixed(2)}`
          );
          shadowEllipse.setAttribute(
            "cy",
            `${(firstStart.y + 5).toFixed(2)}`
          );
          shadowEllipse.style.opacity = `${(0.14 * eased).toFixed(3)}`;
        }
      } else if (elapsed <= writingEndMs) {
        // Phase 2: Pencil physically writes s -> c -> r -> i -> p -> t
        pencilGroup.style.opacity = "1";
        wordGroup.style.opacity = "1";

        let activeIndex = measured.findIndex(
          (m) => elapsed >= m.liftStartMs && elapsed <= m.drawEndMs
        );
        if (activeIndex === -1) {
          activeIndex = measured.length - 1;
        }

        // Ensure all earlier strokes are fully drawn and later strokes remain hidden
        for (let i = 0; i < measured.length; i++) {
          if (i < activeIndex) {
            measured[i].mainEl.style.strokeDashoffset = "0";
            if (measured[i].grainEl) {
              measured[i].grainEl!.style.strokeDashoffset = "0";
            }
          } else if (i > activeIndex) {
            measured[i].mainEl.style.strokeDashoffset = `${measured[i].length}`;
            if (measured[i].grainEl) {
              measured[i].grainEl!.style.strokeDashoffset = `${measured[i].length}`;
            }
          }
        }

        const current = measured[activeIndex];

        if (elapsed < current.drawStartMs && activeIndex > 0) {
          // Natural micro-lift between strokes
          const prev = measured[activeIndex - 1];
          const liftSpan = Math.max(
            current.drawStartMs - current.liftStartMs,
            1
          );
          const liftT = Math.min(
            Math.max((elapsed - current.liftStartMs) / liftSpan, 0),
            1
          );
          const easedLift = easeInOutQuad(liftT);
          const arcLift = Math.sin(liftT * Math.PI) * -5.5;

          const x =
            prev.endPt.x + (current.startPt.x - prev.endPt.x) * easedLift;
          const y =
            prev.endPt.y +
            (current.startPt.y - prev.endPt.y) * easedLift +
            arcLift;

          pencilGroup.setAttribute(
            "transform",
            `translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(-36)`
          );
          if (shadowEllipse) {
            shadowEllipse.setAttribute("cx", `${(x + 9).toFixed(2)}`);
            shadowEllipse.setAttribute("cy", `${(y + 7).toFixed(2)}`);
            shadowEllipse.style.opacity = "0.10";
          }
        } else {
          // Active stroke writing: synchronize strokeDashoffset and pencil tip
          const strokeSpan = Math.max(
            current.drawEndMs - current.drawStartMs,
            1
          );
          const rawT = Math.min(
            Math.max((elapsed - current.drawStartMs) / strokeSpan, 0),
            1
          );
          const easedT = easeInOutQuad(rawT);
          const drawnLen = easedT * current.length;
          const dashOffset = current.length - drawnLen;

          current.mainEl.style.strokeDashoffset = `${dashOffset.toFixed(2)}`;
          if (current.grainEl) {
            current.grainEl.style.strokeDashoffset = `${dashOffset.toFixed(2)}`;
          }

          let pt = current.startPt;
          let pencilAngle = -36;
          try {
            const p = current.mainEl.getPointAtLength(drawnLen);
            pt = { x: p.x, y: p.y };
            const ahead = current.mainEl.getPointAtLength(
              Math.min(drawnLen + 3, current.length)
            );
            const behind = current.mainEl.getPointAtLength(
              Math.max(drawnLen - 3, 0)
            );
            const tangentDeg =
              (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) /
              Math.PI;
            pencilAngle = -36 + Math.max(Math.min(tangentDeg * 0.1, 8), -8);
          } catch {
            pt = current.endPt;
          }

          pencilGroup.setAttribute(
            "transform",
            `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}) rotate(${pencilAngle.toFixed(2)})`
          );

          if (shadowEllipse) {
            shadowEllipse.setAttribute("cx", `${(pt.x + 8).toFixed(2)}`);
            shadowEllipse.setAttribute("cy", `${(pt.y + 5).toFixed(2)}`);
            shadowEllipse.style.opacity = "0.14";
          }
        }
      } else if (elapsed <= holdEndMs) {
        // Phase 3: Complete word "script" held clearly visible; pencil gently lifts from final 't' stroke
        measured.forEach((m) => {
          m.mainEl.style.strokeDashoffset = "0";
          if (m.grainEl) {
            m.grainEl.style.strokeDashoffset = "0";
          }
        });
        wordGroup.style.opacity = "1";

        const holdT = Math.min(
          (elapsed - writingEndMs) / Math.max(holdEndMs - writingEndMs, 1),
          1
        );
        const easedHold = easeInOutQuad(holdT);
        const lastEnd = measured[measured.length - 1].endPt;
        const liftX = lastEnd.x + easedHold * 8;
        const liftY = lastEnd.y - easedHold * 9;
        const angle = -35 + easedHold * 4;

        pencilGroup.style.opacity = "1";
        pencilGroup.setAttribute(
          "transform",
          `translate(${liftX.toFixed(2)}, ${liftY.toFixed(2)}) rotate(${angle.toFixed(2)})`
        );
        if (shadowEllipse) {
          shadowEllipse.setAttribute(
            "cx",
            `${(lastEnd.x + 10 + easedHold * 5).toFixed(2)}`
          );
          shadowEllipse.setAttribute("cy", `${(lastEnd.y + 6).toFixed(2)}`);
          shadowEllipse.style.opacity = `${(0.14 * (1 - easedHold * 0.3)).toFixed(3)}`;
        }
      } else {
        // Phase 4: Smoothly fade out the completed word "script" and the pencil together
        measured.forEach((m) => {
          m.mainEl.style.strokeDashoffset = "0";
          if (m.grainEl) {
            m.grainEl.style.strokeDashoffset = "0";
          }
        });

        const fadeT = Math.min(
          Math.max(
            (elapsed - holdEndMs) / Math.max(fadeEndMs - holdEndMs, 1),
            0
          ),
          1
        );
        const opacity = Math.max(1 - easeInOutQuad(fadeT), 0);
        const lastEnd = measured[measured.length - 1].endPt;
        const driftX = lastEnd.x + 8 + fadeT * 6;
        const driftY = lastEnd.y - 9 - fadeT * 6;

        wordGroup.style.opacity = `${opacity.toFixed(3)}`;
        pencilGroup.style.opacity = `${opacity.toFixed(3)}`;
        pencilGroup.setAttribute(
          "transform",
          `translate(${driftX.toFixed(2)}, ${driftY.toFixed(2)}) rotate(-31)`
        );
        if (shadowEllipse) {
          shadowEllipse.style.opacity = `${(0.1 * opacity).toFixed(3)}`;
        }
      }

      if (elapsed < STANDARD_DURATION_MS) {
        rafId = window.requestAnimationFrame(animateFrame);
      }
    };

    rafId = window.requestAnimationFrame(animateFrame);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [prefersReducedMotion]);

  if (typeof document === "undefined") return null;

  const easeApple: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 1.015,
        transition: { duration: 0.28, ease: easeApple },
      }}
      transition={{ duration: 0.22, ease: easeApple }}
      role="status"
      aria-live="polite"
      aria-label="Opening The Write Take project mockups"
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-zinc-950/35 backdrop-blur-2xl select-none overflow-hidden"
    >
      {/* Compact Apple-Inspired Editorial Stage */}
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 14, scale: 0.97 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: -8, scale: 0.985 }
        }
        transition={{ duration: 0.28, ease: easeApple }}
        className="relative w-full max-w-[660px] rounded-[28px] sm:rounded-[36px] bg-[#FAF9F6]/95 border border-white/80 ring-1 ring-black/[0.06] shadow-[0_32px_90px_-16px_rgba(0,0,0,0.28)] overflow-hidden px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center"
      >
        {/* Subtle Warm Editorial Paper Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(24, 24, 27, 0.04) 0%, rgba(250, 249, 246, 0) 65%)",
          }}
        />

        {/* SVG Scene: Pencil Physically Writing the Word "script" */}
        <div className="relative z-10 w-full aspect-[16/8.5] sm:aspect-[16/7.8] max-h-[250px] rounded-2xl bg-gradient-to-b from-[#FAF9F5] via-[#F5F3EC] to-[#EDEAE0] border border-black/[0.05] overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 640 280"
            className="w-full h-full block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              {/* Graphite Line Gradient */}
              <linearGradient
                id="writeTakeGraphiteGrad"
                x1="160"
                y1="145"
                x2="480"
                y2="145"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#3F3F46" />
                <stop offset="50%" stopColor="#27272A" />
                <stop offset="100%" stopColor="#18181B" />
              </linearGradient>

              {/* Minimal Matte Black Pencil Body Gradient */}
              <linearGradient
                id="writeTakePencilBody"
                x1="0"
                y1="-7"
                x2="0"
                y2="7"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#3F3F46" />
                <stop offset="45%" stopColor="#18181B" />
                <stop offset="100%" stopColor="#09090B" />
              </linearGradient>
            </defs>

            {/* Subtle Notebook / Storyboard Baseline & X-Height Rules */}
            <line
              x1="112"
              y1="180"
              x2="528"
              y2="180"
              stroke="#18181B"
              strokeOpacity="0.06"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="112"
              y1="120"
              x2="528"
              y2="120"
              stroke="#18181B"
              strokeOpacity="0.04"
              strokeWidth="1"
              strokeDasharray="3 6"
              strokeLinecap="round"
            />

            {/* Handwritten Word "script" Group (s -> c -> r -> i -> p -> t) */}
            <g ref={wordGroupRef}>
              {SCRIPT_STROKES.map((stroke, idx) => (
                <g key={stroke.id}>
                  {/* Subtle Graphite Texture Under-Stroke */}
                  <path
                    ref={(el) => {
                      grainPathsRef.current[idx] = el;
                    }}
                    d={stroke.d}
                    stroke="#71717A"
                    strokeOpacity="0.2"
                    strokeWidth={stroke.strokeWidth + 2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Primary Crisp Graphite Stroke */}
                  <path
                    ref={(el) => {
                      mainPathsRef.current[idx] = el;
                    }}
                    d={stroke.d}
                    stroke="url(#writeTakeGraphiteGrad)"
                    strokeWidth={stroke.strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ))}
            </g>

            {/* Soft Moving Shadow Under Pencil Tip */}
            <ellipse
              ref={shadowEllipseRef}
              cx="213"
              cy="135"
              rx="18"
              ry="3.5"
              fill="#18181B"
              style={{ opacity: 0.12 }}
            />

            {/* Minimalist Architectural Pencil (Tip anchored at local (0, 0)) */}
            <g ref={pencilGroupRef} transform="translate(205, 130) rotate(-38)">
              {/* Exposed Wood Cone (from x=6 to x=22) */}
              <polygon points="0,0 22,-5.8 22,5.8" fill="#E6CCB2" />
              {/* Wood Cone Lower Shading */}
              <polygon points="0,0 22,0 22,5.8" fill="#D4B499" />

              {/* Sharp Graphite Lead Tip (from x=0 to x=7.5) */}
              <polygon points="0,0 7.5,-2 7.5,2" fill="#18181B" />

              {/* Main Hexagonal Matte Charcoal Pencil Barrel (from x=22 to x=116) */}
              <rect
                x="22"
                y="-5.8"
                width="94"
                height="11.6"
                rx="1"
                fill="url(#writeTakePencilBody)"
              />

              {/* Subtle Barrel Facet Highlight */}
              <line
                x1="23"
                y1="-2.2"
                x2="115"
                y2="-2.2"
                stroke="#71717A"
                strokeOpacity="0.45"
                strokeWidth="1"
              />

              {/* Warm Gold/Brass Ferrule Band (x=116 to x=126) */}
              <rect
                x="116"
                y="-5.8"
                width="10"
                height="11.6"
                fill="#D4A359"
              />
              <line
                x1="119.5"
                y1="-5.8"
                x2="119.5"
                y2="5.8"
                stroke="#9A6B26"
                strokeOpacity="0.45"
                strokeWidth="0.9"
              />
              <line
                x1="122.5"
                y1="-5.8"
                x2="122.5"
                y2="5.8"
                stroke="#9A6B26"
                strokeOpacity="0.45"
                strokeWidth="0.9"
              />

              {/* Minimal Ivory Eraser Cap (x=126 to x=137) */}
              <path
                d="M 126 -5.8 H 133 C 135.5 -5.8 137.5 -3.8 137.5 -1.3 V 1.3 C 137.5 3.8 135.5 5.8 133 5.8 H 126 Z"
                fill="#E4E2DD"
              />
            </g>
          </svg>
        </div>

        {/* Progress Indicator */}
        <div className="relative z-10 w-full mt-4 flex items-center justify-center">
          {/* Minimal Graphite Progress Bar */}
          <div className="w-24 sm:w-32 h-1 rounded-full bg-zinc-200/90 overflow-hidden shrink-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.4 : 2.15,
                ease: easeApple,
              }}
              style={{ transformOrigin: "left" }}
              className="w-full h-full bg-zinc-800 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
