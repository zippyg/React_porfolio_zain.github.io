import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const toggleVisibility = () =>
      window.pageYOffset > 500 ? setIsVisible(true) : setIsVisible(false);

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  return isVisible ? (
    <div className='scroll-top'>
      <a href={`${process.env.PUBLIC_URL}/#top`} className='link link--icon'>
        <ArrowUpwardIcon fontSize='large' />
      </a>
    </div>
  ) : null;
};

export default ScrollToTop;
