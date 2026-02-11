import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useGameLoop } from '../hooks/useGameLoop'
import TimeControls from '../components/TimeControls'
import EventModal from '../components/EventModal'
import NotificationPanel from '../components/NotificationPanel'
import GameStats from '../components/GameStats'
import ManagementTabs from '../components/ManagementTabs'

function Game() {
  const location = useLocation()
  const navigate = useNavigate()
  const { era, country } = location.state || {}
  const { state, initializeGame } = useGame()
  const [selectedEvent, setSelectedEvent] = useState(null)
  
  // Start game loop
  useGameLoop()

  useEffect(() => {
    // Redirect if no era/country selected
    if (!era || !country) {
      navigate('/')
      return
    }

    // Initialize game if not already started
    if (!state.gameStarted) {
      initializeGame(era, country, 'normal')
    }
  }, [era, country])

  useEffect(() => {
    // Auto-show first active event
    if (state.activeEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(state.activeEvents[0])
    }
  }, [state.activeEvents])

  const handleEventClose = () => {
    setSelectedEvent(null)
    // Show next event if there are more
    if (state.activeEvents.length > 0) {
      setSelectedEvent(state.activeEvents[0])
    }
  }

  if (!state.gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-400">Initializing game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {state.playerCountry}
              </h1>
              <p className="text-gray-400">{state.era}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
            >
              ← Main Menu
            </button>
          </div>
        </div>

        {/* Time Controls */}
        <TimeControls />

        {/* Game Stats */}
        <GameStats />

        {/* Management Tabs */}
        <ManagementTabs />

        {/* Map placeholder */}
        <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
          <h2 className="text-xl font-bold mb-4">World Map</h2>
          <div className="bg-gray-900 rounded h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🗺️</div>
              <p>Interactive map coming in Phase 4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleEventClose} />
      )}

      {/* Notifications */}
      <NotificationPanel />
    </div>
  )
}

export default Game