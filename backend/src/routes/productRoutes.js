const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  toggleStock,
  deleteProduct,
  logOrderInquiry,
} = require('../controllers/productController');
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public
router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/:id/inquiries', logOrderInquiry);

// Admin (protected)
router.post('/', requireAuth, upload.array('images', 5), createProduct);
router.patch('/:id', requireAuth, upload.array('images', 5), updateProduct);
router.patch('/:id/toggle-stock', requireAuth, toggleStock);
router.delete('/:id', requireAuth, deleteProduct);

module.exports = router;
