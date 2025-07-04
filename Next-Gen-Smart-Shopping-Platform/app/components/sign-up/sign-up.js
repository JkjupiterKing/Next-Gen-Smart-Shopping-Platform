document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit");

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    // Retrieve input field data
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const address = document.getElementById("address").value;
    const password = document.getElementById("password").value;

    // Password validation regex (8-12 characters, at least one uppercase, one lowercase, one number, one special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be 8-12 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return; // Prevent form submission if the password doesn't meet the criteria
    }

    // Mobile number validation (only accepts exactly 10 digits)
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      alert("Please enter a valid mobile number.");
      return;
    }

    // Prepare the data to be sent in the POST request
    const userData = {
      username: username,
      email: email,
      password: password,
      address: address,
      phoneNumber: mobile,
    };

    // Make the POST request to the API endpoint
    fetch("http://localhost:8080/users/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response from the server
        alert("User registered successfully!");
        window.location.href = "../login/login.html";
      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch operation
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });
});
