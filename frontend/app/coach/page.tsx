"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const sendMessage = async (content: string) => {
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

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: content.trim(),
          user_id: loginUserId 
        }),
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
                      {/* Avatar */}
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          message.sender === "user"
                            ? "bg-blue-500"
                            : "bg-gradient-to-r from-purple-500 to-pink-500"
                        )}
                      >
                        {message.sender === "user" ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Sparkles className="h-4 w-4 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2 relative",
                          message.sender === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-white/10 text-white border border-white/20 backdrop-blur-sm"
                        )}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {/* Timestamp */}
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {/* Speak button for coach messages */}
                        {message.sender === "coach" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -bottom-2 -right-2 h-6 w-6 p-0 bg-white/10 hover:bg-white/20 border border-white/20"
                            onClick={() => 
                              isSpeaking ? stopSpeaking() : speakText(message.content)
                            }
                          >
                            <Volume2 className={cn(
                              "h-3 w-3",
                              isSpeaking ? "text-red-400" : "text-white"
                            )} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex max-w-[70%] gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Suggestions */}
              {messages.length === 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 justify-center px-4"
                >
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm p-4">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your fitness journey..."
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                  disabled={isTyping}
                />
                {/* Voice Recorder Button */}
                <VoiceRecorder
                  onTranscript={(transcript) => setInputMessage(transcript)}
                  isListening={isListening}
                  setIsListening={setIsListening}
                  className="ml-1"
                />
                <Button
                  onClick={() => sendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6"
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}