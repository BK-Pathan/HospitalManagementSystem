<script setup>

import {ref,onMounted} from "vue";
import {RouterView} from "vue-router";
import api from "../../api/axios";


const stats = ref({

doctors:0,
appointments:0

});


const getStats = async()=>{

try{

const res = await api.get("/patient/dashboard");

stats.value=res.data;


}catch(error){

console.log(error);

}

}


onMounted(()=>{

getStats();

});


</script>


<template>


<div>



<div class="cards">


<div class="card">

<h3>
Total Doctors
</h3>

<h1>
{{stats.doctors}}
</h1>

</div>



<div class="card">

<h3>
My Appointments
</h3>

<h1>
{{stats.appointments}}
</h1>

</div>


</div>


<!-- 
<nav>

<router-link to="/patient/profile">
Profile
</router-link>

&nbsp; | &nbsp;


<router-link to="/patient/doctors">
Doctors
</router-link>


&nbsp; | &nbsp;


<router-link to="/patient/appointments">
My Appointments
</router-link>


</nav> -->


<hr>


<RouterView />


</div>


</template>



<style scoped>


.cards{

display:flex;
gap:20px;
margin:20px 0;

}


.card{

background:white;
padding:20px;
width:200px;
border-radius:10px;
box-shadow:0 5px 15px #ddd;

}


</style>