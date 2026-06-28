  // Progress bar
  window.addEventListener('scroll', () => {
    const el = document.documentElement;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';

    // Back to top
    const btn = document.getElementById('back-top');
    if (el.scrollTop > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.12 });
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
      setTimeout(() => btn.textContent = '📋 Copy Speech', 2200);
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
    el.textContent = `${m}:${s}`;
    if (seconds >= 300) el.style.color = '#F87171';
    else if (seconds >= 180) el.style.background = 'linear-gradient(135deg, #FBBF24, #22D3EE)';
    else el.style.background = 'linear-gradient(135deg, #8B5CF6, #22D3EE)';
  }
  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => { seconds++; updateDisplay(); }, 1000);
  }
  function stopTimer() { clearInterval(timerInterval); timerInterval = null; }
  function resetTimer() { stopTimer(); seconds = 0; updateDisplay(); }
