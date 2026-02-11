// AI decision-making logic

export function getAIDecision(aiData, relationshipWithPlayer, gameState) {
  const { personality, strength } = aiData
  const playerStrength = calculatePlayerStrength(gameState)
  const relativeStrength = strength / playerStrength

  // Personality-based decision weights
  const decisions = {
    aggressive: {
      declare_war: 0.3,
      build_military: 0.4,
      threaten: 0.2,
      research: 0.1
    },
    defensive: {
      build_military: 0.4,
      research: 0.3,
      seek_alliance: 0.2,
      fortify: 0.1
    },
    opportunistic: {
      build_military: 0.2,
      research: 0.2,
      diplomacy: 0.3,
      declare_war: 0.2,
      wait: 0.1
    }
  }

  const weights = decisions[personality] || decisions.opportunistic

  // Modify weights based on relationship and strength
  if (relationshipWithPlayer < -50 && relativeStrength > 1.2) {
    weights.declare_war = (weights.declare_war || 0) + 0.3
  }

  if (relationshipWithPlayer > 50) {
    weights.seek_alliance = (weights.seek_alliance || 0) + 0.3
    weights.declare_war = 0
  }

  if (relativeStrength < 0.8) {
    weights.build_military = (weights.build_military || 0) + 0.2
    weights.declare_war = Math.max(0, (weights.declare_war || 0) - 0.2)
  }

  // Player is weak - opportunistic behavior
  if (gameState.morale.current < 30 || gameState.resources.treasury < 10000) {
    weights.declare_war = (weights.declare_war || 0) + 0.2
    weights.threaten = (weights.threaten || 0) + 0.1
  }

  // Choose action based on weighted random
  return weightedRandomChoice(weights)
}

function weightedRandomChoice(weights) {
  const actions = Object.keys(weights)
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0)
  let random = Math.random() * total

  for (const action of actions) {
    random -= weights[action]
    if (random <= 0) {
      return action
    }
  }

  return actions[0]
}

export function executeAIAction(action, countryName, gameState, dispatch) {
  const messages = {
    declare_war: `${countryName} has declared war on you!`,
    build_military: `${countryName} is building up military forces`,
    threaten: `${countryName} issues ultimatum to your nation`,
    research: `${countryName} advances their technology`,
    seek_alliance: `${countryName} proposes an alliance`,
    diplomacy: `${countryName} seeks to improve relations`,
    fortify: `${countryName} fortifies their borders`,
    wait: null
  }

  const relationshipChanges = {
    declare_war: -50,
    threaten: -15,
    seek_alliance: 20,
    diplomacy: 10,
    build_military: -5,
    research: 0,
    fortify: -5,
    wait: 0
  }

  // Apply relationship change
  const relChange = relationshipChanges[action] || 0
  if (relChange !== 0) {
    dispatch({
      type: 'UPDATE_RELATIONSHIP',
      payload: { country: countryName, change: relChange }
    })
  }

  // Send notification
  const message = messages[action]
  if (message) {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now() + Math.random(),
        type: 'ai_action',
        message: message,
        timestamp: gameState.currentDate,
        country: countryName
      }
    })
  }

  // Special handling for war declaration
  if (action === 'declare_war') {
    dispatch({
      type: 'DECLARE_WAR',
      payload: { country: countryName }
    })
  }

  // Alliance proposal
  if (action === 'seek_alliance') {
    dispatch({
      type: 'ALLIANCE_PROPOSAL',
      payload: { country: countryName }
    })
  }
}

function calculatePlayerStrength(gameState) {
  const { military, resources, morale } = gameState
  
  const militaryScore = (
    military.army * 0.5 +
    military.navy * 500 +
    military.airForce * 50
  ) * (military.readiness / 100)

  const economicScore = resources.gdp / 1000
  const moraleMultiplier = morale.current / 100

  return (militaryScore + economicScore) * moraleMultiplier
}

export function getAIResponse(action, playerCountry, aiCountry, aiData) {
  // AI responds to player actions
  const { personality } = aiData

  const responses = {
    aggressive: {
      gift: 'accept_suspicious',
      trade: 'demand_more',
      alliance: 'reject',
      threaten: 'threaten_back',
      embargo: 'declare_war'
    },
    defensive: {
      gift: 'accept_grateful',
      trade: 'accept',
      alliance: 'accept_cautious',
      threaten: 'fortify',
      embargo: 'embargo_back'
    },
    opportunistic: {
      gift: 'accept',
      trade: 'negotiate',
      alliance: 'accept_conditional',
      threaten: 'assess_strength',
      embargo: 'seek_alternatives'
    }
  }

  return responses[personality]?.[action] || 'ignore'
}