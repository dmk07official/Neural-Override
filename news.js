// FIX: searchFunction explizit auf window gesetzt (safe in strict mode / Bundlern)
window.searchFunction = function() {
  const input = document.getElementById("search").value.toLowerCase();
  let anyVisible = false;

  ["images-item", "news-item"].forEach(cls => {
    document.querySelectorAll(`.${cls} h3`).forEach(h3 => {
      const text = h3.textContent.toLowerCase();
      const item = h3.closest(`.${cls}`);
      const visible = text.includes(input);
      item.style.display = visible ? "" : "none";
      if (visible) anyVisible = true;
    });
  });

  // No-Results Hinweis ein-/ausblenden
  const noResults = document.getElementById("no-results");
  if (noResults) {
    noResults.style.display = (input.length > 0 && !anyVisible) ? "" : "none";
  }
};

document.querySelectorAll('[data-slideshow]').forEach(wrapper => {
  const images = JSON.parse(wrapper.getAttribute('data-slideshow'));
  const img = wrapper.querySelector('.slide-img');
  const currentDisplay = wrapper.querySelector('.slide-counter .current');
  let index = 0;
  let isAnimating = false;

  function animateSlide(newIndex, direction) {
    if (isAnimating || newIndex === index) return;
    isAnimating = true;

    img.classList.add(direction === 'left' ? 'slide-out-left' : 'slide-out-right');

    img.addEventListener('transitionend', function handler() {
      img.removeEventListener('transitionend', handler);
      img.src = images[newIndex];
      if (currentDisplay) currentDisplay.textContent = newIndex + 1;
      img.classList.remove('slide-out-left', 'slide-out-right');
      img.classList.add(direction === 'left' ? 'slide-in-right' : 'slide-in-left');

      img.addEventListener('animationend', function handlerIn() {
        img.classList.remove('slide-in-left', 'slide-in-right');
        img.removeEventListener('animationend', handlerIn);
        isAnimating = false;
        index = newIndex;
      });
    });
  }

  wrapper.querySelector('[data-prev]').addEventListener('click', () => {
    animateSlide((index - 1 + images.length) % images.length, 'right');
  });

  wrapper.querySelector('[data-next]').addEventListener('click', () => {
    animateSlide((index + 1) % images.length, 'left');
  });

  img.src = images[index];
  if (currentDisplay) currentDisplay.textContent = index + 1;
});

// Pre-fill search from URL parameter ?q= (required for schema.org SearchAction)
(function () {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.value = q;
      window.searchFunction();
    }
  }
}());
