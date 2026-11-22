import React from "react";
import { HomeHero } from "./HomeHero";
import type { FilmRollAnimationStatus } from "./FilmRollShowcase";

export interface HomeProps {
  animationStatus: FilmRollAnimationStatus;
  animationRunId: number;
  onAnimationComplete: () => void;
  setActiveSection: (section: string) => void;
  key?: string | number;
}

export function Home({
  animationStatus,
  animationRunId,
  onAnimationComplete,
  setActiveSection,
}: HomeProps) {
  return (
    <HomeHero
      animationStatus={animationStatus}
      animationRunId={animationRunId}
      onAnimationComplete={onAnimationComplete}
      setActiveSection={setActiveSection}
    />
  );
}
