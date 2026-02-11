import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { getRelationshipStatus } from '../utils/formatters'

function WorldMap() {
  const { state, dispatch } = useGame()
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [mapView, setMapView] = useState('political') // political, military, diplomatic

  const countries = Object.keys(state.relationships)

  // Map layout - positioning countries on the visual map
  const getCountryPosition = (country) => {
    const positions = {
      // Europe
      'United Kingdom': { x: 48, y: 25, region: 'Europe' },
      'France': { x: 50, y: 28, region: 'Europe' },
      'Germany': { x: 52, y: 26, region: 'Europe' },
      'Italy': { x: 53, y: 32, region: 'Europe' },
      'Soviet Union': { x: 60, y: 22, region: 'Europe' },
      'Spain': { x: 47, y: 32, region: 'Europe' },
      'Poland': { x: 55, y: 26, region: 'Europe' },
      
      // Asia
      'Japan': { x: 85, y: 30, region: 'Asia' },
      'China': { x: 75, y: 30, region: 'Asia' },
      'India': { x: 70, y: 38, region: 'Asia' },
      
      // Americas
      'United States': { x: 20, y: 30, region: 'Americas' },
      'Canada': { x: 20, y: 20, region: 'Americas' },
      'Brazil': { x: 32, y: 55, region: 'Americas' },
      'Mexico': { x: 18, y: 38, region: 'Americas' },
      
      // Middle East
      'Turkey': { x: 58, y: 32, region: 'Middle East' },
      'Iran': { x: 65, y: 35, region: 'Middle East' },
      
      // Africa
      'Egypt': { x: 56, y: 40, region: 'Africa' },
      'South Africa': { x: 55, y: 60, region: 'Africa' },
      
      // Oceania
      'Australia': { x: 82, y: 60, region: 'Oceania' }
    }

    return positions[country] || { x: 50, y: 50, region: 'Unknown' }
  }

  const getCountryColor = (country) => {
    const isPlayer = country === state.playerCountry
    const isAllied = state.alliances?.includes(country)
    const isAtWar = state.wars?.includes(country)
    const relationship = state.relationships[country] || 0

    if (isPlayer) return 'bg-blue-600 border-blue-400 shadow-blue-500/50'
    if (isAtWar) return 'bg-red-700 border-red-500 shadow-red-500/50 animate-pulse-slow'
    if (isAllied) return 'bg-green-600 border-green-400 shadow-green-500/50'
    if (relationship >= 50) return 'bg-emerald-600 border-emerald-400'
    if (relationship >= 0) return 'bg-yellow-600 border-yellow-500'
    if (relationship >= -50) return 'bg-orange-600 border-orange-500'
    return 'bg-red-600 border-red-400'
  }

  const getCountrySize = (country) => {
    const countryData = state.aiCountries[country]
    if (!countryData) return 'w-12 h-12'
    
    const strength = countryData.strength || 50
    if (strength > 70) return 'w-16 h-16'
    if (strength > 40) return 'w-12 h-12'
    return 'w-10 h-10'
  }

  const handleCountryClick = (country) => {
    if (country === state.playerCountry) return
    setSelectedCountry(selectedCountry === country ? null : country)
  }

  const handleQuickAction = (action) => {
    if (!selectedCountry) return

    const isAllied = state.alliances?.includes(selectedCountry)
    const isAtWar = state.wars?.includes(selectedCountry)

    switch(action) {
      case 'war':
        if (isAllied) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now(),
              type: 'WARNING',
              title: 'Cannot Declare War',
              message: `${selectedCountry} is your ally!`,
              timestamp: state.currentDate
            }
          })
          return
        }
        if (!isAtWar) {
          dispatch({ type: 'DECLARE_WAR', payload: { country: selectedCountry }})
        }
        break

      case 'gift':
        if (state.resources.treasury >= 2000) {
          dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: 15 }})
          dispatch({ type: 'UPDATE_RESOURCES', payload: { treasury: state.resources.treasury - 2000 }})
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now(),
              type: 'DIPLOMACY',
              title: 'Economic Aid Sent',
              message: `Sent $2,000M to ${selectedCountry} (+15 relations)`,
              timestamp: state.currentDate
            }
          })
        }
        break

      case 'threaten':
        dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country: selectedCountry, change: -20 }})
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'WARNING',
            title: 'Ultimatum Issued',
            message: `Threatened ${selectedCountry} (-20 relations)`,
            timestamp: state.currentDate
          }
        })
        break
    }
    setSelectedCountry(null)
  }

  const getMapLegend = () => {
    return [
      { color: 'bg-blue-600', label: 'Your Nation', icon: '👑' },
      { color: 'bg-green-600', label: 'Allied', icon: '🛡️' },
      { color: 'bg-red-700 animate-pulse-slow', label: 'At War', icon: '⚔️' },
      { color: 'bg-emerald-600', label: 'Friendly', icon: '😊' },
      { color: 'bg-yellow-600', label: 'Neutral', icon: '😐' },
      { color: 'bg-orange-600', label: 'Unfriendly', icon: '😠' },
      { color: 'bg-red-600', label: 'Hostile', icon: '💀' }
    ]
  }

  const getRegionCounts = () => {
    const regions = {}
    countries.forEach(country => {
      const { region } = getCountryPosition(country)
      regions[region] = (regions[region] || 0) + 1
    })
    return regions
  }

  const getConflictZones = () => {
    return state.wars?.map(country => getCountryPosition(country)) || []
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setMapView('political')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              mapView === 'political'
                ? 'bg-accent text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🌍 Political
          </button>
          <button
            onClick={() => setMapView('military')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              mapView === 'military'
                ? 'bg-accent text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ⚔️ Military
          </button>
          <button
            onClick={() => setMapView('diplomatic')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              mapView === 'diplomatic'
                ? 'bg-accent text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🤝 Diplomatic
          </button>
        </div>

        <div className="text-sm text-gray-400">
          {state.wars?.length > 0 && (
            <span className="text-red-400 font-semibold animate-pulse">
              ⚔️ {state.wars.length} Active Conflict{state.wars.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Main Map */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border-2 border-gray-700 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        {/* War zones indicator */}
        {getConflictZones().map((zone, idx) => (
          <div
            key={idx}
            className="absolute w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse-slow"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}

        {/* Countries */}
        <div className="relative w-full" style={{ paddingBottom: '60%' }}>
          {countries.map(country => {
            const pos = getCountryPosition(country)
            const isPlayer = country === state.playerCountry
            const countryData = state.aiCountries[country]
            const relationship = state.relationships[country] || 0
            const isHovered = hoveredCountry === country
            const isSelected = selectedCountry === country

            return (
              <div
                key={country}
                className={`absolute cursor-pointer transition-all duration-300 ${
                  isHovered || isSelected ? 'scale-125 z-30' : 'z-10'
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleCountryClick(country)}
                onMouseEnter={() => setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                {/* Country marker */}
                <div
                  className={`
                    ${getCountrySize(country)}
                    ${getCountryColor(country)}
                    rounded-full border-4 flex items-center justify-center
                    shadow-xl transition-all
                    ${isPlayer ? 'ring-4 ring-blue-400/50' : ''}
                  `}
                >
                  <span className="text-2xl">
                    {isPlayer ? '👑' : state.alliances?.includes(country) ? '🛡️' : state.wars?.includes(country) ? '⚔️' : '🌐'}
                  </span>
                </div>

                {/* Tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-64 bg-gray-900 border-2 border-accent rounded-xl p-4 shadow-2xl z-50 animate-fade-in">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg">{country}</h4>
                        {state.alliances?.includes(country) && <span className="text-green-400">🛡️</span>}
                        {state.wars?.includes(country) && <span className="text-red-400">⚔️</span>}
                      </div>

                      {!isPlayer && (
                        <>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Relations:</span>
                              <span className={getRelationshipStatus(relationship).color}>
                                {relationship > 0 ? '+' : ''}{relationship}
                              </span>
                            </div>
                            
                            {countryData && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Strength:</span>
                                  <span className="text-white">{countryData.strength}/100</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Type:</span>
                                  <span className="text-white capitalize">{countryData.personality}</span>
                                </div>
                              </>
                            )}
                          </div>

                          {isSelected && (
                            <div className="pt-2 border-t border-gray-700 space-y-2">
                              <div className="text-xs text-gray-400 uppercase font-semibold">Quick Actions</div>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleQuickAction('gift'); }}
                                  className="px-2 py-1 bg-green-700 hover:bg-green-600 rounded text-xs font-semibold"
                                >
                                  🎁 Aid
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleQuickAction('threaten'); }}
                                  className="px-2 py-1 bg-orange-700 hover:bg-orange-600 rounded text-xs font-semibold"
                                >
                                  ⚠️ Threat
                                </button>
                                {!state.alliances?.includes(country) && !state.wars?.includes(country) && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleQuickAction('war'); }}
                                    className="px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs font-semibold col-span-2"
                                  >
                                    ⚔️ Declare War
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {isPlayer && (
                        <div className="text-sm text-blue-400 font-semibold">
                          Your Nation
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Map Legend & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Legend */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h4 className="font-bold mb-3 text-sm uppercase text-gray-400">Map Legend</h4>
          <div className="grid grid-cols-2 gap-2">
            {getMapLegend().map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${item.color} border-2 border-gray-600`} />
                <span className="text-xs text-gray-300">{item.icon} {item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Overview */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h4 className="font-bold mb-3 text-sm uppercase text-gray-400">Regional Overview</h4>
          <div className="space-y-2">
            {Object.entries(getRegionCounts()).map(([region, count]) => (
              <div key={region} className="flex justify-between text-sm">
                <span className="text-gray-300">{region}</span>
                <span className="font-semibold text-white">{count} nation{count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm">
            <p className="font-semibold mb-1">Interactive World Map</p>
            <p className="text-gray-400">
              Click any nation to view details and perform quick diplomatic actions. 
              Hover to see relationship status. Color intensity indicates diplomatic stance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorldMap