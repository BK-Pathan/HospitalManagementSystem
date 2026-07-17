<template>
  <section id="about" class="about-section">
    <div class="container">

      <!-- Left -->
      <div class="about-image">
        <!-- <img
          src="@/assets/images/about.png"
          alt="Hospital"
        /> -->
      </div>

      <!-- Right -->
      <div class="about-content">

        <span class="subtitle">
          ABOUT OUR HOSPITAL
        </span>

        <h2>
          Providing Trusted Healthcare
          <span>For Every Patient</span>
        </h2>

        <p>
          Our hospital is committed to delivering exceptional medical care
          with experienced doctors, advanced technology, and compassionate
          services. We strive to improve the health and well-being of every
          patient through quality treatment and personalized care.
        </p>

        <div class="features">

          <div class="feature">
            ✔ Experienced Specialists
          </div>

          <div class="feature">
            ✔ 24/7 Emergency Services
          </div>

          <div class="feature">
            ✔ Modern Medical Equipment
          </div>

          <div class="feature">
            ✔ Affordable Healthcare
          </div>

        </div>

       <router-link to="/login" class="btn">
         learn more
        </router-link>

      </div>

    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>

.about-section{

padding:100px 8%;

background:#ffffff;

}

.container{

display:grid;

grid-template-columns:1fr 1fr;

align-items:center;

gap:70px;

max-width:1300px;

margin:auto;

}

.about-image img{

width:100%;

border-radius:25px;

box-shadow:0 20px 60px rgba(0,0,0,.12);

}

.subtitle{

display:inline-block;

color:#0d6efd;

font-weight:700;

letter-spacing:2px;

margin-bottom:15px;

}

.about-content h2{

font-size:42px;

line-height:1.3;

margin-bottom:20px;

color:#222;

}

.about-content h2 span{

color:#0d6efd;

}

.about-content p{

font-size:17px;

line-height:1.9;

color:#666;

margin-bottom:30px;

}

.features{

display:grid;

grid-template-columns:repeat(2,1fr);

gap:18px;

margin-bottom:35px;

}

.feature{

background:#f6f9ff;

padding:16px;

border-radius:12px;

font-weight:600;

transition:.3s;

}

.feature:hover{

transform:translateY(-5px);

background:#eaf2ff;

}

.btn{

display:inline-block;

padding:15px 34px;

background:#0d6efd;

color:white;

text-decoration:none;

border-radius:40px;

font-weight:600;

transition:.3s;

}

.btn:hover{

background:#0056d6;

transform:translateY(-3px);

}

@media(max-width:992px){

.container{

grid-template-columns:1fr;

}

.about-content{

text-align:center;

}

.features{

grid-template-columns:1fr;

}

.about-content h2{

font-size:34px;

}

}

</style>