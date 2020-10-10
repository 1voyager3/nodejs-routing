let links = document.querySelectorAll("nav a");

for (let link of links) {
  /*
  // first method
  if (link.getAttribute('href') === window.location.pathname) {
    link.classList.add("active");
  }
   */

  // second method
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
}
