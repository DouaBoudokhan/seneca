"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Dumbbell, 
  Clock, 
  Target, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Apple,
  Utensils,
  TrendingUp,
  Award,
  CheckCircle2
} from "lucide-react"
import { useState } from "react"

interface FormattedMessageContentProps {
  content: string
  type?: string
  data?: any
}

interface WorkoutDay {
  day: string
  focus: string
  exercises: Array<{
    name: string
    sets?: number
    reps?: number | string
    duration?: string
    notes?: string
  }>
}

interface MealPlan {
  mealType: string
  items: string[]
  calories?: number
  macros?: {
    protein?: string
    carbs?: string
    fat?: string
  }
}

export function FormattedMessageContent({ content, type, data }: FormattedMessageContentProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Parse workout plan from text
  const parseWorkoutPlan = (text: string): WorkoutDay[] => {
    const workoutDays: WorkoutDay[] = []
    
    // Split by days of the week - more flexible regex
    const dayRegex = /\*\*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[^*]*\*\*([^*]*?)(?=\*\*|$)/gi
    let dayMatch
    
    while ((dayMatch = dayRegex.exec(text)) !== null) {
      const daySection = dayMatch[0] + (dayMatch[2] || "")
      const dayNameMatch = daySection.match(/\*\*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[^*]*\*\*/i)
      
      if (dayNameMatch) {
        const dayName = dayNameMatch[1]
        const focusMatch = daySection.match(/\(([^)]+)\)/)
        const focus = focusMatch ? focusMatch[1] : ""
        
        // Extract exercises with more flexible patterns
        const exercises: Array<{name: string, sets?: number, reps?: number | string, duration?: string}> = []
        
        // Look for numbered exercises with sets and reps
        const exerciseRegex = /(\d+)\.\s*([^:]+?):\s*(\d+)\s*sets?\s*of\s*(\d+|as many.*?)\s*reps?/gi
        let exerciseMatch
        
        while ((exerciseMatch = exerciseRegex.exec(daySection)) !== null) {
          exercises.push({
            name: exerciseMatch[2].trim(),
            sets: parseInt(exerciseMatch[3]),
            reps: exerciseMatch[4].includes('as many') ? exerciseMatch[4] : parseInt(exerciseMatch[4])
          })
        }
        
        // Look for time-based exercises
        const timeExerciseRegex = /(\d+)\.\s*([^:]+?):\s*(\d+)\s*sets?\s*of\s*(\d+[^)]*?(?:seconds?|minutes?))/gi
        let timeMatch
        
        while ((timeMatch = timeExerciseRegex.exec(daySection)) !== null) {
          exercises.push({
            name: timeMatch[2].trim(),
            sets: parseInt(timeMatch[3]),
            duration: timeMatch[4]
          })
        }
        
        // Also look for simple exercise lists (without structured format)
        if (exercises.length === 0) {
          const simpleExercises = daySection.match(/(\d+)\.\s*([^\d\n]+)/g)
          if (simpleExercises) {
            simpleExercises.forEach(ex => {
              const match = ex.match(/\d+\.\s*(.+)/)
              if (match) {
                exercises.push({
                  name: match[1].trim()
                })
              }
            })
          }
        }
        
        if (dayName) {
          workoutDays.push({
            day: dayName,
            focus: focus,
            exercises: exercises
          })
        }
      }
    }
    
    return workoutDays
  }

  // Parse nutrition advice
  const parseNutritionAdvice = (text: string): MealPlan[] => {
    const meals: MealPlan[] = []
    
    // Look for meal types
    const mealRegex = /\*\*(Breakfast|Lunch|Dinner|Snack)[^*]*\*\*/gi
    const mealMatches = text.match(mealRegex)
    
    if (mealMatches) {
      mealMatches.forEach(mealSection => {
        const mealTypeMatch = mealSection.match(/\*\*(Breakfast|Lunch|Dinner|Snack)[^*]*\*\*/i)
        if (mealTypeMatch) {
          const mealType = mealTypeMatch[1]
          
          // Extract food items (look for bullet points or numbered lists)
          const items: string[] = []
          const itemRegex = /[-•]\s*([^-•\n]+)/g
          let itemMatch
          
          while ((itemMatch = itemRegex.exec(mealSection)) !== null) {
            items.push(itemMatch[1].trim())
          }
          
          meals.push({
            mealType,
            items
          })
        }
      })
    }
    
    return meals
  }

  // Format general text with better line breaks
  const formatGeneralText = (text: string): string[] => {
    return text
      .split(/\*\*|\.(?=\s[A-Z])|\.(?=\s\d)/) // Split on bold markers and sentence endings
      .map(part => part.trim())
      .filter(part => part.length > 0)
      .slice(0, 10) // Limit to first 10 sections to avoid overwhelming
  }

  // Render workout plan
  const renderWorkoutPlan = (workoutDays: WorkoutDay[]) => {
    if (workoutDays.length === 0) return null
    
    // Calculate summary stats
    const totalExercises = workoutDays.reduce((sum, day) => sum + day.exercises.length, 0)
    const workoutDaysCount = workoutDays.length
    const hasRestDays = workoutDays.some(day => day.day.toLowerCase().includes('rest'))
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center space-x-2 mb-4">
          <Dumbbell className="h-5 w-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Your Workout Plan</h3>
        </div>
        
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/10 border-orange-500/40 backdrop-blur-md mb-4">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-300">{workoutDaysCount}</div>
                <div className="text-xs text-orange-200">Workout Days</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-300">{totalExercises}</div>
                <div className="text-xs text-orange-200">Total Exercises</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-300">{hasRestDays ? 'Yes' : 'No'}</div>
                <div className="text-xs text-orange-200">Rest Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-3">
          {workoutDays.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-orange-500/15 to-red-500/5 border-orange-500/30 backdrop-blur-md">
                <CardHeader 
                  className="pb-3 cursor-pointer"
                  onClick={() => toggleSection(day.day)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-base">{day.day}</CardTitle>
                        {day.focus && (
                          <p className="text-orange-200 text-sm">{day.focus}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-orange-500/20 border-orange-500/40 text-orange-200">
                        {day.exercises.length} exercises
                      </Badge>
                      {expandedSections.has(day.day) ? (
                        <ChevronUp className="h-4 w-4 text-white" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {expandedSections.has(day.day) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <div 
                            key={exerciseIndex}
                            className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {exerciseIndex + 1}
                              </div>
                              <div>
                                <p className="text-white font-medium">{exercise.name}</p>
                                <div className="flex items-center space-x-3 text-xs text-white/70">
                                  {exercise.sets && (
                                    <span className="flex items-center space-x-1">
                                      <Target className="h-3 w-3" />
                                      <span>{exercise.sets} sets</span>
                                    </span>
                                  )}
                                  {exercise.reps && (
                                    <span>{exercise.reps} reps</span>
                                  )}
                                  {exercise.duration && (
                                    <span className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{exercise.duration}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Render nutrition plan
  const renderNutritionPlan = (meals: MealPlan[]) => {
    if (meals.length === 0) return null
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center space-x-2 mb-4">
          <Apple className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Nutrition Plan</h3>
        </div>
        
        <div className="grid gap-3">
          {meals.map((meal, index) => (
            <motion.div
              key={meal.mealType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/5 border-green-500/30 backdrop-blur-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Utensils className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-white text-base">{meal.mealType}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {meal.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                        <span className="text-white/90 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // Render formatted text sections
  const renderFormattedText = (sections: string[]) => {
    return (
      <div className="space-y-3">
        {sections.map((section, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-sm leading-relaxed text-white/90"
          >
            {section}
          </motion.p>
        ))}
      </div>
    )
  }

  // Determine how to render based on content type and content
  const renderContent = () => {
    if (type === "workout" || content.toLowerCase().includes("workout plan")) {
      const workoutDays = parseWorkoutPlan(content)
      if (workoutDays.length > 0) {
        return renderWorkoutPlan(workoutDays)
      }
    }
    
    if (type === "nutrition" || content.toLowerCase().includes("meal") || content.toLowerCase().includes("nutrition")) {
      const meals = parseNutritionAdvice(content)
      if (meals.length > 0) {
        return renderNutritionPlan(meals)
      }
    }
    
    // Default: format as structured text
    const sections = formatGeneralText(content)
    return renderFormattedText(sections)
  }

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  )
}