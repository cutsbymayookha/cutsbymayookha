import React from "react";
import { motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";

export function Home({
  setActiveSection,
}: {
  setActiveSection: (section: string) => void;
  key?: string | number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.985, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.01, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity" }}
      className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
    >
      <div className="relative z-10 w-full max-w-6xl px-2 flex flex-col items-center justify-center text-center my-auto min-h-min py-8 overflow-y-auto overflow-x-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity" }}
          className="w-full max-w-full text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-tighter text-zinc-900 mb-8 md:mb-12 drop-shadow-sm leading-[1.02] md:leading-[0.92] break-words"
        >
          Visual Communication
          <br className="block md:hidden" />
          <span className="hidden md:inline"> </span>
          <br className="hidden md:block" />
          <span className="text-zinc-500 font-light italic md:ml-8">
            Designer.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity" }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
        >
          <button
            onClick={() => setActiveSection("work")}
            className="group relative w-full sm:w-auto cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200/50 to-white/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
            <div className="relative flex items-center justify-center sm:justify-start gap-3 px-8 py-4 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-zinc-900 rounded-full font-medium transition-all duration-300 group-hover:scale-105 group-hover:bg-white/60 w-full sm:w-auto">
              View My Work
              <span className="text-zinc-500 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all duration-300">
                <ArrowDownRight size={18} />
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveSection("contact")}
            className="group relative w-full sm:w-auto cursor-pointer"
          >
            <div className="relative flex items-center justify-center sm:justify-start gap-3 px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-zinc-700 rounded-full font-medium transition-all duration-300 group-hover:scale-105 group-hover:bg-white/40 group-hover:text-zinc-900 w-full sm:w-auto">
              Contact Me
            </div>
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
