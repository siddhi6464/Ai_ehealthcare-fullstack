const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendAppointmentConfirmation } = require('../services/emailService');
const { analyzeSymptoms, generatePrescription } = require('../services/aiEngine');

/**
 * Create new appointment
 */
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, timeSlot, reason, symptoms } = req.body;

    // Validate doctor exists
    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== 'doctor') {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate: new Date(appointmentDate),
      'timeSlot.startTime': timeSlot.startTime,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({
        status: 'error',
        message: 'This time slot is already booked'
      });
    }

    // Generate AI recommendations if symptoms provided
    let aiRecommendations = null;
    if (symptoms && symptoms.length > 0) {
      const analysis = analyzeSymptoms(symptoms);
      aiRecommendations = {
        suggestions: analysis.recommendations.slice(0, 5),
        precautions: analysis.precautions.slice(0, 5),
        generatedAt: new Date()
      };
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      appointmentDate,
      timeSlot,
      reason,
      symptoms: symptoms || [],
      aiRecommendations
    });

    await appointment.populate('doctor', 'name specialization');

    // Send confirmation email
    try {
      const patient = await User.findById(req.user._id);
      await sendAppointmentConfirmation(patient.email, {
        doctorName: doctorUser.name,
        date: new Date(appointmentDate).toDateString(),
        time: `${timeSlot.startTime} - ${timeSlot.endTime}`,
        reason
      });
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully',
      data: { appointment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get user's appointments
 */
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization consultationFee')
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: { appointments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get doctor's appointments
 */
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', 'name email phone dateOfBirth gender')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: { appointments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update appointment status
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check authorization
    if (appointment.doctor.toString() !== req.user._id.toString() &&
        appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      status: 'success',
      message: 'Appointment status updated',
      data: { appointment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Add consultation details (doctor only)
 */
exports.addConsultationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, prescription, doctorNotes, followUpDate } = req.body;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription;
    appointment.doctorNotes = doctorNotes;
    appointment.followUpDate = followUpDate;
    appointment.status = 'completed';

    await appointment.save();

    res.status(200).json({
      status: 'success',
      message: 'Consultation details added',
      data: { appointment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all doctors
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isActive: true })
      .select('name specialization qualification experience consultationFee availableSlots');

    res.status(200).json({
      status: 'success',
      results: doctors.length,
      data: { doctors }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
