const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Initialize upload middleware
const upload = multer({ storage: storage });

// API endpoint to get base64 directly
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Read the uploaded file and convert to base64
  const filePath = req.file.path;
  const fileData = fs.readFileSync(filePath);
  const base64Data = 'data:' + req.file.mimetype + ';base64,' + fileData.toString('base64');

  // Clean up - delete the uploaded file
  fs.unlinkSync(filePath);

  // Return the base64 string directly
  res.json({ base64: base64Data });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});