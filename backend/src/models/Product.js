const mongoose = require('mongoose');

// A single sellable option for a product — e.g. "250ml", "500ml", "1L" parfait cups,
// each with its own price/discount/stock so one flavor can sell out in one size
// while still available in another.
const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    inStock: { type: Boolean, default: true },
  },
  { _id: true }
);

variantSchema.pre('validate', function validateDiscount() {
  if (this.discountPrice != null && this.discountPrice >= this.price) {
    throw new Error('discountPrice must be lower than price');
  }
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    variants: {
      type: [variantSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one variant (size/price) is required',
      },
    },
    // Denormalized so "in stock" can still be filtered/sorted in a query —
    // true whenever at least one variant is in stock. Kept in sync in a pre-save hook.
    hasStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre('save', function syncHasStock() {
  this.hasStock = this.variants.some((variant) => variant.inStock);
});

module.exports = mongoose.model('Product', productSchema);
