"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export function useCamera() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isDroneCamera, setIsDroneCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clean up function to stop all tracks
  const stopAllTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsCameraActive(false)
    setIsDroneCamera(false)
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllTracks()
    }
  }, [stopAllTracks])

  const startCamera = useCallback(
    async (isDrone: boolean) => {
      try {
        setIsInitializing(true)

        // First, stop any existing camera stream
        stopAllTracks()

        // Reset error state
        setCameraError(null)

        console.log("Starting camera, isDrone:", isDrone)

        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Your browser doesn't support camera access. Please try a different browser.")
        }

        // Ensure video element exists before proceeding
        if (!videoRef.current) {
          console.error("Video element reference is null. Waiting for it to be available...")

          // Wait a short time and check again (helps with timing issues)
          await new Promise((resolve) => setTimeout(resolve, 500))

          if (!videoRef.current) {
            throw new Error("Video element not available. Please try again.")
          }
        }

        // Set up constraints based on camera type
        const constraints: MediaStreamConstraints = {
          video: isDrone
            ? { facingMode: { exact: "environment" } } // Try to use back camera for "drone" simulation
            : true, // Use any available camera
          audio: false,
        }

        console.log("Requesting media with constraints:", constraints)

        // Try to get the stream with the specified constraints
        let stream: MediaStream
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints)
        } catch (err) {
          console.warn("Failed with exact environment camera, falling back to any camera", err)
          // If environment camera fails (common on desktops), fall back to any camera
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        }

        // Store the stream for later cleanup
        streamRef.current = stream

        // Double check if video element exists
        if (!videoRef.current) {
          throw new Error("Video element not found after stream initialization")
        }

        // Set the stream as the video source
        videoRef.current.srcObject = stream

        // Make sure the video plays
        try {
          await videoRef.current.play()
          console.log("Video playback started successfully")
        } catch (playError) {
          console.error("Error playing video:", playError)
          throw new Error("Failed to play video stream. Please try again.")
        }

        // Update state
        setIsCameraActive(true)
        setIsDroneCamera(isDrone)

        return true
      } catch (error) {
        console.error("Camera start error:", error)

        // Format error message
        let errorMessage = "Failed to access camera"
        if (error instanceof Error) {
          errorMessage = error.message
        } else if (typeof error === "object" && error !== null) {
          errorMessage = JSON.stringify(error)
        }

        // Set error state
        setCameraError(errorMessage)

        // Clean up any partial setup
        stopAllTracks()

        // Re-throw for component handling
        throw new Error(errorMessage)
      } finally {
        setIsInitializing(false)
      }
    },
    [stopAllTracks],
  )

  const stopCamera = useCallback(() => {
    console.log("Stopping camera")
    stopAllTracks()
    setCameraError(null)
  }, [stopAllTracks])

  return {
    isCameraActive,
    isDroneCamera,
    videoRef,
    cameraError,
    isInitializing,
    startCamera,
    stopCamera,
  }
}

