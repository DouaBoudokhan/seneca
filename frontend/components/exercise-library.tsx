"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Play, Plus } from "lucide-react"

const exercises = [
  {
    id: 1,
    name: "Push-ups",
    category: "Chest",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    muscles: ["Chest", "Triceps", "Shoulders"],
    instructions: "Start in plank position, lower body to ground, push back up",
    image: "/placeholder-wxi96.png",
    video: "/placeholder-5nrik.png",
  },
  {
    id: 2,
    name: "Squats",
    category: "Legs",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    instructions: "Stand with feet shoulder-width apart, lower hips back and down, return to standing",
    image: "/squat-exercise.png",
    video: "/placeholder-iqgax.png",
  },
  {
    id: 3,
    name: "Deadlift",
    category: "Back",
    difficulty: "Intermediate",
    equipment: "Barbell",
    muscles: ["Hamstrings", "Glutes", "Lower Back"],
    instructions: "Stand with feet hip-width apart, hinge at hips, lower bar to ground, return to standing",
    image: "/deadlift-exercise.png",
    video: "/placeholder-xlpwi.png",
  },
  {
    id: 4,
    name: "Plank",
    category: "Core",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    muscles: ["Core", "Shoulders", "Glutes"],
    instructions: "Hold body in straight line from head to heels, engage core muscles",
    image: "/plank-exercise.png",
    video: "/placeholder-7s4up.png",
  },
  {
    id: 5,
    name: "Pull-ups",
    category: "Back",
    difficulty: "Advanced",
    equipment: "Pull-up Bar",
    muscles: ["Lats", "Biceps", "Rhomboids"],
    instructions: "Hang from bar, pull body up until chin clears bar, lower with control",
    image: "/placeholder-4ebg9.png",
    video: "/placeholder-8zozp.png",
  },
  {
    id: 6,
    name: "Burpees",
    category: "Cardio",
    difficulty: "Intermediate",
    equipment: "Bodyweight",
    muscles: ["Full Body"],
    instructions: "Squat down, jump back to plank, do push-up, jump feet forward, jump up",
    image: "/burpee-exercise.png",
    video: "/placeholder-dc0z4.png",
  },
]

const categories = ["All", "Chest", "Back", "Legs", "Core", "Shoulders", "Arms", "Cardio"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]
const equipment = ["All", "Bodyweight", "Barbell", "Dumbbell", "Machine", "Pull-up Bar"]

export function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedEquipment, setSelectedEquipment] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || exercise.difficulty === selectedDifficulty
    const matchesEquipment = selectedEquipment === "All" || exercise.equipment === selectedEquipment
    return matchesSearch && matchesCategory && matchesDifficulty && matchesEquipment
  })

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
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="glass border-border/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 border-t border-border pt-4"
              >
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty)}
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Equipment</label>
                  <div className="flex flex-wrap gap-2">
                    {equipment.map((equip) => (
                      <Button
                        key={equip}
                        variant={selectedEquipment === equip ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedEquipment(equip)}
                      >
                        {equip}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img
                  src={exercise.image || "/placeholder.svg"}
                  alt={exercise.name}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </Button>
                </div>

                {/* Difficulty Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={`${getDifficultyColor(exercise.difficulty)} text-white border-0`}>
                    {exercise.difficulty}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground">{exercise.category}</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {exercise.muscles.slice(0, 3).map((muscle) => (
                      <Badge key={muscle} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{exercise.instructions}</p>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Play className="mr-2 h-4 w-4" />
                      Demo
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No exercises found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("All")
              setSelectedDifficulty("All")
              setSelectedEquipment("All")
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
