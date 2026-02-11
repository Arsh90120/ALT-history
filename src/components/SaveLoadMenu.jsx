import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { saveGame, loadGame, getSaveInfo, deleteSave } from '../utils/saveGame'
import { useNavigate } from 'react-router-dom'

function SaveLoadMenu() {
  const { state, dispatch } = useGame()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [showConfirmRestart, setShowConfirmRestart] = useState(false)
  const [notification, setNotification] = useState(null)

  const saveInfo = getSaveInfo()

  const handleSave = () => {
    const result = saveGame(state)
    setNotification(result)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleLoad = () => {
    const result = loadGame()
    if (result.success) {
      dispatch({ type: 'LOAD_GAME', payload: result.data })
      setNotification({ success: true, message: 'Game loaded!' })
      setTimeout(() => {
        setNotification(null)
        setIsOpen(false)
      }, 1500)
    } else {
      setNotification(result)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleRestart = () => {
    deleteSave()
    navigate('/')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 card-premium p-3 rounded-xl hover:scale-105 transition-all"
        title="Save/Load Menu"
      >
        <div className="text-2xl">💾</div>
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative card-premium w-full max-w-md rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent p-6 border-b border-accent/30">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Game Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="glass p-2 rounded-lg hover:bg-gray-700/50 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Notification */}
              {notification && (
                <div className={`p-3 rounded-xl text-center font-semibold animate-fade-in ${
                  notification.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                }`}>
                  {notification.message}
                </div>
              )}

              {/* Save Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wide text-sm">Save Game</h3>
                <button
                  onClick={handleSave}
                  className="btn-premium w-full p-4 bg-blue-600/90 hover:bg-blue-500 rounded-xl transition-all font-bold flex items-center justify-center gap-2 hover:scale-105"
                >
                  <span className="text-xl">💾</span>
                  Save Current Game
                </button>
                {saveInfo && (
                  <div className="glass p-3 rounded-lg text-sm">
                    <div className="text-gray-400">Last Save:</div>
                    <div className="font-semibold">{saveInfo.country} - {saveInfo.era}</div>
                    <div className="text-gray-500 text-xs mt-1">
                      Day {saveInfo.daysPassed} • {formatDate(saveInfo.date)}
                    </div>
                  </div>
                )}
              </div>

              {/* Load Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wide text-sm">Load Game</h3>
                <button
                  onClick={handleLoad}
                  disabled={!saveInfo}
                  className={`btn-premium w-full p-4 rounded-xl transition-all font-bold flex items-center justify-center gap-2 ${
                    saveInfo
                      ? 'bg-green-600/90 hover:bg-green-500 hover:scale-105'
                      : 'bg-gray-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="text-xl">📂</span>
                  Load Saved Game
                </button>
              </div>

              {/* Restart Section */}
              <div className="space-y-3 pt-4 border-t border-gray-700">
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wide text-sm">New Game</h3>
                {!showConfirmRestart ? (
                  <button
                    onClick={() => setShowConfirmRestart(true)}
                    className="btn-premium w-full p-4 bg-orange-600/90 hover:bg-orange-500 rounded-xl transition-all font-bold flex items-center justify-center gap-2 hover:scale-105"
                  >
                    <span className="text-xl">🔄</span>
                    Restart Game
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-center">
                      <p className="text-red-300 font-semibold text-sm">⚠️ This will delete your current progress!</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleRestart}
                        className="btn-premium flex-1 p-3 bg-red-600/90 hover:bg-red-500 rounded-xl transition-all font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowConfirmRestart(false)}
                        className="btn-premium flex-1 p-3 glass hover:bg-gray-700/50 rounded-xl transition-all font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-500">
              <p>Saves are stored locally in your browser</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SaveLoadMenu