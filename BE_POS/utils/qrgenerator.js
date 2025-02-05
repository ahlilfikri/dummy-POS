const QRCode = require("qrcode");
const path = require("path");


const generateQRCodeFile = async (data, transactionId) => {
    try {
        const qrPath = path.join(__dirname, `../uploads/qrcodes/${transactionId}.png`);
        await QRCode.toFile(qrPath, data);
        return `/uploads/qrcodes/${transactionId}.png`;
    } catch (err) {
        console.error("QR Code File Generation Error:", err);
        return null;
    }
};

module.exports = { generateQRCodeFile };
