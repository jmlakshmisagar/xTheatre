import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import layoutData from './data/layouts/imax-standard.json'
import { User, BookingRecord, SeatSnapshot } from './types'

const app: Express = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

// HTTP Server with Socket.IO
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
})

// In-memory stores
const connectedUsers = new Map<string, User>()
const bookings = new Map<string, BookingRecord>()
const seatLocks = new Map<string, { userId: string; expiresAt: number }>()
const allSeats = new Map<string, SeatSnapshot>()

// Initialize seat snapshots
const initializeSeats = () => {
  allSeats.clear()
  layoutData.rows.forEach(row => {
    row.seats.forEach(seat => {
      allSeats.set(seat.id, {
        id: seat.id,
        status: 'available'
      })
    })
  })
}

initializeSeats()

// ==================== REST API ====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    users: connectedUsers.size,
    bookings: bookings.size
  })
})

// Get theatre layout
app.get('/api/theatre/layout', (req: Request, res: Response) => {
  res.json(layoutData)
})

// Get all layouts (in real app, from database)
app.get('/api/theatre/layouts', (req: Request, res: Response) => {
  const layouts = [
    { id: 'imax-standard-01', name: 'IMAX Standard', seats: 15 },
    { id: 'imax-large-01', name: 'IMAX Large', seats: 28 },
    { id: 'pvr-standard-01', name: 'PVR Standard', seats: 18 },
    { id: 'recliner-premium-01', name: 'Recliner Premium', seats: 20 }
  ]
  res.json(layouts)
})

// Get seat status
app.get('/api/theatre/seats', (req: Request, res: Response) => {
  const seats = Array.from(allSeats.values()).map(seat => ({
    ...seat,
    bookedCount: Array.from(bookings.values()).filter(b => b.seatId === seat.id && b.status === 'confirmed').length
  }))
  res.json(seats)
})

// Lock a seat (temporary hold)
app.post('/api/theatre/seats/:seatId/lock', (req: Request, res: Response) => {
  const { seatId } = req.params
  const { userId, duration = 300000 } = req.body // 5 min default

  const seat = allSeats.get(seatId)
  if (!seat) {
    return res.status(404).json({ error: 'Seat not found' })
  }

  if (seat.status === 'booked') {
    return res.status(409).json({ error: 'Seat already booked' })
  }

  if (seatLocks.has(seatId)) {
    const lock = seatLocks.get(seatId)!
    if (Date.now() < lock.expiresAt) {
      return res.status(409).json({ error: 'Seat locked by another user' })
    }
  }

  seatLocks.set(seatId, {
    userId,
    expiresAt: Date.now() + duration
  })

  seat.status = 'locked'
  seat.lockedBy = userId
  seat.lockedUntil = Date.now() + duration

  io.emit('seat:locked', { seatId, userId, duration })

  res.json({ success: true, seatId, expiresAt: seat.lockedUntil })
})

// Unlock a seat
app.post('/api/theatre/seats/:seatId/unlock', (req: Request, res: Response) => {
  const { seatId } = req.params
  const { userId } = req.body

  const seat = allSeats.get(seatId)
  if (!seat) {
    return res.status(404).json({ error: 'Seat not found' })
  }

  const lock = seatLocks.get(seatId)
  if (lock && lock.userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  seatLocks.delete(seatId)
  seat.status = 'available'
  seat.lockedBy = undefined
  seat.lockedUntil = undefined

  io.emit('seat:unlocked', { seatId })

  res.json({ success: true, seatId })
})

// Book a seat
app.post('/api/theatre/book', (req: Request, res: Response) => {
  const { userId, seatId, layoutId } = req.body

  const seat = allSeats.get(seatId)
  if (!seat) {
    return res.status(404).json({ error: 'Seat not found' })
  }

  if (seat.status === 'booked') {
    return res.status(409).json({ error: 'Seat already booked' })
  }

  const lock = seatLocks.get(seatId)
  if (lock && lock.userId !== userId) {
    return res.status(409).json({ error: 'Seat locked by another user' })
  }

  const bookingId = uuidv4()
  const booking: BookingRecord = {
    id: bookingId,
    userId,
    seatId,
    layoutId,
    bookedAt: Date.now(),
    expiresAt: Date.now() + 86400000, // 24 hours
    status: 'confirmed'
  }

  bookings.set(bookingId, booking)
  seatLocks.delete(seatId)

  seat.status = 'booked'
  seat.lockedBy = userId
  seat.lockedUntil = booking.expiresAt

  io.emit('seat:booked', { seatId, userId, bookingId })

  res.json({
    success: true,
    booking,
    message: `Seat ${seatId} booked successfully`
  })
})

// Cancel booking
app.post('/api/theatre/bookings/:bookingId/cancel', (req: Request, res: Response) => {
  const { bookingId } = req.params
  const { userId } = req.body

  const booking = bookings.get(bookingId)
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' })
  }

  if (booking.userId !== userId) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ error: 'Already cancelled' })
  }

  booking.status = 'cancelled'
  bookings.set(bookingId, booking)

  const seat = allSeats.get(booking.seatId)
  if (seat) {
    seat.status = 'available'
    seat.lockedBy = undefined
    seat.lockedUntil = undefined
  }

  io.emit('seat:released', { seatId: booking.seatId })

  res.json({ success: true, message: 'Booking cancelled' })
})

// Get user bookings
app.get('/api/bookings/:userId', (req: Request, res: Response) => {
  const { userId } = req.params
  const userBookings = Array.from(bookings.values()).filter(b => b.userId === userId)
  res.json(userBookings)
})

// ==================== SOCKET.IO ====================

io.on('connection', (socket: Socket) => {
  const userId = socket.id
  console.log(`[Connected] User: ${userId}`)

  // Register user
  const user: User = {
    id: socket.id,
    userId,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    connectedAt: Date.now()
  }
  connectedUsers.set(socket.id, user)

  // Broadcast user connected
  io.emit('user:connected', user)

  // Listen for seat selection
  socket.on('seat:select', (data: { seatId: string; duration?: number }) => {
    const { seatId, duration = 300000 } = data
    user.selectedSeat = seatId

    const lock = {
      userId,
      expiresAt: Date.now() + duration
    }
    seatLocks.set(seatId, lock)

    const seat = allSeats.get(seatId)
    if (seat) {
      seat.status = 'locked'
      seat.lockedBy = userId
      seat.lockedUntil = lock.expiresAt
    }

    socket.broadcast.emit('seat:locked', {
      seatId,
      userId,
      userColor: user.color,
      duration
    })
  })

  // Listen for seat deselection
  socket.on('seat:deselect', (data: { seatId: string }) => {
    const { seatId } = data
    user.selectedSeat = undefined

    if (seatLocks.get(seatId)?.userId === userId) {
      seatLocks.delete(seatId)
      const seat = allSeats.get(seatId)
      if (seat && seat.status === 'locked') {
        seat.status = 'available'
        seat.lockedBy = undefined
        seat.lockedUntil = undefined
      }
    }

    socket.broadcast.emit('seat:unlocked', { seatId })
  })

  // Get current users
  socket.on('get:users', () => {
    socket.emit('users:list', Array.from(connectedUsers.values()))
  })

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Disconnected] User: ${userId}`)

    // Release locked seats
    if (user.selectedSeat) {
      seatLocks.delete(user.selectedSeat)
      const seat = allSeats.get(user.selectedSeat)
      if (seat && seat.status === 'locked' && seat.lockedBy === userId) {
        seat.status = 'available'
        seat.lockedBy = undefined
        seat.lockedUntil = undefined
      }
    }

    connectedUsers.delete(socket.id)
    io.emit('user:disconnected', { userId })
  })
})

// Clean up expired locks periodically
setInterval(() => {
  const now = Date.now()
  for (const [seatId, lock] of seatLocks.entries()) {
    if (now > lock.expiresAt) {
      seatLocks.delete(seatId)
      const seat = allSeats.get(seatId)
      if (seat && seat.status === 'locked') {
        seat.status = 'available'
        seat.lockedBy = undefined
        seat.lockedUntil = undefined
      }
    }
  }
}, 60000) // Every minute

// Error handling
app.use((err: any, req: Request, res: Response) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`🎬 Theatre server running on port ${PORT}`)
  console.log(`📍 API: http://localhost:${PORT}/api`)
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`)
})
