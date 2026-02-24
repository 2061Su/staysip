const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.createBooking = async (req, res) => {
  try {
    const { roomId, customerName, phoneNumber, bookingDate } = req.body;

    // Check if room is already booked for that specific date
    const existingBooking = await Booking.findOne({
      where: { RoomId: roomId, bookingDate: bookingDate, status: 'confirmed' }
    });

    if (existingBooking) {
      return res.status(400).json({ error: "This room is already booked for this date!" });
    }

    const newBooking = await Booking.create({
      RoomId: roomId,
      customerName,
      phoneNumber,
      bookingDate
    });

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.destroy({ where: { id } });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};