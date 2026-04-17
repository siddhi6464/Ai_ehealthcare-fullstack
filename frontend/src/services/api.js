import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.patch('/auth/profile', data)
};

// AI API
export const aiAPI = {
  analyzeSymptoms: (data) => api.post('/ai/analyze', data),
  getRecommendations: (data) => api.post('/ai/recommendations', data),
  getAllSymptoms: () => api.get('/ai/symptoms'),
  getRelatedSymptoms: (symptom) => api.get(`/ai/symptoms/${symptom}/related`)
};

// Appointment API
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  getDoctorAppointments: () => api.get('/appointments/doctor/appointments'),
  getAllDoctors: () => api.get('/appointments/doctors'),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  addConsultation: (id, data) => api.patch(`/appointments/${id}/consultation`, data)
};

// Notification API
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  getHealthReminders: () => api.get('/notifications/health-reminders'),
  updateHealthReminders: (data) => api.patch('/notifications/health-reminders', data),
  triggerReminders: () => api.post('/notifications/health-reminders/trigger')
};

// User API
export const userAPI = {
  updateMedicalHistory: (data) => api.patch('/users/medical-history', data),
  getMedicalHistory: () => api.get('/users/medical-history')
};

export default api;
