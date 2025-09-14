from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import re
import os
from datetime import datetime

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

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Fitness Coach AI API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now()}

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
        print(f"❌ Login error: {str(e)}")
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
        
        print(f"🤖 Starting CrewAI chat for user: {request.user_id}")
        print(f"💬 User message: {request.message}")

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
                f"Hi {user_name}! 👋 What would you like help with today — a workout plan, nutrition guidance (like meal ideas), or something else?"
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
        
        print(f"📊 Inputs prepared for CrewAI: {list(inputs.keys())}")
        
        # Get response from CrewAI
        print("🚀 Calling CrewAI...")
        result = crew_instance.kickoff(inputs=inputs)
        response_text = str(result).strip()
        
        # Clean up response text (remove any extra formatting)
        if response_text.startswith("Assistant:"):
            response_text = response_text[10:].strip()
        
        print(f"✅ CrewAI response received: {response_text[:100]}...")
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now()
        )
    
    except Exception as e:
        print(f"❌ Chat error: {str(e)}")
        # Fallback to a helpful error message
        return ChatResponse(
            response=f"I'm sorry, I'm having trouble processing your request right now. Error: {str(e)}",
            timestamp=datetime.now()
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, reload=True)