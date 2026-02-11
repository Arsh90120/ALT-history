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
      status: budgetBalance >= 0 ? 'positive' : 'negative'
    },
    {
      label: 'Military Strength',
      value: formatNumber(militaryStrength.toFixed(0)),
      subtext: state.military.ismobilized ? 'Mobilized' : 'Peacetime',
      status: state.military.ismobilized ? 'positive' : 'neutral'
    },
    {
      label: 'Public Morale',
      value: `${state.morale.current}%`,
      subtext: moraleStatus.text,
      status: state.morale.current >= 70 ? 'positive' : state.morale.current >= 40 ? 'neutral' : 'negative',
      useEmoji: '😊' // Keep emoji for morale as it conveys emotion better
    },
    {
      label: 'Research Progress',
      value: formatNumber(state.research.points.toFixed(0)),
      subtext: `+${state.research.pointsPerDay} per day`,
      status: 'positive'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="era-label">{stat.label}</div>
            {stat.useEmoji && (
              <div className="text-xl" style={{ filter: 'grayscale(0.3)' }}>
                {stat.useEmoji}
              </div>
            )}
          </div>
          
          <div className={`era-value mb-2 ${
            stat.status === 'positive' ? 'status-positive' :
            stat.status === 'negative' ? 'status-negative' :
            'status-neutral'
          }`}>
            {stat.value}
          </div>
          
          <div className="text-mono text-xs text-muted">
            {stat.subtext}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameStats