<template>
  <section class="facilities">

    <!-- ambient floating shapes -->
    <div class="facilities__bg" aria-hidden="true">
      <span class="blob blob--one"></span>
      <span class="blob blob--two"></span>
    </div>

    <div class="facilities__header" ref="headerRef" :class="{ 'is-visible': headerVisible }">
      <p class="facilities__eyebrow">
        <span class="eyebrow-line"></span>
        FACILITIES
        <span class="eyebrow-line"></span>
      </p>
      <h2 class="facilities__title">World-Class Facilities, Close to You</h2>
      <p class="facilities__subtitle">
        From emergency response to recovery, every space in our hospital is
        built around one goal — getting you back to feeling like yourself.
      </p>
    </div>

    <!-- bento grid -->
    <div class="facilities__grid">
      <article
        v-for="(item, i) in facilities"
        :key="item.title"
        class="tile"
        :class="[`tile--${item.size}`, { 'is-visible': visibleTiles.includes(i) }]"
        :style="{ transitionDelay: `${i * 100}ms` }"
        :ref="el => setTileRef(el, i)"
      >
        <img :src="item.photo" :alt="item.title" class="tile__img" loading="lazy" />
        <div class="tile__scrim"></div>

        <span class="tile__icon" v-html="item.icon"></span>

        <div class="tile__content">
          <h3 class="tile__title">{{ item.title }}</h3>
          <p class="tile__desc">{{ item.desc }}</p>
          <a href="#" class="tile__link" @click.prevent="$emit('explore', item.title)">
            Explore <span class="tile__arrow">→</span>
          </a>
        </div>
      </article>
    </div>

    <!-- stat strip -->
    <div class="facilities__stats" ref="statsRef" :class="{ 'is-visible': statsVisible }">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <span class="stat__value">{{ displayValue(stat) }}{{ stat.suffix }}</span>
        <span class="stat__label">{{ stat.label }}</span>
      </div>
    </div>

    <div class="facilities__cta" ref="ctaRef" :class="{ 'is-visible': ctaVisible }">
      <p>Curious what a visit looks like?</p>
      <button class="btn" @click="$emit('take-tour')">
        Take a virtual tour
        <span class="btn__arrow">→</span>
      </button>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

defineEmits(['explore', 'take-tour'])

const facilities = [
  {
    title: 'Emergency & Ambulance',
    desc: '24/7 rapid response with fully-equipped ambulances and a dedicated trauma team on standby.',
    photo: 'https://images.unsplash.com/photo-1682611561092-8f7dcf689006?fm=jpg&q=80&w=1200&auto=format&fit=crop',
    size: 'large',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12h14" stroke-linecap="round"/></svg>'
  },
  {
    title: 'Operation Theatres',
    desc: 'Advanced surgical suites built for precision, safety, and fast recovery.',
    photo: 'https://images.unsplash.com/photo-1758206523711-f20bb01033a5?fm=jpg&q=80&w=1200&auto=format&fit=crop',
    size: 'small',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>'
  },
  {
    title: 'Diagnostic Lab',
    desc: 'Fast, accurate results backed by precision lab equipment.',
    photo: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?fm=jpg&q=80&w=1200&auto=format&fit=crop',
    size: 'small',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/></svg>'
  },
  {
    title: 'In-Patient Wards',
    desc: 'Calm, private rooms designed around comfort and recovery.',
    photo: 'https://images.unsplash.com/photo-1710698936989-500f359c6482?fm=jpg&q=80&w=1200&auto=format&fit=crop',
    size: 'small',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M7 10V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/></svg>'
  },
  {
    title: '24/7 Pharmacy',
    desc: 'On-site pharmacy stocked round the clock with essential medicines.',
    photo: 'https://images.unsplash.com/photo-1696861286643-341a8d7a79e9?fm=jpg&q=80&w=1200&auto=format&fit=crop',
    size: 'small',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5c-2 0-3 1.2-4 1.2S6 5 4.8 5C3 5 2 6.8 2 9c0 3 1.5 4 1.9 7 .2 1.6 1 3 2.2 3 1.5 0 1.4-3 2.4-3s.9 3 2.4 3c1.2 0 2-1.4 2.2-3 .4-3 1.9-4 1.9-7 0-2.2-1-4-2.8-4-1.2 0-2 1.2-4 1.2Z"/></svg>'
  },
  {
    title: 'Reception & Lounge',
    desc: 'A calm, welcoming space from the moment you walk in.',
    photo: 'https://images.unsplash.com/photo-1746173098661-45ae0ccb6030?fm=jpg&q=80&w=1600&auto=format&fit=crop',
    size: 'wide',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10l9-7 9 7M5 9v10h14V9"/></svg>'
  }
]

const stats = reactive([
  { label: 'Specialized Departments', target: 15, suffix: '+', current: 0 },
  { label: 'Patient Beds', target: 250, suffix: '+', current: 0 },
  { label: 'Emergency Care', target: 24, suffix: '/7', current: 0 },
  { label: 'Years of Trust', target: 18, suffix: '+', current: 0 }
])

function displayValue(stat) {
  return stat.current
}

function animateStats() {
  const duration = 1400
  const start = performance.now()

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    stats.forEach((stat) => {
      stat.current = Math.round(stat.target * eased)
    })
    if (progress < 1) requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

const headerRef = ref(null)
const statsRef = ref(null)
const ctaRef = ref(null)
const headerVisible = ref(false)
const statsVisible = ref(false)
const ctaVisible = ref(false)
const visibleTiles = ref([])
const tileRefs = []

function setTileRef(el, i) {
  if (el) tileRefs[i] = el
}

let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (entry.target === headerRef.value) headerVisible.value = true
        if (entry.target === ctaRef.value) ctaVisible.value = true
        if (entry.target === statsRef.value && !statsVisible.value) {
          statsVisible.value = true
          animateStats()
        }
        const idx = tileRefs.indexOf(entry.target)
        if (idx !== -1 && !visibleTiles.value.includes(idx)) {
          visibleTiles.value.push(idx)
        }
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.2 }
  )

  if (headerRef.value) observer.observe(headerRef.value)
  if (statsRef.value) observer.observe(statsRef.value)
  if (ctaRef.value) observer.observe(ctaRef.value)
  tileRefs.forEach((el) => el && observer.observe(el))
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>


.facilities {
  position: relative;
  max-width: 1300px;
  margin: 0 auto;
  padding: 10px 12px 10px;
  background: var(--color-bg);
  font-family: var(--font-body);
  color: var(--color-text);
  overflow: hidden;
}

/* ---------- Ambient background ---------- */
.facilities__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.3;
  animation: float 13s ease-in-out infinite;
}

.blob--one {
  width: 360px;
  height: 360px;
  background: var(--color-accent);
  top: -100px;
  right: -120px;
}

.blob--two {
  width: 300px;
  height: 300px;
  background: var(--color-primary);
  bottom: 120px;
  left: -100px;
  animation-delay: -6s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-24px, 26px) scale(1.05); }
}

/* ---------- Header ---------- */
.facilities__header {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 56px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.facilities__header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.facilities__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  color: var(--color-primary-dark);
  margin: 0 0 10px;
}

.eyebrow-line {
  width: 18px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 2px;
}

.facilities__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 40px);
  color: var(--color-primary-darker);
  margin: 0 0 16px;
}

.facilities__subtitle {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin: 0;
}

/* ---------- Bento grid ---------- */
.facilities__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 190px;
  gap: 20px;
  margin-bottom: 56px;
}

.tile--large {
  grid-column: span 2;
  grid-row: span 2;
}

.tile--small {
  grid-column: span 1;
  grid-row: span 1;
}

.tile--wide {
  grid-column: span 4;
  grid-row: span 1;
}

.tile {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 30px -18px rgba(47, 91, 104, 0.3);
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.35s ease;
}

.tile.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.tile:hover {
  box-shadow: var(--shadow-soft);
}

.tile:hover .tile__img {
  transform: scale(1.08);
}

.tile:hover .tile__arrow {
  transform: translateX(4px);
}

.tile__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.tile__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(28, 43, 46, 0.86) 0%, rgba(28, 43, 46, 0.35) 45%, rgba(28, 43, 46, 0.05) 75%);
}

.tile__icon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-on-primary);
}

.tile__icon svg {
  width: 18px;
  height: 18px;
}

.tile__content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 20px;
  color: var(--color-text-on-primary);
}

.tile--large .tile__content {
  padding: 26px 26px 28px;
}

.tile__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 17px;
  margin: 0 0 6px;
}

.tile--large .tile__title {
  font-size: 22px;
}

.tile__desc {
  font-size: 12.5px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 10px;
  max-width: 320px;
}

.tile__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-on-primary);
  text-decoration: none;
}

.tile__arrow {
  transition: transform 0.25s ease;
}

/* ---------- Stats ---------- */
.facilities__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  box-shadow: 0 10px 30px -18px rgba(47, 91, 104, 0.25);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.facilities__stats.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.stat {
  text-align: center;
  padding: 0 8px;
  border-right: 1px solid var(--color-border);
}

.stat:last-child {
  border-right: none;
}

.stat__value {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 30px;
  color: var(--color-primary-darker);
}

.stat__label {
  display: block;
  font-size: 12.5px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

/* ---------- CTA ---------- */
.facilities__cta {
  position: relative;
  z-index: 1;
  margin-top: 56px;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.facilities__cta.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.facilities__cta p {
  font-size: 15px;
  color: var(--color-text-muted);
  margin: 0 0 18px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  border: none;
  padding: 14px 32px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: background 0.25s ease, transform 0.25s ease;
}

.btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.btn__arrow {
  transition: transform 0.25s ease;
}

.btn:hover .btn__arrow {
  transform: translateX(4px);
}

/* ---------- Responsive ---------- */
/* ---------- Responsive ---------- */

@media (max-width:900px){

  .facilities{
    padding:70px 20px 80px;
  }

  .facilities__grid{
    grid-template-columns:repeat(2,1fr);
    grid-auto-rows:170px;
    gap:14px;
  }


  .tile--large{
    grid-column:span 2;
    grid-row:span 2;
  }


  .tile--small{
    grid-column:span 1;
    grid-row:span 1;
  }


  .tile--wide{
    grid-column:span 2;
  }


  /* Dark overlay for image text visibility */
  .tile__scrim{
    background:
    linear-gradient(
      0deg,
      rgba(0,0,0,0.88) 0%,
      rgba(0,0,0,0.55) 55%,
      rgba(0,0,0,0.20) 100%
    );
  }


  .tile__content{
    padding:14px;
  }


  .tile__title{
    font-size:15px;
  }


  .tile--large .tile__title{
    font-size:20px;
  }


  .tile__desc{
    font-size:11.5px;
    line-height:1.45;
  }


  .tile__icon{
    width:34px;
    height:34px;
    top:12px;
    right:12px;
  }


  /* Stats 2 per row */
  .facilities__stats{
    grid-template-columns:repeat(2,1fr);
    gap:15px;
    padding:25px 15px;
  }


  .stat{
    border-right:1px solid var(--color-border);
    padding:10px 5px;
  }


  .stat:nth-child(2),
  .stat:nth-child(4){
    border-right:none;
  }


  .stat__value{
    font-size:26px;
  }

}



@media(max-width:560px){

  .facilities{
    padding:55px 14px 70px;
  }


  .facilities__header{
    margin-bottom:35px;
  }


  .facilities__title{
    font-size:28px;
  }


  .facilities__subtitle{
    font-size:13px;
  }



  .facilities__grid{

    grid-template-columns:repeat(2,1fr);
    grid-auto-rows:150px;
    gap:10px;

  }


  .tile--large{

    grid-column:span 2;
    grid-row:span 2;

  }


  .tile--wide{

    grid-column:span 2;

  }



  .tile__content{

    padding:12px;

  }



  .tile__title{

    font-size:13px;

  }



  .tile--large .tile__title{

    font-size:18px;

  }



  .tile__desc{

    font-size:10.5px;
    max-width:100%;

  }



  .tile__link{

    font-size:11px;

  }



  .tile__icon{

    width:30px;
    height:30px;

  }



  .tile__icon svg{

    width:15px;
    height:15px;

  }



  /* Stats exactly 2 in one row */

  .facilities__stats{

    grid-template-columns:repeat(2,1fr);
    padding:20px 10px;
    gap:10px;

  }



  .stat__value{

    font-size:22px;

  }



  .stat__label{

    font-size:11px;

  }



  .facilities__cta{

    margin-top:40px;

  }


  .btn{

    width:100%;
    justify-content:center;

  }

}

/* @media (max-width:560px){

  .facilities__grid{
    grid-template-columns:repeat(2,1fr);
    gap:12px;
  }

  .facility-card{
    padding:14px;
  }

  .facility-card h3{
    font-size:14px;
    line-height:1.3;
  }

  .facility-card p{
    font-size:11px;
    line-height:1.5;
  }

  .facility-card img,
  .facility-card svg{
    width:42px;
    height:42px;
  }

}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
  .tile,
  .facilities__header,
  .facilities__stats,
  .facilities__cta {
    transition: none;
    opacity: 1;
    transform: none;
  }
} */
</style>