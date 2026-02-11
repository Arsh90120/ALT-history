import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { GameProvider, useGame } from './context/GameContext'
import Landing from './pages/Landing'
import EraSelection from './pages/EraSelection'
import CountrySelection from './pages/CountrySelection'
import Game from './pages/Game'

function AppContent() {
  const { state } = useGame()

  // Update data-era attribute on document element when era changes
  useEffect(() => {
    if (state.era) {
      document.documentElement.setAttribute('data-era', state.era)
    } else {
      document.documentElement.removeAttribute('data-era')
    }
  }, [state.era])

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/era" element={<EraSelection />} />
          <Route path="/country" element={<CountrySelection />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App