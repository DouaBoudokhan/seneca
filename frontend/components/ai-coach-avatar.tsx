"use client"

import { motion } from "framer-motion"
import { MessageCircle, Mic, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export function AICoachAvatar() {
  const [isListening, setIsListening] = useState(false)
  const [message, setMessage] = useState("Great job on yesterday's workout! Ready for today's challenge?")

  const motivationalMessages = [
    "You're crushing your goals! Keep it up! 💪",
    "Remember: consistency beats perfection every time!",
    "Your body can do it. It's your mind you need to convince!",
    "Every workout is a step closer to your best self!",
    "Progress, not perfection. You've got this!",
  ]

  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // Simulate voice input processing
    setTimeout(() => {
      setIsListening(false)
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
      setMessage(randomMessage)
    }, 2000)
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      {/* Chat bubble */}
      <motion.div
        className="mb-4 mr-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <Card className="glass-enhanced max-w-xs">
          <CardContent className="p-3">
            <p className="text-sm text-foreground">{message}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Avatar */}
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full gradient-blue-teal flex items-center justify-center shadow-lg float-animation"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
        </motion.div>

        {/* Voice controls */}
        <div className="absolute -top-2 -left-2 flex space-x-1">
          <Button
            size="sm"
            variant="secondary"
            className={`w-8 h-8 rounded-full p-0 ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
            onClick={handleVoiceInput}
          >
            <Mic className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="secondary" className="w-8 h-8 rounded-full p-0">
            <Volume2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Listening indicator */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
          />
        )}
      </div>
    </motion.div>
  )
}
