<script setup>

const testimonials = [
  {
    id: 1,
    name: "Ali Hassan",
    role: "Cardiology Patient",
    image: new URL("@/assets/images/patient1.jpg", import.meta.url).href,
    review:
      "The doctors were extremely professional and caring. The entire staff made my treatment smooth and stress-free."
  },
  {
    id: 2,
    name: "Fatima Khan",
    role: "Dental Patient",
    image: new URL("@/assets/images/patient2.jpg", import.meta.url).href,
    review:
      "Excellent healthcare services with modern facilities. I highly recommend this hospital to everyone."
  },
  {
    id: 3,
    name: "Ahmed Raza",
    role: "Neurology Patient",
    image: new URL("@/assets/images/patient3.jpg", import.meta.url).href,
    review:
      "From consultation to recovery, everything was handled professionally. Thank you for the outstanding care."
  }
];

</script>

<template>

<section class="testimonials">

    <div class="section-title">

        <span>TESTIMONIALS</span>

        <h2>
            What Our
            <span>Patients Say</span>
        </h2>

        <p>
            Trusted by thousands of patients for quality healthcare and compassionate treatment.
        </p>

    </div>

    <div class="testimonial-grid">

        <div
            class="testimonial-card"
            v-for="item in testimonials"
            :key="item.id"
        >

            <div class="stars">
                ⭐⭐⭐⭐⭐
            </div>

            <p class="review">
                "{{ item.review }}"
            </p>

            <div class="patient">

                <img
                    :src="item.image"
                    :alt="item.name"
                >

                <div>

                    <h4>{{ item.name }}</h4>

                    <span>{{ item.role }}</span>

                </div>

            </div>

        </div>

    </div>

</section>

</template>

<style scoped>

.testimonials{

padding:100px 8%;

background:white;

}

.section-title{

max-width:700px;

margin:auto;

text-align:center;

margin-bottom:60px;

}

.section-title span{

color:#2563eb;

font-weight:700;

letter-spacing:2px;

}

.section-title h2{

font-size:42px;

margin:18px 0;

color:#222;

}

.section-title h2 span{

color:#2563eb;

}

.section-title p{

color:#666;

line-height:1.8;

}

.testimonial-grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(330px,1fr));

gap:30px;

max-width:1300px;

margin:auto;

}

.testimonial-card{

background:#fff;

padding:35px;

border-radius:20px;

box-shadow:0 15px 35px rgba(0,0,0,.08);

transition:.3s;

}

.testimonial-card:hover{

transform:translateY(-10px);

}

.stars{

font-size:20px;

margin-bottom:20px;

}

.review{

color:#666;

line-height:1.8;

margin-bottom:30px;

font-style:italic;

}

.patient{

display:flex;

align-items:center;

gap:15px;

}

.patient img{

width:65px;

height:65px;

border-radius:50%;

object-fit:cover;

}

.patient h4{

margin-bottom:4px;

}

.patient span{

color:#777;

font-size:14px;

}

@media(max-width:768px){

.section-title h2{

font-size:34px;

}

}

</style>