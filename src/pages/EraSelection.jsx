// Era selection page - choose historical period
import { useNavigate } from 'react-router-dom'

function EraSelection() {
  const navigate = useNavigate()

  const eras = [
    {
      title: 'World War I',
      period: '1914-1918',
      description: 'The Great War - Alliance chains and trench warfare',
      color: 'from-amber-900 to-amber-700'
    },
    {
      title: 'World War II',
      period: '1939-1945',
      description: 'Global conflict - Blitzkrieg, nukes, and multiple fronts',
      color: 'from-red-900 to-red-700'
    },
    {
      title: 'Cold War',
      period: '1947-1991',
      description: 'Nuclear brinksmanship - Proxy wars and ideological struggle',
      color: 'from-blue-900 to-blue-700'
    },
    {
      title: 'Modern Era',
      period: '2020s-Present',
      description: 'Contemporary tensions - Cyber warfare and rising powers',
      color: 'from-purple-900 to-purple-700'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-gray-400 hover:text-light transition"
      >
        ← Back
      </button>

      <h1 className="text-5xl font-bold mb-4">Choose Your Era</h1>
      <p className="text-gray-400 mb-12 text-center max-w-2xl">
        Each era offers unique challenges, technologies, and historical what-ifs
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {eras.map((era) => (
          <button
            key={era.title}
            onClick={() => navigate('/country', { state: { era: era.title } })}
            className={`
              p-8 rounded-lg bg-gradient-to-br ${era.color}
              hover:scale-105 transition-transform border-2 border-transparent
              hover:border-accent text-left
            `}
          >
            <h2 className="text-3xl font-bold mb-2">{era.title}</h2>
            <p className="text-sm text-gray-300 mb-3">{era.period}</p>
            <p className="text-gray-200">{era.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default EraSelection