const mongoose = require('mongoose');


const MaterialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    unit: { type: String, required: true }, // kg, gram, liter, ml, pcs
    stock: { type: Number, required: true }, // stock in unit misal nya 1 kg, 1 liter, 1 pcs
    hargaBeli: { type: Number, required: true },
}, { timestamps: true });


module.exports = mongoose.model('material', MaterialSchema);
