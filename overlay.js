// Neural Override – shared UI: Mobile-Navigation + Back-to-top.
// Lesefortschritt, Seitenübergänge und Bild-Reveals laufen komplett in CSS.
(() => {
  const nav    = document.getElementById('site-nav');
  const burger = document.querySelector('.burger');
  const toTop  = document.querySelector('.to-top');

  function setMenu(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }

  if (nav && burger) {
    const isOpen = () => burger.getAttribute('aria-expanded') === 'true';

    burger.addEventListener('click', () => setMenu(!isOpen()));

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        setMenu(false);
        burger.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (isOpen() && !nav.contains(e.target) && !burger.contains(e.target)) setMenu(false);
    });

    // Wechsel auf Desktop-Breite: Menü-Zustand zurücksetzen
    window.matchMedia('(min-width: 761px)').addEventListener('change', () => setMenu(false));
  }

  if (toTop) {
    let ticking = false;
    const update = () => {
      toTop.classList.toggle('show', window.scrollY > 600);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();