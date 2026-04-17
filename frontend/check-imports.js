require('@babel/register')({
  presets: [
    ['@babel/preset-env'],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ]
});

const files = [
  './src/pages/Login',
  './src/pages/Register',
  './src/pages/Dashboard',
  './src/pages/BookAppointment',
  './src/pages/MyAppointments',
  './src/pages/AIAnalysis',
  './src/pages/HealthReminders',
  './src/pages/DoctorDashboard',
  './src/pages/DoctorProfile',
  './src/components/Navbar'
];

let failed = false;
files.forEach(file => {
  try {
    const mod = require(file);
    if (!mod.default) {
       console.error('UNDEFINED DEFAULT EXPORT IN:', file);
       failed = true;
    } else {
       console.log('OK:', file);
    }
  } catch (err) {
    console.error('ERROR REQUIRING:', file, err.message);
    failed = true;
  }
});

if (!failed) console.log('ALL IMPORTS ARE VALID COMPONENTS.');
