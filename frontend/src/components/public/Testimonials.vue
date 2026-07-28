<template>
  <section class="feedback" id="reviews">

    <div class="feedback__bg" aria-hidden="true">
      <span class="blob blob--one"></span>
      <span class="blob blob--two"></span>
    </div>

    <div class="feedback__header" ref="headerRef" :class="{ 'is-visible': headerVisible }">
      <p class="feedback__eyebrow">
        <span class="eyebrow-line"></span>
        TESTIMONIALS
        <span class="eyebrow-line"></span>
      </p>
      <h2 class="feedback__title">Trusted by Thousands of Patients</h2>
      <p class="feedback__subtitle">
        Real stories from people we've had the privilege of caring for.
      </p>

      <div class="feedback__summary">
        <div class="summary-item">
          <span class="summary-value">4.9<span class="summary-star">★</span></span>
          <span class="summary-label">Average rating</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <span class="summary-value">2,400+</span>
          <span class="summary-label">Patient reviews</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <span class="summary-value">98%</span>
          <span class="summary-label">Would recommend</span>
        </div>
      </div>
    </div>

    <!-- carousel -->
    <div
      class="carousel"
      ref="carouselRef"
      :class="{ 'is-visible': carouselVisible }"
      @mouseenter="pause = true"
      @mouseleave="pause = false"
    >
      <button class="carousel__nav carousel__nav--prev" @click="prevSlide" aria-label="Previous testimonial">‹</button>

      <div class="carousel__track">
        <div
          class="carousel__page"
          :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
        >
          <div v-for="group in groupedTestimonials" :key="group[0].name" class="carousel__group">
            <article
              v-for="t in group"
              :key="t.name"
              class="testimonial"
            >
              <span class="testimonial__quote-mark">“</span>
              <div class="testimonial__stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= t.rating }">★</span>
              </div>
              <p class="testimonial__text">{{ t.quote }}</p>
              <div class="testimonial__person">
                <img :src="t.photo" :alt="t.name" class="testimonial__avatar" loading="lazy" />
                <div>
                  <h4 class="testimonial__name">{{ t.name }}</h4>
                  <p class="testimonial__role">{{ t.role }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <button class="carousel__nav carousel__nav--next" @click="nextSlide" aria-label="Next testimonial">›</button>
    </div>

    <div class="carousel__dots">
      <button
        v-for="(group, i) in groupedTestimonials"
        :key="i"
        class="dot"
        :class="{ active: i === activeIndex }"
        @click="goTo(i)"
        :aria-label="`Go to slide ${i + 1}`"
      ></button>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const testimonials = [
  {
    name: 'Amara Bishop',
    role: 'Cardiology patient',
    rating: 5,
    quote: 'From the ER to my follow-up visits, every single person treated me like family. I finally found a hospital I trust completely.',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'Farhan Qureshi',
    role: 'Orthopedic surgery',
    rating: 5,
    quote: 'My knee surgery went smoothly and the recovery team checked on me daily. Genuinely the best care I have ever received.',
    photo: 'https://randomuser.me/api/portraits/men/54.jpg'
  },
  {
    name: 'Priya Nair',
    role: 'Maternity care',
    rating: 5,
    quote: 'The nurses were patient, kind, and always available. I felt safe through every step of my pregnancy.',
    photo: 'https://randomuser.me/api/portraits/women/21.jpg'
  },
  {
    name: 'Daniel Osei',
    role: 'Emergency care',
    rating: 4,
    quote: 'Fast, calm, and organized during a stressful night. The ambulance team had me stabilized before we even reached the hospital.',
    photo: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    name: 'Layla Haddad',
    role: 'Dental care',
    rating: 5,
    quote: 'Painless, transparent pricing, and a dentist who actually explained what she was doing. I switched my whole family here.',
    photo: 'https://randomuser.me/api/portraits/women/45.jpg'
  },
  {
    name: 'Marcus Webb',
    role: 'Ophthalmology',
    rating: 5,
    quote: 'My cataract surgery took twenty minutes and the follow-up care has been outstanding. Highly recommend this team.',
    photo: 'https://randomuser.me/api/portraits/men/78.jpg'
  }
]

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

const perSlide = ref(typeof window !== 'undefined' && window.innerWidth < 900 ? 1 : 3)
const groupedTestimonials = computed(() => chunk(testimonials, perSlide.value))
const activeIndex = ref(0)
const pause = ref(false)

function nextSlide() {
  activeIndex.value = (activeIndex.value + 1) % groupedTestimonials.value.length
}
function prevSlide() {
  activeIndex.value =
    (activeIndex.value - 1 + groupedTestimonials.value.length) % groupedTestimonials.value.length
}
function goTo(i) {
  activeIndex.value = i
}

let autoplay
let resizeHandler

onMounted(() => {
  autoplay = setInterval(() => {
    if (!pause.value) nextSlide()
  }, 5000)

  resizeHandler = () => {
    perSlide.value = window.innerWidth < 900 ? 1 : 3
    activeIndex.value = 0
  }
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  clearInterval(autoplay)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})

const headerRef = ref(null)
const carouselRef = ref(null)
const headerVisible = ref(false)
const carouselVisible = ref(false)
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (entry.target === headerRef.value) headerVisible.value = true
        if (entry.target === carouselRef.value) carouselVisible.value = true
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.15 }
  )
  if (headerRef.value) observer.observe(headerRef.value)
  if (carouselRef.value) observer.observe(carouselRef.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>

.feedback {
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
.feedback__bg {
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
  animation: float 12s ease-in-out infinite;
}

.blob--one {
  width: 320px;
  height: 320px;
  background: var(--color-accent);
  top: -60px;
  left: -100px;
}

.blob--two {
  width: 280px;
  height: 280px;
  background: var(--color-primary);
  bottom: -80px;
  right: -80px;
  animation-delay: -6s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(24px, -20px) scale(1.05); }
}

/* ---------- Header ---------- */
.feedback__header {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 620px;
  margin: 0 auto 44px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.feedback__header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.feedback__eyebrow {
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

.feedback__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 40px);
  color: var(--color-primary-darker);
  margin: 0 0 14px;
}

.feedback__subtitle {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin: 0 0 32px;
}

.feedback__summary {
  display: inline-flex;
  align-items: center;
  gap: 26px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: 14px 32px;
  box-shadow: 0 10px 30px -18px rgba(47, 91, 104, 0.25);
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.summary-value {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 20px;
  color: var(--color-primary-darker);
}

.summary-star {
  color: #e0a94a;
  font-size: 16px;
  margin-left: 2px;
}

.summary-label {
  font-size: 11.5px;
  color: var(--color-text-muted);
  margin-top: 2px;
  white-space: nowrap;
}

.summary-divider {
  width: 1px;
  height: 28px;
  background: var(--color-border);
}

/* ---------- Carousel ---------- */
.carousel {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.carousel.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.carousel__track {
  flex: 1;
  overflow: hidden;
}

.carousel__page {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.carousel__group {
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.carousel__nav {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-primary-dark);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px -12px rgba(47, 91, 104, 0.3);
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.carousel__nav:hover {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  transform: scale(1.06);
}

/* ---------- Testimonial card ---------- */
.testimonial {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px 26px 26px;
  box-shadow: 0 10px 30px -18px rgba(47, 91, 104, 0.22);
  display: flex;
  flex-direction: column;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.testimonial:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-soft);
}

.testimonial__quote-mark {
  position: absolute;
  top: 12px;
  right: 20px;
  font-family: var(--font-display);
  font-size: 56px;
  color: var(--color-bg-soft);
  line-height: 1;
  z-index: 0;
}

.testimonial__stars {
  display: flex;
  gap: 3px;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
}

.star {
  color: var(--color-border);
  font-size: 15px;
}

.star.filled {
  color: #e0a94a;
}

.testimonial__text {
  position: relative;
  z-index: 1;
  font-size: 14px;
  line-height: 1.75;
  color: var(--color-text);
  margin: 0 0 22px;
  flex: 1;
}

.testimonial__person {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonial__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-bg-soft);
}

.testimonial__name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
  margin: 0;
}

.testimonial__role {
  font-size: 12px;
  color: var(--color-primary-dark);
  margin: 2px 0 0;
}

/* ---------- Dots ---------- */
.carousel__dots {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--color-border);
  cursor: pointer;
  transition: background 0.25s ease, width 0.25s ease;
}

.dot.active {
  background: var(--color-primary);
  width: 22px;
  border-radius: var(--radius-pill);
}

/* ---------- Responsive ---------- */
/* ---------- Responsive ---------- */

@media (max-width: 1100px){

  .feedback{
    padding:80px 24px 90px;
  }


  .carousel__group{
    grid-template-columns:repeat(2,1fr);
    gap:18px;
  }


  .testimonial{
    padding:28px 22px 24px;
  }

}



@media (max-width:900px){

  .feedback{
    padding:70px 20px 80px;
  }



  .feedback__title{
    font-size:32px;
  }



  .feedback__subtitle{
    font-size:14px;
  }



  /* Summary responsive */

  .feedback__summary{

    display:grid;
    grid-template-columns:repeat(3,1fr);
    width:100%;
    gap:10px;
    padding:16px 12px;
    border-radius:20px;

  }


  .summary-divider{
    display:block;
    width:1px;
    height:35px;
    align-self:center;
  }



  .summary-value{
    font-size:18px;
  }



  .summary-label{
    font-size:11px;
    white-space:normal;
    text-align:center;
  }




  /* Carousel */

  .carousel{
    gap:10px;
  }



  .carousel__group{

    grid-template-columns:repeat(2,1fr);
    gap:16px;

  }



  .testimonial__text{

    font-size:13px;
    line-height:1.65;

  }



  .carousel__nav{

    width:36px;
    height:36px;
    font-size:20px;

  }

}





@media(max-width:560px){


  .feedback{

    padding:55px 14px 70px;

  }



  .feedback__header{

    margin-bottom:30px;

  }



  .feedback__title{

    font-size:27px;
    line-height:1.3;

  }



  .feedback__subtitle{

    font-size:13px;
    line-height:1.6;

  }



  /* Summary mobile */

  .feedback__summary{

    grid-template-columns:1fr;
    gap:12px;
    padding:18px 15px;
    border-radius:18px;

  }



  .summary-divider{

    width:60%;
    height:1px;
    margin:auto;

  }



  .summary-value{

    font-size:22px;

  }




  /* Single testimonial card */

  .carousel{

    gap:6px;

  }



  .carousel__track{

    width:100%;

  }



  .carousel__group{

    grid-template-columns:1fr;
    gap:14px;

  }



  .testimonial{

    min-height:260px;
    padding:26px 20px 22px;

  }



  .testimonial__quote-mark{

    font-size:48px;
    right:15px;

  }



  .testimonial__stars{

    margin-bottom:12px;

  }



  .testimonial__text{

    font-size:13px;

  }



  .testimonial__avatar{

    width:40px;
    height:40px;

  }



  .testimonial__name{

    font-size:13px;

  }



  .testimonial__role{

    font-size:11px;

  }



  .carousel__nav{

    width:32px;
    height:32px;
    font-size:17px;

  }



  .carousel__dots{

    margin-top:22px;

  }

}
</style>