const Product = require('../models/Product');
const OrderInquiry = require('../models/OrderInquiry');
const { cloudinary } = require('../config/cloudinary');

// Public: list products, optionally filtered by category and stock status.
async function listProducts(req, res, next) {
  try {
    const { category, inStock } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === 'true';

    const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// Admin: create product. Expects multipart/form-data with `images` files (via multer/Cloudinary).
async function createProduct(req, res, next) {
  try {
    const { title, description, price, size, category, inStock } = req.body;
    const images = (req.files || []).map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const product = await Product.create({
      title,
      description,
      price,
      size,
      category,
      inStock: inStock === undefined ? true : inStock === 'true' || inStock === true,
      images,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function toggleStock(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.inStock = !product.inStock;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await Promise.all(
      product.images.map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => null))
    );

    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}

// Public: log an "Order via WhatsApp" click for interest/conversion tracking.
async function logOrderInquiry(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const inquiry = await OrderInquiry.create({
      product: product._id,
      productTitleSnapshot: product.title,
      priceSnapshot: product.price,
      customerContact: req.body.customerContact || '',
    });

    res.status(201).json(inquiry);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  toggleStock,
  deleteProduct,
  logOrderInquiry,
};
