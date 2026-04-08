import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function Experience() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const experiences = [
    {
      year: '2019',
      role: 'O-level & Intermediate (Sciences)',
      company: 'Pakistan International School Jeddah',
      desc: 'Completed sciences background, providing a strong foundation for technical and analytical pursuits.'
    },
    {
      year: '2020 — 2024',
      role: 'Bachelor of Science in Computer Science',
      company: 'DHA Suffa University',
      desc: 'Graduated with a focus on software development and data analysis. Currently preparing for international academic pursuits in Data Science and Machine Learning (IELTS 7.0).'
    },
    {
      year: 'Jul 2023 — Sep 2023',
      role: 'Data Analytics Intern',
      company: 'Cnergyico (BYCO)',
      desc: 'Worked with enterprise data warehousing to organize large datasets. Managed corporate web assets using HTML, CSS, and WordPress, and handled basic secure network configurations.'
    },
    {
      year: '2024 — Present',
      role: 'Freelance AI Developer & Consultant',
      company: 'Fiverr',
      desc: 'Deliver solutions including code debugging across Python, C++, and Java. Set up custom AI workflows to automate data processing, and use prompt engineering to generate visual assets.'
    }
  ];

  return (
    <section id="experience" className="px-6 md:px-16 lg:px-32 py-24 md:py-40 relative" ref={containerRef}>
      <motion.div 
        className="text-[0.7rem] tracking-[0.25em] uppercase text-accent-dim mb-4 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-[30px] h-[1px] bg-accent-dim"></div>
        <span className="text-[0.65rem] tracking-[0.15em] text-muted font-mono mr-2">02</span> Background
      </motion.div>
      
      <motion.h2 
        className="font-serif text-3xl md:text-5xl lg:text-6xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Education & Experience
      </motion.h2>

      <div className="relative pl-8 md:pl-12 mt-8">
        {/* Background line */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-line"></div>
        
        {/* Animated fill line */}
        <motion.div 
          className="absolute left-0 top-0 w-[2px] bg-accent origin-top -ml-[0.5px] z-0"
          style={{ height: lineHeight }}
        />
        
        {experiences.map((exp, i) => (
          <motion.div 
            key={i}
            className="py-6 relative group cursor-default"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Animated Dot */}
            <motion.div 
              className="absolute -left-[2.25rem] md:-left-[3.25rem] top-[3.5rem] w-2 h-2 rounded-full border-[1.5px] border-line bg-background z-10 transition-all duration-500 group-hover:scale-[2] group-hover:bg-accent group-hover:border-accent group-hover:shadow-[0_0_15px_rgba(229,193,88,0.5)]"
              whileInView={{ borderColor: '#e5c158' }}
              viewport={{ once: true, margin: "-100px" }}
            />
            
            {/* Interactive Card Wrapper */}
            <motion.div 
              className="p-6 md:p-8 rounded-xl border border-transparent transition-all duration-500 group-hover:bg-surface group-hover:border-line relative overflow-hidden"
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {/* Subtle gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-[0.7rem] tracking-[0.15em] text-accent-dim mb-3 font-mono transition-colors duration-300 group-hover:text-accent">{exp.year}</div>
                <div className="font-serif text-2xl md:text-3xl tracking-tight mb-1 transition-colors duration-300 group-hover:text-primary">{exp.role}</div>
                <div className="text-sm text-accent mb-4">{exp.company}</div>
                <p className="text-sm leading-relaxed text-secondary max-w-[500px] font-light group-hover:text-primary/80 transition-colors duration-300">{exp.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
