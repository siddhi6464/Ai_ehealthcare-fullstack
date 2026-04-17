const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Patient and doctor routes
router.post('/', appointmentController.createAppointment);
router.get('/my-appointments', appointmentController.getMyAppointments);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);

// Doctor only routes
router.get('/doctor/appointments', restrictTo('doctor'), appointmentController.getDoctorAppointments);
router.patch('/:id/consultation', restrictTo('doctor'), appointmentController.addConsultationDetails);

// Get all doctors (for booking)
router.get('/doctors', appointmentController.getAllDoctors);

module.exports = router;
