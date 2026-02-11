// Utility functions for formatting game data

export function formatCurrency(amount) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`
  }
  return `$${amount.toFixed(0)}`
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateShort(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getRelationshipStatus(value) {
  if (value >= 75) return { text: 'Allied', color: 'text-green-500' }
  if (value >= 50) return { text: 'Friendly', color: 'text-green-400' }
  if (value >= 25) return { text: 'Cordial', color: 'text-blue-400' }
  if (value >= 0) return { text: 'Neutral', color: 'text-gray-400' }
  if (value >= -25) return { text: 'Strained', color: 'text-yellow-500' }
  if (value >= -50) return { text: 'Hostile', color: 'text-orange-500' }
  if (value >= -75) return { text: 'Rival', color: 'text-red-500' }
  return { text: 'At War', color: 'text-red-700' }
}

export function getMoraleStatus(value) {
  if (value >= 80) return { text: 'Enthusiastic', color: 'text-green-500' }
  if (value >= 60) return { text: 'Satisfied', color: 'text-blue-400' }
  if (value >= 40) return { text: 'Content', color: 'text-gray-400' }
  if (value >= 20) return { text: 'Discontent', color: 'text-yellow-500' }
  return { text: 'Rebellious', color: 'text-red-500' }
}

export function calculateDaysUntil(currentDate, targetDate) {
  const current = new Date(currentDate)
  const target = new Date(targetDate)
  const diff = target - current
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}