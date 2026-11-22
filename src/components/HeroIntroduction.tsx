import React from "react";
import { motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";

export interface HeroIntroductionProps {
  setActiveSection: (section: string) => void;
}

export function HeroIntroduction({ setActiveSection }: HeroIntroductionProps) {
  return (
    <div className="w-full flex flex-col items-start text-left overflow-visible">
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity" }}
        className="w-full font-semibold tracking-tighter text-zinc-900 mb-7 sm:mb-8 lg:mb-10 drop-shadow-sm leading-[0.98] md:leading-[0.95] text-[clamp(2.15rem,9.8vw,3.45rem)] md:text-[clamp(2.2rem,4.4vw,4.85rem)] overflow-visible select-none"
      >
        <span className="block">Visual</span>
        <span className="block whitespace-nowrap">Communication</span>
        <span className="block text-zinc-500 font-light italic mt-0.5 md:mt-1 pr-[0.14em]">
          Designer.
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        style={{ willChange: "transform, opacity" }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 lg:gap-5 w-full sm:w-auto"
      >
        <button
          type="button"
          onClick={() => setActiveSection("work")}
          className="group relative w-full sm:w-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-full"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200/50 to-white/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
          <div className="relative flex items-center justify-center sm:justify-start gap-3 px-7 md:px-8 py-3.5 md:py-4 bg-white/80 backdrop-blur-xl border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.05)] text-zinc-900 rounded-full font-medium transition-all duration-300 group-hover:scale-[1.03] group-hover:bg-white group-hover:border-zinc-300/90 active:scale-[0.99] whitespace-nowrap shrink-0 w-full sm:w-auto">
            <span>View My Work</span>
            <span className="text-zinc-500 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-300">
              <ArrowDownRight size={18} aria-hidden="true" />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("contact")}
          className="group relative w-full sm:w-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 rounded-full"
        >
          <div className="relative flex items-center justify-center sm:justify-start gap-3 px-7 md:px-8 py-3.5 md:py-4 bg-white/45 backdrop-blur-md border border-zinc-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.025)] text-zinc-700 rounded-full font-medium transition-all duration-300 group-hover:scale-[1.03] group-hover:bg-white/80 group-hover:border-zinc-300/80 group-hover:text-zinc-900 active:scale-[0.99] whitespace-nowrap shrink-0 w-full sm:w-auto">
            <span>Let&apos;s Collaborate</span>
          </div>
        </button>
      </motion.div>
    </div>
  );
}
