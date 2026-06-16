import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Projects.module.css';

const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/projects`)
      .then(safeJson)
      .then((data) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className={styles.projects}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className={styles.subtitle}>Projetos em destaque</p>
        <h2>Seleção de trabalhos recentes</h2>
        <span>Do planejamento ao deploy, entrego produtos completos.</span>
      </motion.div>

      {loading ? (
        <p className={styles.loading}>Carregando...</p>
      ) : projects.length === 0 ? (
        <p className={styles.loading}>Nenhum projeto cadastrado ainda.</p>
      ) : (
        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
        >
          {projects.map((project) => (
            <motion.article key={project.id} className={styles.card} variants={cardVariants}>
              <div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <ul>
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer">
                  Ver no GitHub →
                </a>
              )}
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
}

export default Projects;
