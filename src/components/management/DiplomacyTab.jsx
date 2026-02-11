import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { getRelationshipStatus } from '../../utils/formatters'

function DiplomacyTab() {
  const { state, dispatch } = useGame()
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview, intelligence, actions
  const [showConfirmWar, setShowConfirmWar] = useState(false)

  const countries = Object.keys(state.relationships)
  const selectedData = selectedCountry ? state.aiCountries[selectedCountry] : null
  const relationship = selectedCountry ? (state.relationships[selectedCountry] || 0) : 0
  const isAllied = state.alliances?.includes(selectedCountry)
  const isAtWar = state.wars?.includes(selectedCountry)

  const getCountryStrength = (countryData) => {
    if (!countryData) return 'Unknown'
    const strength = countryData.strength || 0
    if (strength > 80) return { text: 'Superpower', color: 'text-red-400' }
    if (strength > 60) return { text: 'Major Power', color: 'text-orange-400' }
    if (strength > 40) return { text: 'Regional Power', color: 'text-yellow-400' }
    if (strength > 20) return { text: 'Minor Power', color: 'text-green-400' }
    return { text: 'Weak State', color: 'text-gray-400' }
  }

  const getPersonalityDescription = (personality) => {
    switch(personality) {
      case 'aggressive': return { text: 'Militaristic & Expansionist', color: 'text-red-400', icon: '⚔️' }
      case 'defensive': return { text: 'Cautious & Defensive', color: 'text-blue-400', icon: '🛡️' }
      case 'opportunistic': return { text: 'Strategic & Calculating', color: 'text-purple-400', icon: '🎯' }
      default: return { text: 'Neutral', color: 'text-gray-400', icon: '🤝' }
    }
  }

  const handleDiplomaticAction = (action, cost = 0) => {
    if (!selectedCountry) return

    if (cost > 0 && state.resources.treasury < cost) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'WARNING',
          title: 'Insufficient Funds',
          message: `Need $${cost}M for this action`,
          timestamp: state.currentDate
        }
      })
      return
    }

    const actions = {
      gift: () => {
        dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: 15 }})
        dispatch({ type: 'UPDATE_RESOURCES', payload: { treasury: state.resources.treasury - cost }})
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'DIPLOMACY',
            title: `Gift to ${selectedCountry}`,
            message: `Sent $${cost}M as goodwill gesture (+15 relations)`,
            timestamp: state.currentDate
          }
        })
      },
      
      trade: () => {
        dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: 10 }})
        dispatch({ 
          type: 'UPDATE_RESOURCES', 
          payload: { 
            treasury: state.resources.treasury - cost,
            income: state.resources.income + 150
          }
        })
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'SUCCESS',
            title: 'Trade Agreement',
            message: `Trade deal with ${selectedCountry}: +$150M income (+10 relations)`,
            timestamp: state.currentDate
          }
        })
      },

      proposeAlliance: () => {
        if (relationship < 30) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now(),
              type: 'WARNING',
              title: 'Alliance Rejected',
              message: `${selectedCountry} rejected your alliance (relations too low)`,
              timestamp: state.currentDate
            }
          })
          dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: -10 }})
          return
        }

        dispatch({ type: 'ACCEPT_ALLIANCE', payload: { country: selectedCountry }})
        dispatch({ type: 'UPDATE_RESOURCES', payload: { treasury: state.resources.treasury - cost }})
      },

      breakAlliance: () => {
        const newAlliances = state.alliances.filter(c => c !== selectedCountry)
        dispatch({ 
          type: 'LOAD_GAME', 
          payload: { 
            ...state, 
            alliances: newAlliances 
          }
        })
        dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: -40 }})
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'WAR',
            title: 'Alliance Broken',
            message: `You broke your alliance with ${selectedCountry} (-40 relations)`,
            timestamp: state.currentDate
          }
        })
      },

      threaten: () => {
        const moraleBoost = state.morale.current < 70 ? 5 : 0
        dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: -20 }})
        if (moraleBoost > 0) {
          dispatch({ type: 'UPDATE_MORALE', payload: moraleBoost })
        }
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'WARNING',
            title: `Ultimatum to ${selectedCountry}`,
            message: `Military threats issued (-20 relations${moraleBoost ? ', +5 morale' : ''})`,
            timestamp: state.currentDate
          }
        })
      },

      embargo: () => {
        dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: -30 }})
        dispatch({ 
          type: 'UPDATE_RESOURCES', 
          payload: { income: state.resources.income - 100 }
        })
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'WARNING',
            title: `Embargo on ${selectedCountry}`,
            message: 'Trade embargo imposed (-30 relations, -$100M income)',
            timestamp: state.currentDate
          }
        })
      },

      spy: () => {
        dispatch({ type: 'UPDATE_RESOURCES', payload: { treasury: state.resources.treasury - cost }})
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'INFO',
            title: 'Intelligence Report',
            message: `Spy operation in ${selectedCountry} - detailed intel gathered`,
            timestamp: state.currentDate
          }
        })
      },

      nonAggression: () => {
        dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: 20 }})
        dispatch({ type: 'UPDATE_RESOURCES', payload: { treasury: state.resources.treasury - cost }})
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'DIPLOMACY',
            title: 'Non-Aggression Pact',
            message: `Signed with ${selectedCountry} (+20 relations)`,
            timestamp: state.currentDate
          }
        })
      }
    }

    if (actions[action]) {
      actions[action]()
    }
  }

  const handleDeclareWar = () => {
    if (!selectedCountry) return

    if (isAllied) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          type: 'WARNING',
          title: 'Cannot Declare War',
          message: `${selectedCountry} is your ally! Break alliance first.`,
          timestamp: state.currentDate
        }
      })
      return
    }

    dispatch({ type: 'DECLARE_WAR', payload: { country: selectedCountry }})
    setShowConfirmWar(false)
    setSelectedCountry(null)
  }

  const canDeclareWar = selectedCountry && !isAtWar && !isAllied
  const canProposeAlliance = selectedCountry && !isAllied && !isAtWar && relationship >= 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Diplomacy & International Relations</h3>
        <p className="text-gray-400">
          {state.alliances?.length > 0 && `🛡️ ${state.alliances.length} Active Alliance${state.alliances.length > 1 ? 's' : ''} • `}
          {state.wars?.length > 0 && `⚔️ ${state.wars.length} Active War${state.wars.length > 1 ? 's' : ''} • `}
          🌍 {countries.length} Nations
        </p>
      </div>

      {/* Country Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {countries.map(country => {
          const rel = state.relationships[country] || 0
          const status = getRelationshipStatus(rel)
          const allied = state.alliances?.includes(country)
          const atWar = state.wars?.includes(country)
          const countryData = state.aiCountries[country]

          return (
            <div
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`
                p-4 bg-gray-900 rounded-xl border-2 cursor-pointer transition hover:scale-105
                ${
                  selectedCountry === country
                    ? 'border-accent shadow-lg'
                    : allied ? 'border-green-600'
                    : atWar ? 'border-red-600'
                    : 'border-gray-700 hover:border-gray-600'
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg">{country}</h4>
                {allied && <span className="text-green-400 text-xl">🛡️</span>}
                {atWar && <span className="text-red-400 text-xl">⚔️</span>}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Relations:</span>
                  <span className={`font-semibold ${status.color}`}>
                    {rel > 0 ? '+' : ''}{rel}
                  </span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      rel >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.abs(rel))}%` }}
                  />
                </div>

                {countryData && (
                  <div className="text-xs text-gray-500">
                    {getPersonalityDescription(countryData.personality).icon} {getPersonalityDescription(countryData.personality).text}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Country Details */}
      {selectedCountry && (
        <div className="p-6 bg-gray-900 rounded-xl border-2 border-accent">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-700">
            {['overview', 'intelligence', 'actions'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-bold">{selectedCountry}</h4>
                <div className="flex gap-2">
                  {isAllied && <span className="px-3 py-1 bg-green-700 rounded-full text-sm font-semibold">🛡️ Allied</span>}
                  {isAtWar && <span className="px-3 py-1 bg-red-700 rounded-full text-sm font-semibold">⚔️ At War</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">Relationship Status</div>
                  <div className={`text-xl font-bold ${getRelationshipStatus(relationship).color}`}>
                    {getRelationshipStatus(relationship).text}
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {relationship > 0 ? '+' : ''}{relationship}
                  </div>
                </div>

                {selectedData && (
                  <>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Military Strength</div>
                      <div className={`text-xl font-bold ${getCountryStrength(selectedData).color}`}>
                        {getCountryStrength(selectedData).text}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{selectedData.strength}/100</div>
                    </div>

                    <div className="p-4 bg-gray-800 rounded-lg col-span-2">
                      <div className="text-gray-400 text-sm mb-1">Leadership Style</div>
                      <div className={`text-lg font-bold ${getPersonalityDescription(selectedData.personality).color}`}>
                        {getPersonalityDescription(selectedData.personality).icon} {getPersonalityDescription(selectedData.personality).text}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Intelligence Tab */}
          {activeTab === 'intelligence' && selectedData && (
            <div className="space-y-4">
              <h4 className="text-xl font-bold mb-4">🕵️ Intelligence Report: {selectedCountry}</h4>
              
              <div className="space-y-3">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Military Capability</span>
                    <span className={getCountryStrength(selectedData).color}>
                      {getCountryStrength(selectedData).text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-red-500 h-3 rounded-full" style={{ width: `${selectedData.strength}%` }} />
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Strength Rating: {selectedData.strength}/100
                  </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="font-semibold mb-2">Strategic Assessment</div>
                  <div className="text-sm text-gray-300 space-y-1">
                    {selectedData.personality === 'aggressive' && (
                      <p>• ⚠️ High likelihood of aggressive expansion</p>
                    )}
                    {selectedData.personality === 'defensive' && (
                      <p>• 🛡️ Focuses on territorial defense and stability</p>
                    )}
                    {selectedData.personality === 'opportunistic' && (
                      <p>• 🎯 Waits for strategic opportunities to act</p>
                    )}
                    {relationship < -50 && <p>• ⚔️ High risk of military conflict</p>}
                    {relationship > 50 && <p>• 🤝 Strong potential for cooperation</p>}
                    {isAllied && <p>• ✅ Will support you in conflicts</p>}
                    {selectedData.strength > 70 && <p>• 💪 Major regional/global threat</p>}
                    {selectedData.strength < 30 && <p>• 📉 Vulnerable to external pressure</p>}
                  </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="font-semibold mb-2">Recent Activity</div>
                  <div className="text-sm text-gray-400">
                    Intelligence agencies monitoring {selectedCountry} movements...
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <h4 className="text-xl font-bold mb-4">Diplomatic Actions</h4>
              
              {/* Peaceful Actions */}
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-3 uppercase">Peaceful Diplomacy</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDiplomaticAction('gift', 2500)}
                    className="p-4 bg-green-700 hover:bg-green-600 rounded-lg transition"
                  >
                    <div className="text-3xl mb-2">🎁</div>
                    <div className="font-bold">Economic Aid</div>
                    <div className="text-xs text-gray-200 mt-1">$2,500M</div>
                    <div className="text-xs text-green-300">+15 Relations</div>
                  </button>

                  <button
                    onClick={() => handleDiplomaticAction('trade', 1500)}
                    className="p-4 bg-blue-700 hover:bg-blue-600 rounded-lg transition"
                  >
                    <div className="text-3xl mb-2">🤝</div>
                    <div className="font-bold">Trade Agreement</div>
                    <div className="text-xs text-gray-200 mt-1">$1,500M</div>
                    <div className="text-xs text-blue-300">+10 Relations, +$150M Income</div>
                  </button>

                  {canProposeAlliance && (
                    <button
                      onClick={() => handleDiplomaticAction('proposeAlliance', 3000)}
                      disabled={relationship < 30}
                      className={`p-4 rounded-lg transition ${
                        relationship >= 30
                          ? 'bg-purple-700 hover:bg-purple-600'
                          : 'bg-gray-700 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-3xl mb-2">🛡️</div>
                      <div className="font-bold">Form Alliance</div>
                      <div className="text-xs text-gray-200 mt-1">$3,000M</div>
                      <div className="text-xs text-purple-300">
                        {relationship >= 30 ? 'Relations +30' : 'Need 30+ Relations'}
                      </div>
                    </button>
                  )}

                  {isAllied && (
                    <button
                      onClick={() => handleDiplomaticAction('breakAlliance')}
                      className="p-4 bg-orange-700 hover:bg-orange-600 rounded-lg transition"
                    >
                      <div className="text-3xl mb-2">💔</div>
                      <div className="font-bold">Break Alliance</div>
                      <div className="text-xs text-orange-300">-40 Relations</div>
                    </button>
                  )}

                  <button
                    onClick={() => handleDiplomaticAction('nonAggression', 2000)}
                    className="p-4 bg-teal-700 hover:bg-teal-600 rounded-lg transition"
                  >
                    <div className="text-3xl mb-2">🕊️</div>
                    <div className="font-bold">Non-Aggression Pact</div>
                    <div className="text-xs text-gray-200 mt-1">$2,000M</div>
                    <div className="text-xs text-teal-300">+20 Relations</div>
                  </button>

                  <button
                    onClick={() => handleDiplomaticAction('spy', 1000)}
                    className="p-4 bg-indigo-700 hover:bg-indigo-600 rounded-lg transition"
                  >
                    <div className="text-3xl mb-2">🕵️</div>
                    <div className="font-bold">Spy Operation</div>
                    <div className="text-xs text-gray-200 mt-1">$1,000M</div>
                    <div className="text-xs text-indigo-300">Gather Intel</div>
                  </button>
                </div>
              </div>

              {/* Hostile Actions */}
              {!isAllied && (
                <div>
                  <div className="text-sm font-semibold text-gray-400 mb-3 uppercase">Hostile Actions</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleDiplomaticAction('threaten')}
                      className="p-4 bg-orange-700 hover:bg-orange-600 rounded-lg transition"
                    >
                      <div className="text-3xl mb-2">⚠️</div>
                      <div className="font-bold">Issue Ultimatum</div>
                      <div className="text-xs text-orange-300">-20 Relations, +5 Morale</div>
                    </button>

                    <button
                      onClick={() => handleDiplomaticAction('embargo')}
                      className="p-4 bg-red-700 hover:bg-red-600 rounded-lg transition"
                    >
                      <div className="text-3xl mb-2">🚫</div>
                      <div className="font-bold">Trade Embargo</div>
                      <div className="text-xs text-red-300">-30 Relations, -$100M Income</div>
                    </button>

                    {canDeclareWar && !showConfirmWar && (
                      <button
                        onClick={() => setShowConfirmWar(true)}
                        className="p-4 bg-red-900 hover:bg-red-800 rounded-lg transition border-2 border-red-600"
                      >
                        <div className="text-3xl mb-2">⚔️</div>
                        <div className="font-bold">Declare War</div>
                        <div className="text-xs text-red-300">Military Conflict</div>
                      </button>
                    )}

                    {showConfirmWar && (
                      <div className="col-span-2 md:col-span-3 p-4 bg-red-900/50 border-2 border-red-600 rounded-lg">
                        <div className="text-center mb-4">
                          <div className="text-2xl mb-2">⚠️ Confirm War Declaration</div>
                          <p className="text-sm text-gray-300">
                            Declaring war on {selectedCountry} will have serious consequences.
                            Your morale will drop and military readiness will be critical.
                          </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={handleDeclareWar}
                            className="px-6 py-3 bg-red-700 hover:bg-red-600 rounded-lg font-bold"
                          >
                            ⚔️ Confirm War
                          </button>
                          <button
                            onClick={() => setShowConfirmWar(false)}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedCountry(null)}
                className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-semibold"
              >
                ← Back to Country List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DiplomacyTab