import { useEffect, useState } from 'react'

const quotes = [
  { text: "History doesn't repeat itself, but it often rhymes.", author: "Mark Twain" },
  { text: "In war, truth is the first casualty.", author: "Aeschylus" },
  { text: "The art of war is of vital importance to the State.", author: "Sun Tzu" },
  { text: "I came, I saw, I conquered.", author: "Julius Caesar" },
  { text: "Never interrupt your enemy when he is making a mistake.", author: "Napoleon Bonaparte" },
  { text: "In peace, sons bury their fathers. In war, fathers bury their sons.", author: "Herodotus" },
  { text: "The supreme art of war is to subdue the enemy without fighting.", author: "Sun Tzu" },
  { text: "Victorious warriors win first and then go to war.", author: "Sun Tzu" },
  { text: "All warfare is based on deception.", author: "Sun Tzu" },
  { text: "Appear weak when you are strong, and strong when you are weak.", author: "Sun Tzu" },
  { text: "Wars may be fought with weapons, but they are won by men.", author: "George S. Patton" },
  { text: "You may not be interested in war, but war is interested in you.", author: "Leon Trotsky" },
  { text: "The greatest victory is that which requires no battle.", author: "Sun Tzu" },
  { text: "Older men declare war. But it is youth that must fight and die.", author: "Herbert Hoover" },
]

function HistoricalQuote() {
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(randomQuote)

    const interval = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setQuote(randomQuote)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="historical-quote animate-fade-in">
      <p className="text-gray-300">"{quote.text}"</p>
      <p className="text-accent text-xs mt-2">— {quote.author}</p>
    </div>
  )
}

export default HistoricalQuote