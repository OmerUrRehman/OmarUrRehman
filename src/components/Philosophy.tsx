import { motion } from 'motion/react';

export default function Philosophy() {
  const items = [
    { num: '01', title: 'Data Science & ML', desc: 'Focusing my career trajectory toward advanced data science, machine learning algorithms, and data architecture.' },
    { num: '02', title: 'AI Integration', desc: 'Leveraging AI tools to accelerate development, automate workflows, and find efficient solutions to complex problems.' },
    { num: '03', title: 'Software Debugging', desc: 'Diving into codebases across Python, Java, and C++ to troubleshoot issues and improve software stability.' },
    { num: '04', title: 'Creative Media', desc: 'Applying technical precision to creative work, including video editing and color grading with DaVinci Resolve.' }
  ];

  return (
    <section className="px-6 md:px-16 lg:px-32 py-24 md:py-40 relative">
      <motion.div 
        className="text-[0.7rem] tracking-[0.25em] uppercase text-accent-dim mb-4 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-[30px] h-[1px] bg-accent-dim"></div>
        Interests
      </motion.div>
      
      <motion.h2 
        className="font-serif text-3xl md:text-5xl lg:text-6xl mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        My Current Interests
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-12">
        {items.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="font-serif text-5xl text-accent-dim mb-4">{item.num}</div>
            <div className="text-lg font-medium mb-3 tracking-tight">{item.title}</div>
            <p className="text-sm text-secondary leading-relaxed font-light">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
