// Theatre Configuration Types
export interface Seat {
  id: string
  row: string
  number: number
  section: SeatSection
  status: SeatStatus
  price: number
  position: {
    x: number
    y: number
    z: number
  }
}

export interface SeatRow {
  id: string
  name: string
  seats: Seat[]
  elevation: number
}

export interface TheatreLayout {
  id: string
  name: string
  totalCapacity: number
  rows: SeatRow[]
  screenPosition: {
    x: number
    y: number
    z: number
  }
  screenSize: {
    width: number
    height: number
  }
  curvature: number
}

export type SeatStatus = 'available' | 'selected' | 'booked' | 'locked'
export type SeatSection = 'premium' | 'standard' | 'front'

export interface TheatreState {
  layout: TheatreLayout | null
  selectedSeat: Seat | null
  highlightedSeats: Seat[]
  userColor: string
}

export interface CameraConfig {
  defaultPosition: [number, number, number]
  defaultTarget: [number, number, number]
  fov: number
  near: number
  far: number
}
