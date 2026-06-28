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

// Feature #3: Click argument card to expand evidence
function toggleArg(el) {
  el.classList.toggle('expanded');
}

// Voting
const votes = { agree: 0, disagree: 0 };

function vote(choice) {
  votes[choice]++;
  document.getElementById('pct-agree').textContent = votes.agree;
  document.getElementById('pct-disagree').textContent = votes.disagree;
}

function resetVotes() {
  votes.agree = 0;
  votes.disagree = 0;
  document.getElementById('pct-agree').textContent = '0';
  document.getElementById('pct-disagree').textContent = '0';
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
