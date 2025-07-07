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

    attachEventListeners();
  } catch (error) {
    console.error("Error including header:", error);
  }
}

function attachEventListeners() {
  const homeButton = document.getElementById("homeButton");
  if (homeButton) {
    homeButton.addEventListener("click", () => {
      window.location.href = "../../index.html";
    });
  }

  const userProfileLink = document.getElementById("userprofile");
  const username = localStorage.getItem("username");
  if (userProfileLink && username) {
    userProfileLink.innerHTML = `
      <img src="/resources/image/profile.png" alt="user-icon" style="width: 2em; margin-left: 0.5em" />
      <b style="margin-left: 0.5em; margin-top: 0.7em">${username}</b>
    `;
  }

  const searchForm = document.querySelector("form[role='search']");
  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const searchQuery = searchForm
        .querySelector("input[type='search']")
        .value.trim();
      if (searchQuery) {
        window.location.href = `/app/components/products/products.html?query=${encodeURIComponent(
          searchQuery
        )}`;
      }
    });
  }

  const products = [
    "John Hardy Women's Gold & Silver Dragon Station Chain Bracelet",
    "Solid Gold Petite Micropave",
    "White Gold Plated Princess",
    "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
    "Mens Casual Premium Slim Fit T-Shirts",
    "Mens Cotton Jacket",
    "Mens Casual Slim Fit",
    "Pierced Owl Rose Gold Plated Stainless Steel Double",
    "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED",
    "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    "MBJ Womens Solid Short Sleeve Boat Neck",
    "Opna Womens Short Sleeve Moisture",
    "DANVOUY Womens T Shirt Casual Cotton Short",
    "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "Men's Red Polo T-Shirt",
    "Nike Air Vision Sports Shoe",
    "Puma Men's Sandals",
    "Men's Black Leather Loafer",
    "Women's Black Strappy Sandals",
    "Women's Black Ballet Flats",
    "Women's Denim Wedge Sandals",
    "Women's Black Sporty Flats",
    "Men's Camo Cargo Pants",
    "Kids Beige Shorts",
    "Kids Green Capris",
    "Girls Yellow T-Shirt",
    "Women's Black Cargo Capris",
    "Women's Green Kurta Set",
    "Acer Predator Gaming Keyboard",
    "Acer Portable Speakers",
    "Corsair Wireless Headset",
    "Logitech Wired Gaming Mouse",
    "Logitech USB Desktop Microphone",
    "Razer Seiren Mini Microphone",
    "Gold Diamond Bangles",
    "Heart Shaped Gold Bracelet",
    "Traditional Gold Earrings",
    "Elegant Designer Earrings",
    "Classic Jhumka Earrings",
    "Royal Bridal Necklace",
    "Gold Filigree Swirl Ring",
    "Floral Pattern Ring",
    "Traditional Textured Ring",
    "Gold Diamond Leaf Ring",
    "Laptop",
    "Smartphone",
    "Tablet",
    "Headphones",
    "Smartwatch",
    "Camera",
    "Printer",
    "Monitor",
    "Keyboard",
    "Mouse",
  ];

  autocomplete(document.getElementById("searchInput"), products);
}

function autocomplete(inp, arr) {
  let currentFocus;

  inp.addEventListener("input", function () {
    let val = this.value;
    closeAllLists();
    if (!val) return false;
    currentFocus = -1;

    const container = this.closest(".autocomplete");
    const list = document.createElement("div");
    list.setAttribute("id", this.id + "-autocomplete-list");
    list.setAttribute("class", "autocomplete-items");
    container.appendChild(list);

    arr.forEach((item) => {
      if (item.toLowerCase().startsWith(val.toLowerCase())) {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `<strong>${item.substr(
          0,
          val.length
        )}</strong>${item.substr(val.length)}`;
        itemDiv.innerHTML += `<input type='hidden' value='${item}'>`;

        itemDiv.addEventListener("click", function () {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });

        list.appendChild(itemDiv);
      }
    });
  });

  inp.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "-autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1 && x) x[currentFocus].click();
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    Array.from(x).forEach((el) => el.classList.remove("autocomplete-active"));
  }

  function closeAllLists(elmnt) {
    const items = document.getElementsByClassName("autocomplete-items");
    Array.from(items).forEach((item) => {
      if (elmnt !== item && elmnt !== inp) {
        item.parentNode.removeChild(item);
      }
    });
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
