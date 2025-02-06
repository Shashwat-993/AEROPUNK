"use client"

import type React from "react"
import { Battery, Signal, Power, Wifi } from "lucide-react"

interface DroneStatusProps {
  batteryLevel: number
  gpsSignal: number
  isConnected: boolean
}

export const DroneStatus: React.FC<DroneStatusProps> = ({ batteryLevel, gpsSignal, isConnected }) => {
  const getBatteryColor = (level: number) => {
    if (level <= 20) return "text-red-400"
    if (level <= 50) return "text-yellow-400"
    return "text-green-400"
  }

  const getSignalColor = (level: number) => {
    if (level <= 30) return "text-red-400"
    if (level <= 70) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 shadow-lg ring-1 ring-cyan-500/20">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">AEROPUNK Drone Status</h3>
      {isConnected ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className={getBatteryColor(batteryLevel)} size={20} />
              <span className="text-slate-300">Battery</span>
            </div>
            <span className={`font-medium ${getBatteryColor(batteryLevel)}`}>{batteryLevel}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Signal className={getSignalColor(gpsSignal)} size={20} />
              <span className="text-slate-300">GPS Signal</span>
            </div>
            <span className={`font-medium ${getSignalColor(gpsSignal)}`}>{gpsSignal}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Power className="text-green-400" size={20} />
              <span className="text-slate-300">Connection</span>
            </div>
            <span className="font-medium text-green-400">Connected</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="text-red-400" size={20} />
            <span className="text-slate-300">Drone Connection</span>
          </div>
          <span className="font-medium text-red-400">Disconnected</span>
        </div>
      )}
    </div>
  )
}

