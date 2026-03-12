<div align="center">

# 🤖 AI Resume Checker

### Analyze. Optimize. Get Hired.

An intelligent full-stack AI application that analyzes your resume against job descriptions using a **6-agent AI pipeline**, providing real-time scores, ATS compatibility checks, skill gap detection, and actionable improvement suggestions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)
![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA3-orange)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [AI Agent Architecture](#-ai-agent-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Dashboard Features](#-dashboard-features)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

AI Resume Checker is a production-ready web application that simulates how top resume tools like **ResumeWorded**, **Rezi**, and **Enhancv** work — but powered by a custom multi-agent AI pipeline.

Upload your resume (PDF or DOCX), paste a job description, and get a comprehensive analysis in seconds including:

- **Overall resume score** with animated visualization
- **ATS compatibility** check
- **Skill gap detection** tailored to the job role
- **Keyword matching** against the job description
- **AI-powered suggestions** using Groq LLaMA 3
- **Job role comparison** across 5 career paths
- **Downloadable PDF report**
- **Dark mode** across the entire site

---

## ✨ Features

### 🎯 Core Analysis
| Feature | Description |
|---|---|
| Resume Parsing | Extracts text from PDF and DOCX files |
| Skill Extraction | Detects 50+ technical skills using NLP |
| ATS Analysis | Simulates ATS scoring with real issue detection |
| Keyword Matching | Compares resume vs job description keywords |
| Score Calculation | Weighted scoring across 4 dimensions |
| AI Suggestions | LLM-powered, resume-specific recommendations |

### 📊 Dashboard
| Feature | Description |
|---|---|
| Animated Score Ring | Smooth count-up animation with color coding |
| Radar Chart | Visual skill analysis across 5 dimensions |
| Score Breakdown | Explains exactly how your score was calculated |
| Section Health | Status of each resume section (good/average/missing) |
| Job Role Comparison | Bar chart comparing your skills vs 5 role profiles |
| Recruiter Tips | 6 insider tips from real hiring practices |
| Checkable Suggestions | Track your improvements with checkboxes |
| Keyword Comparison | Side-by-side matched vs missing keywords |
| Download PDF | Export full analysis report as PDF |

### 🎨 UI/UX
- ☀️ / 🌙 **Dark mode** toggle — persists across all pages
- ✨ **Framer Motion** animations on every page
- 📱 **Fully responsive** — works on mobile and desktop
- 🔵 **AI particle background** with interactive hover effects
- 🃏 **3D tilt cards** on the home page
- 🔄 **Smooth page transitions** with AnimatePresence

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TailwindCSS | Styling |
| Framer Motion | Animations and page transitions |
| Recharts | Radar chart and bar chart visualizations |
| Lucide Icons | Icon library |
| React Dropzone | File upload with drag & drop |
| html2canvas + jsPDF | PDF report generation |
| React Router v6 | Client-side routing |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | Python web framework |
| Uvicorn | ASGI server |
| pdfplumber | PDF text extraction |
| python-docx | DOCX text extraction |
| httpx | Async HTTP client for AI API calls |
| python-dotenv | Environment variable management |
| Pydantic v2 | Data validation and schemas |

### AI
| Technology | Purpose |
|---|---|
| Groq API (LLaMA 3) | Primary AI analysis engine — free forever |
| Rule-based fallback | Smart fallback when AI is unavailable |

---

## 🤖 AI Agent Architecture

The backend uses a **6-agent pipeline** where each agent has a single responsibility:

```
📄 Resume Upload (PDF / DOCX)
         │
         ▼
┌─────────────────────────────┐
│  Agent 1: Resume Parser     │  Extracts text, detects sections
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Agent 2: Skill Extractor   │  Identifies 50+ technical skills
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Agent 3: ATS Analyzer      │  Simulates ATS scoring
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Agent 4: Keyword Matcher   │  Compares resume vs job description
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Agent 5: Score Calculator  │  Weighted scoring across 4 metrics
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Agent 6: AI Suggestions    │  Groq LLaMA 3 powered recommendations
└─────────────────────────────┘
         │
         ▼
📊 JSON Response → React Dashboard
```

### Score Calculation Formula
```
Resume Score = (Skill Match × 35%) + (ATS Score × 35%) + (Keyword Match × 20%) + (Section Health × 10%)
```

---

## 📁 Project Structure

```
AI/
├── frontend/                          ← React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIParticles.js         ← Interactive particle background
│   │   │   ├── TiltGlowCard.jsx       ← 3D tilt card component
│   │   │   ├── ErrorBoundary.jsx      ← Global error handler
│   │   │   ├── Navbar.jsx             ← Global navigation
│   │   │   ├── ScoreCard.jsx
│   │   │   └── SkillList.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.js        ← Global dark mode state
│   │   ├── pages/
│   │   │   ├── Home.jsx               ← Landing page
│   │   │   ├── Upload.jsx             ← Resume upload page
│   │   │   ├── Processing.jsx         ← Analysis loading page
│   │   │   └── Dashboard.jsx          ← Results dashboard
│   │   ├── App.js                     ← Router + providers
│   │   ├── index.css                  ← Global styles + animations
│   │   └── index.js
│   ├── .env                           ← REACT_APP_API_URL
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                           ← FastAPI application
    ├── run.py                         ← Start server: python run.py
    ├── requirements.txt
    ├── .env                           ← API keys
    └── app/
        ├── __init__.py
        ├── main.py                    ← FastAPI app + CORS
        ├── agents/
        │   ├── resume_parser_agent.py
        │   ├── skill_extraction_agent.py
        │   ├── ats_agent.py
        │   ├── keyword_agent.py
        │   ├── score_agent.py
        │   └── suggestion_agent.py    ← Groq AI integration
        ├── services/
        │   ├── resume_service.py      ← File validation
        │   └── analysis_service.py    ← Pipeline orchestrator
        ├── models/
        │   └── schemas.py             ← Pydantic response models
        └── routes/
            └── resume_routes.py       ← POST /api/upload-resume
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- A free [Groq API key](https://console.groq.com)

---

### Backend Setup

**1. Navigate to the backend folder**
```bash
cd AI/backend
```

**2. Install Python dependencies**
```bash
pip install -r requirements.txt
```

**3. Create your `.env` file**
```bash
cp .env.example .env
```

**4. Add your API key to `.env`**
```env
GROQ_API_KEY=gsk_your_key_here
ALLOWED_ORIGINS=http://localhost:3000
```

**5. Start the backend server**
```bash
python run.py
```

✅ Backend running at: **http://localhost:8000**
📖 API Docs at: **http://localhost:8000/docs**

---

### Frontend Setup

**1. Navigate to the frontend folder**
```bash
cd AI/frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Make sure `.env` file exists at the root of frontend/**
```env
REACT_APP_API_URL=http://localhost:8000/api
```

**4. Start the React app**
```bash
npm start
```

✅ Frontend running at: **http://localhost:3000**

---

### Full Workflow

```
1. Open http://localhost:3000
2. Click "Analyze your Resume"
3. Upload your PDF or DOCX resume
4. Paste a job description (optional but recommended)
5. Click "Analyze Resume"
6. Watch the 5-step AI analysis process
7. View your complete dashboard results
8. Download PDF report or check off suggestions
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Get free key at console.groq.com |
| `ALLOWED_ORIGINS` | ✅ Yes | Frontend URL (default: http://localhost:3000) |

### Frontend (`frontend/.env`)
| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | ✅ Yes | Backend URL (default: http://localhost:8000/api) |

---

## 📡 API Reference

### `POST /api/upload-resume`

Runs the full 6-agent analysis pipeline.

**Request** (multipart/form-data)
| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ Yes | PDF or DOCX resume (max 5MB) |
| `job_description` | String | ❌ No | Job description text |

**Response**
```json
{
  "resume_score": 85,
  "skill_match": 92,
  "ats_compatibility": 88,
  "keyword_match": 71,
  "potential_score": 94,
  "matched_skills": ["Python", "React", "JavaScript", "SQL"],
  "missing_skills": ["Docker", "TypeScript", "AWS"],
  "section_health": {
    "experience": "good",
    "skills": "good",
    "education": "good",
    "projects": "good",
    "achievements": "missing"
  },
  "ats_issues": ["Consider adding an achievements section"],
  "matched_keywords": ["react", "javascript", "python"],
  "missing_keywords": ["kubernetes", "ci/cd"],
  "suggestions": [
    "Add Docker and container orchestration experience",
    "Include measurable achievements with numbers",
    "Add TypeScript to your skillset",
    "Write a professional summary tailored to the role",
    "Quantify your project outcomes with metrics",
    "Add relevant certifications to strengthen your profile"
  ]
}
```

---

## 📊 Dashboard Features

### Overview Tab
- **Animated score ring** — color coded: 🟢 80+ | 🔵 60-79 | 🟡 below 60
- **Score breakdown** — explains the weight of each metric
- **Improvement potential** — current vs achievable score
- **Radar chart** — visual skill coverage across 5 dimensions
- **Missing skills** — role-specific gaps only
- **Section health** — color coded good/average/missing status
- **ATS issues** — specific formatting problems
- **AI suggestions** — checkable to track progress
- **Keyword comparison** — side-by-side matched vs missing

### Role Comparison Tab
Compare your resume against 5 job role profiles:
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Data Scientist
- DevOps Engineer

### Recruiter Tips Tab
- 6 insider tips from real hiring practices
- Full score breakdown explanation
- Why you got your specific score

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| `Cannot connect to server` | Make sure backend is running: `python run.py` |
| `CORS error` | Check `ALLOWED_ORIGINS` in backend `.env` matches your frontend URL |
| `Module not found` | Run `pip install -r requirements.txt` again |
| `Could not extract text` | Your PDF may be a scanned image — use a text-based PDF |
| `Analysis Failed 429` | API rate limit hit — wait 1 minute and retry |
| `html2canvas not found` | Run `npm install html2canvas jspdf` in frontend folder |
| Dashboard shows Demo Data | Always go through the Upload flow, don't navigate to /dashboard directly |
| Dark mode not working | Check `tailwind.config.js` has `darkMode: 'class'` |

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built by 
**Vishnu Vardhan G**
[![GitHub](https://img.shields.io/badge/GitHub-coach--24-black?logo=github)](https://github.com/coach-24)
and
Built by **V Meghana**

[![GitHub](https://img.shields.io/badge/GitHub-coach--24-black?logo=github)](https://github.com/Meghanaa21)
---

<div align="center">

**If this project helped you, give it a ⭐ on GitHub!**

</div>
