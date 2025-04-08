const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  pricePerItem: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  minQuantity: { type: Number, required: true }
});


const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  contactName: { type: String, required: true },
  products: [productSchema]
});

module.exports = mongoose.model('Supplier', supplierSchema);
