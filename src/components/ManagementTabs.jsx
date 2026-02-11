import { useState } from 'react'
import EconomyTab from './management/EconomyTab'
import MilitaryTab from './management/MilitaryTab'
import ResearchTab from './management/ResearchTab'
import DiplomacyTab from './management/DiplomacyTab'

function ManagementTabs() {
  const [activeTab, setActiveTab] = useState('economy')

  const tabs = [
    { id: 'economy', label: 'Economy', icon: '💰' },
    { id: 'military', label: 'Military', icon: '⚔️' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'diplomacy', label: 'Diplomacy', icon: '🤝' }
  ]

  return (
    <div className="bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b-2 border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-4 px-6 font-semibold transition flex items-center justify-center gap-2
              ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-accent border-b-2 border-accent'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-light'
              }
            `}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'economy' && <EconomyTab />}
        {activeTab === 'military' && <MilitaryTab />}
        {activeTab === 'research' && <ResearchTab />}
        {activeTab === 'diplomacy' && <DiplomacyTab />}
      </div>
    </div>
  )
}

export default ManagementTabs