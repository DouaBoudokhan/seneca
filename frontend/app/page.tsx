"use client"

import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProgressRing } from "@/components/progress-ring"
import { AnimatedExerciseCard } from "@/components/animated-exercise-card"
import { StreakTracker } from "@/components/streak-tracker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Flame, Target, Trophy, Camera, Calendar, Zap } from "lucide-react"

const stats = [
  {
    title: "Today's Calories",
    value: 2847,
    target: 3200,
    icon: Flame,
    color: "text-orange-500",
    gradientClass: "stop-orange-500 stop-red-500",
    unit: " cal",
  },
  {
    title: "Active Minutes",
    value: 45,
    target: 60,
    icon: Activity,
    color: "text-blue-500",
    gradientClass: "stop-blue-500 stop-cyan-500",
    unit: " min",
  },
  {
    title: "Workouts This Week",
    value: 4,
    target: 5,
    icon: Target,
    color: "text-green-500",
    gradientClass: "stop-green-500 stop-emerald-500",
    unit: "",
  },
  {
    title: "Current Streak",
    value: 12,
    target: 30,
    icon: Trophy,
    color: "text-yellow-500",
    gradientClass: "stop-yellow-500 stop-orange-500",
    unit: " days",
  },
]

const featuredWorkouts = [
  {
    name: "Upper Body Blast",
    duration: "45 min",
    calories: 320,
    image: "/upper-body-workout.png",
    difficulty: "Intermediate" as const,
    type: "Strength" as const,
  },
  {
    name: "HIIT Cardio Burn",
    duration: "30 min",
    calories: 280,
    image: "/hiit-cardio-workout.jpg",
    difficulty: "Advanced" as const,
    type: "HIIT" as const,
  },
  {
    name: "Morning Yoga Flow",
    duration: "25 min",
    calories: 150,
    image: "/core-flexibility-workout.jpg",
    difficulty: "Beginner" as const,
    type: "Flexibility" as const,
  },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-auto">
          <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div>
                <motion.h1
                  className="text-xl md:text-2xl font-bold text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  Dashboard
                </motion.h1>
                <motion.p
                  className="text-xs md:text-sm text-white/80"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Welcome back! Ready to crush your goals?
                </motion.p>
              </div>
              <div className="flex items-center space-x-2 md:space-x-4">
                <ThemeToggle />
                <Button className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-xs md:text-sm px-2 md:px-4">
                  <Zap className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Quick Workout</span>
                  <span className="sm:hidden">Workout</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-4 md:p-6 space-y-6 md:space-y-8">
            {/* Stats Grid */}
            <div className="dashboard-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full"
                >
                  <ProgressRing {...stat} />
                </motion.div>
              ))}
            </div>

            {/* Featured Workouts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-white">Featured Workouts</h2>
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-sm w-fit">
                  View All
                </Button>
              </div>
              <div className="workout-grid">
                {featuredWorkouts.map((workout, index) => (
                  <motion.div
                    key={workout.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="w-full"
                  >
                    <AnimatedExerciseCard {...workout} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                <StreakTracker />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                <Card className="glass-enhanced h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white text-lg md:text-xl">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-sm h-12">
                      <Camera className="mr-3 h-4 w-4 flex-shrink-0" />
                      Snap & Track Meal
                    </Button>
                    <Button className="w-full justify-start bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-sm h-12">
                      <Calendar className="mr-3 h-4 w-4 flex-shrink-0" />
                      Plan Weekly Meals
                    </Button>
                    <Button className="w-full justify-start bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-sm h-12">
                      <Target className="mr-3 h-4 w-4 flex-shrink-0" />
                      Start Live Workout
                    </Button>
                    <Button className="w-full justify-start bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm text-sm h-12">
                      <Trophy className="mr-3 h-4 w-4 flex-shrink-0" />
                      View Leaderboard
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
