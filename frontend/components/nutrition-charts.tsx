"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts"
import { Apple, Droplets, Target, TrendingUp } from "lucide-react"

const nutritionData = [
  { date: "Jan 1", calories: 2100, protein: 120, carbs: 180, fat: 85, water: 8 },
  { date: "Jan 8", calories: 2250, protein: 135, carbs: 200, fat: 90, water: 7 },
  { date: "Jan 15", calories: 2150, protein: 125, carbs: 185, fat: 80, water: 9 },
  { date: "Jan 22", calories: 2300, protein: 140, carbs: 210, fat: 95, water: 8 },
  { date: "Jan 29", calories: 2000, protein: 115, carbs: 170, fat: 70, water: 10 },
  { date: "Feb 5", calories: 2200, protein: 130, carbs: 195, fat: 85, water: 8 },
  { date: "Feb 12", calories: 2150, protein: 125, carbs: 180, fat: 82, water: 9 },
]

const macroDistribution = [
  { name: "Protein", value: 25, color: "#f59e0b" },
  { name: "Carbs", value: 45, color: "#dc2626" },
  { name: "Fat", value: 30, color: "#1f2937" },
]

const mealTimingData = [
  { meal: "Breakfast", calories: 450, protein: 25, time: "8:00 AM" },
  { meal: "Lunch", calories: 650, protein: 35, time: "12:30 PM" },
  { meal: "Snack", calories: 200, protein: 10, time: "3:30 PM" },
  { meal: "Dinner", calories: 700, protein: 40, time: "7:00 PM" },
  { meal: "Evening", calories: 150, protein: 8, time: "9:30 PM" },
]

const hydrationData = [
  { day: "Mon", glasses: 8, goal: 8 },
  { day: "Tue", glasses: 6, goal: 8 },
  { day: "Wed", glasses: 9, goal: 8 },
  { day: "Thu", glasses: 7, goal: 8 },
  { day: "Fri", glasses: 8, goal: 8 },
  { day: "Sat", glasses: 10, goal: 8 },
  { day: "Sun", glasses: 7, goal: 8 },
]

interface NutritionChartsProps {
  timeRange: string
}

export function NutritionCharts({ timeRange }: NutritionChartsProps) {
  return (
    <div className="space-y-6">
      {/* Calorie Intake and Macro Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <TrendingUp className="mr-2 h-5 w-5 text-secondary" />
                Daily Calorie Intake
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
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

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Target className="mr-2 h-5 w-5 text-secondary" />
                Macro Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={macroDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {macroDistribution.map((macro) => (
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

      {/* Protein Intake and Hydration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Apple className="mr-2 h-5 w-5 text-secondary" />
                Protein Intake Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="protein" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="protein"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Droplets className="mr-2 h-5 w-5 text-secondary" />
                Daily Hydration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hydrationData}>
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
                  <Bar dataKey="glasses" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="goal" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Meal Timing Analysis */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Apple className="mr-2 h-5 w-5 text-secondary" />
              Meal Distribution Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mealTimingData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="meal" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="calories" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
