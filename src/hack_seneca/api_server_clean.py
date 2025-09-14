from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import re
import os
import base64
import tempfile
from datetime import datetime
from groq import Groq

# Import CrewAI
from .crew import FitnessCrew

app = FastAPI(title="Fitness Coach AI API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store current user session
current_user_data = None
current_user_id = None

# Pydantic models for request/response
class LoginRequest(BaseModel):
    user_id: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    user_data: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    user_id: str

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime

class FoodAnalysisRequest(BaseModel):
    image_data: str  # Base64 encoded image data
    user_id: str

class FoodAnalysisResponse(BaseModel):
    success: bool
    description: Optional[str] = None
    nutrition_data: Optional[Dict[str, Any]] = None
    summary: Optional[str] = None
    error: Optional[str] = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Fitness Coach AI API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

def analyze_food_image(base64_image: str) -> Dict[str, Any]:
    """Analyze food image using Groq API - based on your food_analyzer.py"""
    try:
        # Get Groq API key from environment
        api_key = os.getenv("GROQ_API_KEY")
        
        if not api_key:
            return {"success": False, "error": "GROQ_API_KEY not found in environment variables"}
        
        client = Groq(api_key=api_key)
        
        # Call Groq API
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
        
        # Parse response - same logic as your food_analyzer.py
        description = ""
        nutrition_data = {}
        
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
        else:
            # Fallback logic from your original code
            lines = response_text.strip().split('\n')
            description_lines = []
            json_lines = []
            found_json = False
            
            for line in lines:
                if line.strip().startswith('{') or found_json:
                    if line.strip().startswith('{'):
                        found_json = True
                    if found_json and line.strip().endswith('}') and line.count('}') >= line.count('{'):
                        json_lines.append(line)
                        break
                    elif found_json:
                        json_lines.append(line)
                else:
                    if not found_json:
                        description_lines.append(line)
            
            description = '\n'.join(description_lines).strip()
            json_part = '\n'.join(json_lines).strip()
        
        # Parse JSON
        nutrition_data = json.loads(json_part)
        
        # Create summary
        summary = create_nutrition_summary(nutrition_data)
        
        return {
            "success": True,
            "description": description,
            "nutrition_data": nutrition_data,
            "summary": summary
        }
        
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"Could not parse nutrition data: {str(e)}",
            "raw_response": response_text if 'response_text' in locals() else "No response"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Food analysis failed: {str(e)}"
        }

def create_nutrition_summary(nutrition_data: Dict[str, Any]) -> str:
    """Create a user-friendly summary of the nutrition analysis"""
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

@app.post("/api/analyze-food", response_model=FoodAnalysisResponse)
async def analyze_food(request: FoodAnalysisRequest):
    """Analyze food image and return nutritional information"""
    global current_user_data, current_user_id
    
    try:
        # Temporarily bypass authentication for testing
        # if not current_user_id or current_user_id != request.user_id:
        #     raise HTTPException(status_code=401, detail="User not authenticated")
        
        print(f"Food analysis request for user: {request.user_id}")
        
        # Extract base64 image data
        image_data = request.image_data
        if image_data.startswith('data:image'):
            # Remove data URL prefix
            base64_image = image_data.split(',')[1]
        else:
            base64_image = image_data
        
        # Analyze the food image
        result = analyze_food_image(base64_image)
        
        if result["success"]:
            print(f"Food analysis successful")
            return FoodAnalysisResponse(
                success=True,
                description=result["description"],
                nutrition_data=result["nutrition_data"],
                summary=result["summary"]
            )
        else:
            print(f"Food analysis failed: {result.get('error', 'Unknown error')}")
            return FoodAnalysisResponse(
                success=False,
                error=result.get("error", "Analysis failed")
            )
    
    except Exception as e:
        print(f"Food analysis error: {str(e)}")
        return FoodAnalysisResponse(
            success=False,
            error=f"Food analysis failed: {str(e)}"
        )

@app.post("/api/login", response_model=LoginResponse)
async def api_login(request: LoginRequest):
    """Handle user login - simplified version for testing"""
    global current_user_data, current_user_id
    
    try:
        user_id = request.user_id.strip()
        
        # Validate user ID format
        if not re.match(r'^user_\d{5}$', user_id):
            return LoginResponse(
                success=False,
                message="Invalid user ID format. Please use format: user_XXXXX"
            )
        
        # Mock user data for testing
        mock_user_data = {
            "user_id": user_id,
            "profile": {"name": "Test User", "age": 25, "weight": 70, "height": 175},
            "activities": [],
            "measurements": [],
            "nutrition": []
        }
        
        current_user_data = mock_user_data
        current_user_id = user_id
        
        return LoginResponse(
            success=True,
            message="Welcome back, Test User!",
            user_data=mock_user_data
        )
    
    except Exception as e:
        print(f"Login error: {str(e)}")
        return LoginResponse(
            success=False,
            message=f"Login failed: {str(e)}"
        )

@app.post("/api/chat", response_model=ChatResponse)
async def api_chat(request: ChatRequest):
    """Handle chat messages with CrewAI fitness coach"""
    global current_user_data, current_user_id
    
    try:
        # Check if user is logged in
        if not current_user_id or current_user_id != request.user_id:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        if not current_user_data:
            raise HTTPException(status_code=400, detail="User data not loaded")
        
        print(f"Starting CrewAI chat for user: {request.user_id}")
        print(f"User message: {request.message}")

        # Lightweight intent guard: if it's just a greeting, respond directly without invoking CrewAI
        text = (request.message or "").strip().lower()
        # Normalize punctuation and extra spaces
        text_clean = re.sub(r"[^a-z\s]", "", text)
        greetings = {
            "hi", "hello", "hey", "yo", "sup", "hej", "hola", "salut",
            "good morning", "good afternoon", "good evening"
        }
        # Consider it a greeting if it's short and composed of greeting words only
        if text_clean and (len(text_clean.split()) <= 4) and all(
            any(g in w for g in greetings) for w in text_clean.split()
        ):
            user_name = current_user_data.get("profile", {}).get("name", "there")
            reply = (
                f"Hi {user_name}! What would you like help with today — a workout plan, nutrition guidance (like meal ideas), or something else?"
            )
            return ChatResponse(response=reply, timestamp=datetime.now())
        
        # Initialize the CrewAI fitness coach
        fitness_crew = FitnessCrew()
        crew_instance = fitness_crew.chat_crew()
        
        # Prepare inputs in the format expected by the crew
        inputs = {
            "user_message": request.message,
            "user_id": request.user_id,
            "user_profile": current_user_data.get('profile', {}),
            "user_activities": current_user_data.get('activities', []),
            "user_measurements": current_user_data.get('measurements', []),
            "user_nutrition": current_user_data.get('nutrition', []),
            "context": "This is the start of a new conversation."  # Add context for conversation history
        }
        
        print(f"Inputs prepared for CrewAI: {list(inputs.keys())}")
        
        # Get response from CrewAI
        print("Calling CrewAI...")
        result = crew_instance.kickoff(inputs=inputs)
        response_text = str(result).strip()
        
        # Clean up response text (remove any extra formatting)
        if response_text.startswith("Assistant:"):
            response_text = response_text[10:].strip()
        
        print(f"CrewAI response received: {response_text[:100]}...")
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now()
        )
    
    except Exception as e:
        print(f"Chat error: {str(e)}")
        # Fallback to a helpful error message
        return ChatResponse(
            response=f"I'm sorry, I'm having trouble processing your request right now. Error: {str(e)}",
            timestamp=datetime.now()
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, reload=True)