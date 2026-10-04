// Bug Fix: isMobile einmalig ausgewertet → jetzt dynamisch + Observer wird bei Resize/Rotation neu erstellt
const pendingEls = new Set();

function getThreshold() {
  return window.innerWidth < 600 ? 0.1 : 0.2;
}

function makeObserver(threshold) {
  return new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= threshold) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
        pendingEls.delete(entry.target);
      }
    });
  }, { threshold });
}

let observer = makeObserver(getThreshold());

// Bei Resize / Orientation-Change → Observer mit korrektem Threshold neu erstellen
let resizeDebounce;
window.addEventListener('resize', () => {
  clearTimeout(resizeDebounce);
  resizeDebounce = setTimeout(() => {
    const t = getThreshold();
    observer.disconnect();
    observer = makeObserver(t);
    pendingEls.forEach(el => observer.observe(el));
  }, 150);
});

window.addEventListener('load', () => {
  // SKELETON LOADER: verstecken sobald content geladen ist
  const membersSkeleton = document.getElementById('members-skeleton');
  if (membersSkeleton) membersSkeleton.style.display = 'none';

  const newsSkeleton = document.getElementById('news-skeleton');
  if (newsSkeleton) newsSkeleton.style.display = 'none';

  // Fade-in observer starten – Elemente in pendingEls tracken
  document.querySelectorAll('.fade-in').forEach(el => {
    pendingEls.add(el);
    observer.observe(el);
  });

  // ── Stat-Bars: von 0 auf Zielwert animieren beim Einblenden ─
  const statSection = document.querySelector('.band-stats');
  if (statSection) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.bar[data-bar]').forEach(bar => {
            requestAnimationFrame(() => { bar.style.width = bar.dataset.bar; });
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    barObserver.observe(statSection);
  }
});
