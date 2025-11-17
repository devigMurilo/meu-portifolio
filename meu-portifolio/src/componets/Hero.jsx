

import React from 'react';
import styles from './Hero.module.css'; // 1. Importa os estilos

function Hero() {
  return (
    // 2. Usa a classe 'hero' do arquivo CSS
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        {/* Sinta-se à vontade para alterar o texto! */}
        <h1>Olá, eu sou Igor!</h1>
        <p>Desenvolvedor Full-Stack</p>
        <a href="#projects" className={styles.heroButton}>
          Veja meus projetos
        </a>
      </div>
    </section>
  );
}

export default Hero;