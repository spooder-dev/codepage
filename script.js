/* =====================================================================
   EDIT ME — the only settings you should ever need to change
===================================================================== */
const CONFIG = {
  BIRTHDAY_CODE: "0319",            // MMDD format
  CANVA_URL: "https://suprisejustbecause.my.canva.site/page-2",
  NAME: "Kish",

  DIALOGUE: {
    greeting: [
      "Hello, Kish, my Love 💖",
      "I've been waiting for you...",
      "Before I show you your surprise,",
      "Enter the code (HINT:Birthday, Month then Date!) 🌸"
    ],
    wrong: [
      "Hmm...",
      "I don't think that's right.",
      "Try again! 🌸"
    ],
    correct: [
      "Yay!!",
      "I have something special for you..."
    ],
    unlocking: "Let's go..."
  },

  TYPEWRITER_SPEED_MS: 32,   // lower = faster typing
  UNLOCK_DELAY_MS: 2600      // how long the unlock sequence plays before redirect
};

/* =====================================================================
   STATE
===================================================================== */
let enteredDigits = "";
let isTyping = false;
let inputLocked = false;

/* =====================================================================
   DOM REFS
===================================================================== */
const dialogueBox = document.getElementById("dialogueBox");
const dialogueText = document.getElementById("dialogueText");
const heartsRow = document.getElementById("heartsRow");
const heartSlots = [...document.querySelectorAll(".heart-slot")];
const keypad = document.getElementById("keypad");
const chibi = document.getElementById("chibi");
const unlockOverlay = document.getElementById("unlockOverlay");
const scene = document.getElementById("scene");
const clickSound = document.getElementById("clickSound");

/* =====================================================================
   TYPEWRITER
===================================================================== */
function typeLines(lines, onDone) {
  isTyping = true;
  const fullText = Array.isArray(lines) ? lines.join("\n") : lines;
  dialogueText.textContent = "";
  let i = 0;

  function step() {
    if (i <= fullText.length) {
      dialogueText.textContent = fullText.slice(0, i);
      i++;
      setTimeout(step, CONFIG.TYPEWRITER_SPEED_MS);
    } else {
      isTyping = false;
      if (onDone) onDone();
    }
  }
  step();
}

/* =====================================================================
   HEARTS
===================================================================== */
function renderHearts() {
  heartSlots.forEach((slot, idx) => {
    if (idx < enteredDigits.length) {
      slot.textContent = "♥";
      slot.classList.add("filled");
    } else {
      slot.textContent = "♡";
      slot.classList.remove("filled", "glow");
    }
  });
}

function glowHearts() {
  heartSlots.forEach(slot => slot.classList.add("glow"));
}

/* =====================================================================
   KEYPAD INPUT
===================================================================== */
keypad.addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn || inputLocked) return;

  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 120);
  playClick();

  const key = btn.dataset.key;

  if (key === "clr") {
    enteredDigits = "";
    renderHearts();
    return;
  }
  if (key === "del") {
    enteredDigits = enteredDigits.slice(0, -1);
    renderHearts();
    return;
  }

  if (enteredDigits.length < 4 && /^[0-9]$/.test(key)) {
    enteredDigits += key;
    spawnHeartParticle(btn);
    renderHearts();

    if (enteredDigits.length === 4) {
      inputLocked = true;
      setTimeout(checkCode, 350);
    }
  }
});

// Optional: allow real keyboard number entry too
window.addEventListener("keydown", (e) => {
  if (inputLocked) return;
  if (/^[0-9]$/.test(e.key) && enteredDigits.length < 4) {
    enteredDigits += e.key;
    renderHearts();
    if (enteredDigits.length === 4) {
      inputLocked = true;
      setTimeout(checkCode, 350);
    }
  } else if (e.key === "Backspace") {
    enteredDigits = enteredDigits.slice(0, -1);
    renderHearts();
  }
});

function playClick() {
  try {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  } catch (err) { /* audio optional, ignore */ }
}

/* =====================================================================
   CHECK CODE
===================================================================== */
function checkCode() {
  if (enteredDigits === CONFIG.BIRTHDAY_CODE) {
    handleCorrect();
  } else {
    handleWrong();
  }
}

function handleWrong() {
  dialogueBox.classList.add("shake");
  chibi.classList.add("shake-no");
  typeLines(CONFIG.DIALOGUE.wrong, () => {
    setTimeout(() => {
      dialogueBox.classList.remove("shake");
      chibi.classList.remove("shake-no");
      enteredDigits = "";
      renderHearts();
      inputLocked = false;
      typeLines(CONFIG.DIALOGUE.greeting.slice(-1)); // gentle re-prompt
    }, 900);
  });
}

function handleCorrect() {
  inputLocked = true;
  glowHearts();
  burstCelebration();

  typeLines(CONFIG.DIALOGUE.correct, () => {
    setTimeout(startUnlockSequence, 1200);
  });
}

/* =====================================================================
   UNLOCK SEQUENCE -> REDIRECT
===================================================================== */
function startUnlockSequence() {
  typeLines(CONFIG.DIALOGUE.unlocking);
  scene.classList.add("unlocking");
  speedUpPetals();

  setTimeout(() => {
    unlockOverlay.classList.add("active");
  }, CONFIG.UNLOCK_DELAY_MS - 900);

  setTimeout(() => {
    window.location.href = CONFIG.CANVA_URL;
  }, CONFIG.UNLOCK_DELAY_MS);
}

/* =====================================================================
   AMBIENT LAYERS — clouds, petals, sparkles (pure code, no assets needed)
===================================================================== */
function spawnClouds() {
  const layer = document.getElementById("cloudsLayer");
  const count = 4;
  for (let i = 0; i < count; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    const size = 40 + Math.random() * 50;
    cloud.style.width = size + "px";
    cloud.style.height = size * 0.5 + "px";
    cloud.style.top = (5 + Math.random() * 30) + "%";
    cloud.style.animationDuration = (30 + Math.random() * 25) + "s";
    cloud.style.animationDelay = (-Math.random() * 30) + "s";
    layer.appendChild(cloud);
  }
}

let petalSpeedMultiplier = 1;
function spawnPetals() {
  const layer = document.getElementById("petalsLayer");
  const count = 18;
  for (let i = 0; i < count; i++) {
    createPetal(layer, true);
  }
}
function createPetal(layer, randomDelay) {
  const petal = document.createElement("div");
  petal.className = "petal";
  petal.style.left = Math.random() * 100 + "%";
  const baseDuration = 6 + Math.random() * 6;
  petal.dataset.baseDuration = baseDuration;
  petal.style.animationDuration =
    (baseDuration / petalSpeedMultiplier) + "s, " + (2 + Math.random() * 2) + "s";
  petal.style.animationDelay = randomDelay ? (-Math.random() * baseDuration) + "s" : "0s";
  petal.style.opacity = 0.6 + Math.random() * 0.4;
  petal.style.transform = `scale(${0.7 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
  layer.appendChild(petal);

  petal.addEventListener("animationiteration", (e) => {
    if (e.animationName === "fall") {
      petal.style.left = Math.random() * 100 + "%";
    }
  });
}

function speedUpPetals() {
  petalSpeedMultiplier = 3;
  document.querySelectorAll(".petal").forEach(petal => {
    const base = parseFloat(petal.dataset.baseDuration || "8");
    petal.style.animationDuration =
      (base / petalSpeedMultiplier) + "s, " + (1.2) + "s";
  });
}

function spawnSparkles() {
  const layer = document.getElementById("sparkleLayer");
  const count = 12;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = Math.random() * 100 + "%";
    spark.style.top = (Math.random() * 60) + "%";
    spark.style.animationDuration = (1.5 + Math.random() * 2) + "s";
    spark.style.animationDelay = (-Math.random() * 3) + "s";
    layer.appendChild(spark);
  }
}

/* Little heart puff when a keypad button is pressed */
function spawnHeartParticle(originEl) {
  const rect = originEl.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent = "♥";
  heart.style.left = (rect.left - sceneRect.left + rect.width / 2) + "px";
  heart.style.top = (rect.top - sceneRect.top) + "px";
  scene.appendChild(heart);
  setTimeout(() => heart.remove(), 950);
}

/* Big burst of hearts + petals for the correct-code celebration */
function burstCelebration() {
  const symbols = ["♥", "🌸"];
  for (let i = 0; i < 26; i++) {
    setTimeout(() => {
      const el = document.createElement("span");
      el.className = "float-heart";
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.left = Math.random() * 100 + "%";
      el.style.top = (40 + Math.random() * 40) + "%";
      el.style.fontSize = (14 + Math.random() * 14) + "px";
      scene.appendChild(el);
      setTimeout(() => el.remove(), 950);
    }, i * 60);
  }
}

/* =====================================================================
   INIT
===================================================================== */
function init() {
  spawnClouds();
  spawnPetals();
  spawnSparkles();
  renderHearts();
  typeLines(CONFIG.DIALOGUE.greeting);
}

init();
