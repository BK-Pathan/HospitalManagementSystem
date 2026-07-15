<script setup>

import {ref,onMounted} from "vue";

import api from "../../api/axios";


const appointments = ref([]);



const getAppointments = async()=>{


try{


const res =
await api.get("/patient/appointments");


appointments.value =
res.data.appointments;


}catch(error){

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

My Appointments

</h2>



<table border="1">


<tr>

<th>
Doctor
</th>

<th>
Speciality
</th>

<th>
Date
</th>

<th>
Status
</th>


</tr>




<tr

v-for="appointment in appointments"

:key="appointment._id"

>


<td>

{{appointment.doctor.name}}

</td>



<td>

{{appointment.doctor.specialties}}

</td>



<td>

{{appointment.appointmentDateTime}}

</td>



<td>

{{appointment.status}}

</td>



</tr>


</table>


</div>


</template>