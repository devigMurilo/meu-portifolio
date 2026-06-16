import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import iconMap from './iconMap';
import styles from './skills.module.css';

const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function SkillCard({ name, icon, color, level }) {
  const Icon = iconMap[icon] || null;
  return (
    <motion.div className={styles.skillItem} variants={itemVariants}>
      <div
        className={styles.iconWrapper}
        style={{
          backgroundColor: `${color}15`,
          borderColor: `${color}30`,
        }}
      >
        {Icon ? <Icon className={styles.icon} style={{ color }} aria-hidden="true" /> : null}
      </div>
      <p className={styles.skillName}>{name}</p>
      <div className={styles.levelDots} aria-label={`Nível ${level} de 5`}>
        {[1, 2, 3, 4, 5].map((dot) => (
          <span
            key={dot}
            className={`${styles.dot} ${dot <= level ? styles.dotFilled : ''}`}
            style={dot <= level ? { backgroundColor: color } : undefined}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/skills`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Geral';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className={styles.skillsSection}>
      <motion.div
        className={styles.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <div className={styles.header}>
          <p className={styles.subtitle}>Tech Stack</p>
          <h2 className={styles.title}>Minhas Habilidades</h2>
        </div>

        {loading ? (
          <p className={styles.empty}>Carregando...</p>
        ) : Object.keys(categories).length === 0 ? (
          <p className={styles.empty}>Nenhuma habilidade cadastrada.</p>
        ) : (
          Object.entries(categories).map(([category, catSkills], i) => (
            <motion.div
              key={category}
              className={styles.categoryBlock}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { delay: i * 0.1 } },
              }}
            >
              <h3 className={styles.categoryTitle}>{category}</h3>
              <motion.div
                className={styles.skillsGrid}
                variants={containerVariants}
              >
                {catSkills.map((skill) => (
                  <SkillCard key={skill.id} {...skill} />
                ))}
              </motion.div>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
}

export default Skills;
