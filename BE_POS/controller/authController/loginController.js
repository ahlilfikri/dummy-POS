const UserPos = require('../../model/userPosModel');
const jwt = require('jsonwebtoken');
const { errorLogs } = require('../../utils/logging');
require('dotenv').config();


exports.loginKasir = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username dan password wajib diisi.' });
        }

        const cashier = await UserPos.findOne({ username });
        if (!cashier) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        const isPasswordMatch = await cashier.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Password salah.' });
        }

        if (!cashier.isActive) {
            return res.status(403).json({ message: 'Akun ini telah dinonaktifkan.' });
        }

        const token = jwt.sign(
            { id: cashier._id, username: cashier.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        cashier.token = token;
        await cashier.save();
        
        res.status(200).json({
            message: 'Login berhasil.',
            token,
            user: {
                id: cashier._id,
                nama: cashier.nama,
                username: cashier.username,
                status: cashier.status,
                role: cashier.role,
                tokenTime: new Date(),
            },
        });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};
