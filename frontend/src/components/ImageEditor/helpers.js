// src/components/ImageEditor/helpers.js
export async function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }
  
  export async function drawOriginalAndBW(src, beforeCanvas, bwCanvas) {
    const img = await loadImage(src);
    const w = img.width, h = img.height;
    if (beforeCanvas) { beforeCanvas.width = w; beforeCanvas.height = h; const bctx = beforeCanvas.getContext("2d"); bctx.clearRect(0,0,w,h); bctx.drawImage(img,0,0,w,h); }
    if (bwCanvas) {
      bwCanvas.width = w; bwCanvas.height = h;
      const bwctx = bwCanvas.getContext("2d");
      bwctx.clearRect(0,0,w,h);
      bwctx.drawImage(img,0,0,w,h);
      const data = bwctx.getImageData(0,0,w,h);
      for (let i=0;i<data.data.length;i+=4){
        const r = data.data[i], g = data.data[i+1], b = data.data[i+2];
        const y = 0.299*r + 0.587*g + 0.114*b;
        data.data[i] = data.data[i+1] = data.data[i+2] = Math.round(y);
      }
      bwctx.putImageData(data,0,0);
    }
  }
  