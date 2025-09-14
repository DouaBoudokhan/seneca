"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { FormattedMessageContent } from "@/components/formatted-message-content"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VoiceRecorder } from "@/components/voice-recorder"
import { Send, Volume2, Sparkles, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  sender: "user" | "coach"
  timestamp: Date
  type?: "text" | "workout" | "nutrition" | "motivation" | "progress" | "tip" | "achievement"
  emoji?: string
  priority?: "low" | "normal" | "high"
  data?: any
  suggestions?: string[]
}

const API_BASE_URL = "http://localhost:8000"

const quickSuggestions = [
  "How's my progress this week?",
  "Suggest a quick workout",
  "What should I eat for lunch?",
  "I'm feeling unmotivated",
  "Plan my rest day",
  "Review my nutrition goals",
]

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginUserId, setLoginUserId] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [fatigueStatus, setFatigueStatus] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-send message when both transcript and audio are ready
  useEffect(() => {
    if (inputMessage && audioBlob && !isTyping) {
      console.log("Sending message with audio:", { transcript: inputMessage, audioSize: audioBlob.size })
      sendMessage(inputMessage, audioBlob)
    }
  }, [inputMessage, audioBlob, isTyping])

  const handleLogin = async () => {
    if (!loginUserId.trim()) return
    
    setIsLoggingIn(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: loginUserId.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setIsLoggedIn(true)
        setUserData(data.user_data)
        setMessages([
          {
            id: "1",
            content: `${data.message} I'm your AI fitness coach and I have access to your personal fitness data. How can I help you today?`,
            sender: "coach",
            timestamp: new Date(),
          },
        ])
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("Failed to connect to the server. Please make sure the backend is running.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const sendMessage = async (content: string, audio?: Blob | null) => {
    if (!content.trim() || isTyping || !isLoggedIn) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setFatigueStatus(null)

    // If audio is present, get fatigue prediction FIRST and wait for it
    let fatigueResult: string | null = null
    let fatigueProb: number | null = null
    if (audio) {
      console.log("Sending audio to fatigue API:", audio.size, "bytes")
      try {
        const formData = new FormData()
        formData.append("audio", audio, "voice.wav")
        const resp = await fetch(`${API_BASE_URL}/api/predict-fatigue`, {
          method: "POST",
          body: formData,
        })
        console.log("Fatigue API response status:", resp.status)
        const fatigueData = await resp.json()
        console.log("Fatigue API response data:", fatigueData)
        if (fatigueData.success) {
          fatigueResult = fatigueData.tired ? "You sound tired!" : "You sound energetic!"
          fatigueProb = fatigueData.probability
          setFatigueStatus(fatigueResult)
          console.log("Fatigue analysis complete:", fatigueResult, "Probability:", fatigueProb)
        } else {
          setFatigueStatus("Fatigue prediction failed.")
        }
      } catch (err) {
        console.error("Fatigue prediction error:", err)
        setFatigueStatus("Fatigue prediction error.")
      }
    }

    // Now send the chat message with fatigue information
    try {
      const chatData: any = { 
        message: content.trim(),
        user_id: loginUserId 
      }
      
      // Include fatigue data if available
      if (fatigueResult) {
        chatData.fatigue_status = fatigueResult
        chatData.fatigue_probability = fatigueProb
        console.log("Including fatigue data in chat request:", chatData)
      }

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "coach",
        timestamp: new Date(data.timestamp),
        type: data.message_type || "text",
        emoji: data.emoji,
        priority: data.priority || "normal",
        data: data.data,
        suggestions: data.suggestions
      }

      setMessages(prev => [...prev, coachMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to the server. Please make sure the backend is running and try again.",
        sender: "coach",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      setAudioBlob(null)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (isLoggedIn) {
        sendMessage(inputMessage)
      } else {
        handleLogin()
      }
    }
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="flex h-screen">
          <Sidebar />

          <main className="flex-1 overflow-auto">
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div>
                  <motion.h1
                    className="text-xl md:text-2xl font-bold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    AI Fitness Coach
                  </motion.h1>
                  <motion.p
                    className="text-xs md:text-sm text-white/80"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Login to access your personal trainer
                  </motion.p>
                </div>
                <ThemeToggle />
              </div>
            </header>

            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">Welcome to AI Fitness Coach</h2>
                      <p className="text-white/70 text-sm">Enter your user ID to access your personalized fitness assistant</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          User ID
                        </label>
                        <Input
                          value={loginUserId}
                          onChange={(e) => setLoginUserId(e.target.value)}
                          placeholder="user_00001"
                          onKeyPress={handleKeyPress}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                          disabled={isLoggingIn}
                        />
                        <p className="text-xs text-white/50 mt-1">Format: user_XXXXX (e.g., user_00001)</p>
                      </div>

                      <Button
                        onClick={handleLogin}
                        disabled={!loginUserId.trim() || isLoggingIn}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        {isLoggingIn ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          "Login to AI Coach"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Main Chat Interface
  return (
    <div className="min-h-screen gradient-bg">
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-hidden">
          <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div>
                <motion.h1
                  className="text-xl md:text-2xl font-bold text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  AI Fitness Coach
                </motion.h1>
                <motion.p
                  className="text-xs md:text-sm text-white/80"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Welcome back, {loginUserId}
                </motion.p>
              </div>
              <ThemeToggle />
            </div>
          </header>

          <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex w-full",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex max-w-[85%] md:max-w-[70%] gap-3",
                        message.sender === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {/* Avatar with type-based styling */}
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/20 relative",
                          message.sender === "user"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600"
                            : message.type === "workout"
                            ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500"
                            : message.type === "nutrition"
                            ? "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500"
                            : message.type === "motivation"
                            ? "bg-gradient-to-br from-pink-500 via-rose-500 to-red-500"
                            : message.type === "progress"
                            ? "bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500"
                            : message.type === "tip"
                            ? "bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500"
                            : message.type === "achievement"
                            ? "bg-gradient-to-br from-amber-500 via-yellow-500 to-lime-500"
                            : "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                        )}
                      >
                        {message.sender === "user" ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
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
                            {message.emoji ? (
                              <span className="text-lg">{message.emoji}</span>
                            ) : (
                              <Sparkles className="h-5 w-5 text-white" />
                            )}
                          </motion.div>
                        )}
                        
                        {/* Priority indicator */}
                        {message.priority === "high" && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse ring-2 ring-white" />
                        )}
                      </motion.div>

                      {/* Message Bubble */}
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "rounded-2xl px-5 py-3 relative shadow-lg transition-all duration-300",
                          message.sender === "user"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25"
                            : "bg-gradient-to-br from-white/15 to-white/5 text-white border border-white/30 backdrop-blur-md shadow-purple-500/10"
                        )}
                      >
                        {/* Message content with better typography */}
                        <div className="relative z-10">
                          {/* Message type header for coach messages */}
                          {message.sender === "coach" && message.type && message.type !== "text" && (
                            <div className="flex items-center space-x-2 mb-2 opacity-80">
                              {message.emoji && <span className="text-sm">{message.emoji}</span>}
                              <span className="text-xs font-medium text-white/80 capitalize tracking-wide">
                                {message.type === "workout" && "💪 Workout Plan"}
                                {message.type === "nutrition" && "🥗 Nutrition Advice"}
                                {message.type === "motivation" && "🔥 Motivation Boost"}
                                {message.type === "progress" && "📊 Progress Update"}
                                {message.type === "tip" && "💡 Fitness Tip"}
                                {message.type === "achievement" && "🏆 Achievement"}
                              </span>
                              {message.priority === "high" && (
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                              )}
                            </div>
                          )}
                          
                          {/* Message content with enhanced formatting */}
                          {message.sender === "coach" ? (
                            <FormattedMessageContent 
                              content={message.content}
                              type={message.type}
                              data={message.data}
                            />
                          ) : (
                            <p className="text-sm leading-relaxed font-medium tracking-wide">
                              {message.content}
                            </p>
                          )}
                          
                          {/* Enhanced timestamp */}
                          <p className="text-xs opacity-60 mt-2 font-light">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {/* Glassmorphism effect overlay */}
                        {message.sender === "coach" && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                        )}

                        {/* Enhanced speak button for coach messages */}
                        {message.sender === "coach" && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute -bottom-2 -right-2"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border border-white/30 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                              onClick={() => 
                                isSpeaking ? stopSpeaking() : speakText(message.content)
                              }
                            >
                              <Volume2 className={cn(
                                "h-3 w-3 transition-colors",
                                isSpeaking ? "text-red-300" : "text-white"
                              )} />
                            </Button>
                          </motion.div>
                        )}

                        {/* Message tail/pointer */}
                        <div
                          className={cn(
                            "absolute top-3 w-3 h-3 transform rotate-45",
                            message.sender === "user"
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 -right-1"
                              : "bg-gradient-to-br from-white/15 to-white/5 border-l border-t border-white/30 -left-1"
                          )}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Dynamic Suggestions after last coach message */}
              {messages.length > 1 && messages[messages.length - 1].sender === "coach" && 
               messages[messages.length - 1].suggestions && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex flex-wrap gap-2 max-w-[85%] md:max-w-[70%] ml-13">
                    <div className="text-xs text-white/60 mb-2 w-full">💡 Quick actions:</div>
                    {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSuggestionClick(suggestion.replace(/[🔄📝💬⏱️🛒📱📊🎯🏆📅💪🎵📚💾❓🎉📸🌟]/g, '').trim())}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-full px-3 py-1.5 text-xs text-white transition-all duration-200 backdrop-blur-sm"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="flex justify-start"
                >
                  <div className="flex max-w-[70%] gap-3 items-end">
                    {/* Animated coach avatar */}
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg ring-2 ring-white/20"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 4px 14px 0 rgba(168, 85, 247, 0.25)",
                          "0 4px 20px 0 rgba(168, 85, 247, 0.4)",
                          "0 4px 14px 0 rgba(168, 85, 247, 0.25)"
                        ]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Sparkles className="h-5 w-5 text-white" />
                      </motion.div>
                    </motion.div>
                    
                    {/* Enhanced typing bubble */}
                    <motion.div 
                      className="bg-gradient-to-br from-white/15 to-white/5 border border-white/30 rounded-2xl px-5 py-4 backdrop-blur-md shadow-lg relative"
                      animate={{ 
                        borderColor: [
                          "rgba(255, 255, 255, 0.3)",
                          "rgba(168, 85, 247, 0.4)",
                          "rgba(255, 255, 255, 0.3)"
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Glassmorphism overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                      
                      {/* AI thinking text */}
                      <div className="relative z-10 mb-2">
                        <span className="text-xs text-white/80 font-medium">AI Coach is thinking...</span>
                      </div>
                      
                      {/* Enhanced typing dots */}
                      <div className="flex space-x-1.5 relative z-10">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-sm"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.7, 1, 0.7],
                              y: [0, -2, 0]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Message tail */}
                      <div className="absolute top-3 w-3 h-3 transform rotate-45 bg-gradient-to-br from-white/15 to-white/5 border-l border-t border-white/30 -left-1" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Quick Suggestions */}
              {messages.length === 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="px-4"
                >
                  <div className="text-center mb-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-sm text-white/60 font-medium"
                    >
                      ✨ Here are some things I can help you with:
                    </motion.p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {[
                      { text: "💪 Create a workout plan", emoji: "💪", gradient: "from-orange-500 to-red-500", icon: "workout" },
                      { text: "🥗 Plan healthy meals", emoji: "🥗", gradient: "from-green-500 to-emerald-500", icon: "nutrition" },
                      { text: "📊 Check my progress", emoji: "📊", gradient: "from-purple-500 to-violet-500", icon: "progress" },
                      { text: "💡 Get fitness tips", emoji: "💡", gradient: "from-yellow-500 to-amber-500", icon: "tips" },
                      { text: "🎯 Set new goals", emoji: "🎯", gradient: "from-blue-500 to-cyan-500", icon: "goals" },
                      { text: "🏆 Track achievements", emoji: "🏆", gradient: "from-amber-500 to-yellow-500", icon: "achievements" }
                    ].map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                      >
                        <div className={`bg-gradient-to-br ${suggestion.gradient} p-0.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}>
                          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 h-full border border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{suggestion.emoji}</div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-white">
                                  {suggestion.text.substring(2)}
                                </span>
                              </div>
                              <div className="w-2 h-2 bg-white/40 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-center mt-6"
                  >
                    <p className="text-xs text-white/40">
                      Or type your own message below! 👇
                    </p>
                  </motion.div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t border-white/10 bg-black/30 backdrop-blur-md p-4">
              <div className="flex gap-3 max-w-4xl mx-auto">
                {/* Enhanced Input Field */}
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your fitness journey... 💪"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-xl pl-4 pr-12 py-3 transition-all duration-200"
                    disabled={isTyping}
                  />
                  
                  {/* Input status indicator */}
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {inputMessage.trim() ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                    ) : (
                      <div className="w-2 h-2 bg-white/20 rounded-full" />
                    )}
                  </div>
                </div>

                {/* Enhanced Voice Recorder Button */}
                <VoiceRecorder
                  onTranscript={(transcript) => {
                    setInputMessage(transcript)
                  }}
                  onAudio={(blob) => {
                    setAudioBlob(blob)
                    console.log("Audio blob received:", blob)
                  }}
                  isListening={isListening}
                  setIsListening={setIsListening}
                  className="ml-1"
                />

                {/* Enhanced Send Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => sendMessage(inputMessage, audioBlob)}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20"
                  >
                    {isTyping ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Send className="h-4 w-4" />
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Enhanced Fatigue status display */}
              {fatigueStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-center mt-3"
                >
                  <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-yellow-300 font-medium">{fatigueStatus}</span>
                  </div>
                </motion.div>
              )}
              
              {/* Typing indicator for user */}
              {inputMessage.trim() && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-2"
                >
                  <p className="text-xs text-white/40">
                    Press Enter to send or click the send button ✨
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}