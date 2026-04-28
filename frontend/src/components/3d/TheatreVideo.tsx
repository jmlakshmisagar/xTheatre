import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

interface TheatreVideoProps {
  videoUrl?: string
  autoplay?: boolean
}

export default function TheatreVideo({ videoUrl = '', autoplay = true }: TheatreVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scene } = useThree()

  useEffect(() => {
    if (!videoRef.current || !videoUrl) return

    const video = videoRef.current
    video.src = videoUrl
    video.autoplay = autoplay
    video.loop = true
    video.muted = false
    video.play().catch(err => console.log('Video autoplay prevented:', err))

    return () => {
      video.pause()
      video.src = ''
    }
  }, [videoUrl, autoplay])

  // In a real app, this would render the video as a texture on the screen geometry
  // For now, we'll just manage the video element for audio
  return null
}

export const useTheatreAudio = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Simulate video element for audio track
  useEffect(() => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    videoRef.current = video
    return () => {
      video.pause()
    }
  }, [])

  return videoRef
}
