const OprationalModel = require('../../model/oprasionalModels');
const { errorLogs } = require('../../utils/logging');

exports.createOprational = async (req, res) => {
    try {
        const { namaOprational, biayaOprational, deskripsiOprational } = req.body;

        const oprational = new OprationalModel(
            {
                namaOprational,
                biayaOprational,
                deskripsiOprational,
                userId: req.user._id,
            }
        );

        await oprational.save();

        res.status(201).json({ message: 'Oprational berhasil ditambahkan.' });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};


exports.getAllnonpaginated = async (req, res) => {
    try {
        const oprational = await OprationalModel.find();
        res.status(200).json(oprational);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


exports.getAllOprational = async (req, res) => {
    try {


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;




        let filter = {};




        const total = await OprationalModel.countDocuments(filter);
        const skip = (page - 1) * limit;
        const oprational = await OprationalModel
            .find(filter)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'nama role');

        console.log("Hasil Query:", oprational); // Debugging hasil query

        res.status(200).json({
            data: oprational,
            metadata: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.log("ERROR:", error); // Debugging error kalau ada
        errorLogs(error.message, req, res);
        res.status(500).json({ message: error.message });
    }
};

exports.getOprationalById = async (req, res) => {
    try {
        const { id } = req.params;
        const oprational = await OprationalModel.findById(id);

        if (!oprational) {
            return res.status(404).json({ message: 'Oprational tidak ditemukan.' });
        }

        res.status(200).json(oprational);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateOprational = async (req, res) => {
    try {
        const { id } = req.params;
        const { namaOprational, biayaOprational, deskripsiOprational } = req.body;

        const oprational = await OprationalModel.findById(id);
        if (!oprational) {
            return res.status(404).json({ message: 'Oprational tidak ditemukan.' });
        }

        oprational.namaOprational = namaOprational;
        oprational.biayaOprational = biayaOprational;
        oprational.deskripsiOprational = deskripsiOprational;

        await oprational.save();

        res.status(200).json({ message: 'Oprational berhasil diupdate.' });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.approveOprational = async (req, res) => {
    try {
        const { id } = req.params;
        const { approvedStatus } = req.body;
        const dataOprational = await OprationalModel.findById(id);

        if (!dataOprational) {
            return res.status(404).json({ message: "Oprational tidak ditemukan." });
        }

        if (!["approved", "rejected"].includes(approvedStatus)) {
            return res.status(400).json({ message: "Status approval tidak valid." });
        }

        dataOprational.approvalStatus = approvedStatus;
        if (approvedStatus === "approved") {
            dataOprational.approvedBy = req.user._id;
        }

        await dataOprational.save();

        res.status(200).json({ message: `Oprational telah ${approvedStatus}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};
exports.uploadEvidence = async (req, res) => {
    try {
        console.log("REQ FILE:", req.file);

        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'File evidence tidak ditemukan.' });
        }

        const evidencePath = `uploads/evidence/${req.file.filename}`;
        const dataOprational = await OprationalModel.findById(id);
        if (!dataOprational) {
            return res.status(404).json({ message: 'Oprational tidak ditemukan.' });
        }

        dataOprational.imageEvidence = evidencePath;
        dataOprational.approvalStatus = 'done';
        await dataOprational.save();

        res.status(200).json({ message: 'Evidence berhasil diupload.', path: evidencePath });

    } catch (error) {
        console.log("UPLOAD ERROR:", error);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};


exports.deleteOprational = async (req, res) => {
    try {
        const { id } = req.params;
        const oprational = await OprationalModel.findById(id);

        if (!oprational) {
            return res.status(404).json({ message: 'Oprational tidak ditemukan.' });
        }

        await OprationalModel.findByIdAndDelete(oprational._id);

        res.status(200).json({ message: 'Oprational berhasil dihapus.' });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
