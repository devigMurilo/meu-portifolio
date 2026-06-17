import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import MagneticWrapper from './MagneticWrapper';
import styles from './Hero.module.css';

function InteractiveLetter({ char }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const springX = useSpring(x, { stiffness: 150, damping: 18 });
  const springY = useSpring(y, { stiffness: 150, damping: 18 });
  const springScale = useSpring(scale, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const factor = 1 - dist / 180;
        x.set(-dx * factor * 0.3);
        y.set(-dy * factor * 0.3);
        scale.set(1 + factor * 0.08);
      } else {
        x.set(0);
        y.set(0);
        scale.set(1);
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, scale]);

  return (
    <motion.span
      ref={ref}
      style={{
        display: 'inline-block',
        x: springX,
        y: springY,
        scale: springScale,
      }}
    >
      {char}
    </motion.span>
  );
}

function Hero() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const titleX = useTransform(mouseX, [0, 1], [-15, 15]);
  const titleY = useTransform(mouseY, [0, 1], [-10, 10]);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const scrollNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.letterReveal}`,
        { y: '110%', rotate: 6, opacity: 0 },
        { y: '0%', rotate: 0, opacity: 1, duration: 1.6, stagger: 0.04, ease: 'power4.out', delay: 0.15 }
      );
      gsap.fromTo(
        `.${styles.subtitle}`,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.3 }
      );
      gsap.fromTo(
        `.${styles.scrollArrow}`,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.8 }
      );
    });
    return () => ctx.revert();
  }, []);

  const chars = "PORTFÓLIO".split('');

  return (
    <section id="hero" className={styles.hero} ref={sectionRef}>
      <div className={styles.centerContent}>
        <motion.div
          className={styles.titleRow}
          style={{ x: titleX, y: titleY }}
        >
          <h1 className={styles.title}>
            {chars.map((char, index) => (
              <span key={index} className={styles.letterMask}>
                <span className={styles.letterReveal}>
                  <InteractiveLetter char={char} />
                </span>
              </span>
            ))}
          </h1>
        </motion.div>

        <span className={styles.subtitle}>
          Desenvolvedor Full Stack
        </span>

        <button className={styles.scrollArrow} onClick={scrollNext}>
          ↓
        </button>
      </div>

      <div className={styles.bottomRight}>
        <MagneticWrapper
          as="a"
          href="https://www.igormurilo.dev"
          target="_blank"
          rel="noreferrer"
          className={styles.domain}
          strength={0.4}
        >
          www.igormurilo.dev
        </MagneticWrapper>
      </div>
    </section>
  );
}

export default Hero;
