import { useEffect, useRef, useState, useCallback } from 'react'
import { Pose, Results } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { POSE_CONNECTIONS } from '@mediapipe/pose'

interface PoseResults {
  landmarks: any[]
  worldLandmarks: any[]
  visibility: number[]
}

interface ExerciseAnalysis {
  reps: number
  accuracy: number
  feedback: string
  status: "correct" | "incorrect" | "adjusting"
}

export const useMediaPipePose = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  currentExercise: string,
  isRecording: boolean
) => {
  const poseRef = useRef<Pose | null>(null)
  const cameraRef = useRef<Camera | null>(null)
  const [poseResults, setPoseResults] = useState<PoseResults | null>(null)
  const [exerciseAnalysis, setExerciseAnalysis] = useState<ExerciseAnalysis>({
    reps: 0,
    accuracy: 85,
    feedback: "Position yourself in front of the camera to start",
    status: "adjusting"
  })

  // Exercise-specific pose analysis
  const analyzePose = useCallback((landmarks: any[]) => {
    if (!landmarks || landmarks.length === 0) return

    switch (currentExercise) {
      case 'push-ups':
        return analyzePushUps(landmarks)
      case 'squats':
        return analyzeSquats(landmarks)
      case 'planks':
        return analyzePlanks(landmarks)
      case 'lunges':
        return analyzeLunges(landmarks)
      case 'burpees':
        return analyzeBurpees(landmarks)
      default:
        return exerciseAnalysis
    }
  }, [currentExercise, exerciseAnalysis])

  // Initialize MediaPipe Pose
  useEffect(() => {
    if (!isRecording) return

    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      }
    })

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })

    pose.onResults((results: Results) => {
      if (results.poseLandmarks) {
        setPoseResults({
          landmarks: results.poseLandmarks,
          worldLandmarks: results.poseWorldLandmarks || [],
          visibility: results.poseLandmarks.map(landmark => landmark.visibility || 1)
        })

        // Analyze pose for current exercise
        const analysis = analyzePose(results.poseLandmarks)
        if (analysis) {
          setExerciseAnalysis(analysis)
        }

        // Draw pose on canvas
        drawPose(results)
      }
    })

    poseRef.current = pose

    return () => {
      if (poseRef.current) {
        poseRef.current.close()
      }
    }
  }, [isRecording, analyzePose])

  // Setup camera when video is ready
  useEffect(() => {
    if (!isRecording || !videoRef.current || !poseRef.current) return

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (poseRef.current && videoRef.current) {
          await poseRef.current.send({ image: videoRef.current })
        }
      },
      width: 640,
      height: 480
    })

    camera.start()
    cameraRef.current = camera

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop()
      }
    }
  }, [isRecording, videoRef])

  // Draw pose landmarks and connections
  const drawPose = (results: Results) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match video
    canvas.width = videoRef.current?.videoWidth || 640
    canvas.height = videoRef.current?.videoHeight || 480

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (results.poseLandmarks) {
      // Draw pose connections
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
      })

      // Draw landmarks
      drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 1,
        radius: 3
      })
    }
  }

  return {
    poseResults,
    exerciseAnalysis,
    setExerciseAnalysis
  }
}

// Exercise analysis functions
function analyzePushUps(landmarks: any[]): ExerciseAnalysis {
  // Get key landmarks for push-ups
  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftElbow = landmarks[13]
  const rightElbow = landmarks[14]
  const leftWrist = landmarks[15]
  const rightWrist = landmarks[16]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]

  // Calculate angles
  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist)
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist)
  const bodyAngle = calculateBodyAngle(leftShoulder, leftHip)

  // Analyze form
  let feedback = "Great form! Keep it up!"
  let status: "correct" | "incorrect" | "adjusting" = "correct"
  let accuracy = 95

  if (leftArmAngle > 160 || rightArmAngle > 160) {
    feedback = "Lower your chest closer to the ground"
    status = "adjusting"
    accuracy = 70
  } else if (leftArmAngle < 90 || rightArmAngle < 90) {
    feedback = "Don't go too low, maintain control"
    status = "adjusting"
    accuracy = 75
  } else if (Math.abs(bodyAngle) > 15) {
    feedback = "Keep your back straight and body aligned"
    status = "incorrect"
    accuracy = 60
  }

  return {
    reps: 0, // This would be tracked separately with state
    accuracy,
    feedback,
    status
  }
}

function analyzeSquats(landmarks: any[]): ExerciseAnalysis {
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)

  let feedback = "Excellent squat form!"
  let status: "correct" | "incorrect" | "adjusting" = "correct"
  let accuracy = 90

  if (leftKneeAngle > 160 || rightKneeAngle > 160) {
    feedback = "Squat deeper - aim for 90 degrees at the knee"
    status = "adjusting"
    accuracy = 70
  } else if (leftKneeAngle < 70 || rightKneeAngle < 70) {
    feedback = "Don't squat too deep, maintain control"
    status = "adjusting"
    accuracy = 75
  }

  return {
    reps: 0,
    accuracy,
    feedback,
    status
  }
}

function analyzePlanks(landmarks: any[]): ExerciseAnalysis {
  const leftShoulder = landmarks[11]
  const rightShoulder = landmarks[12]
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  // Calculate body alignment
  const shoulderHipAngle = calculateBodyAngle(leftShoulder, leftHip)
  const hipAnkleAngle = calculateBodyAngle(leftHip, leftAnkle)

  let feedback = "Perfect plank position!"
  let status: "correct" | "incorrect" | "adjusting" = "correct"
  let accuracy = 95

  if (Math.abs(shoulderHipAngle) > 10) {
    feedback = "Keep your back straight - don't let your hips sag or pike up"
    status = "incorrect"
    accuracy = 65
  } else if (Math.abs(hipAnkleAngle) > 15) {
    feedback = "Align your body from head to heels"
    status = "adjusting"
    accuracy = 80
  }

  return {
    reps: 0,
    accuracy,
    feedback,
    status
  }
}

function analyzeLunges(landmarks: any[]): ExerciseAnalysis {
  const leftHip = landmarks[23]
  const rightHip = landmarks[24]
  const leftKnee = landmarks[25]
  const rightKnee = landmarks[26]
  const leftAnkle = landmarks[27]
  const rightAnkle = landmarks[28]

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)

  let feedback = "Great lunge form!"
  let status: "correct" | "incorrect" | "adjusting" = "correct"
  let accuracy = 90

  const frontKneeAngle = Math.min(leftKneeAngle, rightKneeAngle)
  
  if (frontKneeAngle > 120) {
    feedback = "Lunge deeper - aim for 90 degrees at the front knee"
    status = "adjusting"
    accuracy = 75
  } else if (frontKneeAngle < 70) {
    feedback = "Don't lunge too deep, maintain control"
    status = "adjusting"
    accuracy = 70
  }

  return {
    reps: 0,
    accuracy,
    feedback,
    status
  }
}

function analyzeBurpees(landmarks: any[]): ExerciseAnalysis {
  // Burpees are complex - this is a simplified analysis
  const leftShoulder = landmarks[11]
  const leftHip = landmarks[23]
  const leftKnee = landmarks[25]
  const leftAnkle = landmarks[27]

  // Detect if in plank position (part of burpee)
  const bodyAngle = calculateBodyAngle(leftShoulder, leftHip)
  const isInPlank = Math.abs(bodyAngle) < 15

  let feedback = "Keep moving through the burpee sequence!"
  let status: "correct" | "incorrect" | "adjusting" = "adjusting"
  let accuracy = 80

  if (isInPlank) {
    feedback = "Good plank position! Now jump back up!"
    status = "correct"
    accuracy = 90
  }

  return {
    reps: 0,
    accuracy,
    feedback,
    status
  }
}

// Utility functions
function calculateAngle(a: any, b: any, c: any): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs(radians * 180.0 / Math.PI)
  if (angle > 180.0) {
    angle = 360 - angle
  }
  return angle
}

function calculateBodyAngle(point1: any, point2: any): number {
  const deltaY = point2.y - point1.y
  const deltaX = point2.x - point1.x
  const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI
  return angle
}