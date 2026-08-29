const mongoose = require('mongoose');

// Lightweight log of "Order via WhatsApp" clicks, for tracking interest/conversion.
const orderInquirySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productTitleSnapshot: { type: String, required: true },
    variantLabelSnapshot: { type: String, default: '' },
    priceSnapshot: { type: Number, required: true },
    customerContact: { type: String, default: '' }, // optional, if ever captured
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrderInquiry', orderInquirySchema);
