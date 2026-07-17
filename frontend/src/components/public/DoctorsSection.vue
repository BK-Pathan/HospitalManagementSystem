<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";

const doctors = ref([]);
const loading = ref(true);


const getDoctors = async()=>{

try{

const res = await api.get("/doctors");

console.log("Doctors:",res.data);


// only first 3 doctors
doctors.value = res.data.slice(0,3);


}catch(error){

console.log(
error.response?.data || error.message
);

}finally{

loading.value=false;

}

};



onMounted(()=>{

getDoctors();

});

</script>

<template>

<section id="doctors" class="doctors-section">

<div class="container">


<div class="section-header">

<span>OUR DOCTORS</span>


<h2>
Meet Our 
<span>Medical Experts</span>
</h2>


<p>
Our experienced specialists provide quality healthcare with dedication and care.
</p>


</div>



<div v-if="loading" class="loading">

Loading doctors...

</div>



<div 
v-else-if="doctors.length"
class="doctor-grid"
>


<div

v-for="doctor in doctors"

:key="doctor._id"

class="doctor-card"

>


<div class="card-content">


<h3>
{{doctor.name}}
</h3>



<span class="speciality">

{{doctor.specialties.join(", ")}}

</span>



<p>

{{doctor.qualifications}}

</p>



<div class="experience">

{{doctor.experience}} Years Experience

</div>



<button>

Book Appointment

</button>


</div>


</div>


</div>



<div v-else class="loading">

No Doctors Available

</div>



<div class="view-all">

<router-link to="/doctors">

View All Doctors →

</router-link>


</div>


</div>


</section>

</template>

<style scoped>

.doctors-section{

padding:110px 8%;

background:#f8fbff;

}

.container{

max-width:1300px;

margin:auto;

}

.section-header{

text-align:center;

max-width:700px;

margin:auto auto 60px;

}

.section-header span{

color:#2563eb;

font-weight:700;

letter-spacing:2px;

}

.section-header h2{

font-size:42px;

margin:20px 0;

color:#222;

}

.section-header h2 span{

color:#2563eb;

}

.section-header p{

color:#666;

line-height:1.8;

}

.loading{

text-align:center;

font-size:20px;

padding:50px;

}

.doctor-grid{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(320px,1fr));

gap:30px;

}

.doctor-card{

background:white;

border-radius:22px;

overflow:hidden;

box-shadow:0 12px 35px rgba(0,0,0,.08);

transition:.35s;

}

.doctor-card:hover{

transform:translateY(-10px);

box-shadow:0 20px 45px rgba(37,99,235,.18);

}

.doctor-card img{

width:100%;

height:340px;

object-fit:cover;

}

.card-content{

padding:25px;

}

.card-content h3{

margin-bottom:8px;

font-size:24px;

}

.speciality{

color:#2563eb;

font-weight:600;

}

.card-content p{

margin:15px 0;

line-height:1.7;

color:#666;

}

.experience{

margin-bottom:20px;

font-weight:600;

color:#444;

}

button{

width:100%;

padding:14px;

border:none;

border-radius:40px;

background:#2563eb;

color:white;

font-size:16px;

font-weight:600;

cursor:pointer;

transition:.3s;

}

button:hover{

background:#1747c7;

}

.view-all{

text-align:center;

margin-top:50px;

}

.view-all a{

text-decoration:none;

font-size:18px;

font-weight:700;

color:#2563eb;

}

@media(max-width:768px){

.section-header h2{

font-size:34px;

}

}

</style>