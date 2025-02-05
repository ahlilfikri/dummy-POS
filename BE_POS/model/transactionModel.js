const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'userpos', required: true },
    namaPemesan: { type: String, required: false },
    metodePembayaran: { type: String, required: true },
    item: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
            nama: { type: String, required: true },
            hargaJual: { type: Number, required: true },
            namaItem: { type: String, required: true },
            jumlah: { type: Number, required: true },
            subtotal: { type: Number, required: true },
        }
    ],
    detail: { type: String, required: false },
    status: { type: String, enum: ['success', 'failed', 'edit', 'delete'], required: false },
    uangMasuk: { type: Number, required: false },
    uangKembalian: { type: Number, required: false },
    qrCode: { type: String, required: false },
    total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('transaction', transactionSchema);
