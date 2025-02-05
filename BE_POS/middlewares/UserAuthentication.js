const jwt = require('jsonwebtoken');
const UserPos = require('../model/userPosModel');

// Middleware untuk proteksi endpoint
exports.protect = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan. Akses ditolak.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserPos.findById(decoded.id);

        if (!user || user.token !== token) {
            return res.status(401).json({ message: 'Token tidak valid.' });
        }

        req.user = user; // Simpan data user ke request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
    }
};

// Middleware untuk role-based authorization
exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Akses ditolak. Role tidak sesuai.' });
        }
        next();
    };
};
