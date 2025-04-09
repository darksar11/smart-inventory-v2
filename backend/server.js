import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import inventoryRoutes from './routes/inventoryRoutes.js';

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Routes - make sure this matches what your frontend is requesting
app.use('/api/inventory', inventoryRoutes);

// Debug route
app.get('/api-status', (req, res) => {
  res.json({ status: 'API is running' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../frontend/dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/inventory/products`);
});