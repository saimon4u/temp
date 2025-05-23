import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET ? '[REDACTED]' : undefined
});

if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  console.error('Cloudinary config error: Missing environment variables');
  throw new Error('Cloudinary configuration is incomplete');
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  timeout: 10000 // 10 seconds
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'baust_lecture_notes',
    allowed_formats: ['pdf'],
    resource_type: 'raw'
  }
});

console.log('Cloudinary storage initialized:', storage);

export default { cloudinary, storage };