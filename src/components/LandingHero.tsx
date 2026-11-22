import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SITE_ASSETS, resolveAssetUrl } from "../data/portfolioAssets";

const PORTRAIT_SRC = resolveAssetUrl(SITE_ASSETS.landingPortrait.src);

interface LandingHeroProps {
  onExplore: () => void;
  key?: React.Key;
}

export function LandingHero({ onExplore }: LandingHeroProps) {
  const [isExploring, setIsExploring] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleExploreClick = () => {
    if (isExploring) return;
    setIsExploring(true);
    onExplore();
  };

  const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.18 } }
          : {
              opacity: 0,
              y: -28,
              scale: 0.99,
              transition: { duration: 0.42, ease: easeOutExpo },
            }
      }
      transition={{ duration: prefersReducedMotion ? 0.18 : 0.45, ease: easeOutExpo }}
      style={{ willChange: "transform, opacity" }}
      className="fixed inset-0 z-[200] bg-[#F4F3EF] flex items-center justify-center p-3 sm:p-5 md:p-8 lg:p-10 overflow-hidden select-none"
      aria-label="Mayookha Kurup Portfolio Landing Screen"
    >
      {/* 1. Framed Hero Canvas */}
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.985, y: 12 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0.2 : 0.55,
          delay: prefersReducedMotion ? 0 : 0.03,
          ease: easeOutExpo,
        }}
        style={{ willChange: "transform, opacity" }}
        className="relative w-full max-w-[1360px] h-full max-h-[860px] bg-[#FAF9F6] border border-[#E4E3DD] shadow-[0_24px_70px_-15px_rgba(0,0,0,0.06)] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] flex flex-col justify-between overflow-hidden px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-7 sm:pt-10 md:pt-12 lg:pt-14 pb-6 sm:pb-8 md:pb-0"
      >
        {/* Top Area: Oversized Centered Name (MAYOOKHA KURUP) */}
        <div className="w-full flex flex-col items-center justify-center text-center shrink-0 z-10 pt-1 sm:pt-2">
          <h1
            aria-label="MAYOOKHA KURUP"
            className="font-display font-extrabold uppercase tracking-[-0.04em] leading-[0.95] text-[clamp(1.65rem,6.1vw,5.75rem)] whitespace-nowrap flex items-center justify-center gap-[0.24em] max-w-full"
          >
            {/* 2. Outlined MAYOOKHA */}
            <motion.span
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 22 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.55,
                delay: prefersReducedMotion ? 0 : 0.1,
                ease: easeOutExpo,
              }}
              style={{
                color: "transparent",
                WebkitTextStroke: "clamp(1.2px, 0.14vw, 2px) #111111",
                willChange: "transform, opacity",
              }}
              className="inline-block"
            >
              MAYOOKHA
            </motion.span>

            {/* 3. Solid KURUP */}
            <motion.span
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 22 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.55,
                delay: prefersReducedMotion ? 0 : 0.2,
                ease: easeOutExpo,
              }}
              style={{ willChange: "transform, opacity" }}
              className="inline-block text-[#111111]"
            >
              KURUP
            </motion.span>
          </h1>
        </div>

        {/* Lower Half Composition: Centered Portrait + Left-Positioned Button on Desktop (Beneath Portrait on Mobile) */}
        <div className="relative w-full flex-1 flex flex-col md:flex-row items-center justify-center md:items-end min-h-0 mt-4 sm:mt-6 md:mt-8">
          {/* 5. Primary CTA Button: Left of portrait on desktop, below portrait on mobile */}
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.55,
              delay: prefersReducedMotion ? 0 : 0.36,
              ease: easeOutExpo,
            }}
            style={{ willChange: "transform, opacity" }}
            className="order-2 md:order-1 mt-5 sm:mt-6 md:mt-0 md:absolute md:left-0 lg:left-2 xl:left-6 md:bottom-[20%] lg:bottom-[24%] z-20 shrink-0"
          >
            <button
              type="button"
              onClick={handleExploreClick}
              disabled={isExploring}
              className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-4 bg-[#111111] text-white rounded-full text-[14px] sm:text-[15px] font-medium tracking-[-0.01em] shadow-[0_12px_28px_-8px_rgba(0,0,0,0.22)] hover:bg-zinc-800 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-8px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF9F6] disabled:opacity-75 disabled:pointer-events-none"
            >
              <span>Explore Portfolio</span>
              <ArrowUpRight
                size={17}
                className="stroke-[2] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </motion.div>

          {/* 4. Centered Portrait (/landing-page-profile-pic.jpg) */}
          <motion.div
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.6,
              delay: prefersReducedMotion ? 0 : 0.26,
              ease: easeOutExpo,
            }}
            style={{ willChange: "transform, opacity" }}
            className="order-1 md:order-2 relative mx-auto aspect-[3/4] h-[44vh] sm:h-[48vh] md:h-[58vh] lg:h-[62vh] max-h-[540px] min-h-[220px] max-w-[78vw] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[430px] rounded-[22px] md:rounded-t-[28px] md:rounded-b-none overflow-hidden bg-zinc-200/70 border border-black/[0.06] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] shrink-0"
          >
            <img
              src={PORTRAIT_SRC}
              alt="Mayookha Kurup"
              width={SITE_ASSETS.landingPortrait.width}
              height={SITE_ASSETS.landingPortrait.height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable={false}
              className="w-full h-full object-cover object-[47%_18%] grayscale contrast-[1.05] brightness-[1.01] select-none"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.main>
  );
}
