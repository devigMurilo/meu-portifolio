import React from 'react';
import styles from './About.module.css';

function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <p className={styles.subtitle}>Sobre mim</p>
          <h2>Construindo produtos digitais com propósito</h2>
          <p>
            Desenvolvedor full-stack apaixonado por criar experiências digitais
            fluidas e acessíveis. Trabalho com JavaScript/TypeScript, React e
            Node.js para transformar ideias em produtos que resolvem problemas
            reais.
          </p>
          <p>
            Atualmente foco em aplicações web responsivas, integrações com APIs
            REST e boas práticas de design systems. Fora do código, estudo UX,
            animo protótipos no Figma e compartilho conteúdo sobre carreira tech.
          </p>
        </div>
        <ul className={styles.infoGrid}>
          <li>
            <span>Experiência</span>
            <strong>3+ anos</strong>
          </li>
          <li>
            <span>Stack principal</span>
            <strong>django · python · SQL</strong>
          </li>
          <li>
            <span>Localização</span>
            <strong>São Tomé, Rio Grande do Norte</strong>
          </li>
          <li>
            <span>Disponibilidade</span>
            <strong>Freelance & Estagio</strong>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default About;


