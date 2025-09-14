"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ProgressRingProps {
  title: string
  value: number
  target: number
  icon: LucideIcon
  color: string
  gradientClass: string
  unit?: string
}

export function ProgressRing({ title, value, target, icon: Icon, color, gradientClass, unit = "" }: ProgressRingProps) {
  const percentage = Math.min((value / target) * 100, 100)
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Card className="glass-enhanced rounded-2xl p-4 md:p-6 hover:glow-effect transition-all duration-300 h-full border-0">
      <CardContent className="p-0 flex flex-col items-center space-y-3 md:space-y-4 h-full justify-center">
        <div className="relative w-20 h-20 md:w-28 md:h-28">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/20"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={gradientClass.split(" ")[0]} />
                <stop offset="100%" className={gradientClass.split(" ")[1]} />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Icon className={`h-4 w-4 md:h-5 md:w-5 ${color} mb-1`} />
            <motion.div
              className="text-lg md:text-xl font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {value}
            </motion.div>
            <div className="text-xs text-white/60">
              / {target}
              {unit}
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="font-medium text-white text-sm md:text-base">{title}</h3>
          <div className="text-xs md:text-sm text-white/70">{percentage.toFixed(0)}% complete</div>
        </div>
      </CardContent>
    </Card>
  )
}
