import { getInitialCountryData } from '../data/countries'
import { getEraData } from '../data/eras'
import { createNotification, NOTIFICATION_TYPES } from '../utils/notifications'

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
        aiCountries: eraData.aiCountries,
        notifications: [
          createNotification(
            NOTIFICATION_TYPES.SUCCESS,
            `Game Started: ${country}`,
            `Leading ${country} through the ${era}`,
            eraData.startDate
          )
        ]
      }
    }
    
    case 'ADVANCE_TIME': {
      const days = action.payload
      const newDate = new Date(state.currentDate)
      newDate.setDate(newDate.getDate() + days)
      
      // Calculate resource changes
      const newTreasury = state.resources.treasury + (state.resources.income - state.resources.expenses) * days
      const newResearchPoints = state.research.points + (state.research.pointsPerDay * days)
      
      // Check for low treasury warning
      const notifications = [...state.notifications]
      if (newTreasury < 1000 && state.resources.treasury >= 1000) {
        notifications.push(
          createNotification(
            NOTIFICATION_TYPES.WARNING,
            'Treasury Running Low',
            `Treasury: $${Math.round(newTreasury)}M - Consider increasing taxes`,
            newDate.toISOString()
          )
        )
      }
      
      // Check for low morale warning
      if (state.morale.current < 30 && state.morale.current >= 30) {
        notifications.push(
          createNotification(
            NOTIFICATION_TYPES.WARNING,
            'Morale Critical',
            'Population happiness is dangerously low',
            newDate.toISOString()
          )
        )
      }
      
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
        },
        notifications
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
    
    case 'UPDATE_MILITARY': {
      const updates = action.payload
      const notifications = [...state.notifications]
      
      // Notify about recruitment
      if (updates.army > state.military.army) {
        notifications.push(
          createNotification(
            NOTIFICATION_TYPES.MILITARY,
            'Army Recruitment',
            `+${updates.army - state.military.army} Army units recruited`,
            state.currentDate
          )
        )
      }
      if (updates.navy > state.military.navy) {
        notifications.push(
          createNotification(
            NOTIFICATION_TYPES.MILITARY,
            'Navy Expansion',
            `+${updates.navy - state.military.navy} Naval units commissioned`,
            state.currentDate
          )
        )
      }
      if (updates.airForce > state.military.airForce) {
        notifications.push(
          createNotification(
            NOTIFICATION_TYPES.MILITARY,
            'Air Force Growth',
            `+${updates.airForce - state.military.airForce} Aircraft deployed`,
            state.currentDate
          )
        )
      }
      
      return {
        ...state,
        military: {
          ...state.military,
          ...updates
        },
        notifications
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
          createNotification(
            NOTIFICATION_TYPES.EVENT,
            action.payload.title,
            'A new event requires your attention',
            state.currentDate
          )
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
          createNotification(
            NOTIFICATION_TYPES.RESEARCH,
            `Research Completed: ${action.payload.name}`,
            'Your scientists have made a breakthrough!',
            state.currentDate
          )
        ]
      }
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
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
        },
        notifications: [
          ...state.notifications,
          createNotification(
            NOTIFICATION_TYPES.WAR,
            'War Declared!',
            `You are now at war with ${action.payload.country}`,
            state.currentDate
          )
        ]
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
        ],
        notifications: [
          ...state.notifications,
          createNotification(
            NOTIFICATION_TYPES.DIPLOMACY,
            'Alliance Proposed',
            `${action.payload.country} wishes to form an alliance`,
            state.currentDate
          )
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
        pendingDecisions: state.pendingDecisions.filter(d => d.country !== action.payload.country),
        notifications: [
          ...state.notifications,
          createNotification(
            NOTIFICATION_TYPES.SUCCESS,
            'Alliance Formed',
            `You are now allied with ${action.payload.country}`,
            state.currentDate
          )
        ]
      }
    
    case 'REJECT_ALLIANCE':
      return {
        ...state,
        relationships: {
          ...state.relationships,
          [action.payload.country]: Math.max(-100, (state.relationships[action.payload.country] || 0) - 20)
        },
        pendingDecisions: state.pendingDecisions.filter(d => d.country !== action.payload.country),
        notifications: [
          ...state.notifications,
          createNotification(
            NOTIFICATION_TYPES.DIPLOMACY,
            'Alliance Rejected',
            `You declined ${action.payload.country}'s alliance proposal`,
            state.currentDate
          )
        ]
      }
    
    case 'LOAD_GAME':
      return action.payload
    
    default:
      return state
  }
}