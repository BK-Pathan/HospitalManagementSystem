<template>
  <section class="hero">
    <!-- Hero content -->
    <div class="hero__body">
      <div class="hero__hex-bg" aria-hidden="true"></div>

      <div class="hero__left">
        <h1 class="hero__title">
          Premium Treatments for A<br />
          <span>Healthy Lifestyle</span>
        </h1>
        <p class="hero__desc">
          Seamlessly advance scalable architectures with future-ready growth
          strategies. Efficiently implement low-risk, high-return process
          enhancements tailored for mission-critical testing procedures,
          especially in publishing and related industries.
        </p>

        <button type="button" class="hero__cta">
          <span class="hero__cta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
          </span>
          View Our Hospital
        </button>

        <div class="hero__stats">
          <div class="hero__stat" v-for="stat in stats" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <div class="hero__right">
        <div class="hero__blob" aria-hidden="true"></div>
        <img
          class="hero__doctor-img"
            src="https://i.pinimg.com/736x/37/25/1e/37251eab10cb27e8b11515a3c78ce64d.jpg?q=80&w=900&auto=format&fit=crop"
          alt="Doctor smiling with arms crossed"
        />

        <div class="hero__badge">
          <span class="hero__badge-dot" aria-hidden="true"></span>
          2500+ Doctors Online
        </div>

        <!-- <div class="hero__search-card">
          <span class="hero__search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M15. 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
              />
            </svg>
          </span>
          <div>
            <strong>Search the Medical</strong>
            <span>With more Care Option</span>
          </div>
        </div> -->
      </div>
    </div>


  </section>
</template>

<script setup>
const stats = [
  { value: '4500+', label: 'Happy Patients' },
  { value: '200', label: 'Hospital Room' },
  { value: '500+', label: 'Award Win' },
  { value: '20+', label: 'Ambulance' },
]

// const departments = ['Kidney', 'Heart', 'Lungs', 'Dental', 'Brain', 'Bones']
</script>

<style scoped>
.hero {
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  overflow: hidden;
}

/* ---------- Navbar ---------- */
/* .hero__nav {
  background: var(--color-primary);
  padding: 0.7rem 1.5rem;
}

.hero__nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.hero__logo {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--color-text-on-primary);
}

.hero__logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.18);
}

.hero__logo-text {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.25;
}

.hero__logo-text small {
  font-size: 0.62rem;
  font-weight: 400;
  opacity: 0.85;
}

.hero__nav-links {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.hero__nav-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  transition: color 0.2s ease;
}

.hero__nav-link:hover,
.hero__nav-link--active {
  color: var(--color-text-on-primary);
}

.hero__nav-cta {
  background: var(--color-surface);
  color: var(--color-primary-darker);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.55rem 1.3rem;
  border-radius: var(--radius-pill);
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.15s ease;
}

.hero__nav-cta:hover {
  transform: translateY(-1px);
} */
.glass{

background:rgba(255,255,255,.55);

backdrop-filter:blur(24px);

-webkit-backdrop-filter:blur(24px);

border:1px solid rgba(255,255,255,.45);

box-shadow:

0 10px 40px rgba(15,23,42,.08);

}
/* ---------- Hero body ---------- */
.hero__body {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem .5rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2rem;
  margin-top:80px;
}

.hero__hex-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.4;
  mask-image: linear-gradient(to right, transparent 0%, black 55%, black 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 55%, black 100%);
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.4vw, 2.6rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0 0 1.1rem;
}

.hero__title span {
  color: var(--color-text);
}

.hero__desc {
  max-width: 460px;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  line-height: 1.7;
  margin: 0 0 1.75rem;
    text-align:justify;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border: none;
  border-radius: var(--radius-pill);
  padding: 0.75rem 0.75rem 0.75rem 1.4rem;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
  transition: transform 0.15s ease, background 0.15s ease;
}

.hero__cta:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.hero__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
}

.hero__stats {
  display: flex;
  gap: 2.2rem;
  margin-top: 2.75rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--color-border);
  flex-wrap: wrap;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.hero__stat strong {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text);
}

.hero__stat span {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

/* ---------- Hero image side ---------- */
.hero__right {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-height: 420px;
}

.hero__blob {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 82%;
  height: 92%;
  background: var(--color-accent);
  border-radius: 45% 55% 60% 40% / 55% 45% 55% 45%;
  opacity: 0.55;
  z-index: 0;
}

.hero__doctor-img {
  position: relative;
  z-index: 1;
  width: 82%;
  max-width: 380px;
  border-radius: 45% 55% 60% 40% / 55% 45% 55% 45%;
  object-fit: cover;
  aspect-ratio: 3 / 4;
  box-shadow: var(--shadow-soft);
}

.hero__badge {
  position: absolute;
  top: 6%;
  right: 4%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-pill);
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text);
  box-shadow: var(--shadow-soft);
}

.hero__badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #35c56a;
}

.hero__search-card {
  position: absolute;
  left: 0;
  bottom: 10%;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--color-text);
  color: var(--color-text-on-primary);
  border-radius: var(--radius-lg);
  padding: 0.9rem 1.25rem;
  box-shadow: var(--shadow-soft);
}

.hero__search-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}

.hero__search-card strong {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
}

.hero__search-card span {
  display: block;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.65);
}
/* ---------- Responsive ---------- */
@media (max-width: 960px) {

  .hero__body{
    grid-template-columns:1fr;
    gap:3rem;
    padding:2rem 1rem;
    margin-top:60px;
    text-align:center;
  }

  .hero__left{
    order:2;
  }

  .hero__right{
    order:1;
    min-height:auto;
    justify-content:center;
  }

  .hero__title{
    font-size:clamp(2rem,6vw,2.7rem);
  }

  .hero__desc{
    max-width:650px;
    margin:0 auto 1.8rem;
  }

  .hero__stats{
    justify-content:center;
    gap:2rem;
  }

  .hero__cta{
    margin:auto;
  }

  .hero__doctor-img{
    width:75%;
    max-width:360px;
  }

  .hero__blob{
    width:75%;
    height:90%;
  }

  .hero__badge{
    right:8%;
    top:4%;
  }

  .hero__search-card{
    left:50%;
    transform:translateX(-50%);
    bottom:0;
    width:85%;
    max-width:330px;
  }

}

@media (max-width:560px){

  .hero{
    overflow:hidden;
  }

  .hero__body{
    padding:1.5rem 1rem 2rem;
    gap:2rem;
     margin-top: 90px; 
  }

  .hero__title{
    font-size:2rem;
    line-height:1.25;
  }

  .hero__desc{
    font-size:.9rem;
    line-height:1.7;
  }

  .hero__cta{
    width:100%;
    justify-content:center;
    padding:.9rem 1rem;
  }

  /* .hero__stats{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:1.5rem;
    text-align:center;
  }

  .hero__stat{
    align-items:center;
  }

  .hero__stat strong{
    font-size:1.3rem;
  } */

  .hero__right{
    min-height:300px;
  }

  .hero__doctor-img{
    width:90%;
    max-width:300px;
  }

  .hero__blob{
    width:95%;
    height:90%;
  }

  .hero__badge{
    top:8px;
    right:10px;
    padding:.45rem .8rem;
    font-size:.72rem;
  }

  .hero__search-card{
    width:92%;
    padding:.8rem 1rem;
  }



}
@media (max-width:560px){

  .hero__stats{
    display:flex;
    flex-wrap:wrap;
    justify-content:space-between;
    gap:1rem;
  }

  .hero__stat{
    flex:0 0 calc(50% - .5rem);
    max-width:calc(50% - .5rem);
    text-align:center;
    align-items:center;
  }

}

@media (max-width:380px){

  .hero__title{
    font-size:1.7rem;
  }

  .hero__stats{
    grid-template-columns:1fr;
  }

  .hero__doctor-img{
    width:100%;
    max-width:250px;
  }

  .hero__badge{
    font-size:.68rem;
    padding:.4rem .7rem;
  }

}
</style>