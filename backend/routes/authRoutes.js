const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    forgotPassword, 
    getPendingReceptionists, 
    approveUser 
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.get('/pending-reception', getPendingReceptionists);
router.put('/approve/:userId', approveUser);

module.exports = router;