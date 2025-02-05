const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    hargaBeli: { type: Number, required: true },
    image: { type: String, required: false },
    hargaJual: { type: Number, required: true },
    stok: { type: Number, required: true },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true }],
    isNonMaterial: { type: Boolean, default: true },
    materials: [
        {
            materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'material', required: false },
            unitPerMaterial: { type: String, required: false }, // kg, gram, liter, ml, pcs
            quantityPerMaterial: { type: Number, required: false }, // dibutuhkan berapa unit material untuk membuat 1 item
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('item', itemSchema);
