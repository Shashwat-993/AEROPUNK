import { useRef, useEffect, useState } from "react"
import type { Detection } from "./useObjectDetection"

export function useObjectDetectionWorker() {
  const workerRef = useRef<Worker | null>(null)
  const [detections, setDetections] = useState<Detection[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const worker = new Worker(new URL("../workers/objectDetectionWorker.js", import.meta.url))
    workerRef.current = worker

    worker.onmessage = (event) => {
      const { detections } = event.data
      setDetections(detections)
    }

    worker.onerror = (error) => {
      setError(`Worker error: ${error.message}`)
    }

    return () => {
      worker.terminate()
    }
  }, [])

  const detectObjects = (videoFrame: HTMLVideoElement) => {
    if (workerRef.current) {
      workerRef.current.postMessage({ videoFrame })
    }
  }

  return { detectObjects, detections, error }
}

