// src/components/ImageEditor/index.jsx
import React, { useEffect, useRef, useState } from "react";
import "./editor.css";
import ControlsCard from "./ui-controls";
import { loadImage, drawOriginalAndBW } from "./helpers";
import { loadModel, segmentPerson } from "./segmentation";
import {
  applyReplaceComposite,
  applyBackgroundBlur,
  applyColorPop,
  applyCartoonify,
  applyEnhance
} from "./effects";

export default function ImageEditor() {
  // -----------------------------
  // State
  // -----------------------------
  const [modelReady, setModelReady] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [bgUrl, setBgUrl] = useState(null);
  const [bgPresets, setBgPresets] = useState([]);

  const [mode, setMode] = useState("none");
  const [blurAmount, setBlurAmount] = useState(8);
  const [cartoonStrength, setCartoonStrength] = useState(6);
  const [enhanceStrength, setEnhanceStrength] = useState(1.1);
  const [applyTarget, setApplyTarget] = useState("original");
  const [commandText, setCommandText] = useState("");

  const beforeCanvasRef = useRef(null);
  const bwCanvasRef = useRef(null);
  const afterCanvasRef = useRef(null);

  const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Model load + preset load
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await loadModel();
        if (active) setModelReady(true);
      } catch (e) {
        console.error("Model load failed:", e);
      }
    })();

    fetch(`${BASE}/api/backgrounds`)
      .then(r => r.json())
      .then(j => setBgPresets(j.backgrounds || []))
      .catch(() => setBgPresets([]));

    return () => (active = false);
  }, []);

  // Draw original + BW when file changes
  useEffect(() => {
    if (!fileUrl) return;

    (async () => {
      await drawOriginalAndBW(fileUrl, beforeCanvasRef.current, bwCanvasRef.current);

      const img = await loadImage(fileUrl);
      const ctx = afterCanvasRef.current.getContext("2d");

      afterCanvasRef.current.width = img.width;
      afterCanvasRef.current.height = img.height;
      ctx.drawImage(img, 0, 0);
      setMode("none");
    })();
  }, [fileUrl]);

  // Background semantics (shortened)
  const PRESETS = ["beach", "studio", "nature", "retro"];

  const SYNONYMS = {
    beach: ["ocean", "sea", "coast", "tropical", "summer", "vacation"],
    studio: ["indoor", "room", "interior", "office"],
    nature: ["forest", "trees", "green", "park", "landscape"],
    retro: ["vintage", "old", "classic", "nostalgic"]
  };

  const VIBES = {
    summer: "beach",
    tropical: "beach",
    vacation: "beach",
    forest: "nature",
    vintage: "retro",
    retro: "retro",
    indoor: "studio"
  };

  const findPreset = (token) => {
    if (!bgPresets.length) return null;
    const t = token.toLowerCase();

    for (const u of bgPresets) {
      if (u.toLowerCase().includes(t)) return u;
    }

    const syns = SYNONYMS[token] || [];
    for (const s of syns) {
      for (const u of bgPresets) {
        if (u.toLowerCase().includes(s)) return u;
      }
    }
    return null;
  };

  const semanticMatch = (text) => {
    if (!text) return null;
    const t = text.toLowerCase();

    for (const p of PRESETS) if (t.includes(p)) return findPreset(p);
    for (const [p, syns] of Object.entries(SYNONYMS))
      for (const s of syns) if (t.includes(s)) return findPreset(p);
    for (const [k, target] of Object.entries(VIBES))
      if (t.includes(k)) return findPreset(target);

    // fallback
    for (const u of bgPresets) {
      const name = u.split("/").pop().toLowerCase();
      for (const w of t.split(/\W+/))
        if (w.length > 2 && name.includes(w)) return u;
    }
    return null;
  };

  // Parse natural language (shortened)
  function parseCommand(text) {
    if (!text.trim()) return { matched: false };
    const t = text.toLowerCase();

    if (t.includes("blur"))
      return { matched: true, mode: "blur", blurAmount: parseInt(t.match(/\d+/)?.[0] || blurAmount) };

    if (t.includes("color") && t.includes("pop"))
      return { matched: true, mode: "color-pop" };

    if (t.includes("cartoon"))
      return { matched: true, mode: "cartoonify" };

    if (["enhance", "bright", "lighting"].some(k => t.includes(k)))
      return { matched: true, mode: "enhance" };

    if (t.includes("remove background") || t.includes("cutout"))
      return { matched: true, mode: "replace", bgPreset: "white" };

    // replace background with ___
    if (["replace", "add", "set", "change"].some(k => t.includes(k))) {
      const key = t.match(/with\s+([a-z0-9\- ]+)/)?.[1];
      const sem = key ? semanticMatch(key) : semanticMatch(t);
      return { matched: true, mode: "replace", bgPreset: sem || "white" };
    }

    const sem = semanticMatch(t);
    if (sem) return { matched: true, mode: "replace", bgPreset: sem };

    return { matched: false };
  }

  // Processing pipeline (shortened)
  async function processPipeline() {
    if (!fileUrl) return;

    const img = await loadImage(fileUrl);
    const ctx = afterCanvasRef.current.getContext("2d");
    const { width: w, height: h } = img;

    afterCanvasRef.current.width = w;
    afterCanvasRef.current.height = h;

    const needsSeg =
      ["replace", "blur", "color-pop"].includes(mode) ||
      (applyTarget === "with-background" && bgUrl && ["cartoonify", "enhance"].includes(mode));

    const mask = needsSeg ? await segmentPerson(img, { internalResolution: "medium", segmentationThreshold: 0.7 }) : null;
    const bg = applyTarget === "with-background" ? bgUrl : null;

    const ops = {
      none: () => ctx.drawImage(img, 0, 0),
      replace: () => applyReplaceComposite(img, mask, w, h, ctx, bgUrl),
      blur: () => applyBackgroundBlur(img, mask, w, h, ctx, blurAmount, bg),
      "color-pop": () => applyColorPop(img, mask, w, h, ctx, bg),
      cartoonify: () => applyCartoonify(img, mask, w, h, ctx, cartoonStrength, bg),
      enhance: () => applyEnhance(img, mask, w, h, ctx, enhanceStrength, bg)
    };

    await (ops[mode] || ops.none)();
  }

  // auto-run pipeline
  useEffect(() => {
    if (!fileUrl) return;
    if (mode === "none") {
      loadImage(fileUrl).then(img => {
        const ctx = afterCanvasRef.current.getContext("2d");
        afterCanvasRef.current.width = img.width;
        afterCanvasRef.current.height = img.height;
        ctx.drawImage(img, 0, 0);
      });
      return;
    }
    const t = setTimeout(processPipeline, 60);
    return () => clearTimeout(t);
  }, [fileUrl, mode, blurAmount, cartoonStrength, enhanceStrength, bgUrl, applyTarget]);

  // run command
  function runCommand() {
    const res = parseCommand(commandText);
    if (!res.matched) return;

    if (res.mode) setMode(res.mode);
    if (res.blurAmount) setBlurAmount(res.blurAmount);
    if (res.cartoonStrength) setCartoonStrength(res.cartoonStrength);
    if (res.bgPreset) setBgUrl(res.bgPreset === "white" ? null : res.bgPreset);

    setTimeout(() => fileUrl && processPipeline(), 80);
  }

  // downloads
  const saveCanvas = (ref, name) => {
    const c = ref.current;
    if (!c) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = name;
    a.click();
  };

  return (
    <div className="editor-root">
      <ControlsCard
        fileUrl={fileUrl}
        setFileUrl={setFileUrl}
        commandText={commandText}
        setCommandText={setCommandText}
        runCommand={runCommand}
        mode={mode}
        setMode={setMode}
        blurAmount={blurAmount}
        setBlurAmount={setBlurAmount}
        cartoonStrength={cartoonStrength}
        setCartoonStrength={setCartoonStrength}
        enhanceStrength={enhanceStrength}
        setEnhanceStrength={setEnhanceStrength}
        bgUrl={bgUrl}
        setBgUrl={setBgUrl}
        bgPresets={bgPresets}
        downloadEdited={() => saveCanvas(afterCanvasRef, "edited.png")}
        downloadBW={() => saveCanvas(bwCanvasRef, "bw.png")}
        applyTarget={applyTarget}
        setApplyTarget={setApplyTarget}
      />

      <div className="preview-row-below">
        {[
          ["Original", beforeCanvasRef],
          ["Black & White", bwCanvasRef],
          ["Edited", afterCanvasRef]
        ].map(([label, ref]) => (
          <div className="preview-item" key={label}>
            <div className="small">{label}</div>
            <canvas ref={ref} className="preview-canvas" />
          </div>
        ))}
      </div>
    </div>
  );
}
