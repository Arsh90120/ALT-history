import { useGame } from '../context/GameContext'

function WarStatus() {
  const { state } = useGame()

  if (state.wars.length === 0) return null

  return (
    <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">⚔️</div>
        <div>
          <h3 className="text-xl font-bold text-red-300">Active Wars</h3>
          <p className="text-sm text-red-400">Your nation is at war</p>
        </div>
      </div>

      <div className="space-y-2">
        {state.wars.map((enemy, index) => (
          <div
            key={index}
            className="p-3 bg-red-900/50 rounded flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{enemy}</div>
              <div className="text-xs text-red-300">At war</div>
            </div>
            <div className="text-2xl">💥</div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-black/30 rounded text-sm text-gray-300">
        <div>War Exhaustion: {state.morale.warExhaustion}%</div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${state.morale.warExhaustion}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default WarStatus