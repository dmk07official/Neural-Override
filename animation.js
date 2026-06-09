// Fade-in IntersectionObserver
const isMobile = window.innerWidth < 600;
const thresholdValue = isMobile ? 0.1 : 0.2;

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= thresholdValue) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: thresholdValue });

window.addEventListener('load', () => {
  // SKELETON LOADER: verstecken sobald content geladen ist
  const membersSkeleton = document.getElementById('members-skeleton');
  if (membersSkeleton) membersSkeleton.style.display = 'none';

  const newsSkeleton = document.getElementById('news-skeleton');
  if (newsSkeleton) newsSkeleton.style.display = 'none';

  // Fade-in observer starten
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

 

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
