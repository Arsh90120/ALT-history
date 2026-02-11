import { useGame } from '../context/GameContext'
import { formatDateShort } from '../utils/formatters'

function TimeControls() {
  const { state, pauseGame, resumeGame, setSpeed } = useGame()

  const speedOptions = [
    { value: 1, label: '1x', description: '1 day/sec' },
    { value: 5, label: '5x', description: '5 days/sec' },
    { value: 10, label: '10x', description: '10 days/sec' },
    { value: 30, label: '30x', description: '30 days/sec' }
  ]

  const handleSkipToEvent = () => {
    // Fast forward until next event
    setSpeed(60)
    resumeGame()
  }

  return (
    <div className="card-premium p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            {state.currentDate ? formatDateShort(state.currentDate) : 'Not Started'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Day {state.daysPassed} • {state.era}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {state.isPaused ? (
            <button
              onClick={resumeGame}
              className="btn-premium px-6 py-3 bg-green-600/90 hover:bg-green-500 rounded-xl transition-all font-bold flex items-center gap-2 hover:scale-105"
            >
              <span className="text-lg">▶</span>
              Resume
            </button>
          ) : (
            <button
              onClick={pauseGame}
              className="btn-premium px-6 py-3 bg-yellow-600/90 hover:bg-yellow-500 rounded-xl transition-all font-bold flex items-center gap-2 hover:scale-105"
            >
              <span className="text-lg">⏸</span>
              Pause
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Speed
        </div>
        {speedOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setSpeed(option.value)}
            className={`
              btn-premium px-5 py-2 rounded-xl transition-all font-bold
              ${
                state.speed === option.value
                  ? 'bg-accent text-dark scale-105 shadow-glow'
                  : 'glass hover:bg-gray-700/50'
              }
            `}
            title={option.description}
          >
            {option.label}
          </button>
        ))}

        <div className="h-8 w-px bg-gray-700 mx-2"></div>

        <button
          onClick={handleSkipToEvent}
          className="btn-premium px-5 py-2 bg-purple-600/90 hover:bg-purple-500 rounded-xl transition-all font-bold flex items-center gap-2 hover:scale-105"
        >
          <span className="text-lg">⏩</span>
          Skip to Event
        </button>
      </div>

      {state.activeEvents.length > 0 && (
        <div className="mt-6 p-4 bg-red-500/10 border-2 border-red-500 rounded-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚠️</div>
            <p className="text-red-300 font-bold">
              {state.activeEvents.length} event{state.activeEvents.length > 1 ? 's' : ''} require{state.activeEvents.length === 1 ? 's' : ''} your attention!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimeControls