document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit");
  const otpContainer = document.getElementById("otp-container");
  const verifyOtpButton = document.getElementById("verifyOtpButton");
  const otpInput = document.getElementById("otpInput");
  const otpMessage = document.getElementById("otpMessage");

  let Forgotemail = ""; // Declare this variable globally within the script to be used in both sections
  let newPassword = ""; // Similarly, declare the newPassword globally

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    // Retrieve input field data
    const username = document.getElementById("Email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Make the GET request to the API endpoint to fetch user by email
    fetch(`http://localhost:8080/users/email/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((user) => {
        if (user && user.email) {
          // Verify the password (assuming it's stored in base64 encoded form)
          const decodedPassword = atob(user.password); // Decode the password if it's encoded in base64

          if (password === decodedPassword) {
            // Password verified, now send OTP
            sendOtpToUser(user.email);

            otpContainer.style.display = "block"; // Ensure otpContainer is shown

            // Store user details for later OTP verification
            localStorage.setItem("userDetails", JSON.stringify(user));
            localStorage.setItem("username", JSON.stringify(user.username));
          } else {
            alert("Invalid password.");
          }
        } else {
          alert("User not found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });

  // Function to send OTP to the user's email
  function sendOtpToUser(email) {
    fetch(`http://localhost:8080/otp/send?email=${email}`, {
      method: "POST", // POST request to send OTP
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((message) => {
        alert(message); // Show OTP sent message
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to send OTP. Please try again.");
      });
  }

  // Handle OTP verification
  verifyOtpButton.addEventListener("click", function () {
    const otp = otpInput.value.trim();
    const user = JSON.parse(localStorage.getItem("userDetails"));

    if (!otp) {
      otpMessage.textContent = "Please enter the OTP.";
      return;
    }

    // Make a request to the API to verify the OTP
    fetch(`http://localhost:8080/otp/verify?email=${user.email}&otp=${otp}`, {
      method: "POST", // POST request to verify OTP
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.text())
      .then((message) => {
        if (message === "OTP verified successfully") {
          otpMessage.textContent = "";
          localStorage.setItem("loginMessage", "Login successful!");
          window.location.href = "/app/index.html";
        } else {
          otpMessage.textContent = message; // Show OTP verification error message
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        otpMessage.textContent = "An error occurred. Please try again.";
      });
  });

  // Forgot password modal logic
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

      // Get the email and new password entered by the user
      Forgotemail = document.getElementById("email").value.trim();
      newPassword = document.getElementById("newPassword").value.trim();

      // Ensure both fields are filled
      if (!Forgotemail || !newPassword) {
        alert("Please enter both email and new password.");
        return;
      }

      // Validate the password
      if (!validatePassword(newPassword)) {
        alert(
          "Password must be between 8-12 characters, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
        return; // Prevent submission if password is invalid
      }

      // Send OTP first before resetting the password
      sendOtpToUser(Forgotemail);

      // Show OTP input for verification
      const otpContainer = document.getElementById("forgotOtp-container");
      otpContainer.style.display = "block";
    });

  // Handle OTP verification for forgot password
  document
    .getElementById("forgotVerifyOtpButton")
    .addEventListener("click", function () {
      const otp = document.getElementById("forgotOtpInput").value.trim();

      if (!otp) {
        document.getElementById("forgotOtpMessage").textContent =
          "Please enter the OTP.";
        return;
      }

      // Verify OTP
      fetch(
        `http://localhost:8080/otp/verify?email=${Forgotemail}&otp=${otp}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.text())
        .then((message) => {
          if (message === "OTP verified successfully") {
            // OTP verified, proceed with resetting password
            fetch(
              `http://localhost:8080/users/reset-password?email=${encodeURIComponent(
                Forgotemail
              )}&newPassword=${encodeURIComponent(newPassword)}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
              .then((response) => {
                if (response.ok) {
                  alert("Password has been reset successfully.");
                  modal.hide();
                } else {
                  alert("Failed to reset password. Please try again.");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
                alert("Failed to reset password. Please try again.");
              });
          } else {
            document.getElementById("forgotOtpMessage").textContent = message;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          document.getElementById("forgotOtpMessage").textContent =
            "An error occurred. Please try again.";
        });
    });

  // Password validation function
  function validatePassword(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    return passwordRegex.test(password);
  }
});
