document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the form
    var registrationForm = document.querySelector('form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission
            
            // Retrieve form input values
            var usernameInput = document.getElementById('username');
            var emailInput = document.getElementById('email');
            var passwordInput = document.getElementById('password');
            var confirmPasswordInput = document.getElementById('confirm-password');
            
            // Get values and trim whitespace
            var username = usernameInput.value.trim();
            var email = emailInput.value.trim();
            var password = passwordInput.value.trim();
            var confirmPassword = confirmPasswordInput.value.trim();
            
            // Validate input
            if (username === '' || email === '' || password === '' || confirmPassword === '') {
                alert('Please fill in all fields.');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            // Create user object
            var user = {
                username: username,
                email: email,
                password: password, 
            };
            
            // Send POST request to backend
            fetch('http://localhost:8080/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Registration failed.');
                }
            })
            .then(data => {
                alert('Registration successful!!');
                window.location.href = '../../app/Login/login.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('enter valid username and password');
            });
        });
    } else {
        console.error('Could not find registration form element.');
    }
});
