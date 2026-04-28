import { useTheatreStore } from '../../store/theatre'

export default function RemoteUserIndicators() {
  const { remoteUsers, getAllSeats } = useTheatreStore()

  if (remoteUsers.size === 0) {
    return (
      <div className="glass-dark p-4 text-center">
        <p className="text-xs text-gray-400">No other users online</p>
      </div>
    )
  }

  const remoteSeatSelections = Array.from(remoteUsers.values())
    .filter(user => user.selectedSeat)
    .map(user => {
      const allSeats = getAllSeats()
      const seat = allSeats.find(s => s.id === user.selectedSeat)
      return { user, seat }
    })

  return (
    <div className="glass-dark p-4">
      <h3 className="text-sm font-bold text-theatre-gold mb-3">
        Other Users <span className="text-xs text-gray-400">({remoteUsers.size})</span>
      </h3>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {remoteSeatSelections.map(({ user, seat }) => (
          <div key={user.id} className="flex items-center gap-2 p-2 bg-white/5 rounded text-xs">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: user.color }}
            />
            <div className="flex-1 truncate">
              <div className="font-medium">{user.id.substring(0, 8)}...</div>
              {seat && (
                <div className="text-gray-400">{seat.row}{seat.number}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
