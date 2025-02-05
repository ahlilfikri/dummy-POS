const OprationalModel = require('../../model/oprasionalModels');
const { errorLogs } = require('../../utils/logging');

exports.uploadEvidence = async (req, res) => {
    try {
        const { id } = req.params;
        const evidencePath = req.file ? `uploads/evidence${req.file.filename}` : null;
        const dataOprational = await OprationalModel.findById(id);
        if (!dataOprational) {
            return res.status(404).json({ message: 'Oprational tidak ditemukan.' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'File evidence tidak ditemukan.' });
        }

        dataOprational.evidence = evidencePath;
        dataOprational.approvalStatus = 'done';
        await dataOprational.save();
        res.status(200).json({ message: 'Evidence berhasil diupload.' });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};
