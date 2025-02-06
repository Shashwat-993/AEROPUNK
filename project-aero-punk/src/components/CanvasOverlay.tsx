import type React from "react"
import { forwardRef, useEffect } from "react"
import type { Detection } from "../hooks/useObjectDetection"

interface CanvasOverlayProps {
  video: HTMLVideoElement
  detections: Detection[]
}

export const CanvasOverlay = forwardRef<HTMLCanvasElement, CanvasOverlayProps>(({ video, detections }, ref) => {
  useEffect(() => {
    const canvas = ref as React.MutableRefObject<HTMLCanvasElement>
    if (!canvas.current) return

    const ctx = canvas.current.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)

    detections.forEach(({ bbox, class: label, score }) => {
      const [x, y, width, height] = bbox
      ctx.strokeStyle = "cyan"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      ctx.fillStyle = "cyan"
      ctx.font = "16px Arial"
      ctx.fillText(`${label} (${Math.round(score * 100)}%)`, x, y - 5)
    })
  }, [detections, ref])

  return <canvas ref={ref} className="absolute top-0 left-0" width={video.videoWidth} height={video.videoHeight} />
})

CanvasOverlay.displayName = "CanvasOverlay"

