import { create } from 'zustand'
import { TheatreLayout, Seat, SeatStatus } from '../types/theatre'
import { calculateDynamicPrice, calculateValueScore } from '../utils/pricing'

interface RemoteUser {
  id: string
  color: string
  selectedSeat: string | null
}

interface TheatreStore {
  // Layout & scene
  layout: TheatreLayout | null
  currentLayoutId: string
  
  // Seat state
  selectedSeat: Seat | null
  bookedSeats: Set<string>
  lockedSeats: Map<string, number> // seat id -> timestamp
  
  // Pricing & demand
  currentDemand: number // 0-1
  
  // User
  userId: string
  userColor: string
  remoteUsers: Map<string, RemoteUser>
  
  // Actions
  setLayout: (layout: TheatreLayout, layoutId: string) => void
  setLayoutId: (id: string) => void
  selectSeat: (seat: Seat | null) => void
  bookSeat: (seatId: string) => void
  lockSeat: (seatId: string, duration: number) => void
  unlockSeat: (seatId: string) => void
  setDemand: (level: number) => void
  
  // Seat queries
  getSeatStatus: (seatId: string) => SeatStatus
  getSeatPrice: (seat: Seat) => number
  getSeatValue: (seat: Seat) => number
  getAllSeats: () => Seat[]
  
  // Multi-user
  updateRemoteUser: (user: RemoteUser) => void
  removeRemoteUser: (userId: string) => void
  getRemoteUsers: () => RemoteUser[]
}

const generateUserId = () => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const useTheatreStore = create<TheatreStore>((set, get) => ({
  layout: null,
  currentLayoutId: 'imax-standard-01',
  selectedSeat: null,
  bookedSeats: new Set(),
  lockedSeats: new Map(),
  currentDemand: 0.5,
  userId: generateUserId(),
  userColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
  remoteUsers: new Map(),

  setLayout: (layout, layoutId) => set({ layout, currentLayoutId: layoutId }),
  
  setLayoutId: (id) => set({ currentLayoutId: id }),

  selectSeat: (seat) => set({ selectedSeat: seat }),

  bookSeat: (seatId) =>
    set((state) => ({
      bookedSeats: new Set(state.bookedSeats).add(seatId),
    })),

  lockSeat: (seatId, duration) =>
    set((state) => {
      const newLockedSeats = new Map(state.lockedSeats)
      newLockedSeats.set(seatId, Date.now() + duration)
      return { lockedSeats: newLockedSeats }
    }),

  unlockSeat: (seatId) =>
    set((state) => {
      const newLockedSeats = new Map(state.lockedSeats)
      newLockedSeats.delete(seatId)
      return { lockedSeats: newLockedSeats }
    }),

  setDemand: (level) => set({ currentDemand: Math.max(0, Math.min(1, level)) }),

  getSeatStatus: (seatId): SeatStatus => {
    const state = get()
    if (state.bookedSeats.has(seatId)) return 'booked'
    if (state.lockedSeats.has(seatId)) {
      const expiry = state.lockedSeats.get(seatId)!
      if (Date.now() < expiry) return 'locked'
      state.unlockSeat(seatId)
    }
    if (state.selectedSeat?.id === seatId) return 'selected'
    return 'available'
  },

  getSeatPrice: (seat) => {
    const state = get()
    if (!state.layout) return seat.price
    return calculateDynamicPrice(seat, state.layout, state.currentDemand)
  },

  getSeatValue: (seat) => {
    const state = get()
    if (!state.layout) return 50
    return calculateValueScore(seat, state.layout, state.currentDemand)
  },

  getAllSeats: () => {
    const state = get()
    if (!state.layout) return []
    return state.layout.rows.flatMap((row) => row.seats)
  },

  updateRemoteUser: (user) =>
    set((state) => {
      const newRemoteUsers = new Map(state.remoteUsers)
      newRemoteUsers.set(user.id, user)
      return { remoteUsers: newRemoteUsers }
    }),

  removeRemoteUser: (userId) =>
    set((state) => {
      const newRemoteUsers = new Map(state.remoteUsers)
      newRemoteUsers.delete(userId)
      return { remoteUsers: newRemoteUsers }
    }),

  getRemoteUsers: () => {
    const state = get()
    return Array.from(state.remoteUsers.values())
  },
}))
