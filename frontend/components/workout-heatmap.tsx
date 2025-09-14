"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

// Generate sample workout data for the last 12 weeks
const generateHeatmapData = () => {
  const data = []
  const today = new Date()

  for (let week = 11; week >= 0; week--) {
    const weekData = []
    for (let day = 0; day < 7; day++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (week * 7 + (6 - day)))

      // Simulate workout intensity (0-4)
      const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0

      weekData.push({
        date: date.toISOString().split("T")[0],
        intensity,
        day: date.getDay(),
      })
    }
    data.push(weekData)
  }

  return data
}

const getIntensityColor = (intensity: number) => {
  switch (intensity) {
    case 0:
      return "bg-muted"
    case 1:
      return "bg-green-200 dark:bg-green-900"
    case 2:
      return "bg-green-300 dark:bg-green-700"
    case 3:
      return "bg-green-400 dark:bg-green-600"
    case 4:
      return "bg-green-500 dark:bg-green-500"
    default:
      return "bg-muted"
  }
}

const getIntensityLabel = (intensity: number) => {
  switch (intensity) {
    case 0:
      return "No workout"
    case 1:
      return "Light workout"
    case 2:
      return "Moderate workout"
    case 3:
      return "Intense workout"
    case 4:
      return "Very intense workout"
    default:
      return "No data"
  }
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function WorkoutHeatmap() {
  const heatmapData = generateHeatmapData()

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Calendar className="mr-2 h-5 w-5 text-secondary" />
          Workout Activity (Last 12 Weeks)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Day labels */}
          <div className="flex items-center space-x-1">
            <div className="w-8" /> {/* Spacer for week numbers */}
            {dayLabels.map((day, index) => (
              <div key={index} className="w-4 text-xs text-muted-foreground text-center">
                {day[0]}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {heatmapData.map((week, weekIndex) => (
              <motion.div
                key={weekIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: weekIndex * 0.05 }}
                className="flex items-center space-x-1"
              >
                <div className="w-8 text-xs text-muted-foreground text-right">{12 - weekIndex}w</div>
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                    className={`w-4 h-4 rounded-sm ${getIntensityColor(day.intensity)} cursor-pointer transition-all hover:scale-110`}
                    title={`${day.date}: ${getIntensityLabel(day.intensity)}`}
                  />
                ))}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex items-center space-x-1">
              {[0, 1, 2, 3, 4].map((intensity) => (
                <div key={intensity} className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
