/**
 * XP Effects — sound & visual feedback layer
 * Uses the Web Audio API to synthesize retro sounds (no external files needed).
 * Hooks into the existing app.js events via DOM MutationObserver + custom events.
 */
(function () {
  'use strict';

  /* ─── Audio context (lazy init to satisfy autoplay policy) ─── */
  let _ctx = null;
  function ctx() {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    return _ctx;
  }

  /* ─── Mute state ─── */
  let muted = localStorage.getItem('xp-muted') === '1';

  function playTone(config) {
    if (muted) return;
    try {
      const ac = ctx();
      const { notes, type = 'square', vol = 0.18, dur = 0.12, gap = 0.04 } = config;
      let t = ac.currentTime;
      notes.forEach(([freq, length]) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + (length || dur));
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + (length || dur));
        t += (length || dur) + gap;
      });
    } catch (e) { /* silently fail */ }
  }

  /* ─── Sound library ─── */
  const SFX = {
    click:   () => playTone({ notes: [[880, 0.04]], type: 'sine',   vol: 0.12 }),
    tab:     () => playTone({ notes: [[660, 0.05]], type: 'sine',   vol: 0.10 }),
    success: () => playTone({ notes: [[523, 0.10], [659, 0.10], [784, 0.18]], type: 'sine',   vol: 0.20, gap: 0.02 }),
    error:   () => playTone({ notes: [[300, 0.14], [220, 0.20]], type: 'sawtooth', vol: 0.22, gap: 0.03 }),
    notify:  () => playTone({ notes: [[784, 0.08], [988, 0.14]], type: 'sine',   vol: 0.16, gap: 0.03 }),
  };

  /* ─── Mute toggle button ─── */
  function buildMuteBtn() {
    const btn = document.createElement('button');
    btn.id = 'xpMuteBtn';
    btn.className = 'xp-mute-btn';
    btn.title = muted ? 'Ativar sons' : 'Desativar sons';
    btn.setAttribute('aria-label', btn.title);
    btn.innerHTML = muted ? muteIcon() : speakerIcon();
    btn.addEventListener('click', () => {
      muted = !muted;
      localStorage.setItem('xp-muted', muted ? '1' : '0');
      btn.innerHTML = muted ? muteIcon() : speakerIcon();
      btn.title = muted ? 'Ativar sons' : 'Desativar sons';
      if (!muted) SFX.click();
    });
    return btn;
  }

  function speakerIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
    </svg>`;
  }
  function muteIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>`;
  }

  /* ─── XP Balloon notification ─── */
  function showBalloon(msg, type = 'info') {
    const old = document.getElementById('xpBalloon');
    if (old) old.remove();

    const balloon = document.createElement('div');
    balloon.id = 'xpBalloon';
    balloon.className = `xp-balloon xp-balloon--${type}`;

    const icons = { success: '✔', error: '✖', info: 'ℹ' };
    balloon.innerHTML = `
      <div class="xp-balloon-header">
        <span class="xp-balloon-icon">${icons[type] || icons.info}</span>
        <span class="xp-balloon-title">MeloTools</span>
        <button class="xp-balloon-close" aria-label="Fechar">✕</button>
      </div>
      <div class="xp-balloon-body">${msg}</div>
    `;

    balloon.querySelector('.xp-balloon-close').addEventListener('click', () => {
      balloon.classList.add('xp-balloon--hide');
      setTimeout(() => balloon.remove(), 300);
    });

    document.body.appendChild(balloon);

    // auto-dismiss
    setTimeout(() => {
      if (balloon.parentNode) {
        balloon.classList.add('xp-balloon--hide');
        setTimeout(() => balloon.remove(), 300);
      }
    }, 5000);
  }

  /* ─── Window shake on error ─── */
  function shakeCard() {
    const card = document.querySelector('.card');
    if (!card) return;
    card.classList.remove('xp-shake');
    // reflow to restart animation
    void card.offsetWidth;
    card.classList.add('xp-shake');
    card.addEventListener('animationend', () => card.classList.remove('xp-shake'), { once: true });
  }

  /* ─── XP chunky progress bar ─── */
  let _progressBar = null;
  let _progressInner = null;
  let _progressRaf = null;
  let _progressValue = 0;

  function getProgressBar() {
    if (!_progressBar) {
      _progressBar = document.createElement('div');
      _progressBar.className = 'xp-progress-wrap';
      _progressBar.setAttribute('role', 'progressbar');
      _progressBar.setAttribute('aria-label', 'Processando...');
      _progressInner = document.createElement('div');
      _progressInner.className = 'xp-progress-inner';
      _progressBar.appendChild(_progressInner);
    }
    return _progressBar;
  }

  function showProgress(container) {
    const bar = getProgressBar();
    _progressValue = 0;
    _progressInner.style.width = '0%';
    if (container && !bar.parentNode) container.prepend(bar);
    animateProgress();
  }

  function animateProgress() {
    cancelAnimationFrame(_progressRaf);
    function step() {
      // Fake fill: fast to 80%, then crawl
      if (_progressValue < 80) _progressValue += 0.8;
      else if (_progressValue < 95) _progressValue += 0.05;
      _progressInner.style.width = _progressValue + '%';
      _progressRaf = requestAnimationFrame(step);
    }
    _progressRaf = requestAnimationFrame(step);
  }

  function completeProgress(success) {
    cancelAnimationFrame(_progressRaf);
    _progressValue = 100;
    if (_progressInner) _progressInner.style.width = '100%';
    if (!success && _progressBar) _progressBar.classList.add('xp-progress--error');
    setTimeout(() => {
      if (_progressBar && _progressBar.parentNode) {
        _progressBar.parentNode.removeChild(_progressBar);
        if (_progressBar) _progressBar.classList.remove('xp-progress--error');
      }
    }, 800);
  }

  /* ─── Hourglass cursor ─── */
  function setCursor(state) {
    document.body.style.cursor = state === 'wait' ? 'wait' : '';
  }

  /* ─── Hook into existing app events ─── */
  function hookAppEvents() {
    // 1. Tab / main-tab clicks → tab SFX
    document.querySelectorAll('.tabbtn, .main-tab, .tool-tab').forEach(btn => {
      btn.addEventListener('click', () => SFX.tab());
    });

    // 2. Generic buttons → click SFX (excluding tabs already hooked)
    document.querySelectorAll('.btn, button:not(.tabbtn):not(.main-tab):not(.tool-tab):not(.xp-mute-btn)').forEach(btn => {
      btn.addEventListener('click', () => SFX.click());
    });

    // 3. Watch for dynamic result/error elements via MutationObserver
    const observer = new MutationObserver(mutations => {
      for (const mut of mutations) {
        mut.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;

          // Progress / loading indicators
          const isLoading = node.classList && (
            node.classList.contains('loading') ||
            node.classList.contains('spinner') ||
            node.querySelector && node.querySelector('.loading, .spinner, [class*="progress"]')
          );
          if (isLoading) {
            setCursor('wait');
            const section = document.querySelector('.section:not([hidden])');
            showProgress(section);
          }

          // Success results
          const isResult = node.classList && (
            node.classList.contains('result') ||
            node.classList.contains('download-link') ||
            node.classList.contains('result-card') ||
            node.querySelector && node.querySelector('a[download], .result, .download-link')
          );
          if (isResult) {
            setCursor('');
            completeProgress(true);
            SFX.success();
            showBalloon('Tarefa concluída! Clique para baixar.', 'success');
          }

          // Error messages
          const isError = node.classList && (
            node.classList.contains('error') ||
            node.classList.contains('alert-danger') ||
            node.classList.contains('msg-error') ||
            (node.tagName === 'P' && node.style && node.style.color && node.style.color.includes('red'))
          );
          if (isError) {
            setCursor('');
            completeProgress(false);
            SFX.error();
            shakeCard();
            showBalloon('Ocorreu um erro. Tente novamente.', 'error');
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('task:done', () => {
      SFX.success();
      showBalloon('Tarefa conclu?da! Clique para baixar.', 'success');
    });
  }

  /* ─── Init ─── */
  function bindLogoMessage() {
    const targets = Array.from(document.querySelectorAll('.logo-wrap, .logo, .saas-brand, .saas-brand-logo'));
    if (!targets.length) return;
    const handler = () => {
      try { SFX.notify(); } catch(_e) {}
      showBalloon('Feito com carinho para quem odeia complicação. Obrigado por usar o MeloTools.', 'info');
    };
    targets.forEach(el => el.addEventListener('click', handler));
  }

  function init() {
    // Inject mute button into titlebar
    const titlebar = document.querySelector('.xp-window-titlebar');
    if (titlebar) {
      const btn = buildMuteBtn();
      titlebar.appendChild(btn);
    }

    hookAppEvents();
    bindLogoMessage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
