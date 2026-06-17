import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import styles from './Hero.module.css';

function Hero() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const textX = useTransform(mouseX, [0, 1], [10, -10]);
  const textY = useTransform(mouseY, [0, 1], [10, -10]);

  const scrollNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className={styles.hero}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.topLeft}>
        <motion.span
          className={styles.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Desenvolvedor Full Stack
        </motion.span>
      </div>

      <div className={styles.topRight}>
        <motion.button
          className={styles.arrowBtn}
          onClick={scrollNext}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          whileHover={{ scale: 1.1 }}
        >
          <FiArrowDown />
        </motion.button>
      </div>

      <motion.div
        className={styles.textWrapper}
        style={{ x: textX, y: textY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={styles.textOutline}>PORT</span>
        <span className={styles.textSolid}>FÓLIO</span>
      </motion.div>

      <div className={styles.bottomLeft}>
        <motion.span
          className={styles.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          Igor Murilo
        </motion.span>
      </div>

      <div className={styles.bottomRight}>
        <motion.a
          href="https://www.igormurilo.dev"
          target="_blank"
          rel="noreferrer"
          className={styles.domain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          www.igormurilo.dev
        </motion.a>
      </div>
    </section>
  );
}

export default Hero;
