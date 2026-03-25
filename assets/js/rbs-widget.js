// RBS Calculator Widget
// Repo: kiddi-ai | Calls: calculateRBSDemo Cloud Function (MyKidneyPal)

(function () {
  // --- Firebase init ---
  const firebaseConfig = {
    apiKey: "AIzaSyA37hKtrgWYgAW0iXpqQJBhqxQtojzNyUU",
    authDomain: "mykidneypal.firebaseapp.com",
    projectId: "mykidneypal",
    storageBucket: "mykidneypal.firebasestorage.app",
    messagingSenderId: "606323601332",
    appId: "1:606323601332:web:d3bb4aabe2d46d792c0ce1"
  };

  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth(app);
  const functions = firebase.functions(app);
  const calculateRBSDemo = functions.httpsCallable('calculateRBSDemo');

  // Sign in anonymously on load — silent, no UI
  auth.signInAnonymously().catch(function (err) {
    console.warn('Anonymous auth failed:', err.message);
  });

  // --- CKD guidelines (client-side, display only — same values as server) ---
  const GUIDELINES = {
    '1':   { protein: 0.8, sodium: 2300, potassium: 3500, phosphorus: 1000, fluid: 2000 },
    '2':   { protein: 0.8, sodium: 2300, potassium: 3500, phosphorus: 1000, fluid: 2000 },
    '3a':  { protein: 0.6, sodium: 2000, potassium: 3000, phosphorus: 800,  fluid: 1800 },
    '3b':  { protein: 0.6, sodium: 2000, potassium: 2500, phosphorus: 800,  fluid: 1500 },
    '4':   { protein: 0.6, sodium: 2000, potassium: 2000, phosphorus: 800,  fluid: 1500 },
    '5':   { protein: 0.3, sodium: 2000, potassium: 2000, phosphorus: 800,  fluid: 1000 },
    '5d':  { protein: 1.2, sodium: 2000, potassium: 2000, phosphorus: 800,  fluid: 1000 },
  };

  function getGuidelines(ckdStage, dialysisStatus) {
    if (ckdStage === '5' && dialysisStatus !== 'none') return GUIDELINES['5d'];
    return GUIDELINES[ckdStage] || GUIDELINES['3b'];
  }

  function isEarlyStage(ckdStage, dialysisStatus, isFluidRestricted) {
    if (dialysisStatus !== 'none' || isFluidRestricted) return false;
    return ['1', '2', '3a'].includes(ckdStage);
  }

  // --- DOM helpers ---
  function $(id) { return document.getElementById(id); }

  function updateSliderDisplay(sliderId, displayId, suffix) {
    const slider = $(sliderId);
    const display = $(displayId);
    if (!slider || !display) return;
    display.textContent = Number(slider.value).toLocaleString() + suffix;
    slider.addEventListener('input', function () {
      display.textContent = Number(this.value).toLocaleString() + suffix;
    });
  }

  // --- Update displayed guidelines when profile changes ---
  function refreshGuidelines() {
    const ckdStage = $('ckd-stage').value;
    const dialysisStatus = $('dialysis-status').value;
    const isFluidRestricted = $('fluid-restricted').value === 'true';
    const weight = parseFloat($('weight-kg').value) || 70;
    const g = getGuidelines(ckdStage, dialysisStatus);
    const early = isEarlyStage(ckdStage, dialysisStatus, isFluidRestricted);

    // Update hint text
    $('hint-protein').textContent    = 'Target: ' + Math.round(g.protein * weight) + ' g';
    $('hint-sodium').textContent     = 'Limit: ' + g.sodium.toLocaleString() + ' mg';
    $('hint-potassium').textContent  = early ? 'Not tracked at this stage' : 'Limit: ' + g.potassium.toLocaleString() + ' mg';
    $('hint-phosphorus').textContent = early ? 'Not tracked at this stage' : 'Limit: ' + g.phosphorus.toLocaleString() + ' mg';
    $('hint-fluid').textContent      = (dialysisStatus !== 'none' || isFluidRestricted) ? 'Limit: ' + g.fluid.toLocaleString() + ' ml' : 'Target: ' + g.fluid.toLocaleString() + ' ml';

    // Grey out potassium/phosphorus for early stage
    ['potassium', 'phosphorus'].forEach(function (pillar) {
      var row = $(pillar + '-row');
      if (!row) return;
      row.style.opacity = early ? '0.4' : '1';
      row.style.pointerEvents = early ? 'none' : '';
    });

    // Show early-stage explanation banner
    var banner = $('early-stage-banner');
    if (banner) banner.classList.toggle('hidden', !early);
  }

  // --- Render results ---
  function renderResults(data) {
    const results = $('rbs-results');
    results.classList.remove('hidden');
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Score + tier
    const tier = data.tier;
    $('rbs-score-value').textContent = data.totalScore;
    $('rbs-score-ring').style.borderColor = tier.color_hex;
    $('rbs-tier-label').textContent = tier.label;
    $('rbs-tier-label').style.color = tier.color_hex;
    $('rbs-tier-headline').textContent = tier.headline;
    $('rbs-tier-subtext').textContent = tier.sub_text;
    $('rbs-profile-desc').textContent = data.profileDescription;

    // Pillar rows
    const pillars = ['protein', 'sodium', 'potassium', 'phosphorus', 'fluid'];
    const pillarLabels = {
      protein: 'Protein', sodium: 'Sodium', potassium: 'Potassium',
      phosphorus: 'Phosphorus', fluid: 'Fluid'
    };
    const statusColors = {
      Perfect: '#34C759', Optimal: '#34C759', Safe: '#34C759', Stable: '#34C759',
      Good: '#34C759', Acceptable: '#007AFF', Unrestricted: '#6B7280',
      Caution: '#FF9500', Low: '#FF9500', Warning: '#FF9500', Risk: '#FF9500',
      Critical: '#FF3B30', Danger: '#FF3B30', Fail: '#FF3B30', 'Over Limit': '#FF3B30',
    };

    const pillarContainer = $('rbs-pillars');
    pillarContainer.innerHTML = '';
    pillars.forEach(function (key) {
      const p = data.pillars[key];
      if (!p) return;
      const color = statusColors[p.status] || '#6B7280';
      const pct = p.maxPoints > 0 ? Math.round((p.score / p.maxPoints) * 100) : 100;

      const row = document.createElement('div');
      row.className = 'bg-white rounded-xl border border-stone-200 p-4';
      row.innerHTML =
        '<div class="flex items-center justify-between mb-2">' +
          '<span class="font-semibold text-stone-800">' + pillarLabels[key] + '</span>' +
          '<div class="flex items-center gap-2">' +
            '<span class="text-xs font-semibold px-2 py-0.5 rounded-full text-white" style="background:' + color + '">' + p.status + '</span>' +
            '<span class="text-sm text-stone-500">' + p.score + ' / ' + p.maxPoints + ' pts</span>' +
          '</div>' +
        '</div>' +
        '<div class="w-full bg-stone-100 rounded-full h-2 mb-2">' +
          '<div class="h-2 rounded-full transition-all" style="width:' + pct + '%; background:' + color + '"></div>' +
        '</div>' +
        '<p class="text-sm text-stone-600">' + p.feedback + '</p>';
      pillarContainer.appendChild(row);
    });
  }

  // --- Submit handler ---
  function handleCalculate() {
    const btn = $('calculate-btn');
    const error = $('rbs-error');
    error.classList.add('hidden');

    // Gather inputs
    const ckdStage        = $('ckd-stage').value;
    const dialysisStatus  = $('dialysis-status').value;
    const isFluidRestricted = $('fluid-restricted').value === 'true';
    const weightKg        = parseFloat($('weight-kg').value) || 70;
    const proteinG        = parseFloat($('input-protein').value) || 0;
    const sodiumMg        = parseFloat($('input-sodium').value) || 0;
    const potassiumMg     = parseFloat($('input-potassium').value) || 0;
    const phosphorusMg    = parseFloat($('input-phosphorus').value) || 0;
    const fluidMl         = parseFloat($('input-fluid').value) || 0;

    // Loading state
    btn.disabled = true;
    btn.textContent = 'Calculating…';

    calculateRBSDemo({
      ckdStage,
      dialysisStatus,
      isFluidRestricted,
      weightKg,
      nutrients: { proteinG, sodiumMg, potassiumMg, phosphorusMg, fluidMl }
    }).then(function (result) {
      renderResults(result.data);
    }).catch(function (err) {
      var msg = 'Something went wrong. Please try again.';
      if (err.code === 'functions/resource-exhausted') {
        msg = 'You\'ve reached the 20 calculations/day demo limit. Download the app for unlimited access.';
      } else if (err.code === 'functions/unauthenticated') {
        msg = 'Authentication failed. Please refresh the page and try again.';
      }
      error.textContent = msg;
      error.classList.remove('hidden');
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = 'Calculate My RBS';
    });
  }

  // --- Wire up on DOM ready ---
  document.addEventListener('DOMContentLoaded', function () {
    if (!$('rbs-widget')) return; // only run on the calculator page

    // Sync sliders to displays
    updateSliderDisplay('input-protein',    'display-protein',    ' g');
    updateSliderDisplay('input-sodium',     'display-sodium',     ' mg');
    updateSliderDisplay('input-potassium',  'display-potassium',  ' mg');
    updateSliderDisplay('input-phosphorus', 'display-phosphorus', ' mg');
    updateSliderDisplay('input-fluid',      'display-fluid',      ' ml');

    // Profile changes → refresh guideline hints
    ['ckd-stage', 'dialysis-status', 'fluid-restricted', 'weight-kg'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('change', refreshGuidelines);
    });
    refreshGuidelines();

    // Calculate button
    var btn = $('calculate-btn');
    if (btn) btn.addEventListener('click', handleCalculate);
  });
})();
