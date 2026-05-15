import React, { useState } from "react";
import { motion } from "motion/react";

interface LiquidButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export function LiquidButton({
  text,
  onClick,
  className = "",
  href,
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Tag = href ? "a" : "button";

  return (
    <div className={`relative inline-block ${className}`}>
      <svg className="absolute w-0 h-0" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>

      <Tag
        href={href}
        // @ts-ignore
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full inline-flex items-center justify-center px-8 py-4 sm:min-w-[240px] cursor-pointer outline-none bg-transparent"
      >
        <div 
          className="absolute inset-0 -z-10"
          style={{ filter: "url(#goo)" }}
        >
          {/* Main button shape */}
          <div className="absolute inset-0 bg-background rounded-full border border-line/50 group-hover:bg-accent group-hover:border-accent transition-colors duration-500"></div>
          
          {/* Dripping shapes when hovered */}
          {/* Bulges */}
          <motion.div
            initial={false}
            animate={isHovered ? { y: 15 } : { y: 0 }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatType: "reverse", ease: "easeInOut", delay: isHovered ? 0.3 : 0 }}
            className="absolute bottom-0 left-[15%] w-8 h-8 rounded-full bg-background group-hover:bg-accent transition-colors duration-500"
          ></motion.div>
          <motion.div
            initial={false}
            animate={isHovered ? { y: 22 } : { y: 0 }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, repeatType: "reverse", ease: "easeInOut", delay: isHovered ? 0.5 : 0 }}
            className="absolute bottom-0 left-[50%] -translate-x-1/2 w-10 h-10 rounded-full bg-background group-hover:bg-accent transition-colors duration-500"
          ></motion.div>
          <motion.div
            initial={false}
            animate={isHovered ? { y: 12 } : { y: 0 }}
            transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0, repeatType: "reverse", ease: "easeInOut", delay: isHovered ? 0.7 : 0 }}
            className="absolute bottom-0 right-[20%] w-7 h-7 rounded-full bg-background group-hover:bg-accent transition-colors duration-500"
          ></motion.div>

          {/* Drips */}
          <motion.div
            initial={false}
            animate={isHovered ? { y: [0, 100], scale: [1, 0] } : { y: 0, scale: 0 }}
            transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0, ease: "easeIn", delay: isHovered ? 0.4 : 0 }}
            className="absolute bottom-0 left-[18%] w-5 h-5 bg-background group-hover:bg-accent transition-colors duration-500 rounded-full"
          ></motion.div>
          <motion.div
            initial={false}
            animate={isHovered ? { y: [0, 120], scale: [1.2, 0] } : { y: 0, scale: 0 }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "easeIn", delay: isHovered ? 0.8 : 0 }}
            className="absolute bottom-0 left-[50%] -translate-x-1/2 w-6 h-6 bg-background group-hover:bg-accent transition-colors duration-500 rounded-full"
          ></motion.div>
          <motion.div
            initial={false}
            animate={isHovered ? { y: [0, 80], scale: [1, 0] } : { y: 0, scale: 0 }}
            transition={{ duration: 1.1, repeat: isHovered ? Infinity : 0, ease: "easeIn", delay: isHovered ? 0.3 : 0 }}
            className="absolute bottom-0 right-[22%] w-4 h-4 bg-background group-hover:bg-accent transition-colors duration-500 rounded-full"
          ></motion.div>
          
          {/* Top Bulges for gooey effect entering the button (slight bounce on top) */}
          <motion.div
            initial={false}
            animate={isHovered ? { y: -8 } : { y: 0 }}
            transition={{ duration: 1.1, repeat: isHovered ? Infinity : 0, repeatType: "reverse", ease: "easeInOut", delay: isHovered ? 0.6 : 0 }}
            className="absolute top-0 left-[30%] w-8 h-8 rounded-full bg-background group-hover:bg-accent transition-colors duration-500"
          ></motion.div>
            <motion.div
            initial={false}
            animate={isHovered ? { y: -10 } : { y: 0 }}
            transition={{ duration: 1.4, repeat: isHovered ? Infinity : 0, repeatType: "reverse", ease: "easeInOut", delay: isHovered ? 1.0 : 0 }}
            className="absolute top-0 right-[35%] w-6 h-6 rounded-full bg-background group-hover:bg-accent transition-colors duration-500"
          ></motion.div>
        </div>
        
        <span className="relative z-10 text-xs sm:text-sm tracking-[0.1em] uppercase text-primary group-hover:text-background transition-colors duration-300 font-bold whitespace-nowrap">
          {text}
        </span>
      </Tag>
    </div>
  );
}
