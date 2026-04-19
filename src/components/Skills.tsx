import { motion } from 'motion/react';
import { Code2, Database, Bot, MonitorPlay } from 'lucide-react';

export default function Skills() {
  const skills = [
    {
      icon: <Code2 className="w-10 h-10 mb-6 text-accent" strokeWidth={1.5} />,
      name: 'Core Programming',
      desc: 'Python, C++, Java, JavaScript. Building functional logic and debugging across multiple environments.',
      level: 90
    },
    {
      icon: <Database className="w-10 h-10 mb-6 text-accent" strokeWidth={1.5} />,
      name: 'Web & Database',
      desc: 'HTML5, CSS3, WordPress, MySQL. Managing corporate web assets and database architecture.',
      level: 85
    },
    {
      icon: <Bot className="w-10 h-10 mb-6 text-accent" strokeWidth={1.5} />,
      name: 'Data Science & AI',
      desc: 'Machine Learning, Data Warehousing, LLM Prompt Engineering, AI Workflow Automation.',
      level: 95
    },
    {
      icon: <MonitorPlay className="w-10 h-10 mb-6 text-accent" strokeWidth={1.5} />,
      name: 'Creative & Tools',
      desc: 'DaVinci Resolve, Adobe Lightroom, Git, Microsoft Office Suite. Applying technical precision to creative work.',
      level: 80
    }
  ];

  return (
    <section id="about" className="px-6 md:px-16 lg:px-32 py-24 md:py-40 relative">
      <motion.div 
        className="text-[0.7rem] tracking-[0.25em] uppercase text-accent mb-4 flex items-center gap-4 font-semibold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-[30px] h-[1px] bg-accent"></div>
        <span className="text-[0.65rem] tracking-[0.15em] text-primary font-mono mr-2">03</span> Skills
      </motion.div>
      
      <motion.h2 
        className="font-serif text-3xl md:text-5xl lg:text-6xl mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Technical Skills & Tools
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {skills.map((skill, i) => (
          <motion.div 
            key={i}
            className="glass-card rounded-2xl p-10 group hover-target transition-all duration-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-500 ease-out group-hover:w-full"></div>
            {skill.icon}
            <div className="text-base font-medium mb-3 tracking-tight">{skill.name}</div>
            <p className="text-xs text-secondary leading-relaxed font-light">{skill.desc}</p>
            
            <div className="mt-8 h-[2px] bg-line rounded-sm overflow-hidden">
              <motion.div 
                className="h-full bg-accent rounded-sm"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5 + i * 0.1, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
