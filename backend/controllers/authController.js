const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// 1. REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

    
        const isApproved = (role === 'user'); 

        const user = await User.create({ 
            name, 
            email, 
            password, 
            role, 
            isApproved 
        });

        res.status(201).json({ 
            message: role === 'reception' 
                ? "Registration successful. Pending Admin approval." 
                : "Registration successful!",
            userId: user.id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. LOGIN
exports.login = async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password.trim();
        console.log("--- Login Attempt ---");
        console.log("Email from request:", email);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("Result: User not found in DB");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("Hashed password from DB:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Does password match hash?:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
       
        if (!user.isApproved) {
            return res.status(403).json({ 
                error: "Access denied. Your account is pending admin approval." 
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.resetAdminPassword = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: 'admin@gmail.com' } });
        if (!user) return res.status(404).send("Admin not found");

        
        user.password = 'admin@gmail'; 
        await user.save();

        res.send("Admin password has been re-hashed and updated successfully!");
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "No user found with that email" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        
        
        console.log(`Reset Token for ${email}: ${resetToken}`);

        res.json({ message: "If an account exists, a reset link has been sent to your email." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getPendingReceptionists = async (req, res) => {
    try {
        const pending = await User.findAll({ 
            where: { role: 'reception', isApproved: false },
            attributes: ['id', 'name', 'email', 'createdAt']
        });
        res.json(pending);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.approveUser = async (req, res) => {
    try {
        
        const { id } = req.params; 
        const user = await User.findByPk(id);
        
        if (!user) return res.status(404).json({ error: "User not found" });

        user.isApproved = true;
        await user.save();

        res.json({ message: `Account for ${user.name} has been approved.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const userCount = await User.count({ where: { role: 'user' } });
        const staffCount = await User.count({ where: { role: 'reception' } });
        
        res.json({
            users: userCount,
            receptionists: staffCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    await User.destroy({ where: { id, role: 'reception' } }); 
    res.json({ message: "Staff member removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id, role: 'reception' } });
        res.json({ message: "Receptionist deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getActiveStaff = async (req, res) => {
    try {
        const staff = await User.findAll({ 
            where: { role: 'reception', isApproved: true },
            attributes: ['id', 'name', 'email']
        });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id, role: 'reception' } });
        res.json({ message: "Staff member removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

