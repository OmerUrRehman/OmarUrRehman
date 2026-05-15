import { motion } from 'motion/react';
import { LiquidButton } from './rareui/LiquidButton';

export default function Contact() {
  return (
    <section id="contact" className="px-6 md:px-16 lg:px-32 min-h-[calc(100vh-60px)] flex flex-col justify-center relative border-t border-line overflow-hidden w-full">
      <div className="relative w-full z-10 pointer-events-none">
        <motion.div 
          className="text-[0.7rem] tracking-[0.25em] uppercase text-accent mb-4 font-semibold w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Get in Touch
        </motion.div>
        
        <div className="relative w-full flex flex-col gap-8 md:gap-16">
          <motion.h2 
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-none shrink-0"
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
            className="flex flex-col md:flex-row justify-end gap-6 pointer-events-auto w-full mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <LiquidButton 
              href="mailto:omerurrehman123@gmail.com" 
              text="omerurrehman123@gmail.com" 
              className="w-full md:w-auto" 
            />
            <LiquidButton 
              href="tel:+923321305958" 
              text="+92 332 1305958" 
              className="w-full md:w-auto" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
