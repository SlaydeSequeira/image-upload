const express = require('express');
const multer = require('multer');
const app = express();

// Configure multer to store files in memory instead of on disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API endpoint to get base64 directly
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Convert the buffer directly to base64
  const base64Data = 'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64');

  // Return the base64 string
  res.json({ url: base64Data });
});

// Default route
app.get('/', (req, res) => {
  res.send('Image upload API is running. Post to /upload to convert images to base64.');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;