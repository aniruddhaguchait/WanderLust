const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

let storage;
let upload;

if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'wanderlust_DEV',
            allowedFormats: ["png", "jpg", "jpeg", "webp"],
        },
    });
    console.log("✅ Cloudinary configured for image uploads.");
} else {
    // Fallback to local storage if no Cloudinary credentials
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, '../public/uploads');
    
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '-' + file.originalname)
        }
    });
    console.log("⚠️ No Cloudinary credentials found. Using local storage for uploads.");
}

// 10MB limit
upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = {
    cloudinary,
    storage,
    upload
};
