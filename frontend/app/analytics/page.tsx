"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FitnessCharts } from "@/components/fitness-charts"
import { NutritionCharts } from "@/components/nutrition-charts"
import { ProgressRings } from "@/components/progress-rings"
import { WorkoutHeatmap } from "@/components/workout-heatmap"
import { BarChart3, TrendingUp, Target, Calendar, Award, Flame, Activity, Apple } from "lucide-react"

const timeRanges = [
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 3 Months" },
  { value: "1y", label: "Last Year" },
]

const keyMetrics = [
  {
    title: "Total Workouts",
    value: "47",
    change: "+12%",
    trend: "up",
    icon: Activity,
    color: "text-blue-500",
    period: "this month",
  },
  {
    title: "Calories Burned",
    value: "12,450",
    change: "+8%",
    trend: "up",
    icon: Flame,
    color: "text-orange-500",
    period: "this month",
  },
  {
    title: "Average Protein",
    value: "125g",
    change: "+15%",
    trend: "up",
    icon: Apple,
    color: "text-green-500",
    period: "daily",
  },
  {
    title: "Goal Achievement",
    value: "89%",
    change: "+5%",
    trend: "up",
    icon: Target,
    color: "text-purple-500",
    period: "this month",
  },
]

const achievements = [
  {
    title: "Consistency Champion",
    description: "Worked out 5 days in a row",
    date: "2024-01-15",
    icon: "🏆",
    category: "Workout",
  },
  {
    title: "Protein Power",
    description: "Hit protein goal 7 days straight",
    date: "2024-01-12",
    icon: "💪",
    category: "Nutrition",
  },
  {
    title: "Calorie Control",
    description: "Stayed within calorie range for 2 weeks",
    date: "2024-01-10",
    icon: "🎯",
    category: "Nutrition",
  },
  {
    title: "Strength Milestone",
    description: "Increased bench press by 10lbs",
    date: "2024-01-08",
    icon: "⚡",
    category: "Strength",
  },
]

const weeklyGoals = [
  { name: "Workout Sessions", current: 4, target: 5, unit: "sessions" },
  { name: "Active Minutes", current: 280, target: 300, unit: "minutes" },
  { name: "Calories Burned", current: 2100, target: 2500, unit: "calories" },
  { name: "Protein Intake", current: 875, target: 840, unit: "grams" },
  { name: "Water Intake", current: 52, target: 56, unit: "glasses" },
  { name: "Sleep Hours", current: 49, target: 56, unit: "hours" },
]

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 100) return "bg-green-500"
    if (percentage >= 80) return "bg-yellow-500"
    if (percentage >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? "↗️" : trend === "down" ? "↘️" : "➡️"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              <p className="text-sm text-muted-foreground">Track your progress and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fitness">Fitness</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {keyMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass border-border/50 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{metric.title}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${metric.color} bg-transparent border-current`}
                              >
                                {getTrendIcon(metric.trend)} {metric.change}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{metric.period}</p>
                          </div>
                          <div className={`p-2 rounded-lg bg-muted/50 ${metric.color}`}>
                            <metric.icon className="h-6 w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Progress Rings and Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <ProgressRings />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <WorkoutHeatmap />
                </motion.div>
              </div>

              {/* Recent Achievements */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Award className="mr-2 h-5 w-5 text-secondary" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {achievement.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{achievement.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="fitness">
              <FitnessCharts timeRange={selectedTimeRange} />
            </TabsContent>

            <TabsContent value="nutrition">
              <NutritionCharts timeRange={selectedTimeRange} />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              {/* Weekly Goals Progress */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Target className="mr-2 h-5 w-5 text-secondary" />
                      Weekly Goals Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {weeklyGoals.map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">{goal.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {goal.current} / {goal.target} {goal.unit}
                            </span>
                            <Badge variant={goal.current >= goal.target ? "default" : "secondary"} className="text-xs">
                              {Math.round((goal.current / goal.target) * 100)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress
                          value={(goal.current / goal.target) * 100}
                          className="h-2"
                          indicatorClassName={getProgressColor(goal.current, goal.target)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Goal Setting */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Calendar className="mr-2 h-5 w-5 text-secondary" />
                      Goal Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center bg-transparent"
                      >
                        <TrendingUp className="h-6 w-6 mb-2 text-secondary" />
                        <span className="text-sm">Set New Goal</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center bg-transparent"
                      >
                        <BarChart3 className="h-6 w-6 mb-2 text-secondary" />
                        <span className="text-sm">View Progress</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center bg-transparent"
                      >
                        <Award className="h-6 w-6 mb-2 text-secondary" />
                        <span className="text-sm">Achievements</span>
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium text-foreground mb-3">Quick Stats</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-secondary">12</div>
                          <div className="text-sm text-muted-foreground">Goals Achieved</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-secondary">89%</div>
                          <div className="text-sm text-muted-foreground">Success Rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-secondary">47</div>
                          <div className="text-sm text-muted-foreground">Days Active</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-secondary">5</div>
                          <div className="text-sm text-muted-foreground">Current Streak</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
