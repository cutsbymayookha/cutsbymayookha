import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
  key?: React.Key;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for fade out
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform, opacity" }}
          className="fixed inset-0 z-[200] bg-zinc-50 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.5 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="w-96 h-96 bg-zinc-200 rounded-full blur-[100px]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="z-10 flex flex-col items-center"
          >
            <h1 className="text-3xl font-light tracking-[0.2em] text-zinc-800 mb-8">
              K<span className="opacity-50">A</span>
              <span className="font-medium">NIKA</span>
            </h1>

            <div className="h-[2px] w-48 bg-zinc-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-zinc-800"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
