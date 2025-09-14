"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Flame } from "lucide-react"
import Image from "next/image"

interface AnimatedExerciseCardProps {
  name: string
  duration: string
  calories: number
  image: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  type: "Strength" | "Cardio" | "Flexibility" | "HIIT"
}

export function AnimatedExerciseCard({ name, duration, calories, image, difficulty, type }: AnimatedExerciseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "Strength":
        return "gradient-purple-pink"
      case "Cardio":
        return "gradient-blue-teal"
      case "Flexibility":
        return "gradient-orange-red"
      case "HIIT":
        return "gradient-bg"
      default:
        return "gradient-bg"
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="glass-enhanced overflow-hidden group cursor-pointer h-full flex flex-col">
        <div className="relative flex-shrink-0">
          <div className={`absolute inset-0 ${getTypeGradient(type)} opacity-20`} />
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={300}
            height={200}
            className="w-full h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay with play button */}
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button size="lg" className="rounded-full w-12 h-12 md:w-16 md:h-16 bg-white/20 hover:bg-white/30">
                <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Difficulty badge */}
          <div
            className={`absolute top-2 md:top-3 right-2 md:right-3 px-2 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(difficulty)}`}
          >
            {difficulty}
          </div>
        </div>

        <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2 md:mb-3">
            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors text-sm md:text-base line-clamp-2">{name}</h3>
            <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full ml-2 flex-shrink-0">{type}</span>
          </div>

          <div className="flex items-center justify-between text-xs md:text-sm text-white/70 mb-3 md:mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flame className="h-3 w-3 md:h-4 md:w-4" />
              <span>{calories} cal</span>
            </div>
          </div>

          <motion.div className="mt-auto" whileHover={{ scale: 1.02 }}>
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 text-sm h-9 md:h-10">
              Start Workout
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
