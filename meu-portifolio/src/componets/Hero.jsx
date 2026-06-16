import React from 'react';
import { motion } from 'framer-motion';
import { SiGithub, SiLinkedin, SiInstagram } from 'react-icons/si';
import styles from './Hero.module.css';
import profileImage from '../assets/fotonacasadepraia.jpg';

function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <motion.div 
        className={styles.heroContent}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className={styles.profileImageWrapper}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.imageGlow}></div>
          <img
            src={profileImage}
            alt="Foto de Igor"
            className={styles.profileImage}
          />
        </motion.div>
        
        <motion.div 
          className={styles.badges}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className={styles.tagline}>Software Development</span>
          <span className={styles.tagline}>Web Development</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Olá, eu sou <span>Igor</span>
        </motion.h1>
        
        <motion.p 
          className={styles.lead}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Crio experiências web escaláveis, acessíveis e com foco em impacto de negócio.
          Combino front-end moderno com back-end robusto para entregar soluções completas.
        </motion.p>
        
        <motion.div 
          className={styles.socialLinks}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <a href="https://github.com/devigMurilo" target="_blank" rel="noreferrer" aria-label="GitHub">
            <SiGithub />
          </a>
          <a href="https://www.linkedin.com/in/igor-murilo-68a487386/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <SiLinkedin />
          </a>
          <a href="https://instagram.com/_imurilo" target="_blank" rel="noreferrer" aria-label="Instagram">
            <SiInstagram />
          </a>
        </motion.div>

        <motion.div 
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <a href="#projects" className={styles.primaryBtn}>
            Veja meus projetos
          </a>
          <a href="#contact" className={styles.secondaryBtn}>
            Agende uma conversa
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;