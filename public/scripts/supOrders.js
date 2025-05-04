

document.addEventListener('DOMContentLoaded', loadOrders);

function loadOrders() {
  const supplierId = localStorage.getItem("supplierId");
  const ordersContainer = document.getElementById("orders-container");
  const totalElement = document.getElementById("orders-total");

  console.log("supplierId from localStorage:", supplierId);

  if (!supplierId) {
    console.error("Supplier ID is missing!");
    return;
  }

  fetch(`/api/orderRoutes/supOrders/${supplierId}`)
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Error: ${text}`);
        });
      }
      return response.json();
    })
    .then(orders => {
      console.log("Fetched orders:", orders);
      if (!Array.isArray(orders)) {
        throw new Error("Expected an array of orders, got: " + JSON.stringify(orders));
      }

      if (orders.length === 0) {
        ordersContainer.innerHTML = "<p>You have no orders.</p>";
        totalElement.textContent = "Total: $0";
        return;
      }

      let total = 0;
      ordersContainer.innerHTML = "";

      const statuses = ["Pending", "In Process", "Completed"];

      statuses.forEach(status => {
        const filteredOrders = orders.filter(order => order.status === status);
        if (filteredOrders.length === 0) return;

        const section = document.createElement("div");
        section.innerHTML = `<h3>${status}</h3>`;

        filteredOrders.forEach((order) => {
          const itemTotal = order.price * order.quantity;
          total += itemTotal;

          const orderDiv = document.createElement("div");
          orderDiv.className = `order-box ${getStatusClass(order.status)}`;

          orderDiv.innerHTML = `
            <h3>${order.productName}</h3>
            <p>Price per item: $${order.price}</p>
            <p>Quantity: ${order.quantity}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Item Total: $${itemTotal.toFixed(2)}</strong></p>
            ${order.status === "Pending" ? 
              `<button onclick="updateStatus('${order._id}')">Mark as In Process</button>` : ""}
          `;

          section.appendChild(orderDiv);
        });

        ordersContainer.appendChild(section);
      });

      totalElement.textContent = `Total: $${total.toFixed(2)}`;
    })
    .catch(error => {
      console.error('Error fetching orders:', error);
      ordersContainer.innerHTML = "<p>Error loading orders. Please try again later.</p>";
    });
}

function updateStatus(orderId) {
  fetch(`/api/orderRoutes/${orderId}/status`, {
    method: 'PATCH',
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'In Process') {
        alert('Order status updated to In Process.');
        loadOrders();
      } else {
        alert('Failed to update status.');
      }
    })
    .catch(error => {
      console.error('Error updating status:', error);
      alert('Error updating status.');
    });
}

function getStatusClass(status) {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "In Process":
      return "status-in-process";
    case "Completed":
      return "status-completed";
    default:
      return "";
  }
}
