import { getInitialCountryData } from '../data/countries'
import { getEraData } from '../data/eras'

export const initialGameState = {
  // Game meta
  gameStarted: false,
  isPaused: false,
  speed: 1,
  difficulty: 'normal',
  
  // Time tracking
  currentDate: null,
  startDate: null,
  daysPassed: 0,
  
  // Player info
  era: null,
  playerCountry: null,
  
  // Country state
  resources: {
    treasury: 0,
    income: 0,
    expenses: 0,
    gdp: 0
  },
  
  military: {
    army: 0,
    navy: 0,
    airForce: 0,
    readiness: 0,
    ismobilized: false
  },
  
  research: {
    points: 0,
    pointsPerDay: 0,
    currentResearch: null,
    completedTech: [],
    availableTech: []
  },
  
  morale: {
    current: 100,
    trend: 0,
    warExhaustion: 0
  },
  
  // Diplomacy
  relationships: {},
  alliances: [],
  wars: [],
  treaties: [],
  
  // Events
  activeEvents: [],
  eventHistory: [],
  pendingDecisions: [],
  
  // AI countries
  aiCountries: {},
  
  // Notifications
  notifications: []
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      const { era, country, difficulty } = action.payload
      const eraData = getEraData(era)
      const countryData = getInitialCountryData(era, country)
      
      return {
        ...initialGameState,
        gameStarted: true,
        era,
        playerCountry: country,
        difficulty,
        currentDate: eraData.startDate,
        startDate: eraData.startDate,
        resources: countryData.resources,
        military: countryData.military,
        research: {
          ...state.research,
          pointsPerDay: countryData.researchRate,
          availableTech: eraData.technologies
        },
        relationships: countryData.initialRelationships,
        aiCountries: eraData.aiCountries
      }
    }
    
    case 'ADVANCE_TIME': {
      const days = action.payload
      const newDate = new Date(state.currentDate)
      newDate.setDate(newDate.getDate() + days)
      
      // Calculate resource changes
      const newTreasury = state.resources.treasury + (state.resources.income - state.resources.expenses) * days
      const newResearchPoints = state.research.points + (state.research.pointsPerDay * days)
      
      return {
        ...state,
        currentDate: newDate.toISOString(),
        daysPassed: state.daysPassed + days,
        resources: {
          ...state.resources,
          treasury: Math.max(0, newTreasury)
        },
        research: {
          ...state.research,
          points: newResearchPoints
        }
      }
    }
    
    case 'UPDATE_RESOURCES':
      return {
        ...state,
        resources: {
          ...state.resources,
          ...action.payload
        }
      }
    
    case 'UPDATE_MILITARY':
      return {
        ...state,
        military: {
          ...state.military,
          ...action.payload
        }
      }
    
    case 'UPDATE_MORALE':
      return {
        ...state,
        morale: {
          ...state.morale,
          current: Math.max(0, Math.min(100, state.morale.current + action.payload))
        }
      }
    
    case 'UPDATE_RESEARCH':
      return {
        ...state,
        research: {
          ...state.research,
          ...action.payload
        }
      }
    
    case 'PAUSE_GAME':
      return {
        ...state,
        isPaused: true
      }
    
    case 'RESUME_GAME':
      return {
        ...state,
        isPaused: false
      }
    
    case 'SET_SPEED':
      return {
        ...state,
        speed: action.payload
      }
    
    case 'TRIGGER_EVENT':
      return {
        ...state,
        activeEvents: [...state.activeEvents, action.payload],
        isPaused: true,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: 'event',
            message: action.payload.title,
            timestamp: state.currentDate
          }
        ]
      }
    
    case 'MAKE_DECISION': {
      const { eventId, choice } = action.payload
      const event = state.activeEvents.find(e => e.id === eventId)
      
      if (!event) return state
      
      // Apply consequences of choice
      const consequences = choice.consequences || {}
      
      return {
        ...state,
        activeEvents: state.activeEvents.filter(e => e.id !== eventId),
        eventHistory: [
          ...state.eventHistory,
          { ...event, choice: choice.id, timestamp: state.currentDate }
        ],
        resources: {
          ...state.resources,
          treasury: state.resources.treasury + (consequences.treasury || 0)
        },
        morale: {
          ...state.morale,
          current: Math.max(0, Math.min(100, state.morale.current + (consequences.morale || 0)))
        },
        isPaused: state.activeEvents.length <= 1 ? false : true
      }
    }
    
    case 'UPDATE_RELATIONSHIP': {
      const { country, change } = action.payload
      const currentRel = state.relationships[country] || 0
      
      return {
        ...state,
        relationships: {
          ...state.relationships,
          [country]: Math.max(-100, Math.min(100, currentRel + change))
        }
      }
    }
    
    case 'COMPLETE_RESEARCH':
      return {
        ...state,
        research: {
          ...state.research,
          currentResearch: null,
          completedTech: [...state.research.completedTech, action.payload],
          points: state.research.points - action.payload.cost
        },
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: 'research',
            message: `Research completed: ${action.payload.name}`,
            timestamp: state.currentDate
          }
        ]
      }
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    
    case 'DECLARE_WAR':
      return {
        ...state,
        wars: [...state.wars, action.payload.country],
        relationships: {
          ...state.relationships,
          [action.payload.country]: -100
        },
        morale: {
          ...state.morale,
          current: Math.max(0, state.morale.current - 10)
        }
      }
    
    case 'ALLIANCE_PROPOSAL':
      return {
        ...state,
        pendingDecisions: [
          ...state.pendingDecisions,
          {
            id: Date.now(),
            type: 'alliance',
            country: action.payload.country,
            timestamp: state.currentDate
          }
        ]
      }
    
    case 'ACCEPT_ALLIANCE':
      return {
        ...state,
        alliances: [...state.alliances, action.payload.country],
        relationships: {
          ...state.relationships,
          [action.payload.country]: Math.min(100, (state.relationships[action.payload.country] || 0) + 30)
        },
        pendingDecisions: state.pendingDecisions.filter(d => d.country !== action.payload.country)
      }
    
    case 'REJECT_ALLIANCE':
      return {
        ...state,
        relationships: {
          ...state.relationships,
          [action.payload.country]: Math.max(-100, (state.relationships[action.payload.country] || 0) - 20)
        },
        pendingDecisions: state.pendingDecisions.filter(d => d.country !== action.payload.country)
      }
    
    case 'LOAD_GAME':
      return action.payload
    
    default:
      return state
  }
}