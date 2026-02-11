// Country selection page - choose nation to play
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

function CountrySelection() {
  const navigate = useNavigate()
  const location = useLocation()
  const era = location.state?.era || 'World War II'
  const [selectedCountry, setSelectedCountry] = useState(null)

  // Placeholder country data - will be expanded with actual historical data
  const countries = {
    'World War I': [
      { name: 'Germany', flag: '🇩🇪', power: 'Major' },
      { name: 'United Kingdom', flag: '🇬🇧', power: 'Major' },
      { name: 'France', flag: '🇫🇷', power: 'Major' },
      { name: 'Russia', flag: '🇷🇺', power: 'Major' },
      { name: 'Austria-Hungary', flag: '🇦🇹', power: 'Major' }
    ],
    'World War II': [
      { name: 'Germany', flag: '🇩🇪', power: 'Major' },
      { name: 'United States', flag: '🇺🇸', power: 'Major' },
      { name: 'Soviet Union', flag: '🇷🇺', power: 'Major' },
      { name: 'United Kingdom', flag: '🇬🇧', power: 'Major' },
      { name: 'Japan', flag: '🇯🇵', power: 'Major' },
      { name: 'Italy', flag: '🇮🇹', power: 'Major' }
    ],
    'Cold War': [
      { name: 'United States', flag: '🇺🇸', power: 'Superpower' },
      { name: 'Soviet Union', flag: '🇷🇺', power: 'Superpower' },
      { name: 'China', flag: '🇨🇳', power: 'Major' },
      { name: 'United Kingdom', flag: '🇬🇧', power: 'Major' },
      { name: 'France', flag: '🇫🇷', power: 'Major' }
    ],
    'Modern Era': [
      { name: 'United States', flag: '🇺🇸', power: 'Superpower' },
      { name: 'China', flag: '🇨🇳', power: 'Superpower' },
      { name: 'Russia', flag: '🇷🇺', power: 'Major' },
      { name: 'India', flag: '🇮🇳', power: 'Major' },
      { name: 'European Union', flag: '🇪🇺', power: 'Major' }
    ]
  }

  const availableCountries = countries[era] || countries['World War II']

  const handleStartGame = () => {
    if (selectedCountry) {
      navigate('/game', {
        state: {
          era,
          country: selectedCountry
        }
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <button
        onClick={() => navigate('/era')}
        className="absolute top-8 left-8 text-gray-400 hover:text-light transition"
      >
        ← Back
      </button>

      <h1 className="text-5xl font-bold mb-2">Choose Your Nation</h1>
      <p className="text-accent text-xl mb-8">{era}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full mb-8">
        {availableCountries.map((country) => (
          <button
            key={country.name}
            onClick={() => setSelectedCountry(country.name)}
            className={`
              p-6 rounded-lg border-2 transition-all
              ${
                selectedCountry === country.name
                  ? 'border-accent bg-gray-700 scale-105'
                  : 'border-gray-700 bg-gray-800 hover:border-primary'
              }
            `}
          >
            <div className="text-5xl mb-3">{country.flag}</div>
            <h3 className="text-xl font-bold mb-1">{country.name}</h3>
            <span className="text-sm text-gray-400">{country.power} Power</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleStartGame}
        disabled={!selectedCountry}
        className={`
          px-8 py-4 rounded-lg text-xl font-bold transition-all
          ${
            selectedCountry
              ? 'bg-accent hover:bg-yellow-500 text-dark cursor-pointer'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {selectedCountry ? `Start as ${selectedCountry}` : 'Select a Nation'}
      </button>
    </div>
  )
}

export default CountrySelection