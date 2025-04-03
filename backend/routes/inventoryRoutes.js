import express from "express";
import Inventory from "../models/Inventory.js";

const router = express.Router();

// Get all inventory items with optional search and sorting
router.get("/", async (req, res) => {
    const { search, sortBy = 'productName', order = 'asc' } = req.query;
    try {
        let query = {};
        if (search) {
            query.productName = { $regex: search, $options: 'i' };
        }

        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        const inventory = await Inventory.find(query).sort(sortOptions);
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get inventory summary
router.get("/summary", async (req, res) => {
    try {
        const products = await Inventory.find();
        
        const summary = {
            totalItems: products.reduce((sum, item) => sum + item.quantity, 0),
            totalValue: products.reduce((sum, item) => sum + (item.quantity * item.price), 0),
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
        res.status(500).json({ error: err.message });
    }
});

// Get a single item
router.get("/:id", getInventoryItem, (req, res) => {
    res.json(res.inventoryItem);
});

// Add a new item with validation
router.post("/", async (req, res) => {
    const { 
        productName, 
        category, 
        description, 
        quantity, 
        price, 
        lowThreshold, 
        criticalThreshold, 
        sku 
    } = req.body;
    
    if (!productName || quantity === undefined || price === undefined) {
        return res.status(400).json({ error: "Required fields are missing" });
    }

    try {
        const newItem = new Inventory({ 
            productName, 
            category,
            description,
            quantity: Number(quantity), 
            price: Number(price),
            lowThreshold: Number(lowThreshold) || 10,
            criticalThreshold: Number(criticalThreshold) || 5,
            sku
        });
        
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an item
router.patch("/:id", getInventoryItem, async (req, res) => {
    const updates = req.body;
    const allowedUpdates = [
        'productName', 
        'category', 
        'description', 
        'quantity', 
        'price', 
        'lowThreshold', 
        'criticalThreshold', 
        'sku'
    ];
    
    allowedUpdates.forEach(update => {
        if (updates[update] !== undefined) {
            res.inventoryItem[update] = updates[update];
        }
    });
    
    // Update the lastUpdated timestamp
    res.inventoryItem.lastUpdated = Date.now();

    try {
        const updatedItem = await res.inventoryItem.save();
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update thresholds only
router.patch("/:id/thresholds", getInventoryItem, async (req, res) => {
    if (req.body.lowThreshold !== undefined) {
        res.inventoryItem.lowThreshold = Number(req.body.lowThreshold);
    }
    if (req.body.criticalThreshold !== undefined) {
        res.inventoryItem.criticalThreshold = Number(req.body.criticalThreshold);
    }

    // Update the lastUpdated timestamp
    res.inventoryItem.lastUpdated = Date.now();

    try {
        const updatedItem = await res.inventoryItem.save();
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an item
router.delete("/:id", getInventoryItem, async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted", item: res.inventoryItem });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware function to get inventory item by ID
async function getInventoryItem(req, res, next) {
    let item;
    try {
        item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    res.inventoryItem = item;
    next();
}

export default router;