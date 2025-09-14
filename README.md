# HackSeneca - AI-Powered Fitness Platform 🏋️‍♂️

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org)
[![CrewAI](https://img.shields.io/badge/CrewAI-Multi--Agent-green.svg)](https://crewai.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-Modern-red.svg)](https://fastapi.tiangolo.com)

**HackSeneca** is a sophisticated AI-powered fitness platform that combines multi-agent AI systems with modern web technologies to provide personalized fitness coaching, nutrition guidance, and real-time workout tracking.

## 🌟 Key Features

- **🤖 Multi-Agent AI System**: CrewAI-powered hierarchical agent system with specialized fitness and nutrition experts
- **📱 Real-time Pose Detection**: MediaPipe integration for exercise form analysis with 33-point body tracking at 30+ FPS
- **🎤 Voice Fatigue Analysis**: VGG19-based fatigue detection using audio spectrograms and ensemble learning
- **🍎 Food Analysis**: AI-powered food recognition and nutrition tracking
- **💪 Personalized Coaching**: Context-aware recommendations based on user data
- **📊 Interactive Dashboard**: Modern React-based UI with real-time analytics
- **🏋️ AI Workout Trainer**: Real-time exercise form analysis with automatic rep counting and form scoring

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **AI Framework**: CrewAI for multi-agent systems  
- **LLM Integration**: Azure OpenAI/Groq API
- **Audio Processing**: TensorFlow/Keras for voice analysis
- **Image Generation**: Azure FLUX.1-Kontext-pro for meal visualization
- **Package Management**: UV (Python)

### Frontend  
- **Framework**: Next.js 14 (React)
- **UI Library**: Radix UI + Tailwind CSS (Shadcn/ui components)
- **State Management**: React Hooks
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for analytics visualization
- **Computer Vision**: MediaPipe for pose detection
  - MediaPipe Pose: 33-point body landmark tracking
  - MediaPipe Camera Utils: Camera integration
  - MediaPipe Drawing Utils: Real-time pose visualization
- **Icons**: Lucide React for beautiful UI icons
- **Canvas Rendering**: Custom Canvas API for real-time pose overlay

## 👥 Team Members

Our dedicated team of 4 developers:

1. **Lead AI Engineer** - Multi-agent system architecture and CrewAI implementation
2. **Full-Stack Developer** - Frontend React/Next.js development and API integration  
3. **Backend Engineer** - FastAPI development and AI model integration
4. **ML Engineer** - Computer vision, pose detection, and voice analysis features

## 🚀 Quick Start

### Prerequisites
- Python 3.10-3.13
- Node.js 18+ with pnpm
- TensorFlow for voice analysis models
- UV package manager
### Backend Setup

1. **Install UV Package Manager**
```bash
pip install uv
```

2. **Install Dependencies**
```bash
uv install
```

3. **Environment Configuration**
Create `.env` file with your API keys:
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
```

4. **Run Backend API**
```bash
uv run python src/hack_seneca/api_server.py
```

### Frontend Setup

1. **Navigate to Frontend Directory**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Start Development Server**
```bash
pnpm dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

## 📱 Application Features

### 🏠 Dashboard
- Real-time fitness metrics and progress tracking
- Interactive progress rings for daily goals
- Quick access to all platform features

### 🤖 AI Coach
- Intelligent conversation with specialized fitness and nutrition agents
- Voice recording with fatigue detection
- Personalized workout and meal recommendations

### 🍎 Nutrition Tracking
- AI-powered food image recognition
- Automated nutrition calculation
- Meal planning with visual meal generation

### 💪 Live Trainer
- Real-time pose detection during workouts
- Exercise form analysis and correction
- Automatic rep counting with phase detection
- Form accuracy scoring and biomechanical feedback
- Multi-exercise support (push-ups, squats, planks, lunges, burpees)
- Visual pose overlay with 33-point body landmark tracking

### 👤 Profile & Analytics
- Comprehensive health and fitness tracking
- Progress visualization with interactive charts
- Goal setting and achievement monitoring

## 🏗️ Architecture Overview

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

### Multi-Agent System
- **Manager Agent**: Intelligent request routing to appropriate specialists
- **Fitness Coach**: Workout planning, exercise guidance, training programs
- **Nutritionist**: Meal planning, recipes, dietary advice, food analysis

## 📊 Data Sources and Models

### Datasets
- **Fitness Data**: Custom synthetic datasets for user activity tracking
- **Nutrition Database**: USDA Food Data Central (public domain)
- **Exercise Library**: Curated from public fitness resources

### AI Models
- **Language Models**: Azure OpenAI GPT-4, Groq API
- **Computer Vision**: Google MediaPipe for pose detection with 33-point landmark tracking
- **Voice Fatigue Detection**: VGG19 + Ensemble Learning trained on spectrogram dataset with PCA feature reduction
- **Image Generation**: Azure FLUX.1-Kontext-pro for meal visualization
- **Exercise Analysis**: Custom algorithms for push-ups, squats, planks, lunges, and burpees

### AI Workout Trainer Features
🎯 **Real-time Exercise Analysis**:
- **Pose Detection**: 33 body landmarks tracked at 30+ FPS
- **Exercise Support**: Push-ups, squats, planks, lunges, burpees
- **Rep Counting**: Automatic detection with phase validation
- **Form Scoring**: Real-time biomechanical feedback
- **Visual Overlay**: Live skeleton visualization on camera feed

🛠️ **Technical Implementation**:
- MediaPipe Pose for real-time pose estimation
- Custom Canvas API for pose rendering
- Framer Motion for smooth UI animations
- Shadcn/ui components for modern interface

### External APIs
- **Azure OpenAI**: Primary LLM provider for intelligent responses
- **Groq API**: High-speed inference alternative
- **MediaPipe**: Real-time pose estimation (Apache License 2.0)
- **Azure FLUX.1-Kontext-pro**: Meal image generation service
- **Web Speech API**: Browser-native speech recognition

*See [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md) for complete attribution and licensing details.*

## 🔧 Development

### Project Structure
```
seneca/
├── src/hack_seneca/          # Python backend
│   ├── main.py              # CLI interface
│   ├── crew.py              # CrewAI agents
│   ├── api_server.py        # FastAPI endpoints
│   └── tools/               # Custom AI tools
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── coach/          # AI coach interface
│   │   ├── nutrition/      # Nutrition tracking
│   │   ├── onboarding/     # User onboarding
│   │   ├── profile/        # User profile
│   │   ├── trainer/        # Live workout trainer
│   │   └── workouts/       # Workout library
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility functions
├── users_data/              # User data storage
├── knowledge/               # AI knowledge base
└── docs/                    # Documentation
```

### Adding New Features

#### Backend Development
- Add new API endpoints in `api_server.py`
- Extend agent capabilities in `crew.py`
- Create custom tools in `tools/` directory

#### Frontend Development  
- Create new pages in `app/` directory
- Add reusable components in `components/`
- Implement custom hooks for state management

## 🧪 Testing

```bash
# Backend testing
uv run pytest tests/

# Frontend testing
cd frontend && pnpm test

# E2E testing
cd frontend && pnpm test:e2e
```

## 🚀 Deployment

### Production Deployment
- **Backend**: Docker containerization with FastAPI
- **Frontend**: Vercel/Netlify deployment
- **Database**: PostgreSQL for production data
- **Monitoring**: Comprehensive logging and metrics

See `TECHNICAL_DOCUMENTATION.md` for detailed deployment instructions.

## 📚 Documentation

- **[Technical Documentation](TECHNICAL_DOCUMENTATION.md)** - Comprehensive technical guide
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (when running)
- **[Crew Tasks Reference](docs/crew-tasks.md)** - Agent behavior and task definitions

## 🤝 Contributing

We welcome contributions from the community! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

### Development Guidelines
- Follow TypeScript/Python type annotations
- Write comprehensive tests
- Update documentation for new features
- Follow existing code style and patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CrewAI** - Multi-agent AI framework
- **OpenAI/Azure** - Language model integration  
- **MediaPipe** - Pose detection capabilities
- **Next.js** - React framework
- **FastAPI** - Modern Python web framework

## 📞 Support

For support, questions, or feedback:

- **Documentation**: Check our comprehensive technical documentation
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions
- **Team Contact**: Reach out to our development team

---

**Built with ❤️ by the Vortex Team**

*Empowering fitness through AI innovation*
