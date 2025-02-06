"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing. Please check your environment variables.")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from("_realtime").select("*").limit(1)

        if (error) throw error
        setConnectionStatus("Connection successful")
        console.log("Supabase connection test result:", data)
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error occurred"
        setError(`Error connecting to Supabase: ${errorMessage}`)
        console.error("Error:", e)
      }
    }

    checkSupabaseConnection()
  }, [])

  return (
    <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg shadow-lg ring-1 ring-cyan-500/20">
      <h2 className="text-xl font-bold mb-2 text-cyan-400">AEROPUNK Database Connection</h2>
      {connectionStatus ? (
        <p className="text-green-400">{connectionStatus}</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <p className="text-yellow-400">Checking Supabase connection...</p>
      )}
    </div>
  )
}

