import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { resolveAssetUrl } from "../data/portfolioAssets";

interface PaperBoatSwingTransitionProps {
  onComplete: () => void;
  key?: React.Key;
}

const STANDARD_DURATION_MS = 2750;
const REDUCED_MOTION_DURATION_MS = 520;

export function PaperBoatSwingTransition({
  onComplete,
}: PaperBoatSwingTransitionProps) {
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
  const easeSplit: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const mangoLabelUrl = resolveAssetUrl(
    "/Can-vas- Paper Boat Swing Design 2.jpeg"
  );
  const guavaLabelUrl = resolveAssetUrl(
    "/Can-vas- Paper Boat Swing Design 3.jpeg"
  );

  // Floating mango juice droplets around left can center (205, 142)
  const mangoDroplets = [
    { id: "m-d1", dx: -76, dy: -34, r: 4.8, rot: -28, delay: 0.56 },
    { id: "m-d2", dx: -88, dy: 6, r: 3.6, rot: -52, delay: 0.62 },
    { id: "m-d3", dx: 74, dy: -28, r: 4.5, rot: 32, delay: 0.58 },
    { id: "m-d4", dx: 84, dy: 14, r: 3.4, rot: 48, delay: 0.64 },
    { id: "m-d5", dx: -48, dy: -46, r: 3.2, rot: -18, delay: 0.6 },
    { id: "m-d6", dx: 52, dy: 34, r: 3.8, rot: 22, delay: 0.66 },
  ];

  // Floating guava juice droplets around right can center (435, 142)
  const guavaDroplets = [
    { id: "g-d1", dx: -74, dy: -30, r: 4.5, rot: -30, delay: 0.58 },
    { id: "g-d2", dx: -84, dy: 12, r: 3.5, rot: -48, delay: 0.64 },
    { id: "g-d3", dx: 78, dy: -34, r: 4.8, rot: 34, delay: 0.56 },
    { id: "g-d4", dx: 88, dy: 8, r: 3.6, rot: 54, delay: 0.62 },
    { id: "g-d5", dx: 48, dy: -46, r: 3.2, rot: 18, delay: 0.6 },
    { id: "g-d6", dx: -52, dy: 32, r: 3.8, rot: -24, delay: 0.66 },
  ];

  // Renders the authentic Paper Boat Swing Can Body (used inside both Upper and Lower equal halves)
  const renderCanArtwork = (variant: "mango" | "guava") => {
    const isMango = variant === "mango";
    const cx = isMango ? 205 : 435;
    const xLeft = cx - 54;
    const xRight = cx + 54;
    const canTop = 52;
    const canBottom = 232;
    const canWidth = 108;
    const canHeight = 180;

    return (
      <g>
        {/* Base Warm Cream Matte Can Cylinder */}
        <rect
          x={xLeft}
          y={canTop}
          width={canWidth}
          height={canHeight}
          rx="12"
          fill="url(#pbCanBaseGrad)"
        />

        {/* Actual Supplied Label Artwork Cropped to Front Can Face */}
        <image
          href={isMango ? mangoLabelUrl : guavaLabelUrl}
          x={cx - 166}
          y={canTop - 6}
          width="332"
          height={canHeight + 14}
          preserveAspectRatio="xMidYMid slice"
          clipPath={
            isMango ? "url(#mangoCanBodyClip)" : "url(#guavaCanBodyClip)"
          }
          opacity="0.96"
        />

        {/* 3D Cylindrical Shading & Specular Highlights Overlay */}
        <rect
          x={xLeft}
          y={canTop}
          width={canWidth}
          height={canHeight}
          rx="12"
          fill="url(#pbCylinderShadeGrad)"
          style={{ mixBlendMode: "multiply" }}
        />
        <rect
          x={xLeft + 14}
          y={canTop}
          width="16"
          height={canHeight}
          fill="url(#pbSpecularStripGrad)"
        />

        {/* Metallic Brushed Aluminium Top Crown & Rim (Visible on Upper Half) */}
        <path
          d={`M ${xLeft + 7} ${canTop + 5} L ${xLeft + 12} ${canTop - 3} L ${xRight - 12} ${canTop - 3} L ${xRight - 7} ${canTop + 5} Z`}
          fill="url(#pbMetalRimGrad)"
        />
        <ellipse
          cx={cx}
          cy={canTop - 3}
          rx={canWidth / 2 - 11}
          ry="4.2"
          fill="url(#pbMetalRimGrad)"
          stroke="#A1A1AA"
          strokeWidth="0.7"
        />
        <ellipse
          cx={cx}
          cy={canTop - 3.2}
          rx={canWidth / 2 - 16}
          ry="2.5"
          fill="#E4E4E7"
        />
        {/* Subtle Pull-Tab Accent on Top Lid */}
        <ellipse
          cx={cx - 4}
          cy={canTop - 3.2}
          rx="7"
          ry="1.3"
          fill="none"
          stroke="#71717A"
          strokeWidth="0.8"
        />

        {/* Metallic Brushed Aluminium Bottom Base Rim (Visible on Lower Half) */}
        <path
          d={`M ${xLeft + 7} ${canBottom - 4} L ${xLeft + 12} ${canBottom + 3} L ${xRight - 12} ${canBottom + 3} L ${xRight - 7} ${canBottom - 4} Z`}
          fill="url(#pbMetalRimGrad)"
        />
        <ellipse
          cx={cx}
          cy={canBottom + 3}
          rx={canWidth / 2 - 12}
          ry="3.6"
          fill="url(#pbMetalRimGrad)"
        />

        {/* Dewy Condensation Water Droplets on Can Surface */}
        <g fill="#FFFFFF" fillOpacity="0.65">
          <circle cx={xLeft + 12} cy={canTop + 26} r="1.3" />
          <circle cx={xLeft + 18} cy={canTop + 44} r="1.8" />
          <circle cx={xRight - 14} cy={canTop + 32} r="1.5" />
          <circle cx={xRight - 19} cy={canTop + 66} r="1.2" />
          <circle cx={xLeft + 15} cy={canTop + 118} r="1.6" />
          <circle cx={xRight - 15} cy={canTop + 132} r="1.7" />
          <circle cx={xLeft + 22} cy={canTop + 152} r="1.2" />
          <circle cx={xRight - 22} cy={canTop + 158} r="1.3" />
        </g>

        {/* Crisp Outer Cylinder Edge Contour */}
        <rect
          x={xLeft}
          y={canTop}
          width={canWidth}
          height={canHeight}
          rx="12"
          fill="none"
          stroke="#D4D0C4"
          strokeWidth="0.9"
          strokeOpacity="0.7"
        />
      </g>
    );
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 1.015,
        transition: { duration: 0.34, ease: easeApple },
      }}
      transition={{ duration: 0.24, ease: easeApple }}
      role="status"
      aria-live="polite"
      aria-label="Opening Can-vas- Paper Boat Swing project mockups"
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-zinc-950/40 backdrop-blur-2xl select-none overflow-hidden"
    >
      {/* Compact Studio Presentation Stage */}
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
        className="relative w-full max-w-[700px] rounded-[28px] sm:rounded-[36px] bg-[#FAF9F6]/95 border border-white/80 ring-1 ring-black/[0.06] shadow-[0_32px_90px_-16px_rgba(0,0,0,0.32)] overflow-hidden px-5 sm:px-8 md:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center"
      >
        {/* Subtle Orchard-Green & Tropical Fruit Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 32% 42%, rgba(250, 204, 21, 0.14) 0%, rgba(250, 249, 246, 0) 58%), radial-gradient(circle at 68% 42%, rgba(132, 204, 22, 0.16) 0%, rgba(250, 249, 246, 0) 58%)",
          }}
        />

        {/* SVG Scene: Vibrant Green Studio Environment + Two Split-Can Reveals (Mango & Guava) */}
        <div className="relative z-10 w-full aspect-[16/9] sm:aspect-[16/8.2] max-h-[280px] rounded-2xl border border-black/[0.08] overflow-hidden flex items-center justify-center shadow-inner">
          <svg
            viewBox="0 0 640 284"
            className="w-full h-full block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              {/* Fresh Vibrant Green Product-Presentation Backdrop inspired by Reference Image */}
              <radialGradient
                id="pbGreenStudioBg"
                cx="50%"
                cy="42%"
                r="68%"
              >
                <stop offset="0%" stopColor="#84CC16" />
                <stop offset="38%" stopColor="#4D7C0F" />
                <stop offset="76%" stopColor="#1E4620" />
                <stop offset="100%" stopColor="#0F2912" />
              </radialGradient>

              {/* Warm Sunlit Canopy Glow */}
              <radialGradient
                id="pbSunlitGlow"
                cx="50%"
                cy="30%"
                r="48%"
              >
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.42" />
                <stop offset="55%" stopColor="#A3E635" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#1E4620" stopOpacity="0" />
              </radialGradient>

              {/* Base Can Cream-Ivory Gradient */}
              <linearGradient
                id="pbCanBaseGrad"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#DFDBD0" />
                <stop offset="22%" stopColor="#F8F6F0" />
                <stop offset="55%" stopColor="#F5F2EA" />
                <stop offset="85%" stopColor="#E6E2D6" />
                <stop offset="100%" stopColor="#CFC9B8" />
              </linearGradient>

              {/* 3D Cylindrical Shading Overlay */}
              <linearGradient
                id="pbCylinderShadeGrad"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#B8B2A2" stopOpacity="0.55" />
                <stop offset="18%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="74%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="100%" stopColor="#9E9786" stopOpacity="0.65" />
              </linearGradient>

              {/* Vertical Specular Reflection Highlight */}
              <linearGradient
                id="pbSpecularStripGrad"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* Brushed Aluminium Rim Gradient */}
              <linearGradient
                id="pbMetalRimGrad"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#71717A" />
                <stop offset="24%" stopColor="#F4F4F5" />
                <stop offset="50%" stopColor="#D4D4D8" />
                <stop offset="78%" stopColor="#FAFAFA" />
                <stop offset="100%" stopColor="#52525B" />
              </linearGradient>

              {/* Rich Mango Flesh & Juice Gradients */}
              <linearGradient
                id="pbMangoFleshGrad"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#FBBF24" />
                <stop offset="75%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient
                id="pbMangoCubeSideGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* Fresh Guava Coral-Pink Interior & Green Rind Gradients */}
              <radialGradient
                id="pbGuavaFleshGrad"
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="62%" stopColor="#F43F5E" />
                <stop offset="86%" stopColor="#FDA4AF" />
                <stop offset="100%" stopColor="#ECFCCB" />
              </radialGradient>

              <linearGradient
                id="pbGuavaRindGrad"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="55%" stopColor="#65A30D" />
                <stop offset="100%" stopColor="#3F6212" />
              </linearGradient>

              {/* Rounded Can Body Clip Paths */}
              <clipPath id="mangoCanBodyClip">
                <rect x="151" y="52" width="108" height="180" rx="12" />
              </clipPath>
              <clipPath id="guavaCanBodyClip">
                <rect x="381" y="52" width="108" height="180" rx="12" />
              </clipPath>

              {/* Equal Horizontal Split Clip Paths (Midline at y = 142) */}
              {/* Left Can (Mango): Upper Half (y: 36..142) and Lower Half (y: 142..248) */}
              <clipPath id="mangoUpperHalfClip">
                <rect x="135" y="36" width="140" height="106" />
              </clipPath>
              <clipPath id="mangoLowerHalfClip">
                <rect x="135" y="142" width="140" height="106" />
              </clipPath>

              {/* Right Can (Guava): Upper Half (y: 36..142) and Lower Half (y: 142..248) */}
              <clipPath id="guavaUpperHalfClip">
                <rect x="365" y="36" width="140" height="106" />
              </clipPath>
              <clipPath id="guavaLowerHalfClip">
                <rect x="365" y="142" width="140" height="106" />
              </clipPath>
            </defs>

            {/* 1. Fresh Studio Green Product Backdrop */}
            <rect width="640" height="284" fill="url(#pbGreenStudioBg)" />
            <rect width="640" height="284" fill="url(#pbSunlitGlow)" />

            {/* Soft Botanical Bokeh Light Circles in Background */}
            <g opacity="0.22">
              <circle cx="92" cy="64" r="34" fill="#BEF264" />
              <circle cx="556" cy="58" r="42" fill="#A3E635" />
              <circle cx="320" cy="44" r="26" fill="#FEF08A" />
              <circle cx="76" cy="218" r="28" fill="#4D7C0F" />
              <circle cx="568" cy="222" r="32" fill="#65A30D" />
            </g>

            {/* Studio Ground Pedestal Shadows Beneath Both Cans */}
            <motion.ellipse
              cx="205"
              cy="252"
              rx="64"
              ry="10"
              fill="#051408"
              initial={
                prefersReducedMotion
                  ? { opacity: 0.42, scaleX: 1 }
                  : { opacity: 0, scaleX: 0.7 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 0.42, scaleX: 1 }
                  : {
                      opacity: [0, 0.46, 0.34, 0.34, 0],
                      scaleX: [0.7, 1, 1.16, 1.16, 0.85],
                    }
              }
              transition={{
                duration: 2.6,
                times: [0, 0.18, 0.42, 0.86, 1],
                ease: easeApple,
              }}
            />
            <motion.ellipse
              cx="435"
              cy="252"
              rx="64"
              ry="10"
              fill="#051408"
              initial={
                prefersReducedMotion
                  ? { opacity: 0.42, scaleX: 1 }
                  : { opacity: 0, scaleX: 0.7 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 0.42, scaleX: 1 }
                  : {
                      opacity: [0, 0.46, 0.34, 0.34, 0],
                      scaleX: [0.7, 1, 1.16, 1.16, 0.85],
                    }
              }
              transition={{
                duration: 2.6,
                times: [0, 0.18, 0.42, 0.86, 1],
                ease: easeApple,
              }}
            />

            {/* ================================================================= */}
            {/* LEFT CAN (SLURPY MANGO): INTRO -> HORIZONTAL SPLIT -> MANGO REVEAL */}
            {/* ================================================================= */}
            <motion.g
              style={{ transformOrigin: "205px 142px" }}
              initial={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, y: 26, scale: 0.9 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : {
                      opacity: [0, 1, 1, 1, 0],
                      y: [26, 0, 0, 0, -10],
                      scale: [0.9, 1, 1, 1.02, 0.96],
                    }
              }
              transition={{
                duration: 2.62,
                times: [0, 0.18, 0.45, 0.86, 1],
                ease: easeApple,
              }}
            >
              {/* SCENE 2 & 3: LOWER HALF OF MANGO CAN (Moves slightly downwards) */}
              <motion.g
                style={{ transformOrigin: "205px 142px" }}
                initial={{ y: 0, rotate: 0 }}
                animate={
                  prefersReducedMotion
                    ? { y: 26, rotate: 0 }
                    : {
                        y: [0, 0, 30, 32, 26],
                        rotate: [0, 0, 1.4, 1.6, 0.8],
                      }
                }
                transition={{
                  duration: 2.55,
                  times: [0, 0.2, 0.42, 0.85, 1],
                  ease: easeSplit,
                }}
              >
                {/* 3D Open Rim Cross-Section on Top of Lower Can Half */}
                <ellipse
                  cx="205"
                  cy="142"
                  rx="54"
                  ry="8.5"
                  fill="#B45309"
                  stroke="#E4E4E7"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="205"
                  cy="142.5"
                  rx="50"
                  ry="6.5"
                  fill="url(#pbMangoFleshGrad)"
                />
                <g clipPath="url(#mangoLowerHalfClip)">
                  {renderCanArtwork("mango")}
                </g>
                {/* Crisp Split Rim Lip on Front Edge of Lower Half */}
                <path
                  d="M 151 142 Q 205 149 259 142"
                  stroke="#F4F4F5"
                  strokeWidth="1.6"
                  fill="none"
                />
              </motion.g>

              {/* SCENE 3: FRESH MANGO REVEAL INSIDE THE SPLIT MANGO CAN */}
              <motion.g
                style={{ transformOrigin: "205px 142px" }}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.32 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: [0, 0, 1, 1, 0],
                        scale: [0.32, 0.35, 1.04, 1.08, 0.88],
                      }
                }
                transition={{
                  duration: 2.55,
                  times: [0, 0.21, 0.44, 0.85, 1],
                  ease: easeSplit,
                }}
              >
                {/* Golden Mango Juice Splash Ribbons Behind Fruit */}
                <path
                  d="M 134 146 C 148 122, 174 114, 205 118 C 236 114, 262 124, 276 144 C 258 164, 232 172, 205 170 C 176 172, 150 162, 134 146 Z"
                  fill="#F59E0B"
                  fillOpacity="0.28"
                />
                <path
                  d="M 142 136 C 162 118, 182 126, 168 106 C 186 112, 198 124, 205 124 C 214 124, 226 110, 244 106 C 230 124, 248 120, 268 138 C 246 148, 226 158, 205 158 C 184 158, 164 148, 142 136 Z"
                  fill="url(#pbMangoFleshGrad)"
                />

                {/* Orchard Green Mango Leaf Accents */}
                <path
                  d="M 152 136 C 132 124, 122 134, 134 148 C 144 156, 158 148, 164 142 Z"
                  fill="#4D7C0F"
                />
                <path
                  d="M 254 134 C 272 122, 284 132, 272 146 C 262 154, 248 148, 242 140 Z"
                  fill="#65A30D"
                />

                {/* Back Ripe Curved Mango Cheek Slice */}
                <path
                  d="M 160 144 C 166 114, 244 114, 250 144 C 240 162, 170 162, 160 144 Z"
                  fill="url(#pbMangoFleshGrad)"
                  stroke="#FEF08A"
                  strokeWidth="1.2"
                />

                {/* Signature Scored "Hedgehog" Mango Cubes Cluster (3D Diced Mango Flesh) */}
                <motion.g
                  animate={
                    prefersReducedMotion
                      ? { y: 0 }
                      : { y: [2, -3.5, 1.5, -2] }
                  }
                  transition={{
                    duration: 1.8,
                    delay: 0.55,
                     ease: "easeInOut",
                  }}
                >
                  {/* Row 1 Upper Mango Cubes */}
                  <g transform="translate(172, 118) rotate(-10)">
                    <polygon
                      points="0,8 14,0 26,7 12,15"
                      fill="#FEF08A"
                    />
                    <polygon
                      points="0,8 12,15 12,27 0,20"
                      fill="url(#pbMangoFleshGrad)"
                    />
                    <polygon
                      points="12,15 26,7 26,19 12,27"
                      fill="url(#pbMangoCubeSideGrad)"
                    />
                  </g>

                  <g transform="translate(194, 113) rotate(2)">
                    <polygon
                      points="0,8 15,0 28,7 13,15"
                      fill="#FEF9C3"
                    />
                    <polygon
                      points="0,8 13,15 13,29 0,22"
                      fill="url(#pbMangoFleshGrad)"
                    />
                    <polygon
                      points="13,15 28,7 28,21 13,29"
                      fill="url(#pbMangoCubeSideGrad)"
                    />
                  </g>

                  <g transform="translate(218, 118) rotate(12)">
                    <polygon
                      points="0,7 14,0 25,6 11,14"
                      fill="#FEF08A"
                    />
                    <polygon
                      points="0,7 11,14 11,26 0,19"
                      fill="url(#pbMangoFleshGrad)"
                    />
                    <polygon
                      points="11,14 25,6 25,18 11,26"
                      fill="url(#pbMangoCubeSideGrad)"
                    />
                  </g>

                  {/* Row 2 Foreground Plump Mango Cubes */}
                  <g transform="translate(162, 132) rotate(-16)">
                    <polygon
                      points="0,7 13,0 24,6 11,13"
                      fill="#FDE047"
                    />
                    <polygon
                      points="0,7 11,13 11,25 0,18"
                      fill="#F59E0B"
                    />
                    <polygon
                      points="11,13 24,6 24,18 11,25"
                      fill="#D97706"
                    />
                  </g>

                  <g transform="translate(183, 129) rotate(-4)">
                    <polygon
                      points="0,8 15,0 28,8 13,16"
                      fill="#FEF08A"
                    />
                    <polygon
                      points="0,8 13,16 13,30 0,22"
                      fill="url(#pbMangoFleshGrad)"
                    />
                    <polygon
                      points="13,16 28,8 28,22 13,30"
                      fill="url(#pbMangoCubeSideGrad)"
                    />
                  </g>

                  <g transform="translate(207, 129) rotate(6)">
                    <polygon
                      points="0,8 15,0 28,8 13,16"
                      fill="#FEF08A"
                    />
                    <polygon
                      points="0,8 13,16 13,30 0,22"
                      fill="url(#pbMangoFleshGrad)"
                    />
                    <polygon
                      points="13,16 28,8 28,22 13,30"
                      fill="url(#pbMangoCubeSideGrad)"
                    />
                  </g>

                  <g transform="translate(229, 133) rotate(16)">
                    <polygon
                      points="0,7 13,0 24,6 11,13"
                      fill="#FDE047"
                    />
                    <polygon
                      points="0,7 11,13 11,25 0,18"
                      fill="#F59E0B"
                    />
                    <polygon
                      points="11,13 24,6 24,18 11,25"
                      fill="#D97706"
                    />
                  </g>

                  {/* Floating Detached Mango Cube Above Left */}
                  <g transform="translate(142, 108) rotate(-24) scale(0.78)">
                    <polygon points="0,7 13,0 24,6 11,13" fill="#FEF08A" />
                    <polygon points="0,7 11,13 11,24 0,17" fill="#FBBF24" />
                    <polygon points="11,13 24,6 24,17 11,24" fill="#D97706" />
                  </g>

                  {/* Floating Detached Mango Cube Above Right */}
                  <g transform="translate(250, 110) rotate(22) scale(0.76)">
                    <polygon points="0,7 13,0 24,6 11,13" fill="#FEF08A" />
                    <polygon points="0,7 11,13 11,24 0,17" fill="#FBBF24" />
                    <polygon points="11,13 24,6 24,17 11,24" fill="#D97706" />
                  </g>
                </motion.g>
              </motion.g>

              {/* Floating Mango Juice Droplets */}
              {!prefersReducedMotion &&
                mangoDroplets.map((d) => (
                  <motion.g
                    key={d.id}
                    initial={{ x: 205, y: 142, scale: 0, opacity: 0 }}
                    animate={{
                      x: [205, 205 + d.dx * 0.85, 205 + d.dx],
                      y: [142, 142 + d.dy * 0.85, 142 + d.dy - 4],
                      scale: [0, 1.05, 0.85],
                      rotate: [0, d.rot, d.rot * 1.15],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.75,
                      delay: d.delay,
                      times: [0, 0.38, 1],
                      ease: easeSplit,
                    }}
                  >
                    <path
                      d={`M 0 ${-d.r * 1.4} C ${d.r} ${-d.r * 0.3}, ${d.r} ${d.r * 0.9}, 0 ${d.r * 1.2} C ${-d.r} ${d.r * 0.9}, ${-d.r} ${-d.r * 0.3}, 0 ${-d.r * 1.4} Z`}
                      fill="url(#pbMangoFleshGrad)"
                    />
                    <circle
                      cx={-d.r * 0.25}
                      cy={d.r * 0.2}
                      r={d.r * 0.25}
                      fill="#FEF9C3"
                    />
                  </motion.g>
                ))}

              {/* SCENE 2 & 3: UPPER HALF OF MANGO CAN (Moves smoothly upwards) */}
              <motion.g
                style={{ transformOrigin: "205px 142px" }}
                initial={{ y: 0, rotate: 0 }}
                animate={
                  prefersReducedMotion
                    ? { y: -34, rotate: 0 }
                    : {
                        y: [0, 0, -38, -42, -34],
                        rotate: [0, 0, -2.2, -2.5, -1.2],
                      }
                }
                transition={{
                  duration: 2.55,
                  times: [0, 0.2, 0.42, 0.85, 1],
                  ease: easeSplit,
                }}
              >
                {/* Subtle Inner Rim Depth on Bottom of Lifted Upper Can Half */}
                <ellipse
                  cx="205"
                  cy="142"
                  rx="54"
                  ry="6.5"
                  fill="#D4D4D8"
                />
                <ellipse
                  cx="205"
                  cy="142"
                  rx="50"
                  ry="4.8"
                  fill="#78350F"
                  fillOpacity="0.45"
                />
                <g clipPath="url(#mangoUpperHalfClip)">
                  {renderCanArtwork("mango")}
                </g>
                {/* Clean Horizontal Split Seam Highlight on Upper Half Bottom Edge */}
                <path
                  d="M 151 142 Q 205 146 259 142"
                  stroke="#FAFAFA"
                  strokeWidth="1.5"
                  fill="none"
                />
              </motion.g>
            </motion.g>

            {/* ================================================================= */}
            {/* RIGHT CAN (YUMMY GUAVA): INTRO -> HORIZONTAL SPLIT -> GUAVA REVEAL */}
            {/* ================================================================= */}
            <motion.g
              style={{ transformOrigin: "435px 142px" }}
              initial={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, y: 26, scale: 0.9 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : {
                      opacity: [0, 1, 1, 1, 0],
                      y: [26, 0, 0, 0, -10],
                      scale: [0.9, 1, 1, 1.02, 0.96],
                    }
              }
              transition={{
                duration: 2.62,
                delay: prefersReducedMotion ? 0 : 0.04,
                times: [0, 0.18, 0.45, 0.86, 1],
                ease: easeApple,
              }}
            >
              {/* SCENE 2 & 3: LOWER HALF OF GUAVA CAN (Moves slightly downwards) */}
              <motion.g
                style={{ transformOrigin: "435px 142px" }}
                initial={{ y: 0, rotate: 0 }}
                animate={
                  prefersReducedMotion
                    ? { y: 26, rotate: 0 }
                    : {
                        y: [0, 0, 30, 32, 26],
                        rotate: [0, 0, -1.4, -1.6, -0.8],
                      }
                }
                transition={{
                  duration: 2.55,
                  times: [0, 0.2, 0.42, 0.85, 1],
                  ease: easeSplit,
                }}
              >
                {/* 3D Open Rim Cross-Section on Top of Lower Can Half */}
                <ellipse
                  cx="435"
                  cy="142"
                  rx="54"
                  ry="8.5"
                  fill="#BE123C"
                  stroke="#E4E4E7"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="435"
                  cy="142.5"
                  rx="50"
                  ry="6.5"
                  fill="#FB7185"
                />
                <g clipPath="url(#guavaLowerHalfClip)">
                  {renderCanArtwork("guava")}
                </g>
                {/* Crisp Split Rim Lip on Front Edge of Lower Half */}
                <path
                  d="M 381 142 Q 435 149 489 142"
                  stroke="#F4F4F5"
                  strokeWidth="1.6"
                  fill="none"
                />
              </motion.g>

              {/* SCENE 3: FRESH PINK GUAVA REVEAL INSIDE THE SPLIT GUAVA CAN */}
              <motion.g
                style={{ transformOrigin: "435px 142px" }}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.32 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: [0, 0, 1, 1, 0],
                        scale: [0.32, 0.35, 1.04, 1.08, 0.88],
                      }
                }
                transition={{
                  duration: 2.55,
                  times: [0, 0.21, 0.44, 0.85, 1],
                  ease: easeSplit,
                }}
              >
                {/* Coral-Pink & Tropical Green Guava Splash Ribbons Behind Fruit */}
                <path
                  d="M 364 146 C 378 120, 404 114, 435 118 C 466 114, 492 122, 506 144 C 488 164, 462 172, 435 170 C 406 172, 380 162, 364 146 Z"
                  fill="#F43F5E"
                  fillOpacity="0.26"
                />
                <path
                  d="M 372 138 C 392 118, 412 126, 398 106 C 416 112, 428 124, 435 124 C 444 124, 456 110, 474 106 C 460 124, 478 120, 498 138 C 476 148, 456 158, 435 158 C 414 158, 394 148, 372 138 Z"
                  fill="#FB7185"
                />

                {/* Fresh Veined Guava Leaves */}
                <path
                  d="M 384 134 C 362 120, 350 132, 364 148 C 374 156, 390 148, 396 140 Z"
                  fill="#65A30D"
                />
                <path
                  d="M 484 134 C 504 120, 516 132, 504 148 C 494 156, 478 148, 472 140 Z"
                  fill="#4D7C0F"
                />

                {/* Floating Guava Slices & Halved Pink Guava with Seed-Filled Interior */}
                <motion.g
                  animate={
                    prefersReducedMotion
                      ? { y: 0 }
                      : { y: [2, -3.5, 1.5, -2] }
                  }
                  transition={{
                    duration: 1.8,
                    delay: 0.58,
                    ease: "easeInOut",
                  }}
                >
                  {/* Left Tilted Pink Guava Wedge Slice */}
                  <g transform="translate(395, 134) rotate(-22)">
                    <path
                      d="M -22 0 A 22 20 0 0 0 22 0 Z"
                      fill="url(#pbGuavaRindGrad)"
                    />
                    <path
                      d="M -19 -1 A 19 17 0 0 0 19 -1 Z"
                      fill="#ECFCCB"
                    />
                    <path
                      d="M -16 -2 A 16 14 0 0 0 16 -2 Z"
                      fill="#FB7185"
                    />
                  </g>

                  {/* Right Tilted Pink Guava Wedge Slice */}
                  <g transform="translate(475, 134) rotate(22)">
                    <path
                      d="M -22 0 A 22 20 0 0 0 22 0 Z"
                      fill="url(#pbGuavaRindGrad)"
                    />
                    <path
                      d="M -19 -1 A 19 17 0 0 0 19 -1 Z"
                      fill="#ECFCCB"
                    />
                    <path
                      d="M -16 -2 A 16 14 0 0 0 16 -2 Z"
                      fill="#FB7185"
                    />
                  </g>

                  {/* Center Hero Halved Pink Guava with Authentic Seed-Filled Interior */}
                  <g transform="translate(435, 138)">
                    {/* Outer Apple-Green Guava Rind */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="28"
                      ry="23"
                      fill="url(#pbGuavaRindGrad)"
                    />
                    {/* Creamy Pale-Green Inner Rind Cortex */}
                    <ellipse
                      cx="0"
                      cy="-0.8"
                      rx="24.5"
                      ry="19.5"
                      fill="#ECFCCB"
                    />
                    {/* Lush Coral-Pink Guava Flesh */}
                    <ellipse
                      cx="0"
                      cy="-1"
                      rx="21.5"
                      ry="16.8"
                      fill="url(#pbGuavaFleshGrad)"
                    />
                    {/* Deeper Rose Core Chambers */}
                    <ellipse
                      cx="0"
                      cy="-1"
                      rx="14"
                      ry="10.5"
                      fill="#E11D48"
                      fillOpacity="0.35"
                    />
                    {/* Natural Radial Carpel Lines */}
                    <path
                      d="M -12 -1 L 12 -1 M 0 -10 L 0 8 M -9 -7 L 9 5 M -9 5 L 9 -7"
                      stroke="#FFE4E6"
                      strokeWidth="0.9"
                      strokeOpacity="0.55"
                      strokeLinecap="round"
                    />
                    {/* Natural Golden-Cream Guava Seeds Arranged in Ring */}
                    {[
                      { sx: -9, sy: -4 },
                      { sx: -6, sy: -7 },
                      { sx: 0, sy: -8 },
                      { sx: 6, sy: -7 },
                      { sx: 9, sy: -4 },
                      { sx: 10, sy: 1 },
                      { sx: 7, sy: 5 },
                      { sx: 2, sy: 6 },
                      { sx: -3, sy: 6 },
                      { sx: -8, sy: 4 },
                      { sx: -10, sy: 0 },
                      { sx: -4, sy: -2 },
                      { sx: 4, sy: -2 },
                      { sx: 0, sy: 2 },
                    ].map((seed, idx) => (
                      <circle
                        key={idx}
                        cx={seed.sx}
                        cy={seed.sy}
                        r="1.35"
                        fill="#FEF08A"
                        stroke="#E11D48"
                        strokeWidth="0.35"
                      />
                    ))}
                    {/* Glossy Highlight Arc on Guava Flesh */}
                    <path
                      d="M -14 -10 Q 0 -15 14 -10"
                      stroke="#FFF1F2"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeOpacity="0.7"
                      fill="none"
                    />
                  </g>
                </motion.g>
              </motion.g>

              {/* Floating Coral-Pink & Green Guava Juice Droplets */}
              {!prefersReducedMotion &&
                guavaDroplets.map((d, i) => (
                  <motion.g
                    key={d.id}
                    initial={{ x: 435, y: 142, scale: 0, opacity: 0 }}
                    animate={{
                      x: [435, 435 + d.dx * 0.85, 435 + d.dx],
                      y: [142, 142 + d.dy * 0.85, 142 + d.dy - 4],
                      scale: [0, 1.05, 0.85],
                      rotate: [0, d.rot, d.rot * 1.15],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.75,
                      delay: d.delay,
                      times: [0, 0.38, 1],
                      ease: easeSplit,
                    }}
                  >
                    <path
                      d={`M 0 ${-d.r * 1.4} C ${d.r} ${-d.r * 0.3}, ${d.r} ${d.r * 0.9}, 0 ${d.r * 1.2} C ${-d.r} ${d.r * 0.9}, ${-d.r} ${-d.r * 0.3}, 0 ${-d.r * 1.4} Z`}
                      fill={i % 3 === 0 ? "#84CC16" : "#FB7185"}
                    />
                    <circle
                      cx={-d.r * 0.25}
                      cy={d.r * 0.2}
                      r={d.r * 0.25}
                      fill="#FFF1F2"
                    />
                  </motion.g>
                ))}

              {/* SCENE 2 & 3: UPPER HALF OF GUAVA CAN (Moves smoothly upwards) */}
              <motion.g
                style={{ transformOrigin: "435px 142px" }}
                initial={{ y: 0, rotate: 0 }}
                animate={
                  prefersReducedMotion
                    ? { y: -34, rotate: 0 }
                    : {
                        y: [0, 0, -38, -42, -34],
                        rotate: [0, 0, 2.2, 2.5, 1.2],
                      }
                }
                transition={{
                  duration: 2.55,
                  times: [0, 0.2, 0.42, 0.85, 1],
                  ease: easeSplit,
                }}
              >
                {/* Subtle Inner Rim Depth on Bottom of Lifted Upper Can Half */}
                <ellipse
                  cx="435"
                  cy="142"
                  rx="54"
                  ry="6.5"
                  fill="#D4D4D8"
                />
                <ellipse
                  cx="435"
                  cy="142"
                  rx="50"
                  ry="4.8"
                  fill="#881337"
                  fillOpacity="0.45"
                />
                <g clipPath="url(#guavaUpperHalfClip)">
                  {renderCanArtwork("guava")}
                </g>
                {/* Clean Horizontal Split Seam Highlight on Upper Half Bottom Edge */}
                <path
                  d="M 381 142 Q 435 146 489 142"
                  stroke="#FAFAFA"
                  strokeWidth="1.5"
                  fill="none"
                />
              </motion.g>
            </motion.g>
          </svg>
        </div>

        {/* Minimal Progress Bar (Zero extra text or captions) */}
        <div className="relative z-10 w-full mt-4 flex items-center justify-center">
          <div className="w-24 sm:w-32 h-1 rounded-full bg-zinc-200/90 overflow-hidden shrink-0">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.4 : 2.55,
                ease: easeApple,
              }}
              style={{ transformOrigin: "left" }}
              className="w-full h-full bg-gradient-to-r from-amber-500 via-lime-500 to-rose-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
