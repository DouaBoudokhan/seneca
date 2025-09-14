"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Volume2, Dumbbell, Apple } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "coach"
  timestamp: Date
  type?: "text" | "suggestion" | "progress"
  data?: any
}

interface ChatMessageProps {
  message: Message
  onSpeak?: (text: string) => void
}

export function ChatMessage({ message, onSpeak }: ChatMessageProps) {
  const isCoach = message.sender === "coach"
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderProgressData = (data: any) => {
    if (!data) return null

    return (
      <Card className="mt-3 glass border-border/50">
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-secondary">{data.workouts}</div>
              <div className="text-xs text-muted-foreground">Workouts</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">{data.proteinDays}</div>
              <div className="text-xs text-muted-foreground">Protein Days</div>
            </div>
            <div>
              <div className="text-lg font-bold text-secondary">{data.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderSuggestionData = (data: any) => {
    if (!data) return null

    return (
      <Card className="mt-3 glass border-border/50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {data.type === "workout" && <Dumbbell className="h-4 w-4 text-secondary" />}
              {data.type === "meal" && <Apple className="h-4 w-4 text-secondary" />}
              <span className="text-sm font-medium text-foreground capitalize">{data.type}</span>
            </div>
            <div className="flex space-x-2">
              {data.duration && <Badge variant="outline">{data.duration} min</Badge>}
              {data.calories && <Badge variant="outline">{data.calories} cal</Badge>}
              {data.protein && <Badge variant="outline">{data.protein}g protein</Badge>}
            </div>
          </div>
          {data.focus && (
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Focus: </span>
              <span className="text-xs font-medium text-foreground capitalize">{data.focus}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isCoach ? "justify-start" : "justify-end"} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isCoach ? "flex-row" : "flex-row-reverse"} items-start space-x-2`}>
        {isCoach && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="/placeholder.svg?key=coach-avatar" alt="Coach" />
            <AvatarFallback className="bg-secondary text-secondary-foreground">AI</AvatarFallback>
          </Avatar>
        )}

        <div className={`flex flex-col ${isCoach ? "items-start" : "items-end"}`}>
          <div
            className={`rounded-lg px-4 py-2 ${
              isCoach ? "bg-muted text-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>

            {message.type === "progress" && renderProgressData(message.data)}
            {message.type === "suggestion" && renderSuggestionData(message.data)}
          </div>

          <div className={`flex items-center mt-1 space-x-2 ${isCoach ? "flex-row" : "flex-row-reverse"}`}>
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
            {isCoach && onSpeak && (
              <Button variant="ghost" size="icon" onClick={() => onSpeak(message.content)} className="h-6 w-6">
                <Volume2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {!isCoach && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
          </Avatar>
        )}
      </div>
    </motion.div>
  )
}
