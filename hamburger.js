const l1 = document.getElementById("line1");
const l2 = document.getElementById("line2");
const l3 = document.getElementById("line3");
const burger = document.getElementById("hamburger");

let offen = false;

function toggleMobileMenu() {
  document.getElementById('mobileNav').classList.toggle('show');
  if (!offen) {
      l1.classList.add("move-line1");
      l3.classList.add("move-line3");
      setTimeout(() => l2.classList.add("hide-line2"), 300);
      setTimeout(() => l1.classList.add("rotate-line1"), 300);
      setTimeout(() => l3.classList.add("rotate-line3"), 300);
      setTimeout(() => burger.setAttribute("fill", "#ff4d6d"), 300);
    } else {
      burger.setAttribute("fill", "#00ff88");
      l1.classList.remove("rotate-line1");
      l3.classList.remove("rotate-line3");
      l2.classList.remove("hide-line2");
      l1.classList.remove("move-line1");
      l3.classList.remove("move-line3");
    }
    offen = !offen;
}
