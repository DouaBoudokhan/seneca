"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, GripVertical, Save, Play } from "lucide-react"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
}

interface WorkoutBuilderProps {
  onClose: () => void
}

export function WorkoutBuilder({ onClose }: WorkoutBuilderProps) {
  const [workoutName, setWorkoutName] = useState("")
  const [workoutDescription, setWorkoutDescription] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showExerciseSearch, setShowExerciseSearch] = useState(false)

  const availableExercises = [
    "Push-ups",
    "Squats",
    "Deadlift",
    "Bench Press",
    "Pull-ups",
    "Plank",
    "Burpees",
    "Lunges",
    "Shoulder Press",
    "Bicep Curls",
    "Tricep Dips",
    "Mountain Climbers",
  ]

  const addExercise = (exerciseName: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: 3,
      reps: "10-12",
      rest: "60s",
    }
    setExercises([...exercises, newExercise])
    setShowExerciseSearch(false)
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)))
  }

  const saveWorkout = () => {
    // Here you would save the workout to your backend/database
    console.log("Saving workout:", { workoutName, workoutDescription, exercises })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Create Custom Workout</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workout Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Upper Body Strength"
                />
              </div>
              <div>
                <Label htmlFor="workout-description">Description</Label>
                <Textarea
                  id="workout-description"
                  value={workoutDescription}
                  onChange={(e) => setWorkoutDescription(e.target.value)}
                  placeholder="Describe your workout..."
                  rows={3}
                />
              </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Exercises</h3>
                <Button
                  onClick={() => setShowExerciseSearch(true)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </div>

              <AnimatePresence>
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 rounded-lg border border-border bg-muted/50"
                  >
                    <div className="flex items-start gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{exercise.name}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExercise(exercise.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Label className="text-xs">Sets</Label>
                            <Input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(exercise.id, "sets", Number.parseInt(e.target.value))}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Reps</Label>
                            <Input
                              value={exercise.reps}
                              onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                              placeholder="10-12"
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Rest</Label>
                            <Input
                              value={exercise.rest}
                              onChange={(e) => updateExercise(exercise.id, "rest", e.target.value)}
                              placeholder="60s"
                              className="h-8"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Notes (optional)</Label>
                          <Input
                            value={exercise.notes || ""}
                            onChange={(e) => updateExercise(exercise.id, "notes", e.target.value)}
                            placeholder="Form cues, modifications, etc."
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {exercises.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No exercises added yet.</p>
                  <p className="text-sm">Click "Add Exercise" to get started.</p>
                </div>
              )}
            </div>

            {/* Exercise Search Modal */}
            <AnimatePresence>
              {showExerciseSearch && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center p-4"
                  onClick={() => setShowExerciseSearch(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md"
                  >
                    <Card className="glass border-border/50">
                      <CardHeader>
                        <CardTitle className="text-foreground">Add Exercise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-60 overflow-auto">
                          {availableExercises.map((exercise) => (
                            <Button
                              key={exercise}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => addExercise(exercise)}
                            >
                              {exercise}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={saveWorkout}
                disabled={!workoutName || exercises.length === 0}
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Workout
              </Button>
              <Button
                onClick={() => {
                  saveWorkout()
                  // Start workout logic here
                }}
                disabled={!workoutName || exercises.length === 0}
                className="flex-1"
              >
                <Play className="mr-2 h-4 w-4" />
                Save & Start
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
