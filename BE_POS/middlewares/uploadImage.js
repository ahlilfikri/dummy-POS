const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (req.originalUrl.includes("upload/evidence")) {
            cb(null, 'uploads/evidence');
        } else {
            cb(null, 'uploads/item');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung! Hanya gambar diperbolehkan'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;


























// 
