(() => {
  const header = document.querySelector(".header");
  const subHeader = document.querySelector(".sub-header");
  const headerMain = document.querySelector(".header-main");
  const logo = document.querySelector(".logo");
  const rightEl = document.querySelector(".hamburger");

  const burger = document.getElementById("hamburger");
  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");
  const mobileNav = document.getElementById("mobileNav");

  let menuOffen = false;

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    header.style.setProperty("--progress-width", `${scrollPercent}%`);

    if (scrollTop < 5) {
      header.classList.add("at-top");
      subHeader?.classList.add("at-top");
    } else {
      header.classList.remove("at-top");
      subHeader?.classList.remove("at-top");
    }
  }

  function updateLogoTranslate() {
    if (!headerMain || !logo || !rightEl) return;

    const headerRect = headerMain.getBoundingClientRect();
    const logoRect = logo.getBoundingClientRect();

    const centerX = headerRect.width / 2;
    const logoStartX = logoRect.left - headerRect.left;
    const logoCenterOffset = logoRect.width / 2;

    const translateX = centerX - (logoStartX + logoCenterOffset);

    logo.style.setProperty("--logo-shift", `${translateX}px`);
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
    handleScroll();
    updateLogoTranslate();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateLogoTranslate);
  });

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
  });

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  
  window.addEventListener("scroll", () => {
  const nav = document.querySelector(".mobile-nav");
  if (!nav) return;

  if (window.scrollY < 5) {
    nav.style.opacity = "0";
  } else {
    nav.style.opacity = "1";
  }
});
})();