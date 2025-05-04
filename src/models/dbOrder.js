const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//     productId: mongoose.Schema.Types.ObjectId,
//     productName: String,
//     quantity: Number,
//     price: Number
//   });
  

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  supplierName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'Pending' },  
  date: { type: Date, default: Date.now }  
});




module.exports = mongoose.model('Order', orderSchema);
