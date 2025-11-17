import React from 'react';
import styles from './Contact.module.css';

function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.wrapper}>
        <div className={styles.copy}>
          <p>Vamos conversar</p>
          <h2>Precisa tirar uma ideia do papel?</h2>
          <span>
            Envie um e-mail ou agende uma call — respondo em até 24h úteis.
          </span>
          <div className={styles.links}>
            <a href="mailto:igor.dev@email.com">igor.dev@email.com</a>
            <a href="https://www.linkedin.com/in/seulink" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/seuusuario" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>

        <form className={styles.form}>
          <label>
            Nome
            <input type="text" placeholder="Seu nome completo" required />
          </label>
          <label>
            E-mail
            <input type="email" placeholder="email@exemplo.com" required />
          </label>
          <label>
            Mensagem
            <textarea placeholder="Conte um pouco sobre o projeto" rows="4" required />
          </label>
          <button type="submit">Enviar mensagem</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;

