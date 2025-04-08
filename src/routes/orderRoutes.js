const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const supplierController = require('../controllers/supController');
const Supplier = require('../models/dbSupplier');
const mongoose = require('mongoose');

const Order = require('../models/dbOrder');

router.get('/productOrder/:productId', orderController.getProductById);
router.post('/createOrd', orderController.createOrder);

// Define a route to update the order status
router.patch('/:orderId/status', orderController.updateOrderStatus);
router.get('/cart',(req,res)=>{
    res.render('cart');
  })
router.get('/supplierOrders/:supplierId', orderController.getOrdersBySupplier);

module.exports = router;
