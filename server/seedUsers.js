require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

const seedUsers = async () => {
  await connectDB();

  const users = [
    {
      name: 'Admin',
      email: 'admin@casamatilda.com',
      password: 'admin123',
      role: 'admin',
    },
    {
      name: 'User',
      email: 'user@casamatilda.com',
      password: 'user123',
      role: 'guest',
    },
  ];

  for (const userData of users) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) {
      console.log(`User ${userData.email} already exists — skipping.`);
      continue;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    await User.create({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    });

    console.log(`Created ${userData.role}: ${userData.email}`);
  }

  console.log('\nDone! Users created:');
  console.log('  Admin  → email: admin@casamatilda.com  | password: admin123');
  console.log('  Guest  → email: user@casamatilda.com   | password: user123');

  await mongoose.disconnect();
  process.exit(0);
};

seedUsers().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
