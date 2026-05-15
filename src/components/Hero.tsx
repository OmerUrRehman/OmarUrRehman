import { motion } from "motion/react";

export default function Hero() {
  return (
    <section id="hero-section" className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      <div className="relative w-full max-w-5xl h-screen flex items-center justify-center">
        
        {/* Back Text (Solid Fill) */}
        <motion.div
           className="absolute z-0 flex items-center justify-center font-serif tracking-tight font-medium uppercase leading-[1] pointer-events-none translate-y-16 md:translate-y-32"
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          <span className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] block text-white drop-shadow-2xl">
            OMAR
          </span>
        </motion.div>

        {/* Hand Image (Middle Layer) */}
        <motion.div
           className="absolute z-10 flex items-center justify-center cursor-pointer"
           initial="initial"
           animate="animate"
           whileHover="hover"
        >
          {/* Subtle Glow Behind the Hand */}
          <motion.div 
            className="absolute w-[200px] h-[300px] md:w-[350px] md:h-[450px] bg-accent/20 rounded-full blur-[80px] pointer-events-none" 
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 0 },
              hover: { opacity: 1 }
            }}
            transition={{ duration: 0.4 }}
          />
          
          <motion.img 
            src="/hand.png" 
            alt="Robotic Hand" 
            className="w-[280px] sm:w-[350px] md:w-[450px] lg:w-[500px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10"
            variants={{
              initial: { opacity: 0, scale: 0.85, y: 80 },
              animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 } },
              hover: { y: -15, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/600x800/0a0b0d/333?text=Upload+transparent+hand+as+public/hand.png";
            }}
          />
        </motion.div>

        {/* Front Text (Outline Only) */}
        <motion.div
           className="absolute z-20 flex items-center justify-center font-serif tracking-tight font-medium uppercase leading-[1] pointer-events-none translate-y-16 md:translate-y-32"
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        >
          <span 
            className="text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[12rem] block"
            style={{ 
              color: 'transparent', 
              WebkitTextStroke: '2px rgba(255, 255, 255, 0.9)' 
            }}
          >
            OMAR
          </span>
        </motion.div>

      </div>

      {/* Scroll indicator - Right aligned */}
      <div className="absolute flex justify-between items-end bottom-12 right-2 md:right-4 h-auto w-auto z-30">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span
            className="text-[0.6rem] tracking-[0.3em] uppercase text-accent/80 font-mono"
            style={{ writingMode: "vertical-rl" }}
          >
            SCROLL
          </span>
          <div className="w-[1px] h-[60px] bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute left-0 w-full h-full bg-accent"
              animate={{ top: ["-100%", "100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

