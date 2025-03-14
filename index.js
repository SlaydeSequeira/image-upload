const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const app = express();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Enable JSON parsing for request bodies
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API endpoint for file upload
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Convert the buffer directly to base64
  const base64Data = 'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64');

  // Return the base64 string
  res.json({ url: base64Data });
});

// API endpoint for URL upload
app.post('/upload-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'No URL provided.' });
    }

    // Fetch the image from the URL
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(400).json({ error: `Failed to fetch image: ${response.statusText}` });
    }
    
    // Get the content type
    const contentType = response.headers.get('content-type');
    
    // Check if it's an image
    if (!contentType || !contentType.includes('image')) {
      return res.status(400).json({ error: 'The URL does not point to an image.' });
    }
    
    // Get the image data as buffer
    const imageBuffer = await response.buffer();
    
    // Convert to base64
    const base64Data = `data:${contentType};base64,${imageBuffer.toString('base64')}`;
    
    // Return the base64 string
    res.json({ url: base64Data });
  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).json({ error: 'Failed to process the image URL.' });
  }
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