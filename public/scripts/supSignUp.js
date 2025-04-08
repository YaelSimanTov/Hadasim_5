// script.js
document.getElementById('add-product').addEventListener('click', function() {
    const productList = document.getElementById('product-list');
    const newProductEntry = document.createElement('div');
    newProductEntry.classList.add('product-entry');
    
    newProductEntry.innerHTML = `
        <input type="text" placeholder="Product Name" class="product-name" required>
        <input type="number" placeholder="Price per Item" class="product-price" required>
        <input type="number" placeholder="Quantity Available" class="product-quantity" required>
        <input type="number" placeholder="Minimum Quantity" class="product-min-quantity" required> <!-- Add minQuantity field -->

    `;
    
    productList.appendChild(newProductEntry);
});

document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const companyName = document.getElementById('company-name').value;
    const contactName = document.getElementById('contact-name').value;
    const phoneNumber = document.getElementById('phone-number').value;
    
    // Collect products
    const products = [];
    const productEntries = document.querySelectorAll('.product-entry');
    
    productEntries.forEach(function(entry) {
        const name = entry.querySelector('.product-name').value;
        const price = entry.querySelector('.product-price').value;
        const quantity = entry.querySelector('.product-quantity').value;
        const minQuantity = entry.querySelector('.product-min-quantity').value;  // Get minQuantity

        products.push({
            productName: name,
            pricePerItem: price,
            stockQuantity: quantity,
            minQuantity: minQuantity  // Add minQuantity field
        });

    });
    
    const supplierData = {
        companyName,
        contactName,
        phoneNumber,
        products
    };
    
    // Send supplier data to server (For example, using Fetch API or AJAX)
    fetch('/api/suppliersRoutes/register-supplier', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(supplierData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration Successful!');
            window.location.href = '';
        } else {
            alert('Registration Failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
