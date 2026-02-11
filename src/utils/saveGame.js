// Local storage save/load system

const SAVE_KEY = 'alt_history_save'
const AUTO_SAVE_KEY = 'alt_history_autosave'

export function saveGame(state, name = 'Manual Save') {
  try {
    const saveData = {
      ...state,
      saveName: name,
      saveDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
    return { success: true, message: 'Game saved successfully!' }
  } catch (error) {
    console.error('Save failed:', error)
    return { success: false, message: 'Failed to save game' }
  }
}

export function loadGame() {
  try {
    const saveData = localStorage.getItem(SAVE_KEY)
    if (!saveData) {
      return { success: false, message: 'No save found' }
    }
    
    const parsedData = JSON.parse(saveData)
    return { success: true, data: parsedData }
  } catch (error) {
    console.error('Load failed:', error)
    return { success: false, message: 'Failed to load game' }
  }
}

export function autoSave(state) {
  try {
    const saveData = {
      ...state,
      saveName: 'Auto Save',
      saveDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData))
  } catch (error) {
    console.error('Auto-save failed:', error)
  }
}

export function loadAutoSave() {
  try {
    const saveData = localStorage.getItem(AUTO_SAVE_KEY)
    if (!saveData) return null
    
    return JSON.parse(saveData)
  } catch (error) {
    console.error('Auto-save load failed:', error)
    return null
  }
}

export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null
}

export function hasAutoSave() {
  return localStorage.getItem(AUTO_SAVE_KEY) !== null
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY)
  localStorage.removeItem(AUTO_SAVE_KEY)
}

export function getSaveInfo() {
  try {
    const saveData = localStorage.getItem(SAVE_KEY)
    if (!saveData) return null
    
    const parsed = JSON.parse(saveData)
    return {
      name: parsed.saveName,
      date: parsed.saveDate,
      country: parsed.playerCountry,
      era: parsed.era,
      daysPassed: parsed.daysPassed
    }
  } catch (error) {
    return null
  }
}

export function getAutoSaveInfo() {
  try {
    const saveData = localStorage.getItem(AUTO_SAVE_KEY)
    if (!saveData) return null
    
    const parsed = JSON.parse(saveData)
    return {
      name: 'Auto Save',
      date: parsed.saveDate,
      country: parsed.playerCountry,
      era: parsed.era,
      daysPassed: parsed.daysPassed
    }
  } catch (error) {
    return null
  }
}