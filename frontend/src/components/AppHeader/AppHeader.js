import React from 'react';

import './AppHeader.css';

export default function AppHeader() {
  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg">
        <a className="navbar-brand" href="/">
          <img src="/images/msft-logo-small.png" className="navbar-logo" alt="Microsoft" />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link"> GovSync </a>
            </li>
          </ul>
        </div>

        <ul>
          <li>
            <a href="/chat">Chat Assistant</a>
          </li>
        </ul>
      </nav>

    </header>
  );
};