import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './componets/navbar.jsx';
import Hero from './componets/Hero.jsx';
import About from './componets/About.jsx';
import Skills from './componets/skills.jsx';
import Projects from './componets/Projects.jsx';
import Experience from './componets/Experience.jsx';
import Contact from './componets/Contact.jsx';
import Admin from './componets/Admin.jsx';

function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
}

export default App;
