import { useGame } from '../context/GameContext'
import { formatDateShort } from '../utils/formatters'

function EventModal({ event, onClose }) {
  const { makeDecision } = useGame()

  const handleChoice = (choice) => {
    makeDecision(event.id, choice)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative card-premium max-w-3xl w-full rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent p-6 border-b border-accent/30">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-accent font-semibold mb-2 uppercase tracking-wide">
                {event.type === 'war' ? '⚔️ Crisis' : event.type === 'diplomacy' ? '🤝 Diplomatic Event' : '📰 Breaking News'}
              </div>
              <h2 className="text-3xl font-black mb-2">{event.title}</h2>
              <div className="text-sm text-gray-400">{formatDateShort(event.date)}</div>
            </div>
            <button
              onClick={onClose}
              className="glass p-2 rounded-lg hover:bg-gray-700/50 transition ml-4"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-300 leading-relaxed">{event.description}</p>
          </div>

          {event.historicalContext && (
            <div className="historical-quote">
              <p className="text-sm text-gray-400">{event.historicalContext}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Your Decision
            </div>
            {event.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice)}
                className="btn-premium w-full p-5 glass rounded-xl text-left hover:bg-gray-700/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl group-hover:scale-110 transition-transform">
                    {choice.id === 'A' ? '🅰️' : '🅱️'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                      {choice.text}
                    </div>
                    {choice.consequences && (
                      <div className="text-sm text-gray-500 space-y-1">
                        {choice.consequences.treasury && (
                          <div>
                            💰 Treasury: <span className={choice.consequences.treasury > 0 ? 'text-green-400' : 'text-red-400'}>
                              {choice.consequences.treasury > 0 ? '+' : ''}{choice.consequences.treasury}
                            </span>
                          </div>
                        )}
                        {choice.consequences.morale && (
                          <div>
                            😊 Morale: <span className={choice.consequences.morale > 0 ? 'text-green-400' : 'text-red-400'}>
                              {choice.consequences.morale > 0 ? '+' : ''}{choice.consequences.morale}
                            </span>
                          </div>
                        )}
                        {choice.consequences.relationship && (
                          <div>
                            🤝 Relations: <span className="text-blue-400">{choice.consequences.relationship}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="text-xs text-gray-600 italic text-center">
            "The only thing we learn from history is that we learn nothing from history." — Hegel
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModal