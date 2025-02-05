const OprationalModel = require('../../model/oprasionalModels');
const { errorLogs } = require('../../utils/logging');

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
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};
