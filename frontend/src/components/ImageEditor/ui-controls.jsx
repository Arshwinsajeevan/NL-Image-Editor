// src/components/ImageEditor/ui-controls.jsx
import React, { useState } from "react";
import BackgroundPicker from "../BackgroundPicker/BackgroundPicker";
import "./editor.css";

const EFFECTS = [
  ["none", "Original"],
  ["replace", "Replace Background"],
  ["blur", "Background Blur (Portrait)"],
  ["color-pop", "Color Pop"],
  ["cartoonify", "Cartoonify"],
  ["enhance", "Lighting / Enhance"],
];

function Slider({ visible, label, min, max, step = 1, value, onChange }) {
  if (!visible) return null;
  return (
    <div className="form-row">
      <label className="small">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default function ControlsCard({
  fileUrl,
  setFileUrl,
  commandText,
  setCommandText,
  runCommand,
  mode,
  setMode,
  blurAmount,
  setBlurAmount,
  cartoonStrength,
  setCartoonStrength,
  enhanceStrength,
  setEnhanceStrength,
  bgUrl,
  setBgUrl,
  applyTarget,
  setApplyTarget,
  downloadEdited,
  downloadBW,
}) {
  const [fileName, setFileName] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setFileUrl(URL.createObjectURL(f));
  };

  return (
    <div className="controls-card">
      <div className="controls-grid">

        {/* Upload */}
        <div className="form-row">
          <label className="small">Upload image</label>
          <label className="file-upload-btn">
            <input type="file" accept="image/*" onChange={handleFile} />
            <span>Choose Image</span>
          </label>
          {fileName && <div className="small">Selected: {fileName}</div>}
        </div>

        {/* Command */}
        <div className="form-row">
          <label className="small">Natural-language command</label>
          <input
            type="text"
            value={commandText}
            placeholder='e.g. "Blur background”, "Sunny weather", "Enhance image", “Cartoonify”,...'
            onChange={(e) => setCommandText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runCommand()}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" className="btn btn-primary" onClick={runCommand} disabled={!fileUrl}>
              Run Command
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setCommandText("")}>
              Clear
            </button>
          </div>
        </div>

        {/* Effect */}
        <div className="form-row">
          <label className="small">Effect</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            {EFFECTS.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Sliders */}
        <Slider
          visible={mode === "blur"}
          label={`Blur amount: ${blurAmount}px`}
          min={0} max={30}
          value={blurAmount}
          onChange={setBlurAmount}
        />

        <Slider
          visible={mode === "cartoonify"}
          label={`Cartoon strength: ${cartoonStrength}`}
          min={2} max={16}
          value={cartoonStrength}
          onChange={setCartoonStrength}
        />

        <Slider
          visible={mode === "enhance"}
          label={`Enhance strength: ${enhanceStrength.toFixed(2)}`}
          min={1} max={1.6} step={0.05}
          value={enhanceStrength}
          onChange={setEnhanceStrength}
        />

        {/* Background Picker */}
        <div className="form-row">
          <label className="small">Choose preset background</label>
          <BackgroundPicker onSelect={(url) => setBgUrl(url)} />
          <div className="small">Selected: {bgUrl ? bgUrl.split("/").pop() : "None"}</div>
        </div>

        {/* Apply Target */}
        <div className="form-row">
          <label className="small">Apply effects to</label>
          <select value={applyTarget} onChange={(e) => setApplyTarget(e.target.value)}>
            <option value="original">Original image</option>
            <option value="with-background">With background</option>
          </select>
        </div>

        {/* Downloads */}
        <div className="form-row" style={{ display: "flex",alignItems:"center", padding: "14px", gap: 12 }}>
          <button type="button" style={{ width: "180px" }} className="btn btn-primary" onClick={downloadEdited} disabled={!fileUrl}>
            Download Edited
          </button>
          <button type="button" style={{ width: "180px",color:"white",backgroundColor:"grey" }} className="btn btn-outline" onClick={downloadBW} disabled={!fileUrl}>
            Download B/W
          </button>
        </div>
      </div>
    </div>
  );
}
