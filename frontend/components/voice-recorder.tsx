"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

// Helper function to convert AudioBuffer to WAV Blob
function audioBufferToWav(audioBuffer: AudioBuffer): Blob {
  const length = audioBuffer.length
  const numberOfChannels = audioBuffer.numberOfChannels
  const sampleRate = audioBuffer.sampleRate
  const arrayBuffer = new ArrayBuffer(44 + length * 2)
  const view = new DataView(arrayBuffer)

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + length * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, 8000, true) // 8kHz sample rate
  view.setUint32(28, 8000 * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, length * 2, true)

  // Convert audio data
  const channelData = audioBuffer.getChannelData(0)
  let offset = 44
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]))
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
    offset += 2
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}
import { Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void
  onAudio?: (audioBlob: Blob) => void
  isListening: boolean
  setIsListening: (listening: boolean) => void
  className?: string
}

export function VoiceRecorder({ onTranscript, onAudio, isListening, setIsListening, className }: VoiceRecorderProps) {
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          onTranscript(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [onTranscript, setIsListening])

  // Start/stop audio recording
  useEffect(() => {
    if (!isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
      return
    }
    // Start recording
    navigator.mediaDevices.getUserMedia({ 
      audio: {
        sampleRate: 8000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true
      } 
    }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        // Create proper WAV blob
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        
        // Convert to WAV format using Web Audio API if possible
        if (window.AudioContext || (window as any).webkitAudioContext) {
          const reader = new FileReader()
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer
            const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)()
            
            audioContext.decodeAudioData(arrayBuffer)
              .then((audioBuffer: AudioBuffer) => {
                // Convert to WAV manually
                const wavBlob = audioBufferToWav(audioBuffer)
                if (onAudio) onAudio(wavBlob)
              })
              .catch(() => {
                // Fallback to original blob
                if (onAudio) onAudio(audioBlob)
              })
          }
          reader.readAsArrayBuffer(audioBlob)
        } else {
          // No Web Audio API support, use original blob
          if (onAudio) onAudio(audioBlob)
        }
        
        stream.getTracks().forEach(track => track.stop())
      }
      mediaRecorder.start()
    }).catch(err => {
      console.error("Audio recording error:", err)
    })
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isListening, onAudio])

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleListening}
      className={cn("h-8 w-8", isListening && "bg-red-500 text-white hover:bg-red-600 animate-pulse", className)}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}
