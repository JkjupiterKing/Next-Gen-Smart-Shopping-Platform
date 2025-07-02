import { includeHeader } from "../header/header.js";
includeHeader("../header/header.html");

const customerName = localStorage.getItem("username");

const apiUrl = `http://localhost:8080/getCustomerOrderByCustomerName/${customerName}`;

async function fetchOrderDetails() {
  try {
    const response = await fetch(apiUrl);
    const orders = await response.json();
    displayOrders(orders);
  } catch (error) {
    console.error("Error fetching order details:", error);
  }
}

function displayOrders(orders) {
  const container = document.getElementById("product-details");

  // Clear any previous content
  container.innerHTML = "";

  // If no orders are found, display the "No orders found" message
  if (orders.length === 0) {
    const noOrdersMessage = document.createElement("p");
    noOrdersMessage.textContent = "No orders found.";
    noOrdersMessage.style.fontSize = "1.2em";
    noOrdersMessage.style.fontWeight = "bold";
    noOrdersMessage.style.color = "#dc3545"; // Red color to indicate no orders
    container.appendChild(noOrdersMessage);
  } else {
    // Display orders if found
    const cardContainer = document.createElement("div");
    cardContainer.className = "card-container";

    orders.forEach((order) => {
      const orderElement = document.createElement("div");
      orderElement.className = "card";
      orderElement.style.width = "18rem";

      orderElement.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Order ID: ${order.orderId}</h5>
          <br>
          <h4 class="card-subtitle">${order.productName}</h4>
          <br>
        </div>
      `;

      cardContainer.appendChild(orderElement);
    });

    container.appendChild(cardContainer);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Initially display "No orders found"
  const container = document.getElementById("product-details");
  const noOrdersMessage = document.createElement("p");
  noOrdersMessage.textContent = "No orders found.";
  noOrdersMessage.style.fontSize = "1.2em";
  noOrdersMessage.style.fontWeight = "bold";
  container.appendChild(noOrdersMessage);

  // Fetch order details after page loads
  fetchOrderDetails();
});
