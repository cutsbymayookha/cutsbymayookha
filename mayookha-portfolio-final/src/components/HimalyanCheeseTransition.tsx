import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";

interface HimalyanCheeseTransitionProps {
  onComplete: () => void;
  key?: React.Key;
}

const STANDARD_DURATION_MS = 1950;
const REDUCED_MOTION_DURATION_MS = 450;

export function HimalyanCheeseTransition({
  onComplete,
}: HimalyanCheeseTransitionProps) {
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

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 1.015,
        transition: { duration: 0.32, ease: easeApple },
      }}
      transition={{ duration: 0.24, ease: easeApple }}
      role="status"
      aria-live="polite"
      aria-label="Opening Himalyan Cheese project mockups"
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
        transition={{ duration: 0.32, ease: easeApple }}
        className="relative w-full max-w-[660px] rounded-[28px] sm:rounded-[36px] bg-[#FAF9F6]/95 border border-white/80 ring-1 ring-black/[0.06] shadow-[0_32px_90px_-16px_rgba(0,0,0,0.28)] overflow-hidden px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center"
      >
        {/* Subtle Warm Golden Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(250, 204, 21, 0.14) 0%, rgba(250, 249, 246, 0) 62%), radial-gradient(circle at 75% 75%, rgba(234, 179, 8, 0.08) 0%, rgba(250, 249, 246, 0) 55%)",
          }}
        />

        {/* SVG Scene: Artisanal Cheese Wedge Appearing, Softening, Dripping & Melting Away */}
        <div className="relative z-10 w-full aspect-[16/8.5] sm:aspect-[16/7.8] max-h-[250px] rounded-2xl bg-gradient-to-b from-[#FAF8F1] via-[#F6F3E8] to-[#EFEBD9] border border-black/[0.05] overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 640 280"
            className="w-full h-full block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              {/* Top Face Warm Golden Gradient */}
              <linearGradient
                id="cheeseTopGrad"
                x1="200"
                y1="66"
                x2="435"
                y2="132"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="55%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>

              {/* Front Face Rich Cheddar/Artisanal Gold Gradient */}
              <linearGradient
                id="cheeseSideGrad"
                x1="200"
                y1="115"
                x2="440"
                y2="205"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FACC15" />
                <stop offset="60%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              {/* Melted Pool Gradient */}
              <linearGradient
                id="cheesePoolGrad"
                x1="170"
                y1="195"
                x2="470"
                y2="235"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>

              {/* Cheese Hole Inner Depth Gradient */}
              <linearGradient
                id="cheeseHoleGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#A16207" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
            </defs>

            {/* Subtle Surface Horizon Line */}
            <line
              x1="90"
              y1="216"
              x2="550"
              y2="216"
              stroke="#18181B"
              strokeOpacity="0.08"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Soft Ground Shadow Beneath Cheese & Melted Pool */}
            <motion.ellipse
              cx="320"
              cy="220"
              rx="116"
              ry="12"
              fill="#713F12"
              initial={
                prefersReducedMotion
                  ? { scaleX: 1, opacity: 0.1 }
                  : { scaleX: 0.72, scaleY: 0.75, opacity: 0 }
              }
              animate={
                prefersReducedMotion
                  ? { scaleX: 1, opacity: 0.1 }
                  : {
                      scaleX: [0.72, 0.92, 1.32, 1.45],
                      scaleY: [0.75, 0.95, 1.15, 0.85],
                      opacity: [0, 0.12, 0.16, 0],
                    }
              }
              transition={{
                duration: 1.78,
                times: [0, 0.22, 0.76, 1],
                ease: easeApple,
              }}
            />

            {/* Expanding Warm Melted Cheese Pool on the Surface */}
            <motion.g
              style={{ transformOrigin: "320px 214px" }}
              initial={
                prefersReducedMotion
                  ? { scaleX: 1, scaleY: 1, opacity: 0.85 }
                  : { scaleX: 0.45, scaleY: 0.3, opacity: 0 }
              }
              animate={
                prefersReducedMotion
                  ? { scaleX: 1, scaleY: 1, opacity: 0.85 }
                  : {
                      scaleX: [0.45, 0.65, 1.26, 1.42],
                      scaleY: [0.3, 0.6, 1.12, 0.65],
                      opacity: [0, 0.75, 1, 0],
                    }
              }
              transition={{
                duration: 1.78,
                times: [0, 0.28, 0.76, 1],
                ease: easeApple,
              }}
            >
              {/* Primary Melted Pool */}
              <path
                d="M 192 214 C 192 203, 248 197, 320 197 C 392 197, 448 203, 448 214 C 448 224, 396 229, 320 229 C 244 229, 192 224, 192 214 Z"
                fill="url(#cheesePoolGrad)"
              />
              {/* Secondary Glossy Ripple */}
              <ellipse
                cx="314"
                cy="211"
                rx="82"
                ry="6"
                fill="#FEF08A"
                fillOpacity="0.65"
              />
            </motion.g>

            {/* Main Artisanal Cheese Wedge + Melting Drips */}
            <motion.g
              style={{ transformOrigin: "320px 195px" }}
              initial={
                prefersReducedMotion
                  ? { opacity: 0, scale: 0.96, y: 0 }
                  : { opacity: 0, y: -14, scaleX: 0.94, scaleY: 1.03 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : {
                      opacity: [0, 1, 1, 0],
                      y: [-14, 0, 22, 42],
                      scaleX: [0.94, 1, 1.12, 1.22],
                      scaleY: [1.03, 1, 0.68, 0.34],
                    }
              }
              transition={{
                duration: 1.78,
                times: [0, 0.2, 0.74, 1],
                ease: easeApple,
              }}
            >
              {/* 1. Back/Right Rind Accent */}
              <path
                d="M 418 82 L 434 92 L 434 166 C 434 173 428 179 418 181 Z"
                fill="#CA8A04"
              />

              {/* 2. Front Vertical Cheese Face (Softens at bottom corners) */}
              <path
                d="M 212 118 L 424 92 L 424 168 C 424 179 414 186 398 188 L 234 196 C 220 196 212 189 212 177 Z"
                fill="url(#cheeseSideGrad)"
              />

              {/* 3. Top Slanted Triangular Wedge Surface */}
              <path
                d="M 212 118 L 352 64 C 364 60 378 61 389 67 L 424 92 L 212 118 Z"
                fill="url(#cheeseTopGrad)"
              />

              {/* Specular Top Edge Highlight */}
              <path
                d="M 218 116 L 418 92"
                stroke="#FEF9C3"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeOpacity="0.85"
              />

              {/* Characteristic Artisanal Cheese Holes (Eyes) */}
              {/* Hole 1: Top Surface Oval */}
              <ellipse
                cx="346"
                cy="86"
                rx="14"
                ry="6.5"
                transform="rotate(-8 346 86)"
                fill="#EAB308"
              />
              <ellipse
                cx="346"
                cy="87.2"
                rx="11.5"
                ry="4.8"
                transform="rotate(-8 346 87.2)"
                fill="#CA8A04"
                fillOpacity="0.55"
              />

              {/* Hole 2: Front Left Large Eye */}
              <ellipse
                cx="268"
                cy="148"
                rx="16"
                ry="12.5"
                fill="url(#cheeseHoleGrad)"
              />
              <path
                d="M 255 152 C 260 158, 275 158, 281 151"
                stroke="#FEF08A"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeOpacity="0.65"
              />

              {/* Hole 3: Front Center-Right Medium Eye */}
              <ellipse
                cx="342"
                cy="138"
                rx="12.5"
                ry="10"
                fill="url(#cheeseHoleGrad)"
              />
              <path
                d="M 332 142 C 336 146, 347 146, 352 141"
                stroke="#FEF08A"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeOpacity="0.6"
              />

              {/* Hole 4: Front Right Small Eye */}
              <circle
                cx="392"
                cy="128"
                r="7.5"
                fill="url(#cheeseHoleGrad)"
              />

              {/* Hole 5: Lower Left Small Eye */}
              <circle
                cx="306"
                cy="168"
                r="6.5"
                fill="url(#cheeseHoleGrad)"
              />

              {/* Animated Melting Drips Extending Downward from the Bottom Edge */}
              {!prefersReducedMotion && (
                <>
                  {/* Drip 1 (Left-Front) */}
                  <motion.g
                    initial={{ y: -8, scaleY: 0.25 }}
                    animate={{
                      y: [-8, 4, 24, 34],
                      scaleY: [0.25, 0.85, 1.35, 1.5],
                    }}
                    transition={{
                      duration: 1.65,
                      times: [0, 0.32, 0.78, 1],
                      ease: "easeInOut",
                    }}
                    style={{ transformOrigin: "244px 186px" }}
                  >
                    <rect
                      x="235"
                      y="178"
                      width="18"
                      height="34"
                      rx="9"
                      fill="#EAB308"
                    />
                    <circle cx="244" cy="208" r="10.5" fill="#EAB308" />
                    <circle
                      cx="241"
                      cy="206"
                      r="3.2"
                      fill="#FEF08A"
                      fillOpacity="0.65"
                    />
                  </motion.g>

                  {/* Drip 2 (Center-Left Prominent Melt) */}
                  <motion.g
                    initial={{ y: -10, scaleY: 0.2 }}
                    animate={{
                      y: [-10, 6, 28, 38],
                      scaleY: [0.2, 0.95, 1.45, 1.6],
                    }}
                    transition={{
                      duration: 1.65,
                      times: [0, 0.28, 0.76, 1],
                      ease: "easeInOut",
                    }}
                    style={{ transformOrigin: "296px 184px" }}
                  >
                    <rect
                      x="284"
                      y="174"
                      width="24"
                      height="40"
                      rx="12"
                      fill="#FACC15"
                    />
                    <circle cx="296" cy="210" r="13" fill="#EAB308" />
                    <circle
                      cx="292"
                      cy="208"
                      r="4"
                      fill="#FEF08A"
                      fillOpacity="0.7"
                    />
                  </motion.g>

                  {/* Drip 3 (Center-Right Rounded Drip) */}
                  <motion.g
                    initial={{ y: -8, scaleY: 0.2 }}
                    animate={{
                      y: [-8, 2, 24, 34],
                      scaleY: [0.2, 0.8, 1.38, 1.5],
                    }}
                    transition={{
                      duration: 1.65,
                      times: [0, 0.36, 0.8, 1],
                      ease: "easeInOut",
                    }}
                    style={{ transformOrigin: "356px 180px" }}
                  >
                    <rect
                      x="346"
                      y="172"
                      width="20"
                      height="36"
                      rx="10"
                      fill="#EAB308"
                    />
                    <circle cx="356" cy="204" r="11.5" fill="#CA8A04" />
                    <circle cx="355" cy="203" r="10" fill="#EAB308" />
                  </motion.g>

                  {/* Drip 4 (Far Right Subtle Drip) */}
                  <motion.g
                    initial={{ y: -6, scaleY: 0.25 }}
                    animate={{
                      y: [-6, 4, 22, 30],
                      scaleY: [0.25, 0.85, 1.3, 1.4],
                    }}
                    transition={{
                      duration: 1.65,
                      times: [0, 0.3, 0.78, 1],
                      ease: "easeInOut",
                    }}
                    style={{ transformOrigin: "402px 176px" }}
                  >
                    <rect
                      x="394"
                      y="168"
                      width="15"
                      height="32"
                      rx="7.5"
                      fill="#CA8A04"
                    />
                    <circle cx="401.5" cy="197" r="8.5" fill="#CA8A04" />
                  </motion.g>
                </>
              )}
            </motion.g>
          </svg>
        </div>

        {/* Progress Indicator */}
        <div className="relative z-10 w-full mt-4 flex items-center justify-center">
          {/* Minimal Warm Gold Progress Bar */}
          <div className="w-24 sm:w-32 h-1 rounded-full bg-zinc-200/90 overflow-hidden shrink-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.35 : 1.75,
                ease: easeApple,
              }}
              style={{ transformOrigin: "left" }}
              className="w-full h-full bg-amber-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
