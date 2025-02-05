const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    totalItem: { type: Number, required: false },
    totalTransaction: { type: Number, required: false },
}, { timestamps: true });

module.exports = mongoose.model('category', CategorySchema);
