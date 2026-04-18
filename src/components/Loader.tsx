import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  const text = "Omar Ur Rehman";

  return (
    <motion.div
      className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div
        layoutId="name"
        className="font-serif text-5xl md:text-7xl lg:text-8xl flex items-center justify-center text-primary whitespace-nowrap font-medium tracking-tight uppercase"
      >
        OMAR UR REHMAN
      </motion.div>
      <div className="w-[200px] h-[1px] bg-line mt-12 relative overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-accent"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="text-xs text-secondary mt-4 tracking-widest font-mono">
        {Math.floor(progress)}%
      </div>
    </motion.div>
  );
}
