import { motion } from "motion/react";
import BackgroundAnimation from "./BackgroundAnimation";

export default function Hero({ isScrolled }: { isScrolled: boolean }) {
  return (
    <section className="min-h-screen flex flex-col justify-end items-center px-6 md:px-16 lg:px-32 relative overflow-hidden pb-20 md:pb-24">
      <BackgroundAnimation />

      <div className="relative z-10 h-[120px] md:h-[150px] flex items-center justify-center w-full">
        {!isScrolled && (
          <motion.div
            layoutId="name"
            className="font-serif text-[10vw] md:text-[8vw] flex items-center justify-center text-primary whitespace-nowrap leading-[1] font-medium tracking-tight uppercase"
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          >
            OMAR UR REHMAN
          </motion.div>
        )}
      </div>

      <motion.div
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span
          className="text-[0.65rem] tracking-[0.2em] uppercase text-accent font-semibold"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <div className="w-[1px] h-[60px] bg-accent/30 relative overflow-hidden">
          <motion.div
            className="absolute left-0 w-full h-full bg-accent"
            animate={{ top: ["-100%", "100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
      <div className="absolute bottom-8 left-6 md:left-16 lg:left-32 z-10">
        <div className="font-mono text-[0.55rem] text-secondary tracking-[0.08em] leading-[1.8] opacity-0 animate-[fadeIn_2s_ease_forwards_2s]">
          Somewhere between math & magic
          <br />© 2026 VANTA LAB
        </div>
      </div>
    </section>
  );
}
