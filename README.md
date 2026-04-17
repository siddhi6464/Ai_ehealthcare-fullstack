# 🏥 eHealthCare - AI-Assisted Online Appointment & Wellness Notification System

**Full Stack MERN Application with Rule-Based AI**

A comprehensive healthcare platform that enables patients to book appointments, receive AI-powered health recommendations, and get automated wellness reminders.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Team](#team)

---

## ✨ Features

### 🤖 AI-Powered Features
- **Intelligent Symptom Analyzer**: Rule-based AI engine that analyzes symptoms
- **Health Recommendations**: Personalized suggestions based on symptoms
- **Prescription Generation**: AI-generated medication and lifestyle recommendations
- **Specialist Suggestion**: Recommends appropriate doctor specialization

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
- **Rule-Based System** - Custom symptom analyzer
- **Decision Trees** - Medical knowledge base
- **Pattern Matching** - Symptom-condition mapping

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Check Installations
```bash
node --version   # Should show v14+
npm --version    # Should show 6+
mongo --version  # Should show 4.4+
```

---

## 🚀 Installation

### Step 1: Clone/Extract the Project
```bash
# If you have the folder, navigate to it
cd ehealthcare
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

**Dependencies being installed:**
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- node-cron
- nodemailer
- validator

### Step 3: Configure Backend Environment

Create `.env` file in `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ehealthcare
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
```

### Step 4: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

**Dependencies being installed:**
- react
- react-dom
- react-router-dom
- axios
- react-toastify
- react-icons
- date-fns

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
# OR
sudo service mongod start
```

**Verify MongoDB is running:**
```bash
# Open mongo shell
mongosh
# OR
mongo

# You should see: connecting to: mongodb://127.0.0.1:27017
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

Backend will be running at: **http://localhost:5000**

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
ehealthcare/
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
│   │   ├── aiEngine.js      # ⭐ Rule-Based AI
│   │   ├── notificationScheduler.js
│   │   └── emailService.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point
│   ├── package.json
│   └── README.md
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
│   │   │   ├── BookAppointment.js
│   │   │   ├── AIAnalysis.js
│   │   │   └── HealthReminders.js
│   │   ├── context/         # State management
│   │   │   └── AuthContext.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── App.js           # Main component
│   │   ├── App.css          # Global styles
│   │   └── index.js         # Entry point
│   ├── .env
│   ├── package.json
│   └── README.md
│
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

#### Analyze Symptoms
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
      "precautions": [...],
      "urgency": "Consult doctor if fever persists",
      "suggestedSpecialist": "General Physician"
    },
    "prescription": {
      "medications": [...],
      "lifestyle": [...],
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

The **Rule-Based AI Engine** (`backend/services/aiEngine.js`) is the core intelligence:

### Features:
1. **Symptom Database**: 10+ symptoms with detailed medical rules
2. **Severity Detection**: Automatically determines urgency (low/medium/high)
3. **Condition Mapping**: Links symptoms to possible medical conditions
4. **Recommendations**: Provides medication and lifestyle advice
5. **Specialist Suggestion**: Recommends appropriate doctor specialization
6. **Risk Assessment**: Evaluates vitals and medical history

### Available Symptoms:
- Fever
- Cough
- Headache
- Chest pain (EMERGENCY)
- Stomach pain
- Dizziness
- Body ache
- Breathing difficulty (EMERGENCY)
- Nausea

### Example Rule:
```javascript
fever: {
  severity: 'medium',
  possibleConditions: ['Viral Fever', 'Flu', 'Common Cold'],
  recommendations: [
    'Take paracetamol (500mg) for fever above 100°F',
    'Rest adequately',
    'Drink plenty of fluids'
  ],
  urgency: 'Consult doctor if fever > 102°F or persists beyond 3 days'
}
```

### Adding New Symptoms:
Edit `backend/services/aiEngine.js` and add to `symptomRules` object.

---

## 🔔 Notification System

### Automated Schedules:
- **Health Reminders**: Daily at 9:00 AM
- **Appointment Reminders**: Daily at 6:00 PM

### Types of Reminders:
1. **Menstrual Cycle**: 2 days before expected date
2. **Blood Pressure**: Based on frequency (daily/weekly/monthly)
3. **Blood Sugar**: Based on frequency
4. **Appointments**: 24 hours before appointment

### Configure in Code:
Edit `backend/services/notificationScheduler.js`

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
```bash
# Use the registration form or API
Name: Test Patient
Email: patient@test.com
Password: password123
Role: Patient
```

**Doctor:**
```bash
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
- See AI recommendations!

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
**Solution:**
- Make sure MongoDB is running: `sudo systemctl start mongod`
- Check connection string in `.env`

### Port Already in Use
```
Error: EADDRINUSE :::5000
```
**Solution:**
- Change PORT in backend `.env`
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### Frontend Can't Connect to Backend
**Solution:**
- Check `REACT_APP_API_URL` in frontend `.env`
- Make sure backend is running
- Check CORS settings in `backend/server.js`

### Email Not Sending
**Solution:**
- Use Gmail App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`
- Verify 2FA is enabled on Gmail

---

## 📝 Missing Files to Create

You still need to create these frontend pages:

### Dashboard.js
```javascript
// Patient dashboard with stats and quick actions
```

### BookAppointment.js
```javascript
// Form to book appointment with doctor selection
```

### MyAppointments.js
```javascript
// List of user's appointments
```

### AIAnalysis.js
```javascript
// Symptom selector and AI analysis display
```

### HealthReminders.js
```javascript
// Configure health reminder preferences
```

### DoctorDashboard.js
```javascript
// Doctor's view of appointments
```

**I can create these for you if you need them!**

---

## 🎯 Features to Add (Future Enhancements)

1. ✅ Video consultation
2. ✅ Payment integration
3. ✅ Prescription download PDF
4. ✅ Medical reports upload
5. ✅ Chat with doctor
6. ✅ Admin dashboard
7. ✅ Doctor reviews and ratings
8. ✅ Appointment history charts

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

## 📞 Support

For issues:
1. Check backend console for errors
2. Check frontend console (F12 in browser)
3. Verify MongoDB is running
4. Check `.env` configuration
5. Ensure all dependencies are installed

---

## 📄 License

This project is for educational purposes - MIT License

---

## 🎉 Success Checklist

- [ ] MongoDB is installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` files configured properly
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can register and login
- [ ] Can test AI analysis
- [ ] Notifications working

---

**Made with ❤️ for Capstone Project**

**Good luck with your project presentation! 🚀**
