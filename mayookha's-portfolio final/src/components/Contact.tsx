import React from "react";
import { motion } from "motion/react";
import { Mail, Linkedin, ArrowUpRight } from "lucide-react";
import { ResumeControls } from "./ResumeControls";

export function Contact() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform, opacity" }}
      className="absolute inset-0 flex flex-col p-4 sm:p-6 md:p-8 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
    >
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col justify-between flex-1 pt-6 sm:pt-8 md:pt-12 pb-10 sm:pb-14 min-h-min">
        <div className="my-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="mb-10 md:mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight text-zinc-900 mb-5 leading-[1.1]">
              Contact{" "}
              <span className="text-zinc-400 font-light italic">Me.</span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              Liked what you saw? Let’s get in touch and make something worth a second look. I’m always up for new ideas, creative collaborations, and exciting projects. The next scene could start here!
            </p>
          </motion.div>

          {/* Two Contact Options: Email & LinkedIn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 w-full text-left max-w-4xl mx-auto mb-10 md:mb-12">
            {/* Email Option */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <a
                href="mailto:mayookhakurup@gmail.com"
                aria-label="Send email to mayookhakurup@gmail.com"
                className="group h-full flex items-center justify-between p-5 sm:p-6 md:p-7 bg-white/55 backdrop-blur-xl border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] rounded-[2rem] hover:shadow-[0_10px_32px_rgba(0,0,0,0.06)] hover:bg-white hover:border-black/10 transition-all duration-300 gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
              >
                <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center border border-zinc-100 shadow-sm transition-transform duration-500 group-hover:scale-110">
                    <Mail
                      size={22}
                      className="text-zinc-700 sm:w-6 sm:h-6 w-5 h-5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-widest mb-0.5 sm:mb-1">
                      Email
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-zinc-900 break-all">
                      mayookhakurup@gmail.com
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-zinc-300 group-hover:text-zinc-900 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>

            {/* LinkedIn Option */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <a
                href="https://www.linkedin.com/in/mayookha-kurup-visualcommunication-designer/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Mayookha Kurup on LinkedIn"
                className="group h-full flex items-center justify-between p-5 sm:p-6 md:p-7 bg-white/55 backdrop-blur-xl border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] rounded-[2rem] hover:shadow-[0_10px_32px_rgba(0,0,0,0.06)] hover:bg-white hover:border-black/10 transition-all duration-300 gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
              >
                <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center border border-zinc-100 shadow-sm transition-transform duration-500 group-hover:scale-110">
                    <Linkedin
                      size={22}
                      className="text-zinc-700 sm:w-6 sm:h-6 w-5 h-5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-widest mb-0.5 sm:mb-1">
                      LinkedIn
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-zinc-900 truncate">
                      mayookha-kurup-visualcommunication-designer
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  size={20}
                  className="shrink-0 text-zinc-300 group-hover:text-zinc-900 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>
          </div>

          {/* Resume Preview & Download Controls */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="flex flex-col items-center justify-center mb-10"
          >
            <ResumeControls className="justify-center" />
          </motion.div>
        </div>

        {/* Minimal Footer integrated into contact page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "opacity" }}
          className="flex flex-col md:flex-row items-center justify-between border-t border-zinc-200/50 pt-8 mt-4 w-full gap-4 max-w-4xl mx-auto"
        >
          <p className="text-xs text-zinc-500 font-medium tracking-wide">
            © {new Date().getFullYear()} Mayookha Kurup. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
