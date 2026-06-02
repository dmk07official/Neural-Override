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

  // ── HEADER / NAV VARS ─────────────────────────────────────────────────
  // Zwei verschiedene höhen:
  //  --hh      = volle header-höhe (at-top). Hero sitzt darunter.
  //  --nav-top = kompakte header-höhe (scrolled). mobile-nav sitzt darunter.
  function syncHeaderVars() {
    const isTop = header.classList.contains("at-top");
    if (isTop) {
      // jetzt = volle höhe → das ist --hh
      document.documentElement.style.setProperty("--hh", header.offsetHeight + "px");
      // kompakt-höhe messen für --nav-top
      header.classList.remove("at-top");
      const compact = header.offsetHeight;
      header.classList.add("at-top");
      document.documentElement.style.setProperty("--nav-top", compact + "px");
    } else {
      // jetzt = kompakt → das ist --nav-top
      document.documentElement.style.setProperty("--nav-top", header.offsetHeight + "px");
      // volle höhe messen für --hh
      header.classList.add("at-top");
      const full = header.offsetHeight;
      header.classList.remove("at-top");
      document.documentElement.style.setProperty("--hh", full + "px");
    }
  }

  // ── HERO HEIGHT ───────────────────────────────────────────────────────
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
  // Fallback alte browser: kleinste höhe einmal setzen
  const hh = header.offsetHeight;
  hero.style.height = `${window.innerHeight - hh}px`;
}

let resizeTimer;
let lastVW = window.innerWidth;
window.addEventListener("resize", () => {
  // Nur bei breiten-/orientierungswechsel neu rechnen.
  // Reine höhenänderung (toolbar ein/aus) ignorieren → kein jank.
  if (window.innerWidth === lastVW) return;
  lastVW = window.innerWidth;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(recalcHeroHeight, 80);
});

// visualViewport-recalc bewusst entfernt: feuerte bei jedem toolbar ein/aus
// und triggerte den header/hero-glitch. svh in CSS macht das jetzt stabil.

  // ── SCROLL ────────────────────────────────────────────────────────────
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

  // CHROME HEADER GLITCH FIX: kein transition:all.
  // Nur classList und custom property – kein layout-triggerndes style schreiben.
  function updateHeader(scrollTop) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    header.style.setProperty("--progress-width", `${pct}%`);

    if (isAtTop === null) {
      isAtTop = scrollTop === 0;
      header.classList.toggle("at-top", isAtTop);
      return;
    }
    if (scrollTop === 0 && !isAtTop) {
      header.classList.add("at-top");
      isAtTop = true;
    } else if (scrollTop > 0 && isAtTop) {
      header.classList.remove("at-top");
      isAtTop = false;
    }
    if (mobileNav) mobileNav.classList.toggle("nav-hidden", scrollTop === 0);
  }

  // ── PARALLAX ─────────────────────────────────────────────────────────
  // Landscape: hero-right bild leicht langsamer scrollen (depth illusion).
  // Portrait: KEIN JS-parallax mehr – würde mit der CSS idleMove animation
  // kollidieren (beide schreiben background-position) und auf iOS ruckeln.
  function parallaxTick(scrollTop) {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    if (isPortrait) return;
    const heroRight = document.querySelector(".hero-right");
    if (heroRight) {
      heroRight.style.transform = `translateY(${scrollTop * 0.1}px)`;
    }
  }

  // ── MOBILE MENU ───────────────────────────────────────────────────────
  window.toggleMobileMenu = () => {
    // NAV SPACING FIX: --nav-top aus der echten, aktuellen header-unterkante
    // setzen (getBoundingClientRect.bottom). syncHeaderVars konnte während
    // der padding-transition einen zwischenwert messen → lücke unter header.
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

  // ── INIT ──────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    recalcHeroHeight();

    const init = getScrollTop();
    isAtTop = init === 0;
    header.classList.toggle("at-top", isAtTop);
    lastScrollTop = init;
    if (mobileNav) mobileNav.classList.toggle("nav-hidden", init === 0);
    window.addEventListener("scroll", handleScrollRAF, { passive: true });
  });

  // Nach vollem load nochmal height korrigieren (fonts/images können header verschieben)
  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    recalcHeroHeight();
  });

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
})();