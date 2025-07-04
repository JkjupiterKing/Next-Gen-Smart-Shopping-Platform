import { includeHeader } from "../header/header.js";

includeHeader("../header/header.html");

document.addEventListener("DOMContentLoaded", function () {
  // Fetch user details from local storage
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  if (userDetails) {
    // Populate the profile with user details
    document.getElementById("userName").textContent =
      userDetails.username || "User";
    document.getElementById("userEmail").textContent =
      userDetails.email || "Email not set";
    document.getElementById("userPhone").textContent =
      userDetails.phoneNumber || "Phone not set";
    document.getElementById("userAddress").textContent =
      userDetails.address || "Address not set";
    document.getElementById("userUsername").textContent =
      userDetails.username || "Username not set";
    document.getElementById("userPassword").textContent = "******";
  }

  // Handle the update button click
  const updateButton = document.getElementById("updateButton");
  updateButton.addEventListener("click", function () {
    // Populate modal fields with current user details
    document.getElementById("updateUsername").value =
      userDetails.username || "";
    document.getElementById("updateEmail").value = userDetails.email || "";
    document.getElementById("updatePhone").value =
      userDetails.phoneNumber || "";
    document.getElementById("updateAddress").value = userDetails.address || "";
    document.getElementById("updatePassword").value = "";

    // Show the modal
    const updateModal = new bootstrap.Modal(
      document.getElementById("updateModal")
    );
    updateModal.show();
  });

  // Handle form submission for updating details
  document
    .getElementById("updateForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get updated values
      const updatedUsername = document.getElementById("updateUsername").value;
      const updatedEmail = document.getElementById("updateEmail").value;
      const updatedPhone = document.getElementById("updatePhone").value;
      const updatedAddress = document.getElementById("updateAddress").value;
      const updatedPassword = document.getElementById("updatePassword").value;

      // Prepare data for the update
      const updatedUserDetails = {
        username: updatedUsername,
        email: updatedEmail,
        phoneNumber: updatedPhone,
        address: updatedAddress,
        // Include password only if it is provided
        ...(updatedPassword && { password: updatedPassword }),
      };

      // Send updated data to API
      fetch(`http://localhost:8080/users/${userDetails.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserDetails),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          alert("User updated successfully!");
          // Update local storage
          localStorage.setItem(
            "userDetails",
            JSON.stringify({
              ...userDetails,
              ...updatedUserDetails,
            })
          );
          localStorage.removeItem("username");
          // Update local storage with the new username
          localStorage.setItem("username", updatedUsername);

          // Update displayed values
          document.getElementById("userEmail").textContent = updatedEmail;
          document.getElementById("userPhone").textContent = updatedPhone;
          document.getElementById("userAddress").textContent = updatedAddress;
          document.getElementById("userUsername").textContent = updatedUsername;
          window.location.reload();
          // Close the modal
          const updateModal = bootstrap.Modal.getInstance(
            document.getElementById("updateModal")
          );
          updateModal.hide();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
        });
    });
});
