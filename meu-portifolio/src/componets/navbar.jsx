import { useState, useEffect } from 'react';
import MagneticWrapper from './MagneticWrapper';
import styles from './navbar.module.css';

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let lastScroll = 0;

    const onScroll = () => {
      const current = window.scrollY;
      if (current > 80 && current > lastScroll) {
        setHidden(true);
      } else if (current < 80 || current < lastScroll) {
        setHidden(false);
      }
      lastScroll = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = mounted
    ? `${styles.nav} ${styles.visible} ${hidden ? styles.hidden : ''}`
    : styles.nav;

  return (
    <nav className={navClass}>
      <MagneticWrapper as="a" href="#" className={styles.logo} strength={0.35}>
        IM
      </MagneticWrapper>
      <div className={styles.links}>
        <MagneticWrapper as="a" href="#about" strength={0.25}>Sobre</MagneticWrapper>
        <MagneticWrapper as="a" href="#skills" strength={0.25}>Tecnologias</MagneticWrapper>
        <MagneticWrapper as="a" href="#projects" strength={0.25}>Projetos</MagneticWrapper>
        <MagneticWrapper as="a" href="#experience" strength={0.25}>Experiência</MagneticWrapper>
        <MagneticWrapper as="a" href="#contact" strength={0.25}>Contato</MagneticWrapper>
      </div>
    </nav>
  );
}

export default Navbar;
