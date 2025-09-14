from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import re
import os
from datetime import datetime

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
    """Handle chat messages - simplified version for testing"""
    global current_user_data, current_user_id
    
    try:
        # Check if user is logged in
        if not current_user_id or current_user_id != request.user_id:
            raise HTTPException(status_code=401, detail="User not authenticated")
        
        if not current_user_data:
            raise HTTPException(status_code=400, detail="User data not loaded")
        
        # Mock response for testing
        mock_responses = [
            "Hello! I'm your AI fitness coach. I'm here to help you with your fitness journey!",
            "That's a great question! Based on your profile, I recommend starting with some basic exercises.",
            "I can help you create a personalized workout plan. What are your fitness goals?",
            "Great job on staying active! Keep up the good work.",
            "Remember to stay hydrated and get enough rest between workouts."
        ]
        
        import random
        response_text = random.choice(mock_responses)
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000, reload=True)