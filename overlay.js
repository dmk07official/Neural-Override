(() => {
  const header = document.querySelector(".header");
  const subHeader = document.querySelector(".sub-header");
  const mobileNav = document.getElementById("mobileNav");

  const burger = document.getElementById("hamburger");
  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");

  let menuOffen = false;
  let isAtTop = null;

  let ticking = false;
  let lastScrollTop = -1; // absichtlich -1 für initialen Run

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  function handleScrollRAF() {
    const scrollTop = getScrollTop();

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // 👉 NUR reagieren, wenn sich der Wert wirklich ändert
        if (scrollTop !== lastScrollTop) {
          updateHeader(scrollTop);
          lastScrollTop = scrollTop;
        }
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

    // 🔒 AT-TOP Logik – jetzt eindeutig
    if (isAtTop === null) {
      isAtTop = scrollTop === 0;
      header.classList.toggle("at-top", isAtTop);
      subHeader?.classList.toggle("at-top", isAtTop);
      return;
    }

    // nur EINMAL wechseln, keine Loop-Zone mehr
    if (scrollTop === 0 && !isAtTop) {
      header.classList.add("at-top");
      subHeader?.classList.add("at-top");
      isAtTop = true;
    }

    if (scrollTop > 0 && isAtTop) {
      header.classList.remove("at-top");
      subHeader?.classList.remove("at-top");
      isAtTop = false;
    }

    // mobile nav opacity
    if (mobileNav) {
      mobileNav.style.opacity = scrollTop === 0 ? "0" : "1";
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

  document.addEventListener("DOMContentLoaded", () => {
    
    const hero = document.querySelector('.hero');

    const headerHeight = document.querySelector('.header').offsetHeight;
    const subHeaderHeight = document.querySelector('.sub-header')?.offsetHeight || 0;
    const extraPadding = 48;
    
    const heroHeight = window.innerHeight - (headerHeight + subHeaderHeight + extraPadding);

    hero.style.height = `${heroHeight}px`;
    
    const initialScroll = getScrollTop();
    isAtTop = initialScroll === 0;
    header.classList.toggle("at-top", isAtTop);
    subHeader?.classList.toggle("at-top", isAtTop);
    lastScrollTop = initialScroll;

    window.addEventListener("scroll", handleScrollRAF, { passive: true });
  });

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
  });

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
})();