<template>
  <section class="services">

    <div class="services__header">
      <p class="services__eyebrow">SERVICE</p>
      <h2 class="services__title">Our Medical Services</h2>
    </div>

    <div class="services__grid">

      <div class="illustration">
        <div class="blob"></div>

        <!-- Doctor illustration -->
<!-- Doctor illustration -->
<img
  class="doctor"
  src="../../../public/doc.png"
  alt="Doctor illustration"
/>
        <!-- <svg class="doctor" viewBox="0 0 200 420" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="410" rx="55" ry="8" fill="rgba(47,91,104,0.12)"/>
          <rect x="72" y="300" width="24" height="95" rx="12" fill="#2f5b68"/>
          <rect x="104" y="300" width="24" height="95" rx="12" fill="#2f5b68"/>
          <ellipse cx="84" cy="400" rx="18" ry="9" fill="#1c2b2e"/>
          <ellipse cx="116" cy="400" rx="18" ry="9" fill="#1c2b2e"/>
          <path d="M60 150 C60 130 80 118 100 118 C120 118 140 130 140 150 L146 300 C146 312 134 320 100 320 C66 320 54 312 54 300 Z" fill="#ffffff" stroke="#d9e5e6" stroke-width="2"/>
          <path d="M100 122 L86 165 L100 200 L114 165 Z" fill="#f6faf9"/>
          <path d="M92 128 L100 160 L108 128 Z" fill="#6f9caa"/>
          <path d="M60 155 C40 165 30 200 34 235 C36 250 50 255 58 245 C64 236 58 210 66 190 Z" fill="#ffffff" stroke="#d9e5e6" stroke-width="2"/>
          <path d="M140 155 C160 165 168 195 160 225 L120 235 C112 220 122 195 134 178 Z" fill="#ffffff" stroke="#d9e5e6" stroke-width="2"/>
          <rect x="112" y="205" width="46" height="58" rx="6" fill="#2f5b68"/>
          <rect x="118" y="213" width="34" height="6" fill="#eef4f4"/>
          <rect x="118" y="225" width="34" height="4" fill="#eef4f4"/>
          <rect x="118" y="233" width="24" height="4" fill="#eef4f4"/>
          <circle cx="55" cy="248" r="9" fill="#f2c29a"/>
          <circle cx="122" cy="238" r="9" fill="#f2c29a"/>
          <rect x="90" y="98" width="20" height="26" rx="8" fill="#f2c29a"/>
          <circle cx="100" cy="78" r="30" fill="#f2c29a"/>
          <path d="M72 72 C70 48 90 34 100 34 C112 34 132 46 130 72 C122 60 112 66 100 62 C88 58 80 60 72 72 Z" fill="#3a2a20"/>
          <path d="M78 100 C78 118 88 128 100 128 C112 128 122 118 122 100" fill="none" stroke="#2f5b68" stroke-width="5" stroke-linecap="round"/>
          <circle cx="100" cy="130" r="7" fill="#2f5b68"/>
          <circle cx="78" cy="100" r="5" fill="#2f5b68"/>
          <circle cx="122" cy="100" r="5" fill="#2f5b68"/>
        </svg> -->

        <!-- floating service badges -->
        <div
          v-for="badge in badges"
          :key="badge.label"
          class="badge"
          :class="`badge--${badge.key}`"
        >
          <span class="badge__icon" v-html="badge.icon"></span>
          {{ badge.label }}
        </div>
      </div>

      <div class="content">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        <button class="btn" @click="$emit('learn-more')">Learn more</button>
      </div>

    </div>

  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Healthcare Services'
  },
  description: {
    type: String,
    default:
      'Our hospital offers a wide range of specialized healthcare services designed to meet the unique needs of every patient. With experienced doctors, skilled medical staff, and state-of-the-art facilities, we focus on delivering safe, efficient, and comfortable care for better health outcomes.'
  }
})

defineEmits(['learn-more'])

const badges = [
  {
    key: 'eye',
    label: 'Eye Care',
    icon: '<svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke-width="2"/></svg>'
  },
  {
    key: 'cardio',
    label: 'Cardiology',
    icon: '<svg viewBox="0 0 24 24"><path d="M3 12h4l2-5 4 10 2-5h6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  },
  {
    key: 'medicine',
    label: 'Medicine',
    icon: '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12h14" stroke-width="2.4" stroke-linecap="round"/></svg>'
  },
  {
    key: 'dental',
    label: 'Dental',
    icon: '<svg viewBox="0 0 24 24"><path d="M12 5c-2 0-3 1.2-4 1.2S6 5 4.8 5C3 5 2 6.8 2 9c0 3 1.5 4 1.9 7 .2 1.6 1 3 2.2 3 1.5 0 1.4-3 2.4-3s.9 3 2.4 3c1.2 0 2-1.4 2.2-3 .4-3 1.9-4 1.9-7 0-2.2-1-4-2.8-4-1.2 0-2 1.2-4 1.2Z" stroke-width="1.6"/></svg>'
  },
  {
    key: 'ortho',
    label: 'Orthopedic',
    icon: '<svg viewBox="0 0 24 24"><path d="M6 8a3 3 0 1 1 5 2l6 6a3 3 0 1 1-2 2l-6-6a3 3 0 0 1-3-4Z" stroke-width="1.8"/></svg>'
  }
]
</script>

<style scoped>

.services {
  max-width: 1300px;
  margin: 0 auto;
  padding: 90px 32px 110px;
  background: var(--color-bg);
  font-family: var(--font-body);
  color: var(--color-text);
}

.services__header {
  text-align: center;
  margin-bottom: 64px;
}

.services__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 3px;
  color: var(--color-primary-dark);
  margin: 0 0 10px;
}

.services__eyebrow::before,
.services__eyebrow::after {
  content: "";
  width: 18px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 2px;
}

.services__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(28px, 4vw, 40px);
  color: var(--color-primary-darker);
  margin: 0;
}

.services__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 40px;
}

/* ---------- Illustration side ---------- */
.illustration {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 460px;
}

.blob {
  position: absolute;
  width: 300px;
  height: 380px;
  background: var(--color-primary);
  border-radius: 60% 40% 55% 45% / 50% 45% 55% 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: var(--shadow-soft);
}

.doctor {
  position: relative;
  width: 350px !important;
  height: 420px;
  object-fit: cover;
  object-position: center;
  border-radius: 160px 160px 40px 40px;
  z-index: 2;
  filter: drop-shadow(0 18px 22px rgba(47, 91, 104, 0.25));
  margin-bottom: 30px;
  
}

.badge {
  
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-surface);
  border-radius: var(--radius-pill);
  padding: 8px 18px 8px 8px;
  box-shadow: var(--shadow-soft);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  z-index: 3;
  white-space: nowrap;
}

.badge__icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.badge__icon :deep(svg) {
  width: 18px;
  height: 18px;
  stroke: var(--color-text-on-primary);
  fill: none;
}

.badge--eye {
  top: 23%;
  left: 4%;
}
.badge--cardio {
  top: 22%;
  right: 6%;
}
.badge--medicine {
  top: 55%;
  left: 8%;
}
.badge--dental {
  top: 80%;
  left: 34%;
}
.badge--ortho {
  top: 52%;
  right: 6%;
}

/* ---------- Text side ---------- */
.content h3 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(24px, 3vw, 30px);
  color: var(--color-primary-darker);
  margin: 0 0 18px;
}

.content p {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.8;
  color: var(--color-text-muted);
  margin: 0 0 30px;
  max-width: 420px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  border: none;
  padding: 14px 30px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: background 0.25s ease, transform 0.25s ease;
}

.btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

@media (max-width: 860px) {
  .services__grid {
    grid-template-columns: 1fr;
  }
  .illustration {
    min-height: 420px;
  }
  .content {
    text-align: center;
  }
  .content p {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 480px) {
  .badge {
    font-size: 12px;
    padding: 6px 14px 6px 6px;
  }
  .badge__icon {
    width: 28px;
    height: 28px;
  }
  .blob {
    width: 260px;
    height: 340px;
  }
  .doctor {
    width: 150px;
  }
}

@media (max-width: 480px) {

  .doctor {
    width: 200px;
    height: 300px;
  }

}
</style>