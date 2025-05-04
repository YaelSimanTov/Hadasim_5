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
        supplierId: supplier._id,
        companyName:supplier.companyName
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
  const { productId, productName, supplierId, supplierName, price, quantity, status } = req.body;
  try {
    // Find the supplier by ID
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });

    // Find the product within the supplier's products array
    const product = supplier.products.id(productId);
    if (!product) return res.status(404).json({ message: "Product not found in supplier" });

    // Check if there is enough stock available
    if (quantity > product.stockQuantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Reduce the stock quantity immediately (Approach 1)
    product.stockQuantity -= quantity;

    // Save the updated supplier (to persist the stock change)
    await supplier.save();

    
    const newOrder = new Order({
      productId,
      productName,
      supplierId,
      supplierName,
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



  
const getOrdersBySupplier = async (req, res) => {
    try {
      const supplierId = req.params.supplierId;   
      const orders = await Order.find({ supplier: supplierId });  
  
      if (!orders) {
        return res.status(404).json({ message: 'No orders found for this supplier.' });
      }
  
      res.render('supOrders',{ id: req.params.supplierId });
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ message: 'Error fetching orders from the database.' });
    }
  };

const getSubOrders = async (req, res) => {
    try {
      const supplierId = new mongoose.Types.ObjectId(req.params.supplierId);
      // const supplierId = req.params.supplierId;
      const orders = await Order.find({supplierId});
      res.json(orders);  // return array  
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ message: 'Error fetching orders from the database.' });
    }
};
  


//Update order status to 'In Process'
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'In Process' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Controller to get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.json(orders); // Send orders as JSON response
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Controller to mark an order as 'Completed'
const completeOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Completed' },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updatedOrder); // Return the updated order
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};


  
  
module.exports = {getProductById, createOrder, getOrdersBySupplier, getSubOrders, updateOrderStatus, getAllOrders, completeOrder };
