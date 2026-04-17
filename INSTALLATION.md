# 📦 INSTALLATION INSTRUCTIONS

## 🎯 After Extracting the ZIP File

### Step 1: Extract the ZIP
- Extract `ehealthcare-project.zip` to your desired location
- You'll get a folder named `ehealthcare/`

### Step 2: Install Prerequisites
You need these installed on your computer:

#### 1. Node.js (Required)
- Download: https://nodejs.org/
- Version: 14 or higher
- This includes npm automatically

#### 2. MongoDB (Required)
- **Windows**: https://www.mongodb.com/try/download/community
  - Download the MSI installer
  - Install with default settings
  - MongoDB Compass will also be installed (useful GUI)

- **Mac**: 
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```

- **Linux**:
  ```bash
  sudo apt-get update
  sudo apt-get install mongodb
  sudo systemctl start mongod
  sudo systemctl enable mongod
  ```

### Step 3: Setup Backend

Open terminal/command prompt and navigate to backend folder:

```bash
cd ehealthcare/backend
```

#### Install Dependencies:
```bash
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- node-cron
- nodemailer
- validator
- nodemon (dev dependency)

#### Configure .env File:
The `.env` file is already created. Review and update if needed:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ehealthcare
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024

# Optional: For email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

FRONTEND_URL=http://localhost:3000
```

**Note**: Email is optional. The app works without it.

#### Start Backend:
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 Environment: development
🔗 API: http://localhost:5000/api
🔔 Notification scheduler started successfully
```

**Keep this terminal open!**

### Step 4: Setup Frontend

Open a **NEW terminal** (don't close backend terminal):

```bash
cd ehealthcare/frontend
```

#### Install Dependencies:
```bash
npm install
```

This will install:
- react & react-dom
- react-router-dom
- axios
- react-toastify
- react-icons
- date-fns
- react-scripts

#### Configure .env File:
Create a `.env` file in the frontend folder if not present:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### Start Frontend:
```bash
npm start
```

Browser will automatically open at: **http://localhost:3000**

### Step 5: Test the Application

1. **Register**: Create an account (Patient or Doctor)
2. **Login**: Use your credentials
3. **Dashboard**: You'll see the main dashboard
4. **AI Analysis**: Click on "AI Analysis" and test the symptom analyzer!

---

## 🎯 Quick Test Checklist

- [ ] MongoDB is running
- [ ] Backend terminal shows "MongoDB Connected Successfully"
- [ ] Frontend opened in browser at localhost:3000
- [ ] Can register a new user
- [ ] Can login
- [ ] Can see dashboard
- [ ] Can use AI Analysis feature

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot connect to MongoDB"
**Solution:**
- Make sure MongoDB is running
- Windows: `net start MongoDB`
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### Issue 2: "Port 5000 already in use"
**Solution:**
- Kill the process using port 5000
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
- Mac/Linux: `lsof -ti:5000 | xargs kill -9`
- OR change PORT in backend/.env to 5001

### Issue 3: "Module not found" errors
**Solution:**
```bash
# In backend folder:
rm -rf node_modules package-lock.json
npm install

# In frontend folder:
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Frontend can't connect to backend
**Solution:**
- Check backend is running (terminal should show "Server running on port 5000")
- Check frontend .env has correct API URL: `REACT_APP_API_URL=http://localhost:5000/api`
- Restart frontend: Ctrl+C then `npm start`

### Issue 5: "CORS error" in browser console
**Solution:**
- Backend already has CORS enabled
- Make sure backend is running
- Check frontend is accessing correct URL

---

## 📧 Email Configuration (Optional)

If you want email notifications to work:

### For Gmail:
1. Go to: https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to: https://myaccount.google.com/apppasswords
4. Generate password for "Mail"
5. Copy the 16-character password
6. Update in backend/.env:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

**Note**: Without email config, app works fine but won't send emails.

---

## 🎮 Using the Application

### As a Patient:
1. Register with role "Patient"
2. Dashboard: See your stats
3. AI Analysis: 
   - Select symptoms (fever, headache, etc.)
   - Enter vitals (optional)
   - Click "Analyze Symptoms"
   - Get AI recommendations!
4. Book Appointment: (UI placeholder - backend ready)
5. Health Reminders: Configure your health alerts

### As a Doctor:
1. Register with role "Doctor"
2. Add specialization
3. View patient appointments
4. Add consultation notes
5. Write prescriptions

---

## 📁 Project Structure

```
ehealthcare/
├── backend/           # Node.js + Express backend
│   ├── controllers/   # Request handlers
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── services/      # Business logic (AI Engine here!)
│   ├── middleware/    # Authentication
│   └── server.js      # Entry point
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # State management
│   │   └── services/    # API calls
│   └── public/
├── README.md          # Complete documentation
├── QUICKSTART.md      # Quick setup guide
└── PROJECT_SUMMARY.md # What's built and how to demo
```

---

## 🚀 Running in Production

### Backend:
```bash
cd backend
npm start
```

### Frontend:
```bash
cd frontend
npm run build
# Serve the build folder with any static server
```

---

## 📊 Database

- **Database Name**: ehealthcare
- **Collections**:
  - users (patients, doctors, admins)
  - appointments (booking records)
  - notifications (health reminders)

View data using:
- MongoDB Compass (GUI)
- mongosh or mongo shell (CLI)

---

## 🎯 Key Features to Demo

1. **AI Symptom Analyzer** ⭐
   - Select multiple symptoms
   - Get intelligent recommendations
   - See AI-generated prescriptions

2. **User Management**
   - Registration with roles
   - Secure login
   - Profile management

3. **Automated Notifications**
   - Health reminders
   - Appointment alerts

---

## 💡 Development Tips

### Hot Reload:
- Backend: Uses nodemon (auto-restart on file changes)
- Frontend: Uses React hot reload

### Testing API:
- Use Postman or Thunder Client
- Base URL: http://localhost:5000/api
- Auth routes: /api/auth/*
- AI routes: /api/ai/*

### Adding More Symptoms:
Edit: `backend/services/aiEngine.js`
Add new symptom rules to the `symptomRules` object

---

## 📞 Support

If you encounter issues:

1. **Check logs**: Both terminal windows for errors
2. **Verify services**: MongoDB running, ports free
3. **Review docs**: README.md, QUICKSTART.md
4. **Reset**: Delete node_modules, reinstall

---

## 🎓 For Presentation

### Demo Flow:
1. Show login/register
2. Create patient account
3. Navigate to AI Analysis
4. Select symptoms + enter vitals
5. Show AI recommendations
6. Explain the rule-based AI logic
7. Show code in aiEngine.js

### Talk Points:
- Full-stack MERN application
- Rule-based AI (explainable intelligence)
- Automated health reminders
- Scalable architecture
- Security (JWT, bcrypt)

---

## ✅ Final Checklist

Before presenting:
- [ ] MongoDB installed and running
- [ ] Both backend and frontend running
- [ ] Test registration
- [ ] Test login
- [ ] Test AI analysis feature
- [ ] Screenshots/video backup ready
- [ ] Know the code (especially aiEngine.js)

---

**Your project is ready to run and demo!** 🎉

**Group P26 - Best of luck!** 🚀

For detailed documentation, see:
- README.md - Complete guide
- QUICKSTART.md - Fast setup
- PROJECT_SUMMARY.md - What's built

---

**Made with ❤️ for your Capstone Project**
