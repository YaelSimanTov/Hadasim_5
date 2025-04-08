function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
  
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalElement.textContent = "Total: $0";
      return;
    }
  
    let total = 0;
    cartItemsContainer.innerHTML = "";
  
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
  
      const itemHTML = `
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
          <h3>${item.productName}</h3>
          <p>Price per item: $${item.price}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Status: ${item.status}</p>
          <p><strong>Item Total: $${itemTotal.toFixed(2)}</strong></p>
          <button onclick="removeItem(${index})">Remove</button>
        </div>
      `;
  
      cartItemsContainer.innerHTML += itemHTML;
    });
  
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
  
  // פונקציה להסרת פריט מהעגלה
  function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); // רענון התצוגה
  }
  
  window.addEventListener("DOMContentLoaded", loadCart);
  