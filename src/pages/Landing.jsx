// Landing page component - game mode selection
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  const gameModes = [
    {
      title: 'Single Player',
      description: 'Control a nation against AI opponents',
      icon: '👤',
      path: '/era'
    },
    {
      title: 'Multiplayer',
      description: 'Compete with other players in real-time',
      icon: '👥',
      path: '/era',
      disabled: true
    },
    {
      title: 'Observer Mode',
      description: 'Watch AI nations interact and evolve',
      icon: '👁️',
      path: '/era',
      disabled: true
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold mb-4 text-center">
        ALT <span className="text-accent">History</span>
      </h1>
      <p className="text-xl text-gray-400 mb-12 text-center max-w-2xl">
        Rewrite history. Control nations through pivotal moments and watch alternate timelines unfold.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {gameModes.map((mode) => (
          <button
            key={mode.title}
            onClick={() => !mode.disabled && navigate(mode.path)}
            disabled={mode.disabled}
            className={`
              p-8 rounded-lg border-2 transition-all
              ${
                mode.disabled
                  ? 'border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed'
                  : 'border-primary bg-gray-800 hover:bg-gray-700 hover:border-accent cursor-pointer'
              }
            `}
          >
            <div className="text-5xl mb-4">{mode.icon}</div>
            <h2 className="text-2xl font-bold mb-2">{mode.title}</h2>
            <p className="text-gray-400">{mode.description}</p>
            {mode.disabled && (
              <span className="inline-block mt-3 text-sm text-gray-500">Coming Soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Landing