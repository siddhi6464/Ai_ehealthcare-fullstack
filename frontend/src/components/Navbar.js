import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHospital, FaCalendarAlt, FaBrain, FaBell, FaSignOutAlt, FaUserMd } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Extract initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <nav className="modern-navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-icon">
            <FaHospital />
          </div>
          eHealthCare
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          
          {user?.role === 'patient' && (
            <>
              <Link to="/book-appointment" className="nav-link">
                <FaCalendarAlt /> Book Visit
              </Link>
              <Link to="/ai-analysis" className="nav-link">
                <FaBrain /> AI Check
              </Link>
              <Link to="/health-reminders" className="nav-link">
                <FaBell /> Reminders
              </Link>
            </>
          )}

          {user?.role === 'doctor' && (
             <Link to="/doctor-profile" className="nav-link">
                <FaUserMd /> My Profile
             </Link>
          )}
          <Link to="/my-appointments" className="nav-link">
            My Appointments
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-profile">
            <div className="user-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role">{user?.role || 'Guest'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <FaSignOutAlt />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
