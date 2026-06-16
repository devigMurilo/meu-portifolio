import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <motion.div 
          className={styles.textBlock}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>
        <motion.ul 
          className={styles.infoGrid}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <li>
            <span>Experiência</span>
            <strong>3+ anos</strong>
          </li>
          <li>
            <span>Stack principal</span>
            <strong>Python · Django · SQL</strong>
          </li>
          <li>
            <span>Localização</span>
            <strong>São Tomé, RN</strong>
          </li>
          <li>
            <span>Disponibilidade</span>
            <strong>Freelance & Estágio</strong>
          </li>
        </motion.ul>
      </div>
    </section>
  );
}

export default About;
