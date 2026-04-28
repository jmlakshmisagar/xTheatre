import { useTheatreStore } from '../store/theatre'

export default function SeatInfo() {
  const selectedSeat = useTheatreStore((state) => state.selectedSeat)

  if (!selectedSeat) {
    return (
      <div className="glass p-4 text-center">
        <p className="text-sm text-gray-400">Select a seat to view details</p>
      </div>
    )
  }

  return (
    <div className="glass p-4 space-y-2">
      <h3 className="text-lg font-bold text-theatre-gold">
        {selectedSeat.row}{selectedSeat.number}
      </h3>
      <div className="space-y-1 text-sm">
        <p>Section: <span className="text-theatre-gold capitalize">{selectedSeat.section}</span></p>
        <p>Price: <span className="text-green-400">₹{selectedSeat.price}</span></p>
        <p>Position: ({selectedSeat.position.x.toFixed(1)}, {selectedSeat.position.y.toFixed(1)}, {selectedSeat.position.z.toFixed(1)})</p>
      </div>
      <button className="btn-primary w-full mt-4">
        Book This Seat
      </button>
    </div>
  )
}
