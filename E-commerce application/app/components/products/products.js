import { includeHeader } from "../header/header.js";

var allProducts;
var cartItems = [];

// Add Header
includeHeader("../header/header.html");

// Add event listeners for filter buttons
document.getElementById("btnShowAll").addEventListener("click", function () {
  filterSelection("all", allProducts);
});
document.getElementById("btnJewelery").addEventListener("click", function () {
  filterSelection("jewelery", allProducts);
});
document
  .getElementById("btnElectronics")
  .addEventListener("click", function () {
    filterSelection("electronics", allProducts);
  });
document.getElementById("btnFashion").addEventListener("click", function () {
  filterSelection("fashion", allProducts);
});

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// Fetch all products from the API
fetch("http://localhost:8080/products/all") // Replace with your API endpoint
  .then((res) => res.json())
  .then((products) => {
    allProducts = products;
    console.log(allProducts);
    if (products) {
      // Check for the search query in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get("query"); // Get the 'query' parameter from the URL

      if (searchQuery) {
        // If a search query is present, filter products based on the query
        filterSearchResults(searchQuery, products);
      } else {
        // No search query, check for category
        const category = urlParams.get("category"); // Get the 'category' parameter from the URL
        if (category) {
          // Trigger the corresponding button click based on the category in the URL
          document
            .getElementById(`btn${capitalizeFirstLetter(category)}`)
            .click();
        } else {
          filterSelection("all", products); // Show all products by default
        }
      }
    } else {
      console.log("No products fetched");
    }
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });

// Functions
function buildProductPage(products) {
  console.log("Building product page with products:", products);
  let productList = document.getElementById("row");
  productList.innerHTML = "";
  products.forEach((product) => {
    const cardHTML = `
      <div class="column">
        <div class="card">
          <img src="${product.imageURL}" class="card-img-top" id="Product_Image_${product.id}">
          <div class="card-body">
            <h4 class="card-title" id="Product_name_${product.id}">${product.title}</h4>
            <p class="card-text1" id="Product_description_${product.id}">${product.description}</p>
            <p class="card-text" id="Product_price_${product.id}">Price: ${product.price}</p>
            <button type="button" class="btn btn-primary addToCartButton" id="${product.id}">Add to cart</button>
          </div>
        </div>
      </div>`;
    productList.innerHTML += cardHTML;
  });
  addAddToCartListeners();
}

// Event listener to Add-to-cart
function addAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".addToCartButton");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.id;

      // Find the product in allProducts array
      const product = allProducts.find((p) => p.id == productId);
      if (product) {
        // Retrieve existing cart items from localStorage or initialize an empty array
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        // Add the selected product details to cartItems array
        cartItems.push({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          rating: product.rating,
          image: product.imageURL,
        });

        // Store the updated cartItems back into localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Alert message with product title added to cart
        alert(`${product.title} added to cart!`);
      } else {
        console.error("Product not found");
        // Optionally, inform the user that the product couldn't be added
        alert("Product not found. Please try again.");
      }
    });
  });
}

// Filter products based on the category selected
function filterSelection(filterText, products) {
  console.log("Filtering by: " + filterText);
  let filteredProducts = [];

  // Filter products based on the category or "all"
  if (filterText === "all") {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(
      (product) => product.category.toLowerCase() === filterText.toLowerCase()
    );
  }

  // Call the buildProductPage function to update the UI with filtered products
  buildProductPage(filteredProducts);
}

// Filter products based on the search query
function filterSearchResults(query, products) {
  console.log("Filtering search results for: " + query);
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
  );

  // Hide category filters and show only search results
  document.getElementById("myBtnContainer").style.display = "none";

  // Get the message element to display the results
  const resultMessage = document.getElementById("resultMessage");

  // Show message about the number of results
  if (filteredProducts.length > 0) {
    resultMessage.innerHTML = `${filteredProducts.length} result${
      filteredProducts.length > 1 ? "s" : ""
    } found for "${query}"`;
  } else {
    resultMessage.innerHTML = `No results found for "${query}"`;
  }

  // Call the buildProductPage function to update the UI with filtered products
  buildProductPage(filteredProducts);
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
