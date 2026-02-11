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
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            {state.currentDate ? formatDateShort(state.currentDate) : 'Not Started'}
          </h2>
          <p className="text-gray-400 text-sm">
            Day {state.daysPassed} • {state.era}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {state.isPaused ? (
            <button
              onClick={resumeGame}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded transition font-semibold"
            >
              ▶ Resume
            </button>
          ) : (
            <button
              onClick={pauseGame}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded transition font-semibold"
            >
              ⏸ Pause
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {speedOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setSpeed(option.value)}
            className={`
              px-4 py-2 rounded transition font-semibold
              ${
                state.speed === option.value
                  ? 'bg-accent text-dark'
                  : 'bg-gray-700 hover:bg-gray-600 text-light'
              }
            `}
            title={option.description}
          >
            {option.label}
          </button>
        ))}

        <button
          onClick={handleSkipToEvent}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded transition font-semibold ml-auto"
        >
          ⏩ Skip to Next Event
        </button>
      </div>

      {state.activeEvents.length > 0 && (
        <div className="mt-4 p-3 bg-red-900/30 border-2 border-red-500 rounded animate-pulse">
          <p className="text-red-300 font-semibold">
            ⚠️ {state.activeEvents.length} event{state.activeEvents.length > 1 ? 's' : ''} require{state.activeEvents.length === 1 ? 's' : ''} your attention!
          </p>
        </div>
      )}
    </div>
  )
}

export default TimeControls