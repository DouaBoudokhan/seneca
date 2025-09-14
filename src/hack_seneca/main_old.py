#!/usr/bin/env python
import sys
import os
import warnings
import re
import json
from collections import deque
from datetime import datetime, timedelta

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from crew import FitnessCrew
except ImportError as e:
    print(f"Error: Could not import required modules: {e}")
    print("Make sure all files are in the same directory")
    sys.exit(1)

warnings.filterwarnings("ignore")

def run():
    """
    Run the nutrition crew with test scenarios.
    """
    
    # Test case 1: Regular nutrition question (should NOT generate image)
    print("🧪 Test 1: General nutrition question (no image expected)")
    print("=" * 60)
    
    inputs1 = {
        'user_message': 'What are the benefits of eating protein after a workout?',
        'user_id': 'user_00001',
        'user_profile': {'name': 'Test User', 'fitness_level': 'intermediate', 'goals': ['muscle_gain']},
        'user_activities': [],
        'user_measurements': {},
        'user_nutrition': {},
        'context': 'User asking about nutrition science'
    }
    
    fitness_crew = FitnessCrew()
    result1 = fitness_crew.chat_crew().kickoff(inputs=inputs1)
    print(f"✅ Test 1 Result: {result1}")
    print("\n" + "=" * 60 + "\n")
    
    # Test case 2: Meal suggestion request (should generate image)
    print("🧪 Test 2: Meal suggestion request (image expected)")
    print("=" * 60)
    
    inputs2 = {
        'user_message': 'Can you suggest a healthy post-workout meal with chicken and show me what it looks like?',
        'user_id': 'user_00001',
        'user_profile': {'name': 'Test User', 'fitness_level': 'intermediate', 'goals': ['muscle_gain']},
        'user_activities': [],
        'user_measurements': {},
        'user_nutrition': {},
        'context': 'User requesting meal suggestion with visual'
    }
    
    result2 = fitness_crew.chat_crew().kickoff(inputs=inputs2)
    print(f"✅ Test 2 Result: {result2}")
    print("\n" + "=" * 60 + "\n")

def run_interactive():
    """
    Run the nutrition crew interactively.
    """
    
    print("🥗 Nutrition Assistant with Smart Image Generation")
    print("=" * 60)
    print("Ask nutrition questions or request meal suggestions!")
    print("The system will automatically generate images only when needed.")
    print("Type 'quit' to exit")
    print("=" * 60)
    
    fitness_crew = FitnessCrew()
    
    while True:
        try:
            user_input = input("\n💬 Your question: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
                
            if not user_input:
                print("❌ Please enter a question.")
                continue
            
            # Create inputs for the crew
            inputs = {
                'user_message': user_input,
                'user_id': 'user_00001',
                'user_profile': {'name': 'Test User', 'fitness_level': 'intermediate', 'goals': ['muscle_gain', 'healthy_eating']},
                'user_activities': [],
                'user_measurements': {'weight': '70kg', 'height': '175cm'},
                'user_nutrition': {},
                'context': 'Interactive nutrition consultation'
            }
            
            print(f"\n🤖 Processing your request...")
            result = fitness_crew.chat_crew().kickoff(inputs=inputs)
            print(f"\n✅ Response: {result}")
            
        except (EOFError, KeyboardInterrupt):
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    # You can choose which function to run
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        run_interactive()
    else:
        run()

def login():
    """Authenticate user with user ID"""
    print("🔐 Login Required")
    print("=" * 30)
    print("Please enter your user ID (format: user_00001)")
    print("=" * 30)
    
    while True:
        try:
            user_id = input("User ID: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n❌ Login cancelled. Goodbye!")
            sys.exit(0)
        
        if not user_id:
            print("❌ User ID cannot be empty. Please try again.")
            continue
        
        # Validate user ID format: user_XXXXX (where X is any digit)
        if re.match(r'^user_\d{5}$', user_id):
            print(f"✅ Login successful! Welcome, {user_id}")
            return user_id
        else:
            print("❌ Invalid format. Please use format: user_00001 (user_ followed by 5 digits)")
            print("Examples: user_00001, user_12345, user_99999")

def load_user_data(user_id):
    """Load comprehensive user data from JSON files"""
    print(f"📊 Loading user data for {user_id}...")
    
    user_data = {
        "user_id": user_id,
        "profile": None,
        "recent_activities": [],
        "recent_measurements": [],
        "recent_nutrition": [],
        "summary": {}
    }
    
    # Get the project root directory (two levels up from current file)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    users_data_dir = os.path.join(project_root, "users_data")
    
    print(f"🔍 Looking for data files in: {users_data_dir}")
    
    try:
        # Load user profile
        users_file = os.path.join(users_data_dir, "fitness-users.json")
        print(f"📁 Checking users file: {users_file}")
        print(f"📁 File exists: {os.path.exists(users_file)}")
        
        if os.path.exists(users_file):
            with open(users_file, 'r') as f:
                users = json.load(f)
                print(f"📋 Found {len(users)} users in database")
                user_data["profile"] = next((user for user in users if user["user_id"] == user_id), None)
                print(f"👤 User profile found: {user_data['profile'] is not None}")
        
        # Load recent activities (last 7 days)
        activities_file = os.path.join(users_data_dir, "fitness-activities.json")
        print(f"📁 Checking activities file: {activities_file}")
        print(f"📁 File exists: {os.path.exists(activities_file)}")
        
        if os.path.exists(activities_file):
            with open(activities_file, 'r') as f:
                activities = json.load(f)
                user_activities = [activity for activity in activities if activity["user_id"] == user_id]
                print(f"🏃 Found {len(user_activities)} activities for user")
                # Sort by date and get recent ones
                user_activities.sort(key=lambda x: x["date"], reverse=True)
                user_data["recent_activities"] = user_activities[:7]  # Last 7 entries
        
        # Load recent measurements (last 5)
        measurements_file = os.path.join(users_data_dir, "fitness-measurements.json")
        print(f"📁 Checking measurements file: {measurements_file}")
        print(f"📁 File exists: {os.path.exists(measurements_file)}")
        
        if os.path.exists(measurements_file):
            with open(measurements_file, 'r') as f:
                measurements = json.load(f)
                user_measurements = [m for m in measurements if m["user_id"] == user_id]
                print(f"📏 Found {len(user_measurements)} measurements for user")
                # Sort by date and get recent ones
                user_measurements.sort(key=lambda x: x["date"], reverse=True)
                user_data["recent_measurements"] = user_measurements[:5]  # Last 5 entries
        
        # Load recent nutrition (last 7 days)
        nutrition_file = os.path.join(users_data_dir, "fitness-nutrition.json")
        print(f"📁 Checking nutrition file: {nutrition_file}")
        print(f"📁 File exists: {os.path.exists(nutrition_file)}")
        
        if os.path.exists(nutrition_file):
            with open(nutrition_file, 'r') as f:
                nutrition = json.load(f)
                user_nutrition = [n for n in nutrition if n["user_id"] == user_id]
                print(f"🍎 Found {len(user_nutrition)} nutrition entries for user")
                # Sort by date and get recent ones
                user_nutrition.sort(key=lambda x: x["date"], reverse=True)
                user_data["recent_nutrition"] = user_nutrition[:7]  # Last 7 entries
        
        # Create summary
        if user_data["profile"]:
            user_data["summary"]["profile"] = f"Age: {user_data['profile']['age']}, Weight: {user_data['profile']['weight']}kg, Height: {user_data['profile']['height']}cm, BMI: {user_data['profile']['bmi']}, Fitness Level: {user_data['profile']['fitness_level']}, Goals: {user_data['profile']['goals']}"
        
        if user_data["recent_activities"]:
            avg_steps = sum(a["steps"] for a in user_data["recent_activities"]) / len(user_data["recent_activities"])
            avg_calories = sum(a["calories_burned"] for a in user_data["recent_activities"]) / len(user_data["recent_activities"])
            user_data["summary"]["activities"] = f"Recent avg: {avg_steps:.0f} steps/day, {avg_calories:.0f} calories burned/day"
        
        if user_data["recent_measurements"] and len(user_data["recent_measurements"]) >= 2:
            latest = user_data["recent_measurements"][0]
            previous = user_data["recent_measurements"][1]
            weight_change = latest["weight"] - previous["weight"]
            user_data["summary"]["measurements"] = f"Latest: {latest['weight']}kg, {latest['body_fat']}% body fat. Weight change: {weight_change:+.1f}kg since last measurement"
        
        if user_data["recent_nutrition"]:
            avg_calories = sum(n["calories_consumed"] for n in user_data["recent_nutrition"]) / len(user_data["recent_nutrition"])
            avg_protein = sum(n["protein_g"] for n in user_data["recent_nutrition"]) / len(user_data["recent_nutrition"])
            user_data["summary"]["nutrition"] = f"Recent avg: {avg_calories:.0f} calories/day, {avg_protein:.0f}g protein/day"
        
        print("✅ User data loaded successfully!")
        print(f"📊 Summary created: {len(user_data['summary'])} sections")
        print(f"📋 Data loaded:")
        print(f"   👤 Profile: {'✅' if user_data['profile'] else '❌'}")
        print(f"   🏃 Activities: {len(user_data['recent_activities'])} entries")
        print(f"   📏 Measurements: {len(user_data['recent_measurements'])} entries") 
        print(f"   🍎 Nutrition: {len(user_data['recent_nutrition'])} entries")
        return user_data
        
    except Exception as e:
        print(f"⚠️ Warning: Could not load user data: {e}")
        print("Continuing with basic functionality...")
        return user_data

def chat():
    """Start the conversational fitness chatbot"""
    # Authenticate user first
    user_id = login()
    
    # Load user data
    user_data = load_user_data(user_id)
    
    print("\n🏋️‍♂️ Fitness Chatbot Activated!")
    print("=" * 50)
    
    print("\n⚡ Initializing fitness assistant...")
    
    # Initialize fitness crew
    fitness_crew = FitnessCrew()
    crew_instance = fitness_crew.chat_crew()
    
    print("✅ Fitness assistant ready!")
    print("\n" + "=" * 50)
    print("💬 Start chatting! Type 'exit', 'quit', or 'bye' to end")
    print("� Ask about workouts, nutrition, progress, or anything fitness-related")
    print("=" * 50 + "\n")
    
    # Initialize conversation history for current session
    conversation_history = deque(maxlen=6)  # Keep last 6 exchanges for context

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n👋 Goodbye! Stay consistent and take care.")
            break

        if user_input.lower() in {"exit", "quit", "bye"}:
            print("👋 Goodbye! Stay consistent and take care.")
            break

        if not user_input:
            continue

        # Add user message to session history
        conversation_history.append(f"User: {user_input}")

        # Prepare context from recent conversation history
        recent_context = "\n".join(conversation_history)
        
        # Format user data for the crew
        user_profile = user_data.get("summary", {}).get("profile", "No profile data available")
        user_activities = user_data.get("summary", {}).get("activities", "No recent activity data")
        user_measurements = user_data.get("summary", {}).get("measurements", "No recent measurements")
        user_nutrition = user_data.get("summary", {}).get("nutrition", "No recent nutrition data")
        
        # Debug: Print what data we're sending (you can remove this later)
        print(f"\n🔍 DEBUG - User Data Being Sent:")
        print(f"Profile: {user_profile}")
        print(f"Activities: {user_activities}")
        print(f"Measurements: {user_measurements}")
        print(f"Nutrition: {user_nutrition}\n")

        # Inputs for the assistant
        inputs = {
            "user_message": user_input,
            "context": recent_context,
            "user_id": user_id,
            "user_profile": user_profile,
            "user_activities": user_activities,
            "user_measurements": user_measurements,
            "user_nutrition": user_nutrition,
        }

        try:
            # Get response from crew
            response = crew_instance.kickoff(inputs=inputs)
            response_text = str(response).strip()
            
            # Clean up response text (remove any extra formatting)
            if response_text.startswith("Assistant:"):
                response_text = response_text[10:].strip()
            
            # Add assistant response to session history
            conversation_history.append(f"Assistant: {response_text}")
            
            print(f"\nFitness Coach: {response_text}\n")
            
        except Exception as e:
            error_msg = f"I encountered an error: {str(e)}"
            print(f"\nFitness Coach: {error_msg}\n")
            print("Please check your API keys and try again.")
            break

if __name__ == "__main__":
    chat()