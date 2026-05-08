const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    type: String
  },

  // Doctor-specific fields
  specialization: {
    type: String,
    required: function () { return this.role === 'doctor'; }
  },
  qualification: {
    type: String
  },
  experience: {
    type: Number
  },
  consultationFee: {
    type: Number
  },
  avatarUrl: {
    type: String,
    default: '/assets/images/doctor1.png'
  },
  description: {
    type: String,
    default: 'A dedicated medical professional.'
  },
  achievements: [{
    type: String
  }],
  availableSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],

  // Patient-specific health data
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  allergies: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String
  }],

  // Health tracking preferences
  healthReminders: {
    menstrualCycle: {
      enabled: { type: Boolean, default: false },
      lastDate: Date,
      cycleLength: { type: Number, default: 28 }
    },
    bloodPressure: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, default: 'weekly' }, // daily, weekly, monthly
      lastChecked: Date
    },
    bloodSugar: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, default: 'weekly' },
      lastChecked: Date
    }
  },

  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
