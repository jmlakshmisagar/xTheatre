import Scene from './components/3d/Scene'
import SeatInfo from './components/SeatInfo'
import PricingDisplay from './components/PricingDisplay'
import LayoutSelector from './components/LayoutSelector'
import RemoteUserIndicators from './components/RemoteUserIndicators'
import { useTheatreStore } from './store/theatre'
import { useRealtimeSync, emitSeatSelect, emitSeatDeselect } from './services/realtimeSync'
import { useEffect } from 'react'

export default function App() {
  const selectedSeat = useTheatreStore((state) => state.selectedSeat)
  const layout = useTheatreStore((state) => state.layout)
  const setDemand = useTheatreStore((state) => state.setDemand)

  // Initialize real-time sync
  useRealtimeSync()

  // Emit seat selection/deselection to other users
  useEffect(() => {
    if (selectedSeat) {
      emitSeatSelect(selectedSeat.id, 300000) // 5 min hold
    } else if (selectedSeat === null) {
      // Don't emit deselect here, only when explicitly cleared
    }
  }, [selectedSeat?.id])

  // Simulate demand changes (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      const newDemand = Math.random() * 0.3 + 0.4 // 0.4-0.7
      setDemand(newDemand)
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [setDemand])

  const unselectSeat = () => {
    if (selectedSeat) {
      emitSeatDeselect(selectedSeat.id)
    }
    useTheatreStore.setState({ selectedSeat: null })
  }

  return (
    <div className="w-full h-screen bg-theatre-dark text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-theatre-gold/30 bg-black/50 backdrop-blur-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-theatre-gold">Virtual IMAX Theatre</h1>
            {layout && <p className="text-xs text-gray-400 mt-1">{layout.name}</p>}
          </div>
          <div className="text-sm text-gray-400">
            {selectedSeat ? (
              <span>Selected: <span className="text-theatre-gold font-bold">{selectedSeat.row}{selectedSeat.number}</span></span>
            ) : (
              <span>Click a seat to view</span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3D Canvas */}
        <div className="flex-1">
          <Scene />
        </div>

        {/* Right sidebar - Controls & Info */}
        <div className="w-96 bg-black/60 border-l border-theatre-gold/30 p-4 overflow-y-auto space-y-4">
          {/* Layout Selector */}
          <LayoutSelector />

          {/* Seat Info */}
          <SeatInfo />

          {/* Pricing Display */}
          {selectedSeat && <PricingDisplay />}

          {/* Clear Selection */}
          {selectedSeat && (
            <button
              onClick={unselectSeat}
              className="btn-secondary w-full"
            >
              Clear Selection
            </button>
          )}

          {/* Remote Users */}
          <RemoteUserIndicators />

          {/* Theatre Info */}
          <div className="glass p-4">
            <h3 className="text-sm font-bold text-theatre-gold mb-2">Theatre Info</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              {layout && (
                <>
                  <li>• Capacity: {layout.totalCapacity} seats</li>
                  <li>• Rows: {layout.rows.length}</li>
                  <li>• Screen: {layout.screenSize.width}m × {layout.screenSize.height}m</li>
                </>
              )}
            </ul>
          </div>

          {/* Controls */}
          <div className="glass p-4">
            <h3 className="text-sm font-bold text-theatre-gold mb-2">Legend</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li><span className="inline-block w-2 h-2 bg-green-500 mr-2 rounded-full"></span>Available</li>
              <li><span className="inline-block w-2 h-2 bg-yellow-500 mr-2 rounded-full"></span>Selected</li>
              <li><span className="inline-block w-2 h-2 bg-red-500 mr-2 rounded-full"></span>Booked</li>
              <li><span className="inline-block w-2 h-2 bg-gray-500 mr-2 rounded-full"></span>Locked</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
