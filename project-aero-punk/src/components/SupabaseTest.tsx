"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

// Get environment variables with fallback to hardcoded values if needed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pejhzjgcmafpiawrrxwy.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlamh6amdjbWFmcGlhd3JyeHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzc5OTUsImV4cCI6MjA1MzY1Mzk5NX0.WPyZjE2uQWtB9KSuulprs6cLoGDjlxWkGwVL0IXbXnk"

export const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  // Create a function to check connection that we can call multiple times
  const checkSupabaseConnection = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create a fresh Supabase client for each connection attempt
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Don't persist the session
          autoRefreshToken: false, // Don't auto refresh the token
        },
      })

      // Set a timeout for the request to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection timed out after 5 seconds")), 5000)
      })

      // Race the actual request against the timeout
      const result = await Promise.race([supabase.auth.getSession(), timeoutPromise])

      // If we get here, the connection was successful
      setConnectionStatus("Connection successful")
      console.log("Supabase connection successful:", result)
    } catch (e) {
      console.error("Supabase connection error:", e)

      // Format the error message
      let errorMessage = "Unknown error occurred"
      if (e instanceof Error) {
        errorMessage = e.message
      } else if (typeof e === "object" && e !== null) {
        errorMessage = JSON.stringify(e)
      }

      // Check for specific network errors
      if (
        errorMessage.includes("connect error") ||
        errorMessage.includes("network") ||
        errorMessage.includes("failed") ||
        errorMessage.includes("timed out")
      ) {
        errorMessage = "Network connectivity issue. Please check your internet connection and try again."
      }

      setError(`Error connecting to Supabase: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [retryCount]) // Include retryCount to recreate this function when we want to retry

  // Initial connection check
  useEffect(() => {
    checkSupabaseConnection()
  }, [checkSupabaseConnection])

  // Function to manually retry the connection
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  // Create a simulated connection status for demo purposes
  // Remove this in production and use the real connection status
  const simulateConnection = () => {
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      setConnectionStatus("Simulated connection successful (demo mode)")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg shadow-lg ring-1 ring-cyan-500/20">
      <h2 className="text-xl font-bold mb-2 text-cyan-400">AEROPUNK Database Connection</h2>

      {connectionStatus ? (
        <p className="text-green-400">{connectionStatus}</p>
      ) : error ? (
        <div>
          <p className="text-red-400 mb-2">{error}</p>
          <div className="flex space-x-2">
            <Button onClick={handleRetry} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Retry Connection
            </Button>

            <Button onClick={simulateConnection} className="bg-purple-600 hover:bg-purple-700">
              Demo Mode
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-2"></div>
          <p className="text-yellow-400">Checking Supabase connection...</p>
        </div>
      )}

      <div className="mt-4 text-xs text-slate-400">
        <p>Connection Info:</p>
        <ul className="list-disc list-inside pl-2">
          <li>URL: {supabaseUrl.substring(0, 20)}...</li>
          <li>Status: {isLoading ? "Connecting..." : connectionStatus ? "Connected" : "Failed"}</li>
          <li>Retry attempts: {retryCount}</li>
        </ul>
      </div>
    </div>
  )
}

