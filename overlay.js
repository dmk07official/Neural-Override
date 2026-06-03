(() => {
  const header   = document.querySelector(".header");
  const subHeader= document.querySelector(".sub-header");
  const mobileNav= document.getElementById("mobileNav");
  const burger   = document.getElementById("hamburger");
  const l1 = document.getElementById("line1");
  const l2 = document.getElementById("line2");
  const l3 = document.getElementById("line3");

  let menuOffen   = false;
  let isAtTop     = null;
  let ticking     = false;
  let lastScrollTop = -1;

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  // Header / Nav Vars
  // --hh      = volle header-hoehe (at-top). Hero sitzt darunter.
  // --nav-top = kompakte header-hoehe (scrolled). mobile-nav sitzt darunter.
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
    // Fallback alte browser: kleinste hoehe einmal setzen
    const hh = header.offsetHeight;
    hero.style.height = `${window.innerHeight - hh}px`;
  }

  let resizeTimer;
  let lastVW = window.innerWidth;
  window.addEventListener("resize", () => {
    // Nur bei breiten-/orientierungswechsel neu rechnen.
    // Reine hoehenänderung (toolbar ein/aus) ignorieren - kein jank.
    if (window.innerWidth === lastVW) return;
    lastVW = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recalcHeroHeight, 80);
  });

  // Scroll
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
    // scaleX(0..1) statt width(0%..100%) = GPU-composited, kein Layout-Reflow
    const scale = docHeight > 0 ? scrollTop / docHeight : 0;
    header.style.setProperty("--progress-scale", scale);

    // SNAP-Puffer: verhindert schnelles at-top-Toggling bei Micro-Bounce.
    // Ohne Puffer: mobile browser chrome show/hide laesst scrollTop kurz
    // auf 0 springen -> at-top toggle -> konkurrierende 0.4s Transitions
    // -> sichtbares Flimmern. Mit 6px Puffer: stabil.
    const SNAP = 6;

    if (isAtTop === null) {
      isAtTop = scrollTop <= SNAP;
      header.classList.toggle("at-top", isAtTop);
      if (mobileNav) mobileNav.classList.toggle("nav-hidden", isAtTop);
      return;
    }
    if (scrollTop <= SNAP && !isAtTop) {
      header.classList.add("at-top");
      isAtTop = true;
    } else if (scrollTop > SNAP && isAtTop) {
      header.classList.remove("at-top");
      isAtTop = false;
    }
    if (mobileNav) mobileNav.classList.toggle("nav-hidden", isAtTop);
  }

  // Parallax
  // Landscape: hero-right bild leicht langsamer scrollen (depth illusion).
  // Portrait: KEIN JS-parallax - wuerde mit der CSS idleMove animation
  // kollidieren (beide schreiben background-position) und auf iOS ruckeln.
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
    // NAV SPACING FIX: --nav-top aus der echten, aktuellen header-unterkante
    // setzen (getBoundingClientRect.bottom). syncHeaderVars konnte waehrend
    // der padding-transition einen zwischenwert messen -> luecke unter header.
    document.documentElement.style.setProperty(
      "--nav-top",
      Math.round(header.getBoundingClientRect().bottom) + "px"
    );

    mobileNav.classList.toggle("show");
    if (!menuOffen) {
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
    menuOffen = !menuOffen;
  };

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    recalcHeroHeight();

    const init = getScrollTop();
    isAtTop = init <= 6;
    header.classList.toggle("at-top", isAtTop);
    lastScrollTop = init;
    if (mobileNav) mobileNav.classList.toggle("nav-hidden", isAtTop);
    window.addEventListener("scroll", handleScrollRAF, { passive: true });
  });

  // Nach vollem load nochmal height korrigieren (fonts/images koennen header verschieben)
  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    recalcHeroHeight();
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
})();
