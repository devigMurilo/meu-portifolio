import React, { useState, useEffect, createElement } from 'react';
import { motion } from 'framer-motion';
import styles from './skills.module.css';
import iconMap from './iconMap';

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

const categoryColors = {
  Frontend: 'rgba(229, 216, 192, 0.08)',
  Backend: 'rgba(229, 216, 192, 0.05)',
  'DevOps & Design': 'rgba(229, 216, 192, 0.04)',
};

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    safeJson('/api/skills').then((data) => {
      if (Array.isArray(data)) setSkills(data);
    });
  }, []);

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.tag}>Tecnologias</span>
          <h2 className={styles.heading}>Ferramentas que domino</h2>
        </motion.div>

        {Object.entries(grouped).map(([category, items], catIdx) => (
          <motion.div
            key={category}
            className={styles.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: catIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className={styles.categoryTitle}>{category}</h3>
            <div className={styles.grid}>
              {items.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  className={styles.card}
                  style={{
                    '--card-bg': categoryColors[skill.category] || 'rgba(229, 216, 192, 0.03)',
                    '--skill-color': skill.color,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <span className={styles.icon} style={{ color: skill.color }}>
                    {iconMap[skill.icon] ? createElement(iconMap[skill.icon]) : '?'}
                  </span>
                  <span className={styles.cardName}>{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        {skills.length === 0 && (
          <p className={styles.empty}>
            Nenhuma habilidade carregada. Certifique-se de que o servidor está rodando.
          </p>
        )}
      </div>
    </section>
  );
}

export default Skills;
