"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"

const progressData = [
  { name: "Calories", current: 1847, target: 2200, color: "#f59e0b", unit: "cal" },
  { name: "Protein", current: 89, target: 120, color: "#dc2626", unit: "g" },
  { name: "Workouts", current: 4, target: 5, color: "#1f2937", unit: "" },
  { name: "Water", current: 6, target: 8, color: "#3b82f6", unit: "glasses" },
]

export function ProgressRings() {
  const getCircumference = (radius: number) => 2 * Math.PI * radius
  const getStrokeDasharray = (current: number, target: number, radius: number) => {
    const circumference = getCircumference(radius)
    const progress = Math.min((current / target) * 100, 100)
    return `${(progress / 100) * circumference} ${circumference}`
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Target className="mr-2 h-5 w-5 text-secondary" />
          Today's Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {progressData.map((item, index) => {
            const radius = 45
            const circumference = getCircumference(radius)
            const progress = Math.min((item.current / item.target) * 100, 100)

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24 mb-2">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                      fill="transparent"
                      className="opacity-20"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={item.color}
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">{Math.round(progress)}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.current} / {item.target} {item.unit}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
