<script setup>

import {ref,onMounted} from "vue";

import api from "../../api/axios";


const appointments = ref([]);

const formatDateTime = (date)=>{

return new Date(date).toLocaleString(
"en-US",
{
    year:"numeric",
    month:"short",
    day:"numeric",
    hour:"2-digit",
    minute:"2-digit",
    hour12:true
}

);

};
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


<div class="appointments-page">


<h2 class="page-title">

My Appointments

</h2>




<div class="table-card">


<table class="appointments-table">


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


<td class="doctor-name">

{{appointment.doctor.name}}

</td>





<td class="speciality">

{{appointment.doctor.specialties}}

</td>





<td class="appointment-date">

{{formatDateTime(appointment.appointmentDateTime)}}

</td>





<td>

<span class="status">

{{appointment.status}}

</span>

</td>





</tr>


</table>


</div>



</div>


</template>
<style scoped>


.appointments-page{

    min-height:100%;

}



.page-title{

    color:var(--text);

    font-size:32px;

    margin-bottom:30px;

}





.table-card{

    background:var(--white);

    padding:30px;

    border-radius:22px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

    overflow-x:auto;

}





.appointments-table{

    width:100%;

    border-collapse:collapse;

}





.appointments-table th{

    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--primary-dark)
    );

    color:white;

    padding:16px;

    text-align:left;

}





.appointments-table td{

    padding:16px;

    border-bottom:1px solid var(--border);

    color:var(--text);

}





.appointments-table tr:hover{

    background:#f8fafc;

}





.doctor-name{

    font-weight:700;

    color:var(--primary);

}





.speciality{

    color:var(--muted);

}





.appointment-date{

    font-weight:600;

}





.status{

    display:inline-block;

    padding:8px 15px;

    border-radius:20px;

    background:rgba(20,184,166,.15);

    color:var(--primary);

    font-weight:700;

    font-size:13px;

    text-transform:capitalize;

}



</style>