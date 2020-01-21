const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "My-Car-Images", // The name of the folder in cloudinary
  allowedFormats: ["jpg", "png"],
  filename: function(req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

var storageInvoice = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "My-Service-Invoices", // The name of the folder in cloudinary
  allowedFormats: ["pdf", "jpg", "png"],
  filename: function(req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

const uploadCloud = multer({ storage: storage });
const uploadInvoice = multer ({ storage: storageInvoice });

module.exports = uploadCloud;
module.exports = uploadInvoice;
