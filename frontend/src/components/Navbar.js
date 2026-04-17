import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHospital, FaCalendarAlt, FaBrain, FaBell, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <FaHospital /> eHealthCare
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          
          {user?.role === 'patient' && (
            <>
              <Link to="/book-appointment" className="nav-link">
                <FaCalendarAlt /> Book Appointment
              </Link>
              <Link to="/ai-analysis" className="nav-link">
                <FaBrain /> AI Analysis
              </Link>
              <Link to="/health-reminders" className="nav-link">
                <FaBell /> Health Reminders
              </Link>
            </>
          )}

          {user?.role === 'doctor' && (
             <Link to="/doctor-profile" className="nav-link">
                👨‍⚕️ My Profile
             </Link>
          )}
          <Link to="/my-appointments" className="nav-link">
            My Appointments
          </Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">
            👋 {user?.name}
            <span className="user-role">({user?.role})</span>
          </span>
          <button onClick={handleLogout} className="btn-logout">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
