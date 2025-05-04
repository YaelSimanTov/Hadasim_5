
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
          <div class="detail-item"><span class="label">Supplier:</span> <span class="value">${product.companyName}</span></div>
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

function searchBySupplier() {
  const searchTerm = document.getElementById('search-input').value;

  fetch(`/api/suppliersRoutes/search?supplier=${encodeURIComponent(searchTerm)}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('products');
      container.innerHTML = ''; // Clear previous results

      if (data.products.length === 0) {
        container.innerHTML = '<p>No products found for the given supplier name.</p>';
        return;
      }

      data.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img class="product-image" src="/productImage.png" alt="Product">
          <div class="product-title">${product.productName}</div>
          <div class="detail-item"><span class="label">Supplier:</span> <span class="value">${product.companyName}</span></div>
          <div class="product-description">Available Stock: ${product.stockQuantity}, Minimum Order Quantity: ${product.minQuantity}</div>
          <div class="product-price">$${product.pricePerItem}</div>
          <button class="order-button" onclick="orderProduct('${product._id}')">Order Now</button>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error during search:", err);
    });
}
