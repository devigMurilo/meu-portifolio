// src/components/Skills.jsx

import React from 'react';
import styles from './skills.module.css';

// 1. Array de habilidades (você pode adicionar mais ou mudar os emojis)
const techSkills = [
  { name: "JavaScript", icon: "💻" },
  { name: "React.js", icon: "⚛️" },
  { name: "HTML5", icon: "🌐" },
  { name: "CSS3", icon: "🎨" },
  { name: "Git & GitHub", icon: "🔗" },
  { name: "Node.js", icon: "💚" },
  { name: "Tailwind CSS", icon: "💨" },
  { name: "Sass/SCSS", icon: "📘" },
  // Adicione suas habilidades aqui!
];

function Skills() {
  return (
    // IMPORTANTE: Adicionamos o ID 'skills' para a Navbar funcionar!
    <section id="skills" className={styles.skillsSection}>
      <h2 className={styles.title}>Minhas Habilidades</h2>
      <div className={styles.skillsGrid}>
        {/* 2. Usamos o .map() para renderizar cada item da lista */}
        {techSkills.map((skill, index) => (
          <div key={index} className={styles.skillItem}>
            <span className={styles.icon}>{skill.icon}</span>
            <p className={styles.skillName}>{skill.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;