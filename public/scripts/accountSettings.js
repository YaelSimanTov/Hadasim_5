// Fetch the supplier's products and display them
document.addEventListener('DOMContentLoaded', function () {
    const supplierId = localStorage.getItem('supplierId'); // This should be dynamically set from the session or user data

    
    if (!supplierId) {
        alert("Supplier not logged in.");
        return;
    }
    // Fetch products from the server
    fetch(`/api/suppliersRoutes/${supplierId}/products`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const productList = document.getElementById('product-list');
                data.products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${product.productName}</td>
                        <td>${product.pricePerItem}</td>
                        <td>${product.stockQuantity}</td>
                        <td>${product.minQuantity}</td>

                    `;
                    productList.appendChild(row);
                });
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error fetching products:', error));

    // Handle adding a new product
    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const productName = document.getElementById('new-product-name').value;
        const pricePerItem = document.getElementById('new-product-price').value;
        const stockQuantity = document.getElementById('new-product-quantity').value;
        const minQuantity = document.getElementById('new-product-min-quantity').value;   

        const newProduct = {
            productName,
            pricePerItem,
            stockQuantity,
            minQuantity
        };

        // Send the new product to the server
        fetch(`/api/suppliersRoutes/${supplierId}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Product added successfully!');
                location.reload(); // Reload the page to display the new product
            } else {
                alert('Error adding product: ' + data.message);
            }
        })
        .catch(error => console.error('Error adding product:', error));
    });
});

