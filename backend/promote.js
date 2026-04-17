const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function promote() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const res = await User.updateMany(
            {}, // Update all users 
            { 
               $set: { 
                 role: 'doctor',
                 specialization: 'General Physician',
                 consultationFee: 250,
                 experience: 10
               } 
            }
        );
        console.log(`Promoted ${res.modifiedCount} users to DOCTOR role.`);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

promote();
