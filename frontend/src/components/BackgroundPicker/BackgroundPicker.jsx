// src/components/BackgroundPicker/BackgroundPicker.jsx
import React, { useEffect, useState } from "react";
import "./backgroundpicker.css";
import axios from "axios";

export default function BackgroundPicker({ onSelect }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  // Base backend URL (local in dev, deployment in production)
  const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    axios.get(`${BASE}/api/backgrounds`)
      .then(res => setItems(res.data.backgrounds || []))
      .catch(() => setItems([]));
  }, [BASE]);

  return (
    <div className="bg-picker">
      <button className="collapse-btn" onClick={() => setOpen(v => !v)}>
        Choose Background {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="bg-grid">
          {items.length === 0 && <div className="small">No presets found</div>}

          {items.map((url, i) => (
            <div key={i} className="bg-thumb" onClick={() => onSelect(url)}>
              <img src={url} alt={`bg-${i}`} loading="lazy" />
            </div>
          ))} 
        </div>
      )}
    </div>
  );
}
