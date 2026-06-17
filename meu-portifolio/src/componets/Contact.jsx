import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';
import MagneticWrapper from './MagneticWrapper';
import styles from './Contact.module.css';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.col}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.tag}>Contato</span>
          <h2 className={styles.heading}>Vamos trabalhar juntos?</h2>
          <p className={styles.text}>
            Tem um projeto em mente ou quer bater um papo? Mande uma mensagem
            ou me encontre nas redes sociais.
          </p>

          <div className={styles.social}>
            <MagneticWrapper as="a" href="https://github.com/devigMurilo" target="_blank" rel="noreferrer" aria-label="GitHub" strength={0.3}>
              <FiGithub />
            </MagneticWrapper>
            <MagneticWrapper as="a" href="https://www.linkedin.com/in/igor-murilo-68a487386/" target="_blank" rel="noreferrer" aria-label="LinkedIn" strength={0.3}>
              <FiLinkedin />
            </MagneticWrapper>
            <MagneticWrapper as="a" href="https://instagram.com/_imurilo" target="_blank" rel="noreferrer" aria-label="Instagram" strength={0.3}>
              <FiInstagram />
            </MagneticWrapper>
          </div>
        </motion.div>

        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Seu nome"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Seu email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            className={styles.textarea}
            name="message"
            placeholder="Sua mensagem"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />
          <motion.button
            className={styles.btn}
            type="submit"
            disabled={status === 'sending'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
            <FiSend />
          </motion.button>
          {status === 'sent' && <p className={styles.success}>Mensagem enviada com sucesso!</p>}
          {status === 'error' && <p className={styles.error}>Erro ao enviar. Tente novamente.</p>}
        </motion.form>
      </div>
    </section>
  );
}

export default Contact;
