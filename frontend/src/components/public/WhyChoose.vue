<template>
  <section class="why-section">

    <div class="container">

      <!-- Left Content -->
      <div class="content">

        <span class="subtitle">WHY CHOOSE US</span>

        <h2>
          Trusted Healthcare
          <span>With Compassion</span>
        </h2>

        <p>
          We combine experienced medical professionals, cutting-edge
          technology, and compassionate care to provide the best healthcare
          experience for every patient.
        </p>

        <div class="features">

          <div
            class="feature"
            v-for="feature in features"
            :key="feature.title"
          >
            <div class="icon">
              {{ feature.icon }}
            </div>

            <div>
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.text }}</p>
            </div>
          </div>

        </div>

      </div>

      <!-- Right Image -->
      <div class="image-wrapper">

        <!-- <img
          src="@/assets/images/why-us.jpg"
          alt="Hospital"
        > -->

        <div class="experience-card">
          <h2>25+</h2>
          <p>Years Experience</p>
        </div>

        <div class="award-card">
          ⭐ Best Healthcare
        </div>

      </div>

    </div>

  </section>
</template>

<script setup>

const features = [

{
icon:"👨‍⚕️",
title:"Experienced Doctors",
text:"Highly qualified specialists with years of experience."
},

{
icon:"🏥",
title:"Modern Facilities",
text:"Advanced equipment and state-of-the-art medical technology."
},

{
icon:"🚑",
title:"24/7 Emergency",
text:"Emergency medical services available around the clock."
},

{
icon:"💙",
title:"Patient-Centered Care",
text:"Compassionate treatment focused on every patient's needs."
}

]

</script>

<style scoped>

.why-section{

padding:110px 8%;

background:white;

}

.container{

max-width:1300px;

margin:auto;

display:grid;

grid-template-columns:1fr 1fr;

gap:70px;

align-items:center;

}

.subtitle{

display:inline-block;

font-weight:700;

color:#2563eb;

letter-spacing:2px;

margin-bottom:15px;

}

.content h2{

font-size:44px;

line-height:1.3;

margin-bottom:20px;

color:#222;

}

.content h2 span{

color:#2563eb;

}

.content>p{

line-height:1.8;

color:#666;

margin-bottom:40px;

}

.features{

display:grid;

gap:25px;

}

.feature{

display:flex;

gap:18px;

align-items:flex-start;

padding:18px;

border-radius:16px;

transition:.3s;

}

.feature:hover{

background:#f4f8ff;

transform:translateX(8px);

}

.icon{

width:60px;

height:60px;

border-radius:50%;

background:#eaf2ff;

display:flex;

align-items:center;

justify-content:center;

font-size:28px;

flex-shrink:0;

}

.feature h4{

margin-bottom:6px;

color:#222;

}

.feature p{

color:#666;

line-height:1.6;

}

.image-wrapper{

position:relative;

}

.image-wrapper img{

width:100%;

border-radius:25px;

box-shadow:0 20px 50px rgba(0,0,0,.12);

}

.experience-card{

position:absolute;

bottom:30px;

left:-30px;

background:white;

padding:20px 28px;

border-radius:18px;

box-shadow:0 15px 35px rgba(0,0,0,.15);

text-align:center;

}

.experience-card h2{

color:#2563eb;

font-size:40px;

margin-bottom:5px;

}

.award-card{

position:absolute;

top:25px;

right:-20px;

background:#2563eb;

color:white;

padding:14px 24px;

border-radius:40px;

font-weight:600;

box-shadow:0 12px 25px rgba(37,99,235,.35);

}

@media(max-width:992px){

.container{

grid-template-columns:1fr;

}

.content{

text-align:center;

}

.experience-card{

left:20px;

bottom:20px;

}

.award-card{

right:20px;

}

}

</style>