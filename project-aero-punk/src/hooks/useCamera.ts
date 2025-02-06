"use client"

import { useState, useRef, useCallback } from "react"

export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isDroneCamera, setIsDroneCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const startCamera = useCallback(async (isDrone: boolean) => {
    try {
      let stream
      if (isDrone) {
        // Simulating drone camera connection
        // In a real scenario, this would connect to the drone's video feed
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        setIsDroneCamera(true)
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setIsDroneCamera(false)
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      throw new Error("Failed to access camera. Please ensure you have given permission.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
      setIsDroneCamera(false)
    }
  }, [])

  return { isCameraActive, isDroneCamera, videoRef, startCamera, stopCamera }
}

