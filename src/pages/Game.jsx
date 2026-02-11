// Main game page - gameplay happens here
import { useLocation } from 'react-router-dom'

function Game() {
  const location = useLocation()
  const { era, country } = location.state || {}

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {country} - {era}
          </h1>
          <p className="text-gray-400">
            Game interface coming soon. This is where the magic happens!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map area - will contain Leaflet map */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg h-96">
            <h2 className="text-xl font-bold mb-4">World Map</h2>
            <div className="bg-gray-900 rounded h-full flex items-center justify-center">
              <p className="text-gray-500">Map visualization coming soon</p>
            </div>
          </div>

          {/* Management panel */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Nation Dashboard</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Treasury</p>
                <p className="text-2xl font-bold">Coming Soon</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Military Strength</p>
                <p className="text-2xl font-bold">Coming Soon</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Public Morale</p>
                <p className="text-2xl font-bold">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time controls */}
        <div className="mt-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Time Controls</h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
              Pause
            </button>
            <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
              1x Speed
            </button>
            <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition">
              5x Speed
            </button>
            <button className="px-4 py-2 bg-accent rounded hover:bg-yellow-500 transition">
              Skip to Next Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game