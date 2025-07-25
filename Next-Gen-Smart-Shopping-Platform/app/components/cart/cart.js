import { includeHeader } from "../header/header.js";
includeHeader("../header/header.html");

document.addEventListener("DOMContentLoaded", function () {
  // Function to toggle payment method fields based on selected option
  function togglePaymentMethodFields() {
    const paymentMethod = document.getElementById("payment-method").value;

    // Hide all payment options first
    document.getElementById("cash-on-delivery").style.display = "none";
    document.getElementById("upi-payment").style.display = "none";
    document.getElementById("card-payment").style.display = "none";

    // Show the appropriate section based on selected payment method
    if (paymentMethod === "Cash") {
      document.getElementById("cash-on-delivery").style.display = "block";
    } else if (paymentMethod === "UPI") {
      document.getElementById("upi-payment").style.display = "block";
    } else if (paymentMethod === "Card") {
      document.getElementById("card-payment").style.display = "block";
    }
  }

  function renderCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartItemsContainer = document.getElementById("product-details");
    if (!cartItemsContainer) {
      console.error("Product details container not found");
      return;
    }
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = "<p>Cart is Empty</p>";
      hidePlaceOrderButton();
      return;
    } else {
      checkLoginStatus();
    }

    let totalPrice = 0;

    cartItems.forEach((item) => {
      const itemName = item.title || "Unnamed Product";
      const itemDescription = item.description || "No description available";
      const itemPrice = item.price !== undefined ? item.price : 0;
      totalPrice += itemPrice;

      const itemRating =
        item.rating !== undefined
          ? `Rating: ${item.rating}`
          : "Rating not available";

      // ✅ Convert Base64 image string into image src
      const itemImage = item.image
        ? `data:image/jpeg;base64,${item.image}`
        : "placeholder.jpg"; // You can replace this with your own placeholder image path

      const cartItemHTML = `
      <div class="card mb-3">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${itemImage}" class="card-img" alt="${itemName}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${itemName}</h5>
              <p class="card-text">${itemDescription}</p>
              <p class="card-text1">Price: ${itemPrice}</p>
              <button class="btn btn-danger remove-from-cart" data-product-id="${item.id}">Remove from Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
      cartItemsContainer.innerHTML += cartItemHTML;
    });

    addInstantRemoveListeners();
    showPlaceOrderButtonIfItemsPresent(cartItems.length);
    localStorage.setItem("totalPrice", totalPrice);
  }

  function hidePlaceOrderButton() {
    const placeOrderBtn = document.getElementById("place-order");
    if (placeOrderBtn) {
      placeOrderBtn.style.display = "none";
    }
  }

  function showPlaceOrderButton() {
    const placeOrderBtn = document.getElementById("place-order");
    if (placeOrderBtn) {
      placeOrderBtn.style.display = "block";
    }
  }

  function showPlaceOrderButtonIfItemsPresent(cartLength) {
    if (cartLength > 0) {
      showPlaceOrderButton();
    } else {
      hidePlaceOrderButton();
    }
  }

  function checkLoginStatus() {
    const loginMessage = localStorage.getItem("loginMessage");
    if (loginMessage === "login successful!!") {
      showPlaceOrderButtonIfItemsPresent(
        JSON.parse(localStorage.getItem("cartItems")).length
      );
    } else {
      hidePlaceOrderButton();
    }
  }

  async function placeOrder(
    paymentMethod,
    email,
    address,
    city,
    state,
    fullName,
    zip
  ) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const customerName = localStorage.getItem("username");
    let orderPlaced = true;

    for (const item of cartItems) {
      try {
        const response = await fetch("http://localhost:8080/addCustomerOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: item.title,
            customerName: customerName,
            paymentMethod: paymentMethod,
            email: email,
            address: address,
            city: city,
            state: state,
          }),
        });

        if (!response.ok) {
          orderPlaced = false;
        }
      } catch (error) {
        orderPlaced = false;
      }
    }

    if (orderPlaced) {
      localStorage.removeItem("cartItems");
      localStorage.removeItem("loginMessage");
      renderCartItems();
      showOrderToast();
      await sendOrderEmail(
        email,
        cartItems,
        paymentMethod,
        fullName,
        address,
        city,
        state,
        zip
      );
    } else {
      alert("Failed to place some orders. Please try again.");
    }
  }

  function showOrderToast() {
    const toastEl = document.getElementById("order-toast");
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  const placeOrderBtn = document.getElementById("place-order");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", function () {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalPrice = localStorage.getItem("totalPrice") || 0;

      const cartItemsContainer = document.getElementById(
        "cart-items-container"
      );
      cartItemsContainer.innerHTML = "";
      cartItems.forEach((item) => {
        cartItemsContainer.innerHTML += `<p id="product-title">${item.title} <span class="price">${item.price}</span></p>`;
      });

      const totalPriceElement = document.getElementById("total-price");
      if (totalPriceElement) {
        totalPriceElement.innerText = `${totalPrice}`;
      }

      const paymentModal = new bootstrap.Modal(
        document.getElementById("paymentModal")
      );
      paymentModal.show();
    });

    document
      .getElementById("payment-method")
      .addEventListener("change", function () {
        togglePaymentMethodFields();
      });
  }

  function validatePaymentForm() {
    // Personal Details Validation
    const fullName = document.getElementById("fname").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("adr").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const zip = document.getElementById("zip").value.trim();

    // Payment Details Validation
    const paymentMethod = document.getElementById("payment-method").value;
    const cardName = document.getElementById("cname")
      ? document.getElementById("cname").value.trim()
      : "";
    const cardNumber = document.getElementById("cnum")
      ? document.getElementById("cnum").value.trim()
      : "";
    const expMonth = document.getElementById("expmonth")
      ? document.getElementById("expmonth").value.trim()
      : "";
    const expYear = document.getElementById("expyear")
      ? document.getElementById("expyear").value.trim()
      : "";
    const cvv = document.getElementById("cvv")
      ? document.getElementById("cvv").value.trim()
      : "";

    // Regex patterns for validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valid email format
    const zipPattern = /^\d{6}$/; // Valid zip code (assuming 6-digit postal code)
    const cardNumberPattern = /^\d{16}$/; // 16-digit card number
    const cvvPattern = /^\d{3,4}$/; // 3 or 4-digit CVV

    let errorMessages = [];

    // Validate Personal Details
    if (!fullName) {
      errorMessages.push("Full name is required.");
    }

    if (!email) {
      errorMessages.push("Email is required.");
    } else if (!emailPattern.test(email)) {
      errorMessages.push("Please enter a valid email address.");
    }

    if (!address) {
      errorMessages.push("Address is required.");
    }

    if (!city) {
      errorMessages.push("City is required.");
    }

    if (!state) {
      errorMessages.push("State is required.");
    }

    if (!zip) {
      errorMessages.push("Zip code is required.");
    } else if (!zipPattern.test(zip)) {
      errorMessages.push("Please enter a valid 6-digit zip code.");
    }

    // Validate Payment Method and Card Details (Only if payment method is 'card')
    if (paymentMethod === "Card") {
      if (!cardName) {
        errorMessages.push("Card name is required.");
      }

      if (!cardNumber) {
        errorMessages.push("Card number is required.");
      } else if (!cardNumberPattern.test(cardNumber)) {
        errorMessages.push("Card number must be 16 digits.");
      }

      if (!expMonth) {
        errorMessages.push("Expiration month is required.");
      }

      if (!expYear) {
        errorMessages.push("Expiration year is required.");
      }

      if (!cvv) {
        errorMessages.push("CVV is required.");
      } else if (!cvvPattern.test(cvv)) {
        errorMessages.push("CVV must be 3 or 4 digits.");
      }
    }

    // If there are any error messages, alert the user and stop the form submission
    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return false;
    }

    // If all validations pass
    return true;
  }

  const paymentForm = document.getElementById("payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      if (!validatePaymentForm()) {
        return; // Stop if validation fails
      }

      const paymentData = {
        paymentMethod: document.getElementById("payment-method").value,
        fullName: document.getElementById("fname").value,
        email: document.getElementById("email").value,
        address: document.getElementById("adr").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value,
        cardName: document.getElementById("cname").value,
        cardNumber: document.getElementById("cnum").value,
        expMonth: document.getElementById("expmonth").value,
        expYear: document.getElementById("expyear").value,
        cvv: document.getElementById("cvv").value,
      };

      try {
        const response = await fetch("http://localhost:8080/payments/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
          throw new Error("Payment processing failed");
        }

        await placeOrder(
          paymentData.paymentMethod,
          paymentData.email,
          paymentData.address,
          paymentData.city,
          paymentData.state,
          paymentData.fullName
        );
        bootstrap.Modal.getInstance(
          document.getElementById("paymentModal")
        ).hide();
      } catch (error) {
        alert("Payment failed: " + error.message);
      }
    });
  }

  function addInstantRemoveListeners() {
    const removeFromCartButtons =
      document.querySelectorAll(".remove-from-cart");
    removeFromCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-product-id");
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const indexToRemove = cartItems.findIndex(
          (item) => item.id.toString() === productId.toString()
        );
        if (indexToRemove !== -1) {
          cartItems.splice(indexToRemove, 1);
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          renderCartItems();
        }
      });
    });
  }

  async function sendOrderEmail(
    email,
    cartItems,
    paymentMethod,
    fullName,
    address,
    city,
    state,
    zip
  ) {
    const orderDetails = {
      email: email,
      cartItems: cartItems.map((item) => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1, // Assuming quantity is stored or default to 1
      })),
      paymentMethod: paymentMethod,
      fullName: fullName,
      address: address,
      city: city,
      state: state,
      zip: zip,
    };

    // Prepare the order details string
    const orderDetailsString = JSON.stringify(orderDetails);

    try {
      const response = await fetch(
        `http://localhost:8080/otp/sendOrderConfirmation?email=${encodeURIComponent(
          email
        )}&orderDetails=${encodeURIComponent(orderDetailsString)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Order confirmation email sent successfully.");
        console.log("Order confirmation email sent successfully.");
      } else {
        console.error("Failed to send order confirmation email.");
      }
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
    }
  }

  renderCartItems();
});
