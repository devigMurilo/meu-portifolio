import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import styles from './Projects.module.css';

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

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    safeJson('/api/projects').then((data) => {
      if (Array.isArray(data)) setProjects(data);
    });
  }, []);

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.tag}>Projetos</span>
          <h2 className={styles.heading}>Trabalhos recentes</h2>
        </motion.div>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.link || '#'}
              target="_blank"
              rel="noreferrer"
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIndex}>{String(i + 1).padStart(2, '0')}</span>
                <FiExternalLink className={styles.cardIcon} />
              </div>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDesc}>{project.description}</p>
              {project.stack?.length > 0 && (
                <div className={styles.cardStack}>
                  {project.stack.map((tech) => (
                    <span key={tech} className={styles.stackTag}>{tech}</span>
                  ))}
                </div>
              )}
            </motion.a>
          ))}
        </div>

        {projects.length === 0 && (
          <p className={styles.empty}>
            Nenhum projeto carregado. Certifique-se de que o servidor está rodando.
          </p>
        )}
      </div>
    </section>
  );
}

export default Projects;
