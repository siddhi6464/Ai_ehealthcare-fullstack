import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AIAnalysis from './pages/AIAnalysis';
import HealthReminders from './pages/HealthReminders';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';

// Components
import Navbar from './components/Navbar';

// Styles
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

console.log('--- APP COMPONENT CHECK ---');
console.log('Navbar:', Navbar);
console.log('Dashboard:', Dashboard);
console.log('DoctorDashboard:', DoctorDashboard);
console.log('DoctorProfile:', DoctorProfile);
console.log('BookAppointment:', BookAppointment);
console.log('MyAppointments:', MyAppointments);
console.log('AIAnalysis:', AIAnalysis);
console.log('HealthReminders:', HealthReminders);
console.log('Login:', Login);
console.log('Register:', Register);
console.log('Routes:', Routes);
console.log('Route:', Route);
console.log('ProtectedRoute:', ProtectedRoute);
console.log('---------------------------');

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="App">
      {user && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes - Patient */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              {user?.role === 'doctor' ? <DoctorDashboard /> : <Dashboard />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-profile" 
          element={
            <ProtectedRoute role="doctor">
               <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/book-appointment" 
          element={
            <ProtectedRoute role="patient">
              <BookAppointment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-appointments" 
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai-analysis" 
          element={
            <ProtectedRoute>
              <AIAnalysis />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/health-reminders" 
          element={
            <ProtectedRoute role="patient">
              <HealthReminders />
            </ProtectedRoute>
          } 
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<div className="not-found">Page Not Found</div>} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
