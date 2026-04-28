import { useTheatreStore } from '../store/theatre'
import { getRecommendation } from '../utils/pricing'

export default function PricingDisplay() {
  const { selectedSeat, getSeatPrice, getSeatValue, currentDemand } = useTheatreStore()

  if (!selectedSeat) return null

  const price = getSeatPrice(selectedSeat)
  const value = getSeatValue(selectedSeat)
  const recommendation = getRecommendation(value)

  const demandText = currentDemand < 0.3 ? 'Low' : currentDemand < 0.7 ? 'Medium' : 'High'

  return (
    <div className="glass p-4 space-y-3">
      <h3 className="text-sm font-bold text-theatre-gold">Pricing Details</h3>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-gray-400">Base Price</div>
          <div className="text-lg font-bold text-green-400">₹{selectedSeat.price}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Dynamic Price</div>
          <div className="text-lg font-bold text-theatre-gold">₹{price}</div>
        </div>
      </div>

      <div className="bg-white/5 p-3 rounded">
        <div className="text-xs text-gray-400 mb-1">Value Score</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/10 rounded overflow-hidden">
            <div
              className={`h-full transition-all ${
                value >= 70
                  ? 'bg-green-500'
                  : value >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <div className="text-sm font-bold">{value}</div>
        </div>
        <div className="text-xs text-gray-400 mt-2">{recommendation}</div>
      </div>

      <div className="text-xs space-y-1 text-gray-300">
        <div>🔥 Demand: <span className="text-theatre-gold font-semibold">{demandText}</span></div>
        <div>📍 Section: <span className="capitalize text-theatre-gold">{selectedSeat.section}</span></div>
      </div>
    </div>
  )
}
