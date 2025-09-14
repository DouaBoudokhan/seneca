from crewai.tools import BaseTool
from typing import Type, Union, Any
from pydantic import BaseModel, Field
import base64
from groq import Groq
import os
import json
import tempfile

class FoodAnalyzerInput(BaseModel):
    """Input schema for FoodAnalyzer."""
    image_data: str = Field(..., description="Base64 encoded image data or file path to analyze")
    
class FoodAnalyzer(BaseTool):
    name: str = "FoodAnalyzer"
    description: str = (
        "Analyze food images to provide detailed nutritional information including calories, "
        "protein, carbs, fat, and portion estimates. Use this tool when users upload food images "
        "or ask for nutritional analysis of meals."
    )
    args_schema: Type[BaseModel] = FoodAnalyzerInput

    def _run(self, image_data: str) -> str:
        """Analyze a food image and return nutritional information."""
        try:
            print(f"🍎 Analyzing food image for nutritional content...")
            
            # Get Groq API key from environment
            groq_api_key = os.getenv("GROQ_API_KEY")
            if not groq_api_key:
                return "Error: GROQ_API_KEY not found in environment variables."
            
            client = Groq(api_key=groq_api_key)
            
            # Handle different input formats
            if image_data.startswith('data:image'):
                # Extract base64 from data URL
                base64_image = image_data.split(',')[1]
            elif os.path.exists(image_data):
                # File path provided
                with open(image_data, "rb") as img_file:
                    base64_image = base64.b64encode(img_file.read()).decode("utf-8")
            else:
                # Assume it's already base64 encoded
                base64_image = image_data
            
            # Call Groq API for food analysis
            completion = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text", 
                                "text": """You are a nutrition expert. Analyze this food image and provide detailed nutritional estimation.

First, provide a brief 1-2 sentence description of what you see in the image.

Then, for each food item you can identify:
1. Name the specific food item
2. Estimate the portion size (grams, cups, pieces, etc.)
3. Estimate calories, protein, carbs, and fat for that portion
4. Provide confidence level (0-100%)

Format your response as:
Brief description: [Your description here]

JSON:
{
  "items": [
    {
      "name": "food_item", 
      "portion": "X grams", 
      "calories": Y, 
      "protein_g": Z, 
      "carbs_g": A, 
      "fat_g": B, 
      "confidence": C
    }
  ],
  "meal_totals": {
    "total_calories": total,
    "total_protein_g": total,
    "total_carbs_g": total,
    "total_fat_g": total
  },
  "notes": "any assumptions or uncertainty"
}

Be conservative and mention if portion sizes are hard to estimate. Include macronutrient breakdown for each item."""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                temperature=0.1,
                max_tokens=1000
            )
            
            response_text = completion.choices[0].message.content
            
            # Parse the response to extract description and JSON
            try:
                if "JSON:" in response_text:
                    parts = response_text.split("JSON:", 1)
                    description = parts[0].replace("Brief description:", "").strip()
                    json_section = parts[1].strip()
                    
                    # Extract JSON from code blocks
                    if "```" in json_section:
                        json_start = json_section.find("```")
                        if json_section[json_start:json_start+7] == "```json":
                            json_start += 7
                        else:
                            json_start += 3
                        json_end = json_section.find("```", json_start)
                        if json_end != -1:
                            json_part = json_section[json_start:json_end].strip()
                        else:
                            json_part = json_section[json_start:].strip()
                    else:
                        # Look for JSON object boundaries
                        brace_start = json_section.find("{")
                        if brace_start != -1:
                            brace_count = 0
                            brace_end = brace_start
                            for i, char in enumerate(json_section[brace_start:]):
                                if char == "{":
                                    brace_count += 1
                                elif char == "}":
                                    brace_count -= 1
                                    if brace_count == 0:
                                        brace_end = brace_start + i + 1
                                        break
                            json_part = json_section[brace_start:brace_end]
                        else:
                            json_part = json_section
                
                # Parse JSON
                nutrition_data = json.loads(json_part)
                
                # Create formatted response
                result = {
                    "success": True,
                    "description": description,
                    "nutrition_data": nutrition_data,
                    "summary": self._create_summary(nutrition_data)
                }
                
                return json.dumps(result, indent=2)
                
            except json.JSONDecodeError as e:
                return json.dumps({
                    "success": False,
                    "error": "Could not parse nutrition data",
                    "raw_response": response_text
                })
                
        except Exception as e:
            return json.dumps({
                "success": False,
                "error": f"Food analysis failed: {str(e)}"
            })
    
    def _create_summary(self, nutrition_data):
        """Create a user-friendly summary of the nutrition analysis."""
        if "meal_totals" not in nutrition_data:
            return "Unable to calculate meal totals"
        
        totals = nutrition_data["meal_totals"]
        total_cals = totals.get('total_calories', 0)
        
        summary = f"Total: {total_cals} calories"
        summary += f" | Protein: {totals.get('total_protein_g', 0)}g"
        summary += f" | Carbs: {totals.get('total_carbs_g', 0)}g" 
        summary += f" | Fat: {totals.get('total_fat_g', 0)}g"
        
        # Add macro percentages if calories available
        if total_cals and total_cals > 0:
            protein_cals = totals.get('total_protein_g', 0) * 4
            carb_cals = totals.get('total_carbs_g', 0) * 4
            fat_cals = totals.get('total_fat_g', 0) * 9
            
            summary += f"\nMacros: {protein_cals/total_cals*100:.0f}% protein, "
            summary += f"{carb_cals/total_cals*100:.0f}% carbs, "
            summary += f"{fat_cals/total_cals*100:.0f}% fat"
        
        return summary