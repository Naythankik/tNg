// One-off script to create the first admin user.
// Usage: node src/scripts/seedAdmin.js owner@example.com somePassword123
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error('Usage: node src/scripts/seedAdmin.js <email> <password>');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Admin already exists for that email.');
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await Admin.hashPassword(password);
  await Admin.create({ email: email.toLowerCase(), passwordHash });

  console.log(`Admin created for ${email}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
