import React from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import EmailIcon from '@material-ui/icons/Email';
import { about } from '../../portfolio';
import './About.css';

const About = () => {
  const { name, role, description, resume, social } = about;
  const { email } = social;

  return (
    <div className='about center'>
      <div className='about__header'>
        <img src='/assets/curl_headshot.png' alt='Headshot' className='about__headshot' />
        {name && (
          <h1>
            Hi, I am <span className='about__name'>{name}</span>.
          </h1>
        )}
      </div>

      {role && (
        <h2 className='about__role'>{role}</h2>
      )}

      <p className='about__desc'>{description}</p>

      {resume && (
        <div className='about__resume center'>
          <a href={resume} target="_blank" rel="noopener noreferrer" className='btn btn--outline'>
            Resume
          </a>
        </div>
      )}

      <div className='about__socials center'>
        {social.github && (
          <a href={social.github} aria-label='github' className='link link--icon'>
            <GitHubIcon />
          </a>
        )}

        {social.linkedin && (
          <a href={social.linkedin} aria-label='linkedin' className='link link--icon'>
            <LinkedInIcon />
          </a>
        )}

        {email && (
          <a href={`mailto:${email}`} aria-label='email' className='link link--icon'>
            <EmailIcon />
          </a>
        )}
      </div>
    </div>
  );
};

export default About;
