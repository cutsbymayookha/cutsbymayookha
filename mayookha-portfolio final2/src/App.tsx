import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LandingHero } from "./components/LandingHero";
import { Dock } from "./components/Dock";
import { Home } from "./components/Home";
import { About } from "./components/About";
import {
  Work,
  resolveDeepLinkFromSearch,
  clearDeepLinkParamsFromUrl,
  warmUpPortfolioAssets,
} from "./components/Work";
import { Contact } from "./components/Contact";

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

  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== "undefined") {
      const deepLink = resolveDeepLinkFromSearch(window.location.search);
      if (deepLink) return "work";
    }
    return "home";
  });

  useEffect(() => {
    const handlePopState = () => {
      const deepLink = resolveDeepLinkFromSearch(window.location.search);
      if (deepLink) {
        setIsLandingVisible(false);
        setActiveSection("work");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Warm up About portrait and My Work cover thumbnails during browser idle time
  useEffect(() => {
    const timer = window.setTimeout(() => {
      warmUpPortfolioAssets();
    }, 350);
    return () => window.clearTimeout(timer);
  }, []);

  const handleExplore = useCallback(() => {
    setIsLandingVisible(false);
  }, []);

  const handleNavigateToLanding = useCallback(() => {
    if (typeof window !== "undefined" && window.location.search) {
      clearDeepLinkParamsFromUrl();
    }
    setActiveSection("home");
    setIsLandingVisible((prev) => (prev ? prev : true));
  }, []);

  return (
    <div className="relative bg-white h-[100dvh] w-full overflow-hidden flex flex-col">
      {/* GPU-Lightweight Ambient Background (replaces continuous infinite blur repaints) */}
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

      <AnimatePresence mode="wait">
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
                  <Home key="home" setActiveSection={setActiveSection} />
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

