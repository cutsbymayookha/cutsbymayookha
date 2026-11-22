import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  FILM_ROLL_FRAMES,
  projects,
  resolveAssetUrl,
} from "../data/portfolioAssets";
import { preloadAndDecodeImage } from "./Work";

export type FilmRollAnimationStatus = "idle" | "queued" | "playing" | "completed";

export interface FilmRollShowcaseProps {
  animationStatus: FilmRollAnimationStatus;
  runId: number;
  onComplete: () => void;
}

const TOTAL_DURATION_SEC = 15.0;
const TOTAL_DURATION_MS = 15000;

/**
 * Exact polygon isolating the upper-right curved perforated film strip (x >= 18.5%)
 * from the stationary left "Cuts by Mayookha" canister (x < 18.5%) and lower studio
 * workspace (lamp, monitor, extended hand, designer) in FRAME 7.png.
 */
const F7_FILM_STRIP_POLYGON =
  "polygon(18.5% 13%, 100% 13%, 100% 52.8%, 68% 53.6%, 64% 56.6%, 48% 56.6%, 40% 54%, 18.5% 51.6%)";

function clamp01(val: number): number {
  if (val <= 0) return 0;
  if (val >= 1) return 1;
  return val;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp01(t);
}

function easeInOutSine(t: number): number {
  const c = clamp01(t);
  return -(Math.cos(Math.PI * c) - 1) / 2;
}

function easeInCubic(t: number): number {
  const c = clamp01(t);
  return c * c * c;
}

function easeOutCubic(t: number): number {
  const c = clamp01(t);
  return 1 - Math.pow(1 - c, 3);
}

function easeInOutCubic(t: number): number {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Progressive left-to-right film window reveal stops (10.50s -> 12.12s),
 * aligned to the 5 photographic windows in exact portfolio order:
 * 1. Alhind Air -> 2. Himalayan Cheese -> 3. Oro di Limone -> 4. Scripted -> 5. Paper Boat Swing
 */
function computeSequentialWindowRevealStop(sec: number): number {
  if (sec <= 10.48) return 18.6;
  if (sec >= 12.12) return 100;

  const stops = [
    { t0: 10.48, t1: 10.81, x0: 18.6, x1: 35.2 }, // 1. Alhind Air
    { t0: 10.81, t1: 11.14, x0: 35.2, x1: 50.2 }, // 2. Himalayan Cheese
    { t0: 11.14, t1: 11.47, x0: 50.2, x1: 65.4 }, // 3. Oro di Limone
    { t0: 11.47, t1: 11.8, x0: 65.4, x1: 81.4 }, // 4. Scripted
    { t0: 11.8, t1: 12.12, x0: 81.4, x1: 100.0 }, // 5. Paper Boat Swing
  ];

  for (const s of stops) {
    if (sec <= s.t1) {
      const localT = easeInOutSine(clamp01((sec - s.t0) / (s.t1 - s.t0)));
      return lerp(s.x0, s.x1, localT);
    }
  }
  return 100;
}

export function FilmRollShowcase({
  animationStatus,
  runId,
  onComplete,
}: FilmRollShowcaseProps) {
  const prefersReducedMotion = useReducedMotion();
  const [frame1Loaded, setFrame1Loaded] = useState<boolean>(false);
  const [failedFrames, setFailedFrames] = useState<Record<number, boolean>>({});

  const frameWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const f7WallCurtainRef = useRef<HTMLDivElement | null>(null);
  const f7StripUnfoldRef = useRef<HTMLDivElement | null>(null);
  const selectionCutGlowRef = useRef<HTMLDivElement | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const resolvedFrames = useMemo(
    () =>
      FILM_ROLL_FRAMES.map((frame) => ({
        ...frame,
        resolvedSrc: resolveAssetUrl(frame.src),
      })),
    []
  );

  const frame7Asset = resolvedFrames[6];

  // Preload & decode all 10 supplied film-roll keyframes plus the 5 portfolio project covers
  useEffect(() => {
    resolvedFrames.forEach((frame) => {
      void preloadAndDecodeImage(frame.src);
    });
    projects.forEach((project) => {
      void preloadAndDecodeImage(project.coverImage);
    });
  }, [resolvedFrames]);

  // Apply clean static state whenever not actively playing:
  // - "idle" / "queued": Frame 01 poised at rest (never shows completed portfolio at start)
  // - "completed": Frame 10 held cleanly at rest showcasing all 5 creative projects
  useEffect(() => {
    if (animationStatus === "playing") return;

    const targetFrameIndex =
      animationStatus === "completed" ? resolvedFrames.length - 1 : 0;

    for (let i = 0; i < resolvedFrames.length; i++) {
      const el = frameWrapperRefs.current[i];
      if (!el) continue;
      if (i === targetFrameIndex) {
        el.style.visibility = "visible";
        el.style.opacity = "1";
        el.style.transformOrigin = "50% 50%";
        el.style.transform = "translate3d(0%, 0%, 0) scale(1, 1)";
        el.style.filter = "none";
        el.style.maskImage = "none";
        el.style.webkitMaskImage = "none";
      } else {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.transformOrigin = "50% 50%";
        el.style.transform = "translate3d(0%, 0%, 0) scale(1, 1)";
        el.style.filter = "none";
        el.style.maskImage = "none";
        el.style.webkitMaskImage = "none";
      }
    }

    if (f7WallCurtainRef.current) {
      f7WallCurtainRef.current.style.opacity = "0";
    }
    if (f7StripUnfoldRef.current) {
      f7StripUnfoldRef.current.style.visibility = "hidden";
      f7StripUnfoldRef.current.style.opacity = "0";
    }
    if (selectionCutGlowRef.current) {
      selectionCutGlowRef.current.style.opacity = "0";
    }
  }, [animationStatus, resolvedFrames]);

  // Master silent 15.0-second, 10-keyframe animation timeline (10 segments x 1.5s)
  useEffect(() => {
    if (animationStatus !== "playing" || runId === 0) return;

    let rafId: number | null = null;
    let accumulatedMs = 0;
    let lastTimestamp: number | null = null;
    let isPageVisible =
      typeof document === "undefined" ? true : !document.hidden;
    let finished = false;

    const applyElementTransform = (
      el: HTMLDivElement | null,
      alpha: number,
      options?: {
        txPct?: number;
        tyPct?: number;
        scaleX?: number;
        scaleY?: number;
        rotateDeg?: number;
        origin?: string;
        blurPx?: number;
        maskCss?: string;
      }
    ) => {
      if (!el) return;
      if (alpha <= 0.001) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        return;
      }

      const tx = options?.txPct ?? 0;
      const ty = options?.tyPct ?? 0;
      const sx = options?.scaleX ?? 1;
      const sy = options?.scaleY ?? sx;
      const rot = options?.rotateDeg ?? 0;
      const origin = options?.origin ?? "50% 50%";
      const blurPx = options?.blurPx ?? 0;
      const maskCss = options?.maskCss ?? "none";

      el.style.visibility = "visible";
      el.style.opacity = alpha.toFixed(4);
      el.style.transformOrigin = origin;
      el.style.transform =
        rot !== 0
          ? `translate3d(${tx.toFixed(3)}%, ${ty.toFixed(3)}%, 0) scale(${sx.toFixed(4)}, ${sy.toFixed(4)}) rotate(${rot.toFixed(3)}deg)`
          : `translate3d(${tx.toFixed(3)}%, ${ty.toFixed(3)}%, 0) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
      el.style.filter = blurPx > 0.04 ? `blur(${blurPx.toFixed(2)}px)` : "none";
      el.style.maskImage = maskCss;
      el.style.webkitMaskImage = maskCss;
    };

    const setLayerStyle = (
      idx: number,
      alpha: number,
      options?: {
        txPct?: number;
        tyPct?: number;
        scaleX?: number;
        scaleY?: number;
        rotateDeg?: number;
        origin?: string;
        blurPx?: number;
        maskCss?: string;
      }
    ) => {
      applyElementTransform(frameWrapperRefs.current[idx] ?? null, alpha, options);
    };

    const renderTimelineAtSeconds = (sec: number) => {
      // Accessible reduced-motion path: calm sequential cross-dissolves across all 10 frames
      if (prefersReducedMotion) {
        for (let i = 0; i < resolvedFrames.length; i++) {
          const segStart = i * 1.5;
          const nextStart = (i + 1) * 1.5;
          const fadeDuration = 0.4;

          let alpha = 0;
          if (i === 0) {
            alpha = sec < nextStart + fadeDuration ? 1 : 0;
          } else if (i === resolvedFrames.length - 1) {
            alpha = smoothstep(segStart - 0.12, segStart + fadeDuration, sec);
          } else {
            const enter = smoothstep(
              segStart - 0.12,
              segStart + fadeDuration,
              sec
            );
            const holdUntil = nextStart + fadeDuration + 0.04;
            alpha = sec > holdUntil ? 0 : enter;
          }

          setLayerStyle(i, alpha);
        }
        if (f7WallCurtainRef.current) {
          f7WallCurtainRef.current.style.opacity = "0";
        }
        applyElementTransform(f7StripUnfoldRef.current, 0);
        if (selectionCutGlowRef.current) {
          selectionCutGlowRef.current.style.opacity = "0";
        }
        return;
      }

      // ======================================================================
      // MASTER 15.0s CONTINUOUS CINEMATIC CHOREOGRAPHY (10 FRAMES x 1.5s)
      // ======================================================================

      // ----------------------------------------------------------------------
      // 01. FRAME 01 (00:00 – 00:01.5): Establishing the Creative Studio
      // Calm opening push-in, accelerating smoothly into the monitor dolly at 1.32s–1.72s
      // ----------------------------------------------------------------------
      if (sec > 1.76) {
        setLayerStyle(0, 0);
      } else {
        const calmDolly = easeInOutSine(clamp01(sec / 1.32));
        const intoScreenPush = easeInCubic(clamp01((sec - 1.3) / 0.46));
        const f1Scale = 1.0 + calmDolly * 0.032 + intoScreenPush * 0.19;
        const f1Tx = lerp(0, -0.25, calmDolly) + intoScreenPush * 2.4;
        const f1Ty = lerp(0, -0.18, calmDolly) - intoScreenPush * 0.4;
        setLayerStyle(0, 1, {
          origin: "42.5% 46.5%",
          txPct: f1Tx,
          tyPct: f1Ty,
          scaleX: f1Scale,
          blurPx: intoScreenPush * 0.7,
        });
      }

      // ----------------------------------------------------------------------
      // 02. FRAME 02 (00:01.5 – 00:03.0): The Photoshop Creative Process
      // Matched focal push into the Alhind Air Photoshop canvas, then smooth dolly back out
      // ----------------------------------------------------------------------
      if (sec < 1.32 || sec > 3.28) {
        setLayerStyle(1, 0);
      } else {
        const f2Enter = easeInOutCubic(clamp01((sec - 1.32) / 0.42));
        const f2Push = easeInOutSine(clamp01((sec - 1.32) / 1.48));
        const f2PullOut = easeInCubic(clamp01((sec - 2.8) / 0.46));
        const f2Scale =
          lerp(0.955, 1.028, f2Push) - f2PullOut * 0.075;
        setLayerStyle(1, f2Enter, {
          origin: "50% 47.5%",
          txPct: lerp(0.18, -0.12, f2Push) - f2PullOut * 0.9,
          tyPct: lerp(0.12, -0.15, f2Push),
          scaleX: f2Scale,
          blurPx: f2PullOut * 0.65,
        });
      }

      // Restrained visual emphasis along the original Photoshop selection boundary (1.85s -> 2.85s)
      if (selectionCutGlowRef.current) {
        const selEmphasis =
          smoothstep(1.85, 2.45, sec) *
          (1 - smoothstep(2.68, 2.96, sec)) *
          0.26;
        selectionCutGlowRef.current.style.opacity = selEmphasis.toFixed(3);
      }

      // ----------------------------------------------------------------------
      // 03. FRAME 03 (00:03.0 – 00:04.5): Discovering the Film Canister
      // Returns smoothly from monitor close-up and reframes delicately toward the desk canister
      // ----------------------------------------------------------------------
      if (sec < 2.82 || sec > 4.86) {
        setLayerStyle(2, 0);
      } else {
        const f3Enter = easeInOutCubic(clamp01((sec - 2.82) / 0.44));
        const f3SettleFromScreen = easeOutCubic(clamp01((sec - 2.82) / 0.55));
        const f3FocusCanister = easeInOutSine(clamp01((sec - 3.35) / 1.35));
        const f3Scale =
          lerp(1.065, 1.006, f3SettleFromScreen) + f3FocusCanister * 0.022;
        setLayerStyle(2, f3Enter, {
          origin: "26% 78%",
          txPct:
            lerp(0.8, 0.0, f3SettleFromScreen) + f3FocusCanister * 0.58,
          tyPct: -f3FocusCanister * 0.36,
          scaleX: f3Scale,
        });
      }

      // ----------------------------------------------------------------------
      // 04. FRAME 04 (00:04.5 – 00:06.0): Picking Up the Canister
      // Preserves exact cylindrical geometry with a subtle push toward her hand,
      // followed by natural forward throw anticipation at 5.74s–6.08s
      // ----------------------------------------------------------------------
      if (sec < 4.4 || sec > 6.14) {
        setLayerStyle(3, 0);
      } else {
        const f4Enter = easeInOutCubic(clamp01((sec - 4.4) / 0.44));
        const f4Inspect = easeInOutSine(clamp01((sec - 4.4) / 1.34));
        const f4ThrowWindup = easeInCubic(clamp01((sec - 5.74) / 0.38));
        const f4Scale =
          lerp(1.0, 1.028, f4Inspect) + f4ThrowWindup * 0.078;
        setLayerStyle(3, f4Enter, {
          origin: "32.5% 59%",
          txPct: lerp(0.28, 0.0, f4Inspect) + f4ThrowWindup * 0.85,
          tyPct: lerp(0.05, -0.18, f4Inspect) - f4ThrowWindup * 3.1,
          scaleX: f4Scale,
          blurPx: f4ThrowWindup * 0.95,
        });
      }

      // ----------------------------------------------------------------------
      // 05 & 06. CONTINUOUS THROW & FLIGHT ARC (00:06.0 – 00:09.0)
      // FRAME 5 and FRAME 6 are 98.8% pixel-aligned in studio & cylinder geometry.
      // Sharing ONE monotonic 3.0s trajectory prevents any canister bounce, shrink,
      // teleportation, or ghosted background while "Cuts by Mayookha" rotates into focus!
      // ----------------------------------------------------------------------
      if (sec < 5.88 || sec > 9.08) {
        setLayerStyle(4, 0);
        setLayerStyle(5, 0);
      } else {
        // Phase 1 (5.88s -> 8.66s): Continuous forward perspective expansion & flight
        const flightNorm = clamp01((sec - 5.88) / 2.78);
        const throwAccel = easeOutCubic(clamp01((sec - 5.88) / 0.85));
        const flightDrift = clamp01((sec - 6.5) / 2.16);

        // Phase 2 (8.66s -> 9.08s): Smooth cinema follow-pan left toward Frame 07's canister anchor
        const followPanT = easeInOutCubic(clamp01((sec - 8.66) / 0.42));

        const unifiedScale =
          lerp(0.94, 1.016, throwAccel) +
          flightDrift * 0.034 +
          followPanT * 0.008;
        const unifiedTx =
          lerp(1.1, -0.15, throwAccel) -
          flightDrift * 0.85 -
          followPanT * 1.45;
        const unifiedTy =
          lerp(2.4, 0.12, throwAccel) -
          flightDrift * 0.45 +
          followPanT * 0.15;
        const unifiedRot =
          lerp(-0.95, 0.18, easeInOutSine(flightNorm)) - followPanT * 0.28;

        // Restrained directional blur only during fast throw impulse (5.88–6.38s) & follow-pan (8.70–9.06s);
        // crisp 0px during Frame 06 foreground flight so "Cuts by Mayookha" is completely sharp
        const impulseBlur =
          smoothstep(5.88, 6.02, sec) *
          (1 - smoothstep(6.08, 6.46, sec)) *
          1.1;
        const panBlur = followPanT * 0.85;
        const sharedBlur = impulseBlur + panBlur;

        // Frame 05 enters smoothly from Frame 04's throw release and holds until Frame 06 covers it
        const f5Enter = easeOutCubic(clamp01((sec - 5.88) / 0.26));
        const f5Alpha = sec > 7.86 ? 0 : f5Enter;

        // Frame 06 dissolves seamlessly over pixel-locked Frame 05 (7.30s -> 7.82s),
        // then exits cleanly as Frame 07 settles onto the docked canister (8.78s -> 9.06s)
        const f6Enter = easeInOutSine(clamp01((sec - 7.3) / 0.52));
        const f6PanExit = 1 - smoothstep(8.78, 9.06, sec);
        const f6Alpha = sec < 7.3 ? 0 : f6Enter * f6PanExit;

        const flightOpts = {
          origin: "36.4% 34.5%",
          txPct: unifiedTx,
          tyPct: unifiedTy,
          scaleX: unifiedScale,
          rotateDeg: unifiedRot,
          blurPx: sharedBlur,
        };

        setLayerStyle(4, f5Alpha, flightOpts);
        setLayerStyle(5, f6Alpha, flightOpts);
      }

      // ----------------------------------------------------------------------
      // 07. FRAME 07 (00:09.0 – 00:10.5): The Film Strip Unfolds
      // Two-layer physical separation eliminates duplicate canisters & background ghosting:
      // - Layer 7 Base: Stationary docked canister on the left + lower studio scene
      // - Layer 7 Strip: Perforated 5-window film strip pulling out from x=18.5% -> 100%
      // ----------------------------------------------------------------------
      const panArrivalT = easeOutCubic(clamp01((sec - 8.74) / 0.58));
      const sharedCurvedScale = lerp(1.036, 1.003, panArrivalT);
      const sharedCurvedTx = lerp(1.35, 0.0, panArrivalT);

      if (sec < 8.74 || sec > 12.9) {
        setLayerStyle(6, 0);
        if (f7WallCurtainRef.current) {
          f7WallCurtainRef.current.style.opacity = "0";
        }
        applyElementTransform(f7StripUnfoldRef.current, 0);
      } else {
        const f7BaseEnter = easeInOutCubic(clamp01((sec - 8.74) / 0.32));
        // Subtle leftward alignment drift during 10.36–10.68s to lock canister with Frame 08
        const f7AlignToF8 = easeInOutSine(clamp01((sec - 10.36) / 0.32));
        // Curve-flattening taut transition as Frame 09 straightens the strip (12.14–12.88s)
        const flattenT = easeInOutSine(clamp01((sec - 12.14) / 0.74));

        const f7Tx = sharedCurvedTx - f7AlignToF8 * 0.35;

        setLayerStyle(6, f7BaseEnter, {
          origin: "18.5% 36%",
          txPct: f7Tx,
          scaleX: sharedCurvedScale + flattenT * 0.008,
          scaleY: sharedCurvedScale - flattenT * 0.012,
        });

        // Studio wall curtain hides the unrolled strip on Layer 7 Base until unfolding finishes at 10.44s
        if (f7WallCurtainRef.current) {
          const curtainAlpha = 1 - smoothstep(10.34, 10.48, sec);
          f7WallCurtainRef.current.style.opacity = curtainAlpha.toFixed(3);
        }

        // Physical Film Strip Unfolding Layer (active 8.94s -> 10.48s; once 100% unfolded, Base holds seamlessly)
        if (sec < 8.94 || sec > 10.5) {
          applyElementTransform(f7StripUnfoldRef.current, 0);
        } else {
          const unfoldT = easeOutCubic(clamp01((sec - 8.96) / 1.44));
          const settleFade = 1 - smoothstep(10.42, 10.5, sec);
          const stripSolid = lerp(18.5, 100, unfoldT);
          const stripMid = Math.min(106, stripSolid + 4.2);
          const stripEdge = Math.min(112, stripSolid + 8.5);
          const stripMask =
            stripSolid >= 99.8
              ? "none"
              : `linear-gradient(96deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${stripSolid.toFixed(2)}%, rgba(0,0,0,0.48) ${stripMid.toFixed(2)}%, rgba(0,0,0,0) ${stripEdge.toFixed(2)}%)`;

          // Restrained organic film-ribbon wave anchored at the canister lip (18.5%, 36%), decaying cleanly to 0
          const waveEnvelope = Math.sin(unfoldT * Math.PI) * (1 - unfoldT * 0.65);
          const waveTy = Math.sin(sec * 7.2) * 0.24 * waveEnvelope;
          const waveRot = Math.cos(sec * 6.4) * 0.28 * waveEnvelope;

          applyElementTransform(
            f7StripUnfoldRef.current,
            f7BaseEnter * (sec >= 10.42 ? settleFade : 1),
            {
              origin: "18.5% 36%",
              txPct: f7Tx,
              tyPct: waveTy,
              scaleX: sharedCurvedScale,
              scaleY: sharedCurvedScale,
              rotateDeg: waveRot,
              maskCss: stripMask,
            }
          );
        }
      }

      // ----------------------------------------------------------------------
      // 08. FRAME 08 (00:10.5 – 00:12.0, completing 5th window at 12.12s):
      // Five Creative Projects Revealed Sequentially Inside Their Film Windows
      // Uses a 98deg slanted mask matching the 8deg tilt of the curved film dividers!
      // ----------------------------------------------------------------------
      if (sec < 10.36 || sec > 12.92) {
        setLayerStyle(7, 0);
      } else {
        const f8Enter = easeInOutSine(clamp01((sec - 10.36) / 0.32));
        const solidStop = computeSequentialWindowRevealStop(sec);
        const featherStop = Math.min(108, solidStop + 6.5);
        const revealMask =
          solidStop >= 99.8
            ? "none"
            : `linear-gradient(98deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${solidStop.toFixed(2)}%, rgba(0,0,0,0) ${featherStop.toFixed(2)}%)`;

        // Synchronized subtle strip breath & curve-flattening into Frame 09
        const flattenT = easeInOutSine(clamp01((sec - 12.14) / 0.74));
        const subtleFloatY =
          Math.sin((sec - 10.5) * 2.4) * 0.12 * (1 - flattenT);

        setLayerStyle(7, f8Enter, {
          origin: "50% 37%",
          tyPct: subtleFloatY,
          scaleX: sharedCurvedScale + flattenT * 0.008,
          scaleY: sharedCurvedScale - flattenT * 0.012,
          maskCss: revealMask,
        });
      }

      // ----------------------------------------------------------------------
      // 09. FRAME 09 (00:12.0 – 00:13.5): The Complete Portfolio
      // Curved strip straightens smoothly into the clean horizontal 5-project presentation
      // with zero cropping of the canister or any project window
      // ----------------------------------------------------------------------
      if (sec < 12.14 || sec > 14.32) {
        setLayerStyle(8, 0);
      } else {
        const f9Enter = easeInOutSine(clamp01((sec - 12.14) / 0.74));
        const f9Settle = easeOutCubic(clamp01((sec - 12.14) / 1.36));
        const f9FinalGlide = easeOutCubic(clamp01((sec - 13.44) / 0.88));
        const f9ScaleX = lerp(1.004, 1.002, f9Settle) - f9FinalGlide * 0.002;
        const f9ScaleY = lerp(1.012, 1.002, f9Settle) - f9FinalGlide * 0.002;

        setLayerStyle(8, f9Enter, {
          origin: "50% 37%",
          scaleX: f9ScaleX,
          scaleY: f9ScaleY,
        });
      }

      // ----------------------------------------------------------------------
      // 10. FRAME 10 (00:13.5 – 00:15.0): Final Cinematic Composition
      // Upper 5-project horizontal film strip stays locked in place while the designer
      // rests her hand and looks warmly toward the viewer; settles to exact 1.000 and holds
      // ----------------------------------------------------------------------
      if (sec < 13.44) {
        setLayerStyle(9, 0);
      } else {
        const f10Enter = easeInOutSine(clamp01((sec - 13.44) / 0.82));
        const f10Settle = easeOutCubic(clamp01((sec - 13.44) / 1.56));
        setLayerStyle(9, f10Enter, {
          origin: "50% 37%",
          scaleX: lerp(1.002, 1.0, f10Settle),
          scaleY: lerp(1.002, 1.0, f10Settle),
        });
      }
    };

    const tick = (now: number) => {
      if (finished) return;

      if (!isPageVisible) {
        lastTimestamp = null;
        rafId = window.requestAnimationFrame(tick);
        return;
      }

      if (lastTimestamp === null) {
        lastTimestamp = now;
      }
      const delta = Math.min(now - lastTimestamp, 100);
      lastTimestamp = now;
      accumulatedMs += delta;

      if (accumulatedMs >= TOTAL_DURATION_MS) {
        renderTimelineAtSeconds(TOTAL_DURATION_SEC);
        finished = true;
        onCompleteRef.current();
        return;
      }

      renderTimelineAtSeconds(accumulatedMs / 1000);
      rafId = window.requestAnimationFrame(tick);
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (!isPageVisible) {
        lastTimestamp = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    renderTimelineAtSeconds(0);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      finished = true;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [animationStatus, runId, prefersReducedMotion, resolvedFrames]);

  const allFramesFailed =
    Object.keys(failedFrames).length >= resolvedFrames.length;

  return (
    <div
      role="img"
      aria-label={
        animationStatus === "completed"
          ? "Cuts by Mayookha film-strip showcase featuring five creative projects: Alhind Air, Himalayan Cheese, Oro di Limone, Scripted, and Paper Boat Swing"
          : "Cinematic creative studio film-roll animation showcasing five portfolio projects"
      }
      className="relative w-full aspect-[1672/941] rounded-[18px] sm:rounded-[22px] lg:rounded-[26px] overflow-hidden bg-[#F2EEF1] border border-zinc-200/80 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.09)] select-none"
      style={{
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Clean studio wall placeholder prior to initial Frame 01 decode */}
      {!frame1Loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#F4F2F3] via-[#EFECEF] to-[#E8E4E8]"
        />
      )}

      {/* Resilient fallback container if image assets fail to load */}
      {allFramesFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F4F2F4] px-6 text-center">
          <p className="text-sm font-medium text-zinc-700">
            Featured Creative Portfolio Showcase
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Alhind Air · Himalayan Cheese · Oro di Limone · Scripted · Paper Boat
            Swing
          </p>
        </div>
      )}

      {/* 10 Supplied Reference Frames in Exact Sequential Order (Frame 01 .. Frame 10) */}
      {resolvedFrames.map((frame, idx) => {
        const isInitialFrame = idx === 0;
        const isFrame7 = idx === 6;
        const isFinalFrame = idx === resolvedFrames.length - 1;
        const initiallyVisible =
          animationStatus === "completed" ? isFinalFrame : isInitialFrame;

        return (
          <React.Fragment key={frame.id}>
            <div
              ref={(el) => {
                frameWrapperRefs.current[idx] = el;
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center will-change-[transform,opacity]"
              style={{
                visibility: initiallyVisible ? "visible" : "hidden",
                opacity: initiallyVisible ? 1 : 0,
                transform: "translate3d(0%, 0%, 0) scale(1, 1)",
              }}
            >
              {!failedFrames[frame.frameNumber] && (
                <img
                  src={frame.resolvedSrc}
                  alt={frame.title}
                  width={frame.width}
                  height={frame.height}
                  loading="eager"
                  fetchPriority={
                    isInitialFrame || isFinalFrame ? "high" : "auto"
                  }
                  decoding="async"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onLoad={
                    isInitialFrame ? () => setFrame1Loaded(true) : undefined
                  }
                  onError={() =>
                    setFailedFrames((prev) => ({
                      ...prev,
                      [frame.frameNumber]: true,
                    }))
                  }
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              )}

              {/* Studio wall mask curtain on Frame 07 Base so the strip unfolds cleanly from the canister */}
              {isFrame7 && (
                <div
                  ref={f7WallCurtainRef}
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none will-change-[opacity]"
                  style={{
                    opacity: 0,
                    clipPath: F7_FILM_STRIP_POLYGON,
                    background:
                      "linear-gradient(90deg, rgb(243, 237, 241) 18%, rgb(240, 234, 238) 54%, rgb(234, 229, 233) 100%)",
                  }}
                />
              )}
            </div>

            {/* Physical Left-to-Right Unfolding Film-Strip Layer Originating From the Canister Lip */}
            {isFrame7 &&
              frame7Asset &&
              !failedFrames[frame7Asset.frameNumber] && (
                <div
                  ref={f7StripUnfoldRef}
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none will-change-[transform,opacity]"
                  style={{
                    visibility: "hidden",
                    opacity: 0,
                    clipPath: F7_FILM_STRIP_POLYGON,
                  }}
                >
                  <img
                    src={frame7Asset.resolvedSrc}
                    alt=""
                    aria-hidden="true"
                    width={frame7Asset.width}
                    height={frame7Asset.height}
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="w-full h-full object-contain pointer-events-none select-none"
                  />
                </div>
              )}
          </React.Fragment>
        );
      })}

      {/* Restrained Photoshop Selection Boundary Emphasis (Active Only on Frame 02: 1.85s -> 2.95s) */}
      <div
        ref={selectionCutGlowRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none will-change-[opacity]"
        style={{
          opacity: 0,
          background:
            "linear-gradient(124deg, rgba(255,255,255,0) 43%, rgba(255,255,255,0.58) 49.7%, rgba(255,248,230,0.72) 50.2%, rgba(255,255,255,0) 56%)",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
