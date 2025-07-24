$("#mySidenav").load("../common/sidenav.html");

document.addEventListener("DOMContentLoaded", function () {
  fetchProducts(); // Initial fetch of products when the page loads
  document.getElementById("manage-btn").style.display = "none";
});

let products = []; // Array to hold product data
const pageSize = 10; // Number of products per page
let currentPage = 1; // Initialize current page
let totalPages = 0; // Variable to hold total pages

// Declare API endpoint URLs globally or at a higher scope
const addProductUrl = "http://localhost:8080/products/addProduct";
const getAllProductsUrl = "http://localhost:8080/products/all";
const getProductByIdUrl = "http://localhost:8080/products/"; // Append ID for specific product
const updateProductUrl = "http://localhost:8080/products/"; // Append ID for specific product
const deleteProductUrl = "http://localhost:8080/products/"; // Append ID for specific product

// Function to calculate total pages based on data length and page size
function calculateTotalPages() {
  totalPages = Math.ceil(products.length / pageSize);
}

// Modify the renderTableRows function to accept filtered products
function renderTableRows(pageNumber, productList = products) {
  const tableBody = document.getElementById("productTableBody");
  tableBody.innerHTML = ""; // Clear existing rows

  // Calculate start and end index for current page
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, productList.length);
  const pageProducts = productList.slice(startIndex, endIndex);

  // Render rows for the current page
  pageProducts.forEach((product) => {
    var formattedPrice =
      product.price !== null && product.price !== undefined
        ? parseFloat(product.price).toFixed(2)
        : "-";

    const imageUrl = product.image
      ? `data:image/jpeg;base64,${product.image}`
      : "";
    const imageHtml = imageUrl
      ? `<img src="${imageUrl}" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover;">`
      : "No Image";

    var row =
      '<tr data-product-id="' +
      product.id +
      '">' +
      "<td>" +
      imageHtml +
      "</td>" +
      "<td>" +
      product.title +
      "</td>" +
      "<td>" +
      (product.description ? product.description : "") +
      "</td>" +
      "<td>" +
      (product.category ? product.category : "") +
      "</td>" +
      "<td>" +
      formattedPrice +
      "</td>" +
      "<td>" +
      (product.rating ? product.rating : "") +
      "</td>" +
      "<td>" +
      '<button type="button" class="btn btn-primary btn-sm btn-update" onclick="showUpdateProductModal(' +
      product.id +
      ')">Update</button>' +
      '<button type="button" class="btn btn-danger btn-sm btn-delete" onclick="deleteProduct(' +
      product.id +
      ')">Delete</button>' +
      "</td>" +
      "</tr>";
    tableBody.insertAdjacentHTML("beforeend", row);
  });

  updatePagination(); // Update pagination links after displaying products
}

// Function to fetch products from API
function fetchProducts() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", getAllProductsUrl); // Using global variable
  xhr.onload = function () {
    if (xhr.status === 200) {
      try {
        products = JSON.parse(xhr.responseText);
        calculateTotalPages(); // Calculate total pages based on fetched data
        gotoPage(1); // Display first page of products
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Error fetching products. Status code: " + xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Error fetching products. Network error.");
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

// Function to filter products based on search text
function filterProducts() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();

  // Filter products based on title, description, and category
  const filteredProducts = products.filter((product) => {
    const titleMatch = product.title.toLowerCase().includes(searchText);
    const descriptionMatch = product.description
      ? product.description.toLowerCase().includes(searchText)
      : false;
    const categoryMatch = product.category
      ? product.category.toLowerCase().includes(searchText)
      : false;

    // Return true if any of the fields match
    return titleMatch || descriptionMatch || categoryMatch;
  });

  // Update total pages and display the first page of filtered products
  totalPages = Math.ceil(filteredProducts.length / pageSize);
  currentPage = 1; // Reset to first page of filtered results
  renderTableRows(currentPage, filteredProducts); // Pass filtered products to render function
}

// Event listener for search input
document
  .getElementById("searchInput")
  .addEventListener("input", filterProducts);

function addProduct(event) {
  // Prevent default form submission behavior
  event.preventDefault();

  // Get form data
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const price = document.getElementById("price").value;
  const rating = document.getElementById("rating").value;
  const imageFile = document.getElementById("image").files[0];

  // Declare formData at the beginning of the function
  const formData = new FormData(); // <--- This declaration should now prevent the ReferenceError

  // Basic validation - ensure all required fields, including the image, are filled
  if (!title || !description || !category || !price || !rating || !imageFile) {
    alert("Please fill in all required fields.");
    return;
  }

  formData.append(
    "product",
    new Blob(
      [
        JSON.stringify({
          title: title,
          description: description,
          category: category,
          price: price,
          rating: rating,
        }),
      ],
      { type: "application/json" }
    )
  );

  // Append the image file if it exists (validation already ensures it exists at this point)
  formData.append("image", imageFile); // Removed if(imageFile) as validation ensures it's present

  // Use fetch API to send a POST request with product data
  fetch(addProductUrl, {
    // Using global variable
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        // Attempt to read error message from backend if available
        return response.text().then((text) => {
          throw new Error(text || "Network response was not ok");
        });
      }
      return response.json();
    })
    .then((data) => {
      // Product added successfully, update the table
      console.log("Product added:", data);
      // Clear the form after successful submission (optional)
      document.getElementById("addProductFormElement").reset();

      // Alert message for successful addition
      alert("Product added successfully!");
      fetchProducts(); // Re-fetch all products to update the table
      showManageProducts(); // Switch back to manage view
    })
    .catch((error) => {
      console.error("Error adding product:", error);
      // Handle API errors (e.g., display error message to user)
      alert("Error adding product: " + error.message + ". Please try again.");
    });
}

// Event listener for form submission
document
  .getElementById("addProductFormElement")
  .addEventListener("submit", addProduct);

// Function to fetch product details by productId and show update modal
function showUpdateProductModal(productId) {
  fetch(getProductByIdUrl + productId) // Using global variable
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((product) => {
      console.log("Product details:", product);

      // Populate modal form fields with product details
      document.getElementById("updateProductId").value = product.id;
      document.getElementById("updateTitle").value = product.title;
      document.getElementById("updateDescription").value =
        product.description || "";
      document.getElementById("updateCategory").value = product.category || "";
      document.getElementById("updatePrice").value =
        product.price !== undefined ? product.price : "";
      document.getElementById("updateRating").value = product.rating || "";

      const currentProductImage = document.getElementById(
        "currentProductImage"
      );
      if (product.image) {
        currentProductImage.src = `data:image/jpeg;base64,${product.image}`;
        currentProductImage.style.display = "block";
      } else {
        currentProductImage.src = "";
        currentProductImage.style.display = "none";
      }

      // Show the modal using jQuery (assuming Bootstrap modal is used)
      $("#updateProductModal").modal("show");
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
      alert("Error fetching product details: " + error.message);
    });
}

// Function to handle form submission for updating product data
document
  .getElementById("updateProductForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect updated data from form
    let productId = document.getElementById("updateProductId").value;
    const title = document.getElementById("updateTitle").value;
    const description = document.getElementById("updateDescription").value;
    const category = document.getElementById("updateCategory").value;
    const price = document.getElementById("updatePrice").value;
    const rating = document.getElementById("updateRating").value;
    const imageFile = document.getElementById("updateImage").files[0];

    const formData = new FormData(); // Declare formData here for update function

    formData.append(
      "product",
      new Blob(
        [
          JSON.stringify({
            id: productId, // Ensure ID is part of the product object for update
            title: title,
            description: description,
            category: category,
            price: price,
            rating: rating,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      // If no new image selected, the backend will retain the old one if 'image' part is omitted
      // or you could explicitly send null/empty data depending on backend logic.
      // For your backend, if imageFile is null, it retains the existing image.
    }

    // Send updated data to server API for updating
    updateProduct(productId, formData);
  });

// Function to update product data via API
function updateProduct(productId, formData) {
  fetch(updateProductUrl + productId, {
    // Using global variable
    method: "PUT",
    body: formData, // FormData handles the Content-Type header automatically
  })
    .then((response) => {
      if (!response.ok) {
        // Attempt to read error message from backend if available
        return response.text().then((text) => {
          throw new Error(text || "Failed to update product");
        });
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("Product updated successfully:", responseData);
      $("#updateProductModal").modal("hide"); // Hide the modal after successful update
      fetchProducts(); // Re-fetch products to show updated data
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      alert("Error updating product: " + error.message + ". Please try again.");
    });
}

// Function to delete product by productId
function deleteProduct(productId) {
  // Ask for confirmation before proceeding
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(deleteProductUrl + productId, {
      // Using global variable
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted row from the table
          document
            .querySelector('tr[data-product-id="' + productId + '"]')
            .remove();
          console.log("Product deleted successfully.");

          // Alert message for successful deletion
          alert("Product deleted successfully.");
          fetchProducts(); // Re-fetch to correctly re-paginate if needed
        } else {
          // Attempt to read error message from backend if available
          return response.text().then((text) => {
            throw new Error(text || "Error deleting product");
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert(
          "Failed to delete product: " + error.message + ". Please try again."
        );
      });
  } else {
    // If user cancels the delete operation
    console.log("Delete operation canceled.");
  }
}

// Function to show the manage products table
function showManageProducts() {
  document.getElementById("manageProductTable").style.display = "block";
  document.getElementById("addProductForm").style.display = "none";
  document.getElementById("manage-btn").style.display = "none"; // Hide manage button when already in manage view
  document.getElementById("searchInput").style.display = "block";
  document.getElementById("title").style.display = "block"; // Assuming this is for the "Products" heading
  document.getElementById("add-btn").style.display = "block"; // Show add new product button
  document.getElementById("pagination").style.display = "inline";
  document.getElementById("pagination").style.justifyContent = "center";
  // No need for window.location.reload() here if fetchProducts() is called
  fetchProducts(); // Ensure data is fresh when switching to manage view
}

// Function to show the add new product form
function showAddProductForm() {
  document.getElementById("manageProductTable").style.display = "none";
  document.getElementById("addProductForm").style.display = "block";
  document.getElementById("manage-btn").style.display = "block"; // Show manage button when in add form view
  document.getElementById("searchInput").style.display = "none";
  document.getElementById("title").style.display = "none"; // Hide "Products" heading
  document.getElementById("add-btn").style.display = "none"; // Hide add button when already in add form view
  document.getElementById("pagination").style.display = "none";
}

function openNav() {
  document.getElementById("mySidenav").style.width = "16em";
}

// Added a closeNav function, which is typically used with a "x" button in sidenav
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// JavaScript for handling logout button click
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Redirect to login page
  window.location.href = "/app/components/Admin-login/login.html"; // Replace with your actual login page URL
});
