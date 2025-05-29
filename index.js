document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector('.logo');

  logo.addEventListener('mouseenter', () => {
    logo.style.transition = "all 0.2s ease";
    logo.style.textShadow = "0 0 25px lime";
  });

  logo.addEventListener('mouseleave', () => {
    logo.style.textShadow = "0 0 10px var(--green)";
  });

let currentSound = null;

const tracks = {
  track1: new Howl({ src: ['song1.mp3'] }),
  track2: new Howl({ src: ['song2.mp3'] }),
  track3: new Howl({ src: ['song3.mp3'] })
};

Object.keys(tracks).forEach(trackId => {
  const element = document.getElementById(trackId);
  if (element) {
    element.addEventListener('click', () => {
      if (currentSound && currentSound.playing()) {
        currentSound.stop();
      }

      currentSound = tracks[trackId];
      currentSound.play();
    });
  }
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
        flashOverlay.innerHTML = `
          <p>!!! SYSTEM LOCKDOWN INITIATED !!!</p>
          <p>YOU TRIGGERED THE WRONG DOOR</p>
          <p>EXITING... OR NOT?</p>
        `;
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

      // Zufälligen Glitch-Text anzeigen
      flashOverlay.innerHTML = `<p>${getRandomGlitchText()}</p>`;

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

});