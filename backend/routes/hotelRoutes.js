const express = require('express');
const router = express.Router();
const { 
    addRoom, 
    getRooms, 
    createBooking, 
    getAllBookings, 
    deleteBooking,
    getMyBookings,
    updateRoom,    
    updateBooking  
} = require('../controllers/hotelController');

const { 
    deleteStaff, 
    getActiveStaff,
    getPendingReceptionists,
    approveUser
} = require('../controllers/authController');

// Room routes
router.post('/rooms', addRoom);
router.get('/rooms', getRooms);
router.put('/rooms/:id', updateRoom);

// Booking routes
router.post('/bookings', createBooking);
router.get('/bookings', getAllBookings);
router.get('/my-bookings/:userId', getMyBookings);
router.delete('/bookings/:id', deleteBooking); 

// Staff Management (Admin only)
router.get('/active-staff', getActiveStaff);
router.get('/pending-reception', getPendingReceptionists);
router.put('/approve/:id', approveUser);
router.delete('/staff/:id', deleteStaff);


router.put('/bookings/:id', updateBooking);

module.exports = router;