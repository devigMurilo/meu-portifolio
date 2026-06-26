import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Experience.module.css';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

const safeJson = async (url) => {
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (!text) return [];
    return JSON.parse(text);
  } catch {
    return [];
  }
};

function Experience() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    safeJson(`${apiBaseUrl}/api/experiences`).then((data) => {
      if (Array.isArray(data)) setExperiences(data);
    });
  }, []);

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
              key={exp.id || i}
              className={styles.item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 6 }}
            >
              <div className={styles.line}>
                <div className={styles.dot} />
                {i < experiences.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={styles.content}>
                <span className={styles.period}>{exp.period}</span>
                <h3 className={styles.role}>{exp.role}</h3>
                <span className={styles.company}>{exp.company}</span>
                <p className={styles.desc} dangerouslySetInnerHTML={{ __html: exp.desc }}></p>
              </div>
            </motion.div>
          ))}
        </div>
        {experiences.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.7, marginTop: '2rem' }}>
            Nenhuma experiência carregada. Certifique-se de que o servidor está rodando.
          </p>
        )}
      </div>
    </section>
  );
}

export default Experience;
