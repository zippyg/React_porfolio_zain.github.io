import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeContext } from './contexts/theme';
import Header from './components/Header/Header';
import About from './components/About/About';
import Education from './components/Education/Education';
import Projects from './components/Projects/Projects';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import Skills from './components/Skills/Skills';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop'; // Import the new ScrollToTop component
import { education, projects } from './portfolio';
import './App.css';

const App = () => {
  const [{ themeName }] = useContext(ThemeContext);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      
      <div id="top" className={`${themeName} app`}>
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <About />
                  <Education education={education} />
                  <Projects projects={projects} />
                  <Skills />
                  <Contact />
                </>
              }
            />
            {projects.map((project) => (
              <Route
                key={project.id}
                path={`/projects/${project.id}`}
                element={<ProjectDetail project={project} />}
              />
            ))}
          </Routes>
          <ScrollToTop />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
