const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

function signToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await admin.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(admin);
    res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const admin = await Admin.findById(req.admin.sub).select('-passwordHash');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    next(err);
  }
}

module.exports = { login, me };
