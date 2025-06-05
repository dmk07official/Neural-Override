document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector('.logo');

  logo.addEventListener('mouseenter', () => {
    logo.style.transition = "all 0.2s ease";
    logo.style.textShadow = "0 0 25px lime";
  });

  logo.addEventListener('mouseleave', () => {
    logo.style.textShadow = "0 0 10px var(--green)";
  });
  document.getElementById("continueBtn").addEventListener("click", function () {
    document.getElementById("epilepsy-warning").style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Disable scrolling while popup is active
  document.body.style.overflow = "hidden";

let currentSound = null;
let currentProgress = null;
let progressInterval = null;

const trackDurations = 14; // seconds

const tracks = {
  track1: new Howl({ src: ['song1.aac'], volume: 1 }),
  track2: new Howl({ src: ['song2.aac'], volume: 1 }),
  track3: new Howl({ src: ['song3.aac'], volume: 1 })
};

document.querySelectorAll('.play-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const trackId = button.getAttribute('data-track');
    const sound = tracks[trackId];
    const trackEl = document.getElementById(trackId);
    const progressBar = trackEl.querySelector('.progress-fill');

    if (currentSound && currentSound.playing()) {
      currentSound.stop();
      clearInterval(progressInterval);
      if (currentSound === sound) {
        progressBar.style.width = '0%';
        return; // stop same track
      }
    }

    currentSound = sound;
    currentProgress = progressBar;
    progressBar.style.width = '0%';
    sound.play();

    let startTime = Date.now();
    progressInterval = setInterval(() => {
      let elapsed = (Date.now() - startTime) / 1000;
      let percent = Math.min((elapsed / trackDurations) * 100, 100);
      progressBar.style.width = percent + '%';

      if (percent >= 100) {
        clearInterval(progressInterval);
        progressBar.style.width = '0%';
        currentSound = null;
      }
    }, 100);
  });
});

const loginBtn = document.getElementById('loginBtn');
const flashOverlay = document.getElementById('flashOverlay');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginBtn.addEventListener('click', () => {
  const userVal = usernameInput.value.trim();
  const passVal = passwordInput.value.trim();

  if (userVal === 'NeuralOverride' && passVal === 'DontEnter') {
    // Komplettes Crash-Out Setup
    usernameInput.disabled = true;
    passwordInput.disabled = true;
    loginBtn.disabled = true;

    let crashCount = 0;
    const maxCrash = 40;

    // Overlay für Blackout + Text
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100vw';
    flashOverlay.style.height = '100vh';
    flashOverlay.style.backgroundColor = '#000';
    flashOverlay.style.color = '#0f0';
    flashOverlay.style.fontFamily = "'VT323', monospace";
    flashOverlay.style.fontSize = '2rem';
    flashOverlay.style.display = 'flex';
    flashOverlay.style.flexDirection = 'column';
    flashOverlay.style.justifyContent = 'center';
    flashOverlay.style.alignItems = 'center';
    flashOverlay.style.textAlign = 'center';
    flashOverlay.style.padding = '2rem';
    flashOverlay.style.zIndex = '9999';
    flashOverlay.style.userSelect = 'none';

    const glitchTexts = [
      "ERROR: UNRECOVERABLE STATE DETECTED",
      "SYSTEM INTEGRITY COMPROMISED",
      "REBOOT REQUIRED TO PREVENT DATA LOSS",
      "WARNING: ABNORMAL ACTIVITY LOGGED",
      "FATAL EXCEPTION IN THREAD 'MAIN'",
      "CRITICAL FAILURE — SHUTDOWN IMMINENT",
      "☠️ YOU DID A GRAND MISTAKE ☠️"
    ];

    function getRandomGlitchText() {
      return glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
    }

    function glitchCrash() {
      if (crashCount >= maxCrash) {
        document.body.style.filter = 'none';
        return;
      }

      // Zufälliges Flackern und Filter Chaos
      flashOverlay.style.opacity = Math.random() > 0.4 ? '1' : '0.3';
      document.body.style.filter = `
        saturate(${(Math.random() * 6).toFixed(2)})
        contrast(${(Math.random() * 8).toFixed(2)})
        brightness(${(Math.random() * 3 + 0.5).toFixed(2)})
        invert(${Math.random() > 0.7 ? 1 : 0})
        hue-rotate(${Math.floor(Math.random() * 360)}deg)
        blur(${(Math.random() * 3).toFixed(1)}px)
        grayscale(${Math.random().toFixed(2)})
      `;

      // Krasser Shake & Scale & Rotate Effekt
      document.body.style.transform = `
        scale(${1 + Math.random() * 0.2})
        rotate(${(Math.random() * 20 - 10).toFixed(2)}deg)
        translate(${(Math.random() * 20 - 10).toFixed(1)}px, ${(Math.random() * 20 - 10).toFixed(1)}px)
      `;

      crashCount++;
      setTimeout(glitchCrash, Math.random() * 150 + 50);
    }

    glitchCrash();
    return;
  }

  // Sonst ganz normal weiter mit Flackern usw. wie vorher
  let flashes = 0;
  const maxFlashes = 10;
  const minFlashDuration = 75;
  const maxFlashDuration = 125;

  function getRandomDuration() {
    return Math.floor(Math.random() * (maxFlashDuration - minFlashDuration + 1)) + minFlashDuration;
  }

  function getRandomFilter() {
    const saturate = (Math.random() * 4 + 0.5).toFixed(2);
    const contrast = (Math.random() * 5 + 0.5).toFixed(2);
    const brightness = (Math.random() * 3 + 0.5).toFixed(2);
    const invert = Math.random() > 0.7 ? 'invert(1)' : 'invert(0)';
    const sepia = Math.random() > 0.85 ? 'sepia(1)' : 'sepia(0)';
    const hue = Math.floor(Math.random() * 360);

    return `saturate(${saturate}) contrast(${contrast}) brightness(${brightness}) ${invert} ${sepia} hue-rotate(${hue}deg)`;
  }

  function flash() {
    if (flashes >= maxFlashes) {
      flashOverlay.style.opacity = 0;
      document.body.style.filter = 'none';
      usernameInput.value = '';
      passwordInput.value = '';

      alert(`⚠️ SYSTEM ALERT ⚠️\n\nUnauthorized access detected.\nYour connection is compromised.\n\nTerminate immediately or suffer the consequences. \n\n(Can't enter cause you're a normie'')`);
      return;
    }

    flashOverlay.style.opacity = Math.random() > 0.5 ? '1' : '0';
    document.body.style.filter = getRandomFilter();

    flashes++;
    setTimeout(flash, getRandomDuration());
  }

  flash();
});

const texts = [
  "Loading system...",
  "Accessing memory sectors...",
  "Unauthorized entry detected...",
  "Rewriting reality.exe...",
  "Injecting chaos protocol...",
  "System override: Accepted.",
  "Glitching... please wait...",
  "ERROR_404: Sanity not found"
];

let i = 0;
let char = 0;
let isDeleting = false;
const speed = 70;
const pause = 1200;

const target = document.getElementById("typing");

function typeLoop() {
  const fullText = texts[i];
  if (isDeleting) {
    char--;
  } else {
    char++;
  }

  target.innerText = fullText.substring(0, char);
  target.parentElement.setAttribute("data-text", target.innerText);

  if (!isDeleting && char === fullText.length) {
    isDeleting = true;
    setTimeout(typeLoop, pause);
  } else if (isDeleting && char === 0) {
    isDeleting = false;
    i = (i + 1) % texts.length;
    setTimeout(typeLoop, 200);
  } else {
    setTimeout(typeLoop, isDeleting ? speed / 2 : speed);
  }
}

typeLoop();

  
  const newsItems = document.querySelectorAll(".news-item");
  const prevBtn = document.getElementById("prev-news");
  const nextBtn = document.getElementById("next-news");

  let currentIndex = 0;
  const itemsPerPage = 2;

  function showNews(index) {
    newsItems.forEach((item, i) => {
      if (i >= index && i < index + itemsPerPage) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  showNews(currentIndex);

  nextBtn.addEventListener("click", function () {
    if (currentIndex + itemsPerPage < newsItems.length) {
      currentIndex += itemsPerPage;
    } else {
      currentIndex = 0; // loop to start
    }
    showNews(currentIndex);
  });

  prevBtn.addEventListener("click", function () {
    if (currentIndex - itemsPerPage >= 0) {
      currentIndex -= itemsPerPage;
    } else {
      currentIndex = Math.max(0, newsItems.length - itemsPerPage); // loop to end
    }
    showNews(currentIndex);
  });
    
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


});