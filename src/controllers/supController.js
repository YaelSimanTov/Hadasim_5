// controllers/supController.js
const Supplier = require('../models/dbSupplier');
const mongoose = require('mongoose');



const registerSupplier = async (req, res) => {
    try {
      const { contactName, phoneNumber } = req.body;

      // Check if supplier already exists
      const existingSupplier = await Supplier.findOne({ contactName, phoneNumber });
  
      if (existingSupplier) {
        return res.status(400).json({ 
          success: false, 
          message: 'Looks like you’re already registered! Please log in to your account.'
        });
      }
    
      const newSupplier = new Supplier(req.body);
      await newSupplier.save();
      res.status(201).json({ success: true, supplier: newSupplier });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
  };
  
 
const loginSupplier = async (req, res) => {
    const { phoneNumber, representativeName } = req.body;
  
    try {
      // Search for the supplier in the database by phone number and representative name
      const supplier = await Supplier.findOne({ phoneNumber, contactName: representativeName });
  
      if (!supplier) {
        return res.status(400).json({ success: false, message: "Invalid phone number or representative name." });
      }
      req.session.supplierId = supplier._id;  
      res.json({ success: true, message: "Login successful!", supplierId: supplier._id });
  
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ success: false, message: "Server error during login." });
    }

  };
  

// Fetch products for a specific supplier
const getProducts = async (req, res) => {
    const supplierId = req.session?.supplierId;

    // const supplierId = req.params.supplierId;
    if (!supplierId) {
        return res.status(401).json({ success: false, message: "Not authorized. Please log in first." });
    }

    try {
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found.' });
        }

        res.json({ success: true, products: supplier.products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
 };
  
// Add a new product for the supplier
const addProduct = async (req, res) => {
    const supplierId = req.session?.supplierId;

    // const supplierId = req.params.supplierId;
    const { productName, pricePerItem, stockQuantity, minQuantity } = req.body;
    if (!supplierId || !mongoose.Types.ObjectId.isValid(supplierId)) {
        return res.status(400).json({ success: false, message: "Invalid supplier ID in session." });
    }

    try {
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) {
            return res.status(404).json({ success: false, message: 'Supplier not found.' });
        }
        const newProduct = {
            productName,
            pricePerItem,
            stockQuantity,
            minQuantity
        };
        supplier.products.push(newProduct);
        await supplier.save();
        res.json({ success: true, message: 'Product added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error adding product.' });
    }
 };

  
  // Route to fetch all products from all suppliers
  
const ownerHomePage = async (req, res) => {
  try {
        const suppliers = await Supplier.find();
        // const allProducts = suppliers.flatMap(supplier => supplier.products);
        const allProducts = [];

        suppliers.forEach(supplier => {
          supplier.products.forEach(product => {
            //add supplier name to each product
            allProducts.push({
              ...product.toObject(),        
              companyName: supplier.companyName
            });
          });
        });
    
  
      res.json({ success: true, products: allProducts });
      // res.render('ownerHomePage', { products: allProducts });
  } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ success: false, message: 'Server error fetching products.' });
  }
};

const goOwnerPage= async (req , res) => {
  try {
        const suppliers = await Supplier.find();
        const allProducts = suppliers.flatMap(supplier => supplier.products);
        res.render('ownerHomePage', { products: allProducts });

  } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ success: false, message: 'Server error fetching products.' });
  }
};


// Get product by ID (searches all suppliers)
// const getProductById = async (req, res) => {
//     try {
//         const suppliers = await Supplier.find();
//         const productId = req.params.productId;

//         let foundProduct = null;

//         suppliers.forEach(supplier => {
//             const product = supplier.products.id(productId);
//             if (product) {
//             foundProduct = {
//                 ...product.toObject(),
//                 supplier: supplier.companyName
//             };
//             }
//         });

//         if (!foundProduct) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.json(foundProduct);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
//   };

 
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find a supplier that has a product with the given ID
    const supplier = await Supplier.findOne({ "products._id": productId });

    if (!supplier) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the specific product from the supplier
    const product = supplier.products.id(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found in supplier" });
    }

    res.json({
      id: product._id,
      productName: product.productName,
      pricePerItem: product.pricePerItem,
      minQuantity: product.minQuantity,
      supplier: supplier.companyName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getProductsBySupName = async (req, res) => {

  const searchTerm = req.query.supplier;

  if (!searchTerm) return res.status(400).json({ message: 'Supplier name is required' });

  try {
    const matchingSuppliers = await Supplier.find({
      companyName: { $regex: new RegExp(searchTerm, 'i') } // case-insensitive search
    });

    const products = [];

    // Flatten all products from all matching suppliers
    matchingSuppliers.forEach(supplier => {
      supplier.products.forEach(prod => {
        products.push({
          ...prod.toObject(),  // Convert subdocument to plain object
          companyName: supplier.companyName  // Add supplier name to each product
        });
      });
    });

    res.json({ products });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
  };

module.exports = { registerSupplier, loginSupplier, getProducts, addProduct, ownerHomePage, getProductById, goOwnerPage, getProductsBySupName };

 