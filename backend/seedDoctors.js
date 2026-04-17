const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const dummyDoctors = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@ehealthcare.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Neurologist',
    qualification: 'MD, PhD',
    experience: 12,
    consultationFee: 300,
    avatarUrl: '/assets/images/doctor2.png',
    description: 'Dr. Sarah Chen is a board-certified neurologist specializing in cognitive disorders and comprehensive brain health. She brings over a decade of clinical excellence to eHealthCare.',
    achievements: [
      'Published author in the Journal of Neurology',
      'Chief of Neurology at City Hospital (2018-2022)',
      'Awarded Excellence in Patient Care (2020)'
    ]
  },
  {
    name: 'Michael Roberts',
    email: 'michael.roberts@ehealthcare.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Cardiologist',
    qualification: 'MD, FACC',
    experience: 15,
    consultationFee: 350,
    avatarUrl: '/assets/images/doctor1.png',
    description: 'Dr. Roberts focuses on preventive cardiology and advanced heart failure treatment. He strongly believes in personalized lifestyle interventions alongside cutting-edge medical care.',
    achievements: [
      'Fellow of the American College of Cardiology',
      'Pioneer in minimally invasive heart repairs',
      'Top Doctor feature in Health Magazine (2023)'
    ]
  },
  {
    name: 'David Sharma',
    email: 'david.sharma@ehealthcare.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Pediatrician',
    qualification: 'MD, FAAP',
    experience: 8,
    consultationFee: 200,
    avatarUrl: '/assets/images/doctor3.png',
    description: 'Dr. Sharma is dedicated to providing compassionate care to children from birth through adolescence. He creates a welcoming environment to ease anxiety for both kids and parents.',
    achievements: [
      'Pediatric Residency at Children’s National',
      'Board Certified in Pediatrics',
      'Community Health Advocate Award'
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');

    // Optionally cleanup old mock doctors (but not the real user if they happen to be a doctor)
    await User.deleteMany({ email: { $in: dummyDoctors.map(d => d.email) } });

    console.log('Old dummy doctors removed, seeding new ones...');
    await User.insertMany(dummyDoctors);

    console.log('Doctor seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding doctors:', error);
  } finally {
    process.exit();
  }
};

seedDB();
