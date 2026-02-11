import { createContext, useContext, useReducer, useEffect } from 'react'
import { gameReducer, initialGameState } from './gameReducer'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)

  // Save game state to localStorage on changes
  useEffect(() => {
    if (state.gameStarted) {
      localStorage.setItem('altHistoryGameState', JSON.stringify(state))
    }
  }, [state])

  // Load saved game state on mount
  useEffect(() => {
    const saved = localStorage.getItem('altHistoryGameState')
    if (saved) {
      try {
        const savedState = JSON.parse(saved)
        dispatch({ type: 'LOAD_GAME', payload: savedState })
      } catch (e) {
        console.error('Failed to load saved game:', e)
      }
    }
  }, [])

  const value = {
    state,
    dispatch,
    // Helper functions for common actions
    initializeGame: (era, country, difficulty = 'normal') => {
      dispatch({ type: 'INITIALIZE_GAME', payload: { era, country, difficulty } })
    },
    updateResources: (resources) => {
      dispatch({ type: 'UPDATE_RESOURCES', payload: resources })
    },
    advanceTime: (days) => {
      dispatch({ type: 'ADVANCE_TIME', payload: days })
    },
    pauseGame: () => {
      dispatch({ type: 'PAUSE_GAME' })
    },
    resumeGame: () => {
      dispatch({ type: 'RESUME_GAME' })
    },
    setSpeed: (speed) => {
      dispatch({ type: 'SET_SPEED', payload: speed })
    },
    triggerEvent: (event) => {
      dispatch({ type: 'TRIGGER_EVENT', payload: event })
    },
    makeDecision: (eventId, choice) => {
      dispatch({ type: 'MAKE_DECISION', payload: { eventId, choice } })
    },
    updateRelationship: (country, change) => {
      dispatch({ type: 'UPDATE_RELATIONSHIP', payload: { country, change } })
    },
    updateMilitary: (updates) => {
      dispatch({ type: 'UPDATE_MILITARY', payload: updates })
    },
    completeResearch: (tech) => {
      dispatch({ type: 'COMPLETE_RESEARCH', payload: tech })
    },
    updateMorale: (change) => {
      dispatch({ type: 'UPDATE_MORALE', payload: change })
    }
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}