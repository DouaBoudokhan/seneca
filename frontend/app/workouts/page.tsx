"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { WorkoutCard } from "@/components/workout-card"
import { ExerciseLibrary } from "@/components/exercise-library"
import { WorkoutBuilder } from "@/components/workout-builder"
import { Plus, Search, Calendar, Clock, Flame, Target } from "lucide-react"

const recommendedWorkouts = [
  {
    id: 1,
    name: "Upper Body Strength",
    duration: 45,
    calories: 320,
    difficulty: "Intermediate",
    exercises: 8,
    category: "Strength",
    image: "/upper-body-workout.png",
    description: "Build upper body strength with compound movements",
    tags: ["Strength", "Upper Body", "Muscle Building"],
  },
  {
    id: 2,
    name: "HIIT Cardio Blast",
    duration: 30,
    calories: 400,
    difficulty: "Advanced",
    exercises: 6,
    category: "Cardio",
    image: "/hiit-cardio-workout.jpg",
    description: "High-intensity interval training for maximum calorie burn",
    tags: ["HIIT", "Cardio", "Fat Burn"],
  },
  {
    id: 3,
    name: "Core & Flexibility",
    duration: 25,
    calories: 150,
    difficulty: "Beginner",
    exercises: 10,
    category: "Flexibility",
    image: "/core-flexibility-workout.jpg",
    description: "Strengthen your core and improve flexibility",
    tags: ["Core", "Flexibility", "Recovery"],
  },
  {
    id: 4,
    name: "Full Body Circuit",
    duration: 40,
    calories: 350,
    difficulty: "Intermediate",
    exercises: 12,
    category: "Circuit",
    image: "/full-body-circuit-workout.jpg",
    description: "Complete full-body workout targeting all muscle groups",
    tags: ["Full Body", "Circuit", "Conditioning"],
  },
]

const todaysWorkout = {
  name: "Push Day - Chest & Triceps",
  duration: 50,
  calories: 380,
  exercises: [
    { name: "Bench Press", sets: 4, reps: "8-10", rest: "2-3 min" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90s" },
    { name: "Dips", sets: 3, reps: "12-15", rest: "90s" },
    { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "60s" },
  ],
}

export default function WorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showBuilder, setShowBuilder] = useState(false)

  const categories = ["all", "strength", "cardio", "flexibility", "circuit"]

  const filteredWorkouts = recommendedWorkouts.filter((workout) => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || workout.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Workouts</h1>
              <p className="text-sm text-muted-foreground">Discover and create personalized workout plans</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={() => setShowBuilder(true)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Workout
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs defaultValue="recommended" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="library">Exercise Library</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-6">
              {/* Today's Workout */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass border-border/50 bg-gradient-to-r from-secondary/10 to-accent/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">Today's Workout</CardTitle>
                        <p className="text-muted-foreground">Recommended based on your goals</p>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{todaysWorkout.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {todaysWorkout.duration} min
                          </div>
                          <div className="flex items-center">
                            <Flame className="mr-1 h-4 w-4" />
                            {todaysWorkout.calories} cal
                          </div>
                        </div>
                        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                          <Target className="mr-2 h-4 w-4" />
                          Start Workout
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Exercises Preview:</h4>
                        {todaysWorkout.exercises.map((exercise, index) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded bg-muted/50">
                            <span className="text-sm font-medium text-foreground">{exercise.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {exercise.sets} × {exercise.reps}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search workouts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Workout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkouts.map((workout, index) => (
                  <motion.div
                    key={workout.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <WorkoutCard workout={workout} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="library">
              <ExerciseLibrary />
            </TabsContent>

            <TabsContent value="schedule">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="glass border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground">
                        <Calendar className="mr-2 h-5 w-5 text-secondary" />
                        Weekly Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                          (day, index) => (
                            <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div>
                                <p className="font-medium text-foreground">{day}</p>
                                <p className="text-sm text-muted-foreground">
                                  {index === 0
                                    ? "Push Day - Chest & Triceps"
                                    : index === 2
                                      ? "Pull Day - Back & Biceps"
                                      : index === 4
                                        ? "Leg Day"
                                        : "Rest Day"}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                {index % 2 === 0 && index < 6 ? "Edit" : "Add"}
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="glass border-border/50">
                    <CardHeader>
                      <CardTitle className="text-foreground">This Week</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-secondary">4/5</div>
                        <p className="text-sm text-muted-foreground">Workouts Completed</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Time</span>
                          <span className="font-medium text-foreground">3h 20m</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Calories Burned</span>
                          <span className="font-medium text-foreground">1,240</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Streak</span>
                          <span className="font-medium text-foreground">12 days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Workout Builder Modal */}
      {showBuilder && <WorkoutBuilder onClose={() => setShowBuilder(false)} />}
    </div>
  )
}
