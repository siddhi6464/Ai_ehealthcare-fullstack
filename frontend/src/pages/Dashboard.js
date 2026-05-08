import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI, notificationAPI } from '../services/api';
import { FaCalendarAlt, FaBrain, FaBell, FaHospital } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    notifications: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get appointments
      const appointmentsRes = await appointmentAPI.getMyAppointments();
      const appointments = appointmentsRes.data.data.appointments;
      
      const upcoming = appointments.filter(
        apt => apt.status === 'scheduled' && new Date(apt.appointmentDate) >= new Date()
      );
      
      setStats({
        totalAppointments: appointments.length,
        upcomingAppointments: upcoming.length,
        notifications: 0
      });
      
      setRecentAppointments(appointments.slice(0, 3));

      // Get notifications
      const notifRes = await notificationAPI.getAll({ status: 'pending' });
      setNotifications(notifRes.data.data.notifications.slice(0, 5));
      setStats(prev => ({ ...prev, notifications: notifRes.data.results }));
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 30 
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const hoverEffect = {
    y: -5,
    boxShadow: "0px 24px 50px rgba(67, 24, 255, 0.15)",
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  };

  if (loading) {
    return (
      <div className="page modern-dashboard">
        <div className="loading" style={{ color: '#4318ff', fontWeight: 'bold' }}>
          Loading your space...
        </div>
      </div>
    );
  }

  return (
    <div className="page modern-dashboard">
      {/* Animated Background Mesh */}
      <div className="dashboard-bg-mesh">
        <motion.div 
          className="mesh-orb orb-1"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
        <motion.div 
          className="mesh-orb orb-2"
          animate={{ x: [0, -50, 0], y: [0, -60, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.div 
          className="mesh-orb orb-3"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
      </div>

      <div className="container dashboard-container">
        <motion.div 
          className="dashboard-header"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <h1 className="greeting">
              Hello, <span className="highlight-text">{user?.name}</span>! <span className="wave-emoji">👋</span>
            </h1>
            <p className="subtitle">Welcome to your personalized health command center.</p>
          </div>
          <motion.div 
            className="header-date-badge glass-badge"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCalendarAlt className="badge-icon" />
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="dashboard-stats-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} whileHover={hoverEffect} className="modern-stat-card glass-card">
            <div className="stat-icon-wrapper bg-gradient-blue">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h3>{stats.totalAppointments}</h3>
              <p>Total Visits</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={hoverEffect} className="modern-stat-card glass-card">
            <div className="stat-icon-wrapper bg-gradient-green">
              <FaHospital />
            </div>
            <div className="stat-content">
              <h3>{stats.upcomingAppointments}</h3>
              <p>Upcoming</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={hoverEffect} className="modern-stat-card glass-card">
            <div className="stat-icon-wrapper bg-gradient-orange">
              <FaBell />
            </div>
            <div className="stat-content">
              <h3>{stats.notifications}</h3>
              <p>Alerts</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="dashboard-main-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column */}
          <div className="main-col">
            {/* Quick Actions */}
            <motion.div 
              variants={itemVariants} 
              className="modern-card glass-card quick-actions-card"
            >
              <div className="modern-card-header">
                <h2>Quick Actions</h2>
              </div>
              <div className="modern-card-body">
                <div className="modern-quick-actions">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/book-appointment" className="modern-action-btn glass-action">
                      <div className="action-icon-bg"><FaCalendarAlt /></div>
                      <div className="action-text">
                        <span className="action-title">Book Visit</span>
                        <span className="action-desc">Schedule new appointment</span>
                      </div>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/ai-analysis" className="modern-action-btn glass-action">
                      <div className="action-icon-bg"><FaBrain /></div>
                      <div className="action-text">
                        <span className="action-title">AI Check</span>
                        <span className="action-desc">Analyze your symptoms</span>
                      </div>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/health-reminders" className="modern-action-btn glass-action">
                      <div className="action-icon-bg"><FaBell /></div>
                      <div className="action-text">
                        <span className="action-title">Reminders</span>
                        <span className="action-desc">View health alerts</span>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Recent Appointments */}
            <motion.div 
              variants={itemVariants} 
              className="modern-card glass-card"
            >
              <div className="modern-card-header">
                <h2>Recent Appointments</h2>
                <Link to="/my-appointments" className="modern-link-btn">View All</Link>
              </div>
              <div className="modern-card-body">
                {recentAppointments.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon"><FaHospital /></div>
                    <p>No appointments yet. Time to book your first visit!</p>
                  </div>
                ) : (
                  <div className="modern-list">
                    {recentAppointments.map(apt => (
                      <div key={apt._id} className="modern-list-item appointment-item">
                        <div className="item-avatar">
                          <FaHospital />
                        </div>
                        <div className="item-info">
                          <h4>Dr. {apt.doctor.name}</h4>
                          <p>{new Date(apt.appointmentDate).toLocaleDateString()} &bull; {apt.timeSlot.startTime} - {apt.timeSlot.endTime}</p>
                        </div>
                        <div className="item-status">
                          <span className={`modern-badge badge-${apt.status === 'scheduled' ? 'success' : 'warning'}`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="side-col">
            {/* Recent Notifications */}
            {notifications.length > 0 ? (
              <motion.div variants={itemVariants} className="modern-card glass-card">
                <div className="modern-card-header">
                  <h2>Notifications</h2>
                </div>
                <div className="modern-card-body">
                  <div className="modern-list notifications-list">
                    {notifications.map(notif => (
                      <motion.div 
                        key={notif._id} 
                        className="modern-list-item notification-item"
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', padding: '12px' }}
                        transition={{ duration: 0.2 }}
                        style={{ padding: '12px 0' }}
                      >
                        <div className="item-avatar" style={{ background: '#fff4e6', color: '#ffce20' }}>
                          <FaBell />
                        </div>
                        <div className="item-info">
                          <h4>{notif.title}</h4>
                          <p className="text-truncate">{notif.message}</p>
                          <span className="item-time">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="modern-card glass-card">
                <div className="modern-card-header">
                  <h2>Notifications</h2>
                </div>
                <div className="modern-card-body">
                  <div className="empty-state">
                    <div className="empty-icon"><FaBell /></div>
                    <p>You're all caught up!</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
