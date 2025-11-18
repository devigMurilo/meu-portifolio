// src/components/Skills.jsx

import React from 'react';
import {
  SiJavascript,
  SiReact,
  SiHtml5,
  SiCss3,
  SiGithub,
  SiNodedotjs,
  SiTailwindcss,
  SiBootstrap,
  SiPython,
  SiDjango,
} from 'react-icons/si';
import styles from './skills.module.css';

const techSkills = [
  { name: 'JavaScript', icon: SiJavascript, color: '#f7df1e' },
  { name: 'React.js', icon: SiReact, color: '#61dafb' },
  { name: 'HTML5', icon: SiHtml5, color: '#e44d26' },
  { name: 'CSS3', icon: SiCss3, color: '#1572b6' },
  { name: 'Git & GitHub', icon: SiGithub, color: '#ffffff' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#3c873a' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#38bdf8' },
  { name: 'Bootstrap', icon: SiBootstrap, color: '#7952b3' },
  { name: 'Python', icon: SiPython, color: '#ffd43b' },
  { name: 'Django', icon: SiDjango, color: '#0c4b33' },
];

function Skills() {
  return (
    <section id="skills" className={styles.skillsSection}>
      <h2 className={styles.title}>Minhas Habilidades</h2>
      <div className={styles.skillsGrid}>
        {techSkills.map(({ name, icon: Icon, color }) => (
          <div key={name} className={styles.skillItem}>
            <Icon className={styles.icon} style={{ color }} aria-hidden="true" />
            <p className={styles.skillName}>{name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;