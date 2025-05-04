const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const supplierController = require('../controllers/supController');
const Supplier = require('../models/dbSupplier');
const mongoose = require('mongoose');

const Order = require('../models/dbOrder');

router.get('/productOrder/:productId', orderController.getProductById);
router.post('/createOrd', orderController.createOrder);


router.get('/cart',(req,res)=>{
    res.render('cart');
  })
router.get('/supplierOrders/:supplierId', orderController.getOrdersBySupplier);

router.get('/supOrders/:supplierId', orderController.getSubOrders);


//Define a route to update the order status
router.patch('/:orderId/status', orderController.updateOrderStatus);

// Route to fetch all orders
router.get('/allOrders', orderController.getAllOrders);

// Route to update the status of an order to 'Completed'
router.patch('/:orderId/complete', orderController.completeOrder);


module.exports = router;
