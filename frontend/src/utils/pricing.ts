// Pricing engine - calculates seat prices dynamically
import { Seat, TheatreLayout } from '../types/theatre'

export interface PricingFactors {
  basePrice: number
  distanceFromCenter: number
  viewingAngle: number
  section: string
  demand: number // 0-1 multiplier
}

export interface PricingMetrics {
  price: number
  value: number // 0-100 score
  recommendation: string
}

/**
 * Calculate distance from screen center
 */
export const calculateDistanceFromCenter = (
  seatPosition: { x: number; y: number; z: number },
  screenCenter: { x: number; y: number; z: number } = { x: 0, y: 0, z: -30 }
): number => {
  const dx = seatPosition.x - screenCenter.x
  const dy = seatPosition.y - screenCenter.y
  const dz = seatPosition.z - screenCenter.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Calculate viewing angle (0-1, 1 being perfect)
 */
export const calculateViewingAngle = (
  seatPosition: { x: number; y: number; z: number },
  screenCenter: { x: number; y: number; z: number } = { x: 0, y: 0, z: -30 }
): number => {
  const dx = Math.abs(seatPosition.x - screenCenter.x)
  const totalWidth = 28 // Max screen width
  const angle = 1 - (dx / (totalWidth / 2)) * 0.5 // -50% for extreme sides
  return Math.max(0.5, Math.min(1, angle))
}

/**
 * Calculate section multiplier
 */
const getSectionMultiplier = (section: string): number => {
  const multipliers: Record<string, number> = {
    'front': 0.8,
    'standard': 1.0,
    'premium': 1.4
  }
  return multipliers[section] || 1.0
}

/**
 * Dynamic pricing calculation
 */
export const calculateDynamicPrice = (
  seat: Seat,
  layout: TheatreLayout,
  demand: number = 0.5 // 0-1, current demand level
): number => {
  const basePrice = seat.price
  const distance = calculateDistanceFromCenter(seat.position, layout.screenPosition)
  const angle = calculateViewingAngle(seat.position, layout.screenPosition)
  const sectionMult = getSectionMultiplier(seat.section)
  const demandMult = 0.8 + demand * 0.4 // 0.8x to 1.2x

  // Distance factor: closer is better (0.9x to 1.1x)
  const avgDistance = 15
  const distanceFactor = 1 - Math.min(Math.abs(distance - avgDistance) / (avgDistance * 2), 0.2)

  // Angle factor: center is better
  const angleFactor = angle

  // Combined calculation
  const finalPrice = basePrice * sectionMult * distanceFactor * angleFactor * demandMult
  return Math.round(finalPrice)
}

/**
 * Calculate seat value score (0-100)
 * Higher = better value for money
 */
export const calculateValueScore = (
  seat: Seat,
  layout: TheatreLayout,
  demand: number = 0.5
): number => {
  const price = calculateDynamicPrice(seat, layout, demand)
  const distance = calculateDistanceFromCenter(seat.position, layout.screenPosition)
  const angle = calculateViewingAngle(seat.position, layout.screenPosition)

  // Quality metric (0-1)
  const quality = (angle * 0.6 + (1 - Math.min(distance / 30, 1)) * 0.4)

  // Value = quality / price (normalized to 0-100)
  const maxPrice = 1000
  const qualityPrice = quality * maxPrice
  const value = (qualityPrice / price) * 100

  return Math.min(Math.max(Math.round(value), 0), 100)
}

/**
 * Get recommendation for a seat
 */
export const getRecommendation = (valueScore: number): string => {
  if (valueScore >= 80) return '⭐ Excellent Value'
  if (valueScore >= 70) return '✓ Good Choice'
  if (valueScore >= 60) return '• Fair Value'
  if (valueScore >= 50) return '○ Average'
  return '✗ Below Average'
}

/**
 * Find best value seats
 */
export const findBestValueSeats = (
  layout: TheatreLayout,
  demand: number = 0.5,
  count: number = 5
): (Seat & { value: number; price: number })[] => {
  const allSeats = layout.rows.flatMap(row => row.seats)

  const seatsWithValue = allSeats.map(seat => ({
    ...seat,
    value: calculateValueScore(seat, layout, demand),
    price: calculateDynamicPrice(seat, layout, demand)
  }))

  return seatsWithValue
    .sort((a, b) => b.value - a.value)
    .slice(0, count)
}
