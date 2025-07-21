$("#mySidenav").load("../common/sidenav.html");

document.addEventListener("DOMContentLoaded", function () {
  fetchStocks(); // Initial fetch of stocks when the page loads
  document.getElementById("manage-btn").style.display = "none";
});

let stocks = []; // Array to hold stock data
const pageSize = 10; // Number of stocks per page
let currentPage = 1; // Initialize current page
let totalPages = 0; // Variable to hold total pages

// Function to calculate total pages based on data length and page size
function calculateTotalPages() {
  totalPages = Math.ceil(stocks.length / pageSize);
}

// Modify the renderTableRows function to accept filtered stocks
function renderTableRows(pageNumber, stockList = stocks) {
  const tableBody = document.getElementById("stockTableBody");
  tableBody.innerHTML = ""; // Clear existing rows

  // Calculate start and end index for current page
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, stockList.length);
  const pageStocks = stockList.slice(startIndex, endIndex);

  // Render rows for the current page
  pageStocks.forEach((stock) => {
    var formattedPrice =
      stock.price !== null && stock.price !== undefined
        ? parseFloat(stock.price).toFixed(2)
        : "-";

    var row =
      '<tr data-stock-id="' +
      stock.stockId +
      '">' +
      "<td>" +
      stock.stockName +
      "</td>" +
      "<td>" +
      (stock.description ? stock.description : "") +
      "</td>" +
      "<td>" +
      stock.stockQuantity +
      "</td>" +
      "<td>" +
      formattedPrice +
      "</td>" +
      "<td>" +
      '<button type="button" class="btn btn-primary btn-sm btn-update" onclick="showUpdateStockModal(' +
      stock.stockId +
      ')">Update</button>' +
      '<button type="button" class="btn btn-danger btn-sm btn-delete" onclick="deleteStock(' +
      stock.stockId +
      ')">Delete</button>' +
      "</td>" +
      "</tr>";
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  updatePagination(); // Update pagination links after displaying stocks
}
// Function to fetch stocks from API
function fetchStocks() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/getAllStocks");
  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        stocks = JSON.parse(xhr.responseText);
        calculateTotalPages(); // Calculate total pages based on fetched data
        gotoPage(1); // Display first page of stocks
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error fetching stocks. Status code: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Error fetching stocks. Network error.");
  };
  xhr.send();
}
// Function to display pagination links
function updatePagination() {
  const pagination = document.getElementById("pagination");
  let paginationHtml = "";

  // Generate pagination HTML dynamically
  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `<li class="page-item ${
      currentPage === i ? "active" : ""
    }"><a class="page-link" href="#" onclick="gotoPage(${i})">${i}</a></li>`;
  }

  // Update the pagination container with the generated HTML
  pagination.innerHTML = paginationHtml;
}

// Function to navigate to a specific page
window.gotoPage = function (pageNumber) {
  currentPage = pageNumber; // Update current page
  renderTableRows(pageNumber); // Render table rows for the selected page
};

// Function to filter stocks based on search text
function filterStocks() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();

  // Filter stocks based on stockId, stockName, and description
  const filteredStocks = stocks.filter((stock) => {
    const idMatch = stock.stockId.toString().includes(searchText); // Convert id to string for comparison
    const nameMatch = stock.stockName.toLowerCase().includes(searchText);
    const descriptionMatch = stock.description
      ? stock.description.toLowerCase().includes(searchText)
      : false;

    // Return true if any of the fields match
    return idMatch || nameMatch || descriptionMatch;
  });

  // Update total pages and display the first page of filtered stocks
  totalPages = Math.ceil(filteredStocks.length / pageSize);
  currentPage = 1; // Reset to first page of filtered results
  renderTableRows(currentPage, filteredStocks); // Pass filtered stocks to render function
}

// Event listener for search input
document.getElementById("searchInput").addEventListener("input", filterStocks);

function addStock(event) {
  // Prevent default form submission behavior
  event.preventDefault();

  // Get form data
  const stockName = document.getElementById("stockName").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("Price").value;
  const stockQuantity = document.getElementById("stockQuantity").value;

  // Basic validation (more can be added)
  if (!stockName || !description || !price || !stockQuantity) {
    alert("Please fill in all required fields.");
    return;
  }

  const addStockUrl = "http://localhost:8080/addStock";

  // Use fetch API to send a POST request with stock data
  fetch(addStockUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stockName: stockName,
      description: description,
      price: price, // Fixed typo from Price to unitPrice
      stockQuantity: stockQuantity,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Stock added successfully, update the table
      console.log("Stock added:", data);
      // Clear the form after successful submission (optional)
      document.getElementById("addStockFormElement").reset();

      // Alert message for successful addition
      alert("Stock added successfully!");
      fetchStocks();
      showManageStock();
    })
    .catch((error) => {
      console.error("Error adding stock:", error);
      // Handle API errors (e.g., display error message to user)
      alert("Error adding stock. Please try again.");
    });
}

// Event listener for form submission
document
  .getElementById("addStockFormElement")
  .addEventListener("submit", addStock);

// Function to fetch stock details by stockId and show update modal
function showUpdateStockModal(stockId) {
  fetch("http://localhost:8080/getStockById/" + stockId)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((stock) => {
      console.log("Stock details:", stock);

      // Populate modal form fields with stock details
      document.getElementById("updateStockId").value = stock.stockId;
      document.getElementById("updateStockName").value = stock.stockName;
      document.getElementById("updateDescription").value =
        stock.description || "";
      document.getElementById("updateStockQuantity").value =
        stock.stockQuantity;
      document.getElementById("updatePrice").value =
        stock.price !== undefined ? stock.price : "";

      // Show the modal using jQuery (assuming Bootstrap modal is used)
      $("#updateStockModal").modal("show");
    })
    .catch((error) => {
      console.error("Error fetching stock details:", error);
    });
}

// Function to handle form submission for updating stock data
document
  .getElementById("updateStockForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect updated data from form
    let updatedStock = {
      stockId: document.getElementById("updateStockId").value,
      stockName: document.getElementById("updateStockName").value,
      description: document.getElementById("updateDescription").value,
      stockQuantity: parseInt(
        document.getElementById("updateStockQuantity").value,
        10
      ),
      price: parseFloat(document.getElementById("updatePrice").value),
    };

    // Send updated data to server API for updating
    updateStock(updatedStock.stockId, updatedStock);
  });

// Function to update stock data via API
function updateStock(stockId, updatedStock) {
  fetch("http://localhost:8080/updateStockById/" + stockId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedStock),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update stock");
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("Stock updated successfully:", responseData);
      $("#updateStockModal").modal("hide"); // Hide the modal after successful update
      fetchStocks();
    })
    .catch((error) => {
      console.error("Error updating stock:", error);
      // Optionally show an error message to the user
    });
}

// Function to delete stock by stockId
function deleteStock(stockId) {
  // Ask for confirmation before proceeding
  if (confirm("Are you sure you want to delete this stock?")) {
    fetch("http://localhost:8080/deleteStockById/" + stockId, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted row from the table
          document
            .querySelector('tr[data-stock-id="' + stockId + '"]')
            .remove();
          console.log("Stock deleted successfully.");

          // Alert message for successful deletion
          alert("Stock deleted successfully.");
          window.location.reload();
        } else {
          console.error("Error deleting stock:", response.statusText);
          alert("Failed to delete stock. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error deleting stock:", error);
        alert("Failed to delete stock. Please try again.");
      });
  } else {
    // If user cancels the delete operation
    console.log("Delete operation canceled.");
  }
}

function showManageStock() {
  document.getElementById("manageStockTable").style.display = "block";
  document.getElementById("addStockForm").style.display = "none";
  document.getElementById("manage-btn").style.display = "none";
  document.getElementById("searchInput").style.display = "block";
  document.getElementById("title").style.display = "block";
  document.getElementById("add-btn").style.display = "block";
  document.getElementById("pagination").style.display = "inline";
  document.getElementById("pagination").style.justifyContent = "center";
  window.location.reload();
}

function showAddStockForm() {
  document.getElementById("manageStockTable").style.display = "none";
  document.getElementById("addStockForm").style.display = "block";
  document.getElementById("manage-btn").style.display = "block";
  document.getElementById("searchInput").style.display = "none";
  document.getElementById("title").style.display = "none";
  document.getElementById("add-btn").style.display = "none";
  document.getElementById("pagination").style.display = "none";
}
function openNav() {
  document.getElementById("mySidenav").style.width = "16em";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
// JavaScript for handling logout button click
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Redirect to login page
  window.location.href = "/app/components/Admin-login/login.html"; // Replace with your actual login page URL
});
