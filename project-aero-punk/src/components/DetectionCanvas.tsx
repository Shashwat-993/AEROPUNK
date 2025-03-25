import React, { useRef, useEffect } from "react"
import type { Detection } from "../hooks/useObjectDetection"
import throttle from "lodash/throttle"

interface DetectionCanvasProps {
  video: HTMLVideoElement
  detections: Detection[]
}

export function DetectionCanvas({ video, detections }: DetectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !video || video.readyState < HTMLMediaElement.HAVE_METADATA || detections.length === 0) {
      console.warn("Video metadata not loaded or no detections available")
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Function to draw detections
    const drawDetections = () => {
      // Match canvas size to video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Constants for styling
      const bboxColor = "#00ff00"
      const bboxLineWidth = 2
      const labelBackgroundColor = "rgba(0, 255, 0, 0.2)"
      const labelTextColor = "#ffffff"
      const labelFontSize = "16px Arial"

      // Draw detections
      detections.forEach((detection) => {
        const [x, y, width, height] = detection.bbox
        const score = Math.round(detection.score * 100)
        const label = `${detection.class} ${score}%`

        // Draw bounding box
        ctx.strokeStyle = bboxColor
        ctx.lineWidth = bboxLineWidth
        ctx.strokeRect(x, y, width, height)

        // Draw label background
        ctx.fillStyle = labelBackgroundColor
        const textWidth = ctx.measureText(label).width
        ctx.fillRect(x, y - 25, textWidth + 10, 25)

        // Draw label text
        ctx.fillStyle = labelTextColor
        ctx.font = labelFontSize
        ctx.fillText(label, x + 5, y - 7)
      })
    }

    // Throttle the drawDetections function
    const throttledDrawDetections = throttle(drawDetections, 100) // Adjust the throttle interval as needed

    // Initial draw
    throttledDrawDetections()

    // Listen for video resize events
    const resizeObserver = new ResizeObserver(() => {
      throttledDrawDetections()
    })

    if (video) {
      resizeObserver.observe(video)
    }

    // Cleanup
    return () => {
      if (video) {
        resizeObserver.unobserve(video)
      }
      throttledDrawDetections.cancel() // Cancel the throttled function
    }
  }, [video, detections])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      aria-label="Object detection overlay"
    />
  )
}

