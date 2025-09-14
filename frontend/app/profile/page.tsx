"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Edit3, Save, Camera, Target, Award } from "lucide-react"

const fitnessGoals = ["Weight Loss", "Muscle Gain", "Endurance", "Strength", "Flexibility", "General Health"]

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little/no exercise)" },
  { value: "light", label: "Light (1-3 days/week)" },
  { value: "moderate", label: "Moderate (3-5 days/week)" },
  { value: "active", label: "Active (6-7 days/week)" },
  { value: "very-active", label: "Very Active (2x/day)" },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    age: "28",
    weight: "75",
    height: "175",
    activityLevel: "moderate",
    goals: ["Weight Loss", "Strength"],
    bio: "Passionate about fitness and healthy living. Looking to build strength while maintaining a healthy weight.",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Here you would save to your backend/database
  }

  const achievements = [
    { name: "First Workout", icon: "🏃", date: "2024-01-15" },
    { name: "7-Day Streak", icon: "🔥", date: "2024-01-22" },
    { name: "Weight Goal", icon: "🎯", date: "2024-02-01" },
    { name: "Strength Milestone", icon: "💪", date: "2024-02-15" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your personal information and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                      <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="text-2xl font-bold"
                        />
                        <Input
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          type="email"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                        <p className="text-muted-foreground">{profile.email}</p>
                      </>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                      {profile.goals.map((goal) => (
                        <Badge key={goal} variant="secondary">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <User className="mr-2 h-5 w-5 text-secondary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age">Age</Label>
                      {isEditing ? (
                        <Input
                          id="age"
                          value={profile.age}
                          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                          type="number"
                        />
                      ) : (
                        <p className="text-foreground font-medium">{profile.age} years</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      {isEditing ? (
                        <Input
                          id="weight"
                          value={profile.weight}
                          onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                          type="number"
                        />
                      ) : (
                        <p className="text-foreground font-medium">{profile.weight} kg</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    {isEditing ? (
                      <Input
                        id="height"
                        value={profile.height}
                        onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                        type="number"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.height} cm</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="activity">Activity Level</Label>
                    {isEditing ? (
                      <Select
                        value={profile.activityLevel}
                        onValueChange={(value) => setProfile({ ...profile, activityLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {activityLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-foreground font-medium">
                        {activityLevels.find((l) => l.value === profile.activityLevel)?.label}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="text-muted-foreground">{profile.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Fitness Goals & Achievements */}
            <div className="space-y-6">
              {/* Fitness Goals */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Target className="mr-2 h-5 w-5 text-secondary" />
                      Fitness Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label>Select your goals</Label>
                        <div className="flex flex-wrap gap-2">
                          {fitnessGoals.map((goal) => (
                            <Badge
                              key={goal}
                              variant={profile.goals.includes(goal) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const newGoals = profile.goals.includes(goal)
                                  ? profile.goals.filter((g) => g !== goal)
                                  : [...profile.goals, goal]
                                setProfile({ ...profile, goals: newGoals })
                              }}
                            >
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.goals.map((goal) => (
                          <Badge key={goal} variant="secondary">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Award className="mr-2 h-5 w-5 text-secondary" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
