# 🚀 QUICK START GUIDE - eHealthCare Project

**Get your project running in 10 minutes!**

---

## ✅ Step 1: Install Prerequisites (5 minutes)

### 1.1 Install Node.js
- Download: https://nodejs.org/ (LTS version)
- Verify: Open terminal/cmd and type `node --version`
- Should show: v14 or higher

### 1.2 Install MongoDB
- **Windows**: https://www.mongodb.com/try/download/community
  - Download MSI installer
  - Install with default settings
  - MongoDB should auto-start
  
- **Mac**: 
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```

- **Linux**:
  ```bash
  sudo apt-get install mongodb
  sudo systemctl start mongod
  ```

### 1.3 Verify MongoDB
```bash
mongosh
# OR
mongo

# You should see: connecting to: mongodb://127.0.0.1:27017
# Type 'exit' to quit
```

---

## ✅ Step 2: Setup Backend (3 minutes)

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

**Wait for all packages to install...**

### 2.2 Configure Environment
Create file `.env` in `backend/` folder with this content:

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

**Note**: Replace `your-email@gmail.com` and `your-gmail-app-password` with real values if you want email notifications. Otherwise, the app will work fine without it!

### 2.3 Start Backend
```bash
npm run dev
```

**You should see:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
🔔 Notification scheduler started successfully
```

**Keep this terminal open!**

---

## ✅ Step 3: Setup Frontend (2 minutes)

### 3.1 Open New Terminal
**DO NOT close the backend terminal!**

Open a NEW terminal/cmd window.

### 3.2 Install Dependencies
```bash
cd frontend
npm install
```

### 3.3 Configure Environment
Create file `.env` in `frontend/` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3.4 Start Frontend
```bash
npm start
```

**Browser will automatically open:** http://localhost:3000

---

## ✅ Step 4: Test the Application (5 minutes)

### 4.1 Register a Patient Account
1. Click "Register here"
2. Fill in:
   - Name: Test Patient
   - Email: patient@test.com
   - Password: password123
   - Role: Patient
3. Click Register

**You're now logged in!**

### 4.2 Test AI Analysis (The Star Feature! 🌟)
1. Click "AI Analysis" in navbar
2. Select symptoms:
   - Click on "Fever"
   - Click on "Headache"
   - Click on "Body Ache"
3. Enter vitals (optional):
   - Temperature: 101.5
   - Blood Pressure: 120/80
4. Click "🧠 Analyze Symptoms"

**Watch the AI magic! ✨**

You'll see:
- Severity level
- Possible conditions
- Recommendations
- Precautions
- AI-generated prescription

### 4.3 Register a Doctor Account (Optional)
1. Logout (top right)
2. Register again:
   - Name: Dr. Smith
   - Email: doctor@test.com
   - Password: password123
   - Role: Doctor

---

## 🎉 SUCCESS!

**Your project is now running!**

### What's Working:
✅ User Registration & Login
✅ Patient Dashboard
✅ AI Symptom Analysis (Rule-Based AI)
✅ Backend API
✅ MongoDB Database
✅ JWT Authentication

### What Needs More Work:
⏳ Book Appointment Page (placeholder ready)
⏳ My Appointments Page (placeholder ready)
⏳ Health Reminders Page (placeholder ready)
⏳ Doctor Dashboard (placeholder ready)

---

## 🐛 Troubleshooting

### "MongoDB Connection Error"
```bash
# Start MongoDB manually:
# Windows:
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### "Port 5000 already in use"
```bash
# Kill the process:
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### "Module not found"
```bash
# Reinstall dependencies:
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📧 Email Configuration (Optional)

**For Gmail notifications:**

1. Go to: https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to: App Passwords
4. Generate password for "Mail"
5. Copy the 16-character password
6. Update `EMAIL_PASSWORD` in backend `.env`

---

## 🎯 Demo Accounts

After you register, you can use:

**Patient:**
- Email: patient@test.com
- Password: password123

**Doctor:**
- Email: doctor@test.com
- Password: password123

---

## 📚 Key Features to Demonstrate

### 1. AI Symptom Analyzer (★★★★★)
- Select multiple symptoms
- Enter vitals
- Get instant recommendations
- See possible conditions
- Get AI prescription

### 2. Dashboard
- View stats
- Quick actions
- Recent appointments

### 3. Authentication
- Secure login/register
- JWT tokens
- Role-based access

---

## 🚀 Next Steps

To complete the project, implement:
1. Book Appointment page (API ready!)
2. My Appointments list
3. Health Reminders settings
4. Doctor consultation view

**All backend APIs are ready and working!**

---

## 💡 Tips for Presentation

1. **Start with AI Analysis** - It's your star feature!
2. **Show the code** - Especially `backend/services/aiEngine.js`
3. **Explain Rule-Based AI** - How symptom rules work
4. **Demo live** - Register and use AI analysis
5. **Show notifications** - Check MongoDB for stored notifications

---

## 📞 Help

If stuck:
1. Check both terminal windows for errors
2. Verify MongoDB is running: `mongosh` or `mongo`
3. Check `.env` files are correct
4. Ensure ports 3000 and 5000 are free
5. Try restarting everything

---

**Good luck with your capstone project! 🎓**

**Made with ❤️ by Group P26**
