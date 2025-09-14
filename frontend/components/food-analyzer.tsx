"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Camera, Loader2, X, Info } from 'lucide-react';

interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence: number;
}

interface NutritionData {
  items: FoodItem[];
  meal_totals: {
    total_calories: number;
    total_protein_g: number;
    total_carbs_g: number;
    total_fat_g: number;
  };
  notes?: string;
}

interface FoodAnalysisResult {
  success: boolean;
  description?: string;
  nutrition_data?: NutritionData;
  summary?: string;
  error?: string;
}

interface FoodAnalyzerProps {
  onMealAdded?: (nutritionData: NutritionData) => void;
}

export default function FoodAnalyzer({ onMealAdded }: FoodAnalyzerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file is too large. Please select an image under 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setError(null);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/food_analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_data: selectedImage,
          user_id: 'user_00001', // You might want to get this from user context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: FoodAnalysisResult = await response.json();
      setAnalysisResult(result);

      if (!result.success) {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    setShowConfirmDialog(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddToLog = () => {
    setShowConfirmDialog(true);
  };

  const confirmAddToLog = () => {
    if (analysisResult?.nutrition_data) {
      // Call the parent function to add meal to today's meals
      onMealAdded?.(analysisResult.nutrition_data);
      
      // TODO: Add functionality to save to nutrition log
      console.log('Adding to nutrition log:', analysisResult.nutrition_data);
    }
    setShowConfirmDialog(false);
    // Reset the analysis to allow for another scan
    resetAnalysis();
  };

  const cancelAddToLog = () => {
    setShowConfirmDialog(false);
  };

  const renderNutritionData = (data: NutritionData) => {
    const { meal_totals, items } = data;
    
    return (
      <div className="space-y-4">
        {/* Meal Totals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meal Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {meal_totals.total_calories}
                </div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {meal_totals.total_protein_g}g
                </div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {meal_totals.total_carbs_g}g
                </div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {meal_totals.total_fat_g}g
                </div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Food Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Food Items Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-base">{item.name}</h4>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Portion: {item.portion}
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div>{item.calories} cal</div>
                    <div>{item.protein_g}g protein</div>
                    <div>{item.carbs_g}g carbs</div>
                    <div>{item.fat_g}g fat</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {data.notes && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>{data.notes}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <Camera className="h-5 w-5" />
          Food Analyzer
        </CardTitle>
        <CardDescription className="text-indigo-600 dark:text-indigo-400">
          Upload a photo of your meal to get detailed nutritional analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Upload Section */}
        <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg p-6 bg-gradient-to-br from-indigo-25 to-purple-25 dark:from-indigo-950/30 dark:to-purple-950/30">
          {!selectedImage ? (
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
              <p className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-300">Upload Food Image</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-4">
                Select a clear photo of your meal for nutritional analysis
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
              >
                Choose Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected food"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={resetAnalysis}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {!analysisResult && (
                <div className="text-center">
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Food'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Analysis Results */}
        {analysisResult && analysisResult.success && (
          <div className="space-y-4">
            {/* Description */}
            {analysisResult.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What I See</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{analysisResult.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Nutrition Data */}
            {analysisResult.nutrition_data && renderNutritionData(analysisResult.nutrition_data)}

            {/* Quick Summary */}
            {analysisResult.summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-sm">{analysisResult.summary}</p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center pt-4">
              <Button onClick={resetAnalysis} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                Analyze Another Image
              </Button>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0"
                onClick={handleAddToLog}
              >
                Add to Nutrition Log
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Nutrition Log?</DialogTitle>
            <DialogDescription>
              Do you want to count this meal and add it to your daily nutrition totals?
            </DialogDescription>
          </DialogHeader>
          
          {analysisResult?.nutrition_data && (
            <div className="py-4">
              <h4 className="font-semibold mb-2">Meal Summary:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Calories: {analysisResult.nutrition_data.meal_totals.total_calories}</div>
                <div>Protein: {analysisResult.nutrition_data.meal_totals.total_protein_g}g</div>
                <div>Carbs: {analysisResult.nutrition_data.meal_totals.total_carbs_g}g</div>
                <div>Fat: {analysisResult.nutrition_data.meal_totals.total_fat_g}g</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={cancelAddToLog} className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
              No, Don't Count
            </Button>
            <Button onClick={confirmAddToLog} className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0">
              Yes, Add to Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}