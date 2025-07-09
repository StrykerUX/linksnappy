const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'urls.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

// Helper functions
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const generateShortCode = () => {
  return nanoid(6);
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Shorten URL
app.post('/api/shorten', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }

    const data = readData();
    let shortCode = generateShortCode();
    
    // Ensure unique short code
    while (data[shortCode]) {
      shortCode = generateShortCode();
    }

    // Generate QR code
    const qrCode = await QRCode.toDataURL(`${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`);

    // Store URL data
    data[shortCode] = {
      originalUrl: url,
      shortCode,
      qrCode,
      clicks: 0,
      createdAt: new Date().toISOString(),
      lastAccessed: null
    };

    writeData(data);

    res.json({
      success: true,
      shortCode,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`,
      originalUrl: url,
      qrCode,
      createdAt: data[shortCode].createdAt
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get URL info
app.get('/api/url/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const data = readData();
    
    if (!data[shortCode]) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      success: true,
      ...data[shortCode]
    });
  } catch (error) {
    console.error('Error getting URL info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect to original URL
app.get('/api/redirect/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const data = readData();
    
    if (!data[shortCode]) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Update analytics
    data[shortCode].clicks += 1;
    data[shortCode].lastAccessed = new Date().toISOString();
    writeData(data);

    res.json({
      success: true,
      redirectUrl: data[shortCode].originalUrl
    });
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics
app.get('/api/analytics/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const data = readData();
    
    if (!data[shortCode]) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      success: true,
      analytics: {
        shortCode,
        originalUrl: data[shortCode].originalUrl,
        clicks: data[shortCode].clicks,
        createdAt: data[shortCode].createdAt,
        lastAccessed: data[shortCode].lastAccessed
      }
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all URLs (for dashboard)
app.get('/api/urls', (req, res) => {
  try {
    const data = readData();
    const urls = Object.values(data).map(url => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      lastAccessed: url.lastAccessed
    }));

    res.json({
      success: true,
      urls: urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    });
  } catch (error) {
    console.error('Error getting URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 LinkSnappy server running on port ${PORT}`);
  console.log(`📊 Data stored in: ${DATA_FILE}`);
});