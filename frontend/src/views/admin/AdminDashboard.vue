<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const stats = ref({
 users:0,
doctors:0,
patients:0,
appointments:0

});



const getStats = async()=>{


try{


const res = await api.get("/admin/dashboard");


stats.value = res.data;


}
catch(error){

console.log(error);

}


}



onMounted(()=>{

getStats();

});


</script>



<template>


<h1>
Admin Dashboard
</h1>

<div class="cards">


<div class="card">

<h3>
Total Users
</h3>

<h1>
{{stats.users}}
</h1>

</div>


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
Total Patients
</h3>

<h1>
{{stats.patients}}
</h1>

</div>


<div class="card">

<h3>
Total Appointments
</h3>

<h1>
{{stats.appointments}}
</h1>

</div>


</div>



</template>



<style scoped>


.cards{

display:flex;
gap:20px;

}



.card{

background:white;
padding:25px;
width:220px;
border-radius:10px;
box-shadow:0 5px 15px #ddd;

}



</style>