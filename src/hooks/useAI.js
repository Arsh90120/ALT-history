import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { getAIDecision, executeAIAction } from '../utils/aiLogic'

// AI system hook - makes AI countries take actions
export function useAI() {
  const { state, dispatch } = useGame()
  const lastAIUpdateRef = useRef(0)

  useEffect(() => {
    if (!state.gameStarted || state.isPaused) return

    // AI acts every 30 in-game days
    const daysSinceLastUpdate = state.daysPassed - lastAIUpdateRef.current
    
    if (daysSinceLastUpdate >= 30) {
      processAIActions()
      lastAIUpdateRef.current = state.daysPassed
    }
  }, [state.daysPassed, state.gameStarted, state.isPaused])

  function processAIActions() {
    if (!state.aiCountries) return

    Object.keys(state.aiCountries).forEach(countryName => {
      // Skip player's country
      if (countryName === state.playerCountry) return

      const aiData = state.aiCountries[countryName]
      const relationship = state.relationships[countryName] || 0

      // Get AI decision based on personality and game state
      const decision = getAIDecision(aiData, relationship, state)

      if (decision) {
        executeAIAction(decision, countryName, state, dispatch)
      }
    })
  }

  return null
}