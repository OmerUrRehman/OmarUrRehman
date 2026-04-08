import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 py-6 px-6 md:px-12 flex justify-between items-center z-[1000] mix-blend-difference">
      <div className="font-sans font-semibold text-[0.85rem] tracking-[0.15em] uppercase text-primary">
        Omar Ur Rehman
      </div>
      
      <div className="hidden md:flex gap-8">
        {['Work', 'About', 'Experience', 'Contact'].map((item) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase()}`} 
            className="text-secondary text-[0.75rem] tracking-[0.1em] uppercase transition-colors hover:text-primary relative group hover-target"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"></span>
          </a>
        ))}
      </div>

      <div 
        className="md:hidden flex flex-col gap-[6px] cursor-pointer p-2 hover-target"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`w-6 h-[1.5px] bg-primary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`}></span>
        <span className={`w-6 h-[1.5px] bg-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-6 h-[1.5px] bg-primary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`}></span>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-background/95 flex flex-col items-center justify-center gap-8 z-[-1]">
          {['Work', 'About', 'Experience', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-primary text-2xl tracking-[0.1em] uppercase"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
