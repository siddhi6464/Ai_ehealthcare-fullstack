import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { 
  FaClipboardList, 
  FaCalendarCheck, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSyncAlt, 
  FaFolderOpen, 
  FaNotesMedical, 
  FaRobot, 
  FaUserMd, 
  FaTimes, 
  FaCalendarAlt, 
  FaRegClock, 
  FaInfoCircle, 
  FaSearchPlus,
  FaPlus,
  FaDownload,
  FaFilePrescription
} from 'react-icons/fa';
import jsPDF from 'jspdf';
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
      scheduled: 'ma-status-scheduled',
      completed: 'ma-status-completed',
      cancelled: 'ma-status-cancelled',
      rescheduled: 'ma-status-rescheduled'
    };

    const statusIcons = {
      scheduled: <FaCalendarCheck />,
      completed: <FaCheckCircle />,
      cancelled: <FaTimesCircle />,
      rescheduled: <FaSyncAlt />
    };

    return (
      <span className={`ma-status-badge ${statusClasses[status]}`}>
        {statusIcons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDownloadPrescription = (appointment) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(44, 62, 80);
      doc.text('eHealthCare - Medical Prescription', 20, 20);
      
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${formatDate(appointment.appointmentDate)}`, 20, 40);
      doc.text(`Doctor: Dr. ${appointment.doctor?.name || 'Unknown'}`, 20, 50);
      doc.text(`Patient: ${appointment.patient?.name || 'Patient'}`, 120, 40);
      
      let yOffset = 70;
      
      if (appointment.diagnosis) {
        doc.setFontSize(14);
        doc.setTextColor(41, 128, 185);
        doc.text('Diagnosis:', 20, yOffset);
        yOffset += 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const splitDiagnosis = doc.splitTextToSize(appointment.diagnosis, 170);
        doc.text(splitDiagnosis, 20, yOffset);
        yOffset += (splitDiagnosis.length * 7) + 10;
      }
      
      if (appointment.prescription) {
        doc.setFontSize(14);
        doc.setTextColor(41, 128, 185);
        doc.text('Prescription Details:', 20, yOffset);
        yOffset += 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const splitPrescription = doc.splitTextToSize(appointment.prescription, 170);
        doc.text(splitPrescription, 20, yOffset);
        yOffset += (splitPrescription.length * 7) + 10;
      }

      if (appointment.doctorNotes) {
        doc.setFontSize(14);
        doc.setTextColor(41, 128, 185);
        doc.text('Doctor\'s Notes:', 20, yOffset);
        yOffset += 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const splitNotes = doc.splitTextToSize(appointment.doctorNotes, 170);
        doc.text(splitNotes, 20, yOffset);
        yOffset += (splitNotes.length * 7) + 10;
      }

      if (appointment.followUpDate) {
        doc.setFontSize(12);
        doc.setTextColor(231, 76, 60);
        doc.text(`Next Follow-up: ${formatDate(appointment.followUpDate)}`, 20, yOffset + 10);
      }

      doc.save(`Prescription_Dr_${appointment.doctor?.name || 'Doctor'}_${new Date().getTime()}.pdf`);
      toast.success('Prescription downloaded successfully!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="page modern-appointments">
        <div className="container">
          <div className="ma-loading-spinner">
            <FaSyncAlt className="fa-spin" style={{ marginRight: '10px' }} />
            Loading your appointments...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page modern-appointments">
      <div className="container">
        <div className="ma-header animate-fade-in">
          <div className="ma-header-left">
            <div className="ma-header-icon">
              <FaClipboardList />
            </div>
            <div className="ma-header-text">
              <h1>My Appointments</h1>
              <p>View and manage your upcoming and past consultations</p>
            </div>
          </div>
          <button 
            className="modern-btn-primary"
            onClick={() => navigate('/book-appointment')}
          >
            <FaPlus /> Book New Appointment
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="ma-filter-tabs animate-fade-in">
          <button 
            className={`ma-filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({appointments.length})
          </button>
          <button 
            className={`ma-filter-tab ${filter === 'scheduled' ? 'active' : ''}`}
            onClick={() => setFilter('scheduled')}
          >
            Scheduled ({appointments.filter(a => a.status === 'scheduled').length})
          </button>
          <button 
            className={`ma-filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({appointments.filter(a => a.status === 'completed').length})
          </button>
          <button 
            className={`ma-filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="ma-empty-state animate-slide-up">
            <div className="ma-empty-icon"><FaFolderOpen /></div>
            <h3>No appointments found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't booked any appointments yet. Start your healthcare journey today." 
                : `You don't have any ${filter} appointments at the moment.`}
            </p>
            <button 
              className="modern-btn-primary"
              style={{ margin: '0 auto' }}
              onClick={() => navigate('/book-appointment')}
            >
              <FaPlus /> Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="ma-appointments-grid animate-slide-up">
            {filteredAppointments.map(appointment => (
              <div key={appointment._id} className="ma-appointment-card">
                <div className="ma-appointment-header">
                  <div>
                    <h3>Dr. {appointment.doctor?.name || 'Unknown Doctor'}</h3>
                    <p className="ma-specialization">
                      <FaUserMd style={{ marginRight: '5px' }} />
                      {appointment.doctor?.specialization || 'General Physician'}
                    </p>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="ma-appointment-details">
                  <div className="ma-detail-row">
                    <span className="ma-detail-label"><FaCalendarAlt /> Date:</span>
                    <span className="ma-detail-value">{formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="ma-detail-row">
                    <span className="ma-detail-label"><FaRegClock /> Time:</span>
                    <span className="ma-detail-value">{appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}</span>
                  </div>
                  <div className="ma-detail-row">
                    <span className="ma-detail-label"><FaInfoCircle /> Reason:</span>
                    <span className="ma-detail-value">{appointment.reason}</span>
                  </div>
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div className="ma-detail-row">
                      <span className="ma-detail-label"><FaNotesMedical /> Symptoms:</span>
                      <div className="ma-symptoms-tags">
                        {appointment.symptoms.map((symptom, idx) => (
                          <span key={idx} className="ma-symptom-tag">
                            {symptom.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Recommendations */}
                  {appointment.aiRecommendations && (
                    <div className="ma-ai-recommendations">
                      <h4><FaRobot /> AI Preliminary Analysis</h4>
                      <p className="ma-severity">
                        Severity: <strong>{appointment.aiRecommendations.severity}</strong>
                      </p>
                      {appointment.aiRecommendations.recommendations && (
                        <ul className="ma-recommendations-list">
                          {appointment.aiRecommendations.recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Consultation Notes (if completed) */}
                  {appointment.status === 'completed' && appointment.consultationNotes && (
                    <div className="ma-consultation-notes">
                      <h4><FaUserMd /> Doctor's Notes</h4>
                      <p>{appointment.consultationNotes}</p>
                    </div>
                  )}
                </div>

                <div className="ma-appointment-actions">
                  <button
                    className="ma-btn-view"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <FaSearchPlus /> View Details
                  </button>
                  {appointment.status === 'completed' && appointment.prescription && (
                    <button
                      className="ma-btn-view"
                      style={{ backgroundColor: '#27ae60', color: 'white', border: 'none' }}
                      onClick={() => handleDownloadPrescription(appointment)}
                    >
                      <FaDownload /> Download Prescription
                    </button>
                  )}
                  {appointment.status === 'scheduled' && (
                    <button
                      className="ma-btn-cancel"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      <FaTimesCircle /> Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedAppointment && (
          <div className="ma-modal-overlay" onClick={() => setSelectedAppointment(null)}>
            <div className="ma-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="ma-modal-header">
                <h2>Appointment Details</h2>
                <button 
                  className="ma-modal-close"
                  onClick={() => setSelectedAppointment(null)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="ma-modal-body">
                <div className="ma-detail-section">
                  <h3><FaUserMd /> Doctor Information</h3>
                  <p><strong>Name:</strong> Dr. {selectedAppointment.doctor?.name}</p>
                  <p><strong>Specialization:</strong> {selectedAppointment.doctor?.specialization}</p>
                  <p><strong>Experience:</strong> {selectedAppointment.doctor?.experience} years</p>
                </div>

                <div className="ma-detail-section">
                  <h3><FaClipboardList /> Booking Information</h3>
                  <p><strong>Date:</strong> {formatDate(selectedAppointment.appointmentDate)}</p>
                  <p><strong>Time:</strong> {selectedAppointment.timeSlot?.startTime} - {selectedAppointment.timeSlot?.endTime}</p>
                  <p><strong>Status:</strong> {selectedAppointment.status}</p>
                  <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                </div>

                {selectedAppointment.aiRecommendations && (
                  <div className="ma-detail-section">
                    <h3><FaRobot /> AI Analysis</h3>
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

                {selectedAppointment.status === 'completed' && selectedAppointment.prescription && (
                  <div className="ma-detail-section">
                    <h3><FaFilePrescription /> Medical Prescription</h3>
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                      {selectedAppointment.diagnosis && <p><strong>Diagnosis:</strong> <br/>{selectedAppointment.diagnosis}</p>}
                      <p><strong>Prescription:</strong> <br/>{selectedAppointment.prescription}</p>
                      {selectedAppointment.doctorNotes && <p><strong>Doctor's Notes:</strong> <br/>{selectedAppointment.doctorNotes}</p>}
                      {selectedAppointment.followUpDate && <p><strong>Follow-up Date:</strong> <br/>{formatDate(selectedAppointment.followUpDate)}</p>}
                    </div>
                    <button 
                      className="modern-btn-primary" 
                      style={{ marginTop: '15px', width: '100%' }}
                      onClick={() => handleDownloadPrescription(selectedAppointment)}
                    >
                      <FaDownload /> Download as PDF
                    </button>
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
