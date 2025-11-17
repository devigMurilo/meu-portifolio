import './App.css';
import Navbar from './componets/navbar.jsx';
import Hero from './componets/Hero.jsx';
import About from './componets/About.jsx';
import Skills from './componets/skills.jsx';
import Projects from './componets/Projects.jsx';
import Contact from './componets/Contact.jsx';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;