import { includeHeader } from "./components/header/header.js";
includeHeader("./components/header/header.html");

// Scroll cards function - Scroll left or right by a fixed amount
function scrollCards(direction, containerClass) {
  const container = document.querySelector(containerClass);
  const scrollAmount = 300; // Amount to scroll on each button click (adjust as needed)

  if (direction === "left") {
    container.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  } else if (direction === "right") {
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }
}

// Attach event listeners to the buttons
document
  .getElementById("btnLeftContainer1")
  .addEventListener("click", function () {
    scrollCards("left", ".container-1");
  });
document
  .getElementById("btnRightContainer1")
  .addEventListener("click", function () {
    scrollCards("right", ".container-1");
  });

document
  .getElementById("btnLeftContainer2")
  .addEventListener("click", function () {
    scrollCards("left", ".container-2");
  });
document
  .getElementById("btnRightContainer2")
  .addEventListener("click", function () {
    scrollCards("right", ".container-2");
  });
