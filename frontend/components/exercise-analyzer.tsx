"use client"

import { useState, useEffect } from "react"

interface ExerciseMetrics {
  repCount: number
  formAccuracy: number
  feedback: string
  status: "correct" | "incorrect" | "adjusting"
  phase: "up" | "down" | "hold"
}

interface ExerciseAnalyzerProps {
  exercise: string
  poseData: any
  onMetricsUpdate: (metrics: ExerciseMetrics) => void
}

export function ExerciseAnalyzer({ exercise, poseData, onMetricsUpdate }: ExerciseAnalyzerProps) {
  const [metrics, setMetrics] = useState<ExerciseMetrics>({
    repCount: 0,
    formAccuracy: 85,
    feedback: "Position yourself in the camera view to begin",
    status: "adjusting",
    phase: "up",
  })

  const [lastPhase, setLastPhase] = useState<"up" | "down" | "hold">("up")

  useEffect(() => {
    if (!poseData || !poseData.keypoints) return

    const analyzedMetrics = analyzeExercise(exercise, poseData.keypoints)

    // Count reps based on phase transitions
    if (lastPhase === "down" && analyzedMetrics.phase === "up") {
      analyzedMetrics.repCount = metrics.repCount + 1
    } else {
      analyzedMetrics.repCount = metrics.repCount
    }

    setLastPhase(analyzedMetrics.phase)
    setMetrics(analyzedMetrics)
    onMetricsUpdate(analyzedMetrics)
  }, [exercise, poseData, lastPhase, metrics.repCount, onMetricsUpdate])

  const analyzeExercise = (exerciseType: string, keypoints: any[]): ExerciseMetrics => {
    switch (exerciseType) {
      case "push-ups":
        return analyzePushUps(keypoints)
      case "squats":
        return analyzeSquats(keypoints)
      case "planks":
        return analyzePlanks(keypoints)
      case "lunges":
        return analyzeLunges(keypoints)
      case "burpees":
        return analyzeBurpees(keypoints)
      default:
        return metrics
    }
  }

  const analyzePushUps = (keypoints: any[]): ExerciseMetrics => {
    // Simulate push-up analysis
    const shoulderHeight = keypoints[1]?.y || 0
    const wristHeight = keypoints[5]?.y || 0
    const hipHeight = keypoints[7]?.y || 0

    const armAngle = Math.abs(shoulderHeight - wristHeight)
    const bodyAlignment = Math.abs(shoulderHeight - hipHeight)

    let feedback = ""
    let status: "correct" | "incorrect" | "adjusting" = "correct"
    let formAccuracy = 85
    let phase: "up" | "down" | "hold" = "up"

    if (armAngle > 100) {
      phase = "down"
      if (bodyAlignment < 50) {
        feedback = "Great form! Keep your body straight and push back up."
        status = "correct"
        formAccuracy = 95
      } else {
        feedback = "Keep your hips aligned with your shoulders."
        status = "incorrect"
        formAccuracy = 65
      }
    } else {
      phase = "up"
      if (bodyAlignment < 30) {
        feedback = "Perfect starting position! Lower your chest to the ground."
        status = "correct"
        formAccuracy = 90
      } else {
        feedback = "Straighten your body and engage your core."
        status = "adjusting"
        formAccuracy = 70
      }
    }

    return {
      repCount: metrics.repCount,
      formAccuracy,
      feedback,
      status,
      phase,
    }
  }

  const analyzeSquats = (keypoints: any[]): ExerciseMetrics => {
    // Simulate squat analysis
    const hipHeight = keypoints[7]?.y || 0
    const kneeHeight = keypoints[9]?.y || 0
    const ankleHeight = keypoints[11]?.y || 0

    const squatDepth = Math.abs(hipHeight - kneeHeight)
    const kneeAlignment = Math.abs(kneeHeight - ankleHeight)

    let feedback = ""
    let status: "correct" | "incorrect" | "adjusting" = "correct"
    let formAccuracy = 85
    let phase: "up" | "down" | "hold" = "up"

    if (squatDepth > 80) {
      phase = "down"
      if (kneeAlignment < 40) {
        feedback = "Excellent depth! Drive through your heels to stand up."
        status = "correct"
        formAccuracy = 95
      } else {
        feedback = "Keep your knees aligned over your toes."
        status = "incorrect"
        formAccuracy = 70
      }
    } else {
      phase = "up"
      feedback = "Lower down until your thighs are parallel to the ground."
      status = "adjusting"
      formAccuracy = 80
    }

    return {
      repCount: metrics.repCount,
      formAccuracy,
      feedback,
      status,
      phase,
    }
  }

  const analyzePlanks = (keypoints: any[]): ExerciseMetrics => {
    // Simulate plank analysis
    const shoulderHeight = keypoints[1]?.y || 0
    const hipHeight = keypoints[7]?.y || 0
    const ankleHeight = keypoints[11]?.y || 0

    const bodyAlignment = Math.abs(shoulderHeight - hipHeight) + Math.abs(hipHeight - ankleHeight)

    let feedback = ""
    let status: "correct" | "incorrect" | "adjusting" = "correct"
    let formAccuracy = 85

    if (bodyAlignment < 30) {
      feedback = "Perfect plank! Keep holding this position."
      status = "correct"
      formAccuracy = 95
    } else if (bodyAlignment < 60) {
      feedback = "Good form, but try to keep your body straighter."
      status = "adjusting"
      formAccuracy = 80
    } else {
      feedback = "Engage your core and align your body from head to heels."
      status = "incorrect"
      formAccuracy = 65
    }

    return {
      repCount: metrics.repCount,
      formAccuracy,
      feedback,
      status,
      phase: "hold",
    }
  }

  const analyzeLunges = (keypoints: any[]): ExerciseMetrics => {
    // Simulate lunge analysis
    const leftKnee = keypoints[9]?.y || 0
    const rightKnee = keypoints[10]?.y || 0
    const hipHeight = keypoints[7]?.y || 0

    const lungeDepth = Math.abs(Math.min(leftKnee, rightKnee) - hipHeight)
    const kneeBalance = Math.abs(leftKnee - rightKnee)

    let feedback = ""
    let status: "correct" | "incorrect" | "adjusting" = "correct"
    let formAccuracy = 85
    let phase: "up" | "down" | "hold" = "up"

    if (lungeDepth > 100) {
      phase = "down"
      if (kneeBalance < 30) {
        feedback = "Great lunge depth! Push back to starting position."
        status = "correct"
        formAccuracy = 95
      } else {
        feedback = "Keep both knees at 90-degree angles."
        status = "incorrect"
        formAccuracy = 70
      }
    } else {
      phase = "up"
      feedback = "Step forward and lower into a deeper lunge."
      status = "adjusting"
      formAccuracy = 80
    }

    return {
      repCount: metrics.repCount,
      formAccuracy,
      feedback,
      status,
      phase,
    }
  }

  const analyzeBurpees = (keypoints: any[]): ExerciseMetrics => {
    // Simulate burpee analysis (simplified)
    const shoulderHeight = keypoints[1]?.y || 0
    const hipHeight = keypoints[7]?.y || 0
    const handHeight = keypoints[5]?.y || 0

    const bodyPosition = shoulderHeight - hipHeight
    const handPosition = handHeight - shoulderHeight

    let feedback = ""
    let status: "correct" | "incorrect" | "adjusting" = "correct"
    let formAccuracy = 85
    let phase: "up" | "down" | "hold" = "up"

    if (Math.abs(bodyPosition) < 50 && handPosition > 100) {
      phase = "down"
      feedback = "Good plank position! Now jump your feet back in."
      status = "correct"
      formAccuracy = 90
    } else if (bodyPosition > 100) {
      phase = "up"
      feedback = "Jump up with your arms overhead!"
      status = "correct"
      formAccuracy = 95
    } else {
      phase = "down"
      feedback = "Drop into plank position, then jump back up."
      status = "adjusting"
      formAccuracy = 75
    }

    return {
      repCount: metrics.repCount,
      formAccuracy,
      feedback,
      status,
      phase,
    }
  }

  return null
}
