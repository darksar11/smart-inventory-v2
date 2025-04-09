import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  lowThreshold: {
    type: Number,
    required: true,
    default: 5
  },
  criticalThreshold: {
    type: Number,
    required: true,
    default: 2
  },
  unitValue: {
    type: Number,
    required: true,
    default: 0
  },
  sku: {
    type: String,
    trim: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the 'updatedAt' field on save
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total value
ProductSchema.virtual('totalValue').get(function() {
  return this.quantity * this.unitValue;
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;