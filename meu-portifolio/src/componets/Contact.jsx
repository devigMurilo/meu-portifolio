import React, { useState } from 'react';
import { SiLinkedin, SiGithub } from 'react-icons/si';
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
        <div className={styles.copy}>
          <p>Vamos conversar</p>
          <h2>Precisa tirar uma ideia do papel?</h2>
          <span>
            Envie um e-mail ou agende uma call — respondo em até 24h úteis.
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
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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
        </form>
      </div>
    </section>
  );
}

export default Contact;


