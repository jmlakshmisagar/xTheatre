// Backend types
export interface User {
  id: string
  userId: string
  email?: string
  color: string
  selectedSeat?: string
  connectedAt: number
}

export interface BookingRecord {
  id: string
  userId: string
  seatId: string
  layoutId: string
  bookedAt: number
  expiresAt: number
  status: 'pending' | 'confirmed' | 'cancelled'
}

export interface SeatSnapshot {
  id: string
  status: 'available' | 'booked' | 'locked'
  lockedBy?: string
  lockedUntil?: number
}
