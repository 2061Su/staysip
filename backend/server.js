require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./config/db');

// 1. IMPORT YOUR MODELS (Required for associations to work)
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const User = require('./models/User'); // Required if you link users to bookings

const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// 2. DEFINE ASSOCIATIONS
// This tells the database how Room and Booking tables are linked
Room.hasMany(Booking, { foreignKey: 'roomId' });
Booking.belongsTo(Room, { foreignKey: 'roomId' });

// Optional: Link User to Bookings for history tracking
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });



// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/hotel', hotelRoutes);

const PORT = process.env.PORT || 5000;

// 3. SYNC DATABASE AND START SERVER
// Using { alter: true } will update your tables without deleting existing data
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('🐘 PostgreSQL Connected and Tables Synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Unable to connect to PostgreSQL:', err);
  });