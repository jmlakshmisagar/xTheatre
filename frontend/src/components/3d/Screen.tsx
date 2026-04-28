import { useRef } from 'react'
import { Mesh, Vector2 } from 'three'

interface ScreenProps {
  width?: number
  height?: number
  curvature?: number
}

export default function Screen({ width = 20, height = 12, curvature = 1.1 }: ScreenProps) {
  const meshRef = useRef<Mesh>(null)

  const points = Array.from({ length: 20 }, (_, i) => 
    new Vector2((i / 19) * width - width / 2, Math.sin((i / 19) * Math.PI) * curvature)
  )

  return (
    <group position={[0, 0, -30]}>
      {/* Curved screen mesh */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <latheGeometry args={[points, 32, 0, Math.PI]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.7}
          roughness={0.3}
          emissive="#0a0a0a"
        />
      </mesh>

      {/* Screen frame */}
      <mesh position={[0, height / 2 + 0.5, 0]}>
        <boxGeometry args={[width + 2, 1, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <mesh position={[0, -(height / 2 + 0.5), 0]}>
        <boxGeometry args={[width + 2, 1, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Lighting for screen */}
      <pointLight position={[0, 0, 2]} intensity={1} color="#ffffff" distance={50} />
    </group>
  )
}
