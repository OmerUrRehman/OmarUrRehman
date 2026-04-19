import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Binary, Database, BrainCircuit, Cpu } from "lucide-react";

const ICONS = [
  { id: 'O', component: Binary },
  { id: 'M', component: Database },
  { id: 'A', component: BrainCircuit },
  { id: 'R', component: Cpu },
];

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let mounted = true;
    const sequence = async () => {
      await new Promise((r) => setTimeout(r, 400));
      if (!mounted) return;
      setStep(1); // O
      await new Promise((r) => setTimeout(r, 600));
      if (!mounted) return;
      setStep(2); // OM
      await new Promise((r) => setTimeout(r, 600));
      if (!mounted) return;
      setStep(3); // OMA
      await new Promise((r) => setTimeout(r, 600));
      if (!mounted) return;
      setStep(4); // OMAR
      await new Promise((r) => setTimeout(r, 800)); // Pause while all 4 icons show
      if (!mounted) return;
      setStep(5); // FLIP TO LETTERS (Icons fade out, real text fades in)
      await new Promise((r) => setTimeout(r, 1000)); // Wait for flip
      if (!mounted) return;
      setStep(6); // MERGE TO TEXT & SLIDE 'UR REHMAN' OUT
      await new Promise((r) => setTimeout(r, 1800)); // Wait for slide out to settle
      if (!mounted) return;
      onComplete();
    };
    sequence();
    return () => {
      mounted = false;
    };
  }, [onComplete]);

  return (
    <motion.div 
      key="loader-container" 
      className="fixed inset-0 z-[9999] pointer-events-none" 
      exit={{ opacity: 1 }} 
      transition={{ duration: 1.4 }}
    >
      <motion.div
        className="absolute inset-0 bg-background pointer-events-auto"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative h-[150px] w-full flex items-center justify-center -mt-12 pointer-events-auto">
          <motion.div
             layoutId="hero-text"
             className="flex items-center justify-center font-serif text-primary tracking-tight font-medium uppercase leading-[1] whitespace-nowrap"
             transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="relative z-10 flex items-center">
              <motion.span
                className="text-[3.5rem] md:text-[4.5rem] block"
                initial={{ opacity: 0 }}
                animate={{ opacity: step >= 6 ? 1 : 0 }}
                transition={{ duration: 0.1 }}
              >
                OMAR
              </motion.span>
            
              <AnimatePresence>
                {step < 6 && (
                  <motion.div
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <AnimatePresence mode="popLayout">
                      {ICONS.slice(0, step > 4 ? 4 : step).map((item) => {
                        const Icon = item.component;
                        return (
                           <motion.div
                              layout
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.5, x: 40 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                              className="relative w-16 h-20 md:w-20 md:h-24 mx-1 md:mx-2 flex items-center justify-center transform-gpu"
                              style={{ perspective: 1000 }}
                           >
                              <motion.div
                                 className="w-full h-full absolute inset-0 transform-gpu"
                                 animate={{ rotateY: step >= 5 ? 180 : 0 }}
                                 transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                                 style={{ transformStyle: "preserve-3d" }}
                              >
                                 {/* FRONT FACE */}
                                 <div
                                    className="absolute inset-0 w-full h-full flex items-center justify-center text-accent"
                                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                                 >
                                    <Icon size={44} strokeWidth={1.5} />
                                 </div>
                                 {/* BACK FACE -> Actually display the letter */}
                                 <div
                                    className="absolute inset-0 w-full h-full flex items-center justify-center text-[3.5rem] md:text-[4.5rem] tracking-tight text-primary font-serif font-medium"
                                    style={{ 
                                      backfaceVisibility: "hidden", 
                                      WebkitBackfaceVisibility: "hidden", 
                                      transform: "rotateY(180deg)" 
                                    }}
                                 >
                                    {item.id}
                                 </div>
                              </motion.div>
                           </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wrapper dictates presence, inner controls mask slide without disrupting flex width reflow jitter */}
            <AnimatePresence>
              {step >= 6 && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
                  className="overflow-hidden flex relative z-0 items-center -ml-[0.1em]"
                >
                  <motion.span
                    initial={{ x: "-100%", filter: "blur(12px)" }}
                    animate={{ x: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
                    className="text-[3.5rem] md:text-[4.5rem] block whitespace-nowrap pl-[0.1em]"
                  >
                    &nbsp;UR REHMAN
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-12 flex flex-col items-center gap-3 pointer-events-auto w-full z-[9999]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-[0.55rem] text-secondary tracking-[0.2em] uppercase h-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={step}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
              >
                {step === 0 && "Initializing Runtime..."}
                {step === 1 && "Connecting Data Stream"}
                {step === 2 && "Synthesizing Architecture"}
                {step === 3 && "Training Neural Nets"}
                {step === 4 && "Optimizing Compute"}
                {step === 5 && "Matrix Execution"}
                {step >= 6 && "Identity Unlocked"}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="w-[150px] h-[1px] bg-line overflow-hidden relative">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min((step / 4) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
