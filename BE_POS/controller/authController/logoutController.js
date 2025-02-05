const UserPos = require('../../model/userPosModel');
const { errorLogs } = require('../../utils/logging');

exports.logoutKasir = async (req, res) => {
    try {
        const { id } = req.user;

        console.log('id', id);
        console.log('req.user', req.user);

        const cashier = await UserPos.findById(id);
        if (!cashier) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        cashier.token = null;
        await cashier.save();

        res.status(200).json({ message: 'Logout berhasil.' });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
};
