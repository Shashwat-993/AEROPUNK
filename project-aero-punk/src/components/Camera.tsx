"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Activity, Video, Camera, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DroneStatus } from "@/src/components/DroneStatus"
import { useCamera } from "@/src/hooks/useCamera"

export const CameraComponent: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false)
  const [isDroneConnected, setIsDroneConnected] = useState(false)
  const { isCameraActive, isDroneCamera, videoRef, cameraError, isInitializing, startCamera, stopCamera } = useCamera()

  const [droneStatus, setDroneStatus] = useState({
    batteryLevel: 0,
    gpsSignal: 0,
    isConnected: false,
  })

  useEffect(() => {
    const simulateDroneConnection = () => {
      const isConnected = Math.random() > 0.5
      setIsDroneConnected(isConnected)
      setDroneStatus({
        batteryLevel: isConnected ? Math.floor(Math.random() * 100) : 0,
        gpsSignal: isConnected ? Math.floor(Math.random() * 100) : 0,
        isConnected: isConnected,
      })
    }

    const timer = setInterval(simulateDroneConnection, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleCameraStart = async (useDroneCamera: boolean) => {
    try {
      await startCamera(useDroneCamera)
    } catch (error) {
      console.error("Failed to start camera:", error)
      alert(error instanceof Error ? error.message : "An unknown error occurred")
    }
  }

  const toggleDetection = () => {
    setIsDetecting((prev) => !prev)
    console.log(isDetecting ? "Stopping detection..." : "Starting detection...")
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl ring-1 ring-cyan-500/20">
            {/* Always render the video element but keep it hidden when not active */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
            />

            {/* Show loading state when initializing */}
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-cyan-400 text-lg font-semibold">Starting Camera...</p>
                </div>
              </div>
            )}

            {/* Show placeholder when camera is not active and not initializing */}
            {!isCameraActive && !isInitializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <Camera className="h-16 w-16 text-cyan-400 mb-4" />
                <p className="text-cyan-400 text-lg font-semibold text-center">AEROPUNK Camera Feed</p>
                {cameraError && (
                  <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg max-w-md">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{cameraError}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleCameraStart(false)}
              disabled={isCameraActive || isInitializing}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              <Video className="mr-2 h-4 w-4" />
              {isInitializing ? "Starting..." : "Start PC Camera"}
            </Button>
            <Button
              onClick={() => handleCameraStart(true)}
              disabled={!isDroneConnected || isCameraActive || isInitializing}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Video className="mr-2 h-4 w-4" />
              {isInitializing ? "Starting..." : "Start Drone Camera"}
            </Button>
            <Button
              onClick={stopCamera}
              disabled={!isCameraActive || isInitializing}
              className="bg-red-500 hover:bg-red-600"
            >
              <Video className="mr-2 h-4 w-4" /> Stop Camera
            </Button>
            <Button
              onClick={toggleDetection}
              disabled={!isCameraActive || isInitializing}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Activity className="mr-2 h-4 w-4" /> {isDetecting ? "Stop" : "Start"} Detection
            </Button>
          </div>

          {/* Camera debug info */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Camera Debug Info:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <div>
                Status:{" "}
                <span className={isCameraActive ? "text-green-400" : "text-red-400"}>
                  {isCameraActive ? "Active" : isInitializing ? "Initializing" : "Inactive"}
                </span>
              </div>
              <div>
                Type:{" "}
                <span className="text-cyan-400">
                  {isCameraActive ? (isDroneCamera ? "Drone Camera" : "PC Camera") : "None"}
                </span>
              </div>
              <div>
                Video Ref:{" "}
                <span className={videoRef.current ? "text-green-400" : "text-red-400"}>
                  {videoRef.current ? "Available" : "Not Available"}
                </span>
              </div>
              <div>
                Error: <span className="text-red-400">{cameraError ? "Yes" : "None"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <DroneStatus {...droneStatus} />
          <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg shadow-lg ring-1 ring-cyan-500/20">
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">AEROPUNK System Logs</h3>
            <p className="text-slate-300">
              {isDroneConnected
                ? `Drone connected. ${isCameraActive ? (isDroneCamera ? "Using drone camera." : "Using PC camera.") : "Camera inactive."}`
                : `Drone not connected. ${isCameraActive ? "Using PC camera." : "Camera inactive."}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

