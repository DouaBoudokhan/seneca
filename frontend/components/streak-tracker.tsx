"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, Target, Zap } from "lucide-react"

const streakData = [
  { day: "Mon", completed: true, type: "workout" },
  { day: "Tue", completed: true, type: "nutrition" },
  { day: "Wed", completed: true, type: "workout" },
  { day: "Thu", completed: true, type: "rest" },
  { day: "Fri", completed: true, type: "workout" },
  { day: "Sat", completed: false, type: "workout" },
  { day: "Sun", completed: false, type: "rest" },
]

const achievements = [
  { name: "Beast Mode", description: "5 workouts this week", icon: Trophy, earned: true },
  { name: "Early Bird", description: "Morning workout streak", icon: Zap, earned: true },
  { name: "Consistency King", description: "14-day streak", icon: Flame, earned: false },
  { name: "Goal Crusher", description: "Hit all weekly targets", icon: Target, earned: false },
]

export function StreakTracker() {
  return (
    <div className="space-y-6">
      {/* Weekly Streak */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Flame className="mr-2 h-5 w-5 text-orange-500" />
            Weekly Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            {streakData.map((day, index) => (
              <motion.div
                key={day.day}
                className="flex flex-col items-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-xs text-muted-foreground">{day.day}</span>
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    day.completed
                      ? "bg-green-500 text-white"
                      : "bg-muted border-2 border-dashed border-muted-foreground"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  animate={day.completed ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ delay: index * 0.2 }}
                >
                  {day.completed && <Flame className="h-4 w-4" />}
                </motion.div>
                <span className="text-xs capitalize text-muted-foreground">{day.type}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">5 Day Streak! 🔥</div>
            <p className="text-sm text-muted-foreground">Keep it up to reach your weekly goal!</p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="glass-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.name}
              className={`flex items-center justify-between p-3 rounded-lg ${
                achievement.earned ? "bg-secondary/20 border border-secondary/30" : "bg-muted/50"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className={`p-2 rounded-full ${
                    achievement.earned
                      ? "bg-secondary text-secondary-foreground pulse-glow"
                      : "bg-muted text-muted-foreground"
                  }`}
                  animate={achievement.earned ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  <achievement.icon className="h-4 w-4" />
                </motion.div>
                <div>
                  <p className="font-medium text-foreground">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
              <Badge variant={achievement.earned ? "default" : "secondary"}>
                {achievement.earned ? "Earned" : "Locked"}
              </Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
