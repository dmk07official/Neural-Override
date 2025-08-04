const isMobile = window.innerWidth < 600;
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= (isMobile ? 0.1 : 0.2)) {
    entry.target.classList.add('visible');
    obs.unobserve(entry.target);
    }
  });
}, {
threshold: isMobile ? 0.05 : 0.2
});


window.addEventListener('load', () => {
const fadeElems = document.querySelectorAll('.fade-in');
console.log('Fade-in Elemente:', fadeElems.length);
fadeElems.forEach(el => observer.observe(el));
});
