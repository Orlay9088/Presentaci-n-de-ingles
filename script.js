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

// Voting — Firebase real-time
let votes = { agree: 0, disagree: 0 };

function updateChart() {
  const total = votes.agree + votes.disagree;
  const max = Math.max(votes.agree, votes.disagree, 1);
  const aPct = total ? Math.round((votes.agree / total) * 100) : 0;
  const dPct = total ? Math.round((votes.disagree / total) * 100) : 0;
  const aH = (votes.agree / max) * 100;
  const dH = (votes.disagree / max) * 100;
  document.getElementById('bar-agree').style.height = aH + '%';
  document.getElementById('bar-disagree').style.height = dH + '%';
  document.getElementById('h-val-agree').textContent = votes.agree;
  document.getElementById('h-val-disagree').textContent = votes.disagree;
  document.getElementById('h-pct-agree').textContent = aPct + '%';
  document.getElementById('h-pct-disagree').textContent = dPct + '%';
  document.getElementById('pct-agree').textContent = votes.agree;
  document.getElementById('pct-disagree').textContent = votes.disagree;
}

// Escuchar cambios en Firebase
if (typeof votesRef !== 'undefined') {
  votesRef.on('value', snap => {
    const data = snap.val();
    if (data) {
      votes.agree = data.agree || 0;
      votes.disagree = data.disagree || 0;
    }
    updateChart();
  });
}

function vote(choice) {
  if (typeof votesRef !== 'undefined') {
    votesRef.transaction(current => {
      if (!current) current = { agree: 0, disagree: 0 };
      current[choice] = (current[choice] || 0) + 1;
      return current;
    });
  }
}

function resetVotes() {
  if (typeof votesRef !== 'undefined') {
    votesRef.set({ agree: 0, disagree: 0 });
  }
}

// QR toggle
function toggleQR() {
  const content = document.getElementById('qr-content');
  const isOpen = content.classList.toggle('open');
  if (isOpen) {
    const url = window.location.origin + window.location.pathname.replace(/\/?$/, '') + '/votar.html';
    document.getElementById('qr-url').textContent = url;
    document.getElementById('qr-img').src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(url);
  }
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
