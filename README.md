# 🏥 eHealthCare - AI-Assisted Online Appointment & Wellness Notification System

**Full Stack MERN Application powered by Google Gemini AI (LLM)**

A comprehensive healthcare platform that enables patients to book appointments, receive **LLM-powered health analysis** via Google Gemini, and get automated wellness reminders. The AI engine uses natural language understanding to evaluate symptoms, suggest diagnoses, generate prescriptions, and recommend specialists — going far beyond traditional rule-based systems.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [AI Engine](#ai-engine)
- [Team](#team)

---

## ✨ Features

### 🤖 Gemini LLM-Powered AI Features
- **Intelligent Symptom Analyzer**: Powered by Google Gemini 2.5 Flash — analyzes symptoms using generative AI and NLP, not static rules
- **Context-Aware Diagnosis**: Considers symptoms, vitals, allergies, and medical history together for holistic analysis
- **Smart Prescription Generation**: AI-generated medication recommendations with allergy checks and banned-drug filtering
- **Specialist Suggestion**: Recommends the most appropriate doctor specialization based on the full clinical picture
- **Graceful Fallback**: Automatic retry with exponential backoff; falls back to a built-in rule-based engine if the LLM is unavailable

### 📅 Appointment Management
- Book appointments with doctors
- View appointment history
- Cancel/reschedule appointments
- Doctor consultation details
- AI recommendations before consultation

### 🔔 Health Notifications
- **Menstrual Cycle Tracking**: Automatic reminders
- **Blood Pressure Monitoring**: Scheduled checkup alerts
- **Blood Sugar Testing**: Diabetes management reminders
- **Appointment Reminders**: 24-hour advance notifications
- **Email Notifications**: Automated email alerts

### 👨‍⚕️ Doctor Profile Management
- Rich doctor profiles with biography and achievements
- Custom avatar support
- Editable profile for doctors
- Patient-facing doctor cards

### 👥 User Management
- Patient and Doctor roles
- Secure authentication (JWT)
- Profile management
- Medical history tracking
- Allergy and medication records

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **node-cron** - Scheduled tasks
- **nodemailer** - Email notifications

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

### AI Engine
- **Google Gemini 2.5 Flash** - Large Language Model for symptom analysis and prescription generation
- **@google/generative-ai** - Official Google Generative AI SDK
- **Rule-Based Fallback** - Built-in medical knowledge base used when LLM is unavailable

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Google Gemini API Key** - [Get one here](https://aistudio.google.com/app/apikey)

### Check Installations
```bash
node --version   # Should show v14+
npm --version    # Should show 6+
mongo --version  # Should show 4.4+
```

---

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/siddhi6464/Ai_ehealthcare-fullstack.git
cd Ai_ehealthcare-fullstack
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

**Key dependencies:**
- express, mongoose, bcryptjs, jsonwebtoken
- dotenv, cors, node-cron, nodemailer
- @google/generative-ai (Gemini SDK)

### Step 3: Configure Backend Environment

Create `.env` file in `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ehealthcare
JWT_SECRET=your_super_secret_jwt_key_change_in_production
GEMINI_API_KEY=your_google_gemini_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
```

> ⚠️ **Important**: You must set a valid `GEMINI_API_KEY` for the AI analysis to work. Get one free at [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### Step 5: Configure Frontend Environment

Create `.env` file in `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎮 Running the Application

### Step 1: Start MongoDB

**On Windows:**
```bash
net start MongoDB
```

**On Linux/Mac:**
```bash
sudo systemctl start mongod
```

### Step 2: Start Backend Server

Open a new terminal:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
🔔 Notification scheduler started successfully
```

### Step 3: Start Frontend

Open another terminal:
```bash
cd frontend
npm start
```

Frontend will automatically open at: **http://localhost:3000**

---

## 📁 Project Structure

```
Ai_ehealthcare-fullstack/
├── backend/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   ├── aiController.js
│   │   └── notificationController.js
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   └── Notification.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── userRoutes.js
│   ├── services/            # Business logic
│   │   ├── aiEngine.js      # ⭐ Gemini LLM AI Engine
│   │   ├── notificationScheduler.js
│   │   └── emailService.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   ├── server.js            # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── pages/           # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── DoctorProfile.js
│   │   │   ├── BookAppointment.js
│   │   │   ├── MyAppointments.js
│   │   │   ├── AIAnalysis.js
│   │   │   └── HealthReminders.js
│   │   ├── context/         # State management
│   │   │   └── AuthContext.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.js           # Main component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Entry point
│   └── package.json
│
├── .gitignore
└── README.md                # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "patient"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### AI Endpoints

#### Analyze Symptoms (Gemini LLM)
```http
POST /api/ai/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "symptoms": ["fever", "headache", "body_ache"],
  "vitals": {
    "temperature": 101.5,
    "bloodPressure": "120/80"
  },
  "medicalHistory": []
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "analysis": {
      "severity": "medium",
      "possibleConditions": ["Viral Fever", "Flu"],
      "recommendations": [
        "Take paracetamol for fever",
        "Rest adequately",
        "Drink plenty of fluids"
      ],
      "precautions": ["..."],
      "urgency": "Consult doctor if fever persists",
      "suggestedSpecialist": "General Physician",
      "riskFactors": ["..."]
    },
    "prescription": {
      "medications": [
        {
          "medicine": "Paracetamol",
          "dosage": "500mg",
          "frequency": "Every 6 hours",
          "duration": "3-5 days",
          "instructions": "Take after meals",
          "requiresPrescription": false
        }
      ],
      "lifestyle": ["..."],
      "followUp": "3-5 days if symptoms persist"
    }
  }
}
```

### Appointment Endpoints

#### Create Appointment
```http
POST /api/appointments
Authorization: Bearer <token>

{
  "doctor": "doctorId",
  "appointmentDate": "2024-02-15",
  "timeSlot": {
    "startTime": "10:00 AM",
    "endTime": "10:30 AM"
  },
  "reason": "Regular checkup",
  "symptoms": ["fever", "cough"]
}
```

#### Get My Appointments
```http
GET /api/appointments/my-appointments
Authorization: Bearer <token>
```

#### Get All Doctors
```http
GET /api/appointments/doctors
Authorization: Bearer <token>
```

---

## 🤖 AI Engine - How It Works

The AI engine (`backend/services/aiEngine.js`) uses a **two-tier architecture**:

### Tier 1: Google Gemini LLM (Primary)
The `generateAIAnalysis()` function sends a structured medical prompt to **Google Gemini 2.5 Flash** with:
- Patient symptoms, vitals, and full medical history
- Allergy and banned-drug constraints baked into the prompt
- A strict JSON schema the model must follow
- **Retry logic** with exponential backoff (3 attempts)

The LLM evaluates the complete clinical picture using natural language understanding — producing context-aware diagnoses and personalized prescriptions that a static rule system cannot match.

### Tier 2: Rule-Based Fallback
If the Gemini API is unavailable (rate limits, network issues, etc.), the system gracefully falls back to an in-built medical knowledge base with:
- **9+ symptom rules** with severity, conditions, and recommendations
- **Specialist mapping** (cardiac, respiratory, neurological, gastro, general)
- **Vitals-based risk detection** (temperature, BP, blood sugar)
- **Allergy checking** and **banned drug filtering** (e.g., Ranitidine)

### Safety Features
- 🚫 Banned medications (Ranitidine, Nimesulide) are never prescribed
- ⚠️ Allergy cross-referencing against medical history
- 🔴 Emergency symptom detection (chest pain, breathing difficulty)
- 💊 Prescription-required flagging for antibiotics and controlled drugs

---

## 🔔 Notification System

### Automated Schedules
- **Health Reminders**: Daily at 9:00 AM
- **Appointment Reminders**: Daily at 6:00 PM

### Types of Reminders
1. **Menstrual Cycle**: 2 days before expected date
2. **Blood Pressure**: Based on frequency (daily/weekly/monthly)
3. **Blood Sugar**: Based on frequency
4. **Appointments**: 24 hours before appointment

---

## 📧 Email Configuration

### For Gmail:

1. **Enable 2-Factor Authentication**
   - Go to Google Account → Security
   - Turn on 2-Step Verification

2. **Generate App Password**
   - Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"
   - Use this password in `.env`

3. **Update .env**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=generated-app-password
```

---

## 🧪 Testing the Application

### 1. Register Test Users

**Patient:**
```
Name: Test Patient
Email: patient@test.com
Password: password123
Role: Patient
```

**Doctor:**
```
Name: Dr. Smith
Email: doctor@test.com
Password: password123
Role: Doctor
Specialization: Cardiologist
```

### 2. Test AI Analysis
- Login as patient
- Go to "AI Analysis"
- Select symptoms: fever, headache, body_ache
- Enter vitals
- Get Gemini-powered AI recommendations!

### 3. Book Appointment
- Go to "Book Appointment"
- Select a doctor
- Choose date and time
- Enter reason and symptoms
- Submit!

### 4. Enable Health Reminders
- Go to "Health Reminders"
- Enable blood pressure monitoring
- Set frequency: weekly
- System will send reminders!

---

## 🐛 Troubleshooting

### MongoDB Not Connecting
```
Error: MongoNetworkError
```
**Solution:** Make sure MongoDB is running: `sudo systemctl start mongod`

### Gemini API Errors
```
Error: 503 Service Unavailable
```
**Solution:** The system will automatically retry 3 times with exponential backoff. If all retries fail, it falls back to the rule-based engine. Check that your `GEMINI_API_KEY` is valid.

### Port Already in Use
```
Error: EADDRINUSE :::5000
```
**Solution:** Change PORT in backend `.env` or kill the existing process.

### Frontend Can't Connect to Backend
**Solution:** Check `REACT_APP_API_URL` in frontend `.env` and ensure backend is running.

### Email Not Sending
**Solution:** Use Gmail App Password (not regular password). Verify 2FA is enabled.

---

## 👥 Team

**Group P26**
- Siddhi Agarwal - 1032230502
- Sharal Chalse - 1032233748
- Yash Gulunjkar - 1032230987
- Prasad Patil - 1032220402

**Department**: Computer Engineering & Technology  
**Level**: CSE Level 1  
**Panel**: F/G

---

## 📄 License

This project is for educational purposes - MIT License

---

**Made with ❤️ for Capstone Project**

**Good luck with your project presentation! 🚀**
