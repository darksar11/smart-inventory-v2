import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get inventory summary
router.get('/summary', async (req, res) => {
  try {
    const products = await Product.find();
    
    const summary = {
      totalItems: products.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: products.reduce((sum, item) => sum + (item.quantity * item.unitValue), 0),
      uniqueProducts: products.length,
      lowStockItems: products.filter(item => 
        item.quantity <= item.lowThreshold && 
        item.quantity > item.criticalThreshold
      ).length,
      criticalStockItems: products.filter(item => 
        item.quantity <= item.criticalThreshold
      ).length,
      healthyStockItems: products.filter(item => 
        item.quantity > item.lowThreshold
      ).length
    };
    
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single product
router.get('/products/:id', getProduct, (req, res) => {
  res.json(res.product);
});

// Create a product
router.post('/products', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    quantity: req.body.quantity,
    lowThreshold: req.body.lowThreshold,
    criticalThreshold: req.body.criticalThreshold,
    unitValue: req.body.unitValue,
    sku: req.body.sku
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a product
router.patch('/products/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.category != null) {
    res.product.category = req.body.category;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  if (req.body.quantity != null) {
    res.product.quantity = req.body.quantity;
  }
  if (req.body.lowThreshold != null) {
    res.product.lowThreshold = req.body.lowThreshold;
  }
  if (req.body.criticalThreshold != null) {
    res.product.criticalThreshold = req.body.criticalThreshold;
  }
  if (req.body.unitValue != null) {
    res.product.unitValue = req.body.unitValue;
  }
  if (req.body.sku != null) {
    res.product.sku = req.body.sku;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product thresholds only
router.patch('/products/:id/thresholds', getProduct, async (req, res) => {
  if (req.body.lowThreshold != null) {
    res.product.lowThreshold = req.body.lowThreshold;
  }
  if (req.body.criticalThreshold != null) {
    res.product.criticalThreshold = req.body.criticalThreshold;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/products/:id', getProduct, async (req, res) => {
  try {
    await res.product.deleteOne(); // Changed from remove() to deleteOne()
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get product by ID
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

export default router;