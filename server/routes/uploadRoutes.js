const express = require('express');
const router = express.Router();
const { put } = require('@vercel/blob');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Busboy = require('busboy');

// POST /api/upload — admin only, upload image to Vercel Blob
// Uses busboy directly instead of multer to work on Vercel serverless
router.post('/', protect, adminOnly, (req, res) => {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return res.status(400).json({ message: 'Must be multipart/form-data' });
  }

  const bb = Busboy({ headers: req.headers });
  let fileBuffer = null;
  let fileName = '';
  let fileMime = '';
  let uploadError = null;

  bb.on('file', (fieldname, file, info) => {
    const { filename, mimeType } = info;
    if (!mimeType.startsWith('image/')) {
      uploadError = 'Only image files are allowed';
      file.resume();
      return;
    }
    fileName = filename;
    fileMime = mimeType;
    const chunks = [];
    file.on('data', (chunk) => chunks.push(chunk));
    file.on('end', () => {
      fileBuffer = Buffer.concat(chunks);
    });
  });

  bb.on('finish', async () => {
    if (uploadError) {
      return res.status(400).json({ message: uploadError });
    }
    if (!fileBuffer) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    try {
      const safeName = `gallery/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
      const blob = await put(safeName, fileBuffer, {
        access: 'public',
        contentType: fileMime,
      });
      res.json({ url: blob.url });
    } catch (err) {
      console.error('Blob upload error:', err);
      res.status(500).json({ message: err.message || 'Upload failed' });
    }
  });

  bb.on('error', (err) => {
    console.error('Busboy error:', err);
    res.status(500).json({ message: 'File parsing error' });
  });

  req.pipe(bb);
});

module.exports = router;
