<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();
const router = useRouter();


const doctor = ref(null);


const appointmentDateTime = ref("");



// Get Doctor Details

const getDoctor = async()=>{


try{


const res = await api.get(
`/patient/doctors/${route.params.doctorId}`
);

doctor.value=res.data;


}catch(error){

console.log(error);

}


}



// Book Appointment

const bookAppointment = async()=>{


console.log("BOOK BUTTON CLICKED");

console.log("Doctor ID:", route.params.doctorId);

console.log("Date:", appointmentDateTime.value);



try{


const res = await api.post("/patient/appointment",{


doctor:route.params.doctorId,


appointmentDateTime:appointmentDateTime.value


});


console.log(res.data);


alert("Appointment booked successfully");


}catch(error){


console.log(error.response?.data || error.message);


alert(
error.response?.data?.message ||
"Error booking appointment"
);


}


}




onMounted(()=>{


getDoctor();


});


</script>





<template>


<div class="appointment-page">


<h2 class="page-title">
Book Appointment
</h2>




<div v-if="doctor" class="doctor-card">



<h3 class="doctor-name">
{{doctor.name}}
</h3>



<p class="doctor-info">
Speciality:
{{doctor.specialties.join(", ")}}
</p>



<p class="doctor-info">
Qualification:
{{doctor.qualifications}}
</p>



<p class="doctor-info">
Experience:
{{doctor.experience}}
</p>




<h3 class="section-title">
Available Times
</h3>



<ul class="availability-list">


<li
v-for="item in doctor.availability"
:key="item.day"
class="availability-item"
>


{{item.day}}

:

{{item.startTime}}

-

{{item.endTime}}



</li>


</ul>





<h3 class="section-title">
Select Appointment Date & Time
</h3>



<input

class="datetime-input"

type="datetime-local"

v-model="appointmentDateTime"

/>




<button
class="confirm-btn"
@click="bookAppointment"
>

Confirm Appointment

</button>




</div>



</div>



</template>

<style scoped>


.appointment-page{

    min-height:100%;

}



.page-title{

    color:var(--text);

    font-size:32px;

    margin-bottom:30px;

}



.doctor-card{

    background:var(--white);

    padding:35px;

    border-radius:22px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

    max-width:700px;

}



.doctor-name{

    color:var(--primary);

    font-size:26px;

    margin-bottom:20px;

}



.doctor-info{

    color:var(--text);

    margin:12px 0;

    font-size:15px;

}



.section-title{

    color:var(--text);

    margin-top:30px;

    margin-bottom:15px;

}



.availability-list{

    list-style:none;

    padding:0;

    display:flex;

    flex-wrap:wrap;

    gap:12px;

}



.availability-item{

    background:rgba(20,184,166,.15);

    color:var(--primary);

    padding:10px 15px;

    border-radius:12px;

    font-weight:600;

}





.datetime-input{

    width:100%;

    padding:15px;

    border-radius:12px;

    border:1px solid var(--border);

    background:#f8fafc;

    font-size:15px;

    outline:none;

}



.datetime-input:focus{

    border-color:var(--secondary);

    box-shadow:0 0 0 4px rgba(20,184,166,.15);

}




.confirm-btn{

    margin-top:25px;

    padding:15px 25px;

    border:none;

    border-radius:12px;

    cursor:pointer;

    color:white;

    font-weight:700;

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

}



.confirm-btn:hover{

    transform:translateY(-2px);

    box-shadow:0 10px 20px rgba(15,118,110,.25);

}


</style>