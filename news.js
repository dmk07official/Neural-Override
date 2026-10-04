// Neural Override – News: Suche + Slideshows
(() => {
  // ── Suche: durchsucht den kompletten Post-Text ──────────────
  const input     = document.getElementById('search');
  const posts     = [...document.querySelectorAll('.post')];
  const count     = document.getElementById('result-count');
  const noResults = document.getElementById('no-results');

  function runSearch() {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    posts.forEach(post => {
      const match = post.textContent.toLowerCase().includes(q);
      post.hidden = !match;
      if (match) visible += 1;
    });
    if (noResults) noResults.hidden = visible > 0;
    if (count) {
      count.textContent = !q
        ? `Showing all ${posts.length} posts.`
        : visible === 1 ? 'Showing 1 matching post.' : `Showing ${visible} matching posts.`;
    }
  }

  if (input) {
    input.addEventListener('input', runSearch);
    // ?q=… aus der URL übernehmen (z. B. geteilte Such-Links)
    const q = new URLSearchParams(location.search).get('q');
    if (q) { input.value = q; }
    runSearch();
  }

  // ── Slideshows ──────────────────────────────────────────────
  // data-slides = [{src, alt}, …]; srcset wird über ImageKit-Breiten gebaut
  const withWidth = (src, w) => src + (src.includes('?') ? '&' : '?') + 'tr=w-' + w;

  document.querySelectorAll('.slideshow[data-slides]').forEach(box => {
    const slides  = JSON.parse(box.dataset.slides);
    const widths  = (box.dataset.widths || '480,800').split(',');
    const img     = box.querySelector('img');
    const current = box.querySelector('.current');
    let index = 0;

    function show(i) {
      index = (i + slides.length) % slides.length;
      const slide = slides[index];
      img.classList.add('swapping');
      const next = new Image();
      const apply = () => {
        img.srcset = widths.map(w => `${withWidth(slide.src, w)} ${w}w`).join(', ');
        img.src = withWidth(slide.src, widths[widths.length - 1]);
        img.alt = slide.alt;
        if (current) current.textContent = index + 1;
        img.classList.remove('swapping');
      };
      next.onload = next.onerror = apply;
      next.sizes = img.sizes;
      next.srcset = widths.map(w => `${withWidth(slide.src, w)} ${w}w`).join(', ');
      next.src = withWidth(slide.src, widths[widths.length - 1]);
    }

    box.querySelector('.prev')?.addEventListener('click', () => show(index - 1));
    box.querySelector('.next')?.addEventListener('click', () => show(index + 1));

    box.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    // Swipe: horizontal wechselt das Bild, vertikales Scrollen bleibt unberührt
    let startX = 0, startY = 0;
    box.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    }, { passive: true });
    box.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - startX;
      const dy = Math.abs(e.changedTouches[0].screenY - startY);
      if (Math.abs(dx) > 40 && dy < 80) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  });
})();