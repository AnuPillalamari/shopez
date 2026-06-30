import fs from 'fs';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';

/**
 * Uploads an image to Cloudinary if available, otherwise returns the local file static URL path.
 * Also handles cleaning up local temporary files when Cloudinary succeeds.
 */
const uploadImage = async (file) => {
  if (!file) return '';

  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'shopez',
      });
      
      // Delete local temporary file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error('Failed to delete temp file:', err.message);
      }
      
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed, falling back to local file:', error.message);
      return `/uploads/${file.filename}`;
    }
  }

  // Cloudinary not configured: serve via Express static route
  return `/uploads/${file.filename}`;
};

export default uploadImage;
