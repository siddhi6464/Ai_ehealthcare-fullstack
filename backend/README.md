# eHealthCare Backend

AI-Assisted Online Appointment & Wellness Notification System - Backend API

## 🚀 Features

- **User Authentication** - Register, Login with JWT
- **Role-Based Access** - Patient, Doctor, Admin roles
- **AI Symptom Analyzer** - Rule-based intelligent health recommendations
- **Appointment System** - Book, manage, and track appointments
- **Health Notifications** - Automated reminders for health checkups
- **Email Notifications** - Appointment confirmations and health alerts
- **Medical History** - Track patient medical records

## 📋 Prerequisites

Before running the backend, make sure you have:

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ehealthcare
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Note for Email:**
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail
- Generate App Password: Google Account → Security → 2-Step Verification → App Passwords

4. **Start MongoDB**

Make sure MongoDB is running:
```bash
# On Linux/Mac
sudo systemctl start mongod

# On Windows
net start MongoDB
```

5. **Run the server**

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── appointmentController.js
│   ├── aiController.js
│   └── notificationController.js
├── models/             # Database schemas
│   ├── User.js
│   ├── Appointment.js
│   └── Notification.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── appointmentRoutes.js
│   ├── aiRoutes.js
│   ├── notificationRoutes.js
│   └── userRoutes.js
├── services/           # Business logic
│   ├── aiEngine.js     # Rule-based AI for symptoms
│   ├── notificationScheduler.js
│   └── emailService.js
├── middleware/         # Custom middleware
│   └── auth.js
├── .env               # Environment variables
├── server.js          # Entry point
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PATCH /api/auth/profile` - Update profile (protected)

### AI Analysis
- `POST /api/ai/analyze` - Analyze symptoms with AI
- `POST /api/ai/recommendations` - Get health recommendations
- `GET /api/ai/symptoms` - Get all available symptoms
- `GET /api/ai/symptoms/:symptom/related` - Get related symptoms

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/my-appointments` - Get user appointments
- `GET /api/appointments/doctors` - Get all doctors
- `GET /api/appointments/doctor/appointments` - Get doctor's appointments (doctor only)
- `PATCH /api/appointments/:id/status` - Update appointment status
- `PATCH /api/appointments/:id/consultation` - Add consultation details (doctor only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/health-reminders` - Get health reminder settings
- `PATCH /api/notifications/health-reminders` - Update health reminders

### Users
- `PATCH /api/users/medical-history` - Update medical history
- `GET /api/users/medical-history` - Get medical history

## 🤖 AI Engine - How It Works

The Rule-Based AI Engine analyzes symptoms using predefined medical rules:

1. **Symptom Analysis**: Each symptom has associated conditions, recommendations, and precautions
2. **Severity Detection**: Automatically determines urgency (low, medium, high)
3. **Specialist Suggestion**: Recommends appropriate doctor specialization
4. **Prescription Generation**: Provides medication suggestions based on symptoms
5. **Risk Assessment**: Checks vitals and medical history for complications

### Example AI Request

```javascript
POST /api/ai/analyze
{
  "symptoms": ["fever", "headache", "body_ache"],
  "vitals": {
    "temperature": 101.5,
    "bloodPressure": "120/80"
  },
  "medicalHistory": []
}
```

## 🔔 Notification System

Automated health reminders run on scheduled intervals:

- **Health Reminders**: Daily at 9:00 AM
  - Menstrual cycle tracking
  - Blood pressure checks
  - Blood sugar monitoring

- **Appointment Reminders**: Daily at 6:00 PM
  - 24-hour advance notification

## 🧪 Testing the API

Use Postman or Thunder Client:

1. **Register a user**
```json
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

2. **Login**
```json
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

3. **Use the token**
Add to headers for protected routes:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🐛 Common Issues

### MongoDB Connection Error
```bash
Error: MongoNetworkError
```
**Solution**: Make sure MongoDB is running

### Email Not Sending
**Solution**: 
- Use Gmail App Password
- Enable "Less secure app access" OR use App Password
- Check firewall settings

### Port Already in Use
```bash
Error: listen EADDRINUSE :::5000
```
**Solution**: Change PORT in .env or kill the process using port 5000

## 📊 Database Collections

### Users
- Stores patient and doctor information
- Health reminder preferences
- Medical history

### Appointments
- Booking details
- AI recommendations
- Consultation records

### Notifications
- Health reminders
- Appointment alerts
- Read/unread status

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Role-based access control
- Input validation
- MongoDB injection prevention

## 👨‍💻 Development Tips

1. **Add more symptoms**: Edit `services/aiEngine.js`
2. **Customize email templates**: Edit `services/emailService.js`
3. **Change reminder schedules**: Edit `services/notificationScheduler.js`
4. **Add new routes**: Create in `routes/` folder

## 📝 Sample Doctor Registration

```json
POST /api/auth/register
{
  "name": "Dr. Smith",
  "email": "drsmith@example.com",
  "password": "doctor123",
  "role": "doctor",
  "specialization": "Cardiologist",
  "qualification": "MD, DM Cardiology",
  "experience": 10,
  "consultationFee": 500
}
```

## 🎯 Next Steps

1. Connect with React frontend
2. Add more AI rules for symptoms
3. Implement payment gateway
4. Add video consultation
5. Create admin dashboard

## 📞 Support

For issues or questions:
- Check the logs in console
- Review error messages
- Verify .env configuration
- Ensure MongoDB is running

---

**Made with ❤️ by Your Team**
