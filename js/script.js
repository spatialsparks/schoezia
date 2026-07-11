/* ===================================================================
   Joel & Marzia — Wedding Scratch-Card Reveal
   =================================================================== */

/* ---------------------------------------------------------------
   Doodle poll link.
   IMPORTANT: replace the placeholder below with your real Doodle
   poll URL once you've created it, then commit + push. That's the
   only change needed to wire up real availability collection.
---------------------------------------------------------------- */
const DOODLE_POLL_URL = "REPLACE_ME_WITH_DOODLE_LINK";

document.addEventListener("DOMContentLoaded", () => {
  const doodleLink = document.getElementById("doodle-link");
  if (doodleLink) {
    doodleLink.href = DOODLE_POLL_URL;
    if (DOODLE_POLL_URL.includes("REPLACE_ME")) {
      doodleLink.addEventListener("click", (e) => {
        e.preventDefault();
        alert("The availability poll link hasn't been set up yet. Check back soon!");
      });
    }
  }

  initScrollReveal();
  initScratchCard();
  fireConfetti(120);
});

/* ---------------------- Scroll reveal ---------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------------------- Scratch card ---------------------- */
function initScratchCard() {
  const card = document.getElementById("scratch-card");
  const canvas = document.getElementById("scratch-canvas");
  const hint = document.getElementById("scratch-hint");
  if (!card || !canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let isScratching = false;
  let revealed = false;
  let scratchedPixels = 0;
  let lastCheck = 0;

  function sizeCanvas() {
    const rect = card.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    drawScratchLayer();
  }

  function drawScratchLayer() {
    // Metallic gold scratch-off coating
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#c9a15b");
    grad.addColorStop(0.5, "#e7c680");
    grad.addColorStop(1, "#b58a45");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(107, 21, 36, 0.85)";
    ctx.font = `700 ${Math.max(16, width * 0.07)}px "Playfair Display", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH HERE", width / 2, height / 2);
  }

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function scratchAt(x, y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, Math.max(18, width * 0.09), 0, Math.PI * 2);
    ctx.fill();
  }

  function checkRevealProgress() {
    const now = performance.now();
    if (now - lastCheck < 150 || revealed) return;
    lastCheck = now;

    const pixels = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    const total = pixels.length / 4;
    // sample every 8th pixel for performance
    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] === 0) cleared++;
    }
    const ratio = cleared / (total / 8);
    if (ratio > 0.55) {
      revealCard();
    }
  }

  function revealCard() {
    if (revealed) return;
    revealed = true;
    card.classList.add("is-revealed");
    if (hint) hint.textContent = "You won! 🎉";
    fireConfetti(160);
  }

  function handleStart(evt) {
    if (revealed) return;
    isScratching = true;
    const pos = getPos(evt);
    scratchAt(pos.x, pos.y);
  }
  function handleMove(evt) {
    if (!isScratching || revealed) return;
    evt.preventDefault();
    const pos = getPos(evt);
    scratchAt(pos.x, pos.y);
    checkRevealProgress();
  }
  function handleEnd() {
    isScratching = false;
    checkRevealProgress();
  }

  canvas.addEventListener("mousedown", handleStart);
  canvas.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleEnd);

  canvas.addEventListener("touchstart", handleStart, { passive: true });
  canvas.addEventListener("touchmove", handleMove, { passive: false });
  canvas.addEventListener("touchend", handleEnd);

  window.addEventListener("resize", sizeCanvas);
  sizeCanvas();
}

/* ---------------------- Confetti ---------------------- */
function fireConfetti(count) {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const colors = ["#d4af6a", "#f0dcae", "#6b1524", "#fbf4e6", "#9c2c3d"];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.3,
    r: 4 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: -1.5 + Math.random() * 3,
    vy: 2 + Math.random() * 3,
    rotation: Math.random() * 360,
    vr: -6 + Math.random() * 12,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));

  let frame = 0;
  const maxFrames = 220;

  function tick() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.rotation += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (frame < maxFrames) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(tick);
  window.addEventListener("resize", resize);
}
