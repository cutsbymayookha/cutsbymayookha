import React from "react";
import { motion } from "motion/react";
import { ResumeControls } from "./ResumeControls";
import { SITE_ASSETS, resolveAssetUrl } from "../data/portfolioAssets";

const ABOUT_PORTRAIT_SRC = resolveAssetUrl(SITE_ASSETS.aboutPortrait.src);

export function About() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity" }}
      className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
    >
      <div className="min-h-full w-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 py-6 sm:py-10 lg:py-12">
        {/* Main About Me Card */}
        <div className="w-full max-w-5xl bg-transparent lg:bg-zinc-50/50 p-4 sm:p-10 lg:p-16 rounded-[2rem] lg:rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-24 border-0 lg:border border-black/5 shadow-none lg:shadow-sm my-auto">
          {/* Portrait Side */}
          <div className="w-full lg:w-5/12 flex justify-center lg:justify-end shrink-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[290px] lg:max-w-[320px] aspect-[3/4] relative overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.14)] bg-zinc-100 border border-black/10 flex items-center justify-center group"
            >
              <img
                src={ABOUT_PORTRAIT_SRC}
                alt="Mayookha Kurup"
                width={SITE_ASSETS.aboutPortrait.width}
                height={SITE_ASSETS.aboutPortrait.height}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                className="w-full h-full block object-cover select-none transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] z-20 pointer-events-none" />
            </motion.div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-semibold tracking-tight text-zinc-900 mb-6 leading-[1.12] text-balance">
                Introducing The{" "}
                <span className="text-zinc-400 font-light italic">
                  Leading Lady
                </span>
              </h2>

              <div className="text-sm sm:text-base lg:text-lg text-zinc-500 font-light space-y-4 sm:space-y-5 leading-relaxed max-w-lg mx-auto lg:mx-0">
                <p>
                  Hey I am Mayookha Kurup, a Visual Communication Design student with a love for branding, packaging, and all things visual. I enjoy turning ideas into designs that communicate, connect, and leave an impression. A huge movie buff, I’m often inspired by cinema, storytelling, and the little details that make a visual memorable. I am always curious, always learning, and always looking for new ways to bring ideas to life.
                </p>
              </div>

              <ResumeControls className="mt-7 sm:mt-8 justify-center lg:justify-start" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
