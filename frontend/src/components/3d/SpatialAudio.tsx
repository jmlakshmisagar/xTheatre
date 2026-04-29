import { useEffect, useRef } from 'react'
import { useTheatreStore } from '../../store/theatre'
import { calculateDistanceFromCenter } from '../../utils/pricing'

export default function SpatialAudio() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const pannerRef = useRef<StereoPannerNode | null>(null)

  const { selectedSeat, layout, currentDemand } = useTheatreStore()

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

    // Create theatre-style ambient sound mix
    oscillator.type = 'sine'
    oscillator.frequency.value = 120 // Low bass frequency for theatre
    gain.gain.value = 0 // Start silent

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
    const oscillator = oscillatorRef.current

    if (!gain || !panner || !oscillator) return

    // Audio volume based on proximity and demand
    const maxDistance = 40
    const distanceFactor = Math.max(0, 1 - distance / maxDistance)
    
    // Demand factor: higher demand = higher volume (more people watching = more excitement)
    const demandFactor = 0.3 + currentDemand * 0.5 // Range: 0.3 to 0.8
    
    const volumeLevel = distanceFactor * demandFactor * 0.25 // Final volume 0-0.25
    gain.gain.setValueAtTime(volumeLevel, audioContextRef.current.currentTime)

    // Dynamic frequency based on seat position and demand
    const baseFrequency = 120 + (currentDemand * 40) // 120-160 Hz
    oscillator.frequency.setValueAtTime(baseFrequency, audioContextRef.current.currentTime)

    // Left-right panning based on seat position
    const screenWidth = layout.screenSize.width
    const panValue = (selectedSeat.position.x / (screenWidth / 2)) * 0.8 // -0.8 to 0.8
    panner.pan.setValueAtTime(panValue, audioContextRef.current.currentTime)

  }, [selectedSeat, layout, currentDemand])

  // No visual output - just audio control
  return null
}
