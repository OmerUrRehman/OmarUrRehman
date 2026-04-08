import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function Marquee() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const x = useTransform(scrollYProgress, [0, 1], [0, -500]);

  return (
    <div ref={ref} className="py-[10vh] overflow-hidden relative">
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        <span className="font-serif text-[clamp(6rem,18vw,20rem)] font-bold text-stroke-filled pr-[1em] shrink-0 select-none">Python</span>
        <span className="font-serif text-[clamp(6rem,18vw,20rem)] font-bold text-stroke pr-[1em] shrink-0 select-none">Machine Learning</span>
        <span className="font-serif text-[clamp(6rem,18vw,20rem)] font-bold text-stroke-filled pr-[1em] shrink-0 select-none">Web Dev</span>
        <span className="font-serif text-[clamp(6rem,18vw,20rem)] font-bold text-stroke pr-[1em] shrink-0 select-none">Data Analysis</span>
        <span className="font-serif text-[clamp(6rem,18vw,20rem)] font-bold text-stroke-filled pr-[1em] shrink-0 select-none">AI Automation</span>
      </motion.div>
    </div>
  );
}
