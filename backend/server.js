import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventoryRoutes.js';
import reportsRouter from './routes/reports.js';

// Load environment variables from .env file
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Connect to MongoDB - Using MONGO_URI from .env file
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-inventory';
console.log("Attempting to connect to:", MONGO_URI.replace(/:([^:@]+)@/, ':****@')); // Log the URI but hide the password

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  console.log(`Database name: ${mongoose.connection.db.databaseName}`);
  
  // Debug info about collections
  mongoose.connection.db.listCollections().toArray()
    .then(collections => {
      console.log('Available collections:', collections.map(c => c.name));
    })
    .catch(err => console.error('Error listing collections:', err));
    
}).catch(err => {
  console.error('❌ Failed to connect to MongoDB', err);
});

// Debug route to check database information
app.get('/api/debug/db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Get count of documents in each collection
    const counts = {};
    for (const name of collectionNames) {
      counts[name] = await mongoose.connection.db.collection(name).countDocuments();
    }
    
    res.json({
      databaseName: mongoose.connection.db.databaseName,
      collections: collectionNames,
      documentCounts: counts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes - mount the routes with proper prefixes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportsRouter);

// Debug route to check if API is running
app.get('/api-status', (req, res) => {
  res.json({ 
    status: 'API is running', 
    timestamp: new Date(),
    database: mongoose.connection.db.databaseName
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../frontend/dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/inventory/products`);
  console.log(`Reports available at http://localhost:${PORT}/api/reports/generate-excel`);
  console.log(`Database debug info available at http://localhost:${PORT}/api/debug/db`);
});