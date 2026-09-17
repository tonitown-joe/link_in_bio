document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. DATA SCHEMA (Single Source of Truth)
  // ==========================================
  const LINKS_DATA = [
    {
      id: 'github',
      label: 'Portofolio GitHub',
      url: 'https://github.com',
      icon: '💻',
      isExternal: true
    },
    {
      id: 'linkedin',
      label: 'Profil LinkedIn',
      url: 'https://linkedin.com',
      icon: '💼',
      isExternal: true
    },
    {
      id: 'instagram',
      label: 'Dokumentasi Instagram',
      url: 'https://instagram.com',
      icon: '📸',
      isExternal: true
    },
    {
      id: 'email',
      label: 'Hubungi via Email',
      url: 'mailto:toni@example.com',
      icon: '✉️',
      isExternal: false,
      copyable: true,
      copyValue: 'toni@example.com'
    }
  ];

  const STORAGE_KEY = 'bio_link_clicks';
  const urlParams = new URLSearchParams(window.location.search);
  const isAnalyticsMode = urlParams.get('analytics') === 'true';

  const linksContainer = document.getElementById('links-container');
  const mainCard = document.querySelector('.container');

  if (!linksContainer || !mainCard) return;

  // ==========================================
  // 2. STATE MANAGEMENT (CRUD Telemetry)
  // ==========================================
  function getClickData() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      return rawData ? JSON.parse(rawData) : {};
    } catch (e) {
      return {};
    }
  }

  function trackClick(linkId) {
    const clickData = getClickData();
    clickData[linkId] = (clickData[linkId] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clickData));
  }

  function resetClickData() {
    localStorage.removeItem(STORAGE_KEY);
    render();
  }

  // ==========================================
  // 3. TOAST NOTIFICATION
  // ==========================================
  let toastTimer;
  function triggerToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ==========================================
  // 4. RENDER ENGINE
  // ==========================================
  function render() {
    const clickData = getClickData();

    let adminToolbar = document.getElementById('admin-toolbar');
    if (isAnalyticsMode && !adminToolbar) {
      adminToolbar = document.createElement('div');
      adminToolbar.id = 'admin-toolbar';
      adminToolbar.className = 'admin-toolbar';
      adminToolbar.innerHTML = `
        <span class="status-text">📊 Mode Analitik Aktif</span>
        <button id="btn-reset-analytics" class="btn-reset">Reset Data</button>
      `;
      mainCard.insertBefore(adminToolbar, mainCard.firstChild);

      document.getElementById('btn-reset-analytics').addEventListener('click', () => {
        if (window.confirm('Reset semua catatan klik?')) {
          resetClickData();
        }
      });
    }

    linksContainer.innerHTML = LINKS_DATA.map((item) => {
      const clickCount = clickData[item.id] || 0;
      const badgeHtml = isAnalyticsMode
        ? `<span class="click-badge">${clickCount} klik</span>`
        : '';

      const externalAttr = item.isExternal
        ? 'target="_blank" rel="noopener noreferrer"'
        : '';

      const copyBtnHtml = item.copyable
        ? `<button type="button" class="copy-action-btn" data-copy="${item.copyValue}" aria-label="Salin email">
             📋 <span>Salin</span>
           </button>`
        : '';

      return `
        <a 
          href="${item.url}" 
          ${externalAttr}
          class="link-item" 
          data-id="${item.id}"
        >
          <span class="icon">${item.icon}</span>
          <span class="label">${item.label}</span>
          ${copyBtnHtml}
          ${badgeHtml}
        </a>
      `;
    }).join('');
  }

  // ==========================================
  // 5. EVENT LISTENERS
  // ==========================================
  linksContainer.addEventListener('click', (event) => {
    const copyBtn = event.target.closest('.copy-action-btn');
    if (copyBtn) {
      event.preventDefault();
      event.stopPropagation();

      const textToCopy = copyBtn.getAttribute('data-copy');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          triggerToast(`Tersalin: ${textToCopy} ✨`);
        });
      }
      return;
    }

    const targetLink = event.target.closest('.link-item');
    if (targetLink) {
      const linkId = targetLink.getAttribute('data-id');
      if (linkId) {
        trackClick(linkId);
        if (isAnalyticsMode) render();
      }
    }
  });

  const spotlightBtn = document.querySelector('.spotlight-cta');
  if (spotlightBtn) {
    spotlightBtn.addEventListener('click', () => {
      trackClick('spotlight-portfolio');
      if (isAnalyticsMode) render();
    });
  }

  // ==========================================
  // 6. INISIALISASI FITUR
  // ==========================================
  initThemeToggle();
  initCard3DTilt();
  initRippleEffect();
  initLoFiSoundEngine();

  render();
});

// ==========================================
// 7. HELPER: THEME TOGGLE
// ==========================================
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('user-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersDark) {
    htmlRoot.setAttribute('data-theme', 'dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('user-theme', newTheme);
  });
}

// ==========================================
// 8. HELPER: 3D TILT EFFECT
// ==========================================
function initCard3DTilt() {
  const targetElement = document.querySelector('.spotlight-card');
  if (!targetElement) return;

  const hasMouse = window.matchMedia('(pointer: fine)').matches;
  if (!hasMouse) return;

  targetElement.style.transformStyle = 'preserve-3d';

  targetElement.addEventListener('mousemove', (e) => {
    const rect = targetElement.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / (rect.height / 2)) * 8;
    const rotateY = (x / (rect.width / 2)) * 8;

    targetElement.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  targetElement.addEventListener('mouseleave', () => {
    targetElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

// ==========================================
// 9. HELPER: CLICK RIPPLE
// ==========================================
function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.link-item, .spotlight-card, .btn-reset, .copy-action-btn, .btn-view');
    if (!target) return;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple-wave');

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const clickX = e.clientX - rect.left - size / 2;
    const clickY = e.clientY - rect.top - size / 2;

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${clickX}px`;
    ripple.style.top = `${clickY}px`;

    target.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
}

// ==========================================
// 10. PROCEDURAL LO-FI ENGINE & 4-SLIDER MIXER
// ==========================================
function initLoFiSoundEngine() {
  const musicWidget = document.getElementById('music-widget');
  const toggleBtn = document.getElementById('btn-music-toggle');
  const playIcon = document.getElementById('music-play-icon');
  const statusText = document.getElementById('music-status-text');

  // Sliders DOM
  const masterSlider = document.getElementById('master-vol');
  const rainSlider = document.getElementById('rain-vol');
  const vinylSlider = document.getElementById('vinyl-vol');
  const filterSlider = document.getElementById('filter-freq');

  // Value Badges DOM
  const valMaster = document.getElementById('val-master');
  const valRain = document.getElementById('val-rain');
  const valVinyl = document.getElementById('val-vinyl');
  const valFilter = document.getElementById('val-filter');

  if (!musicWidget || !toggleBtn) return;

  let isPlaying = false;
  let audioCtx = null;
  let chordTimer = null;

  // Web Audio Nodes
  let masterGainNode = null;
  let filterNode = null;
  let rainGainNode = null;
  let vinylGainNode = null;
  let rainSource = null;
  let vinylSource = null;

  // Chord Progression Lo-Fi Mellow (Frekuensi Hz)
  const CHORDS = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [220.00, 261.63, 329.63, 392.00], // Am7
    [293.66, 349.23, 440.00, 523.25], // Dm7
    [196.00, 246.94, 293.66, 349.23]  // G7
  ];
  let chordStep = 0;

  // 1. Buat Buffer Derau Hujan Prosedural (Pink/White Filtered Noise)
  function createRainBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 2; // 2 detik loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink Noise Approximation
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // 2. Buat Buffer Gesekan Piringan Hitam (Vinyl Crackle & Pops)
  function createVinylBuffer(ctx) {
    const bufferSize = ctx.sampleRate * 3; // 3 detik loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Noise latar belakang halus
      let sample = (Math.random() * 2 - 1) * 0.005;
      // Letupan pop/crackle sporadis
      if (Math.random() > 0.9996) {
        sample += (Math.random() * 2 - 1) * 0.35;
      }
      output[i] = sample;
    }
    return buffer;
  }

  // 3. Inisialisasi Graf Node Web Audio
  function initAudioGraph() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Node Master Gain
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.setValueAtTime(parseFloat(masterSlider.value), audioCtx.currentTime);
    masterGainNode.connect(audioCtx.destination);

    // Node Biquad Low-Pass Filter (Meredam frekuensi tinggi agar hangat)
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(parseFloat(filterSlider.value), audioCtx.currentTime);
    filterNode.Q.setValueAtTime(2.5, audioCtx.currentTime);
    filterNode.connect(masterGainNode);

    // Jalur Ambience Hujan
    rainGainNode = audioCtx.createGain();
    rainGainNode.gain.setValueAtTime(parseFloat(rainSlider.value), audioCtx.currentTime);
    const rainFilter = audioCtx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    rainGainNode.connect(rainFilter);
    rainFilter.connect(masterGainNode);

    rainSource = audioCtx.createBufferSource();
    rainSource.buffer = createRainBuffer(audioCtx);
    rainSource.loop = true;
    rainSource.connect(rainGainNode);
    rainSource.start();

    // Jalur Ambience Vinyl Crackle
    vinylGainNode = audioCtx.createGain();
    vinylGainNode.gain.setValueAtTime(parseFloat(vinylSlider.value), audioCtx.currentTime);
    vinylGainNode.connect(masterGainNode);

    vinylSource = audioCtx.createBufferSource();
    vinylSource.buffer = createVinylBuffer(audioCtx);
    vinylSource.loop = true;
    vinylSource.connect(vinylGainNode);
    vinylSource.start();
  }

  // 4. Mainkan Akord Piano Elektrik Lo-Fi
  function playNextChord() {
    if (!isPlaying || !audioCtx || !filterNode) return;
    const now = audioCtx.currentTime;
    const currentChord = CHORDS[chordStep % CHORDS.length];
    chordStep++;

    currentChord.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Envelope ADSR (Attack lembut, Decay natural)
      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.045, now + 0.12);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(oscGain);
      oscGain.connect(filterNode); // Terhubung ke Low-Pass Filter

      osc.start(now);
      osc.stop(now + 2.3);
    });
  }

  function startPlayback() {
    if (!audioCtx) {
      initAudioGraph();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    musicWidget.classList.add('is-playing');
    if (playIcon) playIcon.textContent = '⏸';
    if (statusText) statusText.textContent = 'Generator Aktif • Synth & Ambience';

    playNextChord();
    chordTimer = setInterval(playNextChord, 2400);
  }

  function stopPlayback() {
    isPlaying = false;
    if (chordTimer) {
      clearInterval(chordTimer);
      chordTimer = null;
    }
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }

    musicWidget.classList.remove('is-playing');
    if (playIcon) playIcon.textContent = '▶';
    if (statusText) statusText.textContent = 'Musik dijeda';
  }

  // Toggle Play / Pause
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
  });

  // ==========================================
  // 5. EVENT LISTENERS REAL-TIME SLIDERS
  // ==========================================

  // Master Volume
  masterSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valMaster.textContent = `${Math.round(val * 100)}%`;
    if (masterGainNode && audioCtx) {
      masterGainNode.gain.setValueAtTime(val, audioCtx.currentTime);
    }
  });

  // Rain Volume
  rainSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valRain.textContent = `${Math.round(val * 100)}%`;
    if (rainGainNode && audioCtx) {
      rainGainNode.gain.setValueAtTime(val, audioCtx.currentTime);
    }
  });

  // Vinyl Volume
  vinylSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valVinyl.textContent = `${Math.round(val * 100)}%`;
    if (vinylGainNode && audioCtx) {
      vinylGainNode.gain.setValueAtTime(val, audioCtx.currentTime);
    }
  });

  // Filter Frequency
  filterSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valFilter.textContent = `${val} Hz`;
    if (filterNode && audioCtx) {
      filterNode.frequency.setValueAtTime(val, audioCtx.currentTime);
    }
  });
}