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

// Add active class to the current button
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" active", "");
    }
    this.className += " active";
  });
}

// Fetch all products from the API
fetch("http://localhost:8080/products/all")
  .then((res) => res.json())
  .then((products) => {
    allProducts = products;
    console.log(allProducts);
    if (products) {
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get("query");
      if (searchQuery) {
        filterSearchResults(searchQuery, products);
      } else {
        const category = urlParams.get("category");
        if (category) {
          document
            .getElementById(`btn${capitalizeFirstLetter(category)}`)
            .click();
        } else {
          filterSelection("all", products);
        }
      }
    } else {
      console.log("No products fetched");
    }
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });

// Build the product listing UI
function buildProductPage(products) {
  console.log("Building product page with products:", products);
  let productList = document.getElementById("row");
  productList.innerHTML = "";

  products.forEach((product) => {
    const imageSrc = product.image
      ? `data:image/jpeg;base64,${product.image}`
      : "default-image.jpg"; // Optional placeholder image

    const cardHTML = `
      <div class="column">
        <div class="card">
          <img src="${imageSrc}" class="card-img-top" id="Product_Image_${product.id}">
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

// Add event listeners to all Add to Cart buttons
function addAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".addToCartButton");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.id;

      const product = allProducts.find((p) => p.id == productId);
      if (product) {
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        cartItems.push({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          rating: product.rating,
          image: product.image, // Base64 image string
        });

        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        alert(`${product.title} added to cart!`);
      } else {
        console.error("Product not found");
        alert("Product not found. Please try again.");
      }
    });
  });
}

// Filter products by category
function filterSelection(filterText, products) {
  console.log("Filtering by: " + filterText);
  let filteredProducts = [];

  if (filterText === "all") {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(
      (product) =>
        product.category &&
        product.category.toLowerCase() === filterText.toLowerCase()
    );
  }

  buildProductPage(filteredProducts);
}

// Filter products by search query
function filterSearchResults(query, products) {
  console.log("Filtering search results for: " + query);
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
  );

  document.getElementById("myBtnContainer").style.display = "none";

  const resultMessage = document.getElementById("resultMessage");

  if (filteredProducts.length > 0) {
    resultMessage.innerHTML = `${filteredProducts.length} result${
      filteredProducts.length > 1 ? "s" : ""
    } found for "${query}"`;
  } else {
    resultMessage.innerHTML = `No results found for "${query}"`;
  }

  buildProductPage(filteredProducts);
}

// Capitalize first letter helper
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
