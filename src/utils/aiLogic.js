// Enhanced AI decision-making logic with memory and smarter behavior

export function getAIDecision(aiData, relationshipWithPlayer, gameState) {
  const { personality, strength, name } = aiData
  const playerStrength = calculatePlayerStrength(gameState)
  const relativeStrength = strength / playerStrength

  // Initialize AI memory if it doesn't exist
  if (!gameState.aiMemory) {
    gameState.aiMemory = {}
  }
  if (!gameState.aiMemory[name]) {
    gameState.aiMemory[name] = {
      lastAllianceProposal: -999,
      lastWarDeclaration: -999,
      lastThreat: -999,
      allianceRejectedCount: 0,
      hasActiveAlliance: false,
      atWarWith: false
    }
  }

  const memory = gameState.aiMemory[name]
  const daysSinceLastAlliance = gameState.daysPassed - memory.lastAllianceProposal
  const daysSinceLastWar = gameState.daysPassed - memory.lastWarDeclaration
  const daysSinceLastThreat = gameState.daysPassed - memory.lastThreat

  // Check current game state
  const isAllied = gameState.alliances?.includes(name) || false
  const isAtWar = gameState.wars?.includes(name) || false

  // Update memory with current state
  memory.hasActiveAlliance = isAllied
  memory.atWarWith = isAtWar

  // CRITICAL: Never propose alliance if already allied
  if (isAllied) {
    memory.hasActiveAlliance = true
  }

  // CRITICAL: Never declare war if already at war
  if (isAtWar) {
    memory.atWarWith = true
  }

  // Base personality weights
  const decisions = {
    aggressive: {
      declare_war: 0.25,
      build_military: 0.35,
      threaten: 0.20,
      research: 0.15,
      seek_alliance: 0.05
    },
    defensive: {
      build_military: 0.30,
      research: 0.25,
      seek_alliance: 0.25,
      fortify: 0.15,
      diplomacy: 0.05
    },
    opportunistic: {
      build_military: 0.20,
      research: 0.20,
      diplomacy: 0.20,
      declare_war: 0.15,
      seek_alliance: 0.15,
      wait: 0.10
    }
  }

  const weights = { ...(decisions[personality] || decisions.opportunistic) }

  // === RELATIONSHIP-BASED LOGIC ===
  
  // Already allied - maintain relationship
  if (isAllied) {
    weights.seek_alliance = 0
    weights.declare_war = 0
    weights.threaten = 0
    weights.diplomacy = 0.4
    weights.research = 0.3
    weights.build_military = 0.3
  }

  // Already at war - focus on military
  if (isAtWar) {
    weights.declare_war = 0
    weights.seek_alliance = 0
    weights.build_military = 0.5
    weights.research = 0.3
    weights.threaten = 0
    weights.fortify = 0.2
  }

  // Very positive relationship (50+) - seek alliance if not allied
  if (relationshipWithPlayer >= 50 && !isAllied && daysSinceLastAlliance > 60) {
    weights.seek_alliance = 0.6
    weights.declare_war = 0
    weights.threaten = 0
    weights.diplomacy = 0.2
  }

  // Good relationship (20-49) - maintain peace
  if (relationshipWithPlayer >= 20 && relationshipWithPlayer < 50 && !isAllied) {
    weights.declare_war = 0
    weights.threaten = 0
    weights.diplomacy = 0.3
    weights.build_military = 0.3
    weights.research = 0.2
  }

  // Neutral relationship (-19 to 19) - cautious
  if (relationshipWithPlayer > -20 && relationshipWithPlayer < 20) {
    weights.declare_war = 0
    weights.threaten = Math.max(0.1, weights.threaten || 0)
    weights.build_military = 0.3
    weights.research = 0.25
    weights.diplomacy = 0.15
  }

  // Poor relationship (-20 to -49) - hostile but not war
  if (relationshipWithPlayer < -20 && relationshipWithPlayer >= -50 && !isAtWar) {
    if (daysSinceLastThreat > 45) {
      weights.threaten = 0.4
    } else {
      weights.threaten = 0
    }
    weights.build_military = 0.3
    weights.declare_war = relativeStrength > 1.3 && daysSinceLastWar > 90 ? 0.2 : 0
  }

  // Very poor relationship (-50 or worse) - war likely
  if (relationshipWithPlayer < -50 && !isAtWar) {
    if (relativeStrength > 1.5 && daysSinceLastWar > 90) {
      weights.declare_war = 0.5
      weights.build_military = 0.3
      weights.threaten = 0
    } else {
      weights.declare_war = 0
      weights.build_military = 0.5
      weights.threaten = daysSinceLastThreat > 45 ? 0.3 : 0
    }
  }

  // === COOLDOWN ENFORCEMENT ===
  
  // Alliance proposal cooldown (at least 60 days between proposals)
  if (daysSinceLastAlliance < 60 || memory.allianceRejectedCount >= 2) {
    weights.seek_alliance = 0
  }

  // War declaration cooldown (at least 90 days)
  if (daysSinceLastWar < 90) {
    weights.declare_war = 0
  }

  // Threat cooldown (at least 45 days)
  if (daysSinceLastThreat < 45) {
    weights.threaten = 0
  }

  // === STRENGTH-BASED LOGIC ===
  
  // Player is much stronger - be defensive
  if (relativeStrength < 0.6) {
    weights.declare_war = 0
    weights.build_military = 0.4
    weights.research = 0.3
    weights.seek_alliance = !isAllied && relationshipWithPlayer > 0 ? 0.2 : 0
  }

  // Player is weaker - opportunistic aggression
  if (relativeStrength > 1.8 && relationshipWithPlayer < 0 && !isAtWar) {
    if (daysSinceLastWar > 90) {
      weights.declare_war = 0.3
    }
    weights.threaten = daysSinceLastThreat > 45 ? 0.2 : 0
  }

  // === GAME STATE RESPONSE ===
  
  // Player is vulnerable - aggressive AIs attack
  if (personality === 'aggressive' && !isAtWar) {
    if (gameState.morale.current < 30 || gameState.resources.treasury < 5000) {
      if (relativeStrength > 1.2 && daysSinceLastWar > 90) {
        weights.declare_war = 0.4
        weights.threaten = 0
      }
    }
  }

  // Player has many wars - opportunistic AIs may join in
  if (personality === 'opportunistic' && !isAtWar) {
    if (gameState.wars?.length > 1 && relativeStrength > 1.0 && daysSinceLastWar > 90) {
      weights.declare_war = 0.25
    }
  }

  // === FINAL VALIDATION ===
  
  // Never allow duplicate actions
  if (isAllied) weights.seek_alliance = 0
  if (isAtWar) weights.declare_war = 0
  
  // Normalize weights
  const total = Object.values(weights).reduce((sum, w) => sum + (w || 0), 0)
  if (total === 0) {
    return 'wait' // Default to waiting if no valid actions
  }

  // Choose action
  return weightedRandomChoice(weights)
}

function weightedRandomChoice(weights) {
  const actions = Object.keys(weights).filter(key => weights[key] > 0)
  if (actions.length === 0) return 'wait'

  const total = actions.reduce((sum, action) => sum + weights[action], 0)
  let random = Math.random() * total

  for (const action of actions) {
    random -= weights[action]
    if (random <= 0) {
      return action
    }
  }

  return actions[0] || 'wait'
}

export function executeAIAction(action, countryName, gameState, dispatch) {
  // Update AI memory
  if (!gameState.aiMemory) gameState.aiMemory = {}
  if (!gameState.aiMemory[countryName]) {
    gameState.aiMemory[countryName] = {
      lastAllianceProposal: -999,
      lastWarDeclaration: -999,
      lastThreat: -999,
      allianceRejectedCount: 0,
      hasActiveAlliance: false,
      atWarWith: false
    }
  }

  const memory = gameState.aiMemory[countryName]

  // Update memory timestamps
  if (action === 'seek_alliance') {
    memory.lastAllianceProposal = gameState.daysPassed
  }
  if (action === 'declare_war') {
    memory.lastWarDeclaration = gameState.daysPassed
    memory.atWarWith = true
  }
  if (action === 'threaten') {
    memory.lastThreat = gameState.daysPassed
  }

  const messages = {
    declare_war: `${countryName} has declared war!`,
    build_military: `Intelligence: ${countryName} is expanding military forces`,
    threaten: `${countryName} issues hostile ultimatum`,
    research: `Reports indicate ${countryName} has made technological advances`,
    seek_alliance: `${countryName} proposes an alliance`,
    diplomacy: `${countryName} seeks to improve diplomatic relations`,
    fortify: `${countryName} reinforces border defenses`,
    wait: null
  }

  const relationshipChanges = {
    declare_war: -60,
    threaten: -20,
    seek_alliance: 15,
    diplomacy: 10,
    build_military: -3,
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
    const notificationType = 
      action === 'declare_war' ? 'WAR' :
      action === 'seek_alliance' ? 'DIPLOMACY' :
      action === 'threaten' ? 'WARNING' :
      'INFO'

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now() + Math.random(),
        type: notificationType,
        title: countryName,
        message: message,
        timestamp: gameState.currentDate
      }
    })
  }

  // Special handling for war declaration
  if (action === 'declare_war') {
    // Only declare war if not already at war
    const isAtWar = gameState.wars?.includes(countryName)
    if (!isAtWar) {
      dispatch({
        type: 'DECLARE_WAR',
        payload: { country: countryName }
      })
    }
  }

  // Alliance proposal
  if (action === 'seek_alliance') {
    // Only propose if not already allied
    const isAllied = gameState.alliances?.includes(countryName)
    if (!isAllied) {
      dispatch({
        type: 'ALLIANCE_PROPOSAL',
        payload: { country: countryName }
      })
    }
  }
}

function calculatePlayerStrength(gameState) {
  const { military, resources, morale } = gameState
  
  const militaryScore = (
    military.army * 1.0 +
    military.navy * 800 +
    military.airForce * 100
  ) * (military.readiness / 100)

  const economicScore = resources.gdp / 500
  const moraleMultiplier = Math.max(0.3, morale.current / 100)

  return (militaryScore + economicScore) * moraleMultiplier
}

export function handleAllianceResponse(countryName, accepted, gameState) {
  // Update AI memory when player responds
  if (!gameState.aiMemory) gameState.aiMemory = {}
  if (!gameState.aiMemory[countryName]) {
    gameState.aiMemory[countryName] = {
      lastAllianceProposal: -999,
      lastWarDeclaration: -999,
      lastThreat: -999,
      allianceRejectedCount: 0,
      hasActiveAlliance: false,
      atWarWith: false
    }
  }

  if (!accepted) {
    gameState.aiMemory[countryName].allianceRejectedCount++
  } else {
    gameState.aiMemory[countryName].hasActiveAlliance = true
    gameState.aiMemory[countryName].allianceRejectedCount = 0
  }
}