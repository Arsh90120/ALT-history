import { useEffect, useState } from 'react'

const facts = [
  "The shortest war in history lasted 38 minutes (Anglo-Zanzibar War, 1896)",
  "Napoleon was once attacked by a horde of rabbits during a hunt",
  "The 100 Years' War actually lasted 116 years (1337-1453)",
  "Ancient Rome had a 4-story shopping mall with 150 shops",
  "Cleopatra lived closer in time to the Moon landing than to the Great Pyramid's construction",
  "Oxford University is older than the Aztec Empire",
  "Vikings never wore horned helmets in battle",
  "Julius Caesar was once kidnapped by pirates and later had them crucified",
  "The Eiffel Tower can be 15 cm taller during summer due to thermal expansion",
  "Ancient Egyptians used slabs of stone as pillows",
  "The longest recorded sniper kill was 3,540 meters (2.2 miles)",
  "Swiss soldiers still carry Swiss Army knives as standard equipment",
  "Byzantine Empire lasted over 1,000 years (330-1453 AD)",
  "Turkeys were almost the national bird of the United States",
  "The first person convicted of speeding was going 8 mph in 1896",
  "Genghis Khan's empire was the largest contiguous land empire in history",
]

function HistoricalFact({ className = '' }) {
  const [fact, setFact] = useState(facts[0])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)]
    setFact(randomFact)

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        const randomFact = facts[Math.floor(Math.random() * facts.length)]
        setFact(randomFact)
        setIsVisible(true)
      }, 300)
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`text-xs text-gray-500 italic transition-opacity duration-300 ${isVisible ? 'opacity-70' : 'opacity-0'} ${className}`}>
      💡 {fact}
    </div>
  )
}

export default HistoricalFact