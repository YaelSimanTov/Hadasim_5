///////////////////////////////////////////
//Extract productId from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");

let product = null;

// Fetch product data from server
async function loadProduct() {
  try {
    const response = await fetch(`/api/orderRoutes/productOrder/${productId}`);  

    if (!response.ok) throw new Error("Product not found");

    product = await response.json();
    document.getElementById("product-details").innerHTML = `
    <h2 class="product-title">${product.productName}</h2>
    <div class="detail-item"><span class="label">Supplier:</span> <span class="value">${product.companyName}</span></div>
    <div class="detail-item"><span class="label">Price:</span> <span class="value">$${product.pricePerItem}</span></div>
    <div class="detail-item"><span class="label">Stock Available:</span> <span class="value">${product.stockQuantity}</span></div>
    <div class="detail-item"><span class="label">Minimum Order Quantity:</span> <span class="value">${product.minQuantity}</span></div>
  `;
    } catch (error) {
        alert("Error loading product: " + error.message);
  }
}

window.addEventListener("DOMContentLoaded", loadProduct);

// Function to add the product to the cart
async function addToCart() {
  const quantity = parseInt(document.getElementById("order-quantity").value);

  if (!product) {
    alert("Product not loaded.");
    return;
  }

  // Validate quantity
  if (isNaN(quantity) || quantity < product.minQuantity || quantity > product.stockQuantity) {
    alert(`Quantity must be between ${product.minQuantity} and ${product.stockQuantity}.`);
    return;
  }

  // Create the order object
  const orderItem = {
    productId: product._id,
    productName: product.productName,
    supplierId: product.supplierId,
    supplierName: product.companyName,   
    price: product.pricePerItem,
    quantity: quantity,
    status: "Pending", // Initial status is "Pending"
  };

  // Add the order to the cart (localStorage for now)
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(orderItem);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Add the order to the database (server side)
  await saveOrder(orderItem);

  // Redirect to home page of the owner
  window.location.href = `/ownerHomePage`;
}

// Save the order to the database
async function saveOrder(order) {
  try {
    const response = await fetch(`/api/orderRoutes/createOrd`, {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });

    if (!response.ok) {
      throw new Error("Failed to save the order");
    }

    // localStorage.removeItem("cart");  // Clean the cart

    const savedOrder = await response.json();
    console.log("Order saved successfully:", savedOrder);
    alert("Order placed successfully!"); 
  } catch (error) {
    console.error("Error saving order:", error.message);
    alert("An error occurred while placing the order. Please try again."); // Error message
  }
}


document.getElementById("order-quantity").addEventListener("input", updateTotalPrice);

function updateTotalPrice() {
  const quantity = parseInt(document.getElementById("order-quantity").value);
  const totalPriceEl = document.getElementById("total-price");

  if (!product || isNaN(quantity)) {
    totalPriceEl.textContent = "Total Price: $0";
    return;
  }

  const total = quantity * product.pricePerItem;
  totalPriceEl.textContent = `Total Price: $${total.toFixed(2)}`;
}
