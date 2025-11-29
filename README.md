🌁 NL Image Studio

A fast, client-side AI-powered image editor built with React + Node/Express + BodyPix.
Upload a photo, choose visual effects, or simply type natural-language commands like:

“Blur background”

“Cartoonify the image”

“Replace background with beach”

“Give a summer vibe”

All processing happens in the browser using BodyPix segmentation — no paid APIs, no server load.

✨ Features

✔ Background Replacement (Beach, Studio, Nature, Retro)

✔ Portrait Background Blur

✔ Color Pop (subject color + background B/W)

✔ Cartoonify Effect

✔ Lighting & Enhancement

✔ Natural-language command box

✔ Three-view preview: Original / Black & White / Edited

✔ Client-side rendering (zero cost, images never leave device)


🧠 AI / ML

Uses BodyPix (TensorFlow.js) for real-time person segmentation

Enables background replacement, selective blur, color isolation, and compositing

Runs entirely client-side for speed, privacy, and no inference cost


🛠 Tech Stack

Frontend: React (Vite), Canvas API
AI: BodyPix (TensorFlow.js)
Backend: Node.js + Express (serves preset backgrounds)
Deployment: Render (backend), Vercel (frontend)


📁 Project Structure
/backend
  server.js
  /public/backgrounds   # Beach.jpeg, Nature.jpeg, Studio.jpeg, Retro.jpeg
/frontend
  src/
    components/
      ImageEditor/      # Editor, effects, segmentation, helpers
      BackgroundPicker/
  App.jsx
  main.jsx
  vite.config.js


▶️ Running Locally
Backend
cd backend
npm install
node server.js
# runs at http://localhost:4000

Frontend
cd frontend
npm install
npm run dev


Frontend expects:

VITE_BACKEND_URL=http://localhost:4000


To set it locally, create frontend/.env:

VITE_BACKEND_URL=http://localhost:4000


🌐 Live Demo

Frontend: https://nl-image-editor.vercel.app/
Backend: https://nl-image-studio-backend.onrender.com


📄 Short Technical Write-up 

NL Image Studio is a lightweight AI-powered image editor that works entirely in the browser. The frontend is built with React + Vite and uses the Canvas API to render, filter, and composite images. For the AI component, I used BodyPix (TensorFlow.js) to generate person segmentation masks in real time. This enables effects like background replacement, portrait-style background blur, color pop, cartoonify, and lighting enhancement.

The backend is intentionally minimal and built with Node.js + Express. Its role is only to serve preset background images and return their URLs. All heavy processing — segmentation, blurring, posterization, edge detection, and compositing — is done client-side to keep the app fast, private, and completely free to run.

The app also includes a natural-language command box. Users can type phrases such as “replace background with beach,” “blur background 10,” or “make it vintage,” and a lightweight rule-based parser maps the commands to effects or background presets.

The architecture focuses on simplicity: React UI → command parser → effect pipeline → canvas rendering. This ensures low latency, zero inference cost, and an easy, intuitive editing experience.