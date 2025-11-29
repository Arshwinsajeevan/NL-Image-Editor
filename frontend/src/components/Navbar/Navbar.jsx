// src/components/Navbar/Navbar.jsx
import React from "react";
import "./navbar.css";

export default function Navbar() {
  return (
    <header className="nav-wrap">
      <nav className="nav-glass">
        <div className="nav-inner">
          <div className="brand">
            <div className="logo">
              <span className="logo-mark">NL</span>
              <span className="logo-text">Image Studio</span>
            </div>
            <div className="subtitle">AI · Vision · Demo</div>
          </div>

          <div className="nav-links">
            <a href="#" className="nav-link">Home</a>
            {/* <a href="#" className="nav-link">Docs</a>
            <a href="#" className="nav-link">GitHub</a> */}
          </div>
        </div>
      </nav>
    </header>
  );
}
