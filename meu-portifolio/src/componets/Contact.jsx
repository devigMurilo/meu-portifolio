import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SiLinkedin, SiGithub, SiInstagram } from 'react-icons/si';
import styles from './Contact.module.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'loading', message: '' });

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Não foi possível enviar a mensagem.');
      }

      setStatus({
        type: 'success',
        message: 'Mensagem enviada com sucesso! Vou te responder em breve.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message ||
          'Ops, tivemos um problema com o envio. Tente novamente em instantes.',
      });
    }
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.wrapper}>
        <motion.div 
          className={styles.copy}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p>Vamos conversar</p>
          <h2>Precisa tirar uma ideia do papel?</h2>
          <span>
            Envie um e-mail ou preencha o formulário — respondo em até 24h úteis.
          </span>
          <div className={styles.links}>
            <a href="mailto:igormurilo.ac.21@gmail.com">igormurilo.ac.21@gmail.com</a>
            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/in/igor-murilo-68a487386/"
                target="_blank"
                rel="noreferrer"
              >
                <SiLinkedin aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/devigMurilo" target="_blank" rel="noreferrer">
                <SiGithub aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <a href="https://instagram.com/_imurilo" target="_blank" rel="noreferrer">
                <SiInstagram aria-hidden="true" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.form 
          className={styles.form} 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <label>
            Nome
            <input
              type="text"
              name="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            E-mail
            <input
              type="email"
              name="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mensagem
            <textarea
              name="message"
              placeholder="Conte um pouco sobre o projeto"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Enviando...' : 'Enviar mensagem'}
          </button>
          {status.message && (
            <p
              className={`${styles.statusMessage} ${
                status.type === 'error' ? styles.statusError : styles.statusSuccess
              }`}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}

export default Contact;
