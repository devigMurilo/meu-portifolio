// src/components/Navbar.jsx

import React from 'react';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="#" className={styles.logo}>
        Igor M.
      </a>
      <div className={styles.links}>
        <a href="#about">Sobre</a>
        <a href="#skills">Habilidades</a>
        <a href="#projects">Projetos</a>
        <a href="#contact">Contato</a>
      </div>
    </nav>
  );
}

export default Navbar;