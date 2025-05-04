
async function loadAllOrders() {
  const totalElement = document.getElementById("cart-total");

  try {
    const response = await fetch("/api/orderRoutes/allOrders");
    if (!response.ok) throw new Error("Failed to fetch orders");
    const allOrders = await response.json();     

    let total = 0;
    const container = document.getElementById("orders-container");
    container.innerHTML = "";

    const statuses = ["Pending", "In Process", "Completed"];

    statuses.forEach(status => {
      const filtered = allOrders.filter(order => order.status === status);
      if (filtered.length === 0) return;

      const section = document.createElement("div");
      section.innerHTML = `<h3>${translateStatus(status)}</h3>`;

      filtered.forEach(order => {
        const itemTotal = order.price * order.quantity;
        total += itemTotal;

        const orderDiv = document.createElement("div");
        // orderDiv.className = "order-box";
        orderDiv.className = `order-box ${getStatusClass(order.status)}`;

        // const itemTotal = order.price && order.quantity
        //   ? (order.price * order.quantity).toFixed(2)
        //   : null;

        orderDiv.innerHTML = `
          <p><strong>Product:</strong> ${order.productName}</p>
          ${order.supplierName ? `<p><strong>Supplier:</strong> ${order.supplierName}</p>` : ""}
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          ${itemTotal ? `<p><strong>Total:</strong> $${itemTotal}</p>` : ""}
          ${
            status === "In Process"
              ? `<button onclick="confirmReceived('${order._id}')">Update to Completed</button>`
              : ""
            // status === "In Process"
            //   ? `<button onclick="updateOrderStatus('${order._id}', 'Completed')">Update to Completed</button>`
            // : ""

          }
        `;

        section.appendChild(orderDiv);
      });

      container.appendChild(section);
    });
    totalElement.textContent = `Total: $${total.toFixed(2)}`;

  } catch (error) {
    console.error("Error loading orders:", error);
    alert("Error loading orders");
  }
}


/* <p><strong>Status:</strong> ${translateStatus(order.status)}</p> */

async function confirmReceived(orderId) {
  try {
    const response = await fetch(`/api/orderRoutes/${orderId}/complete`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to update order");

    alert("Order marked as completed");
    loadAllOrders();
  } catch (error) {
    console.error("Error confirming receipt:", error);
    alert("Error updating order");
  }
}


function translateStatus(status) {
  switch (status) {
    case "Pending":
      return "Pending";
    case "In Process":
      return "In Process";
    case "Completed":
      return "Completed";
    default:
      return status;
  }
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

window.addEventListener("DOMContentLoaded", loadAllOrders);




/* <p class="status-cell ${getStatusClass(order.status)}">
  <strong>Status:</strong> ${translateStatus(order.status)}
</p> */
