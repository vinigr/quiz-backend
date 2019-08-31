const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = cloudinaryStorage({
  cloudinary,
  folder: 'queston',
  allowedFormats: ['jpg', 'png'],
});

const parser = multer({ storage });

module.exports = parser;
