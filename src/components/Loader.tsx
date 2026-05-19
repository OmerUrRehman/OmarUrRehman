import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

const CODE_LINES = [
  { text: 'const ', color: 'text-white' },
  { text: 'developer ', color: 'text-white' },
  { text: '= ', color: 'text-white' },
  { text: '"OMAR UR REHMAN"', color: 'text-accent' },
  { text: ';\n', color: 'text-white' },
  { text: 'console', color: 'text-white' },
  { text: '.', color: 'text-white' },
  { text: 'log', color: 'text-white' },
  { text: '(', color: 'text-white' },
  { text: 'developer', color: 'text-white' },
  { text: ');', color: 'text-white' }
];

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [typedChars, setTypedChars] = useState(0);
  const [totalLength, setTotalLength] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    const fullString = CODE_LINES.map(l => l.text).join("");
    setTotalLength(fullString.length);

    const typeCode = async () => {
      // Preload image
      const preloadPromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve; // Continue even if it fails
        img.src = "/hand.png";
        if (img.complete) resolve(true);
      });

      await new Promise(r => setTimeout(r, 600)); // Initial delay
      
      for (let i = 1; i <= fullString.length; i++) {
        if (!mounted) return;
        setTypedChars(i);
        // Vary typing speed a little bit
        await new Promise(r => setTimeout(r, Math.random() * 40 + 20));
        
        // Pause at newline
        if (fullString[i - 1] === '\n') {
          await new Promise(r => setTimeout(r, 300));
        }
      }
      
      await new Promise(r => setTimeout(r, 800)); // Wait before swiping up
      
      // Ensure image is loaded before completing
      await preloadPromise;

      if (!mounted) return;
      onComplete(); // Triggers the layout shift to Hero
    };

    typeCode();
    return () => { mounted = false; };
  }, [onComplete]);

  // Helper to render typed code with coloring
  const renderCode = () => {
    let charCount = 0;
    const elements = [];

    for (let i = 0; i < CODE_LINES.length; i++) {
      const segment = CODE_LINES[i];
      const segmentLen = segment.text.length;
      
      if (charCount + segmentLen <= typedChars) {
        // Fully typed segment
        elements.push(<span key={i} className={segment.color}>{segment.text}</span>);
        charCount += segmentLen;
      } else if (charCount < typedChars) {
        // Partially typed segment
        const remaining = typedChars - charCount;
        elements.push(<span key={i} className={segment.color}>{segment.text.substring(0, remaining)}</span>);
        break; // Stop here as we've hit the limit
      } else {
        break;
      }
    }
    
    return elements;
  };

  return (
    <motion.div 
      key="loader-container" 
      className="fixed inset-0 z-[9999] pointer-events-auto bg-background" 
      exit={{ y: "-100%" }} 
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 flex pointer-events-none">
        
        {/* Minimal Editor */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 lg:top-16 lg:left-16 font-mono text-sm md:text-base leading-[1.8]">
          <div className="flex flex-col whitespace-pre-wrap">
              {renderCode()}
              {/* Blinking cursor */}
              {typedChars < totalLength && (
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-white/80 translate-y-1 ml-[2px]"
                />
              )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
