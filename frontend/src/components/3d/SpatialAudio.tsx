import { useEffect, useRef } from 'react'
import { useTheatreStore } from '../../store/theatre'
import { calculateDistanceFromCenter } from '../../utils/pricing'

export default function SpatialAudio() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const pannerRef = useRef<StereoPannerNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)

  const { selectedSeat, layout } = useTheatreStore()

  useEffect(() => {
    // Initialize Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = audioContext

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const panner = audioContext.createStereoPanner()

    oscillatorRef.current = oscillator
    gainRef.current = gain
    pannerRef.current = panner

    oscillator.type = 'sine'
    oscillator.frequency.value = 440 // A4 note
    gain.gain.value = 0

    oscillator.connect(gain)
    gain.connect(panner)
    panner.connect(audioContext.destination)

    oscillator.start()

    return () => {
      try {
        oscillator.stop()
      } catch (e) {
        // Already stopped
      }
    }
  }, [])

  useEffect(() => {
    if (!selectedSeat || !layout || !audioContextRef.current) return

    const distance = calculateDistanceFromCenter(selectedSeat.position, layout.screenPosition)
    const gain = gainRef.current
    const panner = pannerRef.current

    if (!gain || !panner) return

    // Distance-based volume (closer to screen = louder)
    const maxDistance = 30
    const volumeLevel = Math.max(0, 1 - distance / maxDistance) * 0.3
    gain.gain.setValueAtTime(volumeLevel, audioContextRef.current.currentTime)

    // Left-right panning based on seat position
    const screenWidth = layout.screenSize.width
    const panValue = (selectedSeat.position.x / (screenWidth / 2)) * 0.5 // -0.5 to 0.5
    panner.pan.setValueAtTime(panValue, audioContextRef.current.currentTime)

  }, [selectedSeat, layout])

  // Just an audio control component - no visual output
  return null
}
