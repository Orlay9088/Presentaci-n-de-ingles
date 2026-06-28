// Progress bar + back to top
window.addEventListener('scroll', () => {
  const el = document.documentElement;
  const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
  document.getElementById('progress').style.width = pct + '%';
  const btn = document.getElementById('back-top');
  btn.classList.toggle('visible', el.scrollTop > 400);
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.12 });
reveals.forEach(r => obs.observe(r));

// Evidence toggle
function toggleEv(btn) {
  const content = btn.parentElement.querySelector('.ev-content');
  content.classList.toggle('open');
  btn.textContent = content.classList.contains('open') ? '📊 Evidence ▴' : '📊 Evidence ▾';
}

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
}

function pauseTim() { clearInterval(ti); ti = null; }

function resetTim() { pauseTim(); sec = 0; updateTim(); }

// Slow auto-scroll
let scrollRaf = null;

function toggleSlowScroll() {
  const btn = document.getElementById('scroll-btn');
  if (scrollRaf) {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = null;
    btn.style.color = '';
    btn.textContent = '🐢';
    return;
  }
  btn.style.color = '#22D3EE';
  btn.textContent = '🐢';
  const step = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= max) { scrollRaf = null; btn.style.color = ''; return; }
    window.scrollBy(0, 0.3);
    scrollRaf = requestAnimationFrame(step);
  };
  scrollRaf = requestAnimationFrame(step);
}
