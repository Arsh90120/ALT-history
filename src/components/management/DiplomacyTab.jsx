import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { getRelationshipStatus } from '../../utils/formatters'

function DiplomacyTab() {
  const { state, updateRelationship, updateResources } = useGame()
  const [selectedCountry, setSelectedCountry] = useState(null)

  const countries = Object.keys(state.relationships)

  const handleDiplomaticAction = (action) => {
    if (!selectedCountry) return

    const cost = 1000
    if (state.resources.treasury < cost) {
      alert('Insufficient funds for diplomatic action!')
      return
    }

    let relationshipChange = 0

    switch (action) {
      case 'gift':
        relationshipChange = 10
        updateResources({ treasury: state.resources.treasury - cost * 2 })
        break
      case 'trade':
        relationshipChange = 5
        updateResources({ 
          treasury: state.resources.treasury - cost,
          income: state.resources.income + 100
        })
        break
      case 'alliance':
        relationshipChange = 20
        updateResources({ treasury: state.resources.treasury - cost })
        break
      case 'threaten':
        relationshipChange = -15
        break
      case 'embargo':
        relationshipChange = -25
        updateResources({ income: state.resources.income - 50 })
        break
    }

    updateRelationship(selectedCountry, relationshipChange)
    setSelectedCountry(null)
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div>
        <h3 className="text-2xl font-bold mb-4">International Relations</h3>
        <p className="text-gray-400 mb-4">
          Manage relationships with other nations through diplomacy, trade, and negotiations.
        </p>
      </div>

      {/* Country List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {countries.map(country => {
          const relationship = state.relationships[country] || 0
          const status = getRelationshipStatus(relationship)

          return (
            <div
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`
                p-4 bg-gray-900 rounded border-2 cursor-pointer transition
                ${
                  selectedCountry === country
                    ? 'border-accent'
                    : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg">{country}</h4>
                <span className={`text-sm font-semibold ${status.color}`}>
                  {status.text}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    relationship >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.abs(relationship)}%`,
                    marginLeft: relationship < 0 ? `${100 - Math.abs(relationship)}%` : '0'
                  }}
                />
              </div>
              <div className="text-sm text-gray-400">
                Relationship: {relationship}/100
              </div>
            </div>
          )
        })}
      </div>

      {/* Diplomatic Actions */}
      {selectedCountry && (
        <div className="p-5 bg-gray-900 rounded border-2 border-accent">
          <h4 className="text-lg font-semibold mb-4">
            Diplomatic Actions with {selectedCountry}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleDiplomaticAction('gift')}
              className="p-4 bg-green-700 hover:bg-green-600 rounded transition text-center"
            >
              <div className="text-2xl mb-1">🎁</div>
              <div className="font-semibold">Send Gift</div>
              <div className="text-xs text-gray-300">$2000, +10 relations</div>
            </button>

            <button
              onClick={() => handleDiplomaticAction('trade')}
              className="p-4 bg-blue-700 hover:bg-blue-600 rounded transition text-center"
            >
              <div className="text-2xl mb-1">🤝</div>
              <div className="font-semibold">Trade Deal</div>
              <div className="text-xs text-gray-300">$1000, +5 relations, +100 income</div>
            </button>

            <button
              onClick={() => handleDiplomaticAction('alliance')}
              className="p-4 bg-purple-700 hover:bg-purple-600 rounded transition text-center"
            >
              <div className="text-2xl mb-1">🛡️</div>
              <div className="font-semibold">Propose Alliance</div>
              <div className="text-xs text-gray-300">$1000, +20 relations</div>
            </button>

            <button
              onClick={() => handleDiplomaticAction('threaten')}
              className="p-4 bg-orange-700 hover:bg-orange-600 rounded transition text-center"
            >
              <div className="text-2xl mb-1">⚠️</div>
              <div className="font-semibold">Issue Threat</div>
              <div className="text-xs text-gray-300">Free, -15 relations</div>
            </button>

            <button
              onClick={() => handleDiplomaticAction('embargo')}
              className="p-4 bg-red-700 hover:bg-red-600 rounded transition text-center"
            >
              <div className="text-2xl mb-1">🚫</div>
              <div className="font-semibold">Embargo</div>
              <div className="text-xs text-gray-300">-25 relations, -50 income</div>
            </button>

            <button
              onClick={() => setSelectedCountry(null)}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded transition text-center"
            >
              <div className="text-2xl mb-1">❌</div>
              <div className="font-semibold">Cancel</div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DiplomacyTab