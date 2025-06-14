// Impressum Toggle
const btn = document.getElementById('impressumToggle');
    const content = document.getElementById('impressumContent');
    
    btn.addEventListener('click', () => {
      if (content.style.display === 'none') {
        content.style.display = 'block';
        btn.textContent = 'Impressum verbergen';
      } else {
        content.style.display = 'none';
        btn.textContent = 'Impressum anzeigen';
      }
    });

// Hamburger Toggle

function toggleMobileMenu() {
    const menu = document.getElementById('mobileNav');
    menu.classList.toggle('show');
  }

// Variable Border
window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    const header = document.querySelector('.header');

    // Direkt das ::after ändern? Geht nicht, also:
    // Trick: Dynamisch style setzen
    header.style.setProperty('--progress-width', scrollPercent + '%');

    // Trick 2: StyleTag reinballern
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
