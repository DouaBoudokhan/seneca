"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Utensils, Zap } from 'lucide-react';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  id: number;
  name: string;
  time: string;
  calories: number;
  foods: FoodItem[];
}

interface MealInfoProps {
  meals: Meal[];
  selectedMealId?: number;
  onMealSelect?: (mealId: number) => void;
}

export default function MealInfo({ meals, selectedMealId, onMealSelect }: MealInfoProps) {
  const selectedMeal = meals.find(meal => meal.id === selectedMealId);

  return (
    <div className="space-y-4">
      {/* Meal Selection */}
      <Card className="glass border-border/50 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
        <CardHeader>
          <CardTitle className="flex items-center text-teal-700 dark:text-teal-300">
            <Utensils className="mr-2 h-5 w-5" />
            Meal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {meals.map((meal) => (
              <button
                key={meal.id}
                onClick={() => onMealSelect?.(meal.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  selectedMealId === meal.id 
                    ? 'bg-teal-100 border-teal-300 dark:bg-teal-900/30 dark:border-teal-600' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/30 dark:border-slate-600 dark:hover:bg-slate-700/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-foreground">{meal.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {meal.time}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm font-medium text-foreground">
                      <Zap className="h-3 w-3 mr-1" />
                      {meal.calories}
                    </div>
                    <div className="text-xs text-muted-foreground">calories</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Meal Details */}
      {selectedMeal && (
        <Card className="glass border-border/50 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
          <CardHeader>
            <CardTitle className="text-emerald-700 dark:text-emerald-300">{selectedMeal.name} Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meal Summary */}
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-foreground">Meal Total</h4>
                <Badge variant="secondary">{selectedMeal.calories} cal</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedMeal.time}
              </div>
            </div>

            {/* Individual Foods */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Food Items</h4>
              {selectedMeal.foods.map((food, index) => (
                <div key={index} className="p-3 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-foreground">{food.name}</h5>
                    <Badge variant="outline">{food.calories} cal</Badge>
                  </div>
                  
                  {/* Nutrition Breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 rounded bg-green-500/10">
                      <div className="font-medium text-green-600">{food.protein}g</div>
                      <div className="text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center p-2 rounded bg-yellow-500/10">
                      <div className="font-medium text-yellow-600">{food.carbs}g</div>
                      <div className="text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center p-2 rounded bg-red-500/10">
                      <div className="font-medium text-red-600">{food.fat}g</div>
                      <div className="text-muted-foreground">Fat</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meal Totals */}
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-medium text-foreground mb-3">Nutrition Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Calories:</span>
                  <span className="font-medium text-foreground">{selectedMeal.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Protein:</span>
                  <span className="font-medium text-green-600">
                    {selectedMeal.foods.reduce((sum, food) => sum + food.protein, 0)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Carbs:</span>
                  <span className="font-medium text-yellow-600">
                    {selectedMeal.foods.reduce((sum, food) => sum + food.carbs, 0)}g
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Fat:</span>
                  <span className="font-medium text-red-600">
                    {selectedMeal.foods.reduce((sum, food) => sum + food.fat, 0)}g
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      {!selectedMeal && (
        <Card className="glass border-border/50 bg-gradient-to-r from-secondary/5 to-accent/5">
          <CardContent className="p-4">
            <div className="text-center text-muted-foreground">
              <Utensils className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a meal above to view detailed nutrition information</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}