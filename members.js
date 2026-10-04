// Neural Override – Members: Polaroids in groß (natives <dialog>)
(() => {
  const dialog = document.getElementById('lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const img     = dialog.querySelector('img');
  const caption = dialog.querySelector('p');

  document.querySelectorAll('.polaroid').forEach(btn => {
    btn.addEventListener('click', () => {
      const thumb = btn.querySelector('img');
      img.src = btn.dataset.full;
      img.alt = thumb.alt;
      caption.textContent = btn.querySelector('span').textContent;
      dialog.showModal();
    });
  });

  // Klick auf den abgedunkelten Hintergrund schließt (Fallback für Browser
  // ohne closedby="any"); Esc und der ×-Button funktionieren nativ.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => { img.removeAttribute('src'); });
})();