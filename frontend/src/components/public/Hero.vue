<template>
  <section class="hero">

    <div class="container">

      <!-- Left -->

      <div class="hero-content">

        <span class="tag">
          Trusted Healthcare Since 2005
        </span>

        <h1>
          Your Health Is <br>
          <span>Our Top Priority</span>
        </h1>

        <p>
          We provide world-class healthcare with experienced doctors,
          advanced technology and compassionate patient care available
          24/7.
        </p>

        <div class="buttons">

          <a href="#contact" class="primary-btn">
            Book Appointment
          </a>

          <a href="#doctors" class="secondary-btn">
            Meet Doctors
          </a>

        </div>

        <div class="stats">

          <div class="card">
            <h2>100+</h2>
            <span>Doctors</span>
          </div>

          <div class="card">
            <h2>50K+</h2>
            <span>Patients</span>
          </div>

          <div class="card">
            <h2>24/7</h2>
            <span>Emergency</span>
          </div>

        </div>

      </div>

      <!-- Right -->

      <div class="hero-image">

        <!-- <img
          src="@/assets/images/doctor.png"
          alt="Doctor"
        > -->

      </div>

    </div>

  </section>
</template>

<script setup>
</script>

<style scoped>

.hero{

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    min-height:100vh;

    display:flex;
    align-items:center;

    overflow:hidden;

}

.container{

    width:min(1300px,92%);
    margin:auto;

    display:grid;
    grid-template-columns:1fr 1fr;

    align-items:center;
    gap:80px;

}

.tag{

    display:inline-block;

    background:white;

    color:var(--primary);

    padding:10px 22px;

    border-radius:50px;

    font-weight:700;

}

h1{

    margin:25px 0;

    font-size:64px;

    color:white;

    line-height:1.1;

}

h1 span{

    color:#CCFBF1;

}

p{

    color:rgba(255,255,255,.9);

    font-size:19px;

    line-height:1.8;

    max-width:580px;

}

.buttons{

    display:flex;

    gap:20px;

    margin:40px 0;

}

.primary-btn,
.secondary-btn{

    text-decoration:none;

    padding:16px 34px;

    border-radius:50px;

    font-weight:700;

    transition:.3s;

}

.primary-btn{

    background:white;

    color:var(--primary);

}

.secondary-btn{

    border:2px solid white;

    color:white;

}

.primary-btn:hover,
.secondary-btn:hover{

    transform:translateY(-4px);

}

.stats{

    display:flex;

    gap:20px;

}

.card{

    flex:1;

    background:rgba(255,255,255,.15);

    backdrop-filter:blur(15px);

    padding:25px;

    border-radius:20px;

    text-align:center;

    border:1px solid rgba(255,255,255,.2);

}

.card h2{

    color:white;

    margin-bottom:10px;

}

.card span{

    color:white;

}

.hero-image{

    display:flex;
    justify-content:center;

}

.hero-image img{

    width:100%;
    max-width:520px;

    animation:float 4s infinite ease-in-out;

}

@keyframes float{

50%{

transform:translateY(-20px);

}

}

@media(max-width:992px){

.container{

grid-template-columns:1fr;

text-align:center;

padding:100px 0 60px;

}

.buttons{

justify-content:center;
flex-wrap:wrap;

}

.stats{

flex-wrap:wrap;

}

h1{

font-size:42px;

}

.hero-image{

margin-top:50px;

}

}

</style>