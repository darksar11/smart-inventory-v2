import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        default: '' 
    },
    quantity: { 
        type: Number, 
        required: true,
        default: 0 
    },
    unitValue: { 
        type: Number, 
        required: true 
    },
    lowThreshold: { 
        type: Number, 
        default: 10 
    },
    criticalThreshold: { 
        type: Number, 
        default: 5 
    },
    sku: { 
        type: String, 
        default: '' 
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
productSchema.virtual('productName').get(function() {
    return this.name;
});

// Virtual for price to maintain backward compatibility with UI
productSchema.virtual('price').get(function() {
    return this.unitValue;
});

// Virtual for calculating total value
productSchema.virtual('totalValue').get(function() {
    return this.quantity * this.unitValue;
});

// Pre-save hook to ensure lastUpdated is set
productSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

// Explicitly specify the collection name to ensure data is saved to 'products'
const Product = mongoose.model("Product", productSchema, 'products');

export default Product;