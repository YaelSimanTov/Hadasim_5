const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const Supplier = require('./models/dbSupplier');

const Order = require('./models/dbOrder');

//-----------------Importing Routes-----------------//
const suppliersRoutes = require('./routes/suppliersRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
  secret: 'secretkey123',         
  resave: false,                    
  saveUninitialized: true,          
  cookie: { secure: false }        
}));


// Default route - send index.html
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'homePage.html'));
// });

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.set('view engine', 'ejs')

app.get('/', (req,res) => {
  res.render('homePage');
});

// MongoDB connection
mongoose.connect('mongodb+srv://yaelsym123:325181295@cluster0.wy1t3au.mongodb.net/')  
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch(err => console.log(err));

//-----------------Routes-----------------//
app.use('/api/suppliersRoutes', suppliersRoutes);
app.use('/api/orderRoutes', orderRoutes);

app.get('/register-supplier', (req, res) => {
  res.render('supSignUp');
});

app.get('/login-supplier', (req, res) => {
  res.render('supplierLogin');
});

app.get('/ownerHomePage',(req,res)=>{
  res.render('ownerHomePage');
});


 

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
