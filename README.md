# ALT/HISTORY ⚔️

> *"Rewrite the past. Shape the future."*

A premium alternate history grand strategy game where you lead nations through pivotal moments in history. Built with React, featuring Apple-inspired design and dynamic AI opponents.

![Version](https://img.shields.io/badge/version-1.0.0-gold)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff)

## ✨ Features

### 🎮 Core Gameplay
- **Three Historical Eras**: World War II, Cold War, Modern Era
- **Multiple Playable Nations**: Choose from 10+ countries per era
- **Dynamic Time System**: Control game speed (1x to 60x) with pause/resume
- **Historical Events**: 50+ authentic events with meaningful choices
- **Consequence-Driven**: Every decision affects treasury, morale, and relationships

### 🤖 Intelligent AI
- **Personality-Based Behavior**: Aggressive, Defensive, and Opportunistic AI types
- **Dynamic Decision Making**: AI responds to your strength, relationships, and actions
- **Diplomatic Interactions**: AI proposes alliances, declares wars, and reacts to your moves
- **Strategic Awareness**: AI adapts tactics based on game state

### 💼 Management Systems

**Economy**
- Adjust tax rates (affects income vs morale)
- Industrial investment for long-term growth
- Budget tracking with real-time balance updates

**Military**
- Recruit army, navy, and air force units
- Mobilization system (peacetime ↔ war footing)
- Readiness levels and force composition

**Research**
- 20+ technologies per era
- Active research with progress tracking
- Auto-completion when points are sufficient

**Diplomacy**
- Relationship tracking (-100 to +100)
- Send gifts, propose trades, form alliances
- Issue threats, declare wars, impose embargoes

### 🎨 Premium Design
- **Apple-Inspired UI**: Clean, minimalist, sophisticated
- **Glass Morphism Effects**: Backdrop blur and transparency
- **Smooth Animations**: Fade-ins, slide-ins, hover effects
- **Golden Accent Theme**: Premium gold highlights throughout
- **Inter Font**: Professional typography with ligature support

### 🎓 Historical Easter Eggs
- **Rotating Quotes**: Famous sayings from Sun Tzu, Napoleon, Patton, etc.
- **Fun Facts**: 20+ surprising historical tidbits
- **Contextual Events**: Historical accuracy with alternate outcomes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Arsh90120/ALT-history.git

# Navigate to project
cd ALT-history

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to play.

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 How to Play

1. **Choose Era**: Select WW2, Cold War, or Modern Era
2. **Pick Nation**: Choose from major and minor powers
3. **Manage Resources**: Balance treasury, military, morale, and research
4. **Make Decisions**: Respond to historical events with meaningful choices
5. **Shape History**: Your decisions create alternate timelines

### Controls

- **Pause/Resume**: Space bar or button
- **Speed Controls**: 1x, 5x, 10x, 30x speeds
- **Skip to Event**: Fast-forward to next major decision
- **Tab Navigation**: Switch between Economy, Military, Research, Diplomacy

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18.3 with Hooks
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with custom animations
- **State**: Context API with custom reducer
- **Build**: Vite 6.0

### Project Structure

```
ALT-history/
├── src/
│   ├── components/      # UI components
│   │   ├── management/  # Economy, Military, Research, Diplomacy tabs
│   │   ├── EventModal.jsx
│   │   ├── TimeControls.jsx
│   │   ├── GameStats.jsx
│   │   ├── HistoricalQuote.jsx
│   │   └── ...
│   ├── context/         # Game state management
│   │   ├── GameContext.jsx
│   │   └── gameReducer.js
│   ├── data/            # Game data (eras, countries, events)
│   ├── hooks/           # Custom hooks (useGameLoop, useAI)
│   ├── pages/           # Route pages (Home, Game)
│   ├── utils/           # Helper functions
│   └── index.css        # Global styles
├── public/
└── package.json
```

## 🎨 Design Philosophy

### Minimalism
Clean interfaces with purpose-driven elements. No clutter.

### Premium Feel
Glass effects, smooth transitions, golden accents. Feels expensive.

### Historical Authenticity
Events, quotes, and facts grounded in reality. Educational.

### Responsive Feedback
Every action has visible consequences. Player agency matters.

## 🔮 Future Enhancements

- [ ] Interactive world map with territory control
- [ ] Multiplayer support
- [ ] Custom scenario editor
- [ ] Achievement system
- [ ] More historical eras (Ancient Rome, Medieval, Renaissance)
- [ ] Sound effects and music
- [ ] Mobile optimization
- [ ] Save/load cloud sync

## 📜 Historical Events

Sample events included:
- **WW2**: Invasion of Poland, Fall of France, Pearl Harbor, D-Day
- **Cold War**: Cuban Missile Crisis, Vietnam War, Berlin Wall
- **Modern**: 9/11, Arab Spring, Tech Revolution

Each event offers meaningful choices with historical context.

## 🎓 Educational Value

ALT/HISTORY teaches:
- **Critical Thinking**: Evaluate complex decisions under pressure
- **Historical Knowledge**: Learn about pivotal moments and figures
- **Strategic Planning**: Balance resources and long-term goals
- **Diplomacy**: Understand international relations

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for educational purposes.

## 👏 Acknowledgments

- Historical events and quotes from public domain sources
- Inspired by Paradox Interactive's grand strategy games
- UI design influenced by Apple's design language

---

*"Those who cannot remember the past are condemned to repeat it."*  
— George Santayana

**[Play Now](https://alt-history.vercel.app)** | **[Report Bug](https://github.com/Arsh90120/ALT-history/issues)** | **[Request Feature](https://github.com/Arsh90120/ALT-history/issues)**
