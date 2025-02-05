const mongoose = require('mongoose');

// model untuk biaya operasional yang sifatnya tetap atau bulanan
const fixedOprationalSchema = new mongoose.Schema({
    namaOprational: { type: String, required: true }, // gaji karyawan, listrik, air, dll
    biayaOprational: { type: Number, required: true },
    deskripsiOprational: { type: String, required: false }, // keterangan
    tanggalOprational: { type: Date, required: true }, // tanggal pengeluaran misal 02 berarti setiap tanggal 2
}, { timestamps: true });


module.exports = mongoose.model('fixedOprational', fixedOprationalSchema);
