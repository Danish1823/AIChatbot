# 🤖 AI Chatbot

A full-stack AI chatbot application built using **React.js, Flask, Python, and Google Gemini API**.

The application provides a modern conversational interface where users can interact with an AI assistant using text and voice. The React frontend communicates with a Flask REST API backend, which securely connects to Google Gemini to generate AI responses.

The project also includes voice input and AI voice output for a more natural AI-assistant experience.

---

## 🚀 Live Demo

### 🌐 Live Application

https://ai-chatbot-gilt-sigma.vercel.app


### 🔗 Backend API

https://ai-chatbot-backend-ldb9.onrender.com

---

# ✨ Features

- 🤖 AI-powered conversations
- 💬 Interactive chat interface
- 🎙️ Voice input
- 🔊 AI voice responses
- 👩 Female AI-assistant style voice
- 🌙 Dark mode
- ☀️ Light mode
- 📝 Chat history during the current session
- 📋 Copy AI responses
- ⏳ AI typing/loading animation
- 🆕 New Chat functionality
- 📱 Responsive design
- ⚡ REST API communication
- 🔐 Environment-variable based API key management
- 🛡️ Backend error handling
- 🌐 Production deployment
- ☁️ Vercel frontend deployment
- ☁️ Render backend deployment

---


## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Python
- Flask
- Flask-CORS
- REST API

### AI
- Google Gemini API

### Deployment
- Frontend: Vercel
- Backend: Render

### Tools

- VS Code



## 🏗️ Project Structure

```text
AIChatbot/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md

# 🖥️ Application Overview

This project is a full-stack AI chatbot.

The user interacts with the React frontend. The frontend sends the user's message to the Flask backend through a REST API.

The Flask backend sends the message to Google Gemini and receives the AI-generated response.

The response is then returned to the React frontend and displayed to the user.

The application can also convert AI responses into speech to provide a voice-assistant experience.

---

# 🏗️ System Architecture

```text
                         ┌───────────────────┐
                         │       USER        │
                         └─────────┬─────────┘
                                   │
                           Text / Voice Input
                                   │
                                   ▼
                    ┌─────────────────────────┐
                    │     React Frontend      │
                    │      Vite + React       │
                    └────────────┬────────────┘
                                 │
                            HTTP Request
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Flask Backend       │
                    │       Python REST API   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Google Gemini       │
                    │       AI Model          │
                    └────────────┬────────────┘
                                 │
                            AI Response
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Flask Backend       │
                    └────────────┬────────────┘
                                 │
                            JSON Response
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     React Frontend      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                           🔊 Voice Output
                                 │
                                 ▼
                               USER