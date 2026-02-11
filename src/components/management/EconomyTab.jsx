import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { formatCurrency, formatNumber } from '../../utils/formatters'

function EconomyTab() {
  const { state, updateResources } = useGame()
  const [taxRate, setTaxRate] = useState(50)
  const [industrialInvestment, setIndustrialInvestment] = useState(0)

  const budgetBalance = state.resources.income - state.resources.expenses

  const handleAdjustTaxes = () => {
    // Tax changes affect income and morale
    const taxDiff = taxRate - 50 // 50 is baseline
    const incomeChange = (taxDiff / 50) * 1000
    const moraleChange = -taxDiff / 5

    updateResources({
      income: Math.max(100, state.resources.income + incomeChange)
    })

    // Update morale separately
    const { updateMorale } = useGame()
    updateMorale(moraleChange)
  }

  const handleInvestInIndustry = () => {
    if (state.resources.treasury < industrialInvestment) {
      alert('Insufficient funds!')
      return
    }

    // Investment increases GDP and future income
    const gdpIncrease = industrialInvestment * 2
    const incomeIncrease = industrialInvestment * 0.1

    updateResources({
      treasury: state.resources.treasury - industrialInvestment,
      gdp: state.resources.gdp + gdpIncrease,
      income: state.resources.income + incomeIncrease
    })

    setIndustrialInvestment(0)
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Economic Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-900 rounded">
            <div className="text-gray-400 text-sm mb-1">GDP</div>
            <div className="text-xl font-bold">{formatCurrency(state.resources.gdp)}</div>
          </div>
          <div className="p-4 bg-gray-900 rounded">
            <div className="text-gray-400 text-sm mb-1">Income per Day</div>
            <div className="text-xl font-bold text-green-400">+{formatCurrency(state.resources.income)}</div>
          </div>
          <div className="p-4 bg-gray-900 rounded">
            <div className="text-gray-400 text-sm mb-1">Expenses per Day</div>
            <div className="text-xl font-bold text-red-400">-{formatCurrency(state.resources.expenses)}</div>
          </div>
        </div>
      </div>

      {/* Budget Balance */}
      <div className={`p-4 rounded border-2 ${
        budgetBalance >= 0 ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Daily Budget Balance</div>
            <div className={`text-2xl font-bold ${
              budgetBalance >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {budgetBalance >= 0 ? '+' : ''}{formatCurrency(budgetBalance)}
            </div>
          </div>
          <div className="text-4xl">{budgetBalance >= 0 ? '📈' : '📉'}</div>
        </div>
      </div>

      {/* Tax Policy */}
      <div className="p-5 bg-gray-900 rounded">
        <h4 className="text-lg font-semibold mb-3">Tax Policy</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Tax Rate</span>
              <span className="font-semibold">{taxRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-500 mt-2">
              Higher taxes = More income, Lower morale
            </div>
          </div>
          <button
            onClick={handleAdjustTaxes}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold transition"
          >
            Apply Tax Changes
          </button>
        </div>
      </div>

      {/* Industrial Investment */}
      <div className="p-5 bg-gray-900 rounded">
        <h4 className="text-lg font-semibold mb-3">Industrial Investment</h4>
        <p className="text-sm text-gray-400 mb-4">
          Invest in factories and infrastructure to boost GDP and long-term income.
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">Investment Amount</label>
            <input
              type="number"
              value={industrialInvestment}
              onChange={(e) => setIndustrialInvestment(Number(e.target.value))}
              min="0"
              max={state.resources.treasury}
              step="1000"
              className="w-full px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:border-accent outline-none"
            />
          </div>
          <button
            onClick={handleInvestInIndustry}
            disabled={industrialInvestment <= 0 || industrialInvestment > state.resources.treasury}
            className="w-full px-4 py-2 bg-accent hover:bg-yellow-500 text-dark rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Invest {formatCurrency(industrialInvestment)}
          </button>
          <div className="text-xs text-gray-500">
            Returns: +{formatCurrency(industrialInvestment * 2)} GDP, +{formatCurrency(industrialInvestment * 0.1)}/day income
          </div>
        </div>
      </div>
    </div>
  )
}

export default EconomyTab