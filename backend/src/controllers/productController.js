const Product = require('../models/Product');
const OrderInquiry = require('../models/OrderInquiry');
const { cloudinary } = require('../config/cloudinary');

// Variants arrive as a JSON string in multipart form bodies (multer can't parse
// nested arrays), so normalize whether they came from JSON or form-data.
function parseVariants(raw) {
  if (raw == null) return undefined;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!Array.isArray(parsed)) throw new Error('variants must be an array');
  return parsed.map((v) => ({
    label: v.label,
    price: Number(v.price),
    discountPrice: v.discountPrice === '' || v.discountPrice == null ? null : Number(v.discountPrice),
    inStock: v.inStock === undefined ? true : v.inStock === 'true' || v.inStock === true,
  }));
}

// Public: list products, optionally filtered by category and stock status.
async function listProducts(req, res, next) {
  try {
    const { category, inStock } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (inStock !== undefined) filter.hasStock = inStock === 'true';

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

// Admin: create product. Expects multipart/form-data with `images` files and a
// `variants` field holding a JSON string of [{ label, price, discountPrice, inStock }].
async function createProduct(req, res, next) {
  try {
    const { title, description, category } = req.body;
    const variants = parseVariants(req.body.variants);
    const images = (req.files || []).map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const product = await Product.create({ title, description, category, variants, images });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { title, description, category } = req.body;
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (req.body.variants !== undefined) product.variants = parseVariants(req.body.variants);

    if (req.files && req.files.length > 0) {
      // Replacing images: drop the old ones from Cloudinary first.
      await Promise.all(
        product.images.map((img) => cloudinary.uploader.destroy(img.publicId).catch(() => null))
      );
      product.images = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
    }

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// Admin: toggle a single variant's stock status (e.g. the 250ml sells out, 500ml stays available).
async function toggleVariantStock(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const variant = product.variants.id(req.params.variantId);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });

    variant.inStock = !variant.inStock;
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

    const { variantId, customerContact } = req.body;
    const variant = variantId ? product.variants.id(variantId) : product.variants[0];

    const inquiry = await OrderInquiry.create({
      product: product._id,
      productTitleSnapshot: product.title,
      variantLabelSnapshot: variant?.label || '',
      priceSnapshot: variant ? variant.discountPrice ?? variant.price : 0,
      customerContact: customerContact || '',
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
  toggleVariantStock,
  deleteProduct,
  logOrderInquiry,
};
