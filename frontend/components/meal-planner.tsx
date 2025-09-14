"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChefHat, Clock, Sparkles, Plus, X } from "lucide-react"

const mealSuggestions = [
  {
    id: 1,
    name: "High-Protein Breakfast Bowl",
    calories: 420,
    protein: 28,
    carbs: 35,
    fat: 18,
    time: "15 min",
    difficulty: "Easy",
    ingredients: ["Greek yogurt", "Berries", "Granola", "Protein powder"],
    tags: ["High Protein", "Quick", "Healthy"],
  },
  {
    id: 2,
    name: "Mediterranean Quinoa Salad",
    calories: 380,
    protein: 15,
    carbs: 45,
    fat: 16,
    time: "20 min",
    difficulty: "Easy",
    ingredients: ["Quinoa", "Cucumber", "Tomatoes", "Feta", "Olive oil"],
    tags: ["Vegetarian", "Mediterranean", "Fiber Rich"],
  },
  {
    id: 3,
    name: "Grilled Salmon with Vegetables",
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 25,
    time: "25 min",
    difficulty: "Medium",
    ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Lemon"],
    tags: ["Omega-3", "Low Carb", "Heart Healthy"],
  },
]

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

interface MealPlannerProps {
  onClose?: () => void
}

export function MealPlanner({ onClose }: MealPlannerProps) {
  const [selectedDay, setSelectedDay] = useState("Monday")
  const [plannedMeals, setPlannedMeals] = useState<Record<string, any[]>>({})

  const addMealToPlan = (meal: any, day: string, mealType: string) => {
    const key = `${day}-${mealType}`
    setPlannedMeals((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), meal],
    }))
  }

  const removeMealFromPlan = (day: string, mealType: string, mealIndex: number) => {
    const key = `${day}-${mealType}`
    setPlannedMeals((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, index) => index !== mealIndex),
    }))
  }

  const getMealsForDay = (day: string, mealType: string) => {
    return plannedMeals[`${day}-${mealType}`] || []
  }

  const getDayTotalCalories = (day: string) => {
    const allMeals = [
      ...getMealsForDay(day, "breakfast"),
      ...getMealsForDay(day, "lunch"),
      ...getMealsForDay(day, "dinner"),
      ...getMealsForDay(day, "snack"),
    ]
    return allMeals.reduce((sum, meal) => sum + meal.calories, 0)
  }

  return (
    <div
      className={onClose ? "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" : ""}
    >
      <motion.div
        initial={onClose ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={onClose ? { opacity: 0, scale: 0.9 } : {}}
        className={onClose ? "w-full max-w-6xl max-h-[90vh] overflow-auto" : ""}
      >
        <Card className="glass border-border/50">
          {onClose && (
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Meal Planner</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
          )}
          <CardContent className="space-y-6">
            {/* AI Meal Suggestions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-secondary" />
                  AI Meal Suggestions
                </h3>
                <Button size="sm" variant="outline">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Generate More
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mealSuggestions.map((meal) => (
                  <Card
                    key={meal.id}
                    className="glass border-border/50 group hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                            {meal.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{meal.time}</span>
                            <Badge variant="outline" className="text-xs">
                              {meal.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="font-bold text-foreground">{meal.calories}</div>
                            <div className="text-muted-foreground">cal</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-foreground">{meal.protein}g</div>
                            <div className="text-muted-foreground">protein</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-foreground">{meal.carbs}g</div>
                            <div className="text-muted-foreground">carbs</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {meal.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            View Recipe
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            onClick={() => addMealToPlan(meal, selectedDay, "lunch")}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Weekly Planner */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-secondary" />
                Weekly Meal Plan
              </h3>

              {/* Day Selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {weekDays.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(day)}
                    className="whitespace-nowrap"
                  >
                    {day}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {getDayTotalCalories(day)}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* Day View */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["breakfast", "lunch", "dinner", "snack"].map((mealType) => (
                  <Card key={mealType} className="glass border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-foreground capitalize">{mealType}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {getMealsForDay(selectedDay, mealType).map((meal, index) => (
                        <div key={index} className="p-2 rounded bg-muted/50 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-foreground">{meal.name}</div>
                            <div className="text-xs text-muted-foreground">{meal.calories} cal</div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeMealFromPlan(selectedDay, mealType, index)}
                            className="h-6 w-6"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full border-2 border-dashed border-border hover:border-secondary"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add {mealType}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Weekly Summary */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Weekly Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {weekDays.reduce((sum, day) => sum + getDayTotalCalories(day), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Calories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {Math.round(weekDays.reduce((sum, day) => sum + getDayTotalCalories(day), 0) / 7)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Daily Calories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {weekDays.filter((day) => getDayTotalCalories(day) > 0).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Planned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {Object.values(plannedMeals).flat().length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Meals</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {onClose && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Close
                </Button>
                <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Save Meal Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
