const mongoose = require('mongoose');
const Supplier = require('../models/dbSupplier');

const Order = require('../models/dbOrder');

const getProductById = async (req, res) => {
  const { productId } = req.params;
  console.log("Product ID from params:", productId);

  
  //if (!mongoose.Types.ObjectId.isValid(productId)) {
  //return res.status(400).json({ success: false, message: "Invalid product ID" });
  
  try {
    const supplier = await Supplier.findOne({
      "products._id": productId
    });

    if (!supplier) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const product = supplier.products.id(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found in supplier" });
    }
    const productWithSupplierId = {
        ...product.toObject(),
        supplierId: supplier._id
      };
  
      res.json(productWithSupplierId);
  
    // return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
 };

  
  // Save order to the database
  const  createOrder = async (req, res) => {
    const { productId, productName, supplierId, price, quantity, status } = req.body;
    try {
      const newOrder = new Order({
        productId,
        productName,
        supplierId,
        price,
        quantity,
        status
      });
  
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to save order' });
    }
  };



const updateOrderStatus = async (req, res) => {
    try {
      // Find the order by ID
      const order = await Order.findById(req.params.orderId);
      
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      if (order.status !== 'Pending') {
        return res.status(400).json({ error: 'Only pending orders can be updated' });
      }
  
      // Update the status to "In Process"
      order.status = 'In Process';
      await order.save();
      res.json({ status: 'In Process' });
    } catch (err) {
      res.status(500).json({ error: 'Error updating order status' });
    }
 };
  
// פונקציה להחזיר את כל ההזמנות של הספק
const getOrdersBySupplier = async (req, res) => {
    try {
      const supplierId = req.params.supplierId; // מזהה הספק מהנתיב
      const orders = await Order.find({ supplier: supplierId }); // חיפוש הזמנות לפי מזהה הספק
  
      if (!orders) {
        return res.status(404).json({ message: 'No orders found for this supplier.' });
      }
  
      res.render('supOrders',{ id: req.params.supplierId });
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ message: 'Error fetching orders from the database.' });
    }
  };
  
  
module.exports = {getProductById, createOrder, updateOrderStatus, updateOrderStatus, getOrdersBySupplier };
