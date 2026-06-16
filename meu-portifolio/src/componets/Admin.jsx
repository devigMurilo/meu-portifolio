import React, { useState, useEffect, useCallback, createElement } from 'react';
import iconMap from './iconMap';
import styles from './Admin.module.css';

const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';

const ICON_OPTIONS = Object.keys(iconMap).sort();

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Resposta inválida do servidor (${res.status}). Verifique se o backend está rodando.`,
    );
  }
}

function Admin() {
  const [token, setToken] = useState(sessionStorage.getItem('admin_token') || '');
  const [loggedIn, setLoggedIn] = useState(!!sessionStorage.getItem('admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('projects');

  const authHeaders = useCallback(
    () => ({ 'Content-Type': 'application/json', 'x-admin-token': token }),
    [token],
  );

  // --- Projects ---
  const [projects, setProjects] = useState([]);
  const [projEditingId, setProjEditingId] = useState(null);
  const [projForm, setProjForm] = useState({ title: '', description: '', stack: '', link: '', published: false });
  const [projSaving, setProjSaving] = useState(false);
  const [projError, setProjError] = useState('');

  const loadProjects = useCallback(() => {
    fetch(`${apiBaseUrl}/api/projects`)
      .then(safeJson)
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  function projOpenNew() {
    setProjEditingId(null);
    setProjForm({ title: '', description: '', stack: '', link: '', published: false });
    setProjError('');
  }

  function projOpenEdit(project) {
    setProjEditingId(project.id);
    setProjForm({
      title: project.title,
      description: project.description,
      stack: project.stack.join(', '),
      link: project.link,
      published: project.published ?? false,
    });
    setProjError('');
  }

  async function projHandleSave(e) {
    e.preventDefault();
    setProjError('');
    if (!projForm.title.trim()) return setProjError('O título é obrigatório.');

    setProjSaving(true);
    const body = {
      title: projForm.title.trim(),
      description: projForm.description.trim(),
      stack: projForm.stack.split(',').map((s) => s.trim()).filter(Boolean),
      link: projForm.link.trim(),
      published: projForm.published,
    };
    const url = projEditingId
      ? `${apiBaseUrl}/api/projects/${projEditingId}`
      : `${apiBaseUrl}/api/projects`;
    const method = projEditingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      if (!res.ok) {
        const data = await safeJson(res).catch(() => ({}));
        throw new Error(data.error || 'Erro ao salvar.');
      }
      await loadProjects();
      projOpenNew();
    } catch (err) {
      setProjError(err.message);
    } finally {
      setProjSaving(false);
    }
  }

  async function projHandleDelete(id) {
    if (!window.confirm('Excluir este projeto?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/projects/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) throw new Error('Erro ao excluir.');
      await loadProjects();
      if (projEditingId === id) projOpenNew();
    } catch (err) {
      setProjError(err.message);
    }
  }

  // --- Skills ---
  const [skills, setSkills] = useState([]);
  const [skillEditingId, setSkillEditingId] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', icon: 'SiReact', color: '#38bdf8', level: 3, category: 'Frontend', published: false });
  const [skillSaving, setSkillSaving] = useState(false);
  const [skillError, setSkillError] = useState('');

  const CATEGORY_OPTIONS = ['Frontend', 'Backend', 'DevOps & Design', 'Mobile', 'Ferramentas', 'Outros'];

  const loadSkills = useCallback(() => {
    fetch(`${apiBaseUrl}/api/skills`)
      .then(safeJson)
      .then(setSkills)
      .catch(() => setSkills([]));
  }, []);

  function skillOpenNew() {
    setSkillEditingId(null);
    setSkillForm({ name: '', icon: 'SiReact', color: '#38bdf8', level: 3, category: 'Frontend', published: false });
    setSkillError('');
  }

  function skillOpenEdit(skill) {
    setSkillEditingId(skill.id);
    setSkillForm({
      name: skill.name,
      icon: skill.icon,
      color: skill.color,
      level: skill.level,
      category: skill.category,
      published: skill.published ?? false,
    });
    setSkillError('');
  }

  async function skillHandleSave(e) {
    e.preventDefault();
    setSkillError('');
    if (!skillForm.name.trim()) return setSkillError('O nome é obrigatório.');

    setSkillSaving(true);
    const body = {
      name: skillForm.name.trim(),
      icon: skillForm.icon,
      color: skillForm.color,
      level: parseInt(skillForm.level, 10),
      category: skillForm.category,
      published: skillForm.published,
    };
    const url = skillEditingId
      ? `${apiBaseUrl}/api/skills/${skillEditingId}`
      : `${apiBaseUrl}/api/skills`;
    const method = skillEditingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      if (!res.ok) {
        const data = await safeJson(res).catch(() => ({}));
        throw new Error(data.error || 'Erro ao salvar.');
      }
      await loadSkills();
      skillOpenNew();
    } catch (err) {
      setSkillError(err.message);
    } finally {
      setSkillSaving(false);
    }
  }

  async function skillHandleDelete(id) {
    if (!window.confirm('Excluir esta habilidade?')) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/skills/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) throw new Error('Erro ao excluir.');
      await loadSkills();
      if (skillEditingId === id) skillOpenNew();
    } catch (err) {
      setSkillError(err.message);
    }
  }

  // --- Init ---
  useEffect(() => {
    if (loggedIn) { loadProjects(); loadSkills(); }
  }, [loggedIn, loadProjects, loadSkills]);

  // --- Login ---
  function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    const user = username.trim();
    const pwd = password.trim();
    if (!user || !pwd) return setLoginError('Preencha usuário e senha.');

    fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pwd }),
    })
      .then((r) => {
        if (r.status === 401) throw new Error('Usuário ou senha incorretos.');
        return safeJson(r);
      })
      .then((data) => {
        sessionStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setLoggedIn(true);
      })
      .catch((err) => setLoginError(err.message));
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token');
    setToken('');
    setLoggedIn(false);
  }

  // --- Render ---
  if (!loggedIn) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.loginBox}>
          <h1>Admin</h1>
          <form onSubmit={handleLogin}>
            <label>Usuário
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Digite o usuário" autoFocus />
            </label>
            <label>Senha
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite a senha" />
            </label>
            {loginError && <p className={styles.error}>{loginError}</p>}
            <button type="submit">Entrar</button>
          </form>
          <a href="/" className={styles.backLink}>← Voltar ao portfólio</a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminContainer}>
        <div className={styles.adminHeader}>
          <h1>Admin</h1>
          <button className={styles.btnLogout} onClick={handleLogout}>Sair</button>
        </div>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'projects' ? styles.tabActive : ''}`} onClick={() => setTab('projects')}>Projetos</button>
          <button className={`${styles.tab} ${tab === 'skills' ? styles.tabActive : ''}`} onClick={() => setTab('skills')}>Habilidades</button>
        </div>

        {tab === 'projects' && (
          <>
            <div className={styles.sectionHeader}>
              <h2>Gerenciar Projetos</h2>
              <button className={styles.btnPrimary} onClick={projOpenNew}>+ Novo Projeto</button>
            </div>
            {projError && <p className={styles.error}>{projError}</p>}
            <form className={styles.form} onSubmit={projHandleSave}>
              <h3>{projEditingId ? 'Editar Projeto' : 'Novo Projeto'}</h3>
              <label>Título *
                <input type="text" value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} placeholder="Nome do projeto" />
              </label>
              <label>Descrição
                <textarea value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} placeholder="Descrição do projeto" rows={3} />
              </label>
              <label>Tecnologias (separadas por vírgula)
                <input type="text" value={projForm.stack} onChange={(e) => setProjForm({ ...projForm, stack: e.target.value })} placeholder="react, node, sqlite" />
              </label>
              <label>Link
                <input type="url" value={projForm.link} onChange={(e) => setProjForm({ ...projForm, link: e.target.value })} placeholder="https://github.com/seu-user/seu-repo" />
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={projForm.published} onChange={(e) => setProjForm({ ...projForm, published: e.target.checked })} />
                Projeto publicado
              </label>
              <div className={styles.formActions}>
                <button type="submit" className={styles.btnPrimary} disabled={projSaving}>{projSaving ? 'Salvando...' : projEditingId ? 'Atualizar' : 'Criar'}</button>
                {projEditingId && <button type="button" className={styles.btnCancel} onClick={projOpenNew}>Cancelar</button>}
              </div>
            </form>
            <div className={styles.itemList}>
              {projects.length === 0 ? <p className={styles.empty}>Nenhum projeto cadastrado.</p> : (
                projects.map((project) => (
                  <div key={project.id} className={styles.itemCard}>
                    <div>
                      <strong>{project.title}</strong>
                      <span className={styles.itemStack}>{project.stack.join(', ')}</span>
                      <span className={project.published ? styles.badgePublished : styles.badgeDraft}>{project.published ? 'Publicado' : 'Rascunho'}</span>
                    </div>
                    <div className={styles.cardActions}>
                      <button className={styles.btnEdit} onClick={() => projOpenEdit(project)}>Editar</button>
                      <button className={styles.btnDelete} onClick={() => projHandleDelete(project.id)}>Excluir</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {tab === 'skills' && (
          <>
            <div className={styles.sectionHeader}>
              <h2>Gerenciar Habilidades</h2>
              <button className={styles.btnPrimary} onClick={skillOpenNew}>+ Nova Habilidade</button>
            </div>
            {skillError && <p className={styles.error}>{skillError}</p>}
            <form className={styles.form} onSubmit={skillHandleSave}>
              <h3>{skillEditingId ? 'Editar Habilidade' : 'Nova Habilidade'}</h3>
              <label>Nome *
                <input type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="React.js" />
              </label>
              <div className={styles.formRow}>
                <label>Ícone
                  <select value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}>
                    {ICON_OPTIONS.map((opt) => {
                      const IconComp = iconMap[opt];
                      return <option key={opt} value={opt}>{opt.replace('Si', '')}</option>;
                    })}
                  </select>
                </label>
                <label>Cor
                  <div className={styles.colorInput}>
                    <input type="color" value={skillForm.color} onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })} />
                    <span>{skillForm.color}</span>
                  </div>
                </label>
              </div>
              <div className={styles.formRow}>
                <label>Nível (1-5)
                  <input type="number" min="1" max="5" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} />
                </label>
                <label>Categoria
                  <select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                    {CATEGORY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
              </div>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={skillForm.published} onChange={(e) => setSkillForm({ ...skillForm, published: e.target.checked })} />
                Habilidade publicada
              </label>
              <div className={styles.formActions}>
                <button type="submit" className={styles.btnPrimary} disabled={skillSaving}>{skillSaving ? 'Salvando...' : skillEditingId ? 'Atualizar' : 'Criar'}</button>
                {skillEditingId && <button type="button" className={styles.btnCancel} onClick={skillOpenNew}>Cancelar</button>}
              </div>
              {skillForm.icon && iconMap[skillForm.icon] && (
                <div className={styles.iconPreview}>
                  <span>Prévia: </span>
                  {createElement(iconMap[skillForm.icon], { style: { color: skillForm.color, fontSize: '1.5rem' } })}
                  <span style={{ color: skillForm.color }}>{skillForm.name || 'Nome'}</span>
                </div>
              )}
            </form>
            <div className={styles.itemList}>
              {skills.length === 0 ? <p className={styles.empty}>Nenhuma habilidade cadastrada.</p> : (
                skills.map((skill) => {
                  const SkillIcon = iconMap[skill.icon];
                  return (
                    <div key={skill.id} className={styles.itemCard}>
                      <div className={styles.skillCardInfo}>
                        {SkillIcon ? <SkillIcon style={{ color: skill.color, fontSize: '1.3rem' }} /> : null}
                        <div>
                          <strong>{skill.name}</strong>
                          <span className={styles.itemStack}>{skill.category} · Nível {skill.level}</span>
                          <span className={skill.published ? styles.badgePublished : styles.badgeDraft}>{skill.published ? 'Publicado' : 'Rascunho'}</span>
                        </div>
                      </div>
                      <div className={styles.cardActions}>
                        <button className={styles.btnEdit} onClick={() => skillOpenEdit(skill)}>Editar</button>
                        <button className={styles.btnDelete} onClick={() => skillHandleDelete(skill.id)}>Excluir</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
