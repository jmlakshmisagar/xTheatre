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
      {/* ===== MAIN SEAT STRUCTURE ===== */}
      
      {/* Seat Cushion - Main Sitting Area */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={() => status === 'available' && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        position={[0, 0.15, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.55, 0.25, 0.65]} />
        <meshStandardMaterial
          color={STATUS_COLORS[status]}
          emissive={STATUS_EMISSIVE[status]}
          emissiveIntensity={status === 'selected' ? 0.8 : (hovered && status === 'available' ? 0.6 : 0.3)}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>

      {/* Backrest - Support for Back */}
      <mesh position={[0, 0.45, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.45, 0.15]} />
        <meshStandardMaterial
          color={STATUS_COLORS[status]}
          emissive={STATUS_EMISSIVE[status]}
          emissiveIntensity={status === 'selected' ? 0.6 : 0.2}
          metalness={0.15}
          roughness={0.7}
        />
      </mesh>

      {/* Headrest - Top of Backrest */}
      <mesh position={[0, 0.8, -0.15]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.2]} />
        <meshStandardMaterial
          color={STATUS_COLORS[status]}
          emissive={STATUS_EMISSIVE[status]}
          emissiveIntensity={status === 'selected' ? 0.5 : 0.15}
        />
      </mesh>

      {/* ===== ARMRESTS ===== */}
      
      {/* Left Armrest */}
      <mesh position={[-0.35, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.35, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Right Armrest */}
      <mesh position={[0.35, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 0.35, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* ===== CUP HOLDERS (Left Side) ===== */}
      
      {/* Left Cup Holder Outer Ring */}
      <mesh position={[-0.38, 0.2, -0.15]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Left Cup Holder Inner (Visual Depth) */}
      <mesh position={[-0.38, 0.24, -0.15]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Left Cup Holder Shadow */}
      <mesh position={[-0.38, 0.19, -0.15]}>
        <cylinderGeometry args={[0.065, 0.065, 0.01, 16]} />
        <meshStandardMaterial color="#000000" opacity={0.3} transparent />
      </mesh>

      {/* ===== CUP HOLDERS (Right Side) ===== */}
      
      {/* Right Cup Holder Outer Ring */}
      <mesh position={[0.38, 0.2, -0.15]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.08, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Right Cup Holder Inner */}
      <mesh position={[0.38, 0.24, -0.15]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Right Cup Holder Shadow */}
      <mesh position={[0.38, 0.19, -0.15]}>
        <cylinderGeometry args={[0.065, 0.065, 0.01, 16]} />
        <meshStandardMaterial color="#000000" opacity={0.3} transparent />
      </mesh>

      {/* ===== FOOD TRAY (Front Center) ===== */}
      
      {/* Food Tray - Flat Surface */}
      <mesh position={[0, 0.05, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.05, 0.35]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Food Tray Compartment 1 (Left) */}
      <mesh position={[-0.15, 0.08, 0.25]} castShadow>
        <boxGeometry args={[0.18, 0.06, 0.15]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Food Tray Compartment 2 (Center) */}
      <mesh position={[0, 0.08, 0.3]} castShadow>
        <boxGeometry args={[0.18, 0.06, 0.15]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Food Tray Compartment 3 (Right) */}
      <mesh position={[0.15, 0.08, 0.25]} castShadow>
        <boxGeometry args={[0.18, 0.06, 0.15]} />
        <meshStandardMaterial color="#0f0f0f" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* ===== SUPPORT LEGS ===== */}
      
      {/* Front Left Leg */}
      <mesh position={[-0.2, -0.3, 0.25]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Front Right Leg */}
      <mesh position={[0.2, -0.3, 0.25]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Back Left Leg */}
      <mesh position={[-0.2, -0.3, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Back Right Leg */}
      <mesh position={[0.2, -0.3, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* ===== CROSS BRACES (Structural Support) ===== */}
      
      {/* Front Cross Brace */}
      <mesh position={[0, -0.2, 0.25]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Back Cross Brace */}
      <mesh position={[0, -0.2, -0.3]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* ===== SELECTION INDICATOR ===== */}
      {status === 'selected' && (
        <mesh position={[0, 0.15, -0.5]}>
          <torusGeometry args={[0.4, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}

      {/* Hover Indicator */}
      {hovered && status === 'available' && (
        <mesh position={[0, 0.15, -0.5]}>
          <torusGeometry args={[0.38, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#4ade80"
            emissive="#22c55e"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  )
}
