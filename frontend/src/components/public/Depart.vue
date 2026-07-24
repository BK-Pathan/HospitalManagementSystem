<template>
  <section class="carousel" id="departments">
    <div class="carousel__head">
      <p class="carousel__eyebrow">Department Category</p>
      <h2 class="carousel__title">Browse Our Departments</h2>
      <p class="carousel__subtitle">
        Browse by department for tailored services and expert solutions
      </p>
    </div>

    <div
      class="carousel__track-wrap"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
    >
      <div class="carousel__edge carousel__edge--left" aria-hidden="true"></div>
      <div class="carousel__edge carousel__edge--right" aria-hidden="true"></div>

      <div class="carousel__track" :class="{ 'carousel__track--paused': paused }">
        <a
          v-for="(dept, i) in loopedDepartments"
          :key="dept.label + i"
          :href="dept.href"
          class="dept-card"
        >
          <div class="dept-card__media">
            <img :src="dept.img" :alt="dept.label" loading="lazy" />
            <span class="dept-card__overlay" aria-hidden="true"></span>
          </div>
          <div class="dept-card__body">
            <h3>{{ dept.label }}</h3>
            <p>{{ dept.desc }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

// Same six departments as before — only the `img` field changed from an
// icon URL to a relevant photograph. Swap any `img` for your own asset
// without touching the rest of the markup.
const departments = [
  {
    label: 'Kidney',
    desc: 'Nephrology & dialysis care',
    href: '/#department-kidney',
    img: 'https://i.pinimg.com/1200x/ff/39/c4/ff39c42b8a1d22a0527c8492774acccd.jpg?q=80&w=500&auto=format&fit=crop',
  },
  {
    label: 'Cardiology',
    desc: 'Heart & vascular treatment',
    href: '/#department-cardiology',
    img: 'https://i.pinimg.com/1200x/2e/91/df/2e91dfdbaa52785dff9d619265295220.jpg?q=80&w=500&auto=format&fit=crop',
  },
  {
    label: 'Pulmonology',
    desc: 'Lung & respiratory care',
    href: '/#department-pulmonology',
    img: 'https://i.pinimg.com/1200x/8c/89/5a/8c895a5b552b362ec0330911c82c5efb.jpg?q=80&w=500&auto=format&fit=crop',
  },
  {
    label: 'Dental',
    desc: 'Oral & dental treatments',
    href: '/#department-dental',
    img: 'https://i.pinimg.com/736x/3b/0b/14/3b0b149195da030dd4df01f2d498cb43.jpg?q=80&w=500&auto=format&fit=crop',
  },
  {
    label: 'Neurology',
    desc: 'Brain & nervous system',
    href: '/#department-neurology',
    img: 'https://i.pinimg.com/1200x/74/cf/79/74cf79066fe236b47c5964ccb3b7c84c.jpg?q=80&w=500&auto=format&fit=crop',
  },
  {
    label: 'Orthopedics',
    desc: 'Bones & joint care',
    href: '/#department-orthopedics',
    img: 'https://i.pinimg.com/1200x/2f/b1/d4/2fb1d4beac19f85842e47447e0375f09.jpg?q=80&w=500&auto=format&fit=crop',
  },
]

const paused = ref(false)

// Duplicate once so the CSS animation scrolls 0% -> -50% and loops
// back with no visible seam.
const loopedDepartments = computed(() => [...departments, ...departments])
</script>

<style scoped>
.carousel {
  /* ---- Same theme tokens as the hero / doctors carousel ---- */
  --color-primary: #6f9caa;
  --color-primary-dark: #4f7d8c;
  --color-primary-darker: #2f5b68;
  --color-accent: #7fb0bd;
  --color-bg: #eef4f4;
  --color-bg-soft: #f6faf9;
  --color-surface: #ffffff;
  --color-text: #1c2b2e;
  --color-text-muted: #5a6e72;
  --color-text-on-primary: #ffffff;
  --color-border: #d9e5e6;
  --radius-pill: 999px;
  --radius-lg: 18px;
  --radius-md: 12px;
  --shadow-soft: 0 20px 40px -20px rgba(47, 91, 104, 0.35);
  --font-display: 'Poppins', 'Segoe UI', sans-serif;
  --font-body: 'Inter', 'Segoe UI', sans-serif;

  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  padding: 3.5rem 0;
  overflow: hidden;
}

.carousel__head {
  max-width: 560px;
  margin: 0 auto 2.5rem;
  text-align: center;
  padding: 0 1.5rem;
}

.carousel__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  margin: 0 0 0.5rem;
}

.carousel__title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.6rem;
}

.carousel__subtitle {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0;
}

.carousel__track-wrap {
  position: relative;
  width: 100%;
}

.carousel__edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 90px;
  z-index: 2;
  pointer-events: none;
}

.carousel__edge--left {
  left: 0;
  background: linear-gradient(to right, var(--color-bg), transparent);
}

.carousel__edge--right {
  right: 0;
  background: linear-gradient(to left, var(--color-bg), transparent);
}

.carousel__track {
  display: flex;
  gap: 1.5rem;
  width: max-content;
  padding: 0.5rem 1.5rem;
  animation: carousel-loop 26s linear infinite;
}

.carousel__track--paused {
  animation-play-state: paused;
}

@keyframes carousel-loop {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.dept-card {
  flex: 0 0 200px;
  display: block;
  text-decoration: none;
  color: inherit;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--color-border);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dept-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 50px -20px rgba(47, 91, 104, 0.45);
}

.dept-card__media {
  position: relative;
  height: 150px;
}

.dept-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dept-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(18, 52, 62, 0.55), transparent 60%);
}

.dept-card__body {
  padding: 0.9rem 1rem 1.1rem;
}

.dept-card__body h3 {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.dept-card__body p {
  font-size: 0.76rem;
  color: var(--color-text-muted);
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .carousel__track {
    animation: none;
    overflow-x: auto;
  }
}

@media (max-width: 560px) {
  .dept-card { flex-basis: 170px; }
  .dept-card__media { height: 120px; }
  .carousel__edge { width: 40px; }
}
</style>