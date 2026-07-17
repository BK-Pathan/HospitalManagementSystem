<template>
  <section class="emergency-banner">
    <div class="overlay"></div>

    <div class="container">

      <div class="content">

        <span class="badge">
          🚑 24/7 Emergency Medical Service
        </span>

        <h2>
          Need Immediate Medical Assistance?
        </h2>

        <p>
          Our experienced doctors and emergency team are available
          24 hours a day to provide fast, reliable and compassionate care.
        </p>

        <div class="actions">

          <a href="tel:+923001234567" class="call-btn">
            📞 Call Now
          </a>

          <a href="#contact" class="appointment-btn">
            Book Appointment
          </a>

        </div>

      </div>

      <div class="info-card">

        <div class="item">
          <h3>24/7</h3>
          <p>Emergency Support</p>
        </div>

        <div class="item">
          <h3>15 min</h3>
          <p>Average Response</p>
        </div>

        <div class="item">
          <h3>100+</h3>
          <p>Specialists</p>
        </div>

      </div>

    </div>

  </section>
</template>

<script setup>
</script>

<style scoped>

.emergency-banner{

position:relative;

padding:110px 8%;

background:
linear-gradient(rgba(18,84,194,.92),rgba(37,99,235,.92)),
url("@/assets/images/emergency-bg.jpg");

background-size:cover;

background-position:center;

color:white;

overflow:hidden;

}

.overlay{

position:absolute;

inset:0;

background:rgba(0,0,0,.15);

}

.container{

position:relative;

z-index:2;

max-width:1300px;

margin:auto;

display:grid;

grid-template-columns:2fr 1fr;

gap:50px;

align-items:center;

}

.badge{

display:inline-block;

padding:10px 18px;

background:rgba(255,255,255,.15);

border:1px solid rgba(255,255,255,.25);

border-radius:50px;

margin-bottom:20px;

font-weight:600;

backdrop-filter:blur(10px);

}

.content h2{

font-size:48px;

line-height:1.2;

margin-bottom:20px;

}

.content p{

font-size:18px;

line-height:1.8;

max-width:700px;

opacity:.95;

}

.actions{

display:flex;

gap:20px;

margin-top:35px;

flex-wrap:wrap;

}

.actions a{

text-decoration:none;

padding:15px 34px;

border-radius:50px;

font-weight:700;

transition:.3s;

}

.call-btn{

background:white;

color:#2563eb;

}

.call-btn:hover{

transform:translateY(-4px);

}

.appointment-btn{

border:2px solid white;

color:white;

}

.appointment-btn:hover{

background:white;

color:#2563eb;

}

.info-card{

background:rgba(255,255,255,.12);

border:1px solid rgba(255,255,255,.2);

backdrop-filter:blur(12px);

border-radius:25px;

padding:35px;

}

.item{

padding:18px 0;

border-bottom:1px solid rgba(255,255,255,.15);

}

.item:last-child{

border:none;

}

.item h3{

font-size:34px;

margin-bottom:6px;

}

.item p{

opacity:.9;

}

@media(max-width:992px){

.container{

grid-template-columns:1fr;

text-align:center;

}

.actions{

justify-content:center;

}

.content h2{

font-size:36px;

}

}

</style>