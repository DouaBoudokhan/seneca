from crewai import Agent, Crew, Process, Task
from crewai.llm import LLM
import os
from dotenv import load_dotenv
from .tools.custom_tool import FluxImageGenerator

load_dotenv()

class FitnessCrew:
    """Hierarchical fitness crew with manager delegation"""
    
    def __init__(self):
        # Configure Azure LLM
        model = os.getenv("model")
        api_key = os.getenv("AZURE_AI_API_KEY")
        base_url = os.getenv("AZURE_AI_ENDPOINT")
        api_version = os.getenv("AZURE_AI_API_VERSION")
        
        print(f"🔧 Configuring Azure LLM:")
        print(f"   Model: {model}")
        print(f"   Base URL: {base_url}")
        print(f"   API Version: {api_version}")
        print(f"   API Key: {'✅ Set' if api_key else '❌ Missing'}")
        
        if not api_key or not base_url:
            print("Warning: Azure AI API credentials not found in environment variables.")
            # Set a dummy OpenAI key to satisfy CrewAI validation
            os.environ["OPENAI_API_KEY"] = "dummy-key-for-azure"
            self.llm = LLM(model="gpt-3.5-turbo")
        else:
            # Set a dummy OpenAI key to satisfy CrewAI validation even when using Azure
            os.environ["OPENAI_API_KEY"] = "dummy-key-for-azure"
            self.llm = LLM(
                model=model,
                api_key=api_key,
                base_url=base_url,
                api_version=api_version,
                temperature=1.0
            )
        
        # Tools
        self.flux_tool = FluxImageGenerator()

        # Instantiate and reuse agent instances across tasks/crew
        self.manager_agent = self.create_manager_agent()
        self.fitness_agent = self.create_fitness_coach_agent()
        self.nutritionist_agent = self.create_nutritionist_agent()

    def create_manager_agent(self):
        """Manager agent that delegates to appropriate specialists"""
        return Agent(
            role="Fitness & Nutrition Manager",
            goal="Analyze user requests and delegate to the appropriate specialist for comprehensive answers",
            backstory=(
                "You are an experienced fitness and nutrition manager who oversees a team of specialists. "
                "You MUST delegate correctly based on the request type:\n\n"
                
                "🏋️ FITNESS COACH: ONLY for workout plans, exercise routines, training programs, push/pull/legs, "
                "splits, strength training, cardio routines, muscle building, form guidance, etc.\n\n"
                
                "🍎 NUTRITIONIST: ONLY for meal plans, recipes, diet advice, nutrition guidance, macro counting, "
                "supplement advice, healthy eating, meal prep, pasta plans, food suggestions, etc.\n\n"
                
                "CRITICAL DELEGATION RULES:\n"
                "- PASTA PLANS = NUTRITIONIST (this is food/nutrition)\n"
                "- MEAL PLANS = NUTRITIONIST (this is food/nutrition)\n" 
                "- RECIPES = NUTRITIONIST (this is food/nutrition)\n"
                "- WORKOUT PLANS = FITNESS COACH (this is exercise)\n"
                "- NEVER let fitness coach answer nutrition questions\n"
                "- NEVER let nutritionist answer workout questions\n"
                "- If the user's message is a simple greeting or the intent is unclear, FIRST ask a brief clarifying question (e.g., 'Are you looking for a workout plan, nutrition guidance, or something else?') and DO NOT delegate until clarified.\n"
                "- You typically do not answer domain questions directly — you delegate to the right specialist once intent is clear.\n\n"
                
                "When delegating, simply say: 'I'm delegating this [nutrition/fitness] request to our specialist.'"
            ),
            llm=self.llm,
            verbose=True,
            memory=True,  # Disable memory to prevent wrong delegation patterns
            allow_delegation=True,
            reasoning=True
        )

    def create_fitness_coach_agent(self):
        """Fitness specialist - handles all workout and exercise requests"""
        return Agent(
            role="Expert Fitness Coach",
            goal="Create detailed, personalized workout plans and provide comprehensive exercise guidance",
            backstory=(
                "You are a world-class certified personal trainer and strength coach with 15+ years experience. "
                "Your expertise includes:\n"
                "• Push/Pull/Legs (PPL) routines and all split variations\n"
                "• 3-day, 4-day, 5-day, and 6-day training programs\n"
                "• Full body routines and circuit training\n"
                "• Strength training and powerlifting programs\n"
                "• Bodybuilding and hypertrophy-focused routines\n"
                "• Cardio programming and HIIT workouts\n"
                "• Exercise form and technique guidance\n\n"
                
                "When users request workout plans, you ALWAYS provide:\n"
                "✅ Complete exercise selection with specific names\n"
                "✅ Sets, reps, and rest periods for each exercise\n"
                "✅ Clear daily structure (Day 1: Push, Day 2: Pull, etc.)\n"
                "✅ Progression guidelines and training notes\n"
                "✅ Personalization based on their fitness data\n\n"
                
                "You focus EXCLUSIVELY on fitness and exercise. You do not provide nutrition advice.\n\n"
                
                "CRITICAL: If asked about nutrition, meals, diet, pasta, food, recipes, or food-related topics, you MUST respond:\n"
                "'This is a nutrition question. I am a FITNESS COACH and only handle workouts and exercise. "
                "Please ask our NUTRITIONIST specialist for meal plans, recipes, and dietary advice. "
                "I CANNOT and WILL NOT provide nutrition guidance.'\n\n"
                
                "DO NOT provide meal plans, recipes, nutrition advice, or food suggestions under any circumstances."
            ),
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
        )

    def create_nutritionist_agent(self):
        """Nutrition specialist - handles all food and diet requests"""
        return Agent(
            role="Certified Nutritionist & Meal Planner",
            goal="Provide comprehensive nutrition guidance, meal plans, and visual meal suggestions",
            backstory=(
                "You are a registered dietitian and certified nutritionist with extensive experience in "
                "meal planning and dietary optimization. Your expertise includes:\n"
                "• Personalized meal planning and preparation\n"
                "• Macro and calorie optimization\n"
                "• Recipe development and modification\n"
                "• Diet plans for various goals (weight loss, muscle gain, maintenance)\n"
                "• Supplement guidance and timing\n"
                "• Healthy recipe creation with visual examples\n"
                "• Sports nutrition for athletic performance\n\n"
                
                "When users request nutrition guidance, you provide:\n"
                "✅ Specific meal suggestions with detailed recipes\n"
                "✅ Nutritional breakdowns (calories, macros, micros)\n"
                "✅ CONCISE, straight-to-the-point answers\n"
                "✅ Visual meal examples using image generation for ALL meal suggestions\n"
                "✅ Practical meal prep and shopping guidance\n"
                "✅ Personalization based on their nutrition data and goals\n\n"
                
                "IMPORTANT: \n"
                "• ALWAYS keep responses concise and straight to the point\n"
                "• AUTOMATICALLY generate meal images for ANY meal suggestions using FluxImageGenerator\n"
                "• For pasta requests, provide simple pasta recipes with images\n"
                "• Use the FluxImageGenerator tool to create appealing, realistic meal images\n"
                "• Describe meals in detail for image generation (plating, colors, presentation)\n\n"
                
                "You focus EXCLUSIVELY on nutrition and food. You do not provide workout plans."
            ),
            llm=self.llm,
            function_calling_llm=self.llm,
            verbose=True,
            allow_delegation=False,
            tools=[self.flux_tool],
        )

    def create_nutritionist_task(self):
        """Create the nutritionist task with image generation capability"""
        return Task(
            description=(
                "Provide comprehensive nutrition guidance for: {user_message}\n\n"
                "USER PROFILE & DATA:\n"
                "User ID: {user_id}\n"
                "Profile: {user_profile}\n"
                "Recent Activities: {user_activities}\n"
                "Body Measurements: {user_measurements}\n"
                "Nutrition Intake: {user_nutrition}\n"
                "Context: {context}\n\n"
                
                "Instructions:\n"
                "1. Provide CONCISE, straight-to-the-point nutrition advice\n"
                "2. For meal suggestions, give 1-3 specific recipes with ingredients and macros\n"
                "3. AUTOMATICALLY generate a meal image using FluxImageGenerator for ANY meal suggestion\n"
                "4. When calling FluxImageGenerator, describe the meal in detail (plating, colors, presentation)\n"
                "5. Keep responses focused and practical\n"
                "6. If the user's request is NOT about meals, food, diet, pasta, nutrition, or recipes, reply 'Not applicable' and DO NOT generate images.\n\n"
                
                "For image generation:\n"
                "- Create detailed, appetizing descriptions\n"
                "- Include food presentation, plating, colors, and visual appeal\n"
                "- Call the tool with just the description text (no JSON formatting)\n"
                "- Images should be saved under assets/images/ with timestamped filename"
            ),
            expected_output="Concise nutrition guidance with specific meal suggestions and generated meal images when applicable",
            agent=self.nutritionist_agent,
        )

    def create_fitness_task(self):
        """Create the fitness task for workout and exercise requests"""
        return Task(
            description=(
                "Provide a complete workout plan for: {user_message}\n\n"
                "USER PROFILE & DATA:\n"
                "User ID: {user_id}\n"
                "Profile: {user_profile}\n"
                "Recent Activities: {user_activities}\n"
                "Body Measurements: {user_measurements}\n"
                "Context: {context}\n\n"
                "Instructions:\n"
                "1. If the request is about workouts, provide a structured plan with exercises, sets, reps, and rest.\n"
                "2. Include 1-2 progression guidelines and safety/form notes.\n"
                "3. If the request is about meals, nutrition, recipes, or pasta, reply 'Not applicable' and DO NOT answer."
            ),
            expected_output="A clear, structured workout plan or 'Not applicable' if the request is not fitness-related.",
            agent=self.fitness_agent,
        )

    def create_main_task(self):
        """Main task that the manager will delegate appropriately"""
        return Task(
            description=(
                "Handle this user request with personalized guidance: {user_message}\n\n"
                "USER PROFILE & DATA:\n"
                "User ID: {user_id}\n"
                "Profile: {user_profile}\n"
                "Recent Activities: {user_activities}\n"
                "Body Measurements: {user_measurements}\n"
                "Nutrition Intake: {user_nutrition}\n"
                "Conversation History: {context}\n\n"
                
                "DELEGATION INSTRUCTIONS:\n"
                "As the manager, analyze this request and delegate to the appropriate specialist:\n\n"
                
                "🏋️ DELEGATE TO FITNESS COACH if the request involves:\n"
                "- Workout plans or exercise routines\n"
                "- Training programs (PPL, splits, full body, etc.)\n"
                "- Exercise selection or form guidance\n"
                "- Strength training or cardio programs\n"
                "- Fitness goal planning\n\n"
                
                "🍎 DELEGATE TO NUTRITIONIST if the request involves:\n"
                "- Meal plans or recipe suggestions\n"
                "- Diet advice or nutrition guidance\n"
                "- Macro counting or calorie planning\n"
                "- Supplement recommendations\n"
                "- Healthy eating strategies\n"
                "- Meal image generation or visual food examples\n"
                "- PASTA PLANS, food recipes, eating plans\n"
                "- ANY request about food, meals, or eating\n\n"
                
                "CRITICAL: The user's request about 'pasta plan' is clearly NUTRITION - delegate to NUTRITIONIST only!\n\n"
                
                "Ensure the specialist receives all relevant user data for personalized advice. "
                "The specialist should provide a complete, detailed response that fully addresses "
                "the user's specific request."
            ),
            expected_output=(
                "A comprehensive, personalized response that fully addresses the user's request. "
                "This should be either a detailed workout plan (from fitness coach) or complete "
                "nutrition guidance (from nutritionist), tailored to the user's data and goals."
            ),
            agent=self.manager_agent,
        )

    def chat_crew(self):
        """Create hierarchical crew with manager delegation"""
        # Only include the main manager task; the manager will delegate to specialists as needed.
        return Crew(
            agents=[
                self.manager_agent,
                self.fitness_agent,
                self.nutritionist_agent,
            ],
            tasks=[
                self.create_main_task(),
                self.create_fitness_task(),
                self.create_nutritionist_task(),
            ],
            process=Process.hierarchical,
            manager_llm=self.llm,
            verbose=True,
            memory=True,  # Disable Crew memory to avoid LiteLLM/Azure memory errors
        )