import React from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkIcon from '@material-ui/icons/Link';
import DescriptionIcon from '@material-ui/icons/Description';
import MailIcon from '@material-ui/icons/Mail';
import MovieIcon from '@mui/icons-material/Movie';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { v4 as uuidv4 } from 'uuid';
import './ProjectDetail.css';

const renderProjectLinks = (project) => {
  switch (project.id) {
    case 1: // Higgs Boson Statistical Analysis
      return (
        <a href={`${process.env.PUBLIC_URL}/assets/Higgs paper.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
          <DescriptionIcon /> Research Paper
        </a>
      );
    case 2: // Bedroom Rent Calculator
      return (
        <>
          <a href="https://zainmug04.pythonanywhere.com/" target="_blank" rel="noopener noreferrer" className="project-link">
            <LinkIcon /> Live Demo
          </a>
          <a href="https://github.com/zippyg/Zain_Projects/tree/main/Bedroom%20Rent%20Calculator" target="_blank" rel="noopener noreferrer" className="project-link">
            <GitHubIcon /> Source Code
          </a>
        </>
      );
    case 3: // Personal Portfolio Website
      return (
        <a href="https://github.com/zippyg/React_porfolio_zain.github.io" target="_blank" rel="noopener noreferrer" className="project-link">
          <GitHubIcon /> Source Code
        </a>
      );
    case 4: // Projectile Motion Simulation Game
      return (
        <>
          <a href="https://github.com/zippyg/Zain_Projects/tree/main/Projectile%20Motion%20Simulation%20Game" target="_blank" rel="noopener noreferrer" className="project-link">
            <GitHubIcon /> Source Code
          </a>
          <a href={`${process.env.PUBLIC_URL}/assets/porj motion documentation.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
            <DescriptionIcon /> Coding Documentation
          </a>
        </>
      );
    case 5: // Thermodynamics Snookered
      return (
        <>
          <a href="https://github.com/zippyg/Zain_Projects/tree/main/Thermodynamics%20Snookered" target="_blank" rel="noopener noreferrer" className="project-link">
            <GitHubIcon /> Source Code
          </a>
          <a href={`${process.env.PUBLIC_URL}/assets/screen rec mbs - thermosnooker.mov`} target="_blank" rel="noopener noreferrer" className="project-link">
            <MovieIcon /> Simulation Demo Recording
          </a>
          <a href={`${process.env.PUBLIC_URL}/assets/Thermo paper.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
            <DescriptionIcon /> Research Paper
          </a>
        </>
      );
    case 6: // Advanced Gyroscopic Stabilization Systems
      return (
        <>
          <a href={`${process.env.PUBLIC_URL}/assets/stabilization theory.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
            <MenuBookIcon /> Theory Paper
          </a>
          <a href={`${process.env.PUBLIC_URL}/assets/stabilization script.pdf`} target="_blank" rel="noopener noreferrer" className="project-link">
            <DescriptionIcon /> Project Script
          </a>
        </>
      );
    case 7: // Spotify YouTube Downloader
      return (
        <a href="https://github.com/zippyg/Zain_Projects/tree/main/Spotify%20YouTube%20Downloader" target="_blank" rel="noopener noreferrer" className="project-link">
          <GitHubIcon /> Source Code
        </a>
      );
    case 8: // MarketSeer
      return (
        <a href="mailto:zainmughal77@outlook.com" className="project-link">
          <MailIcon /> Request an Update/Code
        </a>
      );
    case 9: // Portfolio Risk Management System
      return (
        <a href="mailto:zainmughal77@outlook.com" className="project-link">
          <MailIcon /> Request an Update/Code
        </a>
      );
    default:
      return null;
  }
};

const ProjectDetail = ({ project }) => {
  if (!project) {
    return <div>Project not found.</div>;
  }

  const formatText = (text) =>
    text.split('\n').map((line) => (
      <p key={uuidv4()}>
        {line.split('**').map((part, i) =>
          i % 2 === 0 ? part : <strong key={uuidv4()}>{part}</strong>
        )}
      </p>
    ));

  const renderSection = (title, content) =>
    content && content.length > 0 ? (
      <>
        <h2>{title}</h2>
        {content.map((item) => (
          <div key={uuidv4()}>
            <h3>{item.title}</h3>
            {formatText(item.detail)}
          </div>
        ))}
      </>
    ) : null;

  const renderStatusIndicator = () => {
    if (project.status === 'Completed') {
      return (
        <div className="status-indicator completed">
          <span className="status-text completed">COMPLETED</span>
        </div>
      );
    }
    return (
      <div className="status-indicator in-progress">
        <span className="status-text in-progress">IN PROGRESS</span>
      </div>
    );
  };

  const renderDetailedContent = () => (
    <>
      <h1>{project.name}</h1>
      {renderStatusIndicator()}
      <h2>Project Overview</h2>
      {formatText(project.detailedDescription)}
      {renderSection("Key Components and Methods", project.keyComponents)}
      {renderSection("Technical Complexity and Integration", project.technicalComplexity)}
      {renderSection("Development Phases", project.developmentPhases)}
      {renderSection("Predicted Outcomes", project.predictedOutcomes)}
      <h2>Technologies Used</h2>
      <div className="technologies">
        {project.stack.map((tech) => (
          <div key={uuidv4()} className="technology-item">
            {tech}
          </div>
        ))}
      </div>
      <div className="project-links">
        {renderProjectLinks(project)}
      </div>
    </>
  );

  return <div className="project-detail">{renderDetailedContent()}</div>;
};

export default ProjectDetail;
