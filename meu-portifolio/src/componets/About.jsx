import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const items = [
  { label: 'Experiência', value: '3+ anos' },
  { label: 'Stack principal', value: 'Python · Django · SQL' },
  { label: 'Localização', value: 'São Tomé, RN' },
  { label: 'Disponibilidade', value: 'Freelance & Estágio' },
];

function About() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.col}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.tag}>Sobre Mim</span>
          <h2 className={styles.heading}>
            Construindo produtos digitais com propósito
          </h2>
          <p className={styles.text}>
            Desenvolvedor full-stack apaixonado por criar experiências digitais
            fluidas e acessíveis. Trabalho com JavaScript/TypeScript, React e
            Node.js para transformar ideias em produtos que resolvem problemas
            reais.
          </p>
          <p className={styles.text}>
            Atualmente foco em aplicações web responsivas, integrações com APIs
            REST e boas práticas de design systems. Fora do código, estudo UX,
            animo protótipos no Figma e compartilho conteúdo sobre carreira tech.
          </p>
        </motion.div>

        <motion.div
          className={styles.col}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {items.map((item) => (
            <div key={item.label} className={styles.infoRow}>
              <span className={styles.infoLabel}>{item.label}</span>
              <strong className={styles.infoValue}>{item.value}</strong>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default About;
