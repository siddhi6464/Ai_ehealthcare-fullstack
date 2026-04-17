import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI, notificationAPI } from '../services/api';
import { FaCalendarAlt, FaBrain, FaBell, FaHospital } from 'react-icons/fa';
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

  if (loading) {
    return <div className="page"><div className="loading">Loading dashboard...</div></div>;
  }

  return (
    <div className="page dashboard">
      <div className="container">
        <div className="page-header">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>Your Health Dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-3">
          <div className="stats-card">
            <div className="icon" style={{ color: '#3498db' }}>
              <FaCalendarAlt />
            </div>
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
          </div>

          <div className="stats-card">
            <div className="icon" style={{ color: '#2ecc71' }}>
              <FaHospital />
            </div>
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>

          <div className="stats-card">
            <div className="icon" style={{ color: '#f39c12' }}>
              <FaBell />
            </div>
            <h3>{stats.notifications}</h3>
            <p>Pending Notifications</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mt-3">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <Link to="/book-appointment" className="action-btn">
                <FaCalendarAlt />
                <span>Book Appointment</span>
              </Link>
              <Link to="/ai-analysis" className="action-btn">
                <FaBrain />
                <span>AI Health Check</span>
              </Link>
              <Link to="/health-reminders" className="action-btn">
                <FaBell />
                <span>Health Reminders</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="card mt-3">
          <div className="card-header">
            <h2>Recent Appointments</h2>
            <Link to="/my-appointments" className="btn btn-secondary">View All</Link>
          </div>
          <div className="card-body">
            {recentAppointments.length === 0 ? (
              <p className="text-center">No appointments yet. Book your first appointment!</p>
            ) : (
              <div className="appointments-list">
                {recentAppointments.map(apt => (
                  <div key={apt._id} className="appointment-item">
                    <div className="apt-info">
                      <h4>Dr. {apt.doctor.name}</h4>
                      <p>{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                      <p>{apt.timeSlot.startTime} - {apt.timeSlot.endTime}</p>
                    </div>
                    <div className="apt-status">
                      <span className={`badge badge-${apt.status === 'scheduled' ? 'success' : 'warning'}`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications.length > 0 && (
          <div className="card mt-3">
            <div className="card-header">
              <h2>Recent Notifications</h2>
            </div>
            <div className="card-body">
              <div className="notifications-list">
                {notifications.map(notif => (
                  <div key={notif._id} className="notification-item">
                    <div className="notif-icon">
                      <FaBell />
                    </div>
                    <div className="notif-content">
                      <h4>{notif.title}</h4>
                      <p>{notif.message}</p>
                      <span className="notif-time">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
