<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const appointments = ref([]);



const getAppointments = async()=>{

try{


const res = await api.get("/admin/appointments");


appointments.value = res.data;


}
catch(error){

console.log(error);

}


}



onMounted(()=>{

getAppointments();

});


</script>



<template>


<div>


<h2>
Appointments Management
</h2>



<table border="1">


<thead>

<tr>

<th>
Doctor
</th>


<th>
Speciality
</th>


<th>
Patient
</th>


<th>
Appointment Date
</th>


<th>
Status
</th>


</tr>


</thead>



<tbody>


<tr
v-for="appointment in appointments"
:key="appointment._id"
>


<td>

{{appointment.doctor?.name || "N/A"}}

</td>



<td>

{{appointment.doctor?.specialties || "N/A"}}

</td>



<td>

{{appointment.patient?.user?.name || "Not Booked"}}

</td>



<td>

{{appointment.appointmentDateTime}}

</td>



<td>

<span
:class="appointment.status"
>

{{appointment.status}}

</span>

</td>



</tr>



<tr v-if="appointments.length===0">

<td colspan="5">

No Appointments Found

</td>

</tr>



</tbody>



</table>



</div>


</template>



<style scoped>


table{

width:100%;
border-collapse:collapse;

}


th,td{

padding:12px;
text-align:center;

}


.pending{

color:orange;

}


.confirmed{

color:green;

}


.completed{

color:blue;

}


</style>