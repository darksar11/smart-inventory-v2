import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    unitValue: { 
        type: Number, 
        required: true 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    // Add virtuals when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for productName to maintain backward compatibility with UI
inventorySchema.virtual('productName').get(function() {
    return this.name;
});

// Virtual for price to maintain backward compatibility with UI
inventorySchema.virtual('price').get(function() {
    return this.unitValue;
});

// Explicitly specify collection name to ensure data is saved to 'inventories'
const Inventory = mongoose.model("Inventory", inventorySchema, 'inventories');

export default Inventory;