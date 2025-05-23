import multer from 'multer';
import { storage } from '../config/cloudinary.js';

if (!storage || typeof storage._handleFile !== 'function') {
  console.error('Invalid storage configuration:', storage);
  throw new Error('Cloudinary storage is not properly configured');
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('Multer fileFilter: Processing file', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size || 'undefined',
      fieldname: file.fieldname,
      encoding: file.encoding
    });
    if (file.mimetype === 'application/pdf') {
      console.log('Multer fileFilter: PDF accepted');
      cb(null, true);
    } else {
      console.log('Multer fileFilter: Invalid file type', file.mimetype);
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default (req, res, next) => {
  console.log('Multer middleware: Starting file upload processing...', {
    headers: req.headers,
    body: req.body
  });
  upload.single('pdf')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ error: err.message });
    }
    console.log('Multer middleware: File upload completed', req.file);
    next();
  });
};