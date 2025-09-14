"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Target, Award, Calendar, Flame } from "lucide-react"

const weeklyData = [
  { day: "Mon", calories: 2100, protein: 120, carbs: 180, fat: 85 },
  { day: "Tue", calories: 2250, protein: 135, carbs: 200, fat: 90 },
  { day: "Wed", calories: 1950, protein: 110, carbs: 160, fat: 75 },
  { day: "Thu", calories: 2300, protein: 140, carbs: 210, fat: 95 },
  { day: "Fri", calories: 2150, protein: 125, carbs: 185, fat: 80 },
  { day: "Sat", calories: 2400, protein: 145, carbs: 220, fat: 100 },
  { day: "Sun", calories: 2000, protein: 115, carbs: 170, fat: 70 },
]

const macroData = [
  { name: "Protein", value: 25, color: "#f59e0b" },
  { name: "Carbs", value: 45, color: "#dc2626" },
  { name: "Fat", value: 30, color: "#1f2937" },
]

const insights = [
  {
    title: "Protein Intake Trending Up",
    description: "You've increased protein by 15% this week compared to last week",
    trend: "up",
    value: "+15%",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    title: "Calorie Goal Achievement",
    description: "You've hit your calorie target 5 out of 7 days this week",
    trend: "neutral",
    value: "71%",
    icon: Target,
    color: "text-blue-500",
  },
  {
    title: "Hydration Needs Attention",
    description: "Water intake is 20% below recommended levels",
    trend: "down",
    value: "-20%",
    icon: TrendingDown,
    color: "text-red-500",
  },
]

const achievements = [
  { name: "Protein Goal Streak", days: 5, icon: "💪", description: "5 days hitting protein target" },
  { name: "Balanced Meals", count: 12, icon: "⚖️", description: "12 well-balanced meals logged" },
  { name: "Hydration Hero", glasses: 56, icon: "💧", description: "56 glasses of water this week" },
]

export function NutritionInsights() {
  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-muted/50 ${insight.color}`}>
                    <insight.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    <div className={`text-lg font-bold mt-2 ${insight.color}`}>{insight.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Calories Trend */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Flame className="mr-2 h-5 w-5 text-secondary" />
                Weekly Calorie Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Macro Distribution */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Target className="mr-2 h-5 w-5 text-secondary" />
                Macro Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {macroData.map((macro) => (
                  <div key={macro.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                    <span className="text-sm text-foreground">{macro.name}</span>
                    <span className="text-sm text-muted-foreground">{macro.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Protein Intake Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <TrendingUp className="mr-2 h-5 w-5 text-secondary" />
              Daily Protein Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="protein" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Award className="mr-2 h-5 w-5 text-secondary" />
              This Week's Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50 text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {achievement.days && `${achievement.days} days`}
                    {achievement.count && `${achievement.count} meals`}
                    {achievement.glasses && `${achievement.glasses} glasses`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Goals Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Calendar className="mr-2 h-5 w-5 text-secondary" />
              Weekly Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Calorie Target", current: 15400, target: 15400, unit: "cal" },
              { name: "Protein Goal", current: 890, target: 840, unit: "g" },
              { name: "Water Intake", current: 56, target: 56, unit: "glasses" },
              { name: "Balanced Meals", current: 18, target: 21, unit: "meals" },
            ].map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                <Progress
                  value={(goal.current / goal.target) * 100}
                  className="h-2"
                  indicatorClassName={
                    goal.current >= goal.target
                      ? "bg-green-500"
                      : goal.current >= goal.target * 0.8
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
