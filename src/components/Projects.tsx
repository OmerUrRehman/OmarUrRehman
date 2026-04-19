import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      tag: 'Machine Learning / Research',
      title: 'Credit Card Fraud Detection',
      desc: 'Authored a research paper and built a machine learning model for fraud detection. Tested predictive algorithms and analyzed data to improve model accuracy.',
      tech: ['Python', 'Machine Learning', 'Data Analysis'],
      link: 'https://credit-card-fraud-detection-website.vercel.app'
    },
    {
      tag: 'NLP / Classification',
      title: 'Spam Detection Model',
      desc: 'Created a Python-based spam detection tool. Used text classification and data preprocessing pipelines to filter out malicious content.',
      tech: ['Python', 'NLP', 'Text Classification'],
      link: 'https://github.com/OmerUrRehman/Email-Spam-Detection'
    },
    {
      tag: 'Software & Environments',
      title: 'Interactive Apps & Algorithms',
      desc: 'Built mobile applications using Android Studio and explored 3D environments with Unreal Engine. Developed diagnostic software in Java and Python to process datasets.',
      tech: ['Android Studio', 'Unreal Engine', 'Java', 'Python']
    }
  ];

  return (
    <section id="work" className="px-6 md:px-16 lg:px-32 py-24 md:py-40 relative">
      <motion.div 
        className="text-[0.7rem] tracking-[0.25em] uppercase text-accent mb-4 flex items-center gap-4 font-semibold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="w-[30px] h-[1px] bg-accent"></div>
        <span className="text-[0.65rem] tracking-[0.15em] text-primary font-mono mr-2">04</span> Portfolio
      </motion.div>
      
      <motion.h2 
        className="font-serif text-3xl md:text-5xl lg:text-6xl mb-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Featured Projects
      </motion.h2>

      <div className="grid gap-16 mt-16">
        {projects.map((project, i) => (
          <motion.div 
            key={i}
            className={`glass-card rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-16 items-center transition-all duration-500 ${i % 2 !== 0 ? 'md:grid-cols-[1fr_1.2fr]' : ''}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={`aspect-video md:aspect-[4/3] bg-black/40 rounded-xl relative overflow-hidden group hover-target ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-105">
                {/* Abstract Visuals based on index */}
                {i === 0 && (
                  <svg viewBox="0 0 500 375" fill="none" className="w-full h-full">
                    <rect width="500" height="375" fill="#111"/>
                    <path d="M50 250 Q150 150 250 200 T450 100" stroke="#e5c158" strokeWidth="2" fill="none" opacity="0.8"/>
                    <circle cx="250" cy="200" r="6" fill="#e5c158"/>
                    <circle cx="450" cy="100" r="6" fill="#e5c158"/>
                    <rect x="100" y="80" width="120" height="80" rx="4" fill="#1a1a1a" stroke="#2a2a2a"/>
                    <line x1="120" y1="100" x2="200" y2="100" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round"/>
                    <line x1="120" y1="120" x2="180" y2="120" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                )}
                {i === 1 && (
                  <svg viewBox="0 0 500 375" fill="none" className="w-full h-full">
                    <rect width="500" height="375" fill="#111"/>
                    <rect x="150" y="100" width="200" height="175" rx="8" stroke="#e5c158" strokeWidth="1" opacity="0.5"/>
                    <path d="M180 150 L220 150 M180 180 L280 180 M180 210 L250 210" stroke="#4a4a4a" strokeWidth="4" strokeLinecap="round"/>
                    <circle cx="300" cy="150" r="15" fill="#e5c158" opacity="0.2"/>
                    <circle cx="300" cy="150" r="5" fill="#e5c158"/>
                  </svg>
                )}
                {i === 2 && (
                  <svg viewBox="0 0 500 375" fill="none" className="w-full h-full">
                    <rect width="500" height="375" fill="#111"/>
                    <rect x="100" y="80" width="140" height="215" rx="12" stroke="#e5c158" strokeWidth="1" opacity="0.6"/>
                    <rect x="260" y="120" width="140" height="175" rx="4" fill="#1a1a1a" stroke="#2a2a2a"/>
                    <circle cx="170" cy="260" r="10" stroke="#e5c158" strokeWidth="1"/>
                  </svg>
                )}
              </div>
            </div>
            
            <div className={i % 2 !== 0 ? 'md:order-1' : ''}>
              <div className="text-[0.65rem] tracking-[0.2em] uppercase text-accent mb-4 font-semibold">{project.tag}</div>
              <h3 className="font-serif text-2xl md:text-4xl tracking-tight mb-4">{project.title}</h3>
              <p className="text-sm text-secondary leading-relaxed font-light mb-8">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, j) => (
                  <span key={j} className="text-[0.65rem] tracking-[0.1em] uppercase px-3 py-1.5 border border-line rounded-sm text-secondary transition-colors hover:border-accent-dim hover:text-accent">
                    {t}
                  </span>
                ))}
              </div>
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-primary hover:text-accent transition-colors hover-target">
                  View Project <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
