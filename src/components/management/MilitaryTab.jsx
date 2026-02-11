import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { formatNumber, formatCurrency } from '../../utils/formatters'
import { calculateMilitaryStrength } from '../../utils/gameLogic'

function MilitaryTab() {
  const { state, updateMilitary, updateResources } = useGame()
  const [recruitAmount, setRecruitAmount] = useState(0)

  const militaryStrength = calculateMilitaryStrength(state.military)
  const recruitCost = recruitAmount * 10 // $10 per soldier

  const handleRecruit = (branch) => {
    if (state.resources.treasury < recruitCost) {
      alert('Insufficient funds!')
      return
    }

    const updates = { [branch]: state.military[branch] + recruitAmount }
    updateMilitary(updates)
    updateResources({ treasury: state.resources.treasury - recruitCost })
    setRecruitAmount(0)
  }

  const handleMobilize = () => {
    if (state.military.ismobilized) {
      // Demobilize
      updateMilitary({ ismobilized: false, readiness: 50 })
      updateResources({ expenses: state.resources.expenses - 1000 })
    } else {
      // Mobilize
      updateMilitary({ ismobilized: true, readiness: 100 })
      updateResources({ expenses: state.resources.expenses + 1000 })
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Military Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-900 rounded">
            <div className="text-gray-400 text-sm mb-1">Total Military Strength</div>
            <div className="text-2xl font-bold text-blue-400">{formatNumber(militaryStrength.toFixed(0))}</div>
          </div>
          <div className="p-4 bg-gray-900 rounded">
            <div className="text-gray-400 text-sm mb-1">Readiness Level</div>
            <div className="text-2xl font-bold">{state.military.readiness}%</div>
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${state.military.readiness}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobilization Status */}
      <div className={`p-4 rounded border-2 ${
        state.military.ismobilized
          ? 'bg-red-900/20 border-red-500'
          : 'bg-blue-900/20 border-blue-500'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Mobilization Status</div>
            <div className="text-xl font-bold">
              {state.military.ismobilized ? 'War Footing' : 'Peacetime'}
            </div>
          </div>
          <button
            onClick={handleMobilize}
            className={`px-6 py-3 rounded font-semibold transition ${
              state.military.ismobilized
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {state.military.ismobilized ? 'Demobilize' : 'Mobilize for War'}
          </button>
        </div>
        <div className="text-sm text-gray-400 mt-2">
          {state.military.ismobilized
            ? 'Maximum readiness, +$1000/day expenses'
            : 'Reduced readiness, lower expenses'}
        </div>
      </div>

      {/* Force Composition */}
      <div className="p-5 bg-gray-900 rounded">
        <h4 className="text-lg font-semibold mb-4">Force Composition</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="font-semibold">Army</div>
              <div className="text-sm text-gray-400">{formatNumber(state.military.army)} troops</div>
            </div>
            <div className="text-2xl">🪖</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="font-semibold">Navy</div>
              <div className="text-sm text-gray-400">{formatNumber(state.military.navy)} ships</div>
            </div>
            <div className="text-2xl">⚓</div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
            <div>
              <div className="font-semibold">Air Force</div>
              <div className="text-sm text-gray-400">{formatNumber(state.military.airForce)} aircraft</div>
            </div>
            <div className="text-2xl">✈️</div>
          </div>
        </div>
      </div>

      {/* Recruitment */}
      <div className="p-5 bg-gray-900 rounded">
        <h4 className="text-lg font-semibold mb-3">Recruitment</h4>
        <p className="text-sm text-gray-400 mb-4">
          Recruit additional forces. Cost: $10 per soldier
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Number to Recruit</label>
            <input
              type="number"
              value={recruitAmount}
              onChange={(e) => setRecruitAmount(Number(e.target.value))}
              min="0"
              step="10000"
              className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-accent outline-none"
            />
          </div>
          <div className="text-sm text-gray-400">
            Total Cost: {formatCurrency(recruitCost)}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleRecruit('army')}
              disabled={recruitAmount <= 0 || recruitCost > state.resources.treasury}
              className="px-4 py-3 bg-green-700 hover:bg-green-600 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Army
            </button>
            <button
              onClick={() => handleRecruit('navy')}
              disabled={recruitAmount <= 0 || recruitCost > state.resources.treasury}
              className="px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Navy
            </button>
            <button
              onClick={() => handleRecruit('airForce')}
              disabled={recruitAmount <= 0 || recruitCost > state.resources.treasury}
              className="px-4 py-3 bg-purple-700 hover:bg-purple-600 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Air Force
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MilitaryTab