import { useState, useRef, useCallback } from 'react'

interface RepCounterState {
  count: number
  isInDownPosition: boolean
  lastPositionTime: number
  minHoldTime: number // Minimum time to hold position (ms)
}

export const useRepCounter = (currentExercise: string) => {
  const [repState, setRepState] = useState<RepCounterState>({
    count: 0,
    isInDownPosition: false,
    lastPositionTime: Date.now(),
    minHoldTime: 500 // 500ms minimum hold
  })

  const countRep = useCallback((landmarks: any[]) => {
    if (!landmarks || landmarks.length === 0) return repState.count

    const currentTime = Date.now()
    let isDown = false

    switch (currentExercise) {
      case 'push-ups':
        isDown = isPushUpDown(landmarks)
        break
      case 'squats':
        isDown = isSquatDown(landmarks)
        break
      case 'lunges':
        isDown = isLungeDown(landmarks)
        break
      default:
        return repState.count
    }

    setRepState(prev => {
      // Check if position changed and enough time has passed
      if (isDown !== prev.isInDownPosition && 
          currentTime - prev.lastPositionTime > prev.minHoldTime) {
        
        // Count rep when coming up from down position
        const newCount = !isDown && prev.isInDownPosition ? prev.count + 1 : prev.count
        
        return {
          ...prev,
          count: newCount,
          isInDownPosition: isDown,
          lastPositionTime: currentTime
        }
      }
      
      return prev
    })

    return repState.count
  }, [currentExercise, repState])

  const resetCount = () => {
    setRepState(prev => ({ ...prev, count: 0, isInDownPosition: false }))
  }

  return { count: repState.count, countRep, resetCount }
}

function isPushUpDown(landmarks: any[]): boolean {
  const leftElbow = landmarks[13]
  const rightElbow = landmarks[14]
  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftWrist = landmarks[15]
  const rightWrist = landmarks[16]

  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist)
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist)
  
  // Consider it "down" when elbows are bent significantly
  return leftArmAngle < 120 && rightArmAngle < 120
}

function isSquatDown(landmarks: any[]): boolean {
  const leftHip = landmarks[23]
  const leftKnee = landmarks[25]
  const leftAnkle = landmarks[27]
  
  const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  
  // Consider it "down" when knee is bent significantly
  return kneeAngle < 120
}

function isLungeDown(landmarks: any[]): boolean {
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)
  
  // Consider it "down" when front knee is bent significantly
  return Math.min(leftKneeAngle, rightKneeAngle) < 120
}

function calculateAngle(a: any, b: any, c: any): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs(radians * 180.0 / Math.PI)
  if (angle > 180.0) {
    angle = 360 - angle
  }
  return angle
}