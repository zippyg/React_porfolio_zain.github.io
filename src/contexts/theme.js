import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');

  useEffect(() => {
    // Check for saved theme in local storage
    const savedTheme = localStorage.getItem('themeName');
    if (savedTheme) {
      setThemeName(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // If no saved theme, use the system preference
      const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme = darkMediaQuery.matches ? 'dark' : 'light';
      setThemeName(systemTheme);
      document.documentElement.setAttribute('data-theme', systemTheme);

      darkMediaQuery.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeName(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      });
    }
  }, []);

  const toggleTheme = () => {
    const name = themeName === 'dark' ? 'light' : 'dark';
    localStorage.setItem('themeName', name);
    setThemeName(name);
    document.documentElement.setAttribute('data-theme', name);
  };

  return (
    <ThemeContext.Provider value={[{ themeName, toggleTheme }]}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ThemeProvider, ThemeContext };
