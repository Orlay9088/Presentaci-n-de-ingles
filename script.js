// === 2. Nav active highlight ===
const sections = ['hero','overview','intro','args','counter','conclusion'];

function updateNav() {
  const scrollY = window.scrollY + 150;
  let current = 'hero';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
}

// === Sound effects (4) ===
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, dur, vol) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch(e) {}
}

function playClick() { playTone(660, 0.08, 0.06); }
function playSwoosh() { playTone(440, 0.15, 0.05); }
function playCelebrate() {
  [520, 580, 660, 780].forEach((f, i) => setTimeout(() => playTone(f, 0.12, 0.07), i * 80));
}

// === 3. Click argument cards to expand ===
function toggleArg(el) {
  el.classList.toggle('expanded');
  playClick();
}

// === 5. Presentation mode ===
let presActive = false;
const presSections = ['#hero','#overview','#intro','#args','#counter','#conclusion','footer'];
let presIdx = 0;

function togglePresMode() {
  presActive = !presActive;
  document.body.classList.toggle('pres-mode', presActive);
  document.getElementById('pres-indicator').classList.toggle('visible', presActive);
  const btn = document.getElementById('pres-btn');
  btn.textContent = presActive ? '✕' : '🎬';
  btn.title = presActive ? 'Salir modo presentación' : 'Modo presentación';
  if (presActive) {
    presIdx = getCurrentSectionIndex();
    updatePresIndicator();
    playSwoosh();
  } else {
    playClick();
  }
}

function getCurrentSectionIndex() {
  const scrollY = window.scrollY + 100;
  let idx = 0;
  presSections.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (el && el.offsetTop <= scrollY) idx = i;
  });
  return idx;
}

function updatePresIndicator() {
  const total = presSections.length;
  document.getElementById('pres-pos').textContent = `${presIdx + 1} / ${total}`;
  const pct = ((presIdx + 1) / total) * 100;
  document.querySelector('#pres-bar::after').style.width = pct + '%';
  // Also update via inline style since pseudo-element can't be targeted via JS directly
  document.getElementById('pres-bar').style.setProperty('--w', pct + '%');
}

function goToPresSection(idx) {
  if (idx < 0) idx = 0;
  if (idx >= presSections.length) idx = presSections.length - 1;
  if (idx === presIdx) return;
  presIdx = idx;
  const el = document.querySelector(presSections[idx]);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updatePresIndicator();
  playClick();
}

// Keyboard nav for presentation mode
document.addEventListener('keydown', e => {
  if (!presActive) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    goToPresSection(presIdx + 1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    goToPresSection(presIdx - 1);
  }
  if (e.key === 'Escape') {
    if (presActive) togglePresMode();
  }
});

// === 7. Interactive counter voting ===
let voted = false;

function vote(choice) {
  if (voted) return;
  voted = true;
  document.querySelectorAll('.vote-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById(votes[choice].id).classList.add('selected');
  votes[choice].count++;
  updateVotes();
  playClick();
}

const votes = {
  agree: { count: 0, id: 'pct-agree' },
  disagree: { count: 0, id: 'pct-disagree' }
};

function updateVotes() {
  const total = votes.agree.count + votes.disagree.count;
  const aPct = total ? Math.round((votes.agree.count / total) * 100) : 0;
  const dPct = total ? Math.round((votes.disagree.count / total) * 100) : 0;
  document.getElementById('pct-agree').textContent = aPct + '%';
  document.getElementById('pct-disagree').textContent = dPct + '%';
}

// === 10. Confetti ===
let confettiActive = false;
let confettiPieces = [];
let confettiRaf = null;
let confettiFired = false;

function startConfetti() {
  if (confettiActive || confettiFired) return;
  confettiFired = true;
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#6D28D9','#22D3EE','#8B5CF6','#67E8F9','#F59E0B','#F87171','#34D399'];
  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 2 + 1,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 6,
      alpha: 1
    });
  }
  confettiActive = true;
  playCelebrate();

  function draw() {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    confettiPieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotV;
      p.vy += 0.02;
      p.alpha -= 0.002;
      if (p.alpha <= 0) return;
      alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive) {
      confettiRaf = requestAnimationFrame(draw);
    } else {
      confettiActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  draw();
}

// Detect footer to trigger confetti
const confettiObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) startConfetti();
  });
}, { threshold: 0.3 });
const footerEl = document.getElementById('celebrate');
if (footerEl) confettiObs.observe(footerEl);

// === Existing stuff ===

// Progress bar + nav active + back to top
window.addEventListener('scroll', () => {
  const el = document.documentElement;
  const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
  document.getElementById('progress').style.width = pct + '%';
  const btn = document.getElementById('back-top');
  btn.classList.toggle('visible', el.scrollTop > 400);
  updateNav();
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));

// Floating timer
let ti = null, sec = 0;

function toggleTimer() {
  document.getElementById('timer-box').classList.toggle('closed');
}

function updateTim() {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  const el = document.getElementById('timer-display');
  el.textContent = m + ':' + s;
  el.style.color = sec >= 300 ? '#F87171' : sec >= 180 ? '#FBBF24' : '#22D3EE';
}

function startTim() {
  if (ti) return;
  document.getElementById('timer-box').classList.remove('closed');
  ti = setInterval(() => { sec++; updateTim(); }, 1000);
  playClick();
}

function pauseTim() { clearInterval(ti); ti = null; playClick(); }

function resetTim() { pauseTim(); sec = 0; updateTim(); }

// Slow auto-scroll
let scrollTim = null;

function toggleSlowScroll() {
  const btn = document.getElementById('scroll-btn');
  if (scrollTim) {
    clearInterval(scrollTim);
    scrollTim = null;
    btn.classList.remove('active');
    return;
  }
  btn.classList.add('active');
  scrollTim = setInterval(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= max) {
      clearInterval(scrollTim);
      scrollTim = null;
      btn.classList.remove('active');
      return;
    }
    window.scrollBy(0, 1);
  }, 30);
}

// Fix for pres-bar pseudo-element
const styleFix = document.createElement('style');
styleFix.textContent = `#pres-bar::after{width:var(--w,0%)}`;
document.head.appendChild(styleFix);
