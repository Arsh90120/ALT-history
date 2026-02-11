import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useGame } from '../context/GameContext'
import { getRelationshipStatus } from '../utils/formatters'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapController({ center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])
  
  return null
}

function WorldMap() {
  const { state, dispatch } = useGame()
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [mapCenter, setMapCenter] = useState([20, 0])
  const [mapZoom, setMapZoom] = useState(2)
  const mapRef = useRef(null)

  const countries = Object.keys(state.relationships)

  // Real geographic coordinates for countries
  const countryCoordinates = {
    // Europe
    'United Kingdom': { lat: 51.5074, lng: -0.1278, capital: 'London' },
    'France': { lat: 48.8566, lng: 2.3522, capital: 'Paris' },
    'Germany': { lat: 52.5200, lng: 13.4050, capital: 'Berlin' },
    'Italy': { lat: 41.9028, lng: 12.4964, capital: 'Rome' },
    'Soviet Union': { lat: 55.7558, lng: 37.6173, capital: 'Moscow' },
    'Spain': { lat: 40.4168, lng: -3.7038, capital: 'Madrid' },
    'Poland': { lat: 52.2297, lng: 21.0122, capital: 'Warsaw' },
    
    // Asia
    'Japan': { lat: 35.6762, lng: 139.6503, capital: 'Tokyo' },
    'China': { lat: 39.9042, lng: 116.4074, capital: 'Beijing' },
    'India': { lat: 28.6139, lng: 77.2090, capital: 'New Delhi' },
    
    // Americas
    'United States': { lat: 38.9072, lng: -77.0369, capital: 'Washington D.C.' },
    'Canada': { lat: 45.4215, lng: -75.6972, capital: 'Ottawa' },
    'Brazil': { lat: -15.8267, lng: -47.9218, capital: 'Brasília' },
    'Mexico': { lat: 19.4326, lng: -99.1332, capital: 'Mexico City' },
    
    // Middle East
    'Turkey': { lat: 39.9334, lng: 32.8597, capital: 'Ankara' },
    'Iran': { lat: 35.6892, lng: 51.3890, capital: 'Tehran' },
    
    // Africa
    'Egypt': { lat: 30.0444, lng: 31.2357, capital: 'Cairo' },
    'South Africa': { lat: -25.7479, lng: 28.2293, capital: 'Pretoria' },
    
    // Oceania
    'Australia': { lat: -35.2809, lng: 149.1300, capital: 'Canberra' }
  }

  const getCountryColor = (country) => {
    const isPlayer = country === state.playerCountry
    const isAllied = state.alliances?.includes(country)
    const isAtWar = state.wars?.includes(country)
    const relationship = state.relationships[country] || 0

    if (isPlayer) return '#3b82f6' // blue
    if (isAtWar) return '#dc2626' // red
    if (isAllied) return '#16a34a' // green
    if (relationship >= 50) return '#10b981' // emerald
    if (relationship >= 0) return '#eab308' // yellow
    if (relationship >= -50) return '#f97316' // orange
    return '#ef4444' // red
  }

  const getMarkerIcon = (country) => {
    const isPlayer = country === state.playerCountry
    const isAllied = state.alliances?.includes(country)
    const isAtWar = state.wars?.includes(country)
    const color = getCountryColor(country)

    let emoji = '🌐'
    if (isPlayer) emoji = '👑'
    else if (isAtWar) emoji = '⚔️'
    else if (isAllied) emoji = '🛡️'

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        ">
          ${emoji}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    })
  }

  const getCircleRadius = (country) => {
    const countryData = state.aiCountries[country]
    if (!countryData) return 300000
    
    const strength = countryData.strength || 50
    if (strength > 70) return 600000
    if (strength > 40) return 400000
    return 250000
  }

  const handleQuickAction = (action, country) => {
    const isAllied = state.alliances?.includes(country)
    const isAtWar = state.wars?.includes(country)

    switch(action) {
      case 'war':
        if (isAllied) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now(),
              type: 'WARNING',
              title: 'Cannot Declare War',
              message: `${country} is your ally!`,
              timestamp: state.currentDate
            }
          })
          return
        }
        if (!isAtWar) {
          dispatch({ type: 'DECLARE_WAR', payload: { country }})
        }
        break

      case 'gift':
        if (state.resources.treasury >= 2000) {
          dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country, change: 15 }})
          dispatch({ type: 'UPDATE_RESOURCES', payload: { treasury: state.resources.treasury - 2000 }})
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now(),
              type: 'DIPLOMACY',
              title: 'Economic Aid Sent',
              message: `Sent $2,000M to ${country} (+15 relations)`,
              timestamp: state.currentDate
            }
          })
        }
        break

      case 'threaten':
        dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country, change: -20 }})
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'WARNING',
            title: 'Ultimatum Issued',
            message: `Threatened ${country} (-20 relations)`,
            timestamp: state.currentDate
          }
        })
        break

      case 'focus':
        const coords = countryCoordinates[country]
        if (coords) {
          setMapCenter([coords.lat, coords.lng])
          setMapZoom(6)
        }
        break
    }
  }

  const getMapLegend = () => {
    return [
      { color: '#3b82f6', label: 'Your Nation', icon: '👑' },
      { color: '#16a34a', label: 'Allied', icon: '🛡️' },
      { color: '#dc2626', label: 'At War', icon: '⚔️' },
      { color: '#10b981', label: 'Friendly', icon: '😊' },
      { color: '#eab308', label: 'Neutral', icon: '😐' },
      { color: '#f97316', label: 'Unfriendly', icon: '😠' },
      { color: '#ef4444', label: 'Hostile', icon: '💀' }
    ]
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats Bar */}
      <div className="flex items-center justify-between bg-gray-900 rounded-xl p-4 border border-gray-700">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <span className="text-sm text-gray-400">Your Nation</span>
          </div>
          {state.alliances?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-sm text-gray-400">{state.alliances.length} Allies</span>
            </div>
          )}
          {state.wars?.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-pulse">⚔️</span>
              <span className="text-sm text-red-400 font-semibold">{state.wars.length} Active Wars</span>
            </div>
          )}
        </div>
        <button
          onClick={() => { setMapCenter([20, 0]); setMapZoom(2); }}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition"
        >
          🌍 Reset View
        </button>
      </div>

      {/* Interactive Map */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-700 shadow-2xl" style={{ height: '600px' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          ref={mapRef}
        >
          {/* Base Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Country Markers and Circles */}
          {countries.map(country => {
            const coords = countryCoordinates[country]
            if (!coords) return null

            const isPlayer = country === state.playerCountry
            const relationship = state.relationships[country] || 0
            const countryData = state.aiCountries[country]
            const isAllied = state.alliances?.includes(country)
            const isAtWar = state.wars?.includes(country)

            return (
              <div key={country}>
                {/* Influence Circle */}
                <Circle
                  center={[coords.lat, coords.lng]}
                  radius={getCircleRadius(country)}
                  pathOptions={{
                    color: getCountryColor(country),
                    fillColor: getCountryColor(country),
                    fillOpacity: isAtWar ? 0.3 : 0.15,
                    weight: isAtWar ? 3 : 2,
                    opacity: 0.6
                  }}
                />

                {/* Country Marker */}
                <Marker
                  position={[coords.lat, coords.lng]}
                  icon={getMarkerIcon(country)}
                  eventHandlers={{
                    click: () => setSelectedCountry(country)
                  }}
                >
                  <Popup className="custom-popup" minWidth={280}>
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{country}</h3>
                        <div className="flex gap-1">
                          {isPlayer && <span className="text-xl">👑</span>}
                          {isAllied && <span className="text-xl">🛡️</span>}
                          {isAtWar && <span className="text-xl">⚔️</span>}
                        </div>
                      </div>

                      {!isPlayer && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Capital:</span>
                            <span className="font-semibold text-gray-900">{coords.capital}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Relations:</span>
                            <span className={`font-bold ${
                              relationship >= 50 ? 'text-green-600' :
                              relationship >= 0 ? 'text-yellow-600' :
                              relationship >= -50 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {relationship > 0 ? '+' : ''}{relationship}
                            </span>
                          </div>
                          
                          {countryData && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Strength:</span>
                                <span className="font-semibold text-gray-900">{countryData.strength}/100</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-semibold text-gray-900 capitalize">{countryData.personality}</span>
                              </div>
                            </>
                          )}

                          {/* Quick Actions */}
                          <div className="pt-3 border-t border-gray-200 space-y-2">
                            <div className="text-xs text-gray-500 uppercase font-semibold">Quick Actions</div>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleQuickAction('gift', country)}
                                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition"
                              >
                                🎁 Send Aid
                              </button>
                              <button
                                onClick={() => handleQuickAction('threaten', country)}
                                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition"
                              >
                                ⚠️ Threaten
                              </button>
                              {!isAllied && !isAtWar && (
                                <button
                                  onClick={() => handleQuickAction('war', country)}
                                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition col-span-2"
                                >
                                  ⚔️ Declare War
                                </button>
                              )}
                              <button
                                onClick={() => handleQuickAction('focus', country)}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition col-span-2"
                              >
                                🎯 Focus View
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {isPlayer && (
                        <div className="text-center py-2">
                          <p className="text-sm font-semibold text-blue-600">Your Nation</p>
                          <p className="text-xs text-gray-600 mt-1">Capital: {coords.capital}</p>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              </div>
            )
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <h4 className="font-bold mb-3 text-sm uppercase text-gray-400">Map Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {getMapLegend().map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border-2 border-white shadow-md" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-300">{item.icon} {item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-sm">
            <p className="font-semibold mb-1">Interactive Map Controls</p>
            <p className="text-gray-400">
              <strong>Zoom:</strong> Scroll wheel or pinch • 
              <strong>Pan:</strong> Click and drag • 
              <strong>Interact:</strong> Click markers for details and quick actions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorldMap