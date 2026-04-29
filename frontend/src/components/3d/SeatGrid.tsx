import { useEffect } from 'react'
import { useTheatreStore } from '../../store/theatre'
import Seat from './Seat'
import layoutData from '../../data/layouts/imax-standard.json'
import { TheatreLayout } from '../../types/theatre'

export default function SeatGrid() {
  const { layout, currentLayoutId, setLayout, selectSeat, getAllSeats } = useTheatreStore()

  useEffect(() => {
    // Load layout based on currentLayoutId
    const loadLayout = async () => {
      try {
        let typedLayout: TheatreLayout = layoutData as TheatreLayout
        
        if (currentLayoutId === 'imax-large-01') {
          try {
            const layoutModule = await import('../../data/layouts/imax-large.json')
            typedLayout = (layoutModule as any).default || (layoutModule as unknown) as TheatreLayout
          } catch {
            typedLayout = layoutData as TheatreLayout
          }
        } else if (currentLayoutId === 'pvr-standard-01') {
          try {
            const layoutModule = await import('../../data/layouts/pvr-standard.json')
            typedLayout = (layoutModule as any).default || (layoutModule as unknown) as TheatreLayout
          } catch {
            typedLayout = layoutData as TheatreLayout
          }
        } else if (currentLayoutId === 'recliner-premium-01') {
          try {
            const layoutModule = await import('../../data/layouts/recliner-premium.json')
            typedLayout = (layoutModule as any).default || (layoutModule as unknown) as TheatreLayout
          } catch {
            typedLayout = layoutData as TheatreLayout
          }
        }
        typedLayout.rows.forEach(row => {
          row.seats.forEach(seat => {
            ;(seat as any).status = 'available'
          })
        })
        
        setLayout(typedLayout, currentLayoutId)
      } catch (error) {
        console.error('Failed to load layout:', error)
        // Fallback to standard layout
        const typedLayout = layoutData as TheatreLayout
        typedLayout.rows.forEach(row => {
          row.seats.forEach(seat => {
            ;(seat as any).status = 'available'
          })
        })
        setLayout(typedLayout, 'imax-standard-01')
      }
    }

    loadLayout()
  }, [currentLayoutId, setLayout])

  if (!layout) return null

  const allSeats = getAllSeats()

  return (
    <group>
      {allSeats.map((seat) => (
        <Seat
          key={seat.id}
          seat={seat}
          onSelect={(selectedSeat) => {
            selectSeat(selectedSeat)
          }}
        />
      ))}

      {/* Theatre floor/base */}
      <mesh position={[0, -1.5, 5]} receiveShadow>
        <boxGeometry args={[40, 0.2, 40]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>
    </group>
  )
}
