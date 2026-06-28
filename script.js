// Progress bar + back to top + slide counter
const sections = ['hero', 'overview', 'intro', 'body-args', 'counter', 'conclusion', 'speech'];
window.addEventListener('scroll', () => {
  const el = document.documentElement;
  const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  const btn = document.getElementById('back-top');
  el.scrollTop > 400 ? btn.classList.add('visible') : btn.classList.remove('visible');
  // slide counter
  let current = 0;
  for (let i = sections.length - 1; i >= 0; i--) {
    const sec = document.getElementById(sections[i]);
    if (sec && sec.getBoundingClientRect().top <= window.innerHeight / 2) { current = i + 1; break; }
  }
  document.getElementById('slideNum').textContent = current + ' / ' + sections.length;
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 60);
  });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

// Evidence toggle
function toggleEvidence(btn) {
  const content = btn.parentElement.querySelector('.evidence-content');
  const arrow = btn.querySelector('.arrow');
  content.classList.toggle('open');
  arrow.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
}

// Copy speech
function copySpeech() {
  const el = document.getElementById('speech-content');
  const text = el.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy speech', 2000);
  });
}

// Practice timer
let timerInterval = null, seconds = 0;
function openPractice() { document.getElementById('practice-overlay').classList.add('active'); }
function closePractice() {
  document.getElementById('practice-overlay').classList.remove('active');
  stopTimer();
}
function updateDisplay() {
  const m = String(Math.floor(seconds / 60)).padStart(2,'0');
  const s = String(seconds % 60).padStart(2,'0');
  const el = document.getElementById('practice-time');
  el.textContent = m + ':' + s;
  el.classList.toggle('over', seconds >= 300);
}
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}
function stopTimer() { clearInterval(timerInterval); timerInterval = null; }
function resetTimer() { stopTimer(); seconds = 0; updateDisplay(); }

// Teleprompter
let teleInterval = null, teleActive = false;

function openTeleprompter() {
  const source = document.getElementById('speech-content');
  const target = document.getElementById('teleContent');
  target.innerHTML = source.innerHTML;
  document.getElementById('teleprompter').classList.add('active');
  target.scrollTop = 0;
  document.getElementById('teleStartBtn').textContent = '▶ Play';
  teleActive = false;
  clearInterval(teleInterval);
}

function closeTeleprompter() {
  document.getElementById('teleprompter').classList.remove('active');
  clearInterval(teleInterval);
  teleActive = false;
}

function toggleTeleScroll() {
  const content = document.getElementById('teleContent');
  const btn = document.getElementById('teleStartBtn');
  if (teleActive) {
    clearInterval(teleInterval);
    teleActive = false;
    btn.textContent = '▶ Play';
  } else {
    teleActive = true;
    btn.textContent = '⏸ Pause';
    const speed = parseFloat(document.getElementById('teleSpeed').value);
    teleInterval = setInterval(() => {
      content.scrollTop += 0.8 * speed;
      if (content.scrollTop >= content.scrollHeight - content.clientHeight) {
        clearInterval(teleInterval);
        teleActive = false;
        btn.textContent = '▶ Play';
      }
    }, 50);
  }
}

document.getElementById('teleSpeed').addEventListener('input', function() {
  document.getElementById('teleSpeedLabel').textContent = this.value + '×';
  if (teleActive) {
    clearInterval(teleInterval);
    teleActive = false;
    document.getElementById('teleStartBtn').textContent = '▶ Play';
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePractice();
    closeTeleprompter();
  }
  if (e.key === ' ' && document.getElementById('teleprompter').classList.contains('active')) {
    e.preventDefault();
    toggleTeleScroll();
  }
});
