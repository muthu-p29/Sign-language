# SignEase - AI-Powered Sign Language Translation Platform

<div align="center">

![SignEase Logo](assets/logo.png)

**Transform speech and text into sign language with AI-powered natural language processing**

[![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.1+-green.svg)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18.3+-blue.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🚀 Live Demo](https://signease-demo.com) • [📖 Documentation](docs/) • [🎥 Video Demo](https://youtu.be/YiHhD0QGrno)

</div>

## 🌟 Overview

SignEase is a comprehensive web application that bridges communication gaps by converting speech and text into Indian Sign Language animations. Built with modern web technologies and powered by advanced NLP algorithms, it provides an accessible, real-time translation platform for the deaf and hard-of-hearing community.

### ✨ Key Features

- 🎤 **Real-time Speech Recognition** - Convert spoken words to sign language instantly
- 📝 **Text-to-Sign Translation** - Type or paste text for sign language conversion
- 🤖 **AI-Powered NLP** - Advanced text processing with tense detection and context awareness
- 🎬 **High-Quality Animations** - Smooth 3D sign language video sequences
- 🌓 **Dark/Light Mode** - Modern UI with accessibility-first design
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🔐 **User Authentication** - Secure login/signup system
- 🎓 **Interactive Learning** - Built-in tutorials and practice modules
- ⚡ **Fast Performance** - Optimized with modern React and efficient backend APIs

## 🏗️ Architecture

### Frontend (React + Vite)

- **Framework**: React 18.3.1 with Vite for blazing-fast development
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth, accessible interactions
- **Routing**: React Router v6 with protected routes
- **State Management**: Zustand for lightweight, efficient state handling
- **UI Components**: Custom component library with Lucide React icons

### Backend (Django)

- **Framework**: Django 4.1+ with REST API architecture
- **NLP Engine**: NLTK for advanced text processing
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Authentication**: Django's built-in auth with JWT support
- **Static Assets**: Optimized video delivery system

### Core Technologies

| Category       | Technology                    | Purpose                     |
| -------------- | ----------------------------- | --------------------------- |
| **Frontend**   | React, Vite, Tailwind CSS     | Modern, responsive UI       |
| **Backend**    | Django, Django REST Framework | Robust API server           |
| **NLP**        | NLTK, WordNet                 | Text processing & analysis  |
| **Animations** | Blender 3D, MP4 videos        | Sign language animations    |
| **Speech**     | Web Speech API                | Real-time voice recognition |
| **Deployment** | Docker, GitHub Actions        | CI/CD pipeline              |

## 🚀 Quick Start

### Prerequisites

- **Python** 3.7 or higher
- **Node.js** 16.0 or higher
- **npm** or **yarn**
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/signease.git
   cd signease
   ```

2. **Backend Setup**

   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install Python dependencies
   pip install -r requirements.txt

   # Run database migrations
   python manage.py migrate

   # Create superuser (optional)
   python manage.py createsuperuser

   # Start Django server
   python manage.py runserver
   ```

3. **Frontend Setup**

   ```bash
   # Navigate to frontend directory
   cd frontend

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Django Admin: http://localhost:8000/admin

## 📁 Project Structure

```
signease/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── store/             # Zustand state management
│   │   ├── styles/            # Global styles and Tailwind config
│   │   └── utils/             # Helper functions
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── A2SL/                      # Django backend application
│   ├── settings.py            # Django configuration
│   ├── urls.py               # URL routing
│   ├── views.py              # API endpoints and logic
│   └── wsgi.py               # WSGI configuration
├── assets/                    # Sign language video assets
├── templates/                 # Django templates (legacy)
├── requirements.txt           # Python dependencies
├── manage.py                 # Django management script
└── README.md                 # This file
```

## 🎯 Usage Guide

### Basic Translation

1. **Navigate** to the translation page
2. **Choose input method**:
   - Type text in the input field
   - Click the microphone for voice input
3. **Click "Translate"** to process your input
4. **Watch** the sign language animation sequence
5. **Control playback** with the video player controls

### Advanced Features

- **Learning Mode**: Practice with interactive tutorials
- **Batch Translation**: Process multiple sentences
- **Custom Speed**: Adjust animation playback speed
- **Repeat Mode**: Loop animations for better learning

## 🤖 NLP Processing Pipeline

1. **Text Preprocessing**: Tokenization and normalization
2. **POS Tagging**: Part-of-speech analysis for context
3. **Tense Detection**: Automatic tense identification
4. **Stop Word Removal**: Filter non-essential words
5. **Lemmatization**: Convert words to base forms
6. **Sign Language Mapping**: Convert to appropriate signs
7. **Temporal Markers**: Add tense indicators
8. **Fallback Handling**: Spell out unknown words

## 🎨 UI/UX Features

- **Modern Design System**: Clean, accessible interface
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Framer Motion powered transitions
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Loading States**: Beautiful loading animations
- **Error Handling**: User-friendly error messages

## 🔧 Development

### Available Scripts

#### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend

```bash
python manage.py runserver    # Start development server
python manage.py test         # Run tests
python manage.py migrate      # Apply database migrations
python manage.py collectstatic # Collect static files
```

### Adding New Sign Language Videos

1. Create MP4 video files with proper naming (e.g., `Hello.mp4`)
2. Place videos in the `assets/` directory
3. Videos are automatically detected by the system
4. Unknown words are automatically spelled out letter by letter

