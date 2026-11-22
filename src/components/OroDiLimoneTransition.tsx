import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";

interface OroDiLimoneTransitionProps {
  onComplete: () => void;
  key?: React.Key;
}

const STANDARD_DURATION_MS = 1680;
const REDUCED_MOTION_DURATION_MS = 450;

export function OroDiLimoneTransition({
  onComplete,
}: OroDiLimoneTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

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

  if (typeof document === "undefined") return null;

  const easeApple: [number, number, number, number] = [0.22, 1, 0.36, 1];

  // Parabolic droplet trajectories radiating from the central splash (320, 162)
  const droplets = [
    {
      id: "drop-left-high",
      tx: -118,
      ty: -78,
      endY: -34,
      rot: -38,
      rx: 6.5,
      ry: 9.5,
      delay: 0.14,
    },
    {
      id: "drop-left-mid",
      tx: -158,
      ty: -38,
      endY: 4,
      rot: -58,
      rx: 5,
      ry: 7.5,
      delay: 0.18,
    },
    {
      id: "drop-left-inner",
      tx: -68,
      ty: -98,
      endY: -62,
      rot: -22,
      rx: 4.5,
      ry: 6.8,
      delay: 0.12,
    },
    {
      id: "drop-center-crest",
      tx: 6,
      ty: -112,
      endY: -78,
      rot: 4,
      rx: 6,
      ry: 8.8,
      delay: 0.1,
    },
    {
      id: "drop-right-inner",
      tx: 74,
      ty: -94,
      endY: -58,
      rot: 24,
      rx: 5,
      ry: 7.5,
      delay: 0.13,
    },
    {
      id: "drop-right-high",
      tx: 124,
      ty: -74,
      endY: -28,
      rot: 40,
      rx: 6.5,
      ry: 9.5,
      delay: 0.15,
    },
    {
      id: "drop-right-mid",
      tx: 162,
      ty: -34,
      endY: 8,
      rot: 60,
      rx: 4.8,
      ry: 7,
      delay: 0.19,
    },
  ];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 1.015,
        transition: { duration: 0.3, ease: easeApple },
      }}
      transition={{ duration: 0.22, ease: easeApple }}
      role="status"
      aria-live="polite"
      aria-label="Opening Oro di Limone project mockups"
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
        transition={{ duration: 0.3, ease: easeApple }}
        className="relative w-full max-w-[660px] rounded-[28px] sm:rounded-[36px] bg-[#FAF9F6]/95 border border-white/80 ring-1 ring-black/[0.06] shadow-[0_32px_90px_-16px_rgba(0,0,0,0.28)] overflow-hidden px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center"
      >
        {/* Subtle Citrus-Gold & Mediterranean Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(250, 204, 21, 0.16) 0%, rgba(250, 249, 246, 0) 62%), radial-gradient(circle at 22% 24%, rgba(253, 224, 71, 0.12) 0%, rgba(250, 249, 246, 0) 52%)",
          }}
        />

        {/* SVG Scene: Golden-Yellow Limoncello Liquid Splash */}
        <div className="relative z-10 w-full aspect-[16/8.5] sm:aspect-[16/7.8] max-h-[250px] rounded-2xl bg-gradient-to-b from-[#FCFBF5] via-[#F8F5E6] to-[#F1ECD4] border border-black/[0.05] overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 640 280"
            className="w-full h-full block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              {/* Primary Rich Citrus-Gold Liqueur Gradient */}
              <linearGradient
                id="limoneCrownGrad"
                x1="320"
                y1="62"
                x2="320"
                y2="210"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="38%" stopColor="#FACC15" />
                <stop offset="78%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              {/* Secondary Translucent Golden Wave Gradient */}
              <linearGradient
                id="limoneBackWaveGrad"
                x1="210"
                y1="82"
                x2="430"
                y2="205"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.88" />
                <stop offset="60%" stopColor="#FACC15" stopOpacity="0.92" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.85" />
              </linearGradient>

              {/* Surface Ripple Pool Gradient */}
              <radialGradient
                id="limonePoolGrad"
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="0%" stopColor="#FACC15" stopOpacity="0.55" />
                <stop offset="65%" stopColor="#EAB308" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#CA8A04" stopOpacity="0" />
              </radialGradient>

              {/* Droplet Gloss Gradient */}
              <linearGradient
                id="limoneDropGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="45%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
            </defs>

            {/* Phase 1 & 2: Expanding Concentric Golden Liquid Ripples */}
            <motion.ellipse
              cx="320"
              cy="196"
              rx="155"
              ry="20"
              fill="url(#limonePoolGrad)"
              initial={
                prefersReducedMotion
                  ? { scale: 1, opacity: 0.7 }
                  : { scaleX: 0.18, scaleY: 0.25, opacity: 0 }
              }
              animate={
                prefersReducedMotion
                  ? { scale: 1, opacity: 0.7 }
                  : {
                      scaleX: [0.18, 0.88, 1.18, 1.32],
                      scaleY: [0.25, 0.9, 1.1, 0.75],
                      opacity: [0, 0.85, 0.75, 0],
                    }
              }
              transition={{
                duration: 1.52,
                times: [0, 0.34, 0.72, 1],
                ease: easeApple,
              }}
            />

            {/* Outer Delicate Surface Ring */}
            {!prefersReducedMotion && (
              <motion.ellipse
                cx="320"
                cy="196"
                rx="132"
                ry="15"
                stroke="#EAB308"
                strokeWidth="1.5"
                initial={{ scaleX: 0.2, scaleY: 0.2, opacity: 0 }}
                animate={{
                  scaleX: [0.2, 0.95, 1.36],
                  scaleY: [0.2, 0.95, 1.25],
                  opacity: [0, 0.55, 0],
                }}
                transition={{
                  duration: 1.48,
                  times: [0, 0.42, 1],
                  ease: "easeOut",
                }}
              />
            )}

            {/* Phase 1: Initial Falling Golden Liqueur Drop Before Impact */}
            {!prefersReducedMotion && (
              <motion.g
                initial={{ x: 320, y: 48, scaleY: 1.15, opacity: 0 }}
                animate={{
                  y: [48, 184],
                  scaleY: [1.15, 1.45, 0.3],
                  scaleX: [0.9, 0.85, 1.6],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.26,
                  times: [0, 0.75, 1],
                  ease: "easeIn",
                }}
              >
                <path
                  d="M 0 -14 C 5 -6, 8 1, 8 6 C 8 11, 4.5 14, 0 14 C -4.5 14, -8 11, -8 6 C -8 1, -5 -6, 0 -14 Z"
                  fill="url(#limoneDropGrad)"
                />
              </motion.g>
            )}

            {/* Phase 2 & 3: Secondary Back Fluid Ribbons (Depth Layer) */}
            <motion.g
              style={{ transformOrigin: "320px 194px" }}
              initial={
                prefersReducedMotion
                  ? { opacity: 0.85, scale: 0.95 }
                  : { opacity: 0, scaleX: 0.28, scaleY: 0.08, y: 10 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 0.85, scale: 0.95 }
                  : {
                      opacity: [0, 0.9, 0.85, 0],
                      scaleX: [0.28, 1.02, 1.14, 1.22],
                      scaleY: [0.08, 1.04, 0.86, 0.18],
                      y: [10, 0, 4, 14],
                    }
              }
              transition={{
                duration: 1.42,
                delay: prefersReducedMotion ? 0 : 0.12,
                times: [0, 0.38, 0.72, 1],
                ease: easeApple,
              }}
            >
              {/* Left Sweeping Back Ribbon */}
              <path
                d="M 310 194 C 272 192, 232 162, 210 118 C 202 102, 212 92, 224 104 C 248 128, 276 162, 316 184 Z"
                fill="url(#limoneBackWaveGrad)"
              />
              {/* Right Sweeping Back Ribbon */}
              <path
                d="M 330 194 C 368 192, 408 160, 432 114 C 440 98, 430 88, 418 100 C 394 126, 364 160, 324 184 Z"
                fill="url(#limoneBackWaveGrad)"
              />
            </motion.g>

            {/* Phase 2 & 3: Main Expressive Golden-Yellow Splash Crown */}
            <motion.g
              style={{ transformOrigin: "320px 196px" }}
              initial={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scaleX: 0.22, scaleY: 0.05, y: 14 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1 }
                  : {
                      opacity: [0, 1, 1, 0],
                      scaleX: [0.22, 0.98, 1.08, 1.16],
                      scaleY: [0.05, 1.02, 0.9, 0.22],
                      y: [14, 0, 2, 12],
                    }
              }
              transition={{
                duration: 1.45,
                delay: prefersReducedMotion ? 0 : 0.1,
                times: [0, 0.36, 0.7, 1],
                ease: easeApple,
              }}
            >
              {/* Organic Sculpted Liquid Crown Silhouette */}
              <path
                d="M 196 196
                   C 214 192, 232 178, 240 156
                   C 246 138, 232 116, 238 104
                   C 244 94, 258 104, 266 122
                   C 276 144, 290 142, 298 114
                   C 304 92, 310 72, 320 72
                   C 330 72, 336 92, 342 114
                   C 350 142, 364 144, 374 122
                   C 382 104, 396 94, 402 104
                   C 408 116, 394 138, 400 156
                   C 408 178, 426 192, 444 196
                   C 412 204, 368 208, 320 208
                   C 272 208, 228 204, 196 196 Z"
                fill="url(#limoneCrownGrad)"
              />

              {/* Glossy Specular Highlights on Liquid Curves */}
              <path
                d="M 317 82 C 313 102, 308 126, 302 148"
                stroke="#FEF9C3"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeOpacity="0.88"
              />
              <path
                d="M 244 112 C 252 128, 262 152, 274 172"
                stroke="#FEF9C3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.75"
              />
              <path
                d="M 396 112 C 388 128, 378 152, 366 172"
                stroke="#FEF9C3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.75"
              />

              {/* Base Liquid Meniscus Highlight */}
              <path
                d="M 226 195 Q 320 205 414 195"
                stroke="#FEF9C3"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity="0.72"
              />
            </motion.g>

            {/* Phase 2 & 3: Expressive Golden Droplets Arcing Outward */}
            {!prefersReducedMotion &&
              droplets.map((drop) => (
                <motion.g
                  key={drop.id}
                  initial={{
                    x: 320,
                    y: 168,
                    scale: 0.2,
                    rotate: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: [320, 320 + drop.tx * 0.72, 320 + drop.tx],
                    y: [168, 168 + drop.ty, 168 + drop.endY],
                    scale: [0.2, 1.05, 0.55],
                    rotate: [0, drop.rot, drop.rot * 1.25],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.32,
                    delay: drop.delay,
                    times: [0, 0.48, 1],
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Teardrop Droplet Shape */}
                  <path
                    d={`M 0 ${-drop.ry * 1.25}
                        C ${drop.rx * 0.75} ${-drop.ry * 0.4}, ${drop.rx} ${drop.ry * 0.2}, ${drop.rx} ${drop.ry * 0.6}
                        C ${drop.rx} ${drop.ry * 1.15}, ${drop.rx * 0.55} ${drop.ry * 1.4}, 0 ${drop.ry * 1.4}
                        C ${-drop.rx * 0.55} ${drop.ry * 1.4}, ${-drop.rx} ${drop.ry * 1.15}, ${-drop.rx} ${drop.ry * 0.6}
                        C ${-drop.rx} ${drop.ry * 0.2}, ${-drop.rx * 0.75} ${-drop.ry * 0.4}, 0 ${-drop.ry * 1.25} Z`}
                    fill="url(#limoneDropGrad)"
                  />
                  {/* Tiny Specular Glint on Droplet */}
                  <circle
                    cx={-drop.rx * 0.28}
                    cy={drop.ry * 0.35}
                    r={Math.max(drop.rx * 0.24, 1.2)}
                    fill="#FEF9C3"
                    fillOpacity="0.85"
                  />
                </motion.g>
              ))}
          </svg>
        </div>

        {/* Progress Indicator */}
        <div className="relative z-10 w-full mt-4 flex items-center justify-center">
          {/* Minimal Citrus-Gold Progress Bar */}
          <div className="w-24 sm:w-32 h-1 rounded-full bg-zinc-200/90 overflow-hidden shrink-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.35 : 1.5,
                ease: easeApple,
              }}
              style={{ transformOrigin: "left" }}
              className="w-full h-full bg-[#EAB308] rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
