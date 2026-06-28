// ─── Progress bar + back to top ───
window.addEventListener('scroll', () => {
  const el = document.documentElement;
  const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';

  const btn = document.getElementById('back-top');
  btn.classList.toggle('visible', el.scrollTop > 400);
});

// ─── Reveal on scroll ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// ─── Evidence toggle ───
function toggleEvidence(btn) {
  const content = btn.parentElement.querySelector('.evidence-content');
  const arrow = btn.querySelector('.arrow');
  content.classList.toggle('open');
  arrow.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
}

// ─── Timer ───
let timerInterval = null, seconds = 0;

function openPractice() { document.getElementById('practice-overlay').classList.add('active'); }

function closePractice() {
  document.getElementById('practice-overlay').classList.remove('active');
  stopTimer();
}

function updateDisplay() {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  const el = document.getElementById('practice-time');
  el.textContent = `${m}:${s}`;
  el.style.background = seconds >= 300
    ? 'linear-gradient(135deg, #F87171, #EF4444)'
    : seconds >= 180
      ? 'linear-gradient(135deg, #FBBF24, #22D3EE)'
      : 'linear-gradient(135deg, #8B5CF6, #22D3EE)';
  el.style.webkitBackgroundClip = 'text';
  el.style.backgroundClip = 'text';
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
}

function stopTimer() { clearInterval(timerInterval); timerInterval = null; }

function resetTimer() { stopTimer(); seconds = 0; updateDisplay(); }
