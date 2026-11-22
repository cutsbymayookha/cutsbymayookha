import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";

interface AlhindLandingTransitionProps {
  onComplete: () => void;
  key?: React.Key;
}

const STANDARD_DURATION_MS = 1850;
const REDUCED_MOTION_DURATION_MS = 450;

export function AlhindLandingTransition({
  onComplete,
}: AlhindLandingTransitionProps) {
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

  const easeOutCubic: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 1.015,
        transition: { duration: 0.32, ease: easeOutCubic },
      }}
      transition={{ duration: 0.24, ease: easeOutCubic }}
      role="status"
      aria-live="polite"
      aria-label="Opening Alhind Air project mockups"
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-zinc-950/35 backdrop-blur-2xl select-none overflow-hidden"
    >
      {/* Compact Apple-inspired Editorial Stage */}
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
        transition={{ duration: 0.32, ease: easeOutCubic }}
        className="relative w-full max-w-[680px] rounded-[28px] sm:rounded-[36px] bg-[#FAF9F6]/95 border border-white/80 ring-1 ring-black/[0.06] shadow-[0_32px_90px_-16px_rgba(0,0,0,0.28)] overflow-hidden px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center"
      >
        {/* Subtle Ambient Sky Gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 75% 22%, rgba(158, 42, 43, 0.05) 0%, rgba(250, 249, 246, 0) 55%), radial-gradient(circle at 25% 18%, rgba(212, 163, 89, 0.07) 0%, rgba(250, 249, 246, 0) 50%)",
          }}
        />

        {/* SVG Scene: Approach, Descent, Touchdown & Rollout */}
        <div className="relative z-10 w-full aspect-[16/8.5] sm:aspect-[16/7.8] max-h-[250px] rounded-2xl bg-gradient-to-b from-zinc-100/70 via-[#F5F4F0] to-[#ECEAE3] border border-black/[0.05] overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 640 280"
            className="w-full h-full block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="alhindRunwaySurface"
                x1="0"
                y1="196"
                x2="640"
                y2="256"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#E5E4DF" />
                <stop offset="50%" stopColor="#DDDCD6" />
                <stop offset="100%" stopColor="#D3D1CA" />
              </linearGradient>
              <linearGradient
                id="alhindHorizonFade"
                x1="0"
                y1="196"
                x2="640"
                y2="196"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#18181B" stopOpacity="0" />
                <stop offset="15%" stopColor="#18181B" stopOpacity="0.18" />
                <stop offset="85%" stopColor="#18181B" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#18181B" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="alhindGlidePath"
                x1="40"
                y1="62"
                x2="310"
                y2="210"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#7C1D26" stopOpacity="0" />
                <stop offset="45%" stopColor="#7C1D26" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#7C1D26" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Distant Minimal Clouds / Atmospheric Lines */}
            <path
              d="M84 68H156M430 52H520M260 40H326"
              stroke="#18181B"
              strokeOpacity="0.06"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Subtle Glide Path Trajectory Line */}
            {!prefersReducedMotion && (
              <motion.path
                d="M 30 62 Q 175 138 286 208"
                stroke="url(#alhindGlidePath)"
                strokeWidth="1.25"
                strokeDasharray="4 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.85, 0] }}
                transition={{
                  duration: 1.45,
                  times: [0, 0.55, 1],
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Perspective Runway Surface */}
            <polygon
              points="70,202 570,202 632,248 8,248"
              fill="url(#alhindRunwaySurface)"
            />

            {/* Horizon Line */}
            <line
              x1="16"
              y1="202"
              x2="624"
              y2="202"
              stroke="url(#alhindHorizonFade)"
              strokeWidth="1.2"
            />

            {/* Perspective Side Edge Lines */}
            <line
              x1="70"
              y1="202"
              x2="8"
              y2="248"
              stroke="#18181B"
              strokeOpacity="0.16"
              strokeWidth="1.2"
            />
            <line
              x1="570"
              y1="202"
              x2="632"
              y2="248"
              stroke="#18181B"
              strokeOpacity="0.16"
              strokeWidth="1.2"
            />

            {/* Runway Threshold Markings (Left Touchdown Zone) */}
            <g opacity="0.28">
              <line
                x1="158"
                y1="212"
                x2="192"
                y2="212"
                stroke="#18181B"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="148"
                y1="219"
                x2="186"
                y2="219"
                stroke="#18181B"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1="138"
                y1="227"
                x2="180"
                y2="227"
                stroke="#18181B"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <line
                x1="128"
                y1="235"
                x2="174"
                y2="235"
                stroke="#18181B"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </g>

            {/* Runway Centerline Dashed Markings */}
            <motion.line
              x1="210"
              y1="224"
              x2="606"
              y2="224"
              stroke="#18181B"
              strokeOpacity="0.34"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="18 16"
              initial={{ strokeDashoffset: 0 }}
              animate={
                prefersReducedMotion
                  ? { strokeDashoffset: 0 }
                  : { strokeDashoffset: [0, -52, -76] }
              }
              transition={{
                duration: 1.65,
                times: [0, 0.62, 1],
                ease: "easeOut",
              }}
            />

            {/* Understated Runway Edge Lights */}
            {[115, 190, 265, 340, 415, 490, 565].map((xPos, idx) => (
              <motion.circle
                key={xPos}
                cx={xPos}
                cy={206}
                r="1.7"
                fill={idx === 2 || idx === 3 ? "#D4A359" : "#18181B"}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 0.65, 0.3] }}
                transition={{
                  duration: 1.1,
                  delay: idx * 0.07,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Ground Shadow on Runway (Converges with Aircraft at Touchdown) */}
            <motion.ellipse
              cx="0"
              cy="0"
              rx="38"
              ry="4.2"
              fill="#18181B"
              initial={
                prefersReducedMotion
                  ? { x: 350, y: 223, scaleX: 1, scaleY: 1, opacity: 0.18 }
                  : {
                      x: 68,
                      y: 223,
                      scaleX: 0.38,
                      scaleY: 0.5,
                      opacity: 0.04,
                    }
              }
              animate={
                prefersReducedMotion
                  ? { x: 350, y: 223, scaleX: 1, scaleY: 1, opacity: 0.18 }
                  : {
                      x: [68, 276, 405, 468],
                      y: [223, 223, 223, 223],
                      scaleX: [0.38, 0.96, 1.05, 1.02],
                      scaleY: [0.5, 1, 1, 1],
                      opacity: [0.04, 0.22, 0.2, 0.14],
                    }
              }
              transition={{
                duration: 1.62,
                times: [0, 0.58, 0.84, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
            />

            {/* Subtle Touchdown Tire Puff Effect at Rear Gear (around t = 0.94s) */}
            {!prefersReducedMotion && (
              <motion.g
                initial={{ opacity: 0, scale: 0.4, x: 258, y: 220 }}
                animate={{
                  opacity: [0, 0, 0.45, 0],
                  scale: [0.4, 0.5, 1.35, 1.9],
                  x: [258, 258, 246, 228],
                  y: [220, 220, 218, 215],
                }}
                transition={{
                  duration: 1.62,
                  times: [0, 0.55, 0.64, 0.88],
                  ease: "easeOut",
                }}
              >
                <ellipse
                  cx="0"
                  cy="0"
                  rx="12"
                  ry="4"
                  fill="#71717A"
                  fillOpacity="0.32"
                />
                <ellipse
                  cx="-8"
                  cy="-2"
                  rx="7"
                  ry="2.8"
                  fill="#A1A1AA"
                  fillOpacity="0.28"
                />
              </motion.g>
            )}

            {/* Animated Aircraft Silhouette (Approach -> Flare & Touchdown -> Rollout) */}
            <motion.g
              initial={
                prefersReducedMotion
                  ? { x: 350, y: 205, rotate: 0, scale: 0.95 }
                  : { x: 64, y: 66, rotate: 9.5, scale: 0.78 }
              }
              animate={
                prefersReducedMotion
                  ? { x: 350, y: 205, rotate: 0, scale: 0.95 }
                  : {
                      x: [64, 276, 405, 468],
                      y: [66, 204, 205, 205],
                      rotate: [9.5, -3.2, 0, 0],
                      scale: [0.78, 0.96, 0.96, 0.96],
                    }
              }
              transition={{
                duration: 1.62,
                times: [0, 0.58, 0.78, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Rear & Nose Landing Gear */}
              <g stroke="#27272A" strokeWidth="1.6" strokeLinecap="round">
                {/* Main Rear Gear Strut */}
                <line x1="-10" y1="6" x2="-12" y2="16" />
                {/* Nose Gear Strut */}
                <line x1="32" y1="5" x2="31" y2="16" />
              </g>
              {/* Rear & Nose Wheels */}
              <circle cx="-14" cy="17.2" r="2.6" fill="#18181B" />
              <circle cx="-9.5" cy="17.2" r="2.6" fill="#18181B" />
              <circle cx="31" cy="17.2" r="2.2" fill="#18181B" />

              {/* Far-Side Wingtip Hint */}
              <path
                d="M -6 1 L -24 -8 L -17 -8 L 4 0 Z"
                fill="#52525B"
                opacity="0.55"
              />

              {/* Tail Fin (Vertical Stabilizer) with Alhind Air Maroon & Gold Livery Accent */}
              <path
                d="M -52 -2 L -70 -31 C -71.5 -33.2 -69.8 -35 -67 -35 L -54 -35 C -51.5 -35 -49.5 -33.6 -48 -31.2 L -31 -2 Z"
                fill="#7C1D26"
              />
              {/* Gold Livery Swoosh on Tail */}
              <path
                d="M -62 -22 C -54 -22 -47 -15 -41 -3 L -47 -3 C -52 -12 -57 -17 -64 -18 Z"
                fill="#D4A359"
              />

              {/* Rear Horizontal Stabilizer */}
              <path
                d="M -46 1 L -62 5 L -55 6.5 L -38 3 Z"
                fill="#27272A"
              />

              {/* Main Fuselage Body */}
              <path
                d="M -56 -3 L 28 -3 C 42 -3 53 1.2 58 4.8 C 60.2 6.4 59.5 8.5 56.2 9.2 C 49.5 10.6 38 11 24 11 L -36 11 C -46 11 -54 7.5 -58 3 C -59.5 1 -58.5 -3 -56 -3 Z"
                fill="#18181B"
              />

              {/* Cockpit Window Detail */}
              <path
                d="M 41 -0.2 L 49.5 2.4 L 42.5 3.2 L 38.5 1.2 Z"
                fill="#FAF9F6"
                opacity="0.88"
              />

              {/* Subtle Cabin Window Strip */}
              <line
                x1="-28"
                y1="2.2"
                x2="26"
                y2="2.2"
                stroke="#FAF9F6"
                strokeOpacity="0.55"
                strokeWidth="1.3"
                strokeDasharray="1.5 4.2"
                strokeLinecap="round"
              />

              {/* Swept Main Wing & Engine Nacelle */}
              <path
                d="M -14 4 L -34 14.5 C -35.5 15.2 -34.8 16.5 -33 16.3 L 8 7.5 Z"
                fill="#3F3F46"
              />
              {/* Under-Wing Jet Engine */}
              <rect
                x="-6"
                y="9.2"
                width="13"
                height="4.6"
                rx="2.3"
                fill="#27272A"
              />
              <line
                x1="7"
                y1="10"
                x2="7"
                y2="13"
                stroke="#D4A359"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </motion.g>
          </svg>
        </div>

        {/* Progress Indicator */}
        <div className="relative z-10 w-full mt-4 flex items-center justify-center">
          {/* Minimal Progress Bar */}
          <div className="w-24 sm:w-32 h-1 rounded-full bg-zinc-200/90 overflow-hidden shrink-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.35 : 1.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformOrigin: "left" }}
              className="w-full h-full bg-[#7C1D26] rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
