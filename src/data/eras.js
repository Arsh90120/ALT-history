// Era-specific data and configurations

export const eras = {
  'World War I': {
    startDate: '1914-07-28T00:00:00Z',
    endDate: '1918-11-11T00:00:00Z',
    majorCountries: ['Germany', 'Austria-Hungary', 'Ottoman Empire', 'Russia', 'France', 'United Kingdom', 'Italy', 'United States'],
    technologies: [
      { id: 'ww1_tanks', name: 'Tank Warfare', cost: 100, description: 'Early armored vehicles' },
      { id: 'ww1_aircraft', name: 'Fighter Aircraft', cost: 80, description: 'Air superiority' },
      { id: 'ww1_gas', name: 'Chemical Weapons', cost: 60, description: 'Poison gas attacks' },
      { id: 'ww1_artillery', name: 'Heavy Artillery', cost: 70, description: 'Improved bombardment' }
    ],
    aiCountries: {}
  },
  
  'World War II': {
    startDate: '1939-09-01T00:00:00Z',
    endDate: '1945-09-02T00:00:00Z',
    majorCountries: ['Germany', 'Italy', 'Japan', 'Soviet Union', 'United Kingdom', 'United States', 'France', 'China'],
    technologies: [
      { id: 'ww2_radar', name: 'Radar Technology', cost: 150, description: 'Detect enemy aircraft and ships', effects: { airDefense: 25 } },
      { id: 'ww2_jets', name: 'Jet Engines', cost: 200, description: 'Superior air combat', effects: { airPower: 40 } },
      { id: 'ww2_tanks', name: 'Advanced Tanks', cost: 180, description: 'Heavy armor dominance', effects: { armyPower: 35 } },
      { id: 'ww2_rockets', name: 'Rocket Technology', cost: 220, description: 'V2 rockets and missiles', effects: { bombardment: 30 } },
      { id: 'ww2_sonar', name: 'Sonar Systems', cost: 140, description: 'Submarine detection', effects: { navalDefense: 25 } },
      { id: 'ww2_encryption', name: 'Code Breaking', cost: 160, description: 'Intelligence advantage', effects: { intel: 50 } },
      { id: 'ww2_penicillin', name: 'Penicillin Production', cost: 100, description: 'Reduce casualties', effects: { morale: 10 } },
      { id: 'ww2_nukes', name: 'Nuclear Weapons', cost: 500, description: 'Ultimate weapon', effects: { devastation: 1000 } }
    ],
    aiCountries: {
      'Germany': { personality: 'aggressive', strength: 85 },
      'Italy': { personality: 'opportunistic', strength: 45 },
      'Japan': { personality: 'aggressive', strength: 70 },
      'Soviet Union': { personality: 'defensive', strength: 80 },
      'United Kingdom': { personality: 'defensive', strength: 75 },
      'United States': { personality: 'opportunistic', strength: 90 },
      'France': { personality: 'defensive', strength: 50 }
    }
  },
  
  'Cold War': {
    startDate: '1947-03-12T00:00:00Z',
    endDate: '1991-12-26T00:00:00Z',
    majorCountries: ['United States', 'Soviet Union', 'China', 'United Kingdom', 'France', 'West Germany', 'East Germany'],
    technologies: [
      { id: 'cw_icbm', name: 'ICBMs', cost: 300, description: 'Intercontinental ballistic missiles' },
      { id: 'cw_satellites', name: 'Spy Satellites', cost: 250, description: 'Global surveillance' },
      { id: 'cw_computers', name: 'Computer Systems', cost: 200, description: 'Advanced computation' },
      { id: 'cw_stealth', name: 'Stealth Technology', cost: 350, description: 'Invisible to radar' }
    ],
    aiCountries: {}
  },
  
  'Modern Era': {
    startDate: '2020-01-01T00:00:00Z',
    endDate: '2030-12-31T00:00:00Z',
    majorCountries: ['United States', 'China', 'Russia', 'India', 'European Union', 'Japan', 'United Kingdom'],
    technologies: [
      { id: 'mod_ai', name: 'AI Warfare', cost: 400, description: 'Autonomous systems' },
      { id: 'mod_cyber', name: 'Cyber Weapons', cost: 300, description: 'Digital attacks' },
      { id: 'mod_hypersonic', name: 'Hypersonic Missiles', cost: 450, description: 'Unstoppable weapons' },
      { id: 'mod_space', name: 'Space Weapons', cost: 500, description: 'Orbital dominance' }
    ],
    aiCountries: {}
  }
}

export function getEraData(eraName) {
  return eras[eraName] || eras['World War II']
}