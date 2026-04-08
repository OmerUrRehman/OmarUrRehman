import { motion } from 'motion/react';
import LiquidGoldReveal from './LiquidGoldReveal';

export default function Contact() {
  return (
    <section id="contact" className="px-6 md:px-16 lg:px-32 min-h-[80vh] flex flex-col justify-center relative border-t border-line overflow-hidden">
      <LiquidGoldReveal />
      
      <div className="relative z-10 pointer-events-none">
        <motion.div 
          className="text-[0.7rem] tracking-[0.25em] uppercase text-accent-dim mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get in Touch
        </motion.div>
        
        <motion.h2 
          className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a href="mailto:omerurrehman123@gmail.com" className="relative text-primary transition-colors duration-300 group pointer-events-auto">
            Let's build<br/>something<br/>together.
            <span className="absolute bottom-[0.05em] left-0 w-full h-[2px] bg-accent scale-x-0 origin-right transition-transform duration-600 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100 group-hover:origin-left"></span>
          </a>
        </motion.h2>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-4 md:gap-6 mt-12 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a href="mailto:omerurrehman123@gmail.com" className="px-6 py-3 rounded-full border border-line/50 bg-background/40 backdrop-blur-md text-xs tracking-[0.1em] uppercase text-primary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300 flex items-center justify-center">
            omerurrehman123@gmail.com
          </a>
          <a href="tel:+923321305958" className="px-6 py-3 rounded-full border border-line/50 bg-background/40 backdrop-blur-md text-xs tracking-[0.1em] uppercase text-primary hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-300 flex items-center justify-center">
            +92 332 1305958
          </a>
        </motion.div>
      </div>
    </section>
  );
}
