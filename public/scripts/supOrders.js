// document.addEventListener('DOMContentLoaded', function () {
//   const supplierId = localStorage.getItem('supplierId'); // This should be dynamically set from the session or user data
//   console.log("supplierId:", supplierId); // <<=== כאן תראי אם הוא undefined

  
//   if (!supplierId) {
//       alert("Supplier not logged in.");
//       return;
//   }
//   // Fetch products from the server
//   fetch(`/api/suppliersRoutes/${supplierId}/supplierOrders`)
//       .then(response => response.json())
//       .then(data => {
//           if (data.success) {
//             const supplierId = localStorage.getItem("supplierId"); // מזהה הספק
//             const ordersContainer = document.getElementById("orders-container");
//             const totalElement = document.getElementById("orders-total");
 
// const urlParams = new URLSearchParams(window.location.search);
// const supplierId = urlParams.get("supplierId");

// //let product = null;
// //supOrders.js 

document.addEventListener('DOMContentLoaded', loadOrders); // נטען כשהמסמך מוכן
function loadOrders()
   {
    const supplierId = localStorage.getItem("supplierId"); // מזהה הספק
    const ordersContainer = document.getElementById("orders-container");
    const totalElement = document.getElementById("orders-total");
    //console.error(`Supplier ID is missing!`);
    console.log(supplierId); // הדפסת הערך של supplierId לצורך בדיקה

    if (!supplierId) {
      console.error("Supplier ID is missing!");
      return;
    }

    // שליחת בקשה ל-API
    fetch(`/api/suppliersRoutes/supOrders/${supplierId}`)
      .then(response => {
        if (!response.ok) {
            // אם הסטטוס לא תקין, חזור עם שגיאה
          return response.text().then(text => {
              throw new Error(`Error: ${text}`);
          });
        }
        return response.json(); // אם התשובה תקינה, החזר כ-JSON
      })
      .then(orders => {
        if (orders.length === 0) {
          ordersContainer.innerHTML = "<p>You have no orders.</p>";
          totalElement.textContent = "Total: $0";
          return;
        }

        let total = 0;
        ordersContainer.innerHTML = "";

        orders.forEach((order) => {
          const itemTotal = order.price * order.quantity;
          total += itemTotal;

          const orderHTML = `
            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
              <h3>${order.productName}</h3>
              <p>Price per item: $${order.price}</p>
              <p>Quantity: ${order.quantity}</p>
              <p>Status: ${order.status}</p>
              <p><strong>Item Total: $${itemTotal.toFixed(2)}</strong></p>
              ${order.status === "Pending" ? 
                `<button onclick="updateStatus('${order._id}')">Mark as In Process</button>` : ""}
            </div>
          `;

          ordersContainer.innerHTML += orderHTML;
        });

        totalElement.textContent = `Total: $${total.toFixed(2)}`;
      })
      .catch(error => {
        //console.error('Error fetching orders:', error);
        ordersContainer.innerHTML = "<p>Error loading orders. Please try again later.</p>";
      });
  }


  // עדכון סטטוס הזמנה
  function updateStatus(orderId) {
    fetch(`/api/orderRoutes/${orderId}/status`, {
      method: 'PATCH',
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'In Process') {
          alert('Order status updated to In Process.');
          loadOrders(); // טוען מחדש את ההזמנות לאחר השינוי
        } else {
          alert('Failed to update status.');
        }
      })
      .catch(error => {
        console.error('Error updating status:', error);
        alert('Error updating status.');
      });
  }

  window.addEventListener("DOMContentLoaded", loadOrders);
