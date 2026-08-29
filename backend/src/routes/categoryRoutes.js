const express = require('express');
const {
  listCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.get('/', listCategories); // public
router.post('/', requireAuth, createCategory);
router.delete('/:id', requireAuth, deleteCategory);

module.exports = router;
