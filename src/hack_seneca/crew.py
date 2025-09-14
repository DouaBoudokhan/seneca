from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.llm import LLM
import os
from dotenv import load_dotenv
from .tools.custom_tool import FluxImageGenerator

load_dotenv()

@CrewBase
class FitnessCrew():
    """Hierarchical fitness crew with manager delegation"""
    
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'
    
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
            os.environ["OPENAI_API_KEY"] = "dummy-key-for-azure"
            self.llm = LLM(model="gpt-3.5-turbo")
        else:
            os.environ["OPENAI_API_KEY"] = "dummy-key-for-azure"
            try:
                self.llm = LLM(
                    model=model or "azure/gpt-4",
                    api_key=api_key,
                    base_url=base_url,
                    api_version=api_version or "2024-12-01-preview",
                    temperature=0.1
                )
            except Exception as e:
                print(f"Warning: Failed to configure Azure LLM: {e}")
                self.llm = LLM(model="gpt-3.5-turbo")
        
        # Tools
        self.flux_tool = FluxImageGenerator()

    @agent
    def manager_agent(self) -> Agent:
        """Manager agent that delegates to appropriate specialists"""
        return Agent(
            config=self.agents_config['manager_agent'],
            llm=self.llm,
            verbose=True,
            memory=True,
            allow_delegation=True,
            max_iter=3,
            reasoning=True
        )

    @agent
    def fitness_agent(self) -> Agent:
        """Fitness specialist - handles all workout and exercise requests"""
        return Agent(
            config=self.agents_config['fitness_agent'],
            llm=self.llm,
            max_iter=3,
            verbose=True,
            allow_delegation=False
        )

    @agent
    def nutritionist_agent(self) -> Agent:
        """Nutrition specialist - handles all food and diet requests"""
        return Agent(
            config=self.agents_config['nutritionist_agent'],
            llm=self.llm,
            function_calling_llm=self.llm,
            verbose=True,
            max_iter=3,
            allow_delegation=False,
            tools=[self.flux_tool]
        )

    @task
    def main_task(self) -> Task:
        """Main task that the manager will delegate appropriately"""
        return Task(
            config=self.tasks_config['main_task'],
            agent=self.manager_agent()
        )

    @task
    def fitness_task(self) -> Task:
        """Create the fitness task for workout and exercise requests"""
        return Task(
            config=self.tasks_config['fitness_task'],
            agent=self.fitness_agent()
        )

    @task
    def nutritionist_task(self) -> Task:
        """Create the nutritionist task with image generation capability"""
        return Task(
            config=self.tasks_config['nutritionist_task'],
            agent=self.nutritionist_agent()
        )

    @crew
    def chat_crew(self) -> Crew:
        """Create hierarchical crew with manager delegation"""
        return Crew(
            agents=[
                self.manager_agent(),
                self.fitness_agent(),
                self.nutritionist_agent(),
            ],
            tasks=[
                self.main_task(),
            ],
            process=Process.hierarchical,
            manager_llm=self.llm,
            verbose=True,
            memory=False
        )