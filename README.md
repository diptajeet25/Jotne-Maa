# Jotne Maa

> An AI-powered maternity healthcare platform that combines intelligent health assistance, pregnancy tracking, and healthcare services into one modern web application.

<p align="center">
  <a href="https://jotnemaa.netlify.app/">🌐 Live Demo</a>
</p>

---

## Overview

Pregnancy often requires mothers to use multiple platforms for medical guidance, nutrition planning, symptom analysis, doctor appointments, and emergency support. Managing all of these separately can be overwhelming.

**Jotne Maa** brings these essential services together into a single AI-powered platform that helps expecting mothers make informed decisions throughout their pregnancy journey.

The platform combines full-stack web development with machine learning and AI services to provide personalized healthcare recommendations while maintaining an intuitive user experience.

---

# Features

## 🤖 AI Healthcare Assistant

### AI Pregnancy Chatbot
Provides instant answers to pregnancy-related questions using Large Language Models, helping users understand symptoms, pregnancy stages, and general maternal health guidance.

### AI Diet Planner
Generates personalized meal recommendations based on pregnancy stage and nutritional requirements.

### AI Maternal Risk Analyzer
Predicts maternal health risk using a trained Machine Learning model and provides preventive recommendations.

### AI Medical Report Analyzer
Extracts text from uploaded medical reports using OCR and summarizes important findings into simple, easy-to-understand language.

### Mental Health Assessment
Evaluates emotional well-being through questionnaire-based analysis and provides personalized recommendations.

---

## 🏥 Healthcare Services

- Week-by-week pregnancy guidance (1–42 Weeks)
- Doctor appointment booking
- Emergency hospital finder
- Authentication & authorization
- Role-based authentication
- Responsive design

---

# System Architecture

```
                     React Frontend
                           │
             Firebase Authentication
                           │
                           ▼
               Node.js + Express API
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
         ▼                                   ▼
    MongoDB Atlas                 FastAPI AI Services
                                              │
                    ┌──────────────┬───────────────┬─────────────┐
                    ▼              ▼               ▼             ▼
               Chatbot       Risk Model     Medical Report Analysis    Diet Planner
```

The application follows a microservice-inspired architecture where AI services run independently from the main backend. This separation allows machine learning models to evolve without affecting the core application.

---

# Tech Stack

## Frontend

- React.js
- React Router
- Tailwind CSS
- TanStack Query
- Axios
- Firebase Authentication
- React Hook Form

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- REST APIs

---

## AI & Machine Learning

- Python
- Machine Learning
- OCR
- Large Language Models (LLMs)

---

# Why This Architecture?

Instead of embedding AI directly into the Node.js backend, the application separates AI services into independent Python APIs.

This architecture provides:

- Better scalability
- Independent deployment
- Easier model updates
- Cleaner separation of concerns
- Better maintainability

Node.js manages business logic and database operations, while FastAPI focuses solely on AI inference.

---

# User Roles

### User

- Register/Login
- Book appointments
- Chat with AI assistant
- Analyze reports
- Use diet planner
- Check maternal risk
- View pregnancy guidance

### Doctor

- Manage appointments
- View patient requests
- Update availability


# Project Highlights

- AI-powered healthcare platform
- Full Stack MERN application
- Microservice architecture
- Machine Learning integration
- AI-based medical report analysis
- Role-based authentication
- Responsive UI
- RESTful API architecture
- Production deployment

---

# Engineering Challenges

### Integrating Multiple AI Services

Each AI feature uses a different processing pipeline and response format. Building a consistent API layer while handling latency, failures, and asynchronous requests required careful backend design.

### Medical Report Processing

Medical reports vary significantly in layout and quality. Combining OCR with LLM-based interpretation was necessary to transform raw extracted text into meaningful summaries.

### AI & Backend Communication

The Node.js server communicates with multiple Python services while ensuring the user experiences a smooth workflow despite potentially long AI processing times.

---

# Future Improvements

- Video consultation
- Pregnancy reminder system
- Real-time doctor chat
- Wearable device integration
- Multi-language support
- Medication reminder
- Push notifications
- AI fetal growth prediction

---

# Local Setup

Clone the repository

```bash
git clone https://github.com/your-username/jotne-maa.git
```

Install frontend

```bash
npm install
```

Install backend

```bash
cd server
npm install
```

Configure environment variables

```env
MONGODB_URI=
JWT_SECRET=
FIREBASE_API_KEY=
GROK_API_KEY=
...
```

Run development servers

```bash
npm run dev
```

---

# Live Demo

🌐 https://jotnemaa.netlify.app/

---

# Author

**Diptajeet Roy**

Full Stack Developer (MERN)

GitHub: https://github.com/diptajeet25
