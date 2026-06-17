import React from 'react';
import { motion } from 'framer-motion';
import styles from './navbar.module.css';

function Navbar() {
  return (
    <motion.nav
      className={styles.nav}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="#" className={styles.logo}>Igor Murilo</a>
      <div className={styles.links}>
        <a href="#about">Sobre</a>
        <a href="#skills">Tecnologias</a>
        <a href="#projects">Projetos</a>
        <a href="#experience">Experiência</a>
        <a href="#contact">Contato</a>
      </div>
    </motion.nav>
  );
}

export default Navbar;
