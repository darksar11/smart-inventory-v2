import express from 'express';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';

const router = express.Router();

// Debug endpoint to check data in both collections
router.get('/debug', async (req, res) => {
    try {
        const products = await Product.find();
        const inventories = await Inventory.find();
        
        res.json({
            productsCount: products.length,
            inventoriesCount: inventories.length,
            products: products,
            inventories: inventories
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get a single product
router.get('/products/:id', getProduct, (req, res) => {
    res.json(res.product);
});

// Create a product - save to both collections for data integrity
router.post('/products', async (req, res) => {
    try {
        // Create product document
        const product = new Product({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description || '',
            quantity: req.body.quantity,
            unitValue: req.body.unitValue,
            lowThreshold: req.body.lowThreshold,
            criticalThreshold: req.body.criticalThreshold,
            sku: req.body.sku
        });

        // Save product to products collection
        const newProduct = await product.save();
        
        // Also save to inventories collection for UI compatibility
        const inventory = new Inventory({
            name: req.body.name,
            category: req.body.category,
            quantity: req.body.quantity,
            unitValue: req.body.unitValue
        });
        
        await inventory.save();
        
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update a product
router.patch('/products/:id', getProduct, async (req, res) => {
    // Update product fields if provided
    if (req.body.name != null) res.product.name = req.body.name;
    if (req.body.category != null) res.product.category = req.body.category;
    if (req.body.description != null) res.product.description = req.body.description;
    if (req.body.quantity != null) res.product.quantity = req.body.quantity;
    if (req.body.unitValue != null) res.product.unitValue = req.body.unitValue;
    if (req.body.lowThreshold != null) res.product.lowThreshold = req.body.lowThreshold;
    if (req.body.criticalThreshold != null) res.product.criticalThreshold = req.body.criticalThreshold;
    if (req.body.sku != null) res.product.sku = req.body.sku;

    try {
        // Save updated product
        const updatedProduct = await res.product.save();
        
        // Also update in inventories collection
        if (req.body.name || req.body.category || req.body.quantity || req.body.unitValue) {
            await Inventory.findOneAndUpdate(
                { name: res.product.name }, // Find by name
                {
                    name: res.product.name,
                    category: res.product.category,
                    quantity: res.product.quantity,
                    unitValue: res.product.unitValue,
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );
        }
        
        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a product
router.delete('/products/:id', getProduct, async (req, res) => {
    try {
        const productName = res.product.name;
        
        // Delete from products collection
        await res.product.deleteOne();
        
        // Also delete from inventories collection
        await Inventory.deleteOne({ name: productName });
        
        res.json({ message: 'Product deleted from both collections' });
    } catch (err) {
        console.error('Error deleting product:', err);
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
        console.error('Error in getProduct middleware:', err);
        return res.status(500).json({ message: err.message });
    }

    res.product = product;
    next();
}

// Function to sync data between collections (can be called as needed)
router.get('/sync-collections', async (req, res) => {
    try {
        // Get all products
        const products = await Product.find();
        
        // Update or create matching inventory items
        const updatePromises = products.map(product => {
            return Inventory.findOneAndUpdate(
                { name: product.name },
                {
                    name: product.name,
                    category: product.category,
                    quantity: product.quantity,
                    unitValue: product.unitValue,
                    lastUpdated: new Date()
                },
                { upsert: true }
            );
        });
        
        await Promise.all(updatePromises);
        
        res.json({ message: 'Collections synchronized', count: products.length });
    } catch (err) {
        console.error('Error syncing collections:', err);
        res.status(500).json({ message: err.message });
    }
});

export default router;