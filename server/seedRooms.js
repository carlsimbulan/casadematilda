require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

const rooms = [
  {
    name: 'Room 1 – Matilda Suite',
    description:
      'A spacious and elegantly furnished suite with a queen-size bed, ensuite bathroom, air conditioning, and garden view. Perfect for couples or families looking for comfort and style.',
    price: 0, // included in whole-property booking
    capacity: 4,
    amenities: [
      'Queen Bed',
      'Ensuite Bathroom',
      'Air Conditioning',
      'Garden View',
      'Smart TV',
      'Mini Refrigerator',
      'Hot Shower',
    ],
    images: [],
    isAvailable: true,
  },
  {
    name: 'Room 2 – Garden Room',
    description:
      'A cozy and comfortable room overlooking the lush garden and pool area. Features a double bed, private bathroom, and direct access to the outdoor amenities.',
    price: 0,
    capacity: 4,
    amenities: [
      'Double Bed',
      'Private Bathroom',
      'Air Conditioning',
      'Pool View',
      'Smart TV',
      'Hot Shower',
      'Garden Access',
    ],
    images: [],
    isAvailable: true,
  },
];

const seedRooms = async () => {
  await connectDB();

  // Clear existing rooms first
  await Room.deleteMany({});
  console.log('Cleared existing rooms.');

  for (const roomData of rooms) {
    const room = await Room.create(roomData);
    console.log(`Created: ${room.name} (ID: ${room._id})`);
  }

  console.log('\nDone! 2 rooms seeded for Casa de Matilda.');
  await mongoose.disconnect();
  process.exit(0);
};

seedRooms().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
