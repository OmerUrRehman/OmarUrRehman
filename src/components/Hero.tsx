import { motion } from 'motion/react';
import BackgroundAnimation from './BackgroundAnimation';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-32 relative overflow-hidden pt-24">
      <BackgroundAnimation />
      
      <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl leading-[1.05] tracking-tight max-w-[900px] text-primary relative z-10">
        <span className="block overflow-hidden"><motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}>Hi, I'm Omer.</motion.span></span>
        <span className="block overflow-hidden"><motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.3, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}>I build software,</motion.span></span>
        <span className="block overflow-hidden"><motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.4, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}>AI models, and</motion.span></span>
        <span className="block overflow-hidden"><motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.65, 0, 0.35, 1] }}>web applications.</motion.span></span>
      </h1>
      
      <motion.p 
        className="max-w-[420px] text-base leading-relaxed text-secondary mt-10 font-light relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        I am a Computer Science graduate from DHA Suffa University. I build solutions that bridge the gap between data and web development, and I use AI tools to automate workflows and speed up the development process.
      </motion.p>
      
      <motion.div 
        className="absolute bottom-12 right-6 md:right-16 lg:right-32 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-[0.65rem] tracking-[0.2em] uppercase text-muted" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-[1px] h-[60px] bg-line relative overflow-hidden">
          <motion.div 
            className="absolute left-0 w-full h-full bg-accent"
            animate={{ top: ['-100%', '100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
      <div className="absolute bottom-8 left-6 md:left-16 lg:left-32 z-10">
        <div className="font-mono text-[0.55rem] text-secondary tracking-[0.08em] leading-[1.8] opacity-0 animate-[fadeIn_2s_ease_forwards_2s]">
          Somewhere between math & magic<br />
          © 2026 VANTA LAB
        </div>
      </div>
    </section>
  );
}
