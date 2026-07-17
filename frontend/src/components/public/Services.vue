<template>
  <section id="services" class="services-section">

    <div class="section-header">
      <span>OUR SERVICES</span>

      <h2>
        Comprehensive Medical
        <span>Services</span>
      </h2>

      <p>
        We offer high-quality healthcare services with experienced doctors,
        advanced medical technology, and compassionate patient care.
      </p>
    </div>

    <div class="services-grid">

      <div
        class="service-card"
        v-for="service in services"
        :key="service.title"
      >
        <div class="icon">
          {{ service.icon }}
        </div>

        <h3>{{ service.title }}</h3>

        <p>{{ service.description }}</p>

        <a href="#">
          Learn More →
        </a>
      </div>

    </div>

  </section>
</template>

<script setup>

const services = [

{
title:"Emergency Care",
icon:"🚑",
description:"24/7 emergency medical services with rapid response and expert care."
},

{
title:"Cardiology",
icon:"❤️",
description:"Advanced heart care with experienced cardiologists and modern equipment."
},

{
title:"Neurology",
icon:"🧠",
description:"Specialized diagnosis and treatment for neurological disorders."
},

{
title:"Pediatrics",
icon:"👶",
description:"Comprehensive healthcare services for infants, children, and adolescents."
},

{
title:"Dental Care",
icon:"🦷",
description:"Professional dental treatments using the latest technology."
},

{
title:"Laboratory",
icon:"🧪",
description:"Accurate diagnostic testing with state-of-the-art laboratory facilities."
}

]

</script>

<style scoped>

.services-section{

padding:100px 8%;

background:#f7fbff;

}

.section-header{

text-align:center;

max-width:700px;

margin:auto;

margin-bottom:60px;

}

.section-header span{

color:#1d4ed8;

font-weight:700;

letter-spacing:2px;

}

.section-header h2{

font-size:42px;

margin:20px 0;

color:#222;

}

.section-header h2 span{

color:#1d4ed8;

}

.section-header p{

color:#666;

line-height:1.8;

}

.services-grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(320px,1fr));

gap:30px;

max-width:1300px;

margin:auto;

}

.service-card{

background:#fff;

padding:35px;

border-radius:20px;

box-shadow:0 10px 35px rgba(0,0,0,.08);

transition:.35s;

}

.service-card:hover{

transform:translateY(-10px);

box-shadow:0 20px 45px rgba(13,110,253,.18);

}

.icon{

width:75px;

height:75px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

font-size:34px;

background:#eef5ff;

margin-bottom:25px;

}

.service-card h3{

font-size:24px;

margin-bottom:15px;

color:#222;

}

.service-card p{

color:#666;

line-height:1.7;

margin-bottom:20px;

}

.service-card a{

text-decoration:none;

color:#0d6efd;

font-weight:600;

}

@media(max-width:768px){

.section-header h2{

font-size:34px;

}

}

</style>