import { useEffect, useRef, useState } from "react"
import * as tf from "@tensorflow/tfjs"
import * as cocoSsd from "@tensorflow-models/coco-ssd"

export interface Detection {
  bbox: [number, number, number, number]
  class: string
  score: number
}

export function useObjectDetection() {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready()
        const loadedModel = await cocoSsd.load({
          base: "lite_mobilenet_v2",
        })
        setModel(loadedModel)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load object detection model")
        setIsLoading(false)
        console.error("Model loading error:", err)
      }
    }

    loadModel()
  }, [])

  const detectObjects = async (video: HTMLVideoElement): Promise<Detection[]> => {
    if (!model) return []

    try {
      const predictions = await model.detect(video)
      return predictions.map((pred) => ({
        bbox: pred.bbox as [number, number, number, number],
        class: pred.class,
        score: pred.score,
      }))
    } catch (err) {
      console.error("Detection error:", err)
      return []
    }
  }

  return {
    detectObjects,
    isLoading,
    error,
  }
}

