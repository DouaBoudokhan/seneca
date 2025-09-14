"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface PosePoint {
  x: number
  y: number
  confidence: number
}

interface PoseDetection {
  keypoints: PosePoint[]
  score: number
}

interface PoseDetectorProps {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  onPoseDetected: (pose: PoseDetection) => void
  isActive: boolean
}

export function PoseDetector({ videoRef, canvasRef, onPoseDetected, isActive }: PoseDetectorProps) {
  const animationFrameRef = useRef<number>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isActive) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const detectPose = async () => {
      if (!videoRef.current || !canvasRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx || video.readyState !== 4) {
        animationFrameRef.current = requestAnimationFrame(detectPose)
        return
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Simulate pose detection (in a real app, you'd use TensorFlow.js or MediaPipe)
      const mockPose: PoseDetection = {
        keypoints: [
          // Head
          { x: canvas.width * 0.5, y: canvas.height * 0.15, confidence: 0.9 },
          // Shoulders
          { x: canvas.width * 0.4, y: canvas.height * 0.25, confidence: 0.85 },
          { x: canvas.width * 0.6, y: canvas.height * 0.25, confidence: 0.85 },
          // Elbows
          { x: canvas.width * 0.35, y: canvas.height * 0.4, confidence: 0.8 },
          { x: canvas.width * 0.65, y: canvas.height * 0.4, confidence: 0.8 },
          // Wrists
          { x: canvas.width * 0.3, y: canvas.height * 0.55, confidence: 0.75 },
          { x: canvas.width * 0.7, y: canvas.height * 0.55, confidence: 0.75 },
          // Hips
          { x: canvas.width * 0.45, y: canvas.height * 0.6, confidence: 0.9 },
          { x: canvas.width * 0.55, y: canvas.height * 0.6, confidence: 0.9 },
          // Knees
          { x: canvas.width * 0.43, y: canvas.height * 0.8, confidence: 0.85 },
          { x: canvas.width * 0.57, y: canvas.height * 0.8, confidence: 0.85 },
          // Ankles
          { x: canvas.width * 0.41, y: canvas.height * 0.95, confidence: 0.8 },
          { x: canvas.width * 0.59, y: canvas.height * 0.95, confidence: 0.8 },
        ],
        score: 0.85,
      }

      // Draw pose skeleton
      drawPoseSkeleton(ctx, mockPose.keypoints)

      // Call callback with pose data
      onPoseDetected(mockPose)

      animationFrameRef.current = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, videoRef, canvasRef, onPoseDetected])

  const drawPoseSkeleton = (ctx: CanvasRenderingContext2D, keypoints: PosePoint[]) => {
    // Draw connections between keypoints
    const connections = [
      [0, 1],
      [0, 2], // head to shoulders
      [1, 3],
      [2, 4], // shoulders to elbows
      [3, 5],
      [4, 6], // elbows to wrists
      [1, 7],
      [2, 8], // shoulders to hips
      [7, 8], // hip connection
      [7, 9],
      [8, 10], // hips to knees
      [9, 11],
      [10, 12], // knees to ankles
    ]

    // Draw connections
    ctx.strokeStyle = "#00ff88"
    ctx.lineWidth = 3
    connections.forEach(([start, end]) => {
      const startPoint = keypoints[start]
      const endPoint = keypoints[end]
      if (startPoint?.confidence > 0.5 && endPoint?.confidence > 0.5) {
        ctx.beginPath()
        ctx.moveTo(startPoint.x, startPoint.y)
        ctx.lineTo(endPoint.x, endPoint.y)
        ctx.stroke()
      }
    })

    // Draw keypoints
    keypoints.forEach((point, index) => {
      if (point.confidence > 0.5) {
        ctx.fillStyle = "#00ff88"
        ctx.beginPath()
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI)
        ctx.fill()

        // Draw confidence indicator
        ctx.fillStyle = "rgba(0, 255, 136, 0.3)"
        ctx.beginPath()
        ctx.arc(point.x, point.y, 12 * point.confidence, 0, 2 * Math.PI)
        ctx.fill()
      }
    })
  }

  return null
}
