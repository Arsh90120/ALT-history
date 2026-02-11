import { useGame } from '../context/GameContext'
import { formatDate } from '../utils/formatters'

function EventModal({ event, onClose }) {
  const { makeDecision } = useGame()

  const handleChoice = (choice) => {
    makeDecision(event.id, choice)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-accent">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 to-orange-900 p-6 border-b-2 border-accent">
          <div className="text-sm text-gray-300 mb-2">
            {formatDate(event.date)}
          </div>
          <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
          <p className="text-gray-200">{event.description}</p>
        </div>

        {/* Choices */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">What will you do?</h3>
          
          {event.choices.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              className="w-full text-left p-5 bg-gray-700 hover:bg-gray-600 rounded-lg border-2 border-transparent hover:border-accent transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-2 group-hover:text-accent transition">
                    {String.fromCharCode(65 + index)}. {choice.text}
                  </div>
                  
                  {/* Show consequences preview */}
                  {choice.consequences && (
                    <div className="text-sm text-gray-400 space-y-1 mt-2">
                      {choice.consequences.treasury && (
                        <div>
                          💰 Treasury: {choice.consequences.treasury > 0 ? '+' : ''}
                          {choice.consequences.treasury.toLocaleString()}
                        </div>
                      )}
                      {choice.consequences.morale && (
                        <div>
                          😊 Morale: {choice.consequences.morale > 0 ? '+' : ''}
                          {choice.consequences.morale}
                        </div>
                      )}
                      {choice.consequences.military && (
                        <div>
                          ⚔️ Military changes
                        </div>
                      )}
                      {choice.consequences.relationships && (
                        <div>
                          🤝 Diplomatic consequences
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-2xl ml-4 opacity-0 group-hover:opacity-100 transition">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventModal