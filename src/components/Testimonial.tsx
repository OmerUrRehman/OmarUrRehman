import { motion } from 'motion/react';

export default function Testimonial() {
  return (
    <section className="px-6 md:px-16 lg:px-32 py-32 relative">
      <motion.div 
        className="font-serif text-2xl md:text-4xl lg:text-5xl italic leading-relaxed tracking-tight max-w-[900px]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        "I am committed to adapting to the rapidly evolving AI landscape, constantly learning new tools to find faster and more efficient solutions to current technical problems."
      </motion.div>
      
      <motion.div 
        className="mt-8 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-10 h-[1px] bg-accent-dim"></div>
        <span className="text-xs tracking-[0.1em] text-secondary uppercase">Omar Ur Rehman - Personal Statement</span>
      </motion.div>
    </section>
  );
}
