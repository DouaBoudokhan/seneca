"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Apple, Dumbbell, Heart, Brain } from "lucide-react"

const suggestions = [
  {
    category: "Motivation",
    icon: Heart,
    color: "text-red-500",
    items: [
      "I'm feeling unmotivated today",
      "How do I stay consistent?",
      "Celebrate my recent wins",
      "Set a new challenge for me",
    ],
  },
  {
    category: "Workouts",
    icon: Dumbbell,
    color: "text-blue-500",
    items: [
      "Suggest a quick 15-minute workout",
      "What muscles should I train today?",
      "Create a home workout routine",
      "How to improve my form?",
    ],
  },
  {
    category: "Nutrition",
    icon: Apple,
    color: "text-green-500",
    items: [
      "What should I eat for breakfast?",
      "Help me meal prep for the week",
      "Am I eating enough protein?",
      "Suggest healthy snacks",
    ],
  },
  {
    category: "Progress",
    icon: TrendingUp,
    color: "text-yellow-500",
    items: [
      "Show my weekly progress",
      "How am I doing with my goals?",
      "What should I focus on next?",
      "Track my improvements",
    ],
  },
  {
    category: "Wellness",
    icon: Brain,
    color: "text-purple-500",
    items: ["Tips for better sleep", "How to manage stress?", "Recovery day activities", "Mindfulness exercises"],
  },
]

interface CoachSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function CoachSuggestions({ onSuggestionClick }: CoachSuggestionsProps) {
  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Lightbulb className="mr-2 h-5 w-5 text-secondary" />
          Suggested Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <category.icon className={`h-4 w-4 ${category.color}`} />
              <span className="text-sm font-medium text-foreground">{category.category}</span>
            </div>
            <div className="space-y-1">
              {category.items.slice(0, 2).map((item, itemIndex) => (
                <Button
                  key={itemIndex}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSuggestionClick(item)}
                  className="w-full justify-start text-xs h-8 bg-transparent hover:bg-muted/50"
                >
                  {item}
                </Button>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Popular this week:</p>
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-muted"
              onClick={() => onSuggestionClick("How's my progress this week?")}
            >
              Progress Check
            </Badge>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-muted"
              onClick={() => onSuggestionClick("Suggest a quick workout")}
            >
              Quick Workout
            </Badge>
            <Badge
              variant="outline"
              className="text-xs cursor-pointer hover:bg-muted"
              onClick={() => onSuggestionClick("I need motivation")}
            >
              Motivation
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
