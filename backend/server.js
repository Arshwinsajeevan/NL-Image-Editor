// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// serve static files (background images)
app.use('/static', express.static(path.join(__dirname, 'public')));

// GET /api/backgrounds -> returns list of background image URLs
app.get('/api/backgrounds', (req, res) => {
  const bgDir = path.join(__dirname, 'public', 'backgrounds');

  try {
    const files = fs.readdirSync(bgDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f));

    // Detect if running on localhost
    const host = req.get('host');
    const isLocal = host.includes("localhost") || host.startsWith("127.");

    const base = isLocal
      ? `http://${host}`          // LOCAL: http
      : `https://${host}`;        // DEPLOYED: https

    const urls = files.map(f => `${base}/static/backgrounds/${f}`);
    res.json({ backgrounds: urls });

  } catch (err) {
    res.status(500).json({ error: 'Unable to read backgrounds' });
  }
});

// Simple log endpoint
const logs = [];
app.post('/api/log', (req, res) => {
  const entry = {
    timestamp: new Date().toISOString(),
    payload: req.body
  };
  logs.unshift(entry);
  if (logs.length > 100) logs.pop();
  res.json({ ok: true });
});

app.get('/api/logs', (req, res) => {
  res.json({ logs });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
