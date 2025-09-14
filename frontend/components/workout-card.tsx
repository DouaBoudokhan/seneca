"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Flame, Users, Play, Heart, Share } from "lucide-react"

interface Workout {
  id: number
  name: string
  duration: number
  calories: number
  difficulty: string
  exercises: number
  category: string
  image: string
  description: string
  tags: string[]
}

interface WorkoutCardProps {
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="glass border-border/50 overflow-hidden group cursor-pointer">
        <div className="relative">
          <img
            src={workout.image || "/placeholder.svg"}
            alt={workout.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Overlay Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Play className="mr-2 h-5 w-5" />
              Start Workout
            </Button>
          </motion.div>

          {/* Top Right Actions */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-black/20 backdrop-blur-sm border-white/20"
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 bg-black/20 backdrop-blur-sm border-white/20">
              <Share className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getDifficultyColor(workout.difficulty)} text-white border-0`}>
              {workout.difficulty}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-secondary transition-colors">
                {workout.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{workout.description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {workout.duration}m
                </div>
                <div className="flex items-center">
                  <Flame className="mr-1 h-4 w-4" />
                  {workout.calories}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {workout.exercises}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {workout.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Button */}
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Play className="mr-2 h-4 w-4" />
              Start Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
