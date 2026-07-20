<template>
  <section class="hero" ref="heroRef">

    <!-- Ambient mesh background -->
    <div class="mesh-bg">
      <div class="mesh-blob blob-a" ref="blobARef"></div>
      <div class="mesh-blob blob-b" ref="blobBRef"></div>
      <div class="mesh-blob blob-c" ref="blobCRef"></div>
    </div>

    <!-- Signature element: an ambient vital-sign line that runs the
         full width of the hero, behind everything else. It's the one
         piece of "system heartbeat" imagery the whole page is built
         around — quiet, not literal, not a stethoscope icon. -->
    <svg class="pulse-signature" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
      <path
        class="pulse-signature-path"
        d="M0,100 L280,100 L320,40 L360,160 L400,70 L430,100 L1440,100"
      />
    </svg>

    <!-- Cursor-reactive ambient light -->
    <div class="spotlight" ref="spotlightRef"></div>

    <!-- Floating particles -->
    <div class="particles" aria-hidden="true">
      <span
        v-for="p in particles"
        :key="p.id"
        class="particle"
        :style="p.style"
      ></span>
    </div>

    <div class="container">

      <!-- Left: copy -->
      <div class="hero-content">

        <span class="tag reveal" style="--d:0s">
          <span class="tag-dot"></span>
          Trusted by 500+ Hospitals Worldwide
        </span>

        <h1 class="reveal" style="--d:.08s">
          The operating system<br>
          <span class="accent">for modern healthcare</span>
        </h1>

        <p class="reveal" style="--d:.16s">
          One record, one schedule, one source of truth — Aurelia
          unifies patient care, staffing and hospital operations
          for the health systems built to last a century.
        </p>

        <div class="buttons reveal" style="--d:.24s">

          <router-link to="/login" class="book-btn magnetic" ref="btn1Ref">
            <span class="btn-sheen"></span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" stroke-width="1.8"/>
              <path d="M3.5 9.5H20.5" stroke="currentColor" stroke-width="1.8"/>
              <path d="M8 3V6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M16 3V6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <span>Book a Demo</span>
          </router-link>

          <router-link to="/login" class="secondary-btn magnetic" ref="btn2Ref">
            <span class="play-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 7.5V16.5L16.5 12L9 7.5Z" fill="currentColor"/>
              </svg>
            </span>
            <span>Watch Product Tour</span>
          </router-link>

        </div>

        <div class="trust reveal" style="--d:.32s">

          <div class="metric">
            <h2>500+</h2>
            <span>Hospitals</span>
          </div>

          <div class="metric-divider"></div>

          <div class="metric">
            <h2>2M+</h2>
            <span>Patient Records</span>
          </div>

          <div class="metric-divider"></div>

          <div class="metric">
            <h2>99.9%</h2>
            <span>Uptime SLA</span>
          </div>

        </div>

      </div>

      <!-- Right: floating dashboard mockup -->
      <div class="hero-visual" ref="visualRef">

        <div class="dash-ring"></div>
        <div class="dash-ring dash-ring-2"></div>

        <!-- Main panel -->
        <div class="dash-panel dash-main" data-depth="0.35">

          <div class="dash-header">
            <span class="dash-title">Patient Overview</span>
            <span class="live-badge"><i></i>Live</span>
          </div>

          <div class="dash-chart">
            <span
              v-for="(bar, i) in chartBars"
              :key="i"
              class="bar"
              :style="{ height: bar + '%', animationDelay: (i * 0.07) + 's' }"
            ></span>
          </div>

          <div class="dash-footer">
            <span>This Week</span>
            <strong>+18.4%</strong>
          </div>

        </div>

        <!-- Vitals monitor -->
        <div class="dash-panel dash-float dash-vitals" data-depth="0.85">

          <div class="vitals-head">
            <span class="pulse-dot"></span>
            Vitals Monitor
          </div>

          <svg class="ecg" viewBox="0 0 130 40" preserveAspectRatio="none">
            <path class="ecg-path" d="M0 22 L24 22 L30 6 L38 36 L46 22 L130 22" />
          </svg>

          <strong class="vitals-reading">72 <small>BPM</small></strong>

        </div>

        <!-- Appointments -->
        <div class="dash-panel dash-float dash-appointments" data-depth="0.55">

          <span class="mini-icon">📅</span>

          <div>
            <strong>128</strong>
            <small>Appointments Today</small>
          </div>

        </div>

        <!-- Bed occupancy -->
        <div class="dash-panel dash-float dash-occupancy" data-depth="1.05">

          <div class="ring-chart">

            <svg viewBox="0 0 80 80">
              <circle class="ring-bg" cx="40" cy="40" r="34" />
              <circle class="ring-fg" cx="40" cy="40" r="34" />
            </svg>

            <span>82%</span>

          </div>

          <small>Bed Occupancy</small>

        </div>

      </div>

    </div>

    <!-- Scroll cue -->
    <div class="scroll-cue" ref="cueRef">
      <span>Scroll</span>
      <div class="scroll-cue-line"><i></i></div>
    </div>

    <!-- Wave transition into the next section -->
    <svg class="wave" viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
      <path class="wave-path wave-path-1" d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,110 L0,110 Z" />
      <path class="wave-path wave-path-2" d="M0,80 C260,30 500,110 760,64 C1020,18 1260,90 1440,64 L1440,110 L0,110 Z" />
    </svg>

  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const heroRef = ref(null);
const visualRef = ref(null);
const spotlightRef = ref(null);
const blobARef = ref(null);
const blobBRef = ref(null);
const blobCRef = ref(null);
const cueRef = ref(null);
const btn1Ref = ref(null);
const btn2Ref = ref(null);

const chartBars = [38, 60, 46, 74, 58, 88, 66, 96];

// Lightweight floating particles, generated once — no per-frame cost
const particles = Array.from({ length: 16 }, (_, i) => {

  const left = Math.random() * 100;
  const size = 2 + Math.random() * 3;
  const duration = 10 + Math.random() * 10;
  const delay = Math.random() * -20;

  return {
    id: i,
    style: {
      left: left + "%",
      width: size + "px",
      height: size + "px",
      animationDuration: duration + "s",
      animationDelay: delay + "s",
    },
  };

});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;
const canDoCursorFx = !prefersReducedMotion && isFinePointer;

let rafId = null;
let scrollTicking = false;

// ---------- Cursor-reactive spotlight + multi-layer mouse parallax ----------

function handleMouseMove(e) {

  if (!canDoCursorFx || rafId) return;

  rafId = requestAnimationFrame(() => {

    const hero = heroRef.value;
    rafId = null;

    if (!hero) return;

    const rect = hero.getBoundingClientRect();

    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    if (spotlightRef.value) {
      spotlightRef.value.style.setProperty("--mx", xPct + "%");
      spotlightRef.value.style.setProperty("--my", yPct + "%");
    }

    // normalized -1..1 from center, drives independent parallax
    // depth per dashboard panel — several layers moving at
    // different rates is what sells the cinematic depth
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    if (visualRef.value) {

      const panels = visualRef.value.querySelectorAll("[data-depth]");

      panels.forEach((panel) => {

        const depth = parseFloat(panel.dataset.depth) || 0.5;

        const moveX = nx * depth * 14;
        const moveY = ny * depth * 14;

        panel.style.setProperty("--mx-shift", moveX + "px");
        panel.style.setProperty("--my-shift", moveY + "px");

      });

      visualRef.value.style.setProperty("--tilt-x", (ny * -4) + "deg");
      visualRef.value.style.setProperty("--tilt-y", (nx * 4) + "deg");

    }

  });

}

function resetMouseFx() {

  if (visualRef.value) {

    visualRef.value.style.setProperty("--tilt-x", "0deg");
    visualRef.value.style.setProperty("--tilt-y", "0deg");

    visualRef.value.querySelectorAll("[data-depth]").forEach((panel) => {
      panel.style.setProperty("--mx-shift", "0px");
      panel.style.setProperty("--my-shift", "0px");
    });

  }

}

// ---------- Magnetic buttons ----------

function attachMagnetic(el) {

  if (!el || !canDoCursorFx) return;

  const strength = 0.35;

  function onMove(e) {

    const rect = el.getBoundingClientRect();

    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;

  }

  function onLeave() {
    el.style.transform = "translate(0, 0)";
  }

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };

}

// ---------- Scroll parallax (separate, slower-moving layers) ----------

function handleScroll() {

  if (prefersReducedMotion || scrollTicking) return;

  scrollTicking = true;

  requestAnimationFrame(() => {

    const hero = heroRef.value;
    scrollTicking = false;

    if (!hero) return;

    const rect = hero.getBoundingClientRect();

    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

    const scrolled = Math.min(Math.max(-rect.top, 0), hero.offsetHeight);

    if (blobARef.value) blobARef.value.style.transform = `translate3d(0, ${scrolled * 0.12}px, 0)`;
    if (blobBRef.value) blobBRef.value.style.transform = `translate3d(0, ${scrolled * 0.22}px, 0)`;
    if (blobCRef.value) blobCRef.value.style.transform = `translate3d(0, ${scrolled * 0.16}px, 0)`;

    if (visualRef.value) {
      visualRef.value.style.setProperty("--scroll-shift", (scrolled * 0.1) + "px");
    }

    if (cueRef.value) {
      cueRef.value.style.opacity = String(Math.max(1 - scrolled / 220, 0));
    }

  });

}

let detachMagnetic = [];

onMounted(() => {

  window.addEventListener("scroll", handleScroll, { passive: true });

  if (canDoCursorFx) {

    const hero = heroRef.value;

    hero?.addEventListener("mousemove", handleMouseMove);
    hero?.addEventListener("mouseleave", resetMouseFx);

    detachMagnetic = [attachMagnetic(btn1Ref.value), attachMagnetic(btn2Ref.value)];

  }

  handleScroll();

});

onUnmounted(() => {

  window.removeEventListener("scroll", handleScroll);

  heroRef.value?.removeEventListener("mousemove", handleMouseMove);
  heroRef.value?.removeEventListener("mouseleave", resetMouseFx);

  detachMagnetic.forEach((fn) => fn && fn());

  if (rafId) cancelAnimationFrame(rafId);

});
</script>

<style scoped>

/* Display face carries the "clinical trust, not startup hype" tone;
   Inter stays quiet in body copy; the mono face is reserved for the
   dashboard's live numbers so data reads as data. */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

.hero,
.hero * {

    box-sizing: border-box;

}

.hero {

    /* Local tokens layered on the app's --primary / --secondary
       so this stays on-brand automatically. If those aren't defined
       upstream, a clinical-teal / molten-amber pair is a sensible
       default: --primary:#1FB6A8; --secondary:#E8935B; */
    --ease: cubic-bezier(.22,1,.36,1);

    --font-display: 'Fraunces', ui-serif, Georgia, serif;
    --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;

    --glass-bg: rgba(255,255,255,.06);
    --glass-bg-strong: rgba(255,255,255,.09);
    --glass-border: rgba(255,255,255,.14);

    --ink: #f5f7fb;
    --ink-muted: rgba(245,247,251,.68);

    position: relative;

    min-height: 100vh;

    display: flex;
    align-items: center;

    overflow: hidden;

    font-family: var(--font-body);

    background:
        radial-gradient(ellipse 60% 50% at 15% 10%, color-mix(in srgb, var(--primary) 30%, transparent), transparent 60%),
        radial-gradient(ellipse 55% 45% at 90% 85%, color-mix(in srgb, var(--secondary) 26%, transparent), transparent 60%),
        linear-gradient(180deg, #05070c, #0a0f1a 55%, #05070c);

    color: var(--ink);

}

/* ============ Ambient mesh background ============ */

.mesh-bg {

    position: absolute;
    inset: 0;

    pointer-events: none;

}

.mesh-blob {

    position: absolute;

    filter: blur(80px);

    opacity: .55;

    animation: morph 16s ease-in-out infinite, drift 22s ease-in-out infinite;

    will-change: transform, border-radius;

}

.blob-a {

    width: 560px;
    height: 560px;

    top: -14%;
    left: -8%;

    background: radial-gradient(circle, color-mix(in srgb, var(--primary) 75%, transparent), transparent 70%);

    animation-duration: 18s, 24s;

}

.blob-b {

    width: 460px;
    height: 460px;

    bottom: -16%;
    right: -6%;

    background: radial-gradient(circle, color-mix(in srgb, var(--secondary) 75%, transparent), transparent 70%);

    animation-duration: 20s, 26s;
    animation-delay: -4s, -8s;

}

.blob-c {

    width: 340px;
    height: 340px;

    top: 38%;
    left: 42%;

    background: radial-gradient(circle, rgba(255,255,255,.18), transparent 70%);

    opacity: .35;

    animation-duration: 14s, 30s;
    animation-delay: -6s, -2s;

}

@keyframes morph {

    0%,100% { border-radius: 42% 58% 63% 37% / 41% 45% 55% 59%; }
    33% { border-radius: 63% 37% 42% 58% / 55% 41% 59% 45%; }
    66% { border-radius: 37% 63% 58% 42% / 45% 59% 41% 55%; }

}

@keyframes drift {

    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(30px,-24px) scale(1.08); }

}

/* ============ Signature: ambient vital-sign line ============ */

.pulse-signature {

    position: absolute;

    left: 0;
    top: 50%;

    width: 100%;
    height: 200px;

    transform: translateY(-50%);

    opacity: .5;

    pointer-events: none;

}

.pulse-signature-path {

    fill: none;

    stroke: url(#pulse-gradient);
    stroke-width: 1.4;

    stroke-dasharray: 6 3400;
    stroke-dashoffset: 0;

    animation: pulse-travel 7s linear infinite;

}

@keyframes pulse-travel {

    0% { stroke-dasharray: 6 3400; stroke-dashoffset: 0; }
    55% { stroke-dasharray: 900 3400; stroke-dashoffset: -900; }
    100% { stroke-dasharray: 6 3400; stroke-dashoffset: -3400; }

}

/* ============ Cursor-reactive spotlight ============ */

.spotlight {

    position: absolute;
    inset: 0;

    --mx: 50%;
    --my: 35%;

    background: radial-gradient(
        480px circle at var(--mx) var(--my),
        rgba(255,255,255,.08),
        transparent 65%
    );

    mix-blend-mode: screen;

    pointer-events: none;

    transition: background .15s linear;

}

/* ============ Floating particles ============ */

.particles {

    position: absolute;
    inset: 0;

    pointer-events: none;

}

.particle {

    position: absolute;

    bottom: -10px;

    border-radius: 50%;

    background: rgba(255,255,255,.55);

    box-shadow: 0 0 6px rgba(255,255,255,.5);

    animation-name: particle-rise;
    animation-timing-function: linear;
    animation-iteration-count: infinite;

}

@keyframes particle-rise {

    0% {

        transform: translateY(0) translateX(0);

        opacity: 0;

    }

    10% { opacity: .8; }

    90% { opacity: .4; }

    100% {

        transform: translateY(-110vh) translateX(24px);

        opacity: 0;

    }

}

/* ============ Layout ============ */

.container {

    position: relative;
    z-index: 2;

    width: min(1300px,92%);
    margin: auto;

    display: grid;
    grid-template-columns: 1.05fr .95fr;

    align-items: center;
    gap: 60px;

}

.hero-content {

    max-width: 600px;

}

/* Entrance animation, staggered per-element via --d */

.reveal {

    opacity: 0;

    animation: reveal-up .8s var(--ease) forwards;
    animation-delay: var(--d, 0s);

}

@keyframes reveal-up {

    from { opacity: 0; transform: translateY(26px); }
    to { opacity: 1; transform: translateY(0); }

}

/* ============ Tag ============ */

.tag {

    display: inline-flex;
    align-items: center;
    gap: 10px;

    background: var(--glass-bg);

    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);

    color: var(--ink);

    padding: 9px 20px 9px 16px;

    border-radius: 50px;

    font-weight: 600;
    font-size: 13px;
    letter-spacing: .01em;

    border: 1px solid var(--glass-border);

}

.tag-dot {

    width: 7px;
    height: 7px;
    border-radius: 50%;

    background: color-mix(in srgb, var(--primary) 70%, white);

    box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 30%, transparent);

    animation: pulse 2.2s ease-in-out infinite;

    flex-shrink: 0;

}

@keyframes pulse {

    0%,100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.35); opacity: .6; }

}

/* ============ Headline ============ */

h1 {

    margin: 24px 0;

    font-family: var(--font-display);

    font-size: clamp(36px, 4.4vw, 60px);

    color: var(--ink);

    line-height: 1.1;
    letter-spacing: -.01em;
    font-weight: 600;

}

h1 .accent {

    font-style: italic;
    font-weight: 500;

    background: linear-gradient(100deg,
        color-mix(in srgb, var(--primary) 80%, white),
        color-mix(in srgb, var(--secondary) 80%, white) 60%,
        color-mix(in srgb, var(--primary) 80%, white));

    background-size: 200% auto;

    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    animation: shine 6s linear infinite;

}

@keyframes shine {

    to { background-position: 200% center; }

}

p {

    color: var(--ink-muted);

    font-size: 17.5px;

    line-height: 1.8;

    max-width: 480px;

}

/* ============ Buttons ============ */

.buttons {

    display: flex;
    align-items: center;
    flex-wrap: wrap;

    gap: 16px;

    margin: 36px 0;

}

.book-btn,
.secondary-btn {

    position: relative;
    overflow: hidden;

    display: inline-flex;
    align-items: center;

    gap: 10px;

    text-decoration: none;

    padding: 15px 28px;

    border-radius: 50px;

    font-family: var(--font-body);
    font-weight: 700;
    font-size: 15px;

    transition: transform .25s var(--ease), box-shadow .35s var(--ease), background .35s var(--ease), border-color .35s var(--ease);

}

.book-btn svg {

    width: 19px;
    height: 19px;

}

.book-btn {

    color: white;

    background: linear-gradient(135deg, var(--primary), var(--secondary));

    box-shadow:
        0 2px 3px rgba(0,0,0,.2),
        0 18px 36px -14px color-mix(in srgb, var(--primary) 70%, transparent),
        inset 0 1px 0 rgba(255,255,255,.35);

}

.btn-sheen {

    position: absolute;

    top: 0;
    left: -60%;

    width: 40%;
    height: 100%;

    background: linear-gradient(115deg, transparent, rgba(255,255,255,.55), transparent);

    transform: skewX(-20deg);

    transition: left .6s var(--ease);

}

.book-btn:hover .btn-sheen {

    left: 120%;

}

.book-btn:hover {

    box-shadow:
        0 2px 3px rgba(0,0,0,.2),
        0 24px 46px -14px color-mix(in srgb, var(--primary) 78%, transparent),
        inset 0 1px 0 rgba(255,255,255,.4);

}

.secondary-btn {

    color: var(--ink);

    background: var(--glass-bg);

    border: 1.5px solid var(--glass-border);

    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

}

.play-icon {

    display: flex;
    align-items: center;
    justify-content: center;

    width: 26px;
    height: 26px;

    border-radius: 50%;

    background: rgba(255,255,255,.12);

    color: var(--ink);

}

.play-icon svg {

    width: 14px;
    height: 14px;

}

.secondary-btn:hover {

    background: var(--glass-bg-strong);

    border-color: rgba(255,255,255,.28);

}

/* ============ Trust metrics ============ */

.trust {

    display: flex;
    align-items: center;

    gap: 22px;

}

.metric h2 {

    font-family: var(--font-mono);

    font-size: 24px;
    font-weight: 600;

    color: var(--ink);

    margin: 0 0 4px;

}

.metric span {

    color: var(--ink-muted);

    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: .02em;

}

.metric-divider {

    width: 1px;
    height: 34px;

    background: var(--glass-border);

}

/* ============ Dashboard visual ============ */

.hero-visual {

    position: relative;

    height: 520px;

    --tilt-x: 0deg;
    --tilt-y: 0deg;
    --scroll-shift: 0px;

    transform-style: preserve-3d;

    perspective: 1400px;

}

.dash-ring {

    position: absolute;

    inset: 6% 8%;

    border-radius: 50%;

    border: 1px dashed rgba(255,255,255,.14);

    animation: spin 50s linear infinite;

}

.dash-ring-2 {

    inset: 14% 16%;

    border-color: rgba(255,255,255,.08);

    animation-duration: 70s;
    animation-direction: reverse;

}

@keyframes spin {

    to { transform: rotate(360deg); }

}

.dash-panel {

    position: absolute;

    border-radius: 20px;

    background: var(--glass-bg);

    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);

    border: 1px solid transparent;

    background-image:
        linear-gradient(var(--glass-bg), var(--glass-bg)),
        linear-gradient(135deg, color-mix(in srgb, var(--primary) 70%, white), color-mix(in srgb, var(--secondary) 60%, white) 60%, transparent);

    background-origin: border-box;
    background-clip: padding-box, border-box;

    box-shadow:
        0 2px 3px rgba(0,0,0,.2),
        0 30px 60px -24px rgba(0,0,0,.6),
        inset 0 1px 0 rgba(255,255,255,.12);

    transform:
        translate3d(
            calc(var(--mx-shift, 0px)),
            calc(var(--my-shift, 0px) + var(--scroll-shift, 0px)),
            0
        )
        rotateX(var(--tilt-x))
        rotateY(var(--tilt-y));

    transition: transform .25s var(--ease), box-shadow .35s var(--ease);

    will-change: transform;

}

.dash-main {

    left: 6%;
    top: 8%;

    width: 78%;

    padding: 22px 22px 18px;

    animation: float-slow 7s var(--ease) infinite;

}

.dash-header {

    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 18px;

}

.dash-title {

    font-weight: 700;
    font-size: 14.5px;

    color: var(--ink);

}

.live-badge {

    display: inline-flex;
    align-items: center;
    gap: 6px;

    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .05em;
    text-transform: uppercase;

    color: #6ee7b7;

}

.live-badge i {

    width: 6px;
    height: 6px;
    border-radius: 50%;

    background: #34d399;

    box-shadow: 0 0 0 3px rgba(52,211,153,.25);

    animation: pulse 1.6s ease-in-out infinite;

}

.dash-chart {

    display: flex;
    align-items: flex-end;

    gap: 8px;

    height: 120px;

    margin-bottom: 14px;

}

.bar {

    flex: 1;

    border-radius: 6px 6px 2px 2px;

    background: linear-gradient(180deg, color-mix(in srgb, var(--primary) 85%, white), var(--secondary));

    opacity: 0;

    transform: scaleY(0);
    transform-origin: bottom;

    animation: bar-rise .8s var(--ease) forwards;

}

@keyframes bar-rise {

    to { opacity: 1; transform: scaleY(1); }

}

.dash-footer {

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-family: var(--font-mono);
    font-size: 12px;

    color: var(--ink-muted);

    border-top: 1px solid var(--glass-border);

    padding-top: 12px;

}

.dash-footer strong {

    color: #6ee7b7;

}

.dash-float {

    padding: 16px 18px;

}

.dash-vitals {

    right: -4%;
    top: 2%;

    width: 44%;

    animation: float-slow 6s var(--ease) infinite .3s;

}

.vitals-head {

    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 12px;
    font-weight: 700;

    color: var(--ink-muted);

    margin-bottom: 8px;

}

.pulse-dot {

    width: 6px;
    height: 6px;
    border-radius: 50%;

    background: #fb7185;

    box-shadow: 0 0 0 3px rgba(251,113,133,.25);

    animation: pulse 1.4s ease-in-out infinite;

}

.ecg {

    width: 100%;
    height: 34px;

}

.ecg-path {

    fill: none;

    stroke: #fb7185;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;

    stroke-dasharray: 220;
    stroke-dashoffset: 220;

    animation: ecg-draw 2.6s linear infinite;

}

@keyframes ecg-draw {

    to { stroke-dashoffset: -220; }

}

.vitals-reading {

    display: block;

    margin-top: 8px;

    font-family: var(--font-mono);
    font-size: 21px;
    font-weight: 600;

    color: var(--ink);

}

.vitals-reading small {

    font-size: 11px;

    color: var(--ink-muted);
    font-family: var(--font-body);
    font-weight: 600;

}

.dash-appointments {

    left: -6%;
    bottom: 6%;

    width: 52%;

    display: flex;
    align-items: center;

    gap: 14px;

    animation: float-slow 8s var(--ease) infinite .6s;

}

.mini-icon {

    display: flex;
    align-items: center;
    justify-content: center;

    width: 42px;
    height: 42px;

    flex-shrink: 0;

    border-radius: 12px;

    font-size: 19px;

    background: rgba(255,255,255,.08);

}

.dash-appointments strong {

    display: block;

    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 600;

    color: var(--ink);

}

.dash-appointments small {

    color: var(--ink-muted);

    font-size: 12px;

}

.dash-occupancy {

    right: 2%;
    bottom: -6%;

    width: 46%;

    display: flex;
    align-items: center;

    gap: 14px;

    animation: float-slow 6.5s var(--ease) infinite .2s;

}

.ring-chart {

    position: relative;

    width: 56px;
    height: 56px;

    flex-shrink: 0;

}

.ring-chart svg {

    width: 100%;
    height: 100%;

    transform: rotate(-90deg);

}

.ring-bg {

    fill: none;

    stroke: rgba(255,255,255,.12);
    stroke-width: 8;

}

.ring-fg {

    fill: none;

    stroke: color-mix(in srgb, var(--primary) 80%, white);
    stroke-width: 8;
    stroke-linecap: round;

    stroke-dasharray: 213.6;
    stroke-dashoffset: 38.4;

}

.ring-chart span {

    position: absolute;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;

    color: var(--ink);

}

.dash-occupancy small {

    color: var(--ink-muted);

    font-size: 12px;

    line-height: 1.3;

}

@keyframes float-slow {

    50% { transform:
            translate3d(
                calc(var(--mx-shift, 0px)),
                calc(var(--my-shift, 0px) + var(--scroll-shift, 0px) - 12px),
                0
            )
            rotateX(var(--tilt-x))
            rotateY(var(--tilt-y));
    }

}

/* ============ Scroll cue ============ */

.scroll-cue {

    position: absolute;

    left: 50%;
    bottom: 34px;

    transform: translateX(-50%);

    z-index: 2;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    color: var(--ink-muted);

    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;

    transition: opacity .3s var(--ease);

}

.scroll-cue-line {

    width: 1.5px;
    height: 34px;

    background: rgba(255,255,255,.16);

    overflow: hidden;

    border-radius: 2px;

}

.scroll-cue-line i {

    display: block;

    width: 100%;
    height: 12px;

    background: color-mix(in srgb, var(--primary) 70%, white);

    border-radius: 2px;

    animation: scroll-cue 1.8s var(--ease) infinite;

}

@keyframes scroll-cue {

    0% { transform: translateY(-14px); }
    100% { transform: translateY(34px); }

}

/* ============ Wave transition ============ */

.wave {

    position: absolute;

    left: 0;
    right: 0;
    bottom: -2px;

    width: 100%;
    height: 90px;

    z-index: 2;

}

.wave-path {

    fill: #05070c;

}

.wave-path-1 {

    opacity: .55;

    animation: wave-shift 12s ease-in-out infinite;

}

.wave-path-2 {

    opacity: 1;

    animation: wave-shift 16s ease-in-out infinite reverse;

}

@keyframes wave-shift {

    0%,100% { transform: translateX(0); }
    50% { transform: translateX(-40px); }

}

/* ============ Responsive ============ */

@media(max-width:1100px) {

.container {

grid-template-columns: 1fr;

text-align: center;

gap: 64px;

}

.hero-content {

max-width: 100%;

margin-inline: auto;

}

p {

margin-inline: auto;

}

.buttons,
.trust {

justify-content: center;

}

.hero-visual {

height: 420px;

max-width: 520px;

margin-inline: auto;

}

}

@media(max-width:640px) {

.hero-visual {

display: none;

}

.trust {

flex-wrap: wrap;

row-gap: 14px;

}

h1 {

font-size: 34px;

}

}

/* ============ Reduced motion & touch fallback ============ */

@media (prefers-reduced-motion: reduce) {

  .hero * {

    animation-duration: .01ms !important;
    transition-duration: .01ms !important;

  }

  .reveal {

    opacity: 1;
    transform: none;
    animation: none;

  }

  .particles,
  .pulse-signature { display: none; }

}

@media (pointer: coarse) {

  .spotlight,
  .particles {

    display: none;

  }

}

</style>