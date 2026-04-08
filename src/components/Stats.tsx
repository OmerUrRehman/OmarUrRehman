import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

function Counter({ from, to }: { from: number, to: number }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const inView = useInView(nodeRef, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let current = from;
      const step = (to - from) / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= to) {
          setCount(to);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [inView, from, to]);

  return <div ref={nodeRef}>{count}+</div>;
}

export default function Stats() {
  const stats = [
    { num: 20, label: 'Projects Delivered' },
    { num: 15, label: 'Technologies' },
    { num: 2, label: 'Years Experience' },
    { num: 50, label: 'Workflows Automated' }
  ];

  return (
    <section className="px-6 md:px-16 lg:px-32 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-line my-12">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            className="bg-background py-12 px-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="font-serif text-3xl md:text-5xl text-accent tracking-tight">
              <Counter from={0} to={stat.num} />
            </div>
            <div className="text-[0.65rem] tracking-[0.15em] uppercase text-secondary mt-3">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
