<template>
  <section class="about" id="about">
    <div class="about__container">
      <!-- LEFT: Content -->
      <div class="about__content">
        <span class="about__eyebrow">ABOUT OUR HOSPITAL</span>

        <h2 class="about__title">
          We Provide Finnest Patient's
          <span class="about__title-accent">Care &amp; Amenities</span>
        </h2>

        <p class="about__lead">
          Delivering a world of comprehensive medical treatment where your well-being is our
          utmost priority. At Novaa, we're dedicated to providing you with personalized care
          and top-quality medical services.
        </p>

        <ul class="about__features">
          <li v-for="feature in features" :key="feature" class="about__feature">
            <span class="about__feature-icon">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.5 4L6 11.5L2.5 8"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span>{{ feature }}</span>
          </li>
        </ul>

        <p class="about__note">
          Our patient-centred approach means every treatment plan is tailored to the individual
          you are, not just the condition we're treating. From your first visit to your
          recovery, we're by your side.
        </p>

        <button class="about__cta" type="button">
          <!-- <span class="about__cta-icon">
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span> -->
          More About Us
        </button>
      </div>

      <!-- RIGHT: Image collage -->
      <div class="about__visual">
        <div class="about__visual-frame">
          <img
            class="about__img about__img--main"
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=900&auto=format&fit=crop"
            alt="Surgeons performing an operation in a modern operating theatre"
          />
          <!-- <img
            class="about__img about__img--secondary"
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=700&auto=format&fit=crop"
            alt="Doctor examining scan results on a monitor"
          /> -->

          <div class="about__stat about__stat--top">
            <span class="about__stat-value">22</span>
            <span class="about__stat-label">Different Departments</span>
          </div>

          <div class="about__stat about__stat--bottom">
            <span class="about__stat-value">5K+</span>
            <span class="about__stat-label">Patients Served</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  'Seamless Care',
  'Patient-Centered Care',
  'Warm and Welcoming Environment',
  'Personalized Approach',
  'Comprehensive Care',
  'Cutting-Edge Technology',
  'Expert Doctors',
  'Positive Reviews',
]
</script>

<style scoped>
.about {

  background: var(--color-bg);
  padding: 86px 24px;
  font-family: var(--font-body);
  color: var(--color-text);
}

.about__container {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

/* ---------- LEFT ---------- */
.about__eyebrow {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--color-primary-dark);
  margin-bottom: 14px;
}

.about__title {
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.25;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 20px;
}

.about__title-accent {
  display: block;
  color: var(--color-primary-darker);
}

.about__lead {
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin: 0 0 28px;
  max-width: 46ch;
    text-align:justify;
}

.about__features {
  list-style: none;
  margin: 0 0 28px;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 24px;
}

.about__feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--color-text);
}

.about__feature-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.about__feature-icon svg {
  width: 10px;
  height: 10px;
}

.about__note {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin: 0 0 32px;
  max-width: 48ch;
}

.about__cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: none;
  cursor: pointer;
  padding: 12px 12px 12px 12px;
  border-radius: var(--radius-pill);
  background: var(--color-primary-darker);
  color: var(--color-text-on-primary);
  font-family: var(--font-body);
  font-size: 14.5px;
  font-weight: 600;
  box-shadow: var(--shadow-soft);
  transition: background 0.25s ease, transform 0.25s ease;
}

.about__cta:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.about__cta-icon {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.about__cta-icon svg {
  width: 16px;
  height: 16px;
}

/* ---------- RIGHT / VISUAL ---------- */
.about__visual {
  position: relative;
  display: flex;
  justify-content: center;
}

.about__visual-frame {
  position: relative;
  width: 100%;
  max-width: 460px;
  aspect-ratio: 1 / 1.05;
}

.about__img {
  position: absolute;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.about__img--main {
  top: 0;
  left: 0;
  width: 100%;
  height: 78%;
}

.about__img--secondary {
  bottom: 0;
  left: -8%;
  width: 46%;
  height: 40%;
  border: 5px solid var(--color-bg);
}

.about__stat {
  position: absolute;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  
}

.about__stat--top {
  top: -8%;
  right: -8%;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
}

.about__stat--top .about__stat-label {
  color: rgba(255, 255, 255, 0.85);
}

.about__stat--bottom {
  bottom: 15%;
  left:-13%;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
}

.about__stat-value {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
}

.about__stat-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  max-width: 90px;
}

/* ---------- RESPONSIVE ---------- */
@media (max-width:960px){

  .about{
    padding:80px 24px;
  }

  .about__container{
    grid-template-columns:1fr;
    gap:60px;
  }

  .about__content{
    order:2;
    text-align:center;
  }

  .about__visual{
    order:1;
  }

  .about__lead,
  .about__note{
    max-width:100%;
    margin-left:auto;
    margin-right:auto;
      text-align:justify;
  }

  .about__features{
    justify-content:center;
    grid-template-columns:repeat(2,1fr);
    gap:18px;
  }

  .about__feature{
    justify-content:center;
  }



  .about__visual-frame{
    max-width:420px;
  }

  .about__stat--top{
    top:-5%;
    right:-2%;
  }

  .about__stat--bottom{
    left:-2%;
    bottom:8%;
  }

}
@media (max-width:480px){

  .about{
    padding:60px 18px;
  }

  .about__title{
    font-size:2rem;
    line-height:1.25;
  }

  .about__lead,
  .about__note{
    font-size:14px;
  }

  .about__features{
    grid-template-columns:1fr;
    gap:14px;
  }

  .about__feature{
    justify-content:flex-start;
  }


  .about__visual-frame{
    max-width:320px;
  }

  .about__img--main{
    height:100%;
  }

  .about__stat{
    padding:12px 14px;
  }

  .about__stat-value{
    font-size:20px;
  }

  .about__stat-label{
    font-size:10px;
    max-width:70px;
  }

  .about__stat--top{
    top:10px;
    right:10px;
  }

  .about__stat--bottom{
    left:10px;
    bottom:10px;
  }

}
@media (max-width:360px){

  .about__title{
    font-size:1.7rem;
  }

  .about__visual-frame{
    max-width:280px;
  }

  .about__stat{
    padding:10px 12px;
  }

  .about__stat-value{
    font-size:18px;
  }

}
</style>