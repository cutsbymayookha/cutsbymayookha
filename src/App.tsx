import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LandingHero } from "./components/LandingHero";
import { Dock } from "./components/Dock";
import { Home } from "./components/Home";
import type { FilmRollAnimationStatus } from "./components/FilmRollShowcase";
import { About } from "./components/About";
import {
  Work,
  resolveDeepLinkFromSearch,
  clearDeepLinkParamsFromUrl,
  warmUpPortfolioAssets,
  preloadAndDecodeImage,
} from "./components/Work";
import { Contact } from "./components/Contact";
import { FILM_ROLL_FRAMES } from "./data/portfolioAssets";

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  const [isLandingVisible, setIsLandingVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    const deepLink = resolveDeepLinkFromSearch(window.location.search);
    if (deepLink) return false;
    if (window.location.search) {
      clearDeepLinkParamsFromUrl();
    }
    return true;
  });

  const [activeSection, setActiveSectionState] = useState(() => {
    if (typeof window !== "undefined") {
      const deepLink = resolveDeepLinkFromSearch(window.location.search);
      if (deepLink) return "work";
    }
    return "home";
  });

  // Shared Home Film-Roll playback state coordinated with the Intro "Explore Portfolio" button:
  // - Starts "idle" while on the Intro screen (never autoplays on website load)
  // - Starts "completed" if entering directly via a deep link that bypassed the Intro screen
  const [homePlayback, setHomePlayback] = useState<{
    status: FilmRollAnimationStatus;
    runId: number;
  }>(() => ({
    status: isLandingVisible ? "idle" : "completed",
    runId: 0,
  }));

  const startQueuedHomeAnimation = useCallback(() => {
    setHomePlayback((prev) => {
      if (prev.status !== "queued") {
        return prev;
      }
      return {
        status: "playing",
        runId: prev.runId + 1,
      };
    });
  }, []);

  // Fallback timer ensuring queued animation always starts once HomeHero has settled,
  // even under instant/reduced-motion transitions
  useEffect(() => {
    if (homePlayback.status !== "queued" || isLandingVisible) return;
    const timer = window.setTimeout(() => {
      startQueuedHomeAnimation();
    }, 480);
    return () => window.clearTimeout(timer);
  }, [homePlayback.status, isLandingVisible, startQueuedHomeAnimation]);

  useEffect(() => {
    const handlePopState = () => {
      const deepLink = resolveDeepLinkFromSearch(window.location.search);
      if (deepLink) {
        setIsLandingVisible(false);
        setActiveSectionState("work");
        setHomePlayback((prev) =>
          prev.status === "idle" || prev.status === "queued" || prev.status === "playing"
            ? { ...prev, status: "completed" }
            : prev
        );
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Preload & decode all 10 Home film-roll keyframes while the visitor views the Intro screen,
  // followed by About portrait and My Work cover thumbnails
  useEffect(() => {
    let cancelled = false;

    const preloadFilmFramesSequentially = async () => {
      for (const frame of FILM_ROLL_FRAMES) {
        if (cancelled) return;
        await preloadAndDecodeImage(frame.src);
      }
    };

    void preloadFilmFramesSequentially();

    const timer = window.setTimeout(() => {
      warmUpPortfolioAssets();
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const setActiveSection = useCallback((nextSection: string) => {
    setActiveSectionState(nextSection);
    if (nextSection !== "home") {
      // Prevent unexpected animation restarts when later returning to Home from another tab
      setHomePlayback((prev) =>
        prev.status === "playing" || prev.status === "queued"
          ? { ...prev, status: "completed" }
          : prev
      );
    }
  }, []);

  const handleExplore = useCallback(() => {
    setIsLandingVisible((currentlyVisible) => {
      if (!currentlyVisible) {
        return false;
      }
      setActiveSectionState("home");
      setHomePlayback((prev) => {
        if (prev.status === "queued" || prev.status === "playing") {
          return prev;
        }
        return {
          status: "queued",
          runId: prev.runId,
        };
      });
      return false;
    });
  }, []);

  const handleHomeAnimationComplete = useCallback(() => {
    setHomePlayback((prev) => ({
      ...prev,
      status: "completed",
    }));
  }, []);

  const handleNavigateToLanding = useCallback(() => {
    if (typeof window !== "undefined" && window.location.search) {
      clearDeepLinkParamsFromUrl();
    }
    setActiveSectionState("home");
    setHomePlayback((prev) => ({
      ...prev,
      status: "idle",
    }));
    setIsLandingVisible((prev) => (prev ? prev : true));
  }, []);

  return (
    <div className="relative bg-white h-[100dvh] w-full overflow-hidden flex flex-col">
      {/* GPU-Lightweight Ambient Background */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-white select-none"
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 22% 22%, rgba(244, 244, 245, 0.85) 0%, rgba(244, 244, 245, 0) 55%), radial-gradient(circle at 78% 78%, rgba(228, 228, 231, 0.55) 0%, rgba(228, 228, 231, 0) 52%), radial-gradient(circle at 55% 42%, rgba(250, 250, 250, 0.9) 0%, rgba(255, 255, 255, 0) 50%)",
          }}
        />
      </div>

      <AnimatePresence mode="wait" onExitComplete={startQueuedHomeAnimation}>
        {isLandingVisible && (
          <LandingHero key="landing-hero" onExplore={handleExplore} />
        )}
      </AnimatePresence>

      {!isLandingVisible && (
        <>
          <Dock
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onNavigateToLanding={handleNavigateToLanding}
          />

          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.18 : 0.45,
              delay: prefersReducedMotion ? 0 : 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
            className="absolute inset-0 z-10 pointer-events-none pt-[72px] md:pt-[88px] lg:pt-[100px]"
          >
            <div className="relative w-full h-full pointer-events-auto">
              <AnimatePresence mode={prefersReducedMotion ? "sync" : "wait"}>
                {activeSection === "home" && (
                  <Home
                    key="home"
                    animationStatus={homePlayback.status}
                    animationRunId={homePlayback.runId}
                    onAnimationComplete={handleHomeAnimationComplete}
                    setActiveSection={setActiveSection}
                  />
                )}
                {activeSection === "about" && <About key="about" />}
                {activeSection === "work" && <Work key="work" />}
                {activeSection === "contact" && <Contact key="contact" />}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
