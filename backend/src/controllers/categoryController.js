const Category = require('../models/Category');

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory, deleteCategory };
