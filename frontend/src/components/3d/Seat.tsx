import { useRef, useState } from 'react'
import { Mesh, Vector3 } from 'three'
import { Seat as SeatType, SeatStatus } from '../../types/theatre'
import { useTheatreStore } from '../../store/theatre'
import { useFrame } from '@react-three/fiber'

interface SeatProps {
  seat: SeatType
  onSelect: (seat: SeatType) => void
}

const STATUS_COLORS: Record<SeatStatus, string> = {
  available: '#4ade80',
  selected: '#fbbf24',
  booked: '#ef4444',
  locked: '#6b7280',
}

export default function Seat({ seat, onSelect }: SeatProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const status = useTheatreStore((state) => state.getSeatStatus(seat.id))

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.lerp(new Vector3(1.15, 1.15, 1.15), 0.1)
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1)
    }
  })

  const handleClick = () => {
    if (status === 'available') {
      onSelect(seat)
    }
  }

  return (
    <group position={[seat.position.x, seat.position.y, seat.position.z]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={() => status === 'available' && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.6, 0.4, 0.8]} />
        <meshStandardMaterial
          color={STATUS_COLORS[status]}
          emissive={hovered && status === 'available' ? STATUS_COLORS[status] : '#000000'}
          emissiveIntensity={hovered && status === 'available' ? 0.5 : 0}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Seat back */}
      <mesh position={[0, 0.3, -0.3]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.2]} />
        <meshStandardMaterial color={STATUS_COLORS[status]} />
      </mesh>

      {/* Seat legs */}
      {[-0.2, 0.2].map((x) => (
        <mesh key={`leg-${x}`} position={[x, -0.3, 0.3]} castShadow>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
    </group>
  )
}
