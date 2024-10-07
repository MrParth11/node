const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false
  },
  maincategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCet', // Ensure this matches your main category model
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cet',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCet', // Ensure this matches your subcategory model
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    sizes: [String],
    sizeCounts: [Number]
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  images: [
    {
      url: {
        type: String,
        required: true
      }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Check if the model already exists to avoid overwriting
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
