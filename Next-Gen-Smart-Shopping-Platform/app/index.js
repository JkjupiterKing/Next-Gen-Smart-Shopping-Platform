import { includeHeader } from "./components/header/header.js";
includeHeader("./components/header/header.html");

document.addEventListener("DOMContentLoaded", () => {
  // Parse userDetails from localStorage if exists
  let userDetails = null;
  try {
    const stored = localStorage.getItem("userDetails");
    if (stored) {
      userDetails = JSON.parse(stored);
    }
  } catch {
    userDetails = null;
  }

  const userId = userDetails?.id || "00000000-0000-0000-0000-000000000000";

  // Step 1: Fetch user interactions
  fetch(`http://localhost:8080/interactions/user/${userId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch interactions");
      return res.json();
    })
    .then((interactions) => {
      if (!interactions.length) {
        throw new Error("No interactions found");
      }

      // Step 2: Extract most recent interaction categories
      const uniqueCategories = [];
      const seen = new Set();

      interactions
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .forEach((interaction) => {
          const cat = interaction.category;
          if (cat && !seen.has(cat.toLowerCase())) {
            seen.add(cat.toLowerCase());
            uniqueCategories.push(cat);
          }
        });

      if (!uniqueCategories.length) {
        throw new Error("No valid categories found in interactions");
      }

      // Step 3: Fetch products by top category
      return fetch(
        `http://localhost:8080/products/category/${encodeURIComponent(
          uniqueCategories[0]
        )}`
      );
    })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products by category");
      return res.json();
    })
    .then((products) => {
      const container = document.getElementById("recommendations");
      container.innerHTML = "";

      if (!products.length) {
        container.innerHTML =
          "<p class='text-muted'>No personalized recommendations found.</p>";
        return;
      }

      // Build product cards
      products.forEach((product) => {
        const col = document.createElement("div");
        col.className = "col-md-3";

        let imageSrc = "default-image.jpg";
        if (product.image && product.image.trim() !== "") {
          imageSrc = `data:image/jpeg;base64,${product.image}`;
        }

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${imageSrc}" class="card-img-top" alt="${product.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text" id="description">${product.description}</p>
              <p class="card-text fw-bold">$${product.price.toFixed(2)}</p>
              <button class="btn btn-primary addToCartButton mt-auto" data-id="${
                product.id
              }">Add to Cart</button>
            </div>
          </div>
        `;

        container.appendChild(col);
      });

      // Add event listeners for cart buttons
      document.querySelectorAll(".addToCartButton").forEach((button) => {
        button.addEventListener("click", () => {
          const productId = button.getAttribute("data-id");
          const product = products.find((p) => p.id == productId);

          if (!product) {
            console.error("❌ Product not found");
            alert("Product not found. Please try again.");
            return;
          }

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

          // Log interaction
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
                if (!res.ok) throw new Error("Bad response from server");
                return res.text();
              })
              .then((data) => console.log("Interaction logged:", data))
              .catch((err) =>
                console.error("❌ Failed to log interaction:", err)
              );
          } else {
            console.warn("User not logged in. Skipping interaction logging.");
          }
        });
      });
    })
    .catch((err) => {
      console.error("Recommendation flow error:", err);
      document.getElementById("recommendations").innerHTML =
        "<p class='text-danger'>Failed to load personalized recommendations.</p>";
    });
});
