import { useGame } from '../context/GameContext'
import { formatDateShort } from '../utils/formatters'

function AllianceProposal() {
  const { state, dispatch } = useGame()

  if (state.pendingDecisions.length === 0) return null

  const allianceProposals = state.pendingDecisions.filter(d => d.type === 'alliance')

  if (allianceProposals.length === 0) return null

  const handleAccept = (country) => {
    dispatch({ type: 'ACCEPT_ALLIANCE', payload: { country } })
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'diplomacy',
        message: `Alliance formed with ${country}!`,
        timestamp: state.currentDate
      }
    })
  }

  const handleReject = (country) => {
    dispatch({ type: 'REJECT_ALLIANCE', payload: { country } })
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        type: 'diplomacy',
        message: `Alliance proposal from ${country} rejected`,
        timestamp: state.currentDate
      }
    })
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 max-w-md">
      {allianceProposals.map(proposal => (
        <div
          key={proposal.id}
          className="bg-purple-900/95 border-2 border-purple-500 rounded-lg p-5 shadow-lg mb-3 animate-pulse"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="text-3xl">🤝</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Alliance Proposal</h3>
              <p className="text-sm text-purple-200">
                {proposal.country} proposes a formal military alliance
              </p>
              <div className="text-xs text-purple-300 mt-1">
                {formatDateShort(proposal.timestamp)}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(proposal.country)}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold transition"
            >
              ✓ Accept
            </button>
            <button
              onClick={() => handleReject(proposal.country)}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-semibold transition"
            >
              ✗ Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllianceProposal