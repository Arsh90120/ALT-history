import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { checkEventTriggers } from '../data/events'

// Main game loop hook - handles time advancement and event triggering
export function useGameLoop() {
  const { state, dispatch, advanceTime, triggerEvent } = useGame()
  const intervalRef = useRef(null)
  const lastCheckRef = useRef(null)

  useEffect(() => {
    // Only run if game is started and not paused
    if (!state.gameStarted || state.isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Calculate interval based on speed (1x = 1 day per second, 5x = 5 days per second)
    const intervalMs = 1000 / state.speed

    intervalRef.current = setInterval(() => {
      // Advance time by 1 day
      advanceTime(1)

      // Check for events every 7 days to avoid spam
      const daysPassed = state.daysPassed + 1
      if (daysPassed % 7 === 0 || !lastCheckRef.current) {
        checkAndTriggerEvents()
        lastCheckRef.current = state.currentDate
      }
    }, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.gameStarted, state.isPaused, state.speed, state.currentDate])

  function checkAndTriggerEvents() {
    if (!state.currentDate || !state.playerCountry || !state.era) return

    const triggeredEvents = checkEventTriggers(
      state.currentDate,
      state.playerCountry,
      state.era
    )

    // Filter out events that have already been triggered
    const newEvents = triggeredEvents.filter(
      event => !state.eventHistory.find(h => h.id === event.id) &&
               !state.activeEvents.find(a => a.id === event.id)
    )

    // Trigger each new event
    newEvents.forEach(event => {
      triggerEvent(event)
    })
  }

  return {
    isRunning: state.gameStarted && !state.isPaused
  }
}