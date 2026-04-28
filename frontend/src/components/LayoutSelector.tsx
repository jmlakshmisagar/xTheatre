import { useTheatreStore } from '../store/theatre'
import { AVAILABLE_LAYOUTS } from '../data/layouts'

export default function LayoutSelector() {
  const { currentLayoutId, setLayoutId } = useTheatreStore()

  const handleLayoutChange = async (layoutId: string) => {
    setLayoutId(layoutId)
    // Layout will be loaded in SeatGrid component via effect
  }

  return (
    <div className="glass-dark p-4">
      <h3 className="text-sm font-bold text-theatre-gold mb-3">Theatre Layout</h3>
      <div className="space-y-2">
        {AVAILABLE_LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => handleLayoutChange(layout.id)}
            className={`w-full p-2 text-left text-xs rounded transition-all ${
              currentLayoutId === layout.id
                ? 'bg-theatre-gold text-theatre-dark font-semibold'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <div className="font-medium">{layout.name}</div>
            <div className="text-xs opacity-70">{layout.seats} seats</div>
          </button>
        ))}
      </div>
    </div>
  )
}
