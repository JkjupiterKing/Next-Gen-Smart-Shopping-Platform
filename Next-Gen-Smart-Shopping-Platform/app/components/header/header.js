export async function includeHeader(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("Failed to load header");
    }
    const headerHtml = await response.text();
    const headerElement = document.createElement("div");
    headerElement.innerHTML = headerHtml;
    document.body.prepend(headerElement);

    // Attach event listeners to the elements in the header
    attachEventListeners();
  } catch (error) {
    console.error("Error including header:", error);
  }
}

// Function to attach event listeners to header elements
function attachEventListeners() {
  // Event to go to Home Page
  const homeButton = document.getElementById("homeButton");
  if (homeButton) {
    homeButton.addEventListener("click", function () {
      window.location.href = "../../index.html";
    });
  }

  // Display username in the profile link if logged in
  const userProfileLink = document.getElementById("userprofile");
  const username = localStorage.getItem("username");
  if (userProfileLink && username) {
    userProfileLink.innerHTML = `
        <img src="/resources/image/profile.png" alt="user-icon" style="width: 2em; margin-left: 0.5em" />
        <b style="margin-left: 0.5em; margin-top: 0.7em">${username}</b>
      `;
  }
  // Search functionality: Get search query and redirect to products page
  const searchForm = document.querySelector("form[role='search']");
  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission
      const searchQuery = searchForm
        .querySelector("input[type='search']")
        .value.trim();
      if (searchQuery) {
        // Redirect to the products page with search query
        window.location.href = `/app/components/products/products.html?query=${encodeURIComponent(
          searchQuery
        )}`;
      }
    });
  }
}
