import * as tf from "@tensorflow/tfjs"
import * as cocoSsd from "@tensorflow-models/coco-ssd"

let model = null

async function loadModel() {
  model = await cocoSsd.load()
}

loadModel()

self.onmessage = async (event) => {
  const { videoFrame } = event.data

  if (!model) {
    console.log("Model not loaded yet")
    return
  }

  const predictions = await model.detect(videoFrame)

  self.postMessage({ detections: predictions })
}

