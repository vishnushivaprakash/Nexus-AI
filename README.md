# Nexus AI - Data Analyst

Nexus AI is an advanced, AI-powered Data Analyst platform that allows users to seamlessly upload their datasets (CSVs) and query them using natural language. The application bridges the gap between raw data and actionable business insights through a dynamic, responsive UI and an intelligent multi-agent backend architecture.

## 🚀 Features

- **Multi-Agent Workflow**: Utilizes specialized AI agents (Data Agent, SQL Agent, Analysis Agent, Visualization Agent, etc.) to process, analyze, and present your data.
- **Natural Language Queries**: Ask questions about your data in plain English and receive instant, accurate answers extracted via dynamic Pandas operations.
- **Dynamic Dashboards**: Auto-generated visualizations and KPIs based on your specific datasets.
- **Targeted File Selection**: Select one, multiple, or all uploaded files to narrow down the context for the AI.
- **Modern UI/UX**: Built with Next.js, TailwindCSS, and Framer Motion for a stunning, responsive, and glassmorphic aesthetic.
- **PDF & Excel Exports**: Instantly download comprehensive reports of your data analysis.

## 🛠️ Technology Stack

**Frontend:**
- Next.js (React)
- TailwindCSS (Styling)
- Framer Motion (Animations)
- Lucide React (Icons)
- Zustand (State Management)
- Recharts (Data Visualizations)

**Backend:**
- FastAPI (Python)
- Pandas & NumPy (Data processing)
- Groq API (Llama-3.3-70b-versatile for LLM orchestration)
- Uvicorn (ASGI server)

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- Groq API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "AI-powered Data Analyst"
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Create a .env file and add your GROQ_API_KEY
   python -m uvicorn main:app --reload
   ```

3. **Setup the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to start analyzing your data!

## 📝 License
This project is open-source and available under the MIT License.
