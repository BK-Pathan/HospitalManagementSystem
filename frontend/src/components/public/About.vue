<template>
  <section id="hero" class="hero-section">
    <!-- ambient background texture -->
    <div class="hero-bg" aria-hidden="true">
      <div class="bg-dots"></div>
      <div class="bg-glow bg-glow--teal"></div>
      <div class="bg-glow bg-glow--coral"></div>
    </div>

    <div class="container">

      <!-- Left : content -->
      <div class="hero-content">

        <div class="eyebrow">
          <span class="eyebrow-dot" aria-hidden="true"></span>
          TRUSTED CARE NETWORK
        </div>

        <h1 class="headline">
          Providing Trusted Healthcare
          <span>For Every Patient</span>
        </h1>

        <p class="lede">
          Our hospital is committed to delivering exceptional medical care
          with experienced doctors, advanced technology, and compassionate
          service — measured in outcomes, not just appointments.
        </p>

        <div class="features">
          <div class="feature">
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M6 3v6a4 4 0 0 0 8 0V3" stroke-linecap="round"/>
                <path d="M18 9v2a6 6 0 0 1-12 0V9" stroke-linecap="round"/>
                <circle cx="18" cy="6" r="2.2"/>
              </svg>
            </span>
            <span>Experienced Specialists</span>
          </div>

          <div class="feature">
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3.5 2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span>24/7 Emergency Services</span>
          </div>

          <div class="feature">
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M3 12h4l2-6 4 12 2-6h6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span>Modern Medical Equipment</span>
          </div>

          <div class="feature">
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M12 20s-7-4.3-9.5-8.8C1 8 2.4 4.8 5.6 4.1 8 3.6 10 4.8 12 7c2-2.2 4-3.4 6.4-2.9 3.2.7 4.6 3.9 3.1 7.1C19 15.7 12 20 12 20Z"/>
              </svg>
            </span>
            <span>Affordable Healthcare</span>
          </div>
        </div>

        <div class="cta-row">
          <router-link to="/login" class="btn">
            Learn More
          </router-link>
          <a href="#emergency" class="btn-ghost">
            Emergency line, 24/7
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div class="trust-strip">
          <span><strong>15,240+</strong> patients cared for</span>
          <span class="divider" aria-hidden="true">·</span>
          <span><strong>42</strong> specialists on staff</span>
          <span class="divider" aria-hidden="true">·</span>
          <span><strong>24/7</strong> doors open</span>
        </div>

      </div>

      <!-- Right : vitals panel (signature visual) -->
      <div class="hero-visual">
        <div class="vitals-card">

          <div class="vitals-card-header">
            <span class="rec-dot" aria-hidden="true"></span>
            LIVE · WARD MONITOR
          </div>

          <div class="pulse-track" aria-hidden="true">
            <svg class="pulse-svg" viewBox="0 0 900 140" preserveAspectRatio="none">
              <path
                class="pulse-path"
                d="M0,70 H150 L168,30 L186,110 L204,18 L222,105 L240,70 H360
                   L378,50 L396,86 L414,70 H900"
                fill="none"
              />
            </svg>
            <svg class="pulse-svg" viewBox="0 0 900 140" preserveAspectRatio="none">
              <path
                class="pulse-path"
                d="M0,70 H150 L168,30 L186,110 L204,18 L222,105 L240,70 H360
                   L378,50 L396,86 L414,70 H900"
                fill="none"
              />
            </svg>
          </div>

          <div class="vitals-readout">
            <div class="readout-item">
              <span class="readout-value">72</span>
              <span class="readout-label">bpm avg</span>
            </div>
            <div class="readout-item">
              <span class="readout-value">98%</span>
              <span class="readout-label">SpO₂</span>
            </div>
            <div class="readout-item">
              <span class="readout-value">120/80</span>
              <span class="readout-label">mmHg</span>
            </div>
          </div>

        </div>

        <div class="floating-badge floating-badge--top">
          <span class="badge-value">24/7</span>
          <span class="badge-label">Emergency Response</span>
        </div>

        <div class="floating-badge floating-badge--bottom">
          <span class="badge-value">98%</span>
          <span class="badge-label">Patient Satisfaction</span>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.hero-section {
  --ink: #10261f;
  --muted: #5c6d66;
  --paper: #f6faf8;
  --teal-800: #0a3a2c;
  --teal-700: #0d5a41;
  --teal-600: #0e7a56;
  --teal-100: #e3f2ea;
  --coral: #ff6b4a;
  --coral-600: #e5502e;
  --pulse: #35d07f;

  position: relative;
  overflow: hidden;
  padding: 130px 8% 100px;
  background: var(--paper);
  font-family: 'Inter', sans-serif;
  color: var(--ink);
}

/* ---------- ambient background ---------- */
.hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }

.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(10,58,44,.09) 1.4px, transparent 1.4px);
  background-size: 26px 26px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 85%);
}

.bg-glow {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  filter: blur(90px);
  opacity: .22;
}
.bg-glow--teal { background: var(--teal-600); top: -180px; left: -140px; }
.bg-glow--coral { background: var(--coral); bottom: -220px; right: -160px; opacity: .14; }

/* ---------- layout ---------- */
.container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 80px;
  max-width: 1300px;
  margin: auto;
}

/* ---------- left content ---------- */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: var(--teal-700);
  margin-bottom: 22px;
}

.eyebrow-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pulse);
  box-shadow: 0 0 0 0 rgba(53,208,127,.55);
  animation: dot-pulse 1.8s ease-out infinite;
}

@keyframes dot-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(53,208,127,.55); }
  70%  { box-shadow: 0 0 0 9px rgba(53,208,127,0); }
  100% { box-shadow: 0 0 0 0 rgba(53,208,127,0); }
}

.headline {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 46px;
  line-height: 1.18;
  letter-spacing: -.5px;
  margin: 0 0 22px;
  color: var(--teal-800);
}
.headline span { display: block; color: var(--coral); }

.lede {
  font-size: 17.5px;
  line-height: 1.85;
  color: var(--muted);
  max-width: 46ch;
  margin: 0 0 34px;
}

.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 38px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1px solid rgba(10,58,44,.08);
  padding: 15px 16px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 14.5px;
  color: var(--teal-800);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.feature:hover {
  transform: translateY(-4px);
  border-color: rgba(14,122,86,.25);
  box-shadow: 0 14px 30px rgba(10,58,44,.09);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--teal-100);
  color: var(--teal-700);
}
.feature-icon svg { width: 18px; height: 18px; }

.cta-row {
  display: flex;
  align-items: center;
  gap: 26px;
  flex-wrap: wrap;
  margin-bottom: 34px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 15px 32px;
  background: var(--coral);
  color: #fff;
  text-decoration: none;
  border-radius: 40px;
  font-weight: 600;
  font-size: 15px;
  transition: background .25s ease, transform .25s ease, box-shadow .25s ease;
  box-shadow: 0 14px 28px rgba(255,107,74,.28);
}
.btn:hover { background: var(--coral-600); transform: translateY(-3px); }
.btn:focus-visible { outline: 2px solid var(--teal-700); outline-offset: 3px; }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--teal-800);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  border-bottom: 1px solid rgba(10,58,44,.3);
  padding-bottom: 2px;
  transition: gap .2s ease, color .2s ease;
}
.btn-ghost:hover { gap: 12px; color: var(--coral-600); }
.btn-ghost:focus-visible { outline: 2px solid var(--teal-700); outline-offset: 3px; }

.trust-strip {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  color: var(--muted);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.trust-strip strong { color: var(--teal-800); }
.divider { color: rgba(10,58,44,.3); }

/* ---------- right visual : vitals monitor ---------- */
.hero-visual { position: relative; }

.vitals-card {
  position: relative;
  border-radius: 28px;
  padding: 34px 30px 28px;
  background: linear-gradient(160deg, var(--teal-800) 0%, var(--teal-700) 55%, var(--teal-600) 100%);
  box-shadow: 0 30px 70px rgba(10,58,44,.28);
  overflow: hidden;
}

.vitals-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 600;
  color: rgba(255,255,255,.75);
  margin-bottom: 26px;
}

.rec-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--pulse);
  animation: dot-pulse 1.8s ease-out infinite;
}

.pulse-track {
  position: relative;
  height: 110px;
  display: flex;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(0,0,0,.16);
  margin-bottom: 26px;
}

.pulse-svg {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  animation: pulse-scroll 6s linear infinite;
}
.pulse-path {
  stroke: var(--pulse);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 6px rgba(53,208,127,.65));
}

@keyframes pulse-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-100%); }
}

.vitals-readout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.readout-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 6px;
  border-radius: 12px;
  background: rgba(255,255,255,.07);
  text-align: center;
}
.readout-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}
.readout-label {
  font-size: 11.5px;
  color: rgba(255,255,255,.6);
  letter-spacing: .4px;
}

.floating-badge {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #fff;
  padding: 14px 20px;
  border-radius: 16px;
  box-shadow: 0 18px 36px rgba(10,58,44,.16);
  animation: float 5s ease-in-out infinite;
}
.floating-badge--top { top: -22px; right: 12px; animation-delay: 0s; }
.floating-badge--bottom { bottom: -22px; left: 8px; animation-delay: 1.4s; }

.badge-value {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: 20px;
  color: var(--teal-700);
}
.badge-label { font-size: 12px; color: var(--muted); font-weight: 500; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

/* ---------- motion accessibility ---------- */
@media (prefers-reduced-motion: reduce) {
  .eyebrow-dot, .rec-dot, .floating-badge, .pulse-svg {
    animation: none !important;
  }
}

/* ---------- responsive ---------- */
@media (max-width: 992px) {
  .hero-section { padding: 100px 6% 80px; }
  .container { grid-template-columns: 1fr; gap: 56px; }
  .hero-content { text-align: center; }
  .lede { margin-left: auto; margin-right: auto; }
  .features { grid-template-columns: 1fr; }
  .cta-row { justify-content: center; }
  .trust-strip { justify-content: center; }
  .headline { font-size: 34px; }
  .hero-visual { max-width: 460px; margin: 0 auto; }
  .floating-badge--top { right: -6px; }
  .floating-badge--bottom { left: -6px; }
}

@media (max-width: 480px) {
  .floating-badge { padding: 10px 14px; }
  .badge-value { font-size: 16px; }
  .vitals-readout { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .readout-value { font-size: 16px; }
}
</style>