document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Retrieve username and password input values
      var usernameInput = document.getElementById("username");
      var passwordInput = document.getElementById("password");

      // Check if username and password are not empty
      var username = usernameInput.value.trim();
      var password = passwordInput.value.trim();

      if (username !== "" && password !== "") {
        fetch(`http://localhost:8080/getUserByUsername/${username}`)
          .then((response) => response.json())
          .then((data) => {
            if (data && data.password) {
              var decodedPassword = atob(data.password);
              if (decodedPassword === password) {
                window.location.href = "../../app/dashboard/dashboard.html";
              } else {
                alert("Invalid username or password.");
              }
            } else {
              alert("User not found.");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            alert("Please enter valid username and password.");
          });
      } else {
        alert("Please enter both username and password.");
      }
    });
  } else {
    console.error("Could not find loginForm element.");
  }

  const forgotPasswordLink = document.querySelector(".forgot-password-link");
  const modal = new bootstrap.Modal(
    document.getElementById("forgotPasswordModal")
  );

  forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault();
    modal.show();
  });

  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get the username and new password entered by the user
      var username = document.getElementById("Username").value.trim();
      var newPassword = document.getElementById("newPassword").value.trim();

      // Ensure both fields are filled
      if (!username || !newPassword) {
        alert("Please enter both username and new password.");
        return;
      }

      // Send a request to your backend API to handle password reset
      var resetPasswordUrl = "http://localhost:8080/reset-password";
      fetch(resetPasswordUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: newPassword }),
      })
        .then((response) => {
          if (response.status === 404) {
            alert(
              "Username not found in the system, please enter a valid username."
            );
          } else if (response.ok) {
            alert(
              "Password has been reset. Please login using the new password."
            );
            modal.hide();
          } else {
            alert("Failed to reset password. Please try again.");
            modal.hide();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to reset password. Please try again.");
        });
    });
});
