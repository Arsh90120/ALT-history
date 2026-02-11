// Initial country data for different eras

const ww2Countries = {
  'Germany': {
    resources: {
      treasury: 50000,
      income: 2000,
      expenses: 1500,
      gdp: 100000
    },
    military: {
      army: 4500000,
      navy: 200,
      airForce: 3500,
      readiness: 80,
      ismobilized: true
    },
    researchRate: 15,
    initialRelationships: {
      'Italy': 75,
      'Japan': 60,
      'Soviet Union': -80,
      'United Kingdom': -90,
      'France': -85,
      'United States': -40
    }
  },
  'United States': {
    resources: {
      treasury: 150000,
      income: 5000,
      expenses: 2000,
      gdp: 300000
    },
    military: {
      army: 500000,
      navy: 400,
      airForce: 2000,
      readiness: 30,
      ismobilized: false
    },
    researchRate: 25,
    initialRelationships: {
      'United Kingdom': 80,
      'France': 70,
      'Soviet Union': 20,
      'Germany': -70,
      'Japan': -60,
      'Italy': -50
    }
  },
  'Soviet Union': {
    resources: {
      treasury: 40000,
      income: 3000,
      expenses: 2500,
      gdp: 150000
    },
    military: {
      army: 5000000,
      navy: 150,
      airForce: 4000,
      readiness: 60,
      ismobilized: true
    },
    researchRate: 12,
    initialRelationships: {
      'United States': 20,
      'United Kingdom': 40,
      'Germany': -90,
      'Japan': -70,
      'Italy': -80
    }
  },
  'United Kingdom': {
    resources: {
      treasury: 80000,
      income: 3000,
      expenses: 2000,
      gdp: 120000
    },
    military: {
      army: 1500000,
      navy: 500,
      airForce: 2500,
      readiness: 70,
      ismobilized: true
    },
    researchRate: 18,
    initialRelationships: {
      'United States': 80,
      'France': 75,
      'Soviet Union': 40,
      'Germany': -90,
      'Italy': -85,
      'Japan': -80
    }
  },
  'Japan': {
    resources: {
      treasury: 35000,
      income: 1500,
      expenses: 1200,
      gdp: 80000
    },
    military: {
      army: 2000000,
      navy: 300,
      airForce: 2000,
      readiness: 75,
      ismobilized: true
    },
    researchRate: 10,
    initialRelationships: {
      'Germany': 60,
      'Italy': 50,
      'United States': -60,
      'United Kingdom': -80,
      'Soviet Union': -70,
      'China': -90
    }
  },
  'Italy': {
    resources: {
      treasury: 25000,
      income: 1000,
      expenses: 900,
      gdp: 60000
    },
    military: {
      army: 1200000,
      navy: 150,
      airForce: 1000,
      readiness: 50,
      ismobilized: true
    },
    researchRate: 8,
    initialRelationships: {
      'Germany': 75,
      'Japan': 50,
      'United Kingdom': -85,
      'France': -80,
      'United States': -50
    }
  }
}

// Placeholder for other eras - will be expanded
const ww1Countries = {
  // WW1 data coming soon
}

const coldWarCountries = {
  // Cold War data coming soon
}

const modernCountries = {
  // Modern data coming soon
}

export function getInitialCountryData(era, country) {
  const eraMap = {
    'World War I': ww1Countries,
    'World War II': ww2Countries,
    'Cold War': coldWarCountries,
    'Modern Era': modernCountries
  }
  
  const eraData = eraMap[era] || ww2Countries
  return eraData[country] || ww2Countries['United States']
}