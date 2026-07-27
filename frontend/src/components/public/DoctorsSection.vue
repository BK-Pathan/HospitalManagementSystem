<template>
  <section class="experts" id="doctor">

    <!-- ambient floating shapes -->
    <div class="experts__bg" aria-hidden="true">
      <span class="blob blob--one"></span>
      <span class="blob blob--two"></span>
    </div>

    <div class="experts__header" ref="headerRef" :class="{ 'is-visible': headerVisible }">
      <p class="experts__eyebrow">
        <span class="eyebrow-line"></span>
        OUR TEAM
        <span class="eyebrow-line"></span>
      </p>
      <h2 class="experts__title">Meet Our Experts</h2>
      <p class="experts__subtitle">
        A team of board-certified specialists dedicated to giving you calm,
        confident, and compassionate care at every visit.
      </p>
    </div>

    <div class="experts__grid">
      <article
        v-for="(doc, i) in experts"
        :key="doc.name"
        class="card"
        :class="{ 'is-visible': visibleCards.includes(i) }"
        :style="{ transitionDelay: `${i * 120}ms` }"
        :ref="el => setCardRef(el, i)"
      >
        <div class="card__media">
          <img :src="doc.photo" :alt="doc.name" class="card__img" loading="lazy" />
          <div class="card__overlay">
            <div class="card__socials">
              <a href="#" aria-label="LinkedIn" class="social">in</a>
              <a href="#" aria-label="Twitter" class="social">𝕏</a>
              <a href="#" aria-label="Email" class="social">✉</a>
            </div>
          </div>
          <span class="card__badge">{{ doc.badge }}</span>
        </div>

        <div class="card__body">
          <h3 class="card__name">{{ doc.name }}</h3>
          <p class="card__role">{{ doc.role }}</p>

          <div class="card__rating">
            <span class="stars">★★★★★</span>
            <span class="rating-value">{{ doc.rating }}</span>
            <span class="rating-count">({{ doc.reviews }})</span>
          </div>
        </div>

        <div class="card__glow" aria-hidden="true"></div>
      </article>
    </div>

    <div class="experts__cta" ref="ctaRef" :class="{ 'is-visible': ctaVisible }">
      <p>Want to consult with one of our specialists?</p>
      <button class="btn" @click="$emit('book-now')">
        Book an appointment
        <span class="btn__arrow">→</span>
      </button>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineEmits(['book-now'])

const experts = [
  {
    name: 'Dr. Abdullah',
    role: 'Chief Dental Surgeon',
    badge: '12+ yrs',
    rating: '4.9',
    reviews: '214 reviews',
    photo: 'https://i.pinimg.com/736x/37/25/1e/37251eab10cb27e8b11515a3c78ce64d.jpg'
  },
  {
    name: 'Dr. Sara Malik',
    role: 'Cardiology Specialist',
    badge: '9+ yrs',
    rating: '5.0',
    reviews: '187 reviews',
    photo: 'https://i.pinimg.com/736x/9b/c0/ce/9bc0ceb83d86f8767d2f02151de1ee7c.jpg'
  },
  {
    name: 'Dr. Amna Ali',
    role: 'Orthopedic Surgeon',
    badge: '15+ yrs',
    rating: '4.8',
    reviews: '259 reviews',
    photo: 'https://i.pinimg.com/736x/d2/7b/bc/d27bbc40e65aeee798ff5e19a18b5fc5.jpg'
  },
  {
    name: 'Dr. Ahmad',
    role: 'Ophthalmologist',
    badge: '7+ yrs',
    rating: '4.9',
    reviews: '143 reviews',
    photo: 'https://i.pinimg.com/736x/f2/82/44/f282441189ec2f1a440049dbe339abdf.jpg'
  }
]

const headerRef = ref(null)
const ctaRef = ref(null)
const headerVisible = ref(false)
const ctaVisible = ref(false)
const visibleCards = ref([])
const cardRefs = []

function setCardRef(el, i) {
  if (el) cardRefs[i] = el
}

let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (entry.target === headerRef.value) headerVisible.value = true
        if (entry.target === ctaRef.value) ctaVisible.value = true
        const idx = cardRefs.indexOf(entry.target)
        if (idx !== -1 && !visibleCards.value.includes(idx)) {
          visibleCards.value.push(idx)
        }
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.2 }
  )

  if (headerRef.value) observer.observe(headerRef.value)
  if (ctaRef.value) observer.observe(ctaRef.value)
  cardRefs.forEach((el) => el && observer.observe(el))
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.experts {
  position: relative;
  max-width: 1300px;
  margin: 0 auto;
  padding: 100px 32px 110px;
  background: var(--color-bg);
  font-family: var(--font-body);
  color: var(--color-text);
  overflow: hidden;
}

/* ---------- Ambient background ---------- */
.experts__bg {
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
  animation: float 12s ease-in-out infinite;
}

.blob--one {
  width: 340px;
  height: 340px;
  background: var(--color-accent);
  top: -80px;
  left: -100px;
}

.blob--two {
  width: 280px;
  height: 280px;
  background: var(--color-primary);
  bottom: -60px;
  right: -80px;
  animation-delay: -6s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.06); }
}

/* ---------- Header ---------- */
.experts__header {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 560px;
  margin: 0 auto 64px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.experts__header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.experts__eyebrow {
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
  transform-origin: center;
  animation: grow 1s ease forwards;
}

@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.experts__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 40px);
  color: var(--color-primary-darker);
  margin: 0 0 16px;
}

.experts__subtitle {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin: 0;
}

/* ---------- Grid & cards ---------- */
.experts__grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

.card {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height:100%;
  width:100%;
  box-shadow: 0 10px 30px -18px rgba(47, 91, 104, 0.25);
  border: 1px solid var(--color-border);
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.35s ease;
}

.card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-soft);
}

.card:hover .card__glow {
  opacity: 1;
}

.card:hover .card__img {
  transform: scale(1.08);
}

.card:hover .card__overlay {
  opacity: 1;
  transform: translateY(0);
}

.card__glow {
  position: absolute;
  inset: -2px;
  border-radius: var(--radius-lg);
  padding: 2px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary-darker));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.card__media {
  position: relative;
  aspect-ratio: 1 / 1.05;
  overflow: hidden;
  background: var(--color-bg-soft);
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.card__overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 18px 0 16px;
  display: flex;
  justify-content: center;
  background: linear-gradient(0deg, rgba(47, 91, 104, 0.82), rgba(47, 91, 104, 0));
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.card__socials {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.social {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-on-primary);
  text-decoration: none;
  transition: background 0.25s ease, transform 0.25s ease;
}

.social:hover {
  background: var(--color-text-on-primary);
  color: var(--color-primary-darker);
  transform: translateY(-3px);
}

.card__badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--color-primary-darker);
  color: var(--color-text-on-primary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
  box-shadow: 0 8px 16px -6px rgba(47, 91, 104, 0.5);
}

.card__body {
  padding: 22px 20px 26px;
  text-align: center;
}

.card__name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 18px;
  color: var(--color-text);
  margin: 0 0 4px;
}

.card__role {
  font-size: 13px;
  color: var(--color-primary-dark);
  font-weight: 500;
  margin: 0 0 12px;
}

.card__rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.stars {
  color: #e0a94a;
  letter-spacing: 1px;
  font-size: 13px;
}

.rating-value {
  font-weight: 600;
  color: var(--color-text);
}

/* ---------- CTA ---------- */
.experts__cta {
  position: relative;
  z-index: 1;
  margin-top: 64px;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.experts__cta.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.experts__cta p {
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
@media (max-width: 1000px) {
  .experts__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .experts__grid {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
  .card,
  .experts__header,
  .experts__cta {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
</style>