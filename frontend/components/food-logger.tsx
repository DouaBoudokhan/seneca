"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Search, Camera, Barcode, Plus } from "lucide-react"

const popularFoods = [
  { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: "Greek Yogurt (1 cup)", calories: 140, protein: 20, carbs: 9, fat: 0 },
  { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 4 },
  { name: "Brown Rice (1 cup)", calories: 216, protein: 5, carbs: 45, fat: 2 },
  { name: "Avocado (1 medium)", calories: 234, protein: 3, carbs: 12, fat: 21 },
  { name: "Almonds (1 oz)", calories: 164, protein: 6, carbs: 6, fat: 14 },
]

const recentFoods = [
  { name: "Oatmeal with berries", calories: 280, protein: 8, carbs: 45, fat: 6 },
  { name: "Grilled chicken salad", calories: 450, protein: 35, carbs: 15, fat: 25 },
  { name: "Apple with almond butter", calories: 180, protein: 6, carbs: 20, fat: 12 },
]

interface FoodLoggerProps {
  onClose: () => void
}

export function FoodLogger({ onClose }: FoodLoggerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMeal, setSelectedMeal] = useState("breakfast")
  const [selectedFoods, setSelectedFoods] = useState<any[]>([])
  const [showCamera, setShowCamera] = useState(false)

  const filteredFoods = popularFoods.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const addFood = (food: any) => {
    setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }])
  }

  const removeFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, quantity: number) => {
    setSelectedFoods(selectedFoods.map((food, i) => (i === index ? { ...food, quantity } : food)))
  }

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories * food.quantity, 0)
  const totalProtein = selectedFoods.reduce((sum, food) => sum + food.protein * food.quantity, 0)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <Card className="glass border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Log Food</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meal Selection */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-2 block">Add to meal:</Label>
              <div className="flex gap-2">
                {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
                  <Button
                    key={meal}
                    variant={selectedMeal === meal ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMeal(meal)}
                    className="capitalize"
                  >
                    {meal}
                  </Button>
                ))}
              </div>
            </div>

            <Tabs defaultValue="search" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="camera">Camera</TabsTrigger>
                <TabsTrigger value="barcode">Barcode</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for food..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-auto">
                  {filteredFoods.map((food, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => addFood(food)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground">{food.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {food.calories} cal • {food.protein}g protein
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="camera" className="space-y-4">
                <div className="text-center py-8">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">AI Food Recognition</h3>
                  <p className="text-muted-foreground mb-4">
                    Take a photo of your food and let AI identify it automatically
                  </p>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Camera className="mr-2 h-4 w-4" />
                    Open Camera
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="barcode" className="space-y-4">
                <div className="text-center py-8">
                  <Barcode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Scan Barcode</h3>
                  <p className="text-muted-foreground mb-4">Scan product barcodes for instant nutrition information</p>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Barcode className="mr-2 h-4 w-4" />
                    Scan Barcode
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <div className="space-y-2">
                  {recentFoods.map((food, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => addFood(food)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-foreground">{food.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {food.calories} cal • {food.protein}g protein
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Selected Foods */}
            {selectedFoods.length > 0 && (
              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="font-semibold text-foreground">Selected Foods</h3>
                <div className="space-y-2">
                  {selectedFoods.map((food, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{food.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(food.calories * food.quantity)} cal • {Math.round(food.protein * food.quantity)}g
                          protein
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={food.quantity}
                          onChange={(e) => updateQuantity(index, Number.parseFloat(e.target.value) || 1)}
                          className="w-16 h-8"
                          min="0.1"
                          step="0.1"
                        />
                        <Button size="icon" variant="ghost" onClick={() => removeFood(index)} className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Total:</span>
                    <div className="text-right">
                      <div className="font-bold text-foreground">{Math.round(totalCalories)} calories</div>
                      <div className="text-sm text-muted-foreground">{Math.round(totalProtein)}g protein</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                disabled={selectedFoods.length === 0}
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => {
                  // Here you would save the logged foods
                  console.log("Logging foods:", selectedFoods, "to meal:", selectedMeal)
                  onClose()
                }}
              >
                Log {selectedFoods.length} Food{selectedFoods.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
