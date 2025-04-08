// supLogin.js

// Event listener for form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the default form submission

    // Get the values entered by the user
    const phoneNumber = document.getElementById('phoneNumber').value;
    const representativeName = document.getElementById('representativeName').value;

    // Create an object with the login data to send to the server
    const loginData = {
        phoneNumber,
        representativeName
    };

    // Send the login data to the server using Fetch API
    fetch('/api/suppliersRoutes/login-supplier', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Setting the content type as JSON
        },
        body: JSON.stringify(loginData) // Convert the data to JSON format
    })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        if (data.success) {
            alert("Login successful!");
            // window.location.href = '/dashboard';  
            console.error("Login Response:", data)
            localStorage.setItem('supplierId',  data.supplierId);   
            
            window.location.href = `/api/suppliersRoutes/supplierDashboard/${data.supplierId}`;  

        } else {
            document.getElementById('message').innerText = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = "An error occurred. Please try again.";
    });
});
