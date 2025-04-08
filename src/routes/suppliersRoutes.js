// src/routes/suppliers.js
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supController');


// POST /register
router.post('/register-supplier', supplierController.registerSupplier);

router.post('/login-supplier', supplierController.loginSupplier);

router.get('/:supplierId/products', supplierController.getProducts);

router.post('/:supplierId/products', supplierController.addProduct);

router.get('/owner-home-page', supplierController.ownerHomePage);

router.get('/productsOrder/:id', supplierController.getProductById);
router.get('/productPage',(req,res)=>{
    res.render('productPage');
  })

router.get('/supplierDashboard/:id', (req, res) => {
    res.render('supplierDashboard', { id: req.params.id });
});

router.get('/supOrders/:id',(req,res)=>{
    res.render('supOrders',{ id: req.params.id });
});





router.get('/accountSettings',(req,res)=>{
    res.render('accountSettings');
  })
  

module.exports = router;



 
 