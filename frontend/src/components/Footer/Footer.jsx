// src/components/Footer/Footer.jsx
import React from "react";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="meta">
        Built with React + Node.js/Express + BodyPix AI · Client-side Image Editor
          <div className="owner-line">
            © 2025 Arshwin Sajeevan · All Rights Reserved
          </div>
        </div>

        <div className="footer-links">
          <a
            href="https://www.linkedin.com/in/arshwin-sajeevan/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>

          <span className="dot">•</span>

          <a
            href="https://github.com/Arshwinsajeevan"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
