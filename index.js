const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Use memory storage (avoids file system issues on Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API endpoint to get base64 directly
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Convert file buffer to base64
  const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  // Return the base64 string
  res.json({ base64: base64Data });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
