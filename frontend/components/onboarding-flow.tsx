"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, User, Target, Activity, Sparkles } from "lucide-react"

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Fitness Goals", icon: Target },
  { id: 3, title: "Activity Level", icon: Activity },
  { id: 4, title: "Welcome!", icon: Sparkles },
]

const fitnessGoals = [
  { id: "weight-loss", label: "Weight Loss", description: "Burn calories and lose weight" },
  { id: "muscle-gain", label: "Muscle Gain", description: "Build strength and muscle mass" },
  { id: "endurance", label: "Endurance", description: "Improve cardiovascular fitness" },
  { id: "strength", label: "Strength", description: "Increase overall strength" },
  { id: "flexibility", label: "Flexibility", description: "Improve mobility and flexibility" },
  { id: "general", label: "General Health", description: "Overall wellness and health" },
]

const activityLevels = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "light", label: "Light", description: "1-3 days per week" },
  { value: "moderate", label: "Moderate", description: "3-5 days per week" },
  { value: "active", label: "Active", description: "6-7 days per week" },
  { value: "very-active", label: "Very Active", description: "2x per day or intense training" },
]

interface OnboardingFlowProps {
  onComplete: (data: any) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    goals: [] as string[],
    activityLevel: "",
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId) ? prev.goals.filter((g) => g !== goalId) : [...prev.goals, goalId],
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.weight && formData.height
      case 2:
        return formData.goals.length > 0
      case 3:
        return formData.activityLevel
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">Welcome to FitAI</h1>
            <span className="text-white/70">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 ${step.id <= currentStep ? "text-white" : "text-white/50"}`}
              >
                <step.icon className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="glass border-border/50">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Tell us about yourself</h2>
                    <p className="text-muted-foreground">We'll use this to personalize your experience</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          placeholder="70"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          placeholder="175"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">What are your fitness goals?</h2>
                    <p className="text-muted-foreground">Select all that apply - we'll create a plan just for you</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fitnessGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.goals.includes(goal.id)
                            ? "border-secondary bg-secondary/10"
                            : "border-border hover:border-secondary/50"
                        }`}
                        onClick={() => toggleGoal(goal.id)}
                      >
                        <h3 className="font-semibold text-foreground mb-1">{goal.label}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">What's your activity level?</h2>
                    <p className="text-muted-foreground">This helps us recommend the right workout intensity</p>
                  </div>
                  <div className="space-y-3">
                    {activityLevels.map((level) => (
                      <div
                        key={level.value}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.activityLevel === level.value
                            ? "border-secondary bg-secondary/10"
                            : "border-border hover:border-secondary/50"
                        }`}
                        onClick={() => setFormData({ ...formData, activityLevel: level.value })}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-foreground">{level.label}</h3>
                            <p className="text-sm text-muted-foreground">{level.description}</p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              formData.activityLevel === level.value ? "border-secondary bg-secondary" : "border-border"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center space-y-6"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">You're all set!</h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    Welcome to FitAI, {formData.name}! We've created a personalized fitness plan based on your goals.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-foreground">Your Profile Summary:</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {formData.goals.map((goalId) => {
                        const goal = fitnessGoals.find((g) => g.id === goalId)
                        return (
                          <Badge key={goalId} variant="secondary">
                            {goal?.label}
                          </Badge>
                        )
                      })}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Activity Level: {activityLevels.find((l) => l.value === formData.activityLevel)?.label}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {currentStep === steps.length ? "Get Started" : "Next"}
            {currentStep < steps.length && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
