const mongoose = require('mongoose');

// model untuk biaya operasional yang sifatnya dinamis atau dadakan
const oprationalSchema = new mongoose.Schema({
    namaOprational: { type: String, required: true },
    biayaOprational: { type: Number, required: true },
    deskripsiOprational: { type: String, required: false },
    approvalStatus: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'done'] }, // pending, approved, rejected
    imageEvidence: { type: String, required: false, default: null }, // image url
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userpos', required: true }, // ini buat kasir ato logidtik yang nagjiun
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userpos', required: false }, // ini buat admin ato meenger yang setuijuin
}, { timestamps: true });


module.exports = mongoose.model('oprasional', oprationalSchema);
