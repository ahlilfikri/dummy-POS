const UserPos = require('../../model/userPosModel');
const mongoose = require('mongoose');
const { errorLogs } = require('../../utils/logging');

// Create User
exports.createUser = async (req, res) => {
    try {
        const { nama, username, password, role } = req.body;


        const allowedRoles = ['admin', 'logistik', 'cashier', 'manager'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Role tidak valid.' });
        }

        const user = new UserPos({ nama, username, password, role });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Get All Users with Metadata
exports.getAllUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page <= 0 || limit <= 0) {
            return res.status(400).json({ message: 'Page dan limit harus angka positif.' });
        }

        const skip = (page - 1) * limit;
        const total = await UserPos.countDocuments();
        const users = await UserPos.find().skip(skip).limit(limit);

        res.status(200).json({
            data: users,
            metadata: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Get User By ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'ID tidak valid.' });
        }

        const user = await UserPos.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        res.status(200).json(user);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, username, password, role } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'ID tidak valid.' });
        }

        const allowedRoles = ['admin', 'kasir', 'manager'];
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Role tidak valid.' });
        }

        const updates = { nama, username, role };
        if (password) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        const user = await UserPos.findByIdAndUpdate(id, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        res.status(200).json(user);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'ID tidak valid.' });
        }

        const user = await UserPos.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        res.status(204).json();
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};
