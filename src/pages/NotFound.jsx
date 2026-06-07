import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-main">
        <div className="not-found-illustration">
          <div className="floating-element circle-1"></div>
          <div className="floating-element circle-2"></div>
          <div className="floating-element circle-3"></div>
        </div>
        <div className="not-found-content">
          <div className="glitch-wrapper">
            <div className="glitch" data-text="404">404</div>
          </div>
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-text">
            Oops! The page you are looking for seems to have gone on vacation.
            Don't worry, even the best explorers get lost sometimes.
          </p>
          <Link to="/" className="home-btn">
            <span className="home-btn-text">Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
