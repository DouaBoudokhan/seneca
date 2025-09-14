"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, CameraOff, Play, Pause, RotateCcw, CheckCircle, AlertTriangle, Target, Timer, Zap } from "lucide-react"
import { useMediaPipePose } from "@/hooks/useMediaPipePose"
import { useRepCounter } from "@/components/RepCounter"

export default function TrainerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [currentExercise, setCurrentExercise] = useState("push-ups")
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [targetReps, setTargetReps] = useState(10)

  // MediaPipe pose detection
  const { poseResults, exerciseAnalysis, setExerciseAnalysis } = useMediaPipePose(
    videoRef,
    canvasRef,
    currentExercise,
    isRecording
  )

  // Rep counter
  const { count: reps, countRep, resetCount } = useRepCounter(currentExercise)

  const exercises = [
    { id: "push-ups", name: "Push-ups", difficulty: "Beginner", target: "Chest, Arms" },
    { id: "squats", name: "Squats", difficulty: "Beginner", target: "Legs, Glutes" },
    { id: "planks", name: "Planks", difficulty: "Intermediate", target: "Core" },
    { id: "lunges", name: "Lunges", difficulty: "Intermediate", target: "Legs, Glutes" },
    { id: "burpees", name: "Burpees", difficulty: "Advanced", target: "Full Body" },
  ]

  // Count reps when pose results change
  useEffect(() => {
    if (poseResults && workoutStarted) {
      const newRepCount = countRep(poseResults.landmarks)
      setExerciseAnalysis(prev => ({ ...prev, reps: newRepCount }))
    }
  }, [poseResults, countRep, workoutStarted, setExerciseAnalysis])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (workoutStarted) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [workoutStarted])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsRecording(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsRecording(false)
    }
  }

  const startWorkout = () => {
    setWorkoutStarted(true)
    setWorkoutTimer(0)
    resetCount()
  }

  const pauseWorkout = () => {
    setWorkoutStarted(false)
  }

  const resetWorkout = () => {
    setWorkoutStarted(false)
    setWorkoutTimer(0)
    resetCount()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "text-green-500"
      case "incorrect":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return <CheckCircle className="w-5 h-5" />
      case "incorrect":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Workout Trainer</h1>
          <p className="text-slate-300">Real-time form analysis and personalized feedback powered by MediaPipe</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Live Camera Feed with Pose Detection</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={isRecording ? stopCamera : startCamera}
                      variant={isRecording ? "destructive" : "default"}
                      size="sm"
                    >
                      {isRecording ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                      {isRecording ? "Stop" : "Start"} Camera
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

                  {/* Pose Detection Status Overlay */}
                  {isRecording && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                        <div className={`flex items-center gap-2 ${getStatusColor(exerciseAnalysis.status)}`}>
                          {getStatusIcon(exerciseAnalysis.status)}
                          <span className="font-medium capitalize">{exerciseAnalysis.status}</span>
                        </div>
                        {poseResults && (
                          <div className="text-xs text-white/70 mt-1">
                            Pose detected: {poseResults.landmarks.length} landmarks
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls & Stats */}
          <div className="space-y-6">
            {/* Workout Controls */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Workout Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Timer</span>
                  <div className="flex items-center gap-2 text-white font-mono text-lg">
                    <Timer className="w-4 h-4" />
                    {formatTime(workoutTimer)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={workoutStarted ? pauseWorkout : startWorkout}
                    className="flex-1"
                    disabled={!isRecording}
                  >
                    {workoutStarted ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {workoutStarted ? "Pause" : "Start"}
                  </Button>
                  <Button onClick={resetWorkout} variant="outline" size="icon">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Exercise */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Current Exercise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white capitalize">{currentExercise.replace("-", " ")}</h3>
                  <Badge variant="secondary" className="mt-2">
                    {exercises.find((e) => e.id === currentExercise)?.difficulty}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Progress</span>
                    <span className="text-white">
                      {reps}/{targetReps} reps
                    </span>
                  </div>
                  <Progress value={(reps / targetReps) * 100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Form Accuracy</span>
                    <span className="text-white">{exerciseAnalysis.accuracy}%</span>
                  </div>
                  <Progress value={exerciseAnalysis.accuracy} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Real-time Feedback */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  MediaPipe AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div
                    className={`flex items-start gap-3 p-3 rounded-lg bg-black/20 ${getStatusColor(exerciseAnalysis.status)}`}
                  >
                    {getStatusIcon(exerciseAnalysis.status)}
                    <p className="text-sm text-white">{exerciseAnalysis.feedback}</p>
                  </div>

                  <div className="text-xs text-slate-400">
                    MediaPipe is analyzing your pose in real-time with 33 body landmarks for precise form feedback.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercise Selection */}
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Select Exercise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercises.map((exercise) => (
                    <Button
                      key={exercise.id}
                      onClick={() => {
                        setCurrentExercise(exercise.id)
                        resetCount()
                      }}
                      variant={currentExercise === exercise.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      disabled={workoutStarted}
                    >
                      <div className="text-left">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-xs opacity-70">{exercise.target}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}