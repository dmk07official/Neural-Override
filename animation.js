const observer = new IntersectionObserver((entries, obs) => {
entries.forEach(entry => {
if (entry.intersectionRatio >= 0.2) {
    entry.target.classList.add('visible');
    obs.unobserve(entry.target);
}
});
}, {
threshold: 0.2
});

window.addEventListener('load', () => {
const fadeElems = document.querySelectorAll('.fade-in');
console.log('Fade-in Elemente:', fadeElems.length);
fadeElems.forEach(el => observer.observe(el));
});
