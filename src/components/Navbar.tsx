import { useState } from "react";
import { motion } from "motion/react";

export default function Navbar({ isScrolled }: { isScrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      // Close mobile menu if open
      setMenuOpen(false);
      
      // Smooth scroll to the element
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 py-6 px-6 md:px-12 flex justify-between items-center z-[1000] mix-blend-difference text-white">
      <div className="font-serif text-lg md:text-2xl flex justify-start min-w-[200px]">
        {isScrolled && (
          <motion.div
            layoutId="hero-text"
            className="flex items-center justify-start font-serif text-white tracking-tight font-medium uppercase leading-[1] whitespace-nowrap origin-left"
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
          >
            <div className="relative z-10 flex items-center">
              <span className="text-[1.25rem] md:text-[1.5rem] block">OMAR</span>
            </div>
            <div className="overflow-hidden flex relative z-0 items-center -ml-[0.1em]">
              <span className="text-[1.25rem] md:text-[1.5rem] block whitespace-nowrap pl-[0.1em]">&nbsp;UR REHMAN</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="hidden md:flex gap-8 items-center">
        {["Experience", "About", "Work", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={(e) => handleScroll(e, item.toLowerCase())}
            className="text-accent/80 text-[0.75rem] tracking-[0.1em] uppercase transition-colors hover:text-accent relative group hover-target"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </a>
        ))}
      </div>

      <div className="md:hidden flex items-center gap-4">
        <div
          className="flex flex-col gap-[6px] cursor-pointer p-2 hover-target"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span
            className={`w-6 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7.5px]" : ""}`}
          ></span>
          <span
            className={`w-6 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`w-6 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`}
          ></span>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-background/95 flex flex-col items-center justify-center gap-8 z-[-1] mix-blend-normal text-primary">
          {["Experience", "About", "Work", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-accent text-2xl tracking-[0.1em] uppercase"
              onClick={(e) => handleScroll(e, item.toLowerCase())}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
