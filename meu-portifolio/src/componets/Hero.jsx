

import React from 'react';
import styles from './Hero.module.css';

function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.tagline}>Software Engineer · Product Mindset</p>
        <h1>
          Olá, eu sou <span>Igor</span>
        </h1>
        <p className={styles.lead}>
          Crio experiências web escaláveis, acessíveis e com foco em impacto de negócio.
          Combino front-end moderno com back-end robusto para entregar soluções completas.
        </p>
        <div className={styles.actions}>
          <a href="#projects" className={styles.primaryBtn}>
            Veja meus projetos
          </a>
          <a href="#contact" className={styles.secondaryBtn}>
            Agende uma conversa
          </a>
        </div>
        <ul className={styles.metrics}>
          <li>
            <strong>25+</strong>
            <span>projetos entregues</span>
          </li>
          <li>
            <strong>5</strong>
            <span>produtos em produção</span>
          </li>
          <li>
            <strong>∞</strong>
            <span>vontade de aprender</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Hero;