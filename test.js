// code for dialog box popup on hover
const circles = document.querySelectorAll(".circle");
circles.forEach(circle => {
  const overlay = circle.querySelector(".overlay");
  circle.addEventListener("mouseenter", () => {
    overlay.style.right = "calc(100% + 20px)";
  });
  circle.addEventListener("mouseleave", () => {
    overlay.style.right = "-100%";
  });
});
