const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//     productId: mongoose.Schema.Types.ObjectId,
//     productName: String,
//     quantity: Number,
//     price: Number
//   });
  
// const OrderSchema = new mongoose.Schema({
//   supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
//   supplierName: String,
//   items: [orderItemSchema],
//   status: { type: String, enum: ['new', 'in_process', 'completed'], default: 'new' },
//   orderDate: { type: Date, default: Date.now }
// });

const orderSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  supplierName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // סטטוס ההזמנה (ממתינה, הושלמה, וכו')
  date: { type: Date, default: Date.now } // זמן יצירת ההזמנה
});




module.exports = mongoose.model('Order', orderSchema);
