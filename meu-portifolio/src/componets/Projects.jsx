import React from 'react';
import styles from './Projects.module.css';

const projects = [
  {
    title: 'BE-Desk',
    description: ' O projeto consiste no desenvolvimento de um sistema online de cadastro, reservas e solicitação de materiais esportivos para o Bloco E do IFRN-SPP. O sistema busca substituir o modelo atual, que depende de atendimentos presenciais, por uma solução digital, prática e acessível a toda a comunidade acadêmica.',
    stack: ['django', 'sqlite', 'bootstrap', 'html', 'css'],
    link: 'https://github.com/WilliannyLima/BE-Desk',
  },
  {
    title: 'labirinto',
    description: 'jogo de labirinto feito com javascript.',
    stack: ['html', 'css', 'javascript',],
    link: 'https://github.com/eduardolemoscosta/projeto-banco-de-dados-semana-infor.git',
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






