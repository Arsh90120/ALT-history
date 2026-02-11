import { useGame } from '../context/GameContext'
import { formatCurrency, formatNumber, getMoraleStatus } from '../utils/formatters'
import { calculateMilitaryStrength } from '../utils/gameLogic'

function GameStats() {
  const { state } = useGame()

  if (!state.gameStarted) return null

  const militaryStrength = calculateMilitaryStrength(state.military)
  const moraleStatus = getMoraleStatus(state.morale.current)
  const budgetBalance = state.resources.income - state.resources.expenses

  const stats = [
    {
      label: 'Treasury',
      value: formatCurrency(state.resources.treasury),
      subtext: `${budgetBalance >= 0 ? '+' : ''}${formatCurrency(budgetBalance)}/day`,
      color: budgetBalance >= 0 ? 'text-green-400' : 'text-red-400',
      icon: '💰'
    },
    {
      label: 'Military Power',
      value: formatNumber(militaryStrength.toFixed(0)),
      subtext: `${state.military.ismobilized ? 'Mobilized' : 'Peacetime'}`,
      color: 'text-blue-400',
      icon: '⚔️'
    },
    {
      label: 'Public Morale',
      value: `${state.morale.current}%`,
      subtext: moraleStatus.text,
      color: moraleStatus.color,
      icon: '😊'
    },
    {
      label: 'Research Points',
      value: formatNumber(state.research.points.toFixed(0)),
      subtext: `+${state.research.pointsPerDay}/day`,
      color: 'text-purple-400',
      icon: '🔬'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-800 p-5 rounded-lg border-2 border-gray-700 hover:border-gray-600 transition"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="text-sm text-gray-400">{stat.label}</div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
          <div className={`text-2xl font-bold mb-1 ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-xs text-gray-500">{stat.subtext}</div>
        </div>
      ))}
    </div>
  )
}

export default GameStats