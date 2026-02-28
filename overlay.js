(() => {
  const header = document.querySelector(".header");
  const subHeader = document.querySelector(".sub-header");
  const mobileNav = document.getElementById("mobileNav");

  const burger = document.getElementById("hamburger");
  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");

  let menuOffen = false;
  let isAtTop = null; // 👈 absichtlich null

  // ⚡ requestAnimationFrame Flag
  let ticking = false;

  function handleScrollRAF() {
    const scrollTop = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader(scrollTop);
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateHeader(scrollTop) {
    // progress bar
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    header.style.setProperty("--progress-width", `${scrollPercent}%`);

    // 🔒 Hysterese + at-top toggle
    if (isAtTop === null) {
      isAtTop = scrollTop < 5;
      header.classList.toggle("at-top", isAtTop);
      subHeader?.classList.toggle("at-top", isAtTop);
    } else {
      if (scrollTop <= 5 && !isAtTop) { // früher 2px
        header.classList.add("at-top");
        subHeader?.classList.add("at-top");
        isAtTop = true;
      }

      if (scrollTop >= 20 && isAtTop) { // früher 10px
        header.classList.remove("at-top");
        subHeader?.classList.remove("at-top");
        isAtTop = false;
      }
    }

    // mobile nav opacity
    if (mobileNav) {
      mobileNav.style.opacity = scrollTop < 5 ? "0" : "1";
    }
  }

  window.toggleMobileMenu = () => {
    mobileNav.classList.toggle("show");

    if (!menuOffen) {
      l1.classList.add("move-line1", "rotate-line1");
      l3.classList.add("move-line3", "rotate-line3");
      l2.classList.add("hide-line2");
      burger.setAttribute("fill", "#ff4d6d");
    } else {
      l1.classList.remove("move-line1", "rotate-line1");
      l3.classList.remove("move-line3", "rotate-line3");
      l2.classList.remove("hide-line2");
      burger.setAttribute("fill", "#00ff88");
    }

    menuOffen = !menuOffen;
  };

  function updateTitle() {
    const path = window.location.pathname;
    let title = "Neural Override | Start";

    if (path.includes("news")) title = "Neural Override | News";
    if (path.includes("members")) title = "Neural Override | Members";

    document.title = title;
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateTitle();
    handleScrollRAF(); // setzt at-top korrekt beim Start
    window.addEventListener("scroll", handleScrollRAF);
  });

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
  });

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
})();