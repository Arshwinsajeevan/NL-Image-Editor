// src/components/ImageEditor/segmentation.js
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

let _model = null;
export async function loadModel() {
  if (_model) return _model;
  _model = await bodyPix.load({ architecture: "MobileNetV1", outputStride: 16, multiplier: 0.75, quantBytes: 2 });
  return _model;
}

export async function segmentPerson(img, options = {}) {
  if (!_model) await loadModel();
  const cfg = { internalResolution: options.internalResolution || "medium", segmentationThreshold: options.segmentationThreshold || 0.7 };
  const seg = await _model.segmentPerson(img, cfg);
  return seg;
}
