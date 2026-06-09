(() => {
  const header   = document.querySelector(".header");
  const subHeader= document.querySelector(".sub-header");
  const mobileNav= document.getElementById("mobileNav");
  const burger   = document.getElementById("hamburger");
  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");

  let menuOffen     = false;
  let isAtTop       = null;
  let ticking       = false;
  let lastScrollTop = -1;
  let scrollEndTimer;

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  // --hh      = volle header-hoehe (at-top)
  // --nav-top = kompakte header-hoehe (scrolled)
  function syncHeaderVars() {
    const isTop = header.classList.contains("at-top");
    if (isTop) {
      document.documentElement.style.setProperty("--hh", header.offsetHeight + "px");
      header.classList.remove("at-top");
      const compact = header.offsetHeight;
      header.classList.add("at-top");
      document.documentElement.style.setProperty("--nav-top", compact + "px");
    } else {
      document.documentElement.style.setProperty("--nav-top", header.offsetHeight + "px");
      header.classList.add("at-top");
      const full = header.offsetHeight;
      header.classList.remove("at-top");
      document.documentElement.style.setProperty("--hh", full + "px");
    }
  }

  // Hero Height
  let svhSupported = false;
  try {
    svhSupported = CSS && CSS.supports && CSS.supports("height", "100svh");
  } catch (e) { svhSupported = false; }

  function recalcHeroHeight() {
    syncHeaderVars();
    const hero = document.querySelector(".hero");
    if (!hero) return;
    if (svhSupported) {
      hero.style.removeProperty("height");
      return;
    }
    const hh = header.offsetHeight;
    hero.style.height = `${window.innerHeight - hh}px`;
  }

  let resizeTimer;
  let lastVW = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastVW) return;
    lastVW = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recalcHeroHeight, 80);
  });

  // Scroll RAF
  function handleScrollRAF() {
    const scrollTop = getScrollTop();
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (scrollTop !== lastScrollTop) {
          updateHeader(scrollTop);
          parallaxTick(scrollTop);
          lastScrollTop = scrollTop;
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateHeader(scrollTop) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scale = docHeight > 0 ? scrollTop / docHeight : 0;
    header.style.setProperty("--progress-scale", scale);

    // Transitions waehrend des aktiven Scrollens deaktivieren.
    // Jede at-top-Zustandsaenderung ist dann sofort/instant –
    // keine konkurrierenden Animationen, kein Flimmern.
    // 250ms nach dem letzten Scroll-Event werden sie wieder aktiviert
    // (= smooth Transition wenn Scrollen stoppt).
    header.classList.add("header-scrolling");
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      header.classList.remove("header-scrolling");
    }, 250);

    // Asymmetrische Schwellen – grosse Dead-Zone verhindert Rapid-Toggling:
    // Compact-Modus:  erst bei scrollTop > 60px aktivieren
    // Full-Modus:     erst bei scrollTop <= 4px zurueck (fast ganz oben)
    const EXPAND   = 4;
    const COLLAPSE = 60;

    if (isAtTop === null) {
      isAtTop = scrollTop <= EXPAND;
      header.classList.toggle("at-top", isAtTop);
      if (mobileNav) mobileNav.classList.toggle("nav-hidden", isAtTop);
      return;
    }
    if (scrollTop <= EXPAND && !isAtTop) {
      header.classList.add("at-top");
      isAtTop = true;
    } else if (scrollTop > COLLAPSE && isAtTop) {
      header.classList.remove("at-top");
      isAtTop = false;
    }
    if (mobileNav) mobileNav.classList.toggle("nav-hidden", isAtTop);
  }

  // Parallax – nur landscape, kein portrait (iOS jank)
  function parallaxTick(scrollTop) {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    if (isPortrait) return;
    const heroRight = document.querySelector(".hero-right");
    if (heroRight) {
      heroRight.style.transform = `translateY(${scrollTop * 0.1}px)`;
    }
  }

  // Mobile Menu
  window.toggleMobileMenu = () => {
    document.documentElement.style.setProperty(
      "--nav-top",
      Math.round(header.getBoundingClientRect().bottom) + "px"
    );
    mobileNav.classList.toggle("show");
    const opening = !menuOffen;
    if (opening) {
      l1.classList.add("move-line1","rotate-line1");
      l3.classList.add("move-line3","rotate-line3");
      l2.classList.add("hide-line2");
      burger.setAttribute("fill","#ff4d6d");
    } else {
      l1.classList.remove("move-line1","rotate-line1");
      l3.classList.remove("move-line3","rotate-line3");
      l2.classList.remove("hide-line2");
      burger.setAttribute("fill","#00ff88");
    }
    // Accessibility: aria-expanded state + label für Screen Reader
    const hamburgerBtn = document.querySelector('.hamburger');
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', opening ? 'true' : 'false');
      hamburgerBtn.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
    }
    menuOffen = !menuOffen;
  };

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    recalcHeroHeight();
    const init = getScrollTop();
    isAtTop = init <= 4;
    header.classList.toggle("at-top", isAtTop);
    lastScrollTop = init;
    if (mobileNav) mobileNav.classList.toggle("nav-hidden", isAtTop);
    window.addEventListener("scroll", handleScrollRAF, { passive: true });
  });

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    recalcHeroHeight();
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
})();
