import React from "react"
import { Terminal, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface Log {
  id: string
  type: "info" | "warning" | "error" | "success"
  message: string
  timestamp: number
}

interface SystemLogsProps {
  logs: Log[]
}

export function SystemLogs({ logs }: SystemLogsProps) {
  const getLogIcon = (type: Log["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle size={16} className="text-yellow-400" />
      case "error":
        return <AlertTriangle size={16} className="text-red-400" />
      case "success":
        return <CheckCircle size={16} className="text-green-400" />
      default:
        return <Info size={16} className="text-blue-400" />
    }
  }

  const getLogStyle = (type: Log["type"]) => {
    switch (type) {
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/20"
      case "error":
        return "bg-red-500/10 border-red-500/20"
      case "success":
        return "bg-green-500/10 border-green-500/20"
      default:
        return "bg-blue-500/10 border-blue-500/20"
    }
  }

  return (
    <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="text-cyan-400" size={20} />
        <h3 className="text-lg font-semibold text-white">System Logs</h3>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className={`p-3 rounded-lg border ${getLogStyle(log.type)} flex items-start gap-3`}>
            {getLogIcon(log.type)}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm">{log.message}</p>
              <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

