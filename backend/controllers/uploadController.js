// backend/controllers/uploadController.js

const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinaryConfig'); 


const uploadImage = asyncHandler(async (req, res) => {
  
  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded.');
  }

  
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'event-ticketing', 
        resource_type: 'auto', 
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message));
        } else {
          
          resolve(result);
        }
      }
    );

 
    uploadStream.end(req.file.buffer);
  });


  res.status(201).json({
    message: 'Image uploaded successfully.',
    imageUrl: result.secure_url,
  });
});

module.exports = {
  uploadImage,
};