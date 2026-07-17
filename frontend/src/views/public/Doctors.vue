<script setup>

import {ref,onMounted} from "vue";
import {useRouter} from "vue-router";

import api from "../../api/axios";

import Navbar from "../../components/public/Navbar.vue";
import Footer from "../../components/public/Footer.vue";


const router = useRouter();


const doctors = ref([]);
const loading = ref(true);



const getDoctors = async()=>{

try{

const res = await api.get("/api/doctors");

doctors.value=res.data;


}catch(error){

console.log(error);

}
finally{

loading.value=false;

}

}



const bookAppointment = ()=>{

router.push("/login");

}



onMounted(()=>{

getDoctors();

});


</script>



<template>


<div>


<Navbar />



<section class="doctors-page">


<div class="header">


<h1>
Our Doctors
</h1>


<p>
Meet our experienced medical specialists
</p>


</div>




<div v-if="loading" class="loading">

Loading doctors...

</div>



<div 
v-else
class="doctor-grid"
>


<div
v-for="doctor in doctors"
:key="doctor._id"
class="doctor-card"
>


<h2>
{{doctor.name}}
</h2>



<span>
{{doctor.specialties.join(", ")}}
</span>



<p>
{{doctor.qualifications}}
</p>



<p>
Experience:
{{doctor.experience}} Years
</p>



<button @click="bookAppointment">

Book Appointment

</button>



</div>


</div>


</section>



<Footer />


</div>


</template>

<style scoped>
.doctors-page{

padding:100px 8%;

background:#f8fbff;

min-height:80vh;

}


.header{

text-align:center;

margin-bottom:50px;

}


.header h1{

font-size:42px;

color:#222;

}


.doctor-grid{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(300px,1fr));

gap:30px;

}



.doctor-card{

background:white;

padding:30px;

border-radius:20px;

box-shadow:0 10px 30px rgba(0,0,0,.08);

}



.doctor-card h2{

color:#2563eb;

}



.doctor-card span{

font-weight:600;

color:#555;

}



button{

margin-top:20px;

width:100%;

padding:14px;

border:none;

border-radius:30px;

background:#2563eb;

color:white;

cursor:pointer;

}
</style>