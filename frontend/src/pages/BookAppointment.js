import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FaCalendarPlus, FaUserMd, FaRegClock, FaNotesMedical, FaCheckCircle, FaTimes } from 'react-icons/fa';
import './BookAppointment.css';

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    appointmentDate: '',
    timeSlot: '',
    reason: '',
    symptoms: []
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const availableSymptoms = [
    'Fever', 'Cough', 'Headache', 'Chest Pain', 'Stomach Pain',
    'Dizziness', 'Body Ache', 'Breathing Difficulty', 'Nausea', 'Fatigue'
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (location.state) {
      setFormData(prev => ({
        ...prev,
        doctor: location.state.doctorId || prev.doctor,
        reason: location.state.reason || prev.reason
      }));
      if (location.state.symptoms) {
        setSelectedSymptoms(location.state.symptoms);
      }
    }
  }, [location.state]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/appointments/doctors');
      setDoctors(response.data.data.doctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const handleSymptomToggle = (symptom) => {
    const symptomLower = symptom.toLowerCase().replace(' ', '_');
    if (selectedSymptoms.includes(symptomLower)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomLower));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomLower]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.doctor || !formData.appointmentDate || !formData.timeSlot || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Calculate end time (1 hour later)
      const calculateEndTime = (startTime) => {
        const [time, period] = startTime.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        let endHours = hours + 1;
        let endPeriod = period;
        
        if (endHours === 12) {
          endPeriod = period === 'AM' ? 'PM' : 'AM';
        } else if (endHours > 12) {
          endHours = 1;
        }
        
        return `${endHours.toString().padStart(2, '0')}:${minutes} ${endPeriod}`;
      };

      const appointmentData = {
        doctor: formData.doctor,
        appointmentDate: formData.appointmentDate,
        timeSlot: {
          startTime: formData.timeSlot,
          endTime: calculateEndTime(formData.timeSlot)
        },
        reason: formData.reason,
        symptoms: selectedSymptoms
      };

      await api.post('/appointments', appointmentData);
      toast.success('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="page modern-book-appointment">
      <div className="container">
        <div className="ba-header animate-fade-in">
          <div className="ba-header-icon">
            <FaCalendarPlus />
          </div>
          <div className="ba-header-text">
            <h1>Book Appointment</h1>
            <p>Schedule a professional consultation with our medical experts</p>
          </div>
        </div>

        <div className="appointment-form-card animate-slide-up">
          <form onSubmit={handleSubmit}>
            {/* Select Doctor */}
            <div className="form-section">
              <h3 className="form-section-title"><FaUserMd /> Select Doctor</h3>
              <div className="doctors-grid">
                {doctors.map(doctor => {
                  return (
                    <div 
                      key={doctor._id}
                      className={`doctor-selection-card ${formData.doctor === doctor._id ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, doctor: doctor._id})}
                    >
                      <img src={doctor.avatarUrl || '/assets/images/doctor1.png'} alt={`Dr. ${doctor.name}`} className="doctor-avatar" />
                      <div className="doctor-card-info">
                        <h4>Dr. {doctor.name}</h4>
                        <span className="doc-specialty">{doctor.specialization}</span>
                        <div className="doc-stats">
                           <span>⭐ 4.9</span>
                           <span>💼 {doctor.experience} yrs</span>
                        </div>
                      </div>
                      <div className="doctor-select-indicator">
                        {formData.doctor === doctor._id ? '✓ Selected' : 'Select'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date and Time */}
            <div className="form-section">
              <h3 className="form-section-title"><FaRegClock /> Select Date & Time</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="appointmentDate">Date *</label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    required
                    className="modern-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="timeSlot">Time Slot *</label>
                  <select
                    id="timeSlot"
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    required
                    className="modern-input"
                  >
                    <option value="">-- Select Time --</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="form-section">
              <h3 className="form-section-title"><FaNotesMedical /> Reason for Visit</h3>
              <div className="form-group">
                <label htmlFor="reason">Describe your health concern *</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms or reason for consultation in detail..."
                  required
                  className="modern-input"
                ></textarea>
              </div>
            </div>

            {/* Symptoms Selection */}
            <div className="form-section">
              <h3 className="form-section-title"><FaNotesMedical /> Select Symptoms (Optional)</h3>
              <div className="symptoms-grid">
                {availableSymptoms.map(symptom => (
                  <button
                    key={symptom}
                    type="button"
                    className={`symptom-btn ${selectedSymptoms.includes(symptom.toLowerCase().replace(' ', '_')) ? 'active' : ''}`}
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="button" 
                className="modern-btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                type="submit" 
                className="modern-btn-primary"
                disabled={loading}
              >
                {loading ? 'Booking...' : <><FaCheckCircle /> Confirm Appointment</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
