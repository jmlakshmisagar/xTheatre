import { useRef, useEffect, useState } from 'react'
import { Mesh, Vector2, VideoTexture, CanvasTexture } from 'three'

interface ScreenProps {
  width?: number
  height?: number
  curvature?: number
  videoUrl?: string
}

export default function Screen({ width = 20, height = 12, curvature = 1.1, videoUrl }: ScreenProps) {
  const meshRef = useRef<Mesh>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoTexture, setVideoTexture] = useState<VideoTexture | CanvasTexture | null>(null)

  useEffect(() => {
    // Create demo video with canvas (since we can't use external URLs in browser)
    const canvas = document.createElement('canvas')
    canvas.width = 1920
    canvas.height = 1080
    const ctx = canvas.getContext('2d')!

    // Draw a colorful gradient animation pattern
    let frameCount = 0
    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `hsl(${(frameCount * 0.5) % 360}, 80%, 50%)`)
      gradient.addColorStop(1, `hsl(${(frameCount * 0.5 + 180) % 360}, 80%, 50%)`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add some text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 80px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('🎬 IMAX Theatre', canvas.width / 2, canvas.height / 2 - 150)
      
      ctx.font = '40px Arial'
      ctx.fillText(`Frame: ${frameCount}`, canvas.width / 2, canvas.height / 2)
      
      // Add animated circles
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      for (let i = 0; i < 5; i++) {
        const x = canvas.width / 2 + Math.cos(frameCount * 0.02 + i) * 300
        const y = canvas.height / 2 + Math.sin(frameCount * 0.02 + i) * 200
        ctx.beginPath()
        ctx.arc(x, y, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      frameCount++
      requestAnimationFrame(animate)
    }

    animate()

    const texture = new CanvasTexture(canvas)
    texture.magFilter = 3
    setVideoTexture(texture)

    return () => {
      texture.dispose()
    }
  }, [])

  const points = Array.from({ length: 20 }, (_, i) => 
    new Vector2((i / 19) * width - width / 2, Math.sin((i / 19) * Math.PI) * curvature)
  )

  return (
    <group position={[0, 0, -30]}>
      {/* Curved screen mesh with video texture */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <latheGeometry args={[points, 32, 0, Math.PI]} />
        {videoTexture ? (
          <meshPhongMaterial
            map={videoTexture}
            emissive="#ffffff"
            emissiveIntensity={0.3}
            emissiveMap={videoTexture}
            shininess={0}
          />
        ) : (
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.7}
            roughness={0.3}
            emissive="#0a0a0a"
          />
        )}
      </mesh>

      {/* Screen frame - Top */}
      <mesh position={[0, height / 2 + 0.5, 0]}>
        <boxGeometry args={[width + 2, 1, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Screen frame - Bottom */}
      <mesh position={[0, -(height / 2 + 0.5), 0]}>
        <boxGeometry args={[width + 2, 1, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Screen frame - Left */}
      <mesh position={[-(width / 2 + 1), 0, 0]}>
        <boxGeometry args={[1, height + 2, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Screen frame - Right */}
      <mesh position={[width / 2 + 1, 0, 0]}>
        <boxGeometry args={[1, height + 2, 0.3]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Screen lighting */}
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#ffffff" distance={60} />
      <pointLight position={[-8, 4, 0]} intensity={0.8} color="#ffccaa" />
      <pointLight position={[8, 4, 0]} intensity={0.8} color="#ccaaff" />
    </group>
  )
}
