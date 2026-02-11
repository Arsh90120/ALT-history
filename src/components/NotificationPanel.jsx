import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { formatDateShort } from '../utils/formatters'

function NotificationPanel() {
  const { state } = useGame()
  const [isExpanded, setIsExpanded] = useState(false)

  const recentNotifications = state.notifications.slice(-5).reverse()

  if (state.notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Collapsed state */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gray-800 border-2 border-accent rounded-lg p-4 shadow-lg hover:bg-gray-700 transition"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔔</div>
            <div className="text-left">
              <div className="font-semibold">Notifications</div>
              <div className="text-sm text-gray-400">
                {state.notifications.length} total
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Expanded state */}
      {isExpanded && (
        <div className="bg-gray-800 border-2 border-accent rounded-lg shadow-lg w-96 max-h-96 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-bold text-lg">Recent Notifications</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-light transition"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {recentNotifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notifications yet</p>
            ) : (
              recentNotifications.map(notification => (
                <div
                  key={notification.id}
                  className="p-3 bg-gray-700 rounded border-l-4 border-accent"
                >
                  <div className="flex items-start gap-2">
                    <div className="text-lg">
                      {notification.type === 'event' ? '⚠️' : 
                       notification.type === 'research' ? '🔬' : '📰'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{notification.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDateShort(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationPanel