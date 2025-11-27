const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// ✏️ EDIT YOUR DETAILS HERE
const MY_ADMIN = {
  name: 'Mikey Tokyo',                    // ← Your Name
  email: 'admin@gmail.com',           // ← Your Email
  password: 'Admin@123',                  // ← Your Password
  role: 'admin'
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    // Check if admin already exists
    const existing = await User.findOne({ email: MY_ADMIN.email });
    
    if (existing) {
      console.log('⚠️  Admin account already exists!\n');
      console.log('🔐 Your Login Details:');
      console.log(`📧 Email: ${existing.email}`);
      console.log(`👤 Name: ${existing.name}`);
      console.log(`🎯 Role: ${existing.role}\n`);
      
      // Ensure it's admin role
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('✅ Updated to admin role!');
      }
    } else {
      // Create new admin account
      const admin = await User.create(MY_ADMIN);
      console.log('✅ Admin Account Created Successfully!\n');
      console.log('🔐 Your Login Details:');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔑 Password: ${MY_ADMIN.password}`);
      console.log(`🎯 Role: ${admin.role}\n`);
    }
    
    console.log('✨ Setup Complete!');
    console.log('You can now:');
    console.log('1. Login at http://localhost:3000/login');
    console.log('2. Access Admin Panel');
    console.log('3. Manage jobs and applications\n');
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });