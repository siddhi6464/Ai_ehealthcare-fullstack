import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './MyAppointments.css';

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments/my-appointments');
      setAppointments(response.data.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await api.patch(`/appointments/${appointmentId}/status`, {
        status: 'cancelled'
      });
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: 'status-scheduled',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      rescheduled: 'status-rescheduled'
    };

    const statusIcons = {
      scheduled: '📅',
      completed: '✓',
      cancelled: '✗',
      rescheduled: '🔄'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {statusIcons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-spinner">Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page my-appointments-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>📋 My Appointments</h1>
            <p>View and manage your appointments</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/book-appointment')}
          >
            + Book New Appointment
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({appointments.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'scheduled' ? 'active' : ''}`}
            onClick={() => setFilter('scheduled')}
          >
            Scheduled ({appointments.filter(a => a.status === 'scheduled').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({appointments.filter(a => a.status === 'completed').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No appointments found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't booked any appointments yet" 
                : `No ${filter} appointments`}
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/book-appointment')}
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="appointments-grid">
            {filteredAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-header">
                  <div>
                    <h3>Dr. {appointment.doctor?.name || 'Unknown Doctor'}</h3>
                    <p className="specialization">
                      {appointment.doctor?.specialization || 'General Physician'}
                    </p>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Date:</span>
                    <span className="detail-value">{formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🕐 Time:</span>
                    <span className="detail-value">{appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📝 Reason:</span>
                    <span className="detail-value">{appointment.reason}</span>
                  </div>
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">🩺 Symptoms:</span>
                      <div className="symptoms-tags">
                        {appointment.symptoms.map((symptom, idx) => (
                          <span key={idx} className="symptom-tag">
                            {symptom.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Recommendations */}
                  {appointment.aiRecommendations && (
                    <div className="ai-recommendations">
                      <h4>🤖 AI Recommendations:</h4>
                      <p className="severity">
                        Severity: <strong>{appointment.aiRecommendations.severity}</strong>
                      </p>
                      {appointment.aiRecommendations.recommendations && (
                        <ul className="recommendations-list">
                          {appointment.aiRecommendations.recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Consultation Notes (if completed) */}
                  {appointment.status === 'completed' && appointment.consultationNotes && (
                    <div className="consultation-notes">
                      <h4>👨‍⚕️ Doctor's Notes:</h4>
                      <p>{appointment.consultationNotes}</p>
                    </div>
                  )}
                </div>

                <div className="appointment-actions">
                  <button
                    className="btn-view"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    View Details
                  </button>
                  {appointment.status === 'scheduled' && (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedAppointment && (
          <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Appointment Details</h2>
                <button 
                  className="modal-close"
                  onClick={() => setSelectedAppointment(null)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <h3>Doctor Information</h3>
                  <p><strong>Name:</strong> Dr. {selectedAppointment.doctor?.name}</p>
                  <p><strong>Specialization:</strong> {selectedAppointment.doctor?.specialization}</p>
                  <p><strong>Experience:</strong> {selectedAppointment.doctor?.experience} years</p>
                </div>

                <div className="detail-section">
                  <h3>Appointment Details</h3>
                  <p><strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
                  <p><strong>Time:</strong> {selectedAppointment.timeSlot?.startTime} - {selectedAppointment.timeSlot?.endTime}</p>
                  <p><strong>Status:</strong> {selectedAppointment.status}</p>
                  <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                </div>

                {selectedAppointment.aiRecommendations && (
                  <div className="detail-section">
                    <h3>AI Analysis</h3>
                    <p><strong>Severity:</strong> {selectedAppointment.aiRecommendations.severity}</p>
                    {selectedAppointment.aiRecommendations.possibleConditions && (
                      <>
                        <p><strong>Possible Conditions:</strong></p>
                        <ul>
                          {selectedAppointment.aiRecommendations.possibleConditions.map((cond, idx) => (
                            <li key={idx}>{cond}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
