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

.appointment-page {
  min-height: 100%;
}

/* ---------- Header ---------- */

.page-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--text);
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px -2px rgba(15, 23, 42, 0.08);
  transition: transform .18s ease, box-shadow .18s ease;
}

.back-btn svg {
  width: 15px;
  height: 15px;
}

.back-btn:hover {
  transform: translateX(-3px);
  box-shadow: 0 4px 10px -3px rgba(15, 23, 42, 0.12);
}

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--primary);
  margin: 0;
}

.page-title {
  color: var(--text);
  font-size: 28px;
  margin: 0;
  letter-spacing: -.01em;
}

/* ---------- Doctor card (Premium) ---------- */

.doctor-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 28px;
  border-radius: 20px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
  max-width: 700px;
}

.doctor-card--loading {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--muted);
}

.spinner {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  animation: spin .8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.doctor-card__head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 22px;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.avatar {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 8px 18px -6px rgba(20, 184, 166, .5);
}

.doctor-card__head-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.doctor-name {
  color: var(--text);
  font-size: 21px;
  font-weight: 700;
  margin: 0;
  overflow-wrap: break-word;
}

.dept-pill {
  display: inline-block;
  align-self: flex-start;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(37, 99, 235, .12);
  color: #2563eb;
  font-weight: 600;
  font-size: 12px;
}

/* ---------- Info grid ---------- */

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  min-width: 0;
}

.info-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--muted);
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  overflow-wrap: break-word;
}

.section-title {
  color: var(--text);
  margin-top: 26px;
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 700;
}

/* ---------- Availability list ---------- */

.availability-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.availability-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(20, 184, 166, .12);
  color: var(--text);
  padding: 10px 15px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13.5px;
  border: 1px solid rgba(20, 184, 166, .2);
  transition: transform .18s ease, box-shadow .18s ease;
}

.availability-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px -6px rgba(20, 184, 166, .3);
}

.availability-item__icon {
  width: 14px;
  height: 14px;
  color: var(--primary);
  flex-shrink: 0;
}

.availability-item__day {
  color: var(--primary);
  font-weight: 700;
}

.no-data {
  color: var(--muted);
  font-style: italic;
  font-size: 14px;
  margin: 0;
}

/* ---------- Date input & button ---------- */

.datetime-input {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #f8fafc;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  color: var(--text);
  transition: border-color .2s ease, box-shadow .2s ease;
}

.datetime-input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 4px rgba(20, 184, 166, .15);
}

.confirm-btn {
  margin-top: 24px;
  padding: 15px 25px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  box-shadow: 0 10px 22px -8px rgba(20, 184, 166, .45);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
  width: 100%;
}

.confirm-btn svg {
  width: 17px;
  height: 17px;
}

.confirm-btn:disabled {
  opacity: .65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .5);
  border-top-color: #fff;
  animation: spin .7s linear infinite;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  filter: brightness(1.05);
  box-shadow: 0 14px 26px -8px rgba(15, 118, 110, .35);
}

.confirm-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .doctor-card {
    padding: 24px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .confirm-btn {
    width: auto;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .page-title {
    font-size: 24px;
  }

  .doctor-card {
    padding: 20px;
    border-radius: 18px;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .page-header {
    gap: 10px;
    margin-bottom: 18px;
  }

  .page-title {
    font-size: 21px;
  }

  .doctor-card {
    padding: 16px;
    border-radius: 16px;
  }

  .doctor-card__head {
    gap: 12px;
    padding-bottom: 18px;
    margin-bottom: 18px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    font-size: 17px;
  }

  .doctor-name {
    font-size: 18px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .info-item {
    padding: 12px;
  }

  .section-title {
    font-size: 15px;
    margin-top: 20px;
    margin-bottom: 12px;
  }

  .availability-item {
    padding: 9px 13px;
    font-size: 13px;
  }

  .datetime-input {
    padding: 13px;
    font-size: 14px;
  }

  .confirm-btn {
    width: 100%;
    padding: 14px 20px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page-title {
    font-size: 19px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .back-btn {
    padding: 8px 14px;
    font-size: 12px;
    width: 100%;
    justify-content: center;
  }

  .doctor-card {
    padding: 14px;
  }

  .doctor-card__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar {
    width: 46px;
    height: 46px;
    font-size: 15px;
  }

  .doctor-name {
    font-size: 17px;
  }

  .dept-pill {
    font-size: 11px;
  }

  .availability-list {
    gap: 8px;
  }

  .availability-item {
    padding: 8px 11px;
    font-size: 12px;
  }

  .confirm-btn {
    font-size: 13.5px;
    padding: 13px 16px;
  }

}

</style>