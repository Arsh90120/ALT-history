import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import Landing from './pages/Landing'
import EraSelection from './pages/EraSelection'
import CountrySelection from './pages/CountrySelection'
import Game from './pages/Game'

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-dark text-light">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/era" element={<EraSelection />} />
            <Route path="/country" element={<CountrySelection />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  )
}

export default App