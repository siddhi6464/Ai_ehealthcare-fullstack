import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api, { appointmentAPI } from '../services/api';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, upcoming, completed
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Consultation form state
  const [consultationData, setConsultationData] = useState({
    diagnosis: '',
    prescription: '',
    doctorNotes: '',
    followUpDate: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getDoctorAppointments();
      setAppointments(response.data.data.appointments);
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentAPI.updateStatus(appointmentId, newStatus);
      toast.success(`Appointment marked as ${newStatus}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleConsultationChange = (e) => {
    setConsultationData({
      ...consultationData,
      [e.target.name]: e.target.value
    });
  };

  const handleAIInject = (medication) => {
    setConsultationData((prev) => ({
      ...prev,
      prescription: prev.prescription ? `${prev.prescription}\n${medication}`.trim() : medication
    }));
    toast.info(`Injected: ${medication}`);
  };

  const submitConsultation = async (e) => {
    e.preventDefault();
    if (!consultationData.diagnosis || !consultationData.prescription) {
      toast.error('Diagnosis and prescription are required');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...consultationData,
        prescription: [{ medicine: consultationData.prescription }]
      };

      await appointmentAPI.addConsultation(selectedAppointment._id, payload);
      toast.success('Consultation details added successfully!');
      setSelectedAppointment(null);
      
      // Reset form
      setConsultationData({
        diagnosis: '',
        prescription: '',
        doctorNotes: '',
        followUpDate: ''
      });
      
      fetchAppointments();
    } catch (error) {
      console.error('Error adding consultation:', error);
      toast.error('Failed to save consultation details');
    } finally {
      setSubmitting(false);
    }
  };

  const openConsultationModal = (appointment) => {
    setSelectedAppointment(appointment);
    if (appointment.diagnosis) {
      // Unpack prescription array to string for textarea
      let existingPrescription = '';
      if (Array.isArray(appointment.prescription) && appointment.prescription.length > 0) {
        existingPrescription = appointment.prescription.map(p => p.medicine).join('\n');
      } else if (typeof appointment.prescription === 'string') {
        existingPrescription = appointment.prescription;
      }

      setConsultationData({
        diagnosis: appointment.diagnosis || '',
        prescription: existingPrescription,
        doctorNotes: appointment.doctorNotes || '',
        followUpDate: appointment.followUpDate 
          ? new Date(appointment.followUpDate).toISOString().split('T')[0] 
          : ''
      });
    } else {
      setConsultationData({
        diagnosis: '',
        prescription: '',
        doctorNotes: '',
        followUpDate: ''
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: 'status-scheduled',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'today') return isToday(apt.appointmentDate);
    if (filter === 'upcoming') return apt.status === 'scheduled' && !isToday(apt.appointmentDate);
    if (filter === 'completed') return apt.status === 'completed';
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="page loading-state"><div className="loading-spinner">Loading dashboard...</div></div>;
  }

  return (
    <div className="page doctor-dashboard">
      <div className="container no-print">
        {/* Header Options */}
        <div className="dashboard-header">
          <div className="header-text">
            <h1>👨‍⚕️ Doctor Workspace</h1>
            <p>Manage consultations, prescribe medication, and review AI insights.</p>
          </div>
          
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Today</h3>
              <p>{appointments.filter(a => isToday(a.appointmentDate)).length} Appointments</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p>{appointments.filter(a => a.status === 'scheduled').length} Total</p>
            </div>
            <div className="stat-card">
              <h3>Assisted</h3>
              <p>{appointments.filter(a => a.aiRecommendations).length} by AI</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'today' ? 'active' : ''} onClick={() => setFilter('today')}>Today's ({appointments.filter(a => isToday(a.appointmentDate)).length})</button>
          <button className={filter === 'upcoming' ? 'active' : ''} onClick={() => setFilter('upcoming')}>Upcoming</button>
          <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
        </div>

        {/* Content list */}
        <div className="appointments-list">
          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <h3>No appointments found</h3>
              <p>You have no {filter !== 'all' ? filter : ''} appointments currently listed.</p>
            </div>
          ) : (
            filteredAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <div className="card-top">
                  <div className="patient-info">
                    <h3>{appointment.patient?.name || 'Unknown Patient'}</h3>
                    <p className="contact-info">
                      📱 {appointment.patient?.phone || 'N/A'} &nbsp;|&nbsp; 
                      ✉️ {appointment.patient?.email || 'N/A'}
                    </p>
                    <p className="appointment-time">
                      📅 {formatDate(appointment.appointmentDate)} &nbsp;|&nbsp; 
                      ⏰ {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                    </p>
                  </div>
                  <div className="status-container">
                    {getStatusBadge(appointment.status)}
                    {appointment.aiRecommendations && (
                      <span className="ai-badge">🤖 AI Analysis</span>
                    )}
                  </div>
                </div>

                <div className="card-middle">
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div className="symptoms-list">
                      {appointment.symptoms.map(s => (
                        <span key={s} className="symptom-tag">{s.replace('_', ' ')}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button className="btn-view" onClick={() => openConsultationModal(appointment)}>
                    {appointment.status === 'completed' ? 'View Record' : 'Start Consultation'}
                  </button>
                  
                  {appointment.status === 'scheduled' && (
                    <button className="btn-complete" onClick={() => handleStatusChange(appointment._id, 'completed')}>
                      Mark Completed
                    </button>
                  )}
                  
                  {appointment.status === 'scheduled' && (
                    <button className="btn-cancel" onClick={() => handleStatusChange(appointment._id, 'cancelled')}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Consultation Modal */}
      {selectedAppointment && (
        <div className="modal-overlay no-print" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content doctor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAppointment.status === 'completed' ? 'Medical Record' : 'Active Consultation'}</h2>
              <button className="close-btn" onClick={() => setSelectedAppointment(null)}>✖</button>
            </div>

              <div className="modal-body-split">
                {/* Left Side: Patient & AI Info */}
                <div className="modal-info-panel">
                  <div className="info-block">
                    <h3>Patient Details</h3>
                    <p><strong>Name:</strong> {selectedAppointment.patient?.name}</p>
                    <p><strong>Gender:</strong> {selectedAppointment.patient?.gender}</p>
                  </div>

                  <div className="info-block">
                    <h3>Presented Symptoms</h3>
                    <p>{selectedAppointment.reason}</p>
                    {selectedAppointment.symptoms?.length > 0 && (
                      <div className="symptoms-list sm">
                        {selectedAppointment.symptoms.map(s => <span key={s} className="symptom-tag">{s}</span>)}
                      </div>
                    )}
                  </div>

                  {selectedAppointment.aiRecommendations && (
                  <div className="ai-insight-block">
                    <h3>🤖 AI Pre-Assessment</h3>
                    <p className={`ai-severity ${selectedAppointment.aiRecommendations.severity || 'low'}`}>
                      Suggested Severity: {selectedAppointment.aiRecommendations.severity || 'Review Required'}
                    </p>
                    {selectedAppointment.aiRecommendations.suggestions && (
                      <div className="ai-pill-container">
                        <p className="ai-pill-hint">Click a drug to auto-fill prescription:</p>
                        {selectedAppointment.aiRecommendations.suggestions.map((rec, i) => (
                           <button 
                             key={i} 
                             className="btn-ai-pill" 
                             onClick={() => handleAIInject(rec)}
                             title="Inject into prescription"
                           >
                             + {rec}
                           </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

                {/* Right Side: Form */}
                <div className="modal-form-panel">
                  <h3>Clinical Notes</h3>
                  <form onSubmit={submitConsultation}>
                    <div className="form-group">
                      <label>Diagnosis *</label>
                      <input 
                        type="text" 
                        name="diagnosis" 
                        value={consultationData.diagnosis} 
                        onChange={handleConsultationChange} 
                        readOnly={selectedAppointment.status === 'completed'}
                        required 
                        className="form-control"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Prescribed Medication *</label>
                      <textarea 
                        name="prescription" 
                        rows="3" 
                        value={consultationData.prescription} 
                        onChange={handleConsultationChange}
                        readOnly={selectedAppointment.status === 'completed'} 
                        required 
                        className="form-control"
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Doctor's Notes (Diet, Rest, etc.)</label>
                      <textarea 
                        name="doctorNotes" 
                        rows="2" 
                        value={consultationData.doctorNotes} 
                        onChange={handleConsultationChange}
                        readOnly={selectedAppointment.status === 'completed'} 
                        className="form-control"
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Follow-up Date</label>
                      <input 
                        type="date" 
                        name="followUpDate" 
                        value={consultationData.followUpDate} 
                        onChange={handleConsultationChange}
                        readOnly={selectedAppointment.status === 'completed'} 
                        className="form-control" 
                      />
                    </div>

                    {selectedAppointment.status !== 'completed' ? (
                    <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
                      {submitting ? 'Saving Record...' : 'Complete & Save Record'}
                    </button>
                  ) : (
                    <button type="button" className="btn btn-secondary btn-submit" onClick={handlePrint}>
                      🖨️ Print Prescription Slip
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Printable Prescription Container */}
      {selectedAppointment && selectedAppointment.status === 'completed' && (
        <div className="print-only-section print-container">
          <div className="print-header">
            <h1>eHealthCare Clinic</h1>
            <p>123 Medical Plaza, San Francisco, CA 94103</p>
            <p>Phone: (555) 123-4567 | Appt: {new Date(selectedAppointment.appointmentDate).toDateString()}</p>
          </div>
          <hr />
          <div className="print-patient-info">
            <h3>Patient: {selectedAppointment.patient?.name}</h3>
            <p><strong>Diagnosis:</strong> {consultationData.diagnosis}</p>
            <p><strong>Symptoms:</strong> {selectedAppointment.reason}</p>
          </div>
          
          <div className="print-rx">
            <h2>℞ Prescription</h2>
            <div className="rx-body">
               {consultationData.prescription.split('\n').map((line, idx) => (
                 <p key={idx}>{line}</p>
               ))}
            </div>
          </div>

          <div className="print-footer">
            <p><strong>Doctor Notes:</strong> {consultationData.doctorNotes || 'None'}</p>
            {consultationData.followUpDate && (
               <p><strong>Follow Up On:</strong> {consultationData.followUpDate}</p>
            )}
            <br/><br/>
            <div className="signature-line">
              <span>Doctor Signature</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
