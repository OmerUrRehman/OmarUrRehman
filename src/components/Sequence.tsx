import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';

const sequenceData = [
  { title: 'AI & Machine Learning', desc: 'Developing predictive models and integrating LLMs to solve complex problems.' },
  { title: 'Web Development', desc: 'Building responsive, dynamic web applications with modern frameworks.' },
  { title: 'Data Analysis', desc: 'Extracting insights from large datasets using Python, MySQL, and Power BI.' },
  { title: 'Workflow Automation', desc: 'Streamlining processes and improving efficiency through intelligent scripting.' },
  { title: 'Software Engineering', desc: 'Writing clean, scalable code across multiple languages including Java and C++.' }
];

export default function Sequence() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 5 items, each takes 0.2 of the scroll space
    const newIndex = Math.min(4, Math.floor(latest * 5)); 
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  });

  // Progress for the current item (0 to 1)
  const itemProgress = useTransform(scrollYProgress, (latest) => {
    const index = Math.min(4, Math.floor(latest * 5));
    const progress = (latest - index * 0.2) * 5;
    return Math.max(0, Math.min(1, progress));
  });

  return (
    <section ref={ref} className="h-[600vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-12 md:top-24 left-8 md:left-16 z-20">
          <h2 className="font-mono text-sm tracking-[0.2em] uppercase text-secondary">What I Can Do</h2>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[90vw] md:w-[70vw] h-[50vh] md:h-[70vh] bg-surface rounded-lg relative overflow-hidden flex items-center justify-center">
            
            {/* Progress Bar at the top of the card */}
            <div className="absolute top-0 left-0 w-full h-1 bg-line z-30">
              <motion.div 
                className="h-full bg-accent"
                style={{ width: useTransform(itemProgress, v => `${v * 100}%`) }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {activeIndex === 0 && (
                  <svg viewBox="0 0 500 400" fill="none" className="w-[80%] h-[80%]">
                    <circle cx="250" cy="200" r="80" stroke="#e5c158" strokeWidth="1" opacity="0.5" strokeDasharray="4 4" />
                    <circle cx="250" cy="200" r="40" fill="#1a1a1a" stroke="#e5c158" strokeWidth="2" />
                    <path d="M250 120 L250 40 M250 280 L250 360 M170 200 L90 200 M330 200 L410 200" stroke="#e5c158" strokeWidth="1" opacity="0.7" />
                    <circle cx="250" cy="40" r="4" fill="#e5c158" />
                    <circle cx="250" cy="360" r="4" fill="#e5c158" />
                    <circle cx="90" cy="200" r="4" fill="#e5c158" />
                    <circle cx="410" cy="200" r="4" fill="#e5c158" />
                  </svg>
                )}
                {activeIndex === 1 && (
                  <svg viewBox="0 0 500 400" fill="none" className="w-[80%] h-[80%]">
                    <rect x="100" y="100" width="300" height="200" rx="8" stroke="#e5c158" strokeWidth="1" opacity="0.6" />
                    <rect x="100" y="100" width="300" height="30" rx="8" fill="#1a1a1a" />
                    <circle cx="120" cy="115" r="4" fill="#4a3a2a" />
                    <circle cx="135" cy="115" r="4" fill="#3a3a2a" />
                    <circle cx="150" cy="115" r="4" fill="#2a2a2a" />
                    <rect x="130" y="160" width="240" height="10" rx="2" fill="#1e1e1e" />
                    <rect x="130" y="190" width="180" height="10" rx="2" fill="#1e1e1e" />
                    <rect x="130" y="220" width="200" height="10" rx="2" fill="#1e1e1e" />
                  </svg>
                )}
                {activeIndex === 2 && (
                   <svg viewBox="0 0 500 400" fill="none" className="w-[80%] h-[80%]">
                     <rect x="100" y="250" width="40" height="50" fill="#e5c158" opacity="0.3" />
                     <rect x="160" y="200" width="40" height="100" fill="#e5c158" opacity="0.5" />
                     <rect x="220" y="120" width="40" height="180" fill="#e5c158" opacity="0.7" />
                     <rect x="280" y="180" width="40" height="120" fill="#e5c158" opacity="0.4" />
                     <rect x="340" y="80" width="40" height="220" fill="#e5c158" opacity="0.9" />
                     <line x1="80" y1="300" x2="420" y2="300" stroke="#1e1e1e" strokeWidth="2" />
                   </svg>
                )}
                {activeIndex === 3 && (
                  <svg viewBox="0 0 500 400" fill="none" className="w-[80%] h-[80%]">
                    <rect x="150" y="80" width="200" height="40" rx="4" stroke="#e5c158" strokeWidth="1" opacity="0.8" />
                    <rect x="150" y="180" width="200" height="40" rx="4" stroke="#e5c158" strokeWidth="1" opacity="0.5" />
                    <rect x="150" y="280" width="200" height="40" rx="4" stroke="#e5c158" strokeWidth="1" opacity="0.3" />
                    <path d="M250 120 L250 170 M245 165 L250 170 L255 165" stroke="#e5c158" strokeWidth="1" />
                    <path d="M250 220 L250 270 M245 265 L250 270 L255 265" stroke="#e5c158" strokeWidth="1" />
                  </svg>
                )}
                {activeIndex === 4 && (
                  <svg viewBox="0 0 500 400" fill="none" className="w-[80%] h-[80%]">
                    <path d="M150 150 L100 200 L150 250" stroke="#e5c158" strokeWidth="2" fill="none" opacity="0.7" />
                    <path d="M350 150 L400 200 L350 250" stroke="#e5c158" strokeWidth="2" fill="none" opacity="0.7" />
                    <path d="M270 100 L230 300" stroke="#e5c158" strokeWidth="2" fill="none" opacity="0.4" />
                  </svg>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-8 md:bottom-16 left-8 md:left-16 right-8 md:right-16 z-10 h-[120px] md:h-[100px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="absolute top-0 left-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h2 className="font-serif text-2xl md:text-5xl tracking-tight mb-2">
                {sequenceData[activeIndex].title}
              </h2>
              <p className="text-sm text-secondary max-w-[400px]">
                {sequenceData[activeIndex].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="relative flex items-center justify-center w-1.5 h-8">
              {/* Background track */}
              <div className="absolute w-full h-full bg-muted rounded-full" />
              
              {/* Active fill */}
              {activeIndex === i && (
                <motion.div 
                  className="absolute w-full bg-accent rounded-full top-0 shadow-[0_0_10px_rgba(229,193,88,0.3)]"
                  style={{ height: useTransform(itemProgress, v => `${v * 100}%`) }}
                />
              )}
              {/* Completed fill */}
              {activeIndex > i && (
                <div className="absolute w-full h-full bg-accent rounded-full top-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
