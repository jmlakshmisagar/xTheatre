import { io, Socket } from 'socket.io-client'
import { useTheatreStore } from '../store/theatre'
import { useEffect, useRef } from 'react'

const SOCKET_URL = 'http://localhost:3001'

let socketInstance: Socket | null = null

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    })
  }
  return socketInstance
}

export const useRealtimeSync = () => {
  const socket = useRef<Socket | null>(null)
  const { updateRemoteUser, removeRemoteUser, lockSeat, unlockSeat, bookSeat } = useTheatreStore()

  useEffect(() => {
    socket.current = getSocket()

    // Listen for remote user connections
    socket.current.on('user:connected', (user) => {
      console.log('User connected:', user.id)
      updateRemoteUser({
        id: user.id,
        color: user.color,
        selectedSeat: user.selectedSeat || null
      })
    })

    // Listen for remote user disconnections
    socket.current.on('user:disconnected', (data) => {
      console.log('User disconnected:', data.userId)
      removeRemoteUser(data.userId)
    })

    // Listen for seat lock events
    socket.current.on('seat:locked', (data) => {
      console.log('Seat locked:', data.seatId)
      lockSeat(data.seatId, data.duration)
      updateRemoteUser({
        id: data.userId,
        color: data.userColor,
        selectedSeat: data.seatId
      })
    })

    // Listen for seat unlock events
    socket.current.on('seat:unlocked', (data) => {
      console.log('Seat unlocked:', data.seatId)
      unlockSeat(data.seatId)
    })

    // Listen for seat booked events
    socket.current.on('seat:booked', (data) => {
      console.log('Seat booked:', data.seatId)
      bookSeat(data.seatId)
    })

    // Listen for seat released events
    socket.current.on('seat:released', (data) => {
      console.log('Seat released:', data.seatId)
      unlockSeat(data.seatId)
    })

    // Get current users list
    socket.current.emit('get:users')

    return () => {
      // Don't disconnect on unmount - keep connection alive
    }
  }, [updateRemoteUser, removeRemoteUser, lockSeat, unlockSeat, bookSeat])

  return socket.current
}

export const emitSeatSelect = (seatId: string, duration: number = 300000) => {
  const socket = getSocket()
  socket.emit('seat:select', { seatId, duration })
}

export const emitSeatDeselect = (seatId: string) => {
  const socket = getSocket()
  socket.emit('seat:deselect', { seatId })
}

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
  }
}
