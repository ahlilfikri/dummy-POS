const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserPos = new mongoose.Schema({
    nama: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    token: { type: String, required: false },
    status: { type: String, required: false },
    role: { type: String, required: false },
}, { timestamps: true });

UserPos.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserPos.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserPos.methods.clearSessionToken = async function () {
    this.currentSessionToken = null;
    await this.save();
};

module.exports = mongoose.model('userpos', UserPos);
