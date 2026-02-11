import { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { formatDateShort } from '../utils/formatters'

function NotificationCenter() {
  const { state, dispatch } = useGame()
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Count unread notifications (last 10 are considered "new")
    const recentCount = Math.min(state.notifications.length, 10)
    setUnreadCount(recentCount)
  }, [state.notifications.length])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event': return '⚠️'
      case 'research': return '🔬'
      case 'diplomacy': return '🤝'
      case 'war': return '⚔️'
      case 'economy': return '💰'
      case 'military': return '🪖'
      case 'success': return '✅'
      case 'warning': return '⚡'
      default: return '📰'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event': return 'border-yellow-500 bg-yellow-500/10'
      case 'research': return 'border-blue-500 bg-blue-500/10'
      case 'diplomacy': return 'border-green-500 bg-green-500/10'
      case 'war': return 'border-red-500 bg-red-500/10'
      case 'economy': return 'border-accent bg-accent/10'
      case 'military': return 'border-orange-500 bg-orange-500/10'
      case 'success': return 'border-emerald-500 bg-emerald-500/10'
      case 'warning': return 'border-purple-500 bg-purple-500/10'
      default: return 'border-gray-500 bg-gray-500/10'
    }
  }

  const filteredNotifications = state.notifications.filter(notification => {
    if (filter === 'all') return true
    return notification.type === filter
  }).reverse()

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    setUnreadCount(0)
  }

  const markAsRead = () => {
    setUnreadCount(0)
  }

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) markAsRead()
        }}
        className="fixed top-4 right-4 z-50 card-premium p-3 rounded-xl hover:scale-105 transition-all"
      >
        <div className="relative">
          <div className="text-2xl">🔔</div>
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount}
            </div>
          )}
        </div>
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative card-premium w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent p-6 border-b border-accent/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black">Notification Center</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {state.notifications.length} total notifications
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="glass p-2 rounded-lg hover:bg-gray-700/50 transition"
                >
                  ✕
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap">
                {['all', 'event', 'research', 'diplomacy', 'war', 'economy', 'military'].map(filterType => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`
                      px-3 py-1 rounded-full text-sm font-semibold transition-all
                      ${
                        filter === filterType
                          ? 'bg-accent text-dark'
                          : 'glass hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {filterType === 'all' ? '📋 All' : `${getNotificationIcon(filterType)} ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-lg font-semibold">No notifications yet</p>
                  <p className="text-sm mt-2">Events and updates will appear here</p>
                </div>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`
                      p-4 rounded-xl border-l-4 transition-all animate-slide-in
                      ${getNotificationColor(notification.type)}
                      ${index < unreadCount ? 'ring-2 ring-accent/50' : ''}
                    `}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold">{notification.message}</div>
                          {index < unreadCount && (
                            <div className="text-xs bg-accent text-dark px-2 py-1 rounded-full font-bold">
                              NEW
                            </div>
                          )}
                        </div>
                        {notification.details && (
                          <p className="text-sm text-gray-400 mt-1">{notification.details}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>📅 {formatDateShort(notification.timestamp)}</span>
                          <span className="era-badge text-xs">{notification.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {state.notifications.length > 0 && (
              <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredNotifications.length} of {state.notifications.length}
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="btn-premium px-4 py-2 glass rounded-lg hover:bg-red-500/20 hover:border-red-500 border border-transparent transition-all text-sm font-semibold"
                >
                  🗑️ Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default NotificationCenter