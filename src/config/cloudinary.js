const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_CLOUDINARY,
  api_key: process.env.KEY_CLOUDINARY,
  api_secret: process.env.SECRET_CLOUDINARY,
});

module.exports = cloudinary;
