// ─── State ───
let idx = 0;
const slides = document.querySelectorAll('.slide');
const total = slides.length;
const wrap = document.getElementById('slides');
let notesOn = false;
let ti = null, sec = 0;

// ─── Navigation ───
function go(i) {
  if (i < 0 || i >= total) return;
  idx = i;
  wrap.style.transform = `translateX(-${idx * 100}vw)`;
  document.getElementById('counter').textContent = `${idx+1} / ${total}`;
  document.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('on', j === idx));
  document.getElementById('prevBtn').style.opacity = idx === 0 ? '.3' : '1';
  document.getElementById('nextBtn').style.opacity = idx === total - 1 ? '.3' : '1';
  document.getElementById('progress').style.width = `${((idx+1)/total)*100}%`;
  // Notes
  const n = document.querySelector('.note');
  if (notesOn && slides[idx].dataset.notes) {
    n.querySelector('.nt').textContent = slides[idx].dataset.notes;
    n.classList.add('show');
  } else {
    n.classList.remove('show');
  }
}

function next() { go(idx + 1); }
function prev() { go(idx - 1); }

// ─── Dots ───
const dotWrap = document.getElementById('dots');
for (let i = 0; i < total; i++) {
  const d = document.createElement('button');
  d.className = 'dot' + (i === 0 ? ' on' : '');
  d.onclick = () => go(i);
  dotWrap.appendChild(d);
}

// ─── Notes ───
function toggleNotes() {
  notesOn = !notesOn;
  document.getElementById('notesToggle').classList.toggle('on', notesOn);
  go(idx);
}

// ─── Timer ───
function openTimer() { document.getElementById('timerOverlay').classList.add('show'); }
function closeTimer() { document.getElementById('timerOverlay').classList.remove('show'); pause(); }
function tick() {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  const el = document.getElementById('td');
  el.textContent = m + ':' + s;
  el.style.color = sec >= 300 ? '#ef4444' : sec >= 180 ? '#d97706' : '#1a1a2e';
}
function start() { if (ti) return; ti = setInterval(() => { sec++; tick(); }, 1000); }
function pause() { clearInterval(ti); ti = null; }
function reset() { pause(); sec = 0; tick(); }

// ─── Keyboard ───
document.addEventListener('keydown', e => {
  if (document.getElementById('timerOverlay').classList.contains('show')) {
    if (e.key === 'Escape') closeTimer();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
  if (e.key === 'Escape') { notesOn = false; document.getElementById('notesToggle').classList.remove('on'); go(idx); }
});

// ─── Touch ───
let tx = 0;
document.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
document.addEventListener('touchend', e => {
  const diff = tx - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
}, { passive: true });

// ─── Note element ───
const nb = document.createElement('div');
nb.className = 'note';
nb.innerHTML = '<div class="nl">Presenter notes</div><div class="nt"></div>';
document.body.appendChild(nb);

// ─── Init ───
go(0);
