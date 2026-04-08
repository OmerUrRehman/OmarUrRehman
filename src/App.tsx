import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Sequence from './components/Sequence';
import Philosophy from './components/Philosophy';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Stats from './components/Stats';
import Projects from './components/Projects';
import Testimonial from './components/Testimonial';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className="noise"></div>
      <Cursor />
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar />
          <main>
            <Hero />
            <Marquee />
            <Sequence />
            <Experience />
            <Skills />
            <Stats />
            <Projects />
            <Philosophy />
            <Testimonial />
            <Contact />
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}
