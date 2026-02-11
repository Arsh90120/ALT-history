// Notification helper functions

export function createNotification(type, message, details = null, timestamp = null) {
  return {
    id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    message,
    details,
    timestamp: timestamp || new Date().toISOString(),
    read: false
  }
}

export const NOTIFICATION_TYPES = {
  EVENT: 'event',
  RESEARCH: 'research',
  DIPLOMACY: 'diplomacy',
  WAR: 'war',
  ECONOMY: 'economy',
  MILITARY: 'military',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info'
}

// Helper to create specific notification types
export const NotificationTemplates = {
  researchComplete: (techName) => createNotification(
    NOTIFICATION_TYPES.RESEARCH,
    `Research Completed: ${techName}`,
    'Your scientists have made a breakthrough!'
  ),
  
  warDeclared: (country) => createNotification(
    NOTIFICATION_TYPES.WAR,
    `War Declared!`,
    `You are now at war with ${country}`
  ),
  
  allianceProposed: (country) => createNotification(
    NOTIFICATION_TYPES.DIPLOMACY,
    `Alliance Proposed`,
    `${country} wishes to form an alliance with you`
  ),
  
  allianceAccepted: (country) => createNotification(
    NOTIFICATION_TYPES.SUCCESS,
    `Alliance Formed`,
    `You are now allied with ${country}`
  ),
  
  treasuryLow: () => createNotification(
    NOTIFICATION_TYPES.WARNING,
    'Treasury Running Low',
    'Consider increasing taxes or reducing expenses'
  ),
  
  moraleLow: () => createNotification(
    NOTIFICATION_TYPES.WARNING,
    'Morale Declining',
    'Your population is becoming unhappy'
  ),
  
  militaryRecruitment: (unitType, amount) => createNotification(
    NOTIFICATION_TYPES.MILITARY,
    `${unitType} Recruited`,
    `${amount} new ${unitType} units have joined your forces`
  ),
  
  economicChange: (type, amount) => createNotification(
    NOTIFICATION_TYPES.ECONOMY,
    `${type} ${amount > 0 ? 'Increased' : 'Decreased'}`,
    `${type} has changed by ${amount > 0 ? '+' : ''}${amount}`
  ),
  
  eventTriggered: (title) => createNotification(
    NOTIFICATION_TYPES.EVENT,
    title,
    'A new event requires your attention'
  )
}
