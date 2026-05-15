import { useState, useEffect } from "react";
import { motion, AnimatePresence, usePresence } from "motion/react";

function TypewriterText() {
  const [isPresent, safeToRemove] = usePresence();
  const fullText1 = "OMAR";
  const fullText2 = " UR REHMAN";
  const fullString = fullText1 + fullText2;
  const [typedCount, setTypedCount] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (isPresent) {
      if (typedCount < fullString.length) {
        timeout = setTimeout(() => {
          setTypedCount((c) => c + 1);
        }, 50);
      }
    } else {
      if (typedCount > 0) {
        timeout = setTimeout(() => {
          setTypedCount((c) => c - 1);
        }, 25);
      } else {
        safeToRemove();
      }
    }
    
    return () => clearTimeout(timeout);
  }, [isPresent, typedCount, fullString.length, safeToRemove]);

  const text1 = fullText1.substring(0, Math.min(typedCount, fullText1.length));
  const text2 = fullText2.substring(0, Math.max(0, typedCount - fullText1.length));

  return (
    <div className="flex items-center justify-start font-serif text-white tracking-tight font-medium uppercase leading-[1] whitespace-nowrap">
      <div className="relative z-10 flex items-center">
        <span className="text-[1.25rem] md:text-[1.5rem] block">{text1}</span>
      </div>
      <div className="overflow-hidden flex relative z-0 items-center -ml-[0.1em]">
        <span className="text-[1.25rem] md:text-[1.5rem] block whitespace-nowrap pl-[0.1em]">
          {text2.replace(/^ /, '\u00A0')}
        </span>
      </div>
      <motion.div 
        animate={{ opacity: [1, 0, 1] }} 
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="w-[2px] md:w-[3px] h-[1.1rem] md:h-[1.3rem] bg-white ml-[4px]"
      />
    </div>
  );
}

function NodeMenu({ handleScroll }: { handleScroll: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY) > 10) {
        setIsLocked(false);
      }
      lastScrollY = window.scrollY;
    };
    
    if (isLocked) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLocked]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // trigger immediately
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = ["Contact", "Work", "About", "Experience"]; 
  const spacing = isMobile ? 60 : 85;
  const totalLength = links.length * spacing;
  const isOpen = isHovered || isLocked;

  return (
    <div 
      className="flex relative h-16 min-w-[250px] w-full max-w-[400px] justify-end items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center justify-end w-full h-full pr-1">
        {/* Main Root Node */}
        <div 
          onClick={() => setIsLocked(!isLocked)}
          className={`w-3 h-3 border-2 border-white rounded-full relative z-20 cursor-pointer hover:scale-125 transition-transform duration-300 flex items-center justify-center ${isLocked ? 'bg-white/80' : 'bg-transparent'}`}
        >
            <div className={`w-1 h-1 rounded-full ${isLocked ? 'bg-black' : 'bg-white'}`}></div>
        </div>
        
        {/* Central Trunk Line */}
        <motion.div
          className="absolute right-[10px] h-[1px] bg-white/30 origin-right pointer-events-none"
          initial={{ scaleX: 0 }}
          animate={isOpen ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ width: totalLength }}
        />
        
        {links.map((item, index) => {
          const distance = (index + 1) * spacing;
          
          return (
            <motion.div
              key={item}
              className="absolute right-[10px] flex flex-col items-center justify-center group"
              initial={{ x: 0, opacity: 0, scale: 0 }}
              animate={isOpen ? { x: -distance, opacity: 1, scale: 1 } : { x: 0, opacity: 0, scale: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: isOpen ? (index * 0.1 + 0.1) : 0, 
                ease: "backOut" 
              }}
            >
              <a
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleScroll(e, item.toLowerCase())}
                className="absolute bottom-4 text-white text-[10px] tracking-[0.2em] mb-1 uppercase whitespace-nowrap opacity-60 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pb-2 px-2 pointer-events-auto"
              >
                {item}
              </a>
              <a
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleScroll(e, item.toLowerCase())}
                className="flex items-center justify-center pointer-events-auto"
              >
                <div className="w-2 h-2 rounded-full border border-white bg-transparent z-10 transition-all duration-300 group-hover:bg-white group-hover:scale-150" />
              </a>
              
              {/* Branch connecting the node dot to the text */}
              <motion.div 
                className="absolute w-[1px] h-3 bg-white/40 bottom-2 origin-bottom pointer-events-none"
                initial={{ scaleY: 0 }}
                animate={isOpen ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.3, delay: isOpen ? (index * 0.1 + 0.3) : 0 }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      // Smooth scroll to the element
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 py-6 px-4 flex justify-between items-center z-[1000] mix-blend-difference text-white">
      <div className="font-serif text-lg md:text-2xl flex justify-start min-w-[150px] items-center">
        <AnimatePresence>
          {isScrolled && <TypewriterText key="typewriter" />}
        </AnimatePresence>
      </div>

      <NodeMenu handleScroll={handleScroll} />
    </nav>
  );
}
