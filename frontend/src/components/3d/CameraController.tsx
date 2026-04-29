import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useTheatreStore } from '../../store/theatre'
import gsap from 'gsap'
import { Vector3 } from 'three'

const DEFAULT_POSITION = new Vector3(0, 5, 25)
const DEFAULT_TARGET = new Vector3(0, 2, 0)

export default function CameraController() {
  const { camera } = useThree()
  const selectedSeat = useTheatreStore((state) => state.selectedSeat)

  useEffect(() => {
    if (!selectedSeat) {
      // Return to default overview
      gsap.to(camera.position, {
        x: DEFAULT_POSITION.x,
        y: DEFAULT_POSITION.y,
        z: DEFAULT_POSITION.z,
        duration: 1.5,
        ease: 'power2.inOut',
      })
      
      const targetPos = { x: DEFAULT_TARGET.x, y: DEFAULT_TARGET.y, z: DEFAULT_TARGET.z }
      gsap.to(targetPos, {
        x: DEFAULT_TARGET.x,
        y: DEFAULT_TARGET.y,
        z: DEFAULT_TARGET.z,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(targetPos.x, targetPos.y, targetPos.z)
        }
      })
    } else {
      // Cinema-style view: Position camera at seat, looking at screen center
      const seatPos = selectedSeat.position
      
      // Position camera at seat height (eye level)
      const cameraX = seatPos.x
      const cameraY = seatPos.y + 0.3 // Eye level
      const cameraZ = seatPos.z // At seat position

      gsap.to(camera.position, {
        x: cameraX,
        y: cameraY,
        z: cameraZ,
        duration: 1.5,
        ease: 'power2.inOut',
      })

      // Look at screen center (where the video is)
      const targetPos = { x: 0, y: 3, z: -30 }
      gsap.to(targetPos, {
        x: 0,
        y: 3,
        z: -30,
        duration: 1.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(targetPos.x, targetPos.y, targetPos.z)
        }
      })
    }
  }, [selectedSeat, camera])

  return null
}
