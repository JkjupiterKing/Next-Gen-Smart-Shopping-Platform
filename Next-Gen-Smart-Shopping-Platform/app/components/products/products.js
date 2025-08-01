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
  let productList = document.getElementById("row");
  productList.innerHTML = "";

  products.forEach((product) => {
    const imageSrc = product.image
      ? `data:image/jpeg;base64,${product.image}`
      : "default-image.jpg";

    const cardHTML = `
      <div class="column">
        <div class="card">
          <img src="${imageSrc}" class="card-img-top">
          <div class="card-body">
            <h4 class="card-title">${product.title}</h4>
            <p class="card-text1">${product.description}</p>
            <p class="card-text">Price: ${product.price}</p>
            <button type="button" class="btn btn-primary addToCartButton" id="${product.id}">Add to cart</button>
          </div>
        </div>
      </div>`;
    productList.innerHTML += cardHTML;
  });

  addAddToCartListeners();
}

// Add event listeners to all Add to Cart buttons and log interaction
function addAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".addToCartButton");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const userId = userDetails?.id;

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.id;
      const product = allProducts.find((p) => p.id == productId);

      if (product) {
        // Add to localStorage cart
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        cartItems.push({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          rating: product.rating,
          image: product.image,
        });
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        alert(`${product.title} added to cart!`);

        // ✅ Log interaction to backend with all fields converted to strings
        if (userId) {
          fetch("http://localhost:8080/interactions/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              userId: String(userId),
              productId: String(product.id),
              type: "CART_ADD",
              category: product.category ? String(product.category) : "",
              title: product.title ? String(product.title) : "",
              price: product.price != null ? String(product.price) : "0",
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("Bad response from server");
              }
              return res.text();
            })
            .then((data) => console.log("Interaction logged:", data))
            .catch((err) =>
              console.error("❌ Failed to log interaction:", err)
            );
        } else {
          console.warn("User not logged in. Skipping interaction logging.");
        }
      } else {
        console.error("❌ Product not found");
        alert("Product not found. Please try again.");
      }
    });
  });
}

// Filter products by category
function filterSelection(filterText, products) {
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
