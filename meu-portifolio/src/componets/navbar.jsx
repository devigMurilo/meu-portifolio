import React from 'react';
import { motion } from 'framer-motion';
import styles from './navbar.module.css';

function Navbar() {
  return (
    <motion.nav 
      className={styles.navbar}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <a href="#" className={styles.logo}>
        Igor<span>.</span>
      </a>
      <div className={styles.links}>
        <a href="#about">Sobre</a>
        <a href="#skills">Habilidades</a>
        <a href="#projects">Projetos</a>
        <a href="#contact">Contato</a>
      </div>
    </motion.nav>
  );
}

export default Navbar;