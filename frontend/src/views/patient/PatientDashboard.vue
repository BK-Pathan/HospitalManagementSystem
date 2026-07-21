<script setup>

import {
ref,
onMounted
} from "vue";

import {
RouterView
} from "vue-router";

import api from "../../api/axios";


const stats = ref({

totalAppointments:0,
pendingAppointments:0,
upcomingAppointments:0,
completedAppointments:0,
totalPrescriptions:0,
doctorsVisited:0,
latestFeedback:null,
upcomingAppointmentList:[]

});



const getStats = async()=>{


try{


const res = await api.get(
"/patient/dashboard"
);



console.log(
"FULL DASHBOARD RESPONSE:",
res.data
);



if(res.data.success){


stats.value = res.data.data;


}
else{


stats.value = res.data;


}



console.log(
"FINAL STATS:",
stats.value
);



}
catch(error){


console.log(
"Dashboard Error:",
error.response?.data || error.message
);


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
Total Appointments
</h3>

<h1>
{{stats.totalAppointments}}
</h1>

</div>


<div class="card">

<h3>
Pending Appointments
</h3>

<h1>
{{stats.pendingAppointments}}
</h1>

</div>

<div class="card">

<h3>
Completed
</h3>

<h1>
{{stats.completedAppointments}}
</h1>

</div>





<div class="card">

<h3>
Prescriptions
</h3>

<h1>
{{stats.totalPrescriptions}}
</h1>

</div>





<div class="card">

<h3>
Doctors Visited
</h3>

<h1>
{{stats.doctorsVisited}}
</h1>

</div>






<div class="card">

<h3>
Upcoming Appointments
</h3>

<h1>
{{stats.upcomingAppointments}}
</h1>

</div>







<!-- <div class="card">


<h3>
Latest Feedback
</h3>


<div v-if="stats.latestFeedback">


⭐ {{stats.latestFeedback.rating}}


<br>


{{stats.latestFeedback.comment}}


</div>


<p v-else>

No Feedback

</p>


</div> -->



</div>

<hr>

<div class="upcoming-panel">


<h2>
📅 Upcoming Appointments
</h2>



<div 
v-if="stats.upcomingAppointmentList.length"
class="appointment-list"
>



<div

class="appointment-card"

v-for="appointment in stats.upcomingAppointmentList"

:key="appointment._id"

>


<div>

<h3>
👨‍⚕️ 
{{appointment.doctor?.name}}
</h3>


<p>
Speciality:
{{appointment.doctor?.specialties?.join(", ")}}
</p>


</div>



<div class="date-box">


<p>

📅 

{{

new Date(
appointment.appointmentDateTime
)
.toLocaleDateString(
"en-US",
{
weekday:"long",
year:"numeric",
month:"short",
day:"numeric"
}
)

}}

</p>


<p>

⏰

{{

new Date(
appointment.appointmentDateTime
)
.toLocaleTimeString(
"en-US",
{
hour:"2-digit",
minute:"2-digit"
}
)

}}

</p>


</div>


</div>



</div>


<p v-else>
No Upcoming Appointments
</p>


</div>




<RouterView />


</div>


</template>




<style scoped>


.cards{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(220px,1fr));

gap:20px;

margin:20px;

}



.card{


background:white;

padding:25px;

border-radius:15px;

box-shadow:0 5px 15px #ddd;


}



.card h1{

font-size:35px;

color:#2563eb;

}
.upcoming-panel{

margin:20px;

background:white;

padding:25px;

border-radius:18px;

box-shadow:0 5px 15px #ddd;

}


.upcoming-panel h2{

color:#2563eb;

margin-bottom:20px;

}



.appointment-list{

display:flex;

flex-direction:column;

gap:15px;

}



.appointment-card{

display:flex;

justify-content:space-between;

align-items:center;

padding:20px;

border-radius:15px;

background:#f8fafc;

border:1px solid #e5e7eb;

}



.appointment-card h3{

color:#2563eb;

margin-bottom:8px;

}



.appointment-card p{

margin:5px 0;

color:#475569;

}



.date-box{

text-align:right;

font-weight:600;

}



@media(max-width:700px){

.appointment-card{

flex-direction:column;

align-items:flex-start;

gap:15px;

}


.date-box{

text-align:left;

}

}


</style>