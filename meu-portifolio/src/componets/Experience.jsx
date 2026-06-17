import React from 'react';
import { motion } from 'framer-motion';
import styles from './Experience.module.css';

const experiences = [
  {
    period: '2024 — Presente',
    role: 'Desenvolvedor Full Stack Freelance',
    company: 'Autônomo',
    desc: 'Desenvolvimento de aplicações web completas utilizando React, Node.js e bancos de dados relacionais. Criação de APIs REST e integração com serviços de terceiros.',
  },
  {
    period: '2023 — 2024',
    role: 'Estagiário em Desenvolvimento Web',
    company: 'IFRN',
    desc: 'Atuei no suporte e desenvolvimento de sistemas internos, manutenção de sites institucionais e criação de dashboards administrativos.',
  },
  {
    period: '2022 — 2023',
    role: 'Projetos Acadêmicos',
    company: 'IFRN - SPP',
    desc: 'Desenvolvimento de sistemas como trabalho de conclusão de curso e projetos de extensão, incluindo sistemas de reservas e cadastro.',
  },
];

function Experience() {
  return (
    <section id="experience" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.tag}>Experiências</span>
          <h2 className={styles.heading}>Minha trajetória</h2>
        </motion.div>

        <div className={styles.timeline}>
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              className={styles.item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.line}>
                <div className={styles.dot} />
                {i < experiences.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={styles.content}>
                <span className={styles.period}>{exp.period}</span>
                <h3 className={styles.role}>{exp.role}</h3>
                <span className={styles.company}>{exp.company}</span>
                <p className={styles.desc}>{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
