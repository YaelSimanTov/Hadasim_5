
// scripts/ownerHomePage.js

document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/suppliersRoutes/owner-home-page')  // Assuming the backend route is /api/products
    .then(res => res.json())
    .then(data => {
      if (!data.success) throw new Error("Failed to load products");
      const container = document.getElementById('products');
      data.products.forEach((product, index) => {
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img class="product-image" src="/productImage.png" alt="Product">
          <div class="product-title">${product.productName}</div>
          <div class="product-description">Available Stock: ${product.stockQuantity}, Minimum Order Quantity: ${product.minQuantity}</div>
          <div class="product-price">$${product.pricePerItem}</div>
          <button class="order-button" onclick="orderProduct('${product._id}')">Order Now</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error loading products:", err);
    });
});

function orderProduct(productId) {
  
  alert(`Ordering product #${productId + 1}`);
  if (productId) {
    window.location.href = `/api/suppliersRoutes/productPage?productId=${productId}`;
  } else {
    console.error("Invalid product ID");
  }
}

function searchProduct() {
  const searchTerm = document.getElementById('search-input').value;
  console.log("Searching for product: ", searchTerm);
}
// <button class="order-button" onclick="orderProduct(${index})">Order Now</button>
