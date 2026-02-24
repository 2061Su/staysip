const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    roomNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    type: { type: DataTypes.STRING, allowNull: false }, // Deluxe, Suite, etc.
    price: { type: DataTypes.FLOAT, allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Room;