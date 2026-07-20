<template>
  <section id="services" class="svc-section" ref="sectionRef">

    <!-- Top wave divider -->
    <svg class="wave wave-top" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,40 C240,100 480,0 720,30 C960,60 1200,10 1440,50 L1440,0 L0,0 Z" fill="#ffffff"/>
    </svg>

    <!-- Ambient background -->
    <div class="bg-layer" ref="bgLayerRef" aria-hidden="true">
      <span class="blob blob-a"></span>
      <span class="blob blob-b"></span>
      <span class="blob blob-c"></span>
      <span
        v-for="n in 16"
        :key="'p' + n"
        class="particle"
        :style="particleStyle(n)"
      ></span>
      <component
        v-for="(ic, i) in floatIcons"
        :key="'f' + i"
        :is="ic.comp"
        class="ficon"
        :style="ic.style"
        :size="ic.size"
      />
    </div>

    <!-- Header -->
    <div class="svc-header" data-aos="fade-up">
      <span class="eyebrow">Our Services</span>
      <h2>Everything Your Hospital Needs in <span class="accent">One Smart Platform</span></h2>
      <p>
        A single system to manage patients, doctors, appointments, billing,
        pharmacy, laboratory, and medical records — so your team spends less
        time on paperwork and more time on care.
      </p>
    </div>

    <!-- Grid -->
    <div class="svc-grid">
      <div
        v-for="(service, i) in services"
        :key="service.title"
        class="svc-card"
        data-aos="fade-up"
        :data-aos-delay="i * 70"
        @mousemove="handleCardMove"
        @mouseleave="handleCardLeave"
      >
        <span class="card-glow"></span>
        <div class="icon-wrap">
          <component :is="service.icon" :size="24" stroke-width="2" />
        </div>
        <h3>{{ service.title }}</h3>
        <p>{{ service.desc }}</p>
        <a href="#" class="learn-more">
          Learn More
          <ArrowRight :size="15" />
        </a>
      </div>
    </div>

    <!-- CTA -->
    <div class="cta-panel" data-aos="zoom-in">
      <span class="cta-glow"></span>
      <h3>Ready to Modernize Your Hospital?</h3>
      <p>
        Empower your healthcare team with an intelligent Hospital Management
        System designed for speed, security, and efficiency.
      </p>
      <div class="cta-buttons">
        <router-link to="/get-started" class="btn-solid">
          Get Started
          <ArrowRight :size="16" />
        </router-link>
        <router-link to="/demo" class="btn-outline">Book a Demo</router-link>
      </div>
      <Heart class="cta-illustration illus-a" :size="30" />
      <Activity class="cta-illustration illus-b" :size="26" />
      <Cross class="cta-illustration illus-c" :size="22" />
    </div>

    <!-- Bottom wave divider -->
    <svg class="wave wave-bottom" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,60 C240,0 480,100 720,70 C960,40 1200,90 1440,50 L1440,100 L0,100 Z" fill="#ffffff"/>
    </svg>

  </section>
</template>

<script setup>
/*
  Dependencies:
    npm install gsap aos lucide-vue-next

  In main.js (once, globally):
    import 'aos/dist/aos.css'
*/
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import AOS from "aos";
import {
  User,
  Stethoscope,
  Calendar,
 FileText,

  Pill,
  Microscope,
  CreditCard,
  BarChart3,
  ArrowRight,
  Heart,
  Activity,
  Cross,
} from "lucide-vue-next";

const sectionRef = ref(null);
const bgLayerRef = ref(null);

const services = [
  { title: "Patient Management", icon: User, desc: "Register patients, manage profiles, admission history, and complete medical records." },
  { title: "Doctor Management", icon: Stethoscope, desc: "Manage doctor profiles, departments, schedules, and availability." },
  { title: "Online Appointment Booking", icon: Calendar, desc: "Allow patients to book, reschedule, and cancel appointments online." },
  { title: "Electronic Medical Records", icon: FileText, desc: "Store and access secure patient histories, prescriptions, diagnoses, and reports." },
  { title: "Pharmacy Management", icon: Pill, desc: "Manage medicines, stock, prescriptions, suppliers, and inventory." },
  { title: "Laboratory Management", icon: Microscope, desc: "Handle laboratory tests, reports, and digital result delivery." },
  { title: "Billing & Payments", icon: CreditCard, desc: "Generate invoices, manage insurance, payments, and financial reports." },
  { title: "Analytics Dashboard", icon: BarChart3, desc: "View hospital performance, appointments, revenue, and operational insights." },
];

const floatIcons = [
  { comp: Heart, size: 34, style: { top: "12%", left: "6%", animationDelay: "0s" } },
  { comp: CrossIcon, size: 22, style: { top: "68%", left: "3%", animationDelay: "1.4s" } },
  { comp: Activity, size: 28, style: { top: "20%", left: "92%", animationDelay: "0.8s" } },
  { comp: CrossIcon, size: 30, style: { top: "80%", left: "90%", animationDelay: "2.2s" } },
];

function particleStyle(n) {
  const left = (n * 37) % 100;
  const top = (n * 53) % 100;
  const size = 3 + (n % 4);
  const delay = (n % 8) * 0.6;
  return {
    left: left + "%",
    top: top + "%",
    width: size + "px",
    height: size + "px",
    animationDelay: delay + "s",
  };
}

// Border-glow follows the cursor within each card
function handleCardMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty("--mx", `${x}px`);
  card.style.setProperty("--my", `${y}px`);
  gsap.to(card, { y: -8, duration: 0.35, ease: "power2.out" });
}
function handleCardLeave(e) {
  gsap.to(e.currentTarget, { y: 0, duration: 0.4, ease: "power2.out" });
}

// Gentle mouse parallax on the ambient background blobs
function handleSectionParallax(e) {
  if (!bgLayerRef.value) return;
  const { innerWidth, innerHeight } = window;
  const dx = (e.clientX / innerWidth - 0.5) * 26;
  const dy = (e.clientY / innerHeight - 0.5) * 26;
  gsap.to(bgLayerRef.value.querySelectorAll(".blob"), {
    x: (i) => dx * (i + 1) * 0.4,
    y: (i) => dy * (i + 1) * 0.4,
    duration: 1,
    ease: "power2.out",
    overwrite: "auto",
  });
}

onMounted(() => {
  AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  window.addEventListener("mousemove", handleSectionParallax);

  gsap.set(".svc-header, .svc-card", { willChange: "transform" });
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", handleSectionParallax);
});
</script>

<style scoped>
:root {
  --svc-blue-deep: #2563eb;
  --svc-blue-sky: #0ea5e9;
  --svc-ink: #0f1b2d;
  --svc-slate: #5b6b84;
  --svc-mist: #eef6ff;
}

.svc-section {
  position: relative;
  overflow: hidden;
  padding: 60px 8% 100px;
  background: linear-gradient(180deg, #f6faff 0%, #ffffff 40%, #f2f8ff 100%);
  font-family: "Inter", "Poppins", sans-serif;
  color: var(--svc-ink);
}

.wave {
  position: absolute;
  left: 0;
  width: 100%;
  height: 70px;
}
.wave-top { top: 0; }
.wave-bottom { bottom: 0; transform: scaleY(-1); }

/* ---------- Background ---------- */
.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
}
.blob-a {
  width: 380px; height: 380px;
  top: -80px; left: 4%;
  background: radial-gradient(circle, var(--svc-blue-sky), transparent 70%);
}
.blob-b {
  width: 420px; height: 420px;
  top: 30%; right: -10%;
  background: radial-gradient(circle, var(--svc-blue-deep), transparent 70%);
}
.blob-c {
  width: 300px; height: 300px;
  bottom: -60px; left: 40%;
  background: radial-gradient(circle, #38bdf8, transparent 70%);
}

.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.35);
  animation: rise 7s ease-in-out infinite;
}
@keyframes rise {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-26px); opacity: 0.8; }
}

.ficon {
  position: absolute;
  color: rgba(37, 99, 235, 0.12);
  animation: float 8s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(6deg); }
}

/* ---------- Header ---------- */
.svc-header {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 720px;
  margin: 0 auto 64px;
}
.eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: var(--svc-blue-deep);
  margin-bottom: 16px;
}
.svc-header h2 {
  font-family: "Poppins", "Inter", sans-serif;
  font-size: clamp(28px, 3.6vw, 44px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
  margin-bottom: 18px;
}
.svc-header h2 .accent {
  background: linear-gradient(90deg, var(--svc-blue-deep), var(--svc-blue-sky));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.svc-header p {
  color: var(--svc-slate);
  line-height: 1.8;
  font-size: 16px;
}

/* ---------- Grid ---------- */
.svc-grid {
  position: relative;
  z-index: 1;
  max-width: 1320px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 26px;
}

.svc-card {
  position: relative;
  padding: 32px 26px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(37, 99, 235, 0.12);
  box-shadow: 0 12px 30px -16px rgba(15, 27, 45, 0.15);
  overflow: hidden;
  transition: box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
}
.svc-card::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1.5px;
  border-radius: 24px;
  background: conic-gradient(from var(--angle, 0deg), var(--svc-blue-sky), var(--svc-blue-deep), transparent 40%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s ease;
  animation: rotate-border 4s linear infinite paused;
}
.svc-card:hover::before {
  opacity: 1;
  animation-play-state: running;
}
@keyframes rotate-border {
  to { --angle: 360deg; }
}
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.card-glow {
  position: absolute;
  top: var(--my, 50%);
  left: var(--mx, 50%);
  width: 220px;
  height: 220px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(14, 165, 233, 0.16), transparent 70%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}
.svc-card:hover .card-glow { opacity: 1; }
.svc-card:hover {
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 26px 50px -18px rgba(37, 99, 235, 0.3);
}

.icon-wrap {
  position: relative;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, var(--svc-blue-deep), var(--svc-blue-sky));
  box-shadow: 0 10px 22px -8px rgba(37, 99, 235, 0.55);
  margin-bottom: 20px;
  transition: transform 0.35s ease;
}
.svc-card:hover .icon-wrap {
  transform: scale(1.08) rotate(-4deg);
}

.svc-card h3 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--svc-ink);
}
.svc-card p {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--svc-slate);
  margin-bottom: 18px;
  min-height: 62px;
}

.learn-more {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--svc-blue-deep);
  text-decoration: none;
}
.learn-more svg {
  transition: transform 0.3s ease;
}
.learn-more:hover svg {
  transform: translateX(4px);
}

/* ---------- CTA ---------- */
.cta-panel {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 100px auto 0;
  padding: 70px 40px;
  border-radius: 30px;
  text-align: center;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(120deg, #0b3d91, #2563eb 55%, #0ea5e9);
  box-shadow: 0 40px 70px -30px rgba(11, 61, 145, 0.55);
}
.cta-glow {
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 55%);
  animation: pulse-glow 6s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
.cta-panel h3 {
  position: relative;
  font-family: "Poppins", sans-serif;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 700;
  margin-bottom: 14px;
}
.cta-panel p {
  position: relative;
  max-width: 560px;
  margin: 0 auto 34px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  font-size: 15.5px;
}
.cta-buttons {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.btn-solid, .btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 30px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14.5px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}
.btn-solid {
  color: var(--svc-blue-deep);
  background: #fff;
}
.btn-solid:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 30px -10px rgba(0,0,0,0.35);
}
.btn-outline {
  color: #fff;
  border: 1.5px solid rgba(255,255,255,0.6);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.12);
  transform: translateY(-3px);
}

.cta-illustration {
  position: absolute;
  color: rgba(255,255,255,0.25);
  animation: float 7s ease-in-out infinite;
}
.illus-a { top: 14%; left: 8%; }
.illus-b { bottom: 16%; right: 10%; animation-delay: 1s; }
.illus-c { top: 20%; right: 16%; animation-delay: 2s; }

/* ---------- Responsive ---------- */
@media (max-width: 1180px) {
  .svc-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 860px) {
  .svc-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .svc-section { padding: 50px 6% 80px; }
  .svc-grid { grid-template-columns: 1fr; }
  .cta-panel { padding: 50px 24px; }
}

@media (prefers-reduced-motion: reduce) {
  .particle, .ficon, .cta-glow, .cta-illustration { animation: none; }
}
</style>