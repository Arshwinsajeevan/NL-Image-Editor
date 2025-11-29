// src/components/ImageEditor/effects.js
import { loadImage } from "./helpers";

/* applyReplaceComposite(img, personMask, w, h, ctx, bgUrl) */
export async function applyReplaceComposite(img, personMask, w, h, ctx, bgUrl) {
  // draw BG
  if (bgUrl) {
    const bgImg = await loadImage(bgUrl);
    const ratioBg = bgImg.width / bgImg.height;
    const ratioCanvas = w / h;
    let drawW = w,
      drawH = h,
      drawX = 0,
      drawY = 0;
    if (ratioBg > ratioCanvas) {
      drawH = h;
      drawW = bgImg.width * (h / bgImg.height);
      drawX = -(drawW - w) / 2;
    } else {
      drawW = w;
      drawH = bgImg.height * (w / bgImg.width);
      drawY = -(drawH - h) / 2;
    }
    ctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }

  // draw person masked
  const personCanvas = document.createElement("canvas");
  personCanvas.width = w;
  personCanvas.height = h;
  const pctx = personCanvas.getContext("2d");
  pctx.drawImage(img, 0, 0, w, h);

  // mask
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const mctx = maskCanvas.getContext("2d");
  const maskImg = mctx.createImageData(w, h);
  for (let i = 0; i < personMask.data.length; i++) {
    maskImg.data[i * 4 + 3] = personMask.data[i] ? 255 : 0;
    maskImg.data[i * 4 + 0] =
      maskImg.data[i * 4 + 1] =
      maskImg.data[i * 4 + 2] =
        255;
  }
  mctx.putImageData(maskImg, 0, 0);
  pctx.globalCompositeOperation = "destination-in";
  pctx.drawImage(maskCanvas, 0, 0);
  pctx.globalCompositeOperation = "source-over";
  ctx.drawImage(personCanvas, 0, 0);
}

/* applyBackgroundBlur */
export async function applyBackgroundBlur(
  img,
  personMask,
  w,
  h,
  ctx,
  blurPx,
  bgUrl
) {
  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = w;
  bgCanvas.height = h;
  const bgCtx = bgCanvas.getContext("2d");
  if (bgUrl) {
    const bgImg = await loadImage(bgUrl);
    const ratioBg = bgImg.width / bgImg.height;
    const ratioCanvas = w / h;
    let drawW = w,
      drawH = h,
      drawX = 0,
      drawY = 0;
    if (ratioBg > ratioCanvas) {
      drawH = h;
      drawW = bgImg.width * (h / bgImg.height);
      drawX = -(drawW - w) / 2;
    } else {
      drawW = w;
      drawH = bgImg.height * (w / bgImg.width);
      drawY = -(drawH - h) / 2;
    }
    bgCtx.drawImage(bgImg, drawX, drawY, drawW, drawH);
  } else {
    bgCtx.drawImage(img, 0, 0, w, h);
  }

  const blurred = document.createElement("canvas");
  blurred.width = w;
  blurred.height = h;
  const blurredCtx = blurred.getContext("2d");
  blurredCtx.filter = `blur(${blurPx}px)`;
  blurredCtx.drawImage(bgCanvas, 0, 0, w, h);
  blurredCtx.filter = "none";
  ctx.drawImage(blurred, 0, 0, w, h);

  // person sharp
  const personCanvas = document.createElement("canvas");
  personCanvas.width = w;
  personCanvas.height = h;
  const pctx = personCanvas.getContext("2d");
  pctx.drawImage(img, 0, 0, w, h);
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const mctx = maskCanvas.getContext("2d");
  const maskImg = mctx.createImageData(w, h);
  for (let i = 0; i < personMask.data.length; i++) {
    maskImg.data[i * 4 + 3] = personMask.data[i] ? 255 : 0;
    maskImg.data[i * 4 + 0] =
      maskImg.data[i * 4 + 1] =
      maskImg.data[i * 4 + 2] =
        255;
  }
  mctx.putImageData(maskImg, 0, 0);
  pctx.globalCompositeOperation = "destination-in";
  pctx.drawImage(maskCanvas, 0, 0);
  pctx.globalCompositeOperation = "source-over";
  ctx.drawImage(personCanvas, 0, 0);
}

/* applyColorPop */
export async function applyColorPop(img, personMask, w, h, ctx, bgUrl) {
  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = w;
  bgCanvas.height = h;
  const bgCtx = bgCanvas.getContext("2d");
  if (bgUrl) {
    const bgImg = await loadImage(bgUrl);
    const ratioBg = bgImg.width / bgImg.height;
    const ratioCanvas = w / h;
    let drawW = w,
      drawH = h,
      drawX = 0,
      drawY = 0;
    if (ratioBg > ratioCanvas) {
      drawH = h;
      drawW = bgImg.width * (h / bgImg.height);
      drawX = -(drawW - w) / 2;
    } else {
      drawW = w;
      drawH = bgImg.height * (w / bgImg.width);
      drawY = -(drawH - h) / 2;
    }
    bgCtx.drawImage(bgImg, drawX, drawY, drawW, drawH);
  } else {
    bgCtx.drawImage(img, 0, 0, w, h);
  }
  const bgData = bgCtx.getImageData(0, 0, w, h);
  for (let i = 0; i < bgData.data.length; i += 4) {
    const r = bgData.data[i],
      g = bgData.data[i + 1],
      b = bgData.data[i + 2];
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    bgData.data[i] = bgData.data[i + 1] = bgData.data[i + 2] = Math.round(y);
  }
  bgCtx.putImageData(bgData, 0, 0);
  ctx.drawImage(bgCanvas, 0, 0, w, h);

  // draw person colored
  const personCanvas = document.createElement("canvas");
  personCanvas.width = w;
  personCanvas.height = h;
  const pctx = personCanvas.getContext("2d");
  pctx.drawImage(img, 0, 0, w, h);
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const mctx = maskCanvas.getContext("2d");
  const maskImg = mctx.createImageData(w, h);
  for (let i = 0; i < personMask.data.length; i++) {
    maskImg.data[i * 4 + 3] = personMask.data[i] ? 255 : 0;
    maskImg.data[i * 4 + 0] =
      maskImg.data[i * 4 + 1] =
      maskImg.data[i * 4 + 2] =
        255;
  }
  mctx.putImageData(maskImg, 0, 0);
  pctx.globalCompositeOperation = "destination-in";
  pctx.drawImage(maskCanvas, 0, 0);
  pctx.globalCompositeOperation = "source-over";
  ctx.drawImage(personCanvas, 0, 0);
}

/* applyCartoonify */
export async function applyCartoonify(
  img,
  personMask,
  w,
  h,
  ctx,
  levels = 6,
  bgUrl
) {
  const base = document.createElement("canvas");
  base.width = w;
  base.height = h;
  const bctx = base.getContext("2d");
  if (bgUrl) {
    const bgImg = await loadImage(bgUrl);
    const ratioBg = bgImg.width / bgImg.height;
    const ratioCanvas = w / h;
    let drawW = w,
      drawH = h,
      drawX = 0,
      drawY = 0;
    if (ratioBg > ratioCanvas) {
      drawH = h;
      drawW = bgImg.width * (h / bgImg.height);
      drawX = -(drawW - w) / 2;
    } else {
      drawW = w;
      drawH = bgImg.height * (w / bgImg.width);
      drawY = -(drawH - h) / 2;
    }
    bctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
    // draw masked person
    const personCanvas = document.createElement("canvas");
    personCanvas.width = w;
    personCanvas.height = h;
    const pctx = personCanvas.getContext("2d");
    pctx.drawImage(img, 0, 0, w, h);
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = w;
    maskCanvas.height = h;
    const mctx = maskCanvas.getContext("2d");
    const maskImg = mctx.createImageData(w, h);
    for (let i = 0; i < personMask.data.length; i++) {
      maskImg.data[i * 4 + 3] = personMask.data[i] ? 255 : 0;
      maskImg.data[i * 4 + 0] =
        maskImg.data[i * 4 + 1] =
        maskImg.data[i * 4 + 2] =
          255;
    }
    mctx.putImageData(maskImg, 0, 0);
    pctx.globalCompositeOperation = "destination-in";
    pctx.drawImage(maskCanvas, 0, 0);
    pctx.globalCompositeOperation = "source-over";
    bctx.drawImage(personCanvas, 0, 0);
  } else {
    bctx.drawImage(img, 0, 0, w, h);
  }

  // posterize
  const data = bctx.getImageData(0, 0, w, h);
  function posterize(v, levels) {
    const bucket = Math.floor((v * levels) / 256);
    return Math.round((bucket * 255) / Math.max(1, levels - 1));
  }
  for (let i = 0; i < data.data.length; i += 4) {
    data.data[i] = posterize(data.data[i], levels);
    data.data[i + 1] = posterize(data.data[i + 1], levels);
    data.data[i + 2] = posterize(data.data[i + 2], levels);
  }

  // edge detection (Sobel)
  const gray = new Float32Array(w * h);
  const orig = bctx.getImageData(0, 0, w, h);
  for (let i = 0, p = 0; i < orig.data.length; i += 4, p++) {
    const r = orig.data[i],
      g = orig.data[i + 1],
      b = orig.data[i + 2];
    gray[p] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  const edges = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let sumX = 0,
        sumY = 0,
        k = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++, k++) {
          const val = gray[(y + ky) * w + (x + kx)];
          sumX += gx[k] * val;
          sumY += gy[k] * val;
        }
      }
      const mag = Math.sqrt(sumX * sumX + sumY * sumY);
      edges[y * w + x] = mag;
    }
  }
  let maxE = 0;
  for (let i = 0; i < edges.length; i++) if (edges[i] > maxE) maxE = edges[i];
  if (maxE === 0) maxE = 1;
  for (let y = 0, p = 0; y < h; y++) {
    for (let x = 0; x < w; x++, p++) {
      const e = Math.min(255, Math.round((edges[p] / maxE) * 255));
      const idx = p * 4;
      const edgeThreshold = 50;
      if (e > edgeThreshold) {
        data.data[idx] = data.data[idx + 1] = data.data[idx + 2] = 0;
      }
    }
  }
  ctx.putImageData(data, 0, 0);
}

/* applyEnhance */
export async function applyEnhance(
  img,
  personMask,
  w,
  h,
  ctx,
  strength = 1.1,
  bgUrl
) {
  const base = document.createElement("canvas");
  base.width = w;
  base.height = h;
  const bctx = base.getContext("2d");
  if (bgUrl) {
    const bgImg = await loadImage(bgUrl);
    const ratioBg = bgImg.width / bgImg.height;
    const ratioCanvas = w / h;
    let drawW = w,
      drawH = h,
      drawX = 0,
      drawY = 0;
    if (ratioBg > ratioCanvas) {
      drawH = h;
      drawW = bgImg.width * (h / bgImg.height);
      drawX = -(drawW - w) / 2;
    } else {
      drawW = w;
      drawH = bgImg.height * (w / bgImg.width);
      drawY = -(drawH - h) / 2;
    }
    bctx.drawImage(bgImg, drawX, drawY, drawW, drawH);
    const personCanvas = document.createElement("canvas");
    personCanvas.width = w;
    personCanvas.height = h;
    const pctx = personCanvas.getContext("2d");
    pctx.drawImage(img, 0, 0, w, h);
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = w;
    maskCanvas.height = h;
    const mctx = maskCanvas.getContext("2d");
    const maskImg = mctx.createImageData(w, h);
    for (let i = 0; i < personMask.data.length; i++) {
      maskImg.data[i * 4 + 3] = personMask.data[i] ? 255 : 0;
      maskImg.data[i * 4 + 0] =
        maskImg.data[i * 4 + 1] =
        maskImg.data[i * 4 + 2] =
          255;
    }
    mctx.putImageData(maskImg, 0, 0);
    pctx.globalCompositeOperation = "destination-in";
    pctx.drawImage(maskCanvas, 0, 0);
    pctx.globalCompositeOperation = "source-over";
    bctx.drawImage(personCanvas, 0, 0);
  } else {
    bctx.drawImage(img, 0, 0, w, h);
  }

  const id = bctx.getImageData(0, 0, w, h);
  const contrast = strength;
  for (let i = 0; i < id.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let v = id.data[i + c];
      v = (v - 128) * contrast + 128;
      id.data[i + c] = Math.max(0, Math.min(255, Math.round(v)));
    }
    const r = id.data[i],
      g = id.data[i + 1],
      b = id.data[i + 2];
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max !== min) {
      const satBoost = 1 + (strength - 1) * 0.5;
      id.data[i] = Math.round(
        Math.max(0, Math.min(255, (r - l) * satBoost + l))
      );
      id.data[i + 1] = Math.round(
        Math.max(0, Math.min(255, (g - l) * satBoost + l))
      );
      id.data[i + 2] = Math.round(
        Math.max(0, Math.min(255, (b - l) * satBoost + l))
      );
    }
  }
  ctx.putImageData(id, 0, 0);
}
