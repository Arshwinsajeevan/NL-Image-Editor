// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import ImageEditor from "./components/ImageEditor";
import Footer from "./components/Footer/Footer";
import "./styles.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-wrap">
        <header className="hero">
          <div className="hero-left">
            <h1 className="title">NL Image Studio</h1>
            <p className="subtitle">
              AI-powered image editor running fully in the browser. Upload a photo,
              type a natural-language command (e.g. “Blur background”, "Sunny weather", "Enhance image", “Cartoonify”,... ),
              or pick an effect — everything updates automatically.
            </p>
          </div>

          <div className="hero-right">
            <div className="card hero-card">
              <div className="card-head">Try demo effects</div>
              <div className="chip-row">
                <span className="chip">Background Blur</span>
                <span className="chip">Color Pop</span>
                <span className="chip">Cartoonify</span>
                <span className="chip">Enhance</span>
              </div>
            </div>
          </div>
        </header>

        <section className="editor-section">
          <ImageEditor />
        </section>
      </main>

      <Footer />
    </div>
  );
}
