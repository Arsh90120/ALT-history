// Core game logic utilities

export function calculateBudgetBalance(income, expenses) {
  return income - expenses
}

export function calculateMilitaryStrength(military) {
  const { army, navy, airForce, readiness } = military
  const baseStrength = army * 0.5 + navy * 500 + airForce * 50
  return baseStrength * (readiness / 100)
}

export function calculateResearchProgress(currentPoints, techCost) {
  return Math.min(100, (currentPoints / techCost) * 100)
}

export function shouldTriggerEvent(event, currentDate, country) {
  const eventDate = new Date(event.date)
  const current = new Date(currentDate)
  
  // Check if date has passed
  if (current < eventDate) return false
  
  // Check if country is involved
  if (!event.triggerConditions.countries.includes(country)) return false
  
  return true
}

export function applyConsequences(state, consequences) {
  const newState = { ...state }
  
  // Apply resource changes
  if (consequences.treasury !== undefined) {
    newState.resources.treasury += consequences.treasury
  }
  
  // Apply morale changes
  if (consequences.morale !== undefined) {
    newState.morale.current = Math.max(0, Math.min(100, newState.morale.current + consequences.morale))
  }
  
  // Apply military changes
  if (consequences.military) {
    Object.keys(consequences.military).forEach(key => {
      if (newState.military[key] !== undefined) {
        newState.military[key] += consequences.military[key]
      }
    })
  }
  
  // Apply relationship changes
  if (consequences.relationships) {
    Object.keys(consequences.relationships).forEach(country => {
      const current = newState.relationships[country] || 0
      newState.relationships[country] = Math.max(-100, Math.min(100, current + consequences.relationships[country]))
    })
  }
  
  return newState
}

export function getAIAction(aiCountry, personality, gameState) {
  // Simple AI decision making based on personality
  const actions = ['none', 'build_military', 'research', 'diplomacy', 'attack']
  
  switch (personality) {
    case 'aggressive':
      return Math.random() > 0.6 ? 'attack' : 'build_military'
    case 'defensive':
      return Math.random() > 0.7 ? 'build_military' : 'research'
    case 'opportunistic':
      return gameState.morale.current < 50 ? 'attack' : 'diplomacy'
    default:
      return 'none'
  }
}