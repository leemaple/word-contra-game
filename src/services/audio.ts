import { SoundType } from '@/types'

interface AudioConfig {
  volume: number
  muted: boolean
}

class AudioService {
  private audioContext: AudioContext | null = null
  private sounds: Map<SoundType, AudioBuffer> = new Map()
  private config: AudioConfig = {
    volume: 0.7,
    muted: false
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.generateSounds()
    }
  }

  // Generate 8-bit style sounds using Web Audio API
  private generateSounds() {
    if (!this.audioContext) return

    // Generate shoot sound
    this.sounds.set(SoundType.SHOOT, this.generateShootSound())
    this.sounds.set(SoundType.EXPLOSION, this.generateExplosionSound())
    this.sounds.set(SoundType.HIT, this.generateHitSound())
    this.sounds.set(SoundType.HURT, this.generateHurtSound())
    this.sounds.set(SoundType.MENU_CLICK, this.generateClickSound())
    this.sounds.set(SoundType.ACHIEVEMENT, this.generateAchievementSound())
  }

  private generateShootSound(): AudioBuffer {
    const duration = 0.1
    const sampleRate = this.audioContext!.sampleRate
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate
      data[i] = Math.random() * 0.5 * Math.exp(-t * 30) * Math.sin(2 * Math.PI * 800 * t)
    }

    return buffer
  }

  private generateExplosionSound(): AudioBuffer {
    const duration = 0.5
    const sampleRate = this.audioContext!.sampleRate
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate
      data[i] = (Math.random() - 0.5) * Math.exp(-t * 3) * 0.8
    }

    return buffer
  }

  private generateHitSound(): AudioBuffer {
    const duration = 0.15
    const sampleRate = this.audioContext!.sampleRate
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate
      data[i] = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 20) * 0.5
    }

    return buffer
  }

  private generateHurtSound(): AudioBuffer {
    const duration = 0.2
    const sampleRate = this.audioContext!.sampleRate
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate
      const frequency = 150 - t * 200
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 10) * 0.6
    }

    return buffer
  }

  private generateClickSound(): AudioBuffer {
    const duration = 0.05
    const sampleRate = this.audioContext!.sampleRate
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate
      data[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 50) * 0.3
    }

    return buffer
  }

  private generateAchievementSound(): AudioBuffer {
    const duration = 0.5
    const sampleRate = this.audioContext!.sampleRate
    const buffer = this.audioContext!.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    const notes = [523.25, 659.25, 783.99, 1046.50] // C, E, G, High C

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate
      const noteIndex = Math.floor(t * 8) % notes.length
      const frequency = notes[noteIndex]
      data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 2) * 0.4
    }

    return buffer
  }

  public play(soundType: SoundType) {
    if (!this.audioContext || this.config.muted) return

    const buffer = this.sounds.get(soundType)
    if (!buffer) return

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    gainNode.gain.value = this.config.volume

    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    source.start(0)
  }

  public setVolume(volume: number) {
    this.config.volume = Math.max(0, Math.min(1, volume))
  }

  public setMuted(muted: boolean) {
    this.config.muted = muted
  }

  public toggleMute() {
    this.config.muted = !this.config.muted
  }
}

export const audioService = new AudioService()