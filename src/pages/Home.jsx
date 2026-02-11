import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { eras } from '../data/eras'
import HistoricalQuote from '../components/HistoricalQuote'
import HistoricalFact from '../components/HistoricalFact'
import { loadGame, getSaveInfo } from '../utils/saveGame'
import { useGame } from '../context/GameContext'

function Home() {
  const navigate = useNavigate()
  const { dispatch, state } = useGame()
  const [selectedEra, setSelectedEra] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [saveInfo, setSaveInfo] = useState(null)

  useEffect(() => {
    // Reset game state when returning to home
    if (state.gameStarted) {
      dispatch({ type: 'LOAD_GAME', payload: { gameStarted: false } })
    }
    
    const info = getSaveInfo()
    setSaveInfo(info)
  }, [])

  const handleStartGame = () => {
    if (selectedEra && selectedCountry) {
      navigate('/game', { 
        state: { 
          era: selectedEra, 
          country: selectedCountry,
          loadedGame: false 
        } 
      })
    }
  }

  const handleContinue = () => {
    const result = loadGame()
    if (result.success) {
      dispatch({ type: 'LOAD_GAME', payload: result.data })
      navigate('/game', { 
        state: { 
          era: result.data.era, 
          country: result.data.playerCountry,
          loadedGame: true 
        } 
      })
    }
  }

  const currentEra = eras.find(e => e.id === selectedEra)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-6xl w-full space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-block">
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter">
              <span className="bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent">
                ALT/HISTORY
              </span>
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent mt-2"></div>
          </div>
          <p className="text-xl sm:text-2xl text-gray-400 font-light max-w-2xl mx-auto">
            Rewrite the past. Shape the future. Lead nations through pivotal moments in history.
          </p>
          <HistoricalQuote />

          {/* Continue Button */}
          {saveInfo && (
            <div className="animate-fade-in">
              <button
                onClick={handleContinue}
                className="
                  btn-premium px-10 py-4 bg-accent hover:bg-yellow-400 text-dark 
                  rounded-full font-bold text-lg transition-all mb-4
                  hover:scale-105 hover:shadow-2xl hover:shadow-accent/50
                "
              >
                ▶ Continue Game
              </button>
              <div className="text-sm text-gray-500">
                {saveInfo.country} • {saveInfo.era} • Day {saveInfo.daysPassed}
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
            </div>
          )}
        </div>

        {/* Era Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Choose Your Era</h2>
            {selectedEra && (
              <span className="era-badge animate-slide-in">
                {currentEra?.name}
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {eras.map(era => (
              <button
                key={era.id}
                onClick={() => {
                  setSelectedEra(era.id)
                  setSelectedCountry(null)
                }}
                className={`
                  card-premium btn-premium p-6 text-left rounded-2xl transition-all
                  ${
                    selectedEra === era.id
                      ? 'ring-2 ring-accent scale-105'
                      : 'hover:scale-102'
                  }
                `}
              >
                <div className="text-4xl mb-3">{era.icon}</div>
                <h3 className="text-xl font-bold mb-2">{era.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{era.description}</p>
                <div className="text-xs text-accent font-semibold">
                  {era.startYear} - {era.endYear}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Country Selection */}
        {selectedEra && currentEra && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold">Choose Your Nation</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentEra.countries.map(country => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`
                    glass btn-premium p-4 rounded-xl font-semibold transition-all
                    ${
                      selectedCountry === country
                        ? 'ring-2 ring-accent bg-accent/10 scale-105'
                        : 'hover:bg-gray-700/50'
                    }
                  `}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Button */}
        {selectedEra && selectedCountry && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <button
              onClick={handleStartGame}
              className="
                btn-premium px-12 py-4 bg-accent hover:bg-yellow-400 text-dark 
                rounded-full font-bold text-lg transition-all
                hover:scale-105 hover:shadow-2xl hover:shadow-accent/50
              "
            >
              Begin Your Journey
            </button>
            <p className="text-sm text-gray-500">
              Lead {selectedCountry} through {currentEra.name}
            </p>
          </div>
        )}

        {/* Footer Easter Egg */}
        <div className="text-center pt-8">
          <HistoricalFact />
          <div className="mt-4 text-xs text-gray-600">
            <p>"Those who cannot remember the past are condemned to repeat it." — George Santayana</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home