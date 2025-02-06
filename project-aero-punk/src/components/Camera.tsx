"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Activity, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DroneStatus } from "@/src/components/DroneStatus"
import { useCamera } from "@/src/hooks/useCamera"

export const CameraComponent: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false)
  const [isDroneConnected, setIsDroneConnected] = useState(false)
  const { isCameraActive, isDroneCamera, videoRef, startCamera, stopCamera } = useCamera()
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

  const handleCameraStart = async () => {
    try {
      await startCamera(isDroneConnected)
    } catch (error) {
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
            {isCameraActive ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-cyan-400 text-lg font-semibold">AEROPUNK Camera Feed</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <Button onClick={handleCameraStart} disabled={isCameraActive} className="bg-cyan-500 hover:bg-cyan-600">
              <Video className="mr-2 h-4 w-4" /> Start {isDroneConnected ? "Drone" : "PC"} Camera
            </Button>
            <Button onClick={stopCamera} disabled={!isCameraActive} className="bg-red-500 hover:bg-red-600">
              <Video className="mr-2 h-4 w-4" /> Stop Camera
            </Button>
            <Button onClick={toggleDetection} disabled={!isCameraActive} className="bg-purple-500 hover:bg-purple-600">
              <Activity className="mr-2 h-4 w-4" /> {isDetecting ? "Stop" : "Start"} Detection
            </Button>
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

