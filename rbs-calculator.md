---
layout: default
title: "RBS Calculator — Try the Renal Balance Score"
description: "Enter your daily nutrient intake and CKD profile to calculate your Renal Balance Score — the same engine used in the KiDDiAI app."
permalink: /rbs-calculator/
firebase: true
---

<div id="rbs-widget" class="max-w-3xl mx-auto px-6 py-16">

  <header class="mb-10">
    <h1 class="text-3xl md:text-4xl font-bold text-stone-900 mb-4 serif leading-tight">Try the Renal Balance Score</h1>
    <p class="text-lg text-stone-500 leading-relaxed">Enter today's nutrient intake to see your personalised RBS — the same calculation the app runs every day.</p>
    <div class="mt-6 border-b border-stone-200"></div>
  </header>

  <!-- Step 1: Profile -->
  <section class="mb-10">
    <h2 class="text-xl font-bold text-stone-800 mb-1">Step 1 — Your Profile</h2>
    <p class="text-sm text-stone-500 mb-5">Used to select your scoring profile and nutrient targets.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-1" for="ckd-stage">CKD Stage</label>
        <select id="ckd-stage" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="1">Stage 1</option>
          <option value="2">Stage 2</option>
          <option value="3a">Stage 3a</option>
          <option value="3b" selected>Stage 3b</option>
          <option value="4">Stage 4</option>
          <option value="5">Stage 5</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-1" for="dialysis-status">Dialysis</label>
        <select id="dialysis-status" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="none" selected>None</option>
          <option value="hemodialysis">Hemodialysis</option>
          <option value="peritoneal">Peritoneal</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-1" for="fluid-restricted">Fluid Restricted (CHF / Edema)</label>
        <select id="fluid-restricted" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="false" selected>No</option>
          <option value="true">Yes</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-1" for="weight-kg">
          Weight (kg)
          <span class="font-normal text-stone-400 ml-1">— used for protein target</span>
        </label>
        <input id="weight-kg" type="number" min="30" max="200" value="70" placeholder="70"
          class="w-full border border-stone-300 rounded-lg px-3 py-2 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
      </div>

    </div>

    <!-- Early stage banner -->
    <div id="early-stage-banner" class="hidden mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-800">
      <strong>Good news:</strong> At this stage your kidneys still manage potassium and phosphorus well — those pillars are not tracked. Protein and sodium are the focus.
    </div>
  </section>

  <!-- Step 2: Nutrient Intake -->
  <section class="mb-10">
    <h2 class="text-xl font-bold text-stone-800 mb-1">Step 2 — Today's Intake</h2>
    <p class="text-sm text-stone-500 mb-5">Enter what you've eaten and drunk today. Targets update based on your profile above.</p>

    <div class="space-y-5">

      <!-- Protein -->
      <div id="protein-row">
        <div class="flex justify-between items-baseline mb-1">
          <label class="text-sm font-semibold text-stone-700">Protein</label>
          <span class="text-xs text-stone-400" id="hint-protein">Target: — g</span>
        </div>
        <div class="flex items-center gap-3">
          <input id="input-protein" type="range" min="0" max="200" value="40" class="flex-1 accent-emerald-600">
          <span id="display-protein" class="text-sm font-mono w-16 text-right text-stone-700">40 g</span>
        </div>
      </div>

      <!-- Sodium -->
      <div id="sodium-row">
        <div class="flex justify-between items-baseline mb-1">
          <label class="text-sm font-semibold text-stone-700">Sodium</label>
          <span class="text-xs text-stone-400" id="hint-sodium">Limit: — mg</span>
        </div>
        <div class="flex items-center gap-3">
          <input id="input-sodium" type="range" min="0" max="5000" value="1800" step="50" class="flex-1 accent-emerald-600">
          <span id="display-sodium" class="text-sm font-mono w-20 text-right text-stone-700">1,800 mg</span>
        </div>
      </div>

      <!-- Potassium -->
      <div id="potassium-row">
        <div class="flex justify-between items-baseline mb-1">
          <label class="text-sm font-semibold text-stone-700">Potassium</label>
          <span class="text-xs text-stone-400" id="hint-potassium">Limit: — mg</span>
        </div>
        <div class="flex items-center gap-3">
          <input id="input-potassium" type="range" min="0" max="5000" value="2000" step="50" class="flex-1 accent-emerald-600">
          <span id="display-potassium" class="text-sm font-mono w-20 text-right text-stone-700">2,000 mg</span>
        </div>
      </div>

      <!-- Phosphorus -->
      <div id="phosphorus-row">
        <div class="flex justify-between items-baseline mb-1">
          <label class="text-sm font-semibold text-stone-700">Phosphorus</label>
          <span class="text-xs text-stone-400" id="hint-phosphorus">Limit: — mg</span>
        </div>
        <div class="flex items-center gap-3">
          <input id="input-phosphorus" type="range" min="0" max="2000" value="700" step="25" class="flex-1 accent-emerald-600">
          <span id="display-phosphorus" class="text-sm font-mono w-20 text-right text-stone-700">700 mg</span>
        </div>
      </div>

      <!-- Fluid -->
      <div id="fluid-row">
        <div class="flex justify-between items-baseline mb-1">
          <label class="text-sm font-semibold text-stone-700">Fluid</label>
          <span class="text-xs text-stone-400" id="hint-fluid">Target: — ml</span>
        </div>
        <div class="flex items-center gap-3">
          <input id="input-fluid" type="range" min="0" max="3500" value="1500" step="50" class="flex-1 accent-emerald-600">
          <span id="display-fluid" class="text-sm font-mono w-20 text-right text-stone-700">1,500 ml</span>
        </div>
      </div>

    </div>
  </section>

  <!-- Calculate button -->
  <div class="mb-8">
    <button id="calculate-btn"
      class="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-lg py-4 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
      Calculate My RBS
    </button>
    <div id="rbs-error" class="hidden mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"></div>
  </div>

  <!-- Results (hidden until first calculation) -->
  <section id="rbs-results" class="hidden">

    <div class="border-t border-stone-200 pt-10 mb-8">
      <h2 class="text-xl font-bold text-stone-800 mb-6">Your Renal Balance Score</h2>

      <!-- Score card -->
      <div class="flex flex-col sm:flex-row items-center gap-6 bg-white border border-stone-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div id="rbs-score-ring"
          class="flex-shrink-0 w-28 h-28 rounded-full border-8 flex items-center justify-center"
          style="border-color: #6B7280">
          <span id="rbs-score-value" class="text-4xl font-bold text-stone-900">—</span>
        </div>
        <div>
          <div id="rbs-tier-label" class="text-2xl font-bold mb-1">—</div>
          <div id="rbs-tier-headline" class="font-semibold text-stone-800 mb-1">—</div>
          <div id="rbs-tier-subtext" class="text-sm text-stone-500 mb-2">—</div>
          <div id="rbs-profile-desc" class="text-xs text-stone-400 italic">—</div>
        </div>
      </div>

      <!-- Pillar breakdown -->
      <h3 class="text-base font-semibold text-stone-700 mb-3">Pillar Breakdown</h3>
      <div id="rbs-pillars" class="space-y-3"></div>
    </div>

    <!-- CTA -->
    <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
      <p class="font-semibold text-emerald-900 text-lg mb-1">Get your personalised RBS every day</p>
      <p class="text-sm text-emerald-700 mb-5">The app logs your meals automatically, uses your doctor's exact limits, and tracks your score over time.</p>
      <div class="flex flex-col sm:flex-row justify-center gap-3">
        <a href="https://apps.apple.com/app/kiddiai/id6755172184" target="_blank"
          class="inline-block bg-stone-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-700 transition shadow">
          Download on the App Store
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.nutri_thera.KiddiAI" target="_blank"
          class="inline-block bg-stone-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-emerald-700 transition shadow">
          Get it on Google Play
        </a>
      </div>
    </div>

    <!-- Disclaimer -->
    <p class="mt-6 text-xs text-stone-400 leading-relaxed text-center">
      This calculator uses standard KDOQI guidelines for demonstration. It does not replace medical advice.
      Your nephrologist or renal dietitian may prescribe different limits — use the app to enter those exactly.
    </p>

  </section>
</div>
