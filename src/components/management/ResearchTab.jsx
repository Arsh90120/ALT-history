import { useGame } from '../../context/GameContext'
import { formatNumber } from '../../utils/formatters'
import { calculateResearchProgress } from '../../utils/gameLogic'

function ResearchTab() {
  const { state, dispatch } = useGame()

  const handleStartResearch = (tech) => {
    if (state.research.currentResearch) {
      alert('Already researching something! Wait for it to complete.')
      return
    }

    dispatch({
      type: 'UPDATE_RESEARCH',
      payload: { currentResearch: tech }
    })
  }

  const handleCompleteResearch = () => {
    if (!state.research.currentResearch) return

    const tech = state.research.currentResearch
    if (state.research.points >= tech.cost) {
      dispatch({ type: 'COMPLETE_RESEARCH', payload: tech })
    }
  }

  // Auto-complete research when enough points
  if (state.research.currentResearch && state.research.points >= state.research.currentResearch.cost) {
    handleCompleteResearch()
  }

  const availableTech = state.research.availableTech.filter(
    tech => !state.research.completedTech.find(c => c.id === tech.id)
  )

  return (
    <div className="space-y-6">
      {/* Research Points */}
      <div className="p-5 bg-gray-900 rounded">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-2xl font-bold">Research Points</h3>
            <div className="text-sm text-gray-400">+{state.research.pointsPerDay} per day</div>
          </div>
          <div className="text-3xl font-bold text-purple-400">
            {formatNumber(state.research.points.toFixed(0))}
          </div>
        </div>
      </div>

      {/* Current Research */}
      {state.research.currentResearch ? (
        <div className="p-5 bg-purple-900/30 border-2 border-purple-500 rounded">
          <h4 className="text-lg font-semibold mb-2">Currently Researching</h4>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{state.research.currentResearch.name}</span>
              <span className="text-sm text-gray-400">
                {state.research.points.toFixed(0)} / {state.research.currentResearch.cost}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all"
                style={{
                  width: `${calculateResearchProgress(state.research.points, state.research.currentResearch.cost)}%`
                }}
              />
            </div>
          </div>
          <p className="text-sm text-gray-400">{state.research.currentResearch.description}</p>
        </div>
      ) : (
        <div className="p-5 bg-gray-900 rounded text-center">
          <div className="text-4xl mb-2">🔬</div>
          <p className="text-gray-400">No active research. Select a technology below to begin.</p>
        </div>
      )}

      {/* Available Technologies */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Available Technologies</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableTech.length === 0 ? (
            <div className="col-span-2 p-8 bg-gray-900 rounded text-center text-gray-500">
              All technologies researched! 🎉
            </div>
          ) : (
            availableTech.map(tech => (
              <div
                key={tech.id}
                className="p-4 bg-gray-900 rounded border-2 border-gray-700 hover:border-purple-500 transition"
              >
                <h5 className="font-semibold text-lg mb-2">{tech.name}</h5>
                <p className="text-sm text-gray-400 mb-3">{tech.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-400">Cost: {tech.cost} RP</span>
                  <button
                    onClick={() => handleStartResearch(tech)}
                    disabled={!!state.research.currentResearch}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Research
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Technologies */}
      {state.research.completedTech.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">Completed Research</h4>
          <div className="space-y-2">
            {state.research.completedTech.map(tech => (
              <div key={tech.id} className="p-3 bg-green-900/30 border border-green-700 rounded flex items-center justify-between">
                <div>
                  <span className="font-semibold">{tech.name}</span>
                  <span className="text-sm text-gray-400 ml-3">{tech.description}</span>
                </div>
                <span className="text-green-400">✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResearchTab