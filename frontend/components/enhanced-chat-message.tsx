"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Volume2, 
  Dumbbell, 
  Apple, 
  Heart,
  Trophy,
  Target,
  Zap,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  Flame,
  User,
  Sparkles,
  ThumbsUp,
  Share2,
  Bookmark
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedMessage {
  id: string
  content: string
  sender: "user" | "coach"
  timestamp: Date
  type?: "text" | "workout" | "nutrition" | "motivation" | "progress" | "tip" | "achievement"
  data?: any
  emoji?: string
  priority?: "low" | "normal" | "high"
}

interface EnhancedChatMessageProps {
  message: EnhancedMessage
  onSpeak?: (text: string) => void
  onReact?: (messageId: string, reaction: string) => void
  onShare?: (messageId: string) => void
  onBookmark?: (messageId: string) => void
}

const getMessageIcon = (type: string) => {
  switch (type) {
    case "workout":
      return <Dumbbell className="h-4 w-4" />
    case "nutrition":
      return <Apple className="h-4 w-4" />
    case "motivation":
      return <Heart className="h-4 w-4" />
    case "progress":
      return <TrendingUp className="h-4 w-4" />
    case "tip":
      return <Zap className="h-4 w-4" />
    case "achievement":
      return <Trophy className="h-4 w-4" />
    default:
      return <Sparkles className="h-4 w-4" />
  }
}

const getMessageColors = (type: string, sender: string) => {
  if (sender === "user") {
    return {
      avatar: "bg-gradient-to-br from-blue-500 to-blue-600",
      bubble: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25",
      border: ""
    }
  }

  switch (type) {
    case "workout":
      return {
        avatar: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
        bubble: "bg-gradient-to-br from-orange-500/15 to-red-500/5 border-orange-500/30",
        border: "border-orange-500/30"
      }
    case "nutrition":
      return {
        avatar: "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
        bubble: "bg-gradient-to-br from-green-500/15 to-emerald-500/5 border-green-500/30",
        border: "border-green-500/30"
      }
    case "motivation":
      return {
        avatar: "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500",
        bubble: "bg-gradient-to-br from-pink-500/15 to-rose-500/5 border-pink-500/30",
        border: "border-pink-500/30"
      }
    case "progress":
      return {
        avatar: "bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500",
        bubble: "bg-gradient-to-br from-purple-500/15 to-violet-500/5 border-purple-500/30",
        border: "border-purple-500/30"
      }
    case "tip":
      return {
        avatar: "bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500",
        bubble: "bg-gradient-to-br from-yellow-500/15 to-amber-500/5 border-yellow-500/30",
        border: "border-yellow-500/30"
      }
    case "achievement":
      return {
        avatar: "bg-gradient-to-br from-amber-500 via-yellow-500 to-lime-500",
        bubble: "bg-gradient-to-br from-amber-500/15 to-yellow-500/5 border-amber-500/30",
        border: "border-amber-500/30"
      }
    default:
      return {
        avatar: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
        bubble: "bg-gradient-to-br from-white/15 to-white/5 border-white/30",
        border: "border-white/30"
      }
  }
}

const MessageTypeCard = ({ type, data }: { type: string; data: any }) => {
  if (!data) return null

  const colors = getMessageColors(type, "coach")

  switch (type) {
    case "workout":
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("mt-3 p-4 rounded-lg backdrop-blur-md border", colors.bubble, colors.border)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={cn("p-2 rounded-full", colors.avatar)}>
                <Dumbbell className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{data.name || "Workout Plan"}</h4>
                <p className="text-xs text-white/70">{data.focus || "Full body"}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {data.duration && <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white">{data.duration} min</Badge>}
              {data.difficulty && <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white">{data.difficulty}</Badge>}
            </div>
          </div>
          {data.exercises && (
            <div className="space-y-1">
              {data.exercises.slice(0, 3).map((exercise: string, i: number) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-white/80">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span>{exercise}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )

    case "nutrition":
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("mt-3 p-4 rounded-lg backdrop-blur-md border", colors.bubble, colors.border)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={cn("p-2 rounded-full", colors.avatar)}>
                <Apple className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{data.name || "Meal Plan"}</h4>
                <p className="text-xs text-white/70">{data.mealType || "Balanced nutrition"}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {data.calories && <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white">{data.calories} cal</Badge>}
              {data.protein && <Badge variant="outline" className="text-xs bg-white/10 border-white/20 text-white">{data.protein}g protein</Badge>}
            </div>
          </div>
          {data.ingredients && (
            <div className="grid grid-cols-2 gap-1">
              {data.ingredients.slice(0, 4).map((ingredient: string, i: number) => (
                <div key={i} className="flex items-center space-x-1 text-xs text-white/80">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>{ingredient}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )

    case "progress":
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("mt-3 p-4 rounded-lg backdrop-blur-md border", colors.bubble, colors.border)}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            {Object.entries(data).slice(0, 3).map(([key, value], i) => (
              <div key={i}>
                <div className="text-lg font-bold text-white">{value as string}</div>
                <div className="text-xs text-white/70 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )

    default:
      return null
  }
}

export function EnhancedChatMessage({ 
  message, 
  onSpeak, 
  onReact, 
  onShare, 
  onBookmark 
}: EnhancedChatMessageProps) {
  const isCoach = message.sender === "coach"
  const colors = getMessageColors(message.type || "text", message.sender)
  const messageIcon = getMessageIcon(message.type || "text")
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getPriorityIndicator = () => {
    if (message.priority === "high") {
      return <Flame className="h-3 w-3 text-orange-400 animate-pulse" />
    }
    if (message.priority === "low") {
      return <Clock className="h-3 w-3 text-blue-400" />
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isCoach ? "justify-start" : "justify-end"} mb-6`}
    >
      <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${isCoach ? "flex-row" : "flex-row-reverse"}`}>
        {/* Enhanced Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/20 relative",
            colors.avatar
          )}
        >
          {isCoach ? (
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {messageIcon}
            </motion.div>
          ) : (
            <User className="h-5 w-5 text-white" />
          )}
          
          {/* Priority indicator */}
          {message.priority && message.priority !== "normal" && (
            <div className="absolute -top-1 -right-1">
              {getPriorityIndicator()}
            </div>
          )}
        </motion.div>

        {/* Message Content */}
        <div className={`flex flex-col ${isCoach ? "items-start" : "items-end"}`}>
          {/* Message Type Header */}
          {isCoach && message.type && message.type !== "text" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-1 mb-1"
            >
              {messageIcon}
              <span className="text-xs font-medium text-white/80 capitalize">
                {message.type} {message.emoji && <span className="ml-1">{message.emoji}</span>}
              </span>
            </motion.div>
          )}

          {/* Message Bubble */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "rounded-2xl px-5 py-3 relative shadow-lg transition-all duration-300 backdrop-blur-md border",
              colors.bubble,
              colors.border
            )}
          >
            {/* Message content */}
            <div className="relative z-10">
              <p className="text-sm leading-relaxed font-medium tracking-wide text-white">
                {message.content}
              </p>
              
              {/* Message Type Card */}
              {isCoach && message.type && message.type !== "text" && (
                <MessageTypeCard type={message.type} data={message.data} />
              )}
              
              {/* Enhanced timestamp */}
              <p className="text-xs opacity-60 mt-2 font-light">
                {formatTime(message.timestamp)}
              </p>
            </div>

            {/* Glassmorphism effect overlay */}
            {isCoach && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-50" />
            )}

            {/* Message tail/pointer */}
            <div
              className={cn(
                "absolute top-3 w-3 h-3 transform rotate-45",
                isCoach ? "-left-1" : "-right-1",
                colors.bubble.includes("bg-gradient") ? colors.bubble.split(" ")[0] : "bg-white/15",
                isCoach && "border-l border-t " + colors.border.split("-").slice(1).join("-")
              )}
            />
          </motion.div>

          {/* Enhanced action buttons */}
          {isCoach && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-1 mt-2"
            >
              {/* Speak button */}
              {onSpeak && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  onClick={() => onSpeak(message.content)}
                >
                  <Volume2 className="h-3 w-3 text-white" />
                </Button>
              )}

              {/* Reaction button */}
              {onReact && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  onClick={() => onReact(message.id, "👍")}
                >
                  <ThumbsUp className="h-3 w-3 text-white" />
                </Button>
              )}

              {/* Share button */}
              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  onClick={() => onShare(message.id)}
                >
                  <Share2 className="h-3 w-3 text-white" />
                </Button>
              )}

              {/* Bookmark button */}
              {onBookmark && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  onClick={() => onBookmark(message.id)}
                >
                  <Bookmark className="h-3 w-3 text-white" />
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}