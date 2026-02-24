const { Op } = require('sequelize');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// --- ROOM LOGIC ---
exports.addRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ error: "Room number already exists" });
    }
};

exports.getRooms = async (req, res) => {
    const rooms = await Room.findAll();
    res.json(rooms);
};

// --- BOOKING LOGIC ---
exports.createBooking = async (req, res) => {
    try {
        const { roomId, customerName, phoneNumber, bookingDate, userId } = req.body;

        // CHECK: Does this room already have a guest on THIS specific date?
        const isTaken = await Booking.findOne({
            where: { 
                roomId: roomId,
                bookingDate: bookingDate 
            }
        });

        if (isTaken) {
            return res.status(400).json({ 
                error: "This room is already reserved for the selected date. Please choose a different date or room." 
            });
        }

        const booking = await Booking.create({ 
            roomId, customerName, phoneNumber, bookingDate, userId 
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await Booking.findAll({ 
            where: { userId },
            include: [{ model: Room, attributes: ['roomNumber', 'type'] }] // Joins the tables
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    const bookings = await Booking.findAll();
    res.json(bookings);
};

exports.deleteBooking = async (req, res) => {
    try {
        await Booking.destroy({ where: { id: req.params.id } });
        res.json({ message: "Booking removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomNumber, type, price } = req.body;
        await Room.update({ roomNumber, type, price }, { where: { id } });
        res.json({ message: "Room details updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE BOOKING (For Admin, Reception, and User)
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomId, customerName, phoneNumber, bookingDate } = req.body;

        // Check if the new date/room is taken by someone ELSE (excluding this booking)
        const conflict = await Booking.findOne({
            where: {
                roomId,
                bookingDate,
                id: { [Op.ne]: id } 
            }
        });

        if (conflict) {
            return res.status(400).json({ error: "The room is already booked for this new date." });
        }

        await Booking.update({ roomId, customerName, phoneNumber, bookingDate }, { where: { id } });
        res.json({ message: "Booking updated successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};