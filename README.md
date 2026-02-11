# ALT History - Alternate History Simulator

An interactive web-based game where you control nations through pivotal historical moments and watch alternate timelines unfold.

## Features

- **Multiple Eras**: Play through WW1, WW2, Cold War, or Modern scenarios
- **Dynamic Time System**: Event-driven gameplay with time acceleration
- **Domestic Management**: Manage economy, military, research, and public morale
- **Diplomacy**: Form alliances, negotiate peace, issue ultimatums
- **AI Opponents**: Nations with distinct personalities and strategies
- **Multiple Game Modes**: Single player, multiplayer, and observer mode

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js + React Leaflet
- **Real-time**: Socket.io (for multiplayer)
- **Backend**: Node.js + Express (coming soon)

## Project Structure

```
ALT-history/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Main page components
│   ├── game/           # Game logic and systems
│   ├── data/           # Historical data and scenarios
│   ├── utils/          # Helper functions
│   └── styles/         # Global styles
├── public/             # Static assets
└── server/             # Backend code (future)
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/Arsh90120/ALT-history.git
cd ALT-history
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open browser to `http://localhost:3000`

## Development Status

🚧 **In Active Development** 🚧

Current Phase: Project setup and core architecture

## Roadmap

- [x] Project structure and setup
- [ ] Landing page and era selection
- [ ] Time system and event framework
- [ ] Domestic management dashboard
- [ ] Diplomacy system
- [ ] Map visualization
- [ ] AI opponent logic
- [ ] WW2 scenario (first playable era)
- [ ] Additional eras (WW1, Cold War, Modern)
- [ ] Multiplayer support

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License