"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FoodLogger } from "@/components/food-logger"
import { NutritionInsights } from "@/components/nutrition-insights"
import FoodAnalyzer from "@/components/food-analyzer"
import MealInfo from "@/components/meal-info"
import { Apple, Target, TrendingUp, Plus, Camera, Sparkles } from "lucide-react"

const waterIntake = { target: 8, unit: "glasses" }

export default function NutritionPage() {
  const [showFoodLogger, setShowFoodLogger] = useState(false)
  const [selectedMealId, setSelectedMealId] = useState<number | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("today")
  const [todaysMeals, setTodaysMeals] = useState<Array<{
    id: number;
    name: string;
    time: string;
    calories: number;
    foods: Array<{
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;
  }>>([])
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })
  const [waterGlasses, setWaterGlasses] = useState(0)

  // Meal names in order
  const mealNames = ["Breakfast", "Lunch", "Snack", "Dinner", "Late Night"]
  
  // Function to get next meal name
  const getNextMealName = () => {
    if (todaysMeals.length < mealNames.length) {
      return mealNames[todaysMeals.length]
    }
    return `Meal ${todaysMeals.length + 1}`
  }

  // Function to get current time formatted
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Function to add a meal from food analysis
  const addMealFromAnalysis = (nutritionData: any) => {
    const newMeal = {
      id: todaysMeals.length + 1,
      name: getNextMealName(),
      time: getCurrentTime(),
      calories: nutritionData.meal_totals.total_calories,
      foods: nutritionData.items.map((item: any) => ({
        name: item.name,
        calories: item.calories,
        protein: item.protein_g,
        carbs: item.carbs_g,
        fat: item.fat_g,
      }))
    }

    setTodaysMeals(prev => [...prev, newMeal])
    
    // Update daily nutrition totals
    setDailyNutrition(prev => ({
      calories: prev.calories + nutritionData.meal_totals.total_calories,
      protein: prev.protein + nutritionData.meal_totals.total_protein_g,
      carbs: prev.carbs + nutritionData.meal_totals.total_carbs_g,
      fat: prev.fat + nutritionData.meal_totals.total_fat_g,
    }))
  }

  // Function to add water glass
  const addWaterGlass = () => {
    setWaterGlasses(prev => prev + 1)
  }

  // Update dailyGoals to use current values
  const currentDailyGoals = {
    calories: { current: Math.round(dailyNutrition.calories), target: 2200, unit: "cal" },
    protein: { current: Math.round(dailyNutrition.protein), target: 120, unit: "g" },
    carbs: { current: Math.round(dailyNutrition.carbs), target: 200, unit: "g" },
    fat: { current: Math.round(dailyNutrition.fat), target: 80, unit: "g" },
  }

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Nutrition</h1>
              <p className="text-sm text-muted-foreground">Track your meals and reach your nutrition goals</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={() => setShowFoodLogger(true)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Log Food
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-6">
              {/* Daily Goals Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(currentDailyGoals).map(([key, goal], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`glass border-border/50 ${
                      key === 'calories' ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' :
                      key === 'protein' ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' :
                      key === 'carbs' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20' :
                      'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
                    }`}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground capitalize">{key}</h3>
                            <Badge variant="outline" className={`text-xs ${
                              key === 'calories' ? 'border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300' :
                              key === 'protein' ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-300' :
                              key === 'carbs' ? 'border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300' :
                              'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300'
                            }`}>
                              {Math.round((goal.current / goal.target) * 100)}%
                            </Badge>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-foreground">
                              {goal.current}
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                / {goal.target} {goal.unit}
                              </span>
                            </div>
                            <Progress
                              value={(goal.current / goal.target) * 100}
                              className={`mt-2 h-2 ${
                                key === 'calories' ? '[&>div]:bg-blue-500' :
                                key === 'protein' ? '[&>div]:bg-green-500' :
                                key === 'carbs' ? '[&>div]:bg-yellow-500' :
                                '[&>div]:bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Water Intake */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass border-border/50 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 mr-2" />
                      Water Intake
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {waterGlasses}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            / {waterIntake.target} {waterIntake.unit}
                          </span>
                        </div>
                        <Progress
                          value={(waterGlasses / waterIntake.target) * 100}
                          className="mt-2 h-2 w-48 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-blue-500"
                        />
                      </div>
                      <Button size="sm" variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-300 dark:hover:bg-cyan-900/20" onClick={addWaterGlass}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Glass
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Today's Meals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Today's Meals</h2>
                  </div>
                  
                  {todaysMeals.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="glass border-border/50 border-dashed bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                        <CardContent className="p-8 text-center">
                          <h3 className="text-lg font-semibold text-foreground mb-2">No meals logged yet</h3>
                          <p className="text-muted-foreground">
                            Start by scanning your first meal of the day using the Food Scanner on the right
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    todaysMeals.map((meal, index) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        onClick={() => setSelectedMealId(meal.id)}
                        className="cursor-pointer"
                      >
                        <Card className={`glass border-border/50 transition-all duration-200 ${
                          selectedMealId === meal.id ? 'ring-2 ring-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20' : 'hover:shadow-md bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20'
                        }`}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-foreground">{meal.name}</h3>
                                  <p className="text-sm text-muted-foreground">{meal.time}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-foreground">{meal.calories}</div>
                                  <div className="text-xs text-muted-foreground">calories</div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                {meal.foods.map((food, foodIndex) => (
                                  <div key={foodIndex} className="flex justify-between items-center text-sm">
                                    <span className="text-foreground">{food.name}</span>
                                    <span className="text-muted-foreground">{food.calories} cal</span>
                                  </div>
                                ))}
                              </div>
                              <Button variant="ghost" size="sm" className="w-full hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 dark:hover:text-green-300">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Food
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Food Scanner */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground flex items-center">
                    <Camera className="mr-2 h-6 w-6 text-purple-500" />
                    Food Scanner
                  </h2>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-1"
                  >
                    <FoodAnalyzer onMealAdded={addMealFromAnalysis} />
                  </motion.div>

                  {/* Meal Info Component - only show if meals exist and one is selected */}
                  {todaysMeals.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <MealInfo 
                        meals={todaysMeals} 
                        selectedMealId={selectedMealId}
                        onMealSelect={setSelectedMealId}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights">
              <NutritionInsights />
            </TabsContent>

            <TabsContent value="recipes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "High-Protein Breakfast Bowl",
                    calories: 420,
                    protein: 28,
                    time: "15 min",
                    difficulty: "Easy",
                    image: "/placeholder.svg?key=recipe1",
                  },
                  {
                    name: "Mediterranean Quinoa Salad",
                    calories: 380,
                    protein: 15,
                    time: "20 min",
                    difficulty: "Easy",
                    image: "/placeholder.svg?key=recipe2",
                  },
                  {
                    name: "Grilled Salmon with Vegetables",
                    calories: 450,
                    protein: 35,
                    time: "25 min",
                    difficulty: "Medium",
                    image: "/placeholder.svg?key=recipe3",
                  },
                ].map((recipe, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
                      <div className="relative">
                        <img
                          src={recipe.image || "/placeholder.svg"}
                          alt={recipe.name}
                          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">{recipe.difficulty}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">{recipe.name}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <span>{recipe.calories} cal</span>
                          <span>{recipe.protein}g protein</span>
                          <span>{recipe.time}</span>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 border-0">
                          View Recipe
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Food Logger Modal */}
      {showFoodLogger && <FoodLogger onClose={() => setShowFoodLogger(false)} />}
    </div>
  )
}
