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

const STATUS_EMISSIVE: Record<SeatStatus, string> = {
  available: '#2d8a3a',
  selected: '#f59e0b',
  booked: '#b91c1c',
  locked: '#374151',
}

export default function Seat({ seat, onSelect }: SeatProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const status = useTheatreStore((state) => state.getSeatStatus(seat.id))

  useFrame(() => {
    if (meshRef.current) {
      // Animate scale on hover/select
      let targetScale = 1
      if (hovered && status === 'available') {
        targetScale = 1.2
      } else if (status === 'selected') {
        targetScale = 1.15
      }
      meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  const handleClick = () => {
    if (status === 'available') {
      onSelect(seat)
    }
  }

  return (
    <group position={[seat.position.x, seat.position.y, seat.position.z]}>
      {/* Main seat cube */}
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
          emissive={STATUS_EMISSIVE[status]}
          emissiveIntensity={status === 'selected' ? 0.8 : (hovered && status === 'available' ? 0.6 : 0.3)}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* Seat back - higher back for recliner feel */}
      <mesh position={[0, 0.3, -0.35]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.15]} />
        <meshStandardMaterial
          color={STATUS_COLORS[status]}
          emissive={STATUS_EMISSIVE[status]}
          emissiveIntensity={status === 'selected' ? 0.6 : 0.2}
        />
      </mesh>

      {/* Armrests - left */}
      <mesh position={[-0.35, 0, -0.1]} castShadow>
        <boxGeometry args={[0.15, 0.35, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Armrests - right */}
      <mesh position={[0.35, 0, -0.1]} castShadow>
        <boxGeometry args={[0.15, 0.35, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Seat legs - front left */}
      <mesh position={[-0.2, -0.35, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Seat legs - front right */}
      <mesh position={[0.2, -0.35, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Seat legs - back left */}
      <mesh position={[-0.2, -0.35, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Seat legs - back right */}
      <mesh position={[0.2, -0.35, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Selection indicator ring */}
      {status === 'selected' && (
        <mesh position={[0, 0, -0.5]}>
          <torusGeometry args={[0.5, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  )
}
