<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();
const router = useRouter();


const doctor = ref(null);


const appointmentDateTime = ref("");


const booking = ref(false);



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


if(booking.value) return;


console.log("BOOK BUTTON CLICKED");

console.log("Doctor ID:", route.params.doctorId);

console.log("Date:", appointmentDateTime.value);


booking.value = true;


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
finally{

booking.value = false;

}


}




onMounted(()=>{


getDoctor();


});


// Display-only helper (no backend / data change)

const initials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};


</script>





<template>


<div class="appointment-page">


<div class="page-header">
  <button class="back-btn" @click="router.back()">
    <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Back
  </button>
  <p class="eyebrow">New Appointment</p>
  <h2 class="page-title">Book Appointment</h2>
</div>




<div v-if="doctor" class="doctor-card">


<div class="doctor-card__head">

  <span class="avatar">{{ initials(doctor.name) }}</span>

  <div class="doctor-card__head-info">
    <h3 class="doctor-name">{{doctor.name}}</h3>
    <span class="dept-pill" v-if="doctor.department">{{doctor.department}}</span>
  </div>

</div>


<div class="info-grid">

<div class="info-item">
  <span class="info-label">Speciality</span>
  <span class="info-value">{{doctor.specialties.join(", ")}}</span>
</div>

<div class="info-item">
  <span class="info-label">Qualification</span>
  <span class="info-value">{{doctor.qualifications}}</span>
</div>

<div class="info-item">
  <span class="info-label">Experience</span>
  <span class="info-value">{{doctor.experience}}</span>
</div>

</div>




<h3 class="section-title">
Available Times
</h3>



<ul class="availability-list" v-if="doctor.availability?.length">


<li
v-for="item in doctor.availability"
:key="item.day"
class="availability-item"
>

<svg class="availability-item__icon" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

<span class="availability-item__day">{{item.day}}</span>

{{item.startTime}} - {{item.endTime}}



</li>


</ul>

<p class="no-data" v-else>No availability listed for this doctor.</p>





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
:disabled="booking || !appointmentDateTime"
>

<span v-if="booking" class="btn-spinner"></span>

<svg v-else viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>

{{ booking ? "Booking..." : "Confirm Appointment" }}

</button>




</div>


<div v-else class="doctor-card doctor-card--loading">
  <span class="spinner"></span>
  <p>Loading doctor details...</p>
</div>



</div>



</template>

<style scoped>


.appointment-page{

    min-height:100%;

}


.page-header{

    display:flex;

    flex-direction:column;

    align-items:flex-start;

    gap:14px;

    margin-bottom:30px;

}


.back-btn{

    display:inline-flex;

    align-items:center;

    gap:6px;

    border:1px solid var(--border);

    background:var(--white);

    color:var(--text);

    padding:9px 16px;

    border-radius:10px;

    font-size:13px;

    font-weight:600;

    cursor:pointer;

    box-shadow:var(--shadow);

    transition:transform .15s ease;

}


.back-btn svg{

    width:15px;

    height:15px;

}


.back-btn:hover{

    transform:translateX(-2px);

}


.eyebrow{

    font-size:13px;

    font-weight:600;

    letter-spacing:.04em;

    text-transform:uppercase;

    color:var(--primary);

    margin:0;

}



.page-title{

    color:var(--text);

    font-size:30px;

    margin:0;

}



.doctor-card{

    background:var(--white);

    padding:35px;

    border-radius:22px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

    max-width:700px;

}


.doctor-card--loading{

    display:flex;

    align-items:center;

    gap:14px;

    color:var(--muted);

}


.spinner{

    width:26px;

    height:26px;

    border-radius:50%;

    border:3px solid var(--border);

    border-top-color:var(--primary);

    animation:spin .8s linear infinite;

    flex-shrink:0;

}


@keyframes spin{

    to{ transform:rotate(360deg); }

}


.doctor-card__head{

    display:flex;

    align-items:center;

    gap:16px;

    padding-bottom:24px;

    margin-bottom:24px;

    border-bottom:1px solid var(--border);

}


.avatar{

    flex-shrink:0;

    width:60px;

    height:60px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    background:linear-gradient(135deg,var(--primary),var(--primary-dark));

    color:#fff;

    font-size:20px;

    font-weight:700;

}


.doctor-card__head-info{

    display:flex;

    flex-direction:column;

    gap:8px;

}



.doctor-name{

    color:var(--text);

    font-size:22px;

    margin:0;

}


.dept-pill{

    display:inline-block;

    align-self:flex-start;

    padding:5px 12px;

    border-radius:999px;

    background:rgba(37,99,235,.12);

    color:#2563eb;

    font-weight:600;

    font-size:12px;

}


.info-grid{

    display:grid;

    grid-template-columns:repeat(3,1fr);

    gap:16px;

    margin-bottom:8px;

}


.info-item{

    display:flex;

    flex-direction:column;

    gap:6px;

    background:#f8fafc;

    border:1px solid var(--border);

    border-radius:14px;

    padding:14px;

}


.info-label{

    font-size:11px;

    font-weight:700;

    text-transform:uppercase;

    letter-spacing:.04em;

    color:var(--muted);

}


.info-value{

    font-size:14px;

    font-weight:600;

    color:var(--text);

}



.section-title{

    color:var(--text);

    margin-top:30px;

    margin-bottom:15px;

    font-size:16px;

}



.availability-list{

    list-style:none;

    padding:0;

    margin:0;

    display:flex;

    flex-wrap:wrap;

    gap:12px;

}



.availability-item{

    display:inline-flex;

    align-items:center;

    gap:8px;

    background:rgba(20,184,166,.12);

    color:var(--text);

    padding:10px 15px;

    border-radius:12px;

    font-weight:600;

    font-size:13.5px;

    border:1px solid rgba(20,184,166,.2);

}


.availability-item__icon{

    width:14px;

    height:14px;

    color:var(--primary);

    flex-shrink:0;

}


.availability-item__day{

    color:var(--primary);

    font-weight:700;

}


.no-data{

    color:var(--muted);

    font-style:italic;

    font-size:14px;

    margin:0;

}




.datetime-input{

    width:100%;

    padding:15px;

    border-radius:12px;

    border:1px solid var(--border);

    background:#f8fafc;

    font-size:15px;

    outline:none;

    box-sizing:border-box;

    font-family:inherit;

    color:var(--text);

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

    display:inline-flex;

    align-items:center;

    gap:9px;

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

}


.confirm-btn svg{

    width:17px;

    height:17px;

}


.confirm-btn:disabled{

    opacity:.65;

    cursor:not-allowed;

    transform:none;

}


.btn-spinner{

    width:16px;

    height:16px;

    border-radius:50%;

    border:2px solid rgba(255,255,255,.5);

    border-top-color:#fff;

    animation:spin .7s linear infinite;

}



.confirm-btn:hover:not(:disabled){

    transform:translateY(-2px);

    box-shadow:0 10px 20px rgba(15,118,110,.25);

}


@media (max-width:600px){

    .info-grid{

        grid-template-columns:1fr;

    }

}


</style>