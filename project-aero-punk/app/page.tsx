import { SupabaseTest } from "@/src/components/SupabaseTest"
import { CameraComponent } from "@/src/components/Camera"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-5xl font-bold text-center mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">AERO</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">PUNK</span>
          </h1>
          <p className="text-slate-400 text-center text-lg mt-2">Next-Gen Drone Vision System</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SupabaseTest />
        <div className="mt-8">
          <CameraComponent />
        </div>
      </main>
    </div>
  )
}

