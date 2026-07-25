<template>
  <section class="contact">

    <div class="contact__bg" aria-hidden="true">
      <span class="blob blob--one"></span>
      <span class="blob blob--two"></span>
    </div>

    <div class="contact__header" ref="headerRef" :class="{ 'is-visible': headerVisible }">
      <p class="contact__eyebrow">
        <span class="eyebrow-line"></span>
        CONTACT US
        <span class="eyebrow-line"></span>
      </p>
      <h2 class="contact__title">Let's Talk About Your Care</h2>
      <p class="contact__subtitle">
        Have a question or want to book a visit? Send us a message and our
        team will get back to you shortly.
      </p>
    </div>

    <div class="contact__panel" ref="panelRef" :class="{ 'is-visible': panelVisible }">

      <!-- left: image side -->
      <div class="contact__media">
        <img
          src="https://images.unsplash.com/photo-1758691462878-6edc3d3da1be?fm=jpg&q=80&w=1200&auto=format&fit=crop"
          alt="Doctor consulting with a patient"
          class="contact__img"
          loading="lazy"
        />
        <div class="contact__scrim"></div>

        <div class="contact__badge">
          <span class="contact__badge-dot"></span>
          Replies within 24 hours
        </div>

        <div class="contact__info">
          <div class="info-item">
            <span class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            </span>
            <div>
              <span class="info-label">Visit us</span>
              <span class="info-value">128 Willowbrook Ave, Lakeside District</span>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/></svg>
            </span>
            <div>
              <span class="info-label">Call us</span>
              <span class="info-value">+1 (555) 210-4488</span>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z" opacity="0"/><path d="M3 7l9 6 9-6"/><path d="M3 7v10h18V7"/></svg>
            </span>
            <div>
              <span class="info-label">Email us</span>
              <span class="info-value">care@yourclinic.com</span>
            </div>
          </div>
        </div>
      </div>

      <!-- right: form side -->
      <div class="contact__form-wrap">
        <transition name="fade" mode="out-in">
          <div v-if="submitted" key="success" class="success">
            <span class="success__circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M4 12l5 5 11-11" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <h3>Message sent!</h3>
            <p>Thanks for reaching out — our team will get back to you within 24 hours.</p>
            <button class="btn btn--ghost" @click="resetForm">Send another message</button>
          </div>

          <form v-else key="form" class="form" @submit.prevent="handleSubmit">
            <div class="form__row">
              <div class="field" :class="{ filled: form.name }">
                <input v-model="form.name" type="text" required />
                <label>Full name</label>
              </div>
              <div class="field" :class="{ filled: form.phone }">
                <input v-model="form.phone" type="tel" />
                <label>Phone number</label>
              </div>
            </div>

            <div class="field" :class="{ filled: form.email }">
              <input v-model="form.email" type="email" required />
              <label>Email address</label>
            </div>

            <div class="field" :class="{ filled: form.subject }">
              <select v-model="form.subject" required>
                <option value="" disabled hidden></option>
                <option>General inquiry</option>
                <option>Book an appointment</option>
                <option>Billing question</option>
                <option>Feedback</option>
              </select>
              <label>Subject</label>
            </div>

            <div class="field" :class="{ filled: form.message }">
              <textarea v-model="form.message" rows="4" required></textarea>
              <label>Your message</label>
            </div>

            <button class="btn" type="submit" :disabled="loading">
              <span v-if="!loading">Send message</span>
              <span v-else class="btn__spinner"></span>
              <span v-if="!loading" class="btn__arrow">→</span>
            </button>

            <p class="form__note">This form is a static demo — no data is actually sent.</p>
          </form>
        </transition>
      </div>

    </div>

  </section>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'

const form = reactive({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const submitted = ref(false)

function handleSubmit() {
  loading.value = true
  // static/demo submission — simulate a short delay, no network call
  setTimeout(() => {
    loading.value = false
    submitted.value = true
  }, 1100)
}

function resetForm() {
  form.name = ''
  form.phone = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  submitted.value = false
}

const headerRef = ref(null)
const panelRef = ref(null)
const headerVisible = ref(false)
const panelVisible = ref(false)
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (entry.target === headerRef.value) headerVisible.value = true
        if (entry.target === panelRef.value) panelVisible.value = true
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.15 }
  )
  if (headerRef.value) observer.observe(headerRef.value)
  if (panelRef.value) observer.observe(panelRef.value)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>

.contact {
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
.contact__bg {
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
  width: 320px;
  height: 320px;
  background: var(--color-accent);
  top: -80px;
  right: -100px;
}

.blob--two {
  width: 280px;
  height: 280px;
  background: var(--color-primary);
  bottom: -60px;
  left: -100px;
  animation-delay: -6s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-22px, 22px) scale(1.05); }
}

/* ---------- Header ---------- */
.contact__header {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 52px;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.contact__header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.contact__eyebrow {
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

.contact__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 40px);
  color: var(--color-primary-darker);
  margin: 0 0 14px;
}

.contact__subtitle {
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin: 0;
}

/* ---------- Panel ---------- */
.contact__panel {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  opacity: 0;
  transform: translateY(34px);
  transition: opacity 0.75s ease, transform 0.75s ease;
}

.contact__panel.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- Media side ---------- */
.contact__media {
  position: relative;
  min-height: 560px;
}

.contact__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.contact__panel:hover .contact__img {
  transform: scale(1.04);
}

.contact__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(47, 91, 104, 0.15) 0%, rgba(28, 43, 46, 0.55) 65%, rgba(28, 43, 46, 0.85) 100%);
}

.contact__badge {
  position: absolute;
  top: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: var(--color-text-on-primary);
  font-size: 12.5px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
}

.contact__badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7be3a0;
  box-shadow: 0 0 0 0 rgba(123, 227, 160, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(123, 227, 160, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(123, 227, 160, 0); }
  100% { box-shadow: 0 0 0 0 rgba(123, 227, 160, 0); }
}

.contact__info {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-on-primary);
}

.info-icon svg {
  width: 17px;
  height: 17px;
}

.info-label {
  display: block;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 2px;
}

.info-value {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-text-on-primary);
}

/* ---------- Form side ---------- */
.contact__form-wrap {
  padding: 44px 44px 36px;
  display: flex;
  align-items: center;
}

.form {
  width: 100%;
}

.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.field {
  position: relative;
  margin-bottom: 20px;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-soft);
  padding: 18px 14px 8px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  appearance: none;
}

.field textarea {
  resize: none;
  padding-top: 20px;
}

.field label {
  position: absolute;
  left: 14px;
  top: 16px;
  font-size: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: top 0.2s ease, font-size 0.2s ease, color 0.2s ease;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(111, 156, 170, 0.18);
}

.field input:focus ~ label,
.field select:focus ~ label,
.field textarea:focus ~ label,
.field.filled label {
  top: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-primary-dark);
}

.field select {
  cursor: pointer;
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14.5px;
  border: none;
  padding: 15px 28px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: background 0.25s ease, transform 0.25s ease;
}

.btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.btn:disabled {
  cursor: default;
  opacity: 0.85;
}

.btn__arrow {
  transition: transform 0.25s ease;
}

.btn:hover .btn__arrow {
  transform: translateX(4px);
}

.btn__spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form__note {
  margin: 14px 0 0;
  font-size: 11.5px;
  color: var(--color-text-muted);
  text-align: center;
}

/* ---------- Success state ---------- */
.success {
  text-align: center;
  padding: 30px 10px;
}

.success__circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: var(--color-bg-soft);
  color: var(--color-primary-dark);
  margin-bottom: 18px;
  animation: pop 0.5s ease;
}

.success__circle svg {
  width: 28px;
  height: 28px;
}

@keyframes pop {
  0% { transform: scale(0.6); opacity: 0; }
  70% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}

.success h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 20px;
  color: var(--color-primary-darker);
  margin: 0 0 10px;
}

.success p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin: 0 0 24px;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}

.btn--ghost {
  width: auto;
  background: transparent;
  color: var(--color-primary-dark);
  border: 1px solid var(--color-border);
  box-shadow: none;
}

.btn--ghost:hover {
  background: var(--color-bg-soft);
  transform: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .contact__panel {
    grid-template-columns: 1fr;
  }
  .contact__media {
    min-height: 280px;
  }
  .contact__form-wrap {
    padding: 36px 26px 30px;
  }
  .form__row {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blob,
  .contact__badge-dot,
  .success__circle {
    animation: none;
  }
  .contact__header,
  .contact__panel {
    transition: none;
  }
}
</style>