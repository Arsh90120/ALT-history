// Historical events and decision points

export const ww2Events = [
  {
    id: 'invasion_of_poland',
    title: 'Invasion of Poland',
    description: 'Germany has invaded Poland. The world watches as Europe descends into war.',
    date: '1939-09-01',
    triggerConditions: {
      date: '1939-09-01',
      countries: ['Germany', 'Poland', 'United Kingdom', 'France']
    },
    choices: [
      {
        id: 'declare_war',
        text: 'Declare war on Germany',
        consequences: {
          relationships: { 'Germany': -50 },
          morale: 10,
          warStatus: 'at_war'
        }
      },
      {
        id: 'stay_neutral',
        text: 'Remain neutral',
        consequences: {
          relationships: { 'Poland': -30, 'France': -20 },
          morale: -5
        }
      }
    ]
  },
  
  {
    id: 'fall_of_france',
    title: 'Fall of France',
    description: 'German forces have broken through French defenses. France is on the brink of collapse.',
    date: '1940-06-14',
    triggerConditions: {
      date: '1940-06-14',
      countries: ['France', 'United Kingdom', 'Germany']
    },
    choices: [
      {
        id: 'send_reinforcements',
        text: 'Send reinforcements to France',
        consequences: {
          treasury: -5000,
          military: { army: -100000 },
          relationships: { 'France': 20 }
        }
      },
      {
        id: 'evacuate',
        text: 'Evacuate forces from Dunkirk',
        consequences: {
          military: { army: -50000 },
          morale: -10,
          relationships: { 'France': -10 }
        }
      }
    ]
  },
  
  {
    id: 'pearl_harbor',
    title: 'Attack on Pearl Harbor',
    description: 'Japanese forces have launched a surprise attack on Pearl Harbor!',
    date: '1941-12-07',
    triggerConditions: {
      date: '1941-12-07',
      countries: ['United States', 'Japan']
    },
    choices: [
      {
        id: 'declare_war_japan',
        text: 'Declare war on Japan',
        consequences: {
          relationships: { 'Japan': -100 },
          morale: 30,
          warStatus: 'at_war',
          military: { ismobilized: true }
        }
      },
      {
        id: 'negotiate',
        text: 'Seek diplomatic solution',
        consequences: {
          morale: -40,
          relationships: { 'United Kingdom': -30 }
        }
      }
    ]
  },
  
  {
    id: 'operation_barbarossa',
    title: 'Operation Barbarossa',
    description: 'Germany has launched a massive invasion of the Soviet Union.',
    date: '1941-06-22',
    triggerConditions: {
      date: '1941-06-22',
      countries: ['Germany', 'Soviet Union']
    },
    choices: [
      {
        id: 'defend',
        text: 'Organize strategic defense',
        consequences: {
          military: { army: -500000 },
          morale: -20
        }
      },
      {
        id: 'counterattack',
        text: 'Launch immediate counteroffensive',
        consequences: {
          military: { army: -800000 },
          treasury: -10000,
          morale: -30
        }
      }
    ]
  },
  
  {
    id: 'd_day',
    title: 'D-Day: Operation Overlord',
    description: 'The time has come to launch the invasion of Normandy.',
    date: '1944-06-06',
    triggerConditions: {
      date: '1944-06-06',
      countries: ['United States', 'United Kingdom']
    },
    choices: [
      {
        id: 'launch_invasion',
        text: 'Launch the invasion',
        consequences: {
          military: { army: -50000 },
          treasury: -15000,
          morale: 20,
          relationships: { 'France': 30 }
        }
      },
      {
        id: 'delay',
        text: 'Delay for better conditions',
        consequences: {
          morale: -10,
          relationships: { 'Soviet Union': -15 }
        }
      }
    ]
  }
]

export function getEventsForEra(era) {
  const eventMap = {
    'World War II': ww2Events,
    'World War I': [],
    'Cold War': [],
    'Modern Era': []
  }
  
  return eventMap[era] || []
}

export function checkEventTriggers(currentDate, country, era) {
  const eraEvents = getEventsForEra(era)
  const currentDateObj = new Date(currentDate)
  
  return eraEvents.filter(event => {
    const eventDate = new Date(event.date)
    const isDateMatch = eventDate <= currentDateObj
    const isCountryInvolved = event.triggerConditions.countries.includes(country)
    
    return isDateMatch && isCountryInvolved
  })
}