<template>
  <footer class="footer">

    <div class="footer__bg" aria-hidden="true">
      <span class="blob blob--one"></span>
      <span class="blob blob--two"></span>
    </div>

    <!-- newsletter strip -->
    <!-- <div class="footer__newsletter" ref="newsRef" :class="{ 'is-visible': newsVisible }">
      <div class="newsletter__text">
        <h3>Stay in the loop</h3>
        <p>Health tips, appointment reminders, and clinic news — straight to your inbox.</p>
      </div>
      <form class="newsletter__form" @submit.prevent="handleSubscribe">
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <button type="submit" :disabled="subscribed">
          <span v-if="!subscribed">Subscribe</span>
          <span v-else>Subscribed ✓</span>
        </button>
      </form>
    </div> -->

    <!-- main footer content -->
    <div class="footer__main">
      <div class="footer__brand">
        <div class="brand__logo">
          <span class="brand__mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><path d="M9 10h6M12 7v6"/></svg>
          </span>
          Wellcare Clinic
        </div>
        <p class="brand__desc">
          Compassionate, modern healthcare for you and your family — from
          routine checkups to specialist care, all under one roof.
        </p>
        <div class="brand__socials">
          <a href="#" aria-label="Facebook" class="social">f</a>
          <a href="#" aria-label="Instagram" class="social">◎</a>
          <a href="#" aria-label="LinkedIn" class="social">in</a>
          <a href="#" aria-label="Twitter" class="social">𝕏</a>
        </div>
      </div>

      <div class="footer__col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Our Services</a></li>
          <li><a href="#">Meet the Experts</a></li>
          <li><a href="#">Facilities</a></li>
          <li><a href="#">Patient Feedback</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h4>Departments</h4>
        <ul>
          <li><a href="#">Cardiology</a></li>
          <li><a href="#">Dental Care</a></li>
          <li><a href="#">Orthopedics</a></li>
          <li><a href="#">Ophthalmology</a></li>
          <li><a href="#">Emergency Care</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h4>Get in Touch</h4>
        <ul class="contact-list">
          <li>
            <span class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            </span>
            128 Willowbrook Ave, Lakeside District
          </li>
          <li>
            <span class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/></svg>
            </span>
            +1 (555) 210-4488
          </li>
          <li>
            <span class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7l9 6 9-6"/><path d="M3 7v10h18V7"/></svg>
            </span>
            care@yourclinic.com
          </li>
        </ul>
      </div>
    </div>

    <!-- bottom bar -->
    <div class="footer__bottom">
      <p>© {{ year }} Wellcare Clinic. All rights reserved.</p>
      <div class="footer__legal">
        <a href="#">Privacy Policy</a>
        <span class="dot">•</span>
        <a href="#">Terms of Service</a>
        <span class="dot">•</span>
        <a href="#">Sitemap</a>
      </div>
    </div>

    <button class="back-to-top" @click="scrollToTop" aria-label="Back to top">↑</button>

  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const email = ref('')
const subscribed = ref(false)
const year = new Date().getFullYear()

function handleSubscribe() {
  // static/demo — no network request
  subscribed.value = true
  setTimeout(() => {
    subscribed.value = false
    email.value = ''
  }, 2500)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const newsRef = ref(null)
const newsVisible = ref(false)
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        newsVisible.value = true
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.2 }
  )
  if (newsRef.value) observer.observe(newsRef.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>

.footer {
  position: relative;
  background: var(--color-primary-darker);
  color: rgba(255,255,255,0.82);
  font-family: var(--font-body);
  overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
}

/* ---------- Ambient background ---------- */
.footer__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.25;
  animation: float 14s ease-in-out infinite;
}

.blob--one {
  width: 380px;
  height: 380px;
  background: var(--color-accent);
  top: -140px;
  left: -100px;
}

.blob--two {
  width: 320px;
  height: 320px;
  background: var(--color-primary);
  bottom: -140px;
  right: -80px;
  animation-delay: -7s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(24px, -18px) scale(1.06); }
}

/* ---------- Newsletter strip ---------- */
.footer__newsletter {
  position: relative;
  z-index: 20;
  max-width: 1180px;
  margin: -6px auto 0;
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 34px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.footer__newsletter.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.newsletter__text h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 20px;
  color: var(--color-primary-darker);
  margin: 0 0 6px;
}

.newsletter__text p {
  font-size: 13.5px;
  color: var(--color-text-muted);
  margin: 0;
  max-width: 360px;
}

.newsletter__form {
  display: flex;
  gap: 10px;
  flex: 1;
  min-width: 280px;
  max-width: 440px;
}

.newsletter__form input {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-bg-soft);
  padding: 13px 20px;
  font-family: var(--font-body);
  font-size: 13.5px;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.newsletter__form input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(111, 156, 170, 0.18);
}

.newsletter__form button {
  flex-shrink: 0;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border: none;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 13.5px;
  padding: 13px 24px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: background 0.25s ease, transform 0.25s ease;
}

.newsletter__form button:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.newsletter__form button:disabled {
  background: #5fb98a;
  cursor: default;
}

/* ---------- Main content ---------- */
.footer__main {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 70px 40px 35px;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 40px;
}


.footer__brand .brand__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 19px;
  color: #ffffff;
  margin-bottom: 16px;
}

.brand__mark {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
}

.brand__mark svg {
  width: 18px;
  height: 18px;
}

.brand__desc {
  font-size: 13.5px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 22px;
  max-width: 320px;
}

.brand__socials {
  display: flex;
  gap: 10px;
}

.social {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: background 0.25s ease, transform 0.25s ease, color 0.25s ease;
}

.social:hover {
  background: var(--color-accent);
  color: var(--color-primary-darker);
  transform: translateY(-3px);
}

.footer__col h4 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14.5px;
  color: #ffffff;
  letter-spacing: 0.3px;
  margin: 0 0 18px;
}

.footer__col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__col a {
  position: relative;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color 0.25s ease, padding-left 0.25s ease;
}

.footer__col a:hover {
  color: #ffffff;
  padding-left: 4px;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.6;
}

.contact-icon {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  margin-top: 1px;
}

.contact-icon svg {
  width: 13px;
  height: 13px;
}

/* ---------- Bottom bar ---------- */

.footer__bottom {
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 0;
  padding: 20px 40px 75px;
  border-top: 1px solid rgba(255,255,255,0.12);

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  gap: 12px;
  font-size: 12.5px;
  color: rgba(255,255,255,0.55);
}
.footer__legal {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer__legal a {
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.25s ease;
}

.footer__legal a:hover {
  color: #ffffff;
}

.dot {
  opacity: 0.5;
}

/* ---------- Back to top ---------- */
.back-to-top {
  position: absolute;

  /* footer bottom se attach */
  right: 35px;
  bottom: 18px;

  width: 44px;
  height: 44px;

  border-radius: 50%;
  border: none;

  background: var(--color-accent);
  color: var(--color-primary-darker);

  font-size:18px;
  font-weight:700;

  cursor:pointer;

  display:flex;
  align-items:center;
  justify-content:center;

  box-shadow:
    0 10px 24px -10px rgba(0,0,0,.45);

  transition:.25s ease;

  z-index:5;
}

.back-to-top:hover {
  background:#fff;
  transform:translateY(-4px);
}

/* ---------- Responsive ---------- */

@media(min-width:961px){

  .footer{
    margin-left:0;
    width:100%;
  }

}
@media (max-width: 960px) {
  
 
  .footer__main{
    grid-template-columns:1fr 1fr;
    padding:60px 30px 35px;
  }
  .footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .footer__newsletter {
    margin: -40px 16px 0;
    padding: 26px 22px;
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .newsletter__form {
    max-width: none;
  }
  .footer__main{
    grid-template-columns:1fr;
    padding:50px 22px 30px;
  }


  .footer__bottom{
    padding:20px 22px 70px;
    flex-direction:column;
    text-align:center;
  }


  .back-to-top{
    right:18px;
    bottom:18px;
    width:38px;
    height:38px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
  .footer__newsletter {
    transition: none;
  }
}
</style>