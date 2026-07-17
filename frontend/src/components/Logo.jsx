import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = ({ to }) => {
  return (
    <Link to={to} className="logo-container">
      <div className="logo-icon-wrapper">
        <svg className="logo-svg-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.8,3.2c-0.8-0.8-2-0.8-2.8,0L15.4,6.8L3.8,18.4c-0.8,0.8-0.8,2,0,2.8c0.4,0.4,0.9,0.6,1.4,0.6s1-0.2,1.4-0.6L18.2,9.6l3.6-3.6C22.6,5.2,22.6,4,21.8,3.2z M5.9,19.8l11.6-11.6l1.4,1.4L7.3,21.2L5.9,19.8z"/>
          <path d="M3.1,17.7c-0.8-0.8-2-0.8-2.8,0c-0.8,0.8-0.8,2,0,2.8c0.4,0.4,0.9,0.6,1.4,0.6s1-0.2,1.4-0.6L4.5,19.1L3.1,17.7z"/>
        </svg>
      </div>
      <div className="logo-text-wrapper">
        <span className="logo-main-text">The Gentleman's Cut</span>
      </div>
    </Link>
  );
};

export default Logo;