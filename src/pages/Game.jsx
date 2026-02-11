import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useGameLoop } from '../hooks/useGameLoop'
import { useAI } from '../hooks/useAI'
import TimeControls from '../components/TimeControls'
import EventModal from '../components/EventModal'
import NotificationCenter from '../components/NotificationCenter'
import SaveLoadMenu from '../components/SaveLoadMenu'
import GameStats from '../components/GameStats'
import ManagementTabs from '../components/ManagementTabs'
import AllianceProposal from '../components/AllianceProposal'
import WarStatus from '../components/WarStatus'
import HistoricalFact from '../components/HistoricalFact'
import { autoSave } from '../utils/saveGame'

function Game() {
  const location = useLocation()
  const navigate = useNavigate()
  const { era, country, loadedGame } = location.state || {}
  const { state, initializeGame } = useGame()
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [hasInitialized, setHasInitialized] = useState(false)
  
  useGameLoop()
  useAI()

  useEffect(() => {
    // Only initialize if we're not loading a saved game
    if (loadedGame) {
      // Game state already loaded in Home.jsx
      setHasInitialized(true)
      return
    }

    if (!era || !country) {
      navigate('/')
      return
    }

    // Only initialize once and if game hasn't started
    if (!state.gameStarted && !hasInitialized) {
      initializeGame(era, country, 'normal')
      setHasInitialized(true)
    }
  }, [era, country, loadedGame, hasInitialized])

  useEffect(() => {
    if (state.activeEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(state.activeEvents[0])
    }
  }, [state.activeEvents])

  // Auto-save every 5 minutes
  useEffect(() => {
    if (!state.gameStarted) return

    const autoSaveInterval = setInterval(() => {
      autoSave(state)
    }, 5 * 60 * 1000)

    return () => clearInterval(autoSaveInterval)
  }, [state])

  const handleEventClose = () => {
    setSelectedEvent(null)
    if (state.activeEvents.length > 0) {
      setSelectedEvent(state.activeEvents[0])
    }
  }

  if (!state.gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-pulse-slow">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-2xl font-light text-gray-400">Preparing your timeline...</p>
          <HistoricalFact className="mt-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="card-premium p-6 rounded-2xl animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl font-black tracking-tight">
                  {state.playerCountry}
                </h1>
                <span className="era-badge">{state.era}</span>
              </div>
              <p className="text-sm text-gray-500">
                "Every decision shapes destiny"
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="btn-premium px-6 py-3 glass rounded-xl font-semibold hover:bg-gray-700/50 transition-all"
            >
              ← Exit to Menu
            </button>
          </div>
        </div>

        <TimeControls />

        {state.wars.length > 0 && <WarStatus />}

        <GameStats />

        <ManagementTabs />

        {/* World Status */}
        <div className="card-premium p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">World Status</h2>
            <div className="text-sm text-gray-500">Live Intelligence</div>
          </div>
          <div className="glass rounded-xl p-8 flex items-center justify-center">
            <div className="text-center text-gray-500 space-y-3">
              <div className="text-5xl">🗺️</div>
              <p className="font-semibold">Interactive Map</p>
              <p className="text-sm">Visual representation coming soon</p>
              <HistoricalFact className="!text-gray-600 mt-4" />
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <HistoricalFact />
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={handleEventClose} />
      )}

      <AllianceProposal />
      <NotificationCenter />
      <SaveLoadMenu />
    </div>
  )
}

export default Game