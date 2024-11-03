import React from 'react';
import { useNavigate } from 'react-router-dom';
import uniqid from 'uniqid';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkIcon from '@material-ui/icons/Link';
import DescriptionIcon from '@material-ui/icons/Description';
import MailIcon from '@material-ui/icons/Mail';
import MovieIcon from '@mui/icons-material/Movie';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './ProjectContainer.css';

const ProjectContainer = ({ project }) => {
  const navigate = useNavigate();

  const goToProjectDetails = () => {
    navigate(`/projects/${project.id}`);
  };

  const renderProjectLinks = (proj) => {
    switch (proj.id) {
      case 1: // Higgs Boson Statistical Analysis
        return (
          <a href={`${process.env.PUBLIC_URL}/assets/Higgs paper.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
            <DescriptionIcon />
          </a>
        );
      case 2: // Bedroom Rent Calculator
        return (
          <>
            <a href="https://zainmug04.pythonanywhere.com/" target="_blank" rel="noopener noreferrer" className="project-link">
              <LinkIcon />
            </a>
            <a href="https://github.com/zippyg/Zain_Projects/tree/main/Bedroom%20Rent%20Calculator" target="_blank" rel="noopener noreferrer" className="project-link">
              <GitHubIcon />
            </a>
          </>
        );
      case 3: // Personal Portfolio Website
        return (
          <a href="https://github.com/zippyg/React_porfolio_zain.github.io" target="_blank" rel="noopener noreferrer" className="project-link">
            <GitHubIcon />
          </a>
        );
      case 4: // Projectile Motion Simulation Game
        return (
          <>
            <a href="https://github.com/zippyg/Zain_Projects/tree/main/Projectile%20Motion%20Simulation%20Game" target="_blank" rel="noopener noreferrer" className="project-link">
              <GitHubIcon />
            </a>
            <a href={`${process.env.PUBLIC_URL}/assets/porj motion documentation.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
              <DescriptionIcon />
            </a>
          </>
        );
      case 5: // Thermodynamics Snookered
        return (
          <>
            <a href="https://github.com/zippyg/Zain_Projects/tree/main/Thermodynamics%20Snookered" target="_blank" rel="noopener noreferrer" className="project-link">
              <GitHubIcon />
            </a>
            <a href={`${process.env.PUBLIC_URL}/assets/screen rec mbs - thermosnooker.mov`} target="_blank" rel="noopener noreferrer" className="project-link">
              <MovieIcon />
            </a>
            <a href={`${process.env.PUBLIC_URL}/assets/Thermo paper.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
              <DescriptionIcon />
            </a>
          </>
        );
      case 6: // Advanced Gyroscopic Stabilization Systems
        return (
          <>
            <a href={`${process.env.PUBLIC_URL}/assets/stabilization theory.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
              <MenuBookIcon />
            </a>
            <a href={`${process.env.PUBLIC_URL}/assets/stabilization script.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
              <DescriptionIcon />
            </a>
          </>
        );
      case 7: // Spotify YouTube Downloader
        return (
          <a href="https://github.com/zippyg/Zain_Projects/tree/main/Spotify%20YouTube%20Downloader" target="_blank" rel="noopener noreferrer" className="project-link">
            <GitHubIcon />
          </a>
        );
      case 8: // MarketSeer
        return (
          <a href="mailto:zainmughal77@outlook.com" className="project-link">
            <MailIcon />
          </a>
        );
      case 9: // Portfolio Risk Management System
        return (
          <a href="mailto:zainmughal77@outlook.com" className="project-link">
            <MailIcon />
          </a>
        );
        case 10: // BSM 
        return (
          <a href="mailto:zainmughal77@outlook.com" className="project-link">
            <MailIcon />
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div className='project' onClick={goToProjectDetails} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') goToProjectDetails(); }}>
      <h3>{project.name}</h3>
      <span className={`project__status ${project.status === 'Completed' ? 'completed' : 'in-progress'}`} />
      <p className='project__description'>{project.description}</p>
      {project.stack && (
        <ul className='project__stack'>
          {project.stack.map((item) => (
            <li key={uniqid()} className='project__stack-item'>{item}</li>
          ))}
        </ul>
      )}
      <div className='project-links'>
        {renderProjectLinks(project)}
      </div>
    </div>
  );
};

export default ProjectContainer;
