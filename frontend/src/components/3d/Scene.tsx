import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import Screen from './Screen'
import SeatGrid from './SeatGrid'
import CameraController from './CameraController'
import SpatialAudio from './SpatialAudio'

export default function Scene() {
  return (
    <Canvas
      gl={{
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 25]}
          fov={75}
          near={0.1}
          far={1000}
        />

        <Environment preset="studio" />

        {/* Main theatre elements */}
        <Screen />
        <SeatGrid />

        {/* Camera control system */}
        <CameraController />

        {/* Spatial audio simulation */}
        <SpatialAudio />

        {/* Scene lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 10, 0]} intensity={0.8} />
      </Suspense>
    </Canvas>
  )
}
