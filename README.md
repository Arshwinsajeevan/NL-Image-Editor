-NL Image Studio

A simple, fast, client-side AI-powered image editor built with React + Node/Express + BodyPix.
Upload a photo, choose effects, or type natural-language commands like:

“Blur background”

“cartoonify”

“Replace background with beach”

“Give a summer vibe”

All processing happens on the client using BodyPix segmentation.


--- Features

Background Replace (Beach, Studio, Nature, Retro)

Background Blur

Color Pop

Cartoonify

Lighting Enhance

Natural-language command box

Original + Black & White + Edited previews

Works fully in the browser (no paid APIs)


--- Tech Stack

Frontend: React (Vite), Canvas

AI: BodyPix (TensorFlow.js)

Backend: Node.js + Express (serves background images)


--- Running Locally
Backend:
cd backend
npm install
node server.js

Frontend:
cd frontend
npm install
npm run dev


Frontend expects:

VITE_BACKEND_URL=http://localhost:4000