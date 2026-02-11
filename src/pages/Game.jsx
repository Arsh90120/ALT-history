import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useGameLoop } from '../hooks/useGameLoop'
import TimeControls from '../components/TimeControls'
import EventModal from '../components/EventModal'
import NotificationPanel from '../components/NotificationPanel'
import GameStats from '../components/GameStats'

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

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map area placeholder */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <h2 className="text-xl font-bold mb-4">World Map</h2>
            <div className="bg-gray-900 rounded h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🗺️</div>
                <p>Interactive map coming in Phase 4</p>
              </div>
            </div>
          </div>

          {/* Event Queue */}
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <h2 className="text-xl font-bold mb-4">Events & Decisions</h2>
            <div className="space-y-3">
              {state.activeEvents.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-3xl mb-2">✓</div>
                  <p>No pending events</p>
                  <p className="text-sm mt-2">Time is advancing...</p>
                </div>
              ) : (
                state.activeEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full p-4 bg-red-900/30 border-2 border-red-500 rounded-lg hover:bg-red-900/50 transition text-left"
                  >
                    <div className="font-semibold mb-1">{event.title}</div>
                    <div className="text-sm text-gray-400">Click to respond</div>
                  </button>
                ))
              )}

              {/* Recent History */}
              {state.eventHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Decisions</h3>
                  <div className="space-y-2">
                    {state.eventHistory.slice(-3).reverse().map((event, idx) => (
                      <div
                        key={idx}
                        className="text-sm p-2 bg-gray-900 rounded"
                      >
                        <div className="text-gray-300">{event.title}</div>
                        <div className="text-xs text-gray-500">Resolved</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Military & Diplomacy Tabs - Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <h2 className="text-xl font-bold mb-4">Military Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Army</span>
                <span className="font-semibold">{state.military.army.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Navy</span>
                <span className="font-semibold">{state.military.navy.toLocaleString()} ships</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Air Force</span>
                <span className="font-semibold">{state.military.airForce.toLocaleString()} aircraft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Readiness</span>
                <span className="font-semibold">{state.military.readiness}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
            <h2 className="text-xl font-bold mb-4">Diplomacy</h2>
            <div className="text-center text-gray-500 py-4">
              <p>Diplomatic interface coming in Phase 3</p>
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