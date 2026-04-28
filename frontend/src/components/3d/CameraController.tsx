import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useTheatreStore } from '../../store/theatre'
import gsap from 'gsap'
import { Vector3 } from 'three'

const DEFAULT_POSITION = new Vector3(0, 5, 25)
const DEFAULT_TARGET = new Vector3(0, 2, 0)

export default function CameraController() {
  const { camera } = useThree()
  const selectedSeat = useTheatreStore((state) => state.selectedSeat)
  const cameraTargetRef = useRef(new Vector3(...DEFAULT_POSITION))
  const lookAtTargetRef = useRef(new Vector3(...DEFAULT_TARGET))

  useEffect(() => {
    if (!selectedSeat) {
      // Return to default view
      gsap.to(cameraTargetRef.current, {
        x: DEFAULT_POSITION.x,
        y: DEFAULT_POSITION.y,
        z: DEFAULT_POSITION.z,
        duration: 1.5,
        ease: 'power2.inOut',
      })
      gsap.to(lookAtTargetRef.current, {
        x: DEFAULT_TARGET.x,
        y: DEFAULT_TARGET.y,
        z: DEFAULT_TARGET.z,
        duration: 1.5,
        ease: 'power2.inOut',
      })
    } else {
      // Move camera to seat position
      // Position camera at seat with offset for viewing angle
      const seatPos = selectedSeat.position
      const cameraX = seatPos.x
      const cameraY = seatPos.y + 1.5 // Eye level above seat
      const cameraZ = seatPos.z + 3 // Back from seat

      gsap.to(cameraTargetRef.current, {
        x: cameraX,
        y: cameraY,
        z: cameraZ,
        duration: 1.5,
        ease: 'power2.inOut',
      })

      gsap.to(lookAtTargetRef.current, {
        x: 0,
        y: 1,
        z: -30, // Screen position
        duration: 1.5,
        ease: 'power2.inOut',
      })
    }
  }, [selectedSeat])

  useFrame(() => {
    camera.position.copy(cameraTargetRef.current)
    camera.lookAt(lookAtTargetRef.current)
  })

  return null
}
