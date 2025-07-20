console.log(document.documentElement.scrollHeight, window.innerHeight);

window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    const header = document.querySelector('.header');

    header.style.setProperty('--progress-width', scrollPercent + '%');

    let styleEl = document.getElementById('scroll-progress-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'scroll-progress-style';
        document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      .header::after {
          width: ${scrollPercent}%;
      }
    `;
});
