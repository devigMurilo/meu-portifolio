import React from 'react';
import styles from './Projects.module.css';

const projects = [
  {
    title: 'Ignite Notes',
    description: 'Aplicação full-stack para anotações colaborativas com editor rich-text e sincronização em tempo real.',
    stack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL'],
    link: 'https://github.com/seuusuario/ignite-notes',
  },
  {
    title: 'GoTravel',
    description: 'Plataforma de reservas para agências boutique com dashboard administrativo e integração com APIs externas.',
    stack: ['Next.js', 'Prisma', 'Tailwind CSS'],
    link: 'https://github.com/seuusuario/gotravel',
  },
  {
    title: 'DevJobs',
    description: 'Job board responsivo para vagas tech, com filtro por habilidades e CMS headless para criação de posts.',
    stack: ['Vue', 'Supabase', 'TypeScript'],
    link: 'https://github.com/seuusuario/devjobs',
  },
];

function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.header}>
        <p>Projetos em destaque</p>
        <h2>Seleção de trabalhos recentes</h2>
        <span>Do planejamento ao deploy, entrego produtos completos.</span>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <article key={project.title} className={styles.card}>
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <ul>
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <a href={project.link} target="_blank" rel="noreferrer">
              Ver no GitHub →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;

