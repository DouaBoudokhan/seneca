# HackSen4. [Data Models](#data-models)
5. [Data Sources and Attribution](#data-sources-and-attribution)
6. [Setup and Installation](#setup-and-installation)
7. [Development Guide](#development-guide)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting) AI-Powered Fitness Platform
## Comprehensive Technical Documentation

### Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [API Documentation](#api-documentation)
6. [Data Models](#data-models)
7. [Setup and Installation](#setup-and-installation)
8. [Development Guide](#development-guide)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**HackSeneca** is a sophisticated AI-powered fitness platform that combines multi-agent AI systems with modern web technologies to provide personalized fitness coaching, nutrition guidance, and real-time workout tracking.

### Team Structure
Our dedicated team of 4 developers brings diverse expertise to the project:

1. **Lead AI Engineer** - Multi-agent system architecture and CrewAI implementation
2. **Full-Stack Developer** - Frontend React/Next.js development and API integration  
3. **Backend Engineer** - FastAPI development and AI model integration
4. **ML Engineer** - Computer vision, pose detection, and voice analysis features

### Key Features
- **Multi-Agent AI System**: CrewAI-powered hierarchical agent system with specialized fitness and nutrition experts
- **Real-time Pose Detection**: MediaPipe integration for exercise form analysis
- **Voice Fatigue Analysis**: Audio processing for fatigue detection during workouts
- **Food Analysis**: AI-powered food recognition and nutrition tracking
- **Personalized Coaching**: Context-aware recommendations based on user data
- **Interactive Dashboard**: Modern React-based UI with real-time analytics

### Technology Stack

#### Backend
- **Framework**: FastAPI (Python)
- **AI Framework**: CrewAI for multi-agent systems
- **LLM Integration**: Azure OpenAI/Groq API
- **Audio Processing**: TensorFlow/Keras for voice analysis
- **Image Generation**: Azure FLUX.1-Kontext-pro for meal visualization
- **Package Management**: UV (Python)

#### Frontend
- **Framework**: Next.js 14 (React)
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Computer Vision**: MediaPipe for pose detection

### Data Sources and Models

#### Datasets Used
- **Fitness Activities Dataset**: Custom synthetic data generated for user activity tracking
- **Nutrition Database**: USDA Food Data Central API for nutritional information
- **Exercise Library**: Curated collection from fitness.com and bodybuilding.com references
- **User Profiles**: Synthetic user data following fitness industry standards

#### AI Models and APIs
- **Language Models**: 
  - Azure OpenAI GPT-4 (Primary LLM for agent responses)
  - Groq API (Alternative/fallback LLM provider)
  - Model endpoints configured via environment variables

- **Computer Vision Models**:
  - **MediaPipe Pose**: Google's pose estimation model for real-time exercise tracking
  - **Food Recognition**: Custom integration with Groq API for food image analysis
  - **Flux AI**: Third-party service for meal image generation

- **Audio Analysis**:
  - **Voice Fatigue Detection**: VGG19 + Ensemble Learning with PCA feature reduction
  - **Speech Recognition**: Browser-native Web Speech API integration

#### External APIs and Services
- **Azure OpenAI**: Primary language model provider
  - Endpoint: Configurable via `AZURE_AI_ENDPOINT`
  - API Version: 2024-12-01-preview
  - Model: azure/gpt-4

- **Groq API**: Alternative LLM provider
  - High-speed inference for real-time responses
  - Fallback option for Azure OpenAI

- **Azure FLUX.1-Kontext-pro**: Meal image generation service
  - Integrated via custom tool in CrewAI framework
  - Generates appetizing food images for nutrition guidance

#### Data Attribution and Sources
- **Exercise Data**: Compiled from public fitness resources and exercise databases
- **Nutritional Information**: USDA Food Data Central (public domain)
- **User Interface Assets**: Custom designed with Lucide React icons
- **Sample Images**: Generated using AI tools or sourced from open repositories

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                     │
├─────────────────────────────────────────────────────────────┤
│  Dashboard  │  Coach  │  Nutrition  │  Trainer  │  Profile  │
├─────────────────────────────────────────────────────────────┤
│           Components & Hooks & MediaPipe Integration       │
└─────────────────────────┬───────────────────────────────────┘
                         │ HTTP/REST API
┌─────────────────────────▼───────────────────────────────────┐
│                   FastAPI Backend                          │
├─────────────────────────────────────────────────────────────┤
│  Auth  │  Chat  │  Food Analysis  │  Fatigue  │  User Data  │
├─────────────────────────────────────────────────────────────┤
│                    CrewAI Multi-Agent System               │
│  ┌───────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│  │    Manager    │ │   Fitness   │ │    Nutritionist     │ │
│  │     Agent     │ │    Coach    │ │       Agent         │ │
│  └───────────────┘ └─────────────┘ └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│           External Services Integration                     │
│  Azure OpenAI  │  Groq API  │ Azure FLUX │  TensorFlow     │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Agent Architecture

The system employs a hierarchical multi-agent architecture:

1. **Manager Agent**: Routes requests to appropriate specialists
2. **Fitness Coach Agent**: Handles workout plans, exercise guidance, training programs
3. **Nutritionist Agent**: Manages meal plans, recipes, dietary advice, food analysis

---

## Backend Documentation

### Project Structure

```
src/hack_seneca/
├── __init__.py
├── main.py                 # CLI interface and user data management
├── crew.py                 # CrewAI agent definitions and orchestration
├── api_server.py           # FastAPI REST API endpoints
├── api_server_clean.py     # Simplified API version
├── api_server_simple.py    # Minimal API implementation
├── api_server_backup.py    # Backup API version
├── api.py                  # API utilities
└── tools/
    ├── custom_tool.py      # Flux image generation tool
    └── voice_fatigue/      # Voice fatigue analysis module
```

### Core Components

#### 1. Main Application (`main.py`)
The main entry point provides:
- **User Authentication**: ID-based login system with format validation
- **Data Loading**: Comprehensive user data aggregation from JSON files
- **Chat Interface**: Interactive CLI for fitness coaching
- **Data Aggregation**: Summarizes user profile, activities, measurements, and nutrition

**Key Functions:**
```python
def login() -> str
def load_user_data(user_id: str) -> Dict[str, Any]
def chat() -> None
```

#### 2. Multi-Agent System (`crew.py`)
Implements the CrewAI framework with three specialized agents:

**Manager Agent**:
- Routes requests based on content analysis
- Enforces strict delegation rules
- Prevents cross-domain responses

**Fitness Coach Agent**:
- Specializes in workout planning and exercise guidance
- Supports multiple training methodologies (PPL, full-body, HIIT, etc.)
- Provides form correction and progression advice

**Nutritionist Agent**:
- Handles meal planning and dietary guidance
- Integrates with Flux AI for meal visualization
- Provides macro tracking and supplement advice

#### 3. API Server (`api_server.py`)
FastAPI-based REST API providing:

**Endpoints:**
- `POST /api/login` - User authentication
- `POST /api/chat` - AI chat interface
- `POST /api/analyze-food` - Food image analysis
- `POST /api/predict-fatigue` - Voice fatigue detection

**Features:**
- CORS configuration for frontend integration
- Session management for user context
- Error handling and validation
- Audio file processing for fatigue analysis

### Agent Behavior and Task Delegation

#### Manager Agent Logic
```python
# Delegation Rules:
- Workout/Exercise queries → Fitness Coach
- Nutrition/Food queries → Nutritionist  
- Ambiguous queries → Clarification request
- Greeting/General → Direct response
```

#### Task Creation and Execution
Each agent has specific task templates with:
- User message processing
- Context integration (profile, activities, measurements)
- Specialized tool access (image generation for nutritionist)
- Response formatting guidelines

---

## Frontend Documentation

### Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard home
│   ├── globals.css        # Global styles
│   ├── analytics/         # Analytics pages
│   ├── api/              # API route handlers
│   ├── coach/            # AI coach interface
│   ├── nutrition/        # Nutrition tracking
│   ├── onboarding/       # User onboarding flow
│   ├── profile/          # User profile management
│   ├── trainer/          # Live training with pose detection
│   └── workouts/         # Workout library and builder
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI primitives (Radix UI)
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── ai-coach-avatar.tsx
│   ├── pose-detector.tsx # MediaPipe integration
│   ├── food-analyzer.tsx # Food recognition
│   ├── workout-builder.tsx
│   ├── nutrition-charts.tsx
│   └── ...
├── hooks/                # Custom React hooks
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   └── useMediaPipePose.ts
├── lib/                  # Utility functions
│   └── utils.ts
└── public/               # Static assets
```

### Key Components

#### 1. Dashboard (`app/page.tsx`)
- **Progress Rings**: Circular progress indicators for daily goals
- **Animated Exercise Cards**: Interactive workout displays
- **Streak Tracker**: Consistency monitoring
- **Quick Actions**: Camera access, workout start, analytics

#### 2. AI Coach Interface (`app/coach/`)
Features:
- Real-time chat with AI agents
- Voice recording capabilities
- Fatigue detection integration
- Conversation history management
- Response typing animations

#### 3. Pose Detection (`components/pose-detector.tsx`)
MediaPipe Integration:
- Real-time pose estimation
- Exercise form analysis
- Rep counting functionality
- Visual feedback overlay

#### 4. Nutrition Tracking (`app/nutrition/`)
Components:
- Food image analysis
- Meal planning interface
- Nutrition charts and insights
- Calorie tracking dashboard

### State Management

The application uses React's built-in state management:
- **Local State**: Component-specific data with `useState`
- **Context**: Theme and user preferences
- **Custom Hooks**: Reusable stateful logic

### Styling and Design

- **Design System**: Tailwind CSS with custom color palette
- **Components**: Radix UI primitives for accessibility
- **Animations**: Framer Motion for smooth transitions
- **Responsive Design**: Mobile-first approach with breakpoints

---

## API Documentation

### Authentication

#### POST `/api/login`
Authenticates user and loads profile data.

**Request:**
```json
{
  "user_id": "user_00001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user_data": {
    "user_id": "user_00001",
    "profile": { /* user profile */ },
    "recent_activities": [ /* activity data */ ],
    "recent_measurements": [ /* measurement data */ ],
    "recent_nutrition": [ /* nutrition data */ ],
    "summary": { /* aggregated summaries */ }
  }
}
```

### Chat Interface

#### POST `/api/chat`
Sends message to AI agents and receives response.

**Request:**
```json
{
  "message": "I need a workout plan for building muscle",
  "user_id": "user_00001",
  "fatigue_status": "You sound tired!",
  "fatigue_probability": 0.8
}
```

**Response:**
```json
{
  "response": "I'm delegating this fitness request to our specialist...",
  "timestamp": "2024-09-14T10:30:00Z"
}
```

### Food Analysis

#### POST `/api/analyze-food`
Analyzes food images for nutrition information.

**Request:**
```json
{
  "image_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABA...",
  "user_id": "user_00001"
}
```

**Response:**
```json
{
  "success": true,
  "description": "Grilled chicken breast with steamed broccoli",
  "nutrition_data": {
    "calories": 285,
    "protein": 53,
    "carbs": 12,
    "fat": 6
  },
  "summary": "High-protein, low-carb meal ideal for muscle building"
}
```

### Fatigue Detection

#### POST `/api/predict-fatigue`
Analyzes voice audio to detect fatigue levels.

**Request:** Multipart form data with audio file

**Response:**
```json
{
  "success": true,
  "tired": true,
  "probability": 0.75,
  "error": null
}
```

---

## Data Models

### User Profile Structure

```json
{
  "user_id": "user_00001",
  "age": 24,
  "weight": 81.9,
  "height": 155.9,
  "bmi": 33.7,
  "fitness_level": "intermediate",
  "goals": "endurance",
  "join_date": "2024-10-19"
}
```

### Activity Data Structure

```json
{
  "user_id": "user_00001",
  "date": "2024-09-14",
  "activity_type": "running",
  "duration_minutes": 45,
  "calories_burned": 425,
  "steps": 8500,
  "heart_rate_avg": 145,
  "distance_km": 6.2
}
```

### Measurement Data Structure

```json
{
  "user_id": "user_00001",
  "date": "2024-09-14",
  "weight": 81.5,
  "body_fat": 18.5,
  "muscle_mass": 35.2,
  "bone_density": 2.8,
  "water_percentage": 62.1
}
```

### Nutrition Data Structure

```json
{
  "user_id": "user_00001",
  "date": "2024-09-14",
  "meal_type": "breakfast",
  "calories_consumed": 520,
  "protein_g": 25,
  "carbs_g": 65,
  "fat_g": 18,
  "fiber_g": 8,
  "sugar_g": 12
}
```

---

## Data Sources and Attribution

### 📊 Datasets and Data Sources

#### User Data Structure
The application uses structured JSON files for data persistence:

**Location**: `users_data/` directory
- `fitness-users.json` - User profiles and basic information
- `fitness-activities.json` - Exercise and activity tracking data
- `fitness-measurements.json` - Body measurements and health metrics
- `fitness-nutrition.json` - Nutrition intake and meal tracking

#### Fitness and Exercise Data
- **Exercise Database**: Curated from publicly available fitness resources
  - Exercise descriptions and instructions
  - Muscle group targeting information
  - Equipment requirements and modifications
  - Form cues and safety guidelines

- **Workout Templates**: 
  - Push/Pull/Legs (PPL) routines
  - Full-body workout programs
  - HIIT and cardio protocols
  - Strength training progressions

#### Nutritional Information
- **Primary Source**: USDA Food Data Central
  - Public domain nutritional database
  - Comprehensive macro and micronutrient data
  - Standardized serving sizes and portions

- **Food Recognition**: AI-powered food identification
  - Integration with Groq API for image analysis
  - Custom prompts for nutritional estimation
  - Fallback to manual entry for accuracy

### 🤖 AI Models and APIs

#### Language Models
1. **Azure OpenAI GPT-4**
   - **Primary LLM**: Main language model for agent responses
   - **Configuration**: Via environment variables
   - **Usage**: Fitness coaching, nutrition guidance, conversation management
   - **API Version**: 2024-12-01-preview

2. **Groq API**
   - **Alternative Provider**: High-speed inference
   - **Use Cases**: Real-time responses, food analysis
   - **Fallback**: When Azure OpenAI is unavailable

#### Computer Vision Models
1. **MediaPipe Pose Detection**
   - **Source**: Google Research
   - **License**: Apache License 2.0
   - **Usage**: Real-time pose estimation during workouts
   - **Implementation**: Browser-based JavaScript integration
   - **Models**: 
     - Pose landmark detection model
     - 33-point body pose estimation
     - Real-time performance optimization

#### AI Workout Trainer Implementation
**Real-time Pose Detection and Exercise Form Analysis**

🎯 **Features**:
- **Real-time Pose Detection**: 33 body landmarks tracked at 30+ FPS
- **Exercise-Specific Analysis**: Custom algorithms for push-ups, squats, planks, lunges, and burpees
- **Automatic Rep Counting**: Smart detection of exercise phases with position validation
- **Form Accuracy Scoring**: Real-time biomechanical feedback on exercise form
- **Visual Pose Overlay**: Live skeleton visualization on camera feed
- **Multi-Exercise Support**: Easily switch between different workout types

🛠️ **Technologies Used**:
- **Core Animation**: Framer Motion for smooth transitions
- **AI/ML Stack**:
  - MediaPipe Pose (@mediapipe/pose) - Google's pose estimation model
  - MediaPipe Camera Utils (@mediapipe/camera_utils) - Camera integration
  - MediaPipe Drawing Utils (@mediapipe/drawing_utils) - Pose visualization
- **UI Components**:
  - Shadcn/ui - Modern React components
  - Lucide React - Beautiful icons
  - Custom Canvas API - Real-time pose rendering

2. **Food Recognition System**
   - **Implementation**: Custom integration with LLM APIs
   - **Process**: Image analysis → nutritional estimation
   - **Accuracy**: Enhanced with user confirmation workflows

#### Audio Processing
1. **Voice Fatigue Detection**
   - **Model Architecture**: VGG19 + Ensemble Learning
   - **Feature Processing**: PCA for dimensionality reduction
   - **Input Processing**: 196x196 log-mel spectrograms at 8kHz sample rate
   - **Training Data**: Audio spectrograms for fatigue detection
   - **Framework**: TensorFlow/Keras for deep learning pipeline
   - **Features**: Binary fatigue classification with probability estimation
   - **Integration**: Real-time processing during workouts
   - **Performance**: Pre-trained VGG19 features with ensemble classifier

2. **Speech Recognition**
   - **Provider**: Browser Web Speech API
   - **Usage**: Voice commands and interaction
   - **Fallback**: Text input for accessibility

### 🎨 Image Generation and Assets

#### AI-Generated Content
1. **Azure FLUX.1-Kontext-pro Integration**
   - **Service**: Azure-hosted FLUX image generation model
   - **Usage**: Visual meal representations for nutrition guidance
   - **Integration**: Custom CrewAI tool implementation
   - **Triggers**: Automatic generation when suggesting meals

2. **Exercise Assets**
   - **Source**: Custom illustrations and stock imagery
   - **Location**: `frontend/public/` directory
   - **Types**: Exercise demonstrations, workout equipment, progress visuals

#### UI Assets and Icons
- **Icon Library**: Lucide React (MIT License)
- **Fonts**: Geist font family (Open source)
- **Color Palette**: Custom fitness-themed gradient system

### 📚 Knowledge Base and Training Data

#### Fitness Knowledge
- **Exercise Science**: Compiled from peer-reviewed fitness research
- **Training Methodologies**: Evidence-based workout programming
- **Safety Guidelines**: Industry-standard form and injury prevention
- **Exercise Form Analysis**: Biomechanical principles for pose detection algorithms

#### Voice Fatigue Analysis Dataset
- **Model Architecture**: VGG19 (ImageNet pre-trained) + Ensemble Learning
- **Feature Extraction**: Deep CNN features from VGG19 backbone
- **Dimensionality Reduction**: PCA for feature compression
- **Input Format**: 196x196 log-mel spectrograms (50-second audio clips at 8kHz)
- **Ensemble Method**: Multiple classifiers for robust prediction
- **Labels**: Binary classification (fatigued/not fatigued)
- **Preprocessing**: Audio normalization and spectrogram generation
- **Usage**: Real-time fatigue detection during workout sessions

#### AI Workout Trainer Knowledge Base
- **Exercise Database**: Custom algorithms for specific exercises:
  - Push-ups: Arm angle and body alignment analysis
  - Squats: Hip and knee angle tracking
  - Planks: Core stability and body line detection
  - Lunges: Balance and leg positioning analysis
  - Burpees: Multi-phase movement recognition
- **Pose Validation**: 33-point MediaPipe landmark validation
- **Rep Counting Logic**: Phase detection algorithms for accurate counting
- **Form Scoring**: Biomechanical assessment criteria

#### Nutrition Knowledge  
- **Dietary Guidelines**: Based on established nutritional science
- **Meal Planning**: Balanced macro and micronutrient approaches
- **Food Safety**: Standard food handling and preparation guidelines

### 🔗 External Service Dependencies

#### Required API Keys
```env
# Primary LLM Provider
AZURE_AI_API_KEY=your_azure_api_key
AZURE_AI_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_AI_API_VERSION=2024-12-01-preview

# Image Generation
AZURE_DALLE_API_KEY=your_azure_dalle_api_key
AZURE_DALLE_ENDPOINT=https://your-dalle-endpoint.openai.azure.com/
AZURE_DALLE_API_VERSION=2025-04-01-preview

# Alternative LLM Provider  
GROQ_API_KEY=your_groq_api_key

# Optional Fallback
OPENAI_API_KEY=your_openai_api_key
```

#### Service Limitations and Quotas
- **Azure OpenAI**: Rate limits based on subscription tier
- **Azure FLUX**: Image generation quotas and rate limits
- **Groq API**: Free tier with request limitations
- **MediaPipe**: Browser performance dependent
- **TensorFlow**: Model loading and inference performance

### 📖 Attribution and Licensing

#### Open Source Components
- **CrewAI**: MIT License - Multi-agent framework
- **FastAPI**: MIT License - Web framework
- **Next.js**: MIT License - React framework  
- **MediaPipe**: Apache License 2.0 - Computer vision and pose detection
  - MediaPipe Pose: Real-time pose estimation
  - MediaPipe Camera Utils: Camera integration utilities
  - MediaPipe Drawing Utils: Pose visualization tools
- **Radix UI**: MIT License - Component library (Shadcn/ui)
- **Tailwind CSS**: MIT License - Styling framework
- **Framer Motion**: MIT License - Animation library
- **Lucide React**: MIT License - Icon library
- **Canvas API**: Web standard for real-time pose rendering

#### Machine Learning Models and Datasets
- **VGG19 Fatigue Detection Model**: 
  - Model: Pre-trained VGG19 + Ensemble Learning
  - Features: Deep CNN feature extraction with PCA compression
  - Input: 196x196 mel-spectrograms from 50-second audio clips
  - Framework: TensorFlow/Keras implementation

#### Third-Party Services
- **Azure OpenAI**: Commercial API service
- **Groq**: Commercial API service with free tier
- **Azure FLUX.1-Kontext-pro**: Azure-hosted image generation service

#### Data Usage Compliance
- **User Data**: Stored locally, no external transmission without consent
- **Privacy**: No personal data shared with external services
- **GDPR Compliance**: User data deletion and export capabilities
- **Terms of Service**: Adherence to all external API provider terms

### 🔄 Data Update and Maintenance

#### Dataset Refresh Strategy
- **Exercise Database**: Quarterly updates with new exercises
- **Nutritional Data**: Annual sync with USDA database updates
- **Model Updates**: Follow provider update schedules
- **User Data**: Real-time updates with user interactions

#### Version Control
- **Data Versioning**: Track changes to training data and models
- **Model Versioning**: API version management
- **Backup Strategy**: Regular data backups and recovery procedures

---

## Setup and Installation

### Prerequisites

- **Python**: 3.10 to 3.13
- **Node.js**: 18+ with pnpm
- **TensorFlow**: For voice analysis models
- **UV**: Python package manager

### Backend Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd seneca
```

2. **Install UV (if not installed)**
```bash
pip install uv
```

3. **Install Dependencies**
```bash
uv install
```

4. **Environment Configuration**
Create `.env` file:
```env
# Azure OpenAI Configuration
AZURE_AI_API_KEY=your_azure_api_key
AZURE_AI_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_AI_API_VERSION=2024-12-01-preview
model=azure/gpt-4

# Azure FLUX Configuration
AZURE_DALLE_API_KEY=your_azure_dalle_api_key
AZURE_DALLE_ENDPOINT=https://your-dalle-endpoint.openai.azure.com/
AZURE_DALLE_API_VERSION=2025-04-01-preview

# Alternative: Groq Configuration
GROQ_API_KEY=your_groq_api_key

# Optional: OpenAI Fallback
OPENAI_API_KEY=your_openai_api_key
```

5. **Run Backend**
```bash
# CLI Interface
uv run run_crew

# API Server
uv run python src/hack_seneca/api_server.py
```

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Development Server**
```bash
pnpm dev
```

4. **Production Build**
```bash
pnpm build
pnpm start
```

### Full Stack Development

1. **Terminal 1: Backend API**
```bash
cd seneca
uv run python src/hack_seneca/api_server.py
```

2. **Terminal 2: Frontend**
```bash
cd seneca/frontend
pnpm dev
```

3. **Access Application**
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs

---

## Development Guide

### Adding New Features

#### Backend Development

1. **New API Endpoints**
   - Add routes to `api_server.py`
   - Define Pydantic models for request/response
   - Implement error handling

2. **Agent Modifications**
   - Update agent definitions in `crew.py`
   - Modify task templates
   - Test delegation logic

3. **Data Processing**
   - Extend data loading in `main.py`
   - Add new JSON data structures
   - Update aggregation logic

#### Frontend Development

1. **New Components**
   - Create in `components/` directory
   - Use TypeScript for type safety
   - Follow existing design patterns

2. **New Pages**
   - Add to `app/` directory
   - Implement layout.tsx if needed
   - Add navigation links

3. **API Integration**
   - Create fetch functions
   - Handle loading states
   - Implement error boundaries

### Testing Strategy

#### Backend Testing
```bash
# Unit tests for agents
python -m pytest tests/test_agents.py

# API endpoint testing
python -m pytest tests/test_api.py

# Integration tests
python -m pytest tests/test_integration.py
```

#### Frontend Testing
```bash
# Component testing
pnpm test

# E2E testing
pnpm test:e2e
```

### Code Quality

#### Backend Standards
- **Type Hints**: Use Python type annotations
- **Documentation**: Docstrings for all functions
- **Linting**: Follow PEP 8 standards
- **Error Handling**: Comprehensive exception management

#### Frontend Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent formatting
- **Accessibility**: ARIA compliance

---

## Deployment

### Production Environment Setup

#### Backend Deployment (Docker)

1. **Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN pip install uv && uv sync --frozen

COPY src/ ./src/
COPY users_data/ ./users_data/
COPY knowledge/ ./knowledge/

EXPOSE 8000
CMD ["uv", "run", "python", "src/hack_seneca/api_server.py"]
```

2. **Docker Compose**
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - AZURE_AI_API_KEY=${AZURE_AI_API_KEY}
      - AZURE_AI_ENDPOINT=${AZURE_AI_ENDPOINT}
    volumes:
      - ./users_data:/app/users_data
```

#### Frontend Deployment (Vercel/Netlify)

1. **Build Configuration**
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

2. **Environment Variables**
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Production Considerations

#### Security
- **API Keys**: Use environment variables
- **CORS**: Restrict to production domains
- **Authentication**: Implement JWT tokens
- **Rate Limiting**: Prevent API abuse

#### Performance
- **Caching**: Redis for session storage
- **CDN**: Static asset delivery
- **Database**: PostgreSQL for production data
- **Load Balancing**: Multiple API instances

#### Monitoring
- **Logging**: Structured logging with timestamps
- **Metrics**: API response times, error rates
- **Health Checks**: Endpoint monitoring
- **Alerting**: Error notification system

---

## Troubleshooting

### Common Issues

#### Backend Issues

1. **Import Errors**
```bash
Error: Could not import required modules
```
**Solution**: Run from project root with `uv run run_crew`

2. **Azure API Configuration**
```bash
Warning: Azure AI API credentials not found
```
**Solution**: Check `.env` file for correct API keys and endpoints

3. **Audio Processing Issues**
```bash
TensorFlow model loading failed
```
**Solution**: Install TensorFlow and required dependencies

#### Frontend Issues

1. **MediaPipe Loading**
```bash
Failed to load MediaPipe
```
**Solution**: Check network connection and CDN availability

2. **API Connection**
```bash
Network request failed
```
**Solution**: Verify backend is running on correct port

3. **Build Errors**
```bash
Type error in component
```
**Solution**: Check TypeScript definitions and imports

### Debug Mode

#### Backend Debugging
```bash
# Enable verbose logging
export DEBUG=1
uv run python src/hack_seneca/api_server.py
```

#### Frontend Debugging
```bash
# Development mode with hot reload
pnpm dev

# Check console for errors
# Use React Developer Tools
```

### Performance Optimization

#### Backend Optimization
- **Async Processing**: Use FastAPI async endpoints
- **Caching**: Cache AI responses for common queries
- **Connection Pooling**: Reuse database connections

#### Frontend Optimization
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Analyze bundle size

---

## Contributing

### Development Workflow

1. **Fork Repository**
2. **Create Feature Branch**
3. **Implement Changes**
4. **Add Tests**
5. **Submit Pull Request**

### Team Responsibilities

- **Lead AI Engineer**: CrewAI architecture, agent behavior, task delegation logic
- **Full-Stack Developer**: React components, UI/UX, frontend-backend integration
- **Backend Engineer**: API endpoints, data processing, external service integration  
- **ML Engineer**: MediaPipe integration, voice analysis, computer vision features

### Code Review Process

- **Automated Checks**: CI/CD pipeline validation
- **Manual Review**: Code quality and design review
- **Testing**: Feature validation in staging environment

---

## License and Support

### License
This project is licensed under the MIT License. See LICENSE file for details.

### Support Channels
- **Documentation**: This technical documentation
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **CrewAI Documentation**: https://docs.crewai.com

### Version History
- **v1.0.0**: Initial release with multi-agent system
- **v1.1.0**: Added pose detection and voice analysis
- **v1.2.0**: Enhanced nutrition tracking and food analysis

---

*Generated by the HackSeneca Team on: September 14, 2024*  
*Technical documentation maintained by our 4-member development team*  
*Last Updated: Current Analysis*