import React from "react";
import { motion } from "motion/react";
import {
  FilmRollShowcase,
  type FilmRollAnimationStatus,
} from "./FilmRollShowcase";
import { HeroIntroduction } from "./HeroIntroduction";

export interface HomeHeroProps {
  animationStatus: FilmRollAnimationStatus;
  animationRunId: number;
  onAnimationComplete: () => void;
  setActiveSection: (section: string) => void;
}

export function HomeHero({
  animationStatus,
  animationRunId,
  onAnimationComplete,
  setActiveSection,
}: HomeHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.99, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.005, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity" }}
      className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16"
    >
      <div className="relative z-10 w-full max-w-[1380px] min-h-full mx-auto py-5 sm:py-7 md:py-10 lg:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-[minmax(0,50fr)_minmax(0,50fr)] lg:grid-cols-[minmax(0,52fr)_minmax(0,48fr)] items-center gap-7 sm:gap-9 md:gap-8 lg:gap-12 xl:gap-16">
          {/* Left Side: 15-Second Silent Cinematic Film-Roll Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.48,
              delay: 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
            className="w-full min-w-0"
          >
            <FilmRollShowcase
              animationStatus={animationStatus}
              runId={animationRunId}
              onComplete={onAnimationComplete}
            />
          </motion.div>

          {/* Right Side: Editorial Headline, Designation, View My Work & Let's Collaborate */}
          <div className="w-full min-w-0 md:pl-1 lg:pl-3 overflow-visible">
            <HeroIntroduction setActiveSection={setActiveSection} />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
