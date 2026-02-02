// backend/routes/uploadRoutes.js

const express = require('express');
const multer = require('multer');
const { protect, organizer } = require('../middleware/authMiddleware');
const { uploadImage } = require('../controllers/uploadController'); 

const router = express.Router();


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); 
    } else {
      cb(new Error('Not an image! Please upload an image file.'), false); 
    }
  },
});


router.post('/', protect, organizer, upload.single('image'), uploadImage);

module.exports = router;