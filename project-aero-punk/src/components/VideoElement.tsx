import React, { forwardRef } from "react"

interface VideoElementProps {
  isLoading: boolean
}

export const VideoElement = forwardRef<HTMLVideoElement, VideoElementProps>(({ isLoading }, ref) => (
  <div className="relative w-full h-full">
    <video ref={ref} autoPlay playsInline muted className="w-full h-full object-cover" />
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 font-medium">Loading Camera...</p>
        </div>
      </div>
    )}
  </div>
))

VideoElement.displayName = "VideoElement"

