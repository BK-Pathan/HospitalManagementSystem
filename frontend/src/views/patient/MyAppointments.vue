<script setup>

import {ref,onMounted,reactive} from "vue";
import api from "../../api/axios";


const appointments = ref([]);


const showFeedback = ref(false);


const selectedAppointment = ref(null);



const feedback = reactive({

    rating:5,

    comment:""

});





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


}
catch(error){

console.log(error);

}


};






// Open Feedback

const openFeedback = (appointment)=>{


selectedAppointment.value = appointment;


showFeedback.value = true;


};







// Submit Feedback

const submitFeedback = async()=>{

try{

console.log("Selected Appointment:", selectedAppointment.value);

console.log("Feedback Data:", {
    doctor:selectedAppointment.value.doctor._id,
    appointment:selectedAppointment.value._id,
    rating:feedback.rating,
    comment:feedback.comment
});


const res = await api.post(
"/feedback/create",
{
    doctor:selectedAppointment.value.doctor._id,
    appointment:selectedAppointment.value._id,
    rating:feedback.rating,
    comment:feedback.comment
}
);


console.log("Response:",res.data);


alert("Feedback submitted successfully");


showFeedback.value=false;


feedback.rating=5;
feedback.comment="";


}
catch(error){

console.log("Feedback Error:",error.response?.data || error);

}

};






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

<th>
Action
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

{{appointment.doctor?.specialties?.join(", ")}}

</td>





<td class="appointment-date">

{{formatDateTime(appointment.appointmentDateTime)}}

</td>





<td>

<span class="status">

{{appointment.status}}

</span>

</td>


<td>


<button

v-if="appointment.status === 'completed'"

class="feedback-btn"

@click="openFeedback(appointment)"

>

Give Feedback

</button>


<span
v-else
>
-
</span>


</td>




</tr>


</table>

<div
v-if="showFeedback"
class="modal-overlay"
>


<div class="feedback-modal">


<h2>
Give Feedback
</h2>



<label>
Rating
</label>


<select v-model="feedback.rating">


<option :value="5">
⭐⭐⭐⭐⭐
</option>


<option :value="4">
⭐⭐⭐⭐
</option>


<option :value="3">
⭐⭐⭐
</option>


<option :value="2">
⭐⭐
</option>


<option :value="1">
⭐
</option>


</select>





<textarea

v-model="feedback.comment"

placeholder="Write your experience..."

></textarea>




<button
class="submit-btn"
@click="submitFeedback"
>
Submit
</button>



<button

class="cancel-btn"

@click="showFeedback=false"

>
Cancel
</button>



</div>


</div>

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
.feedback-btn{

background:#2563eb;

color:white;

border:none;

padding:8px 15px;

border-radius:10px;

cursor:pointer;

}


.modal-overlay{

position:fixed;

top:0;
left:0;

width:100%;
height:100%;

background:rgba(0,0,0,.4);

display:flex;

align-items:center;

justify-content:center;

}



.feedback-modal{

background:white;

padding:30px;

border-radius:20px;

width:350px;

display:flex;

flex-direction:column;

gap:15px;

}



.feedback-modal textarea{

height:100px;

padding:10px;

}



.submit-btn{

background:#16a34a;

color:white;

padding:10px;

border:none;

border-radius:10px;

}



.cancel-btn{

background:#dc2626;

color:white;

padding:10px;

border:none;

border-radius:10px;

}


</style>