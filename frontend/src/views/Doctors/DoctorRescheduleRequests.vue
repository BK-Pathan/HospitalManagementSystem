<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";
import BackButton from "../../components/BackButton.vue"

console.log("🔥 DOCTOR Reschdule FILE LOADED");


const requests = ref([]);

const history = ref([]);

const loading = ref(false);

const processing = ref(false);



// =======================
// Formatter
// =======================

const formatDateTime = (date)=>{

if(!date)
return "N/A";


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





// =======================
// Get Pending Requests
// =======================

const getRequests = async()=>{

try{


const {data}=await api.get(

"/appointments/doctor/reschedule-requests"

);



requests.value=data;



}
catch(error){


console.log(error);


requests.value=[];


}


};






// =======================
// Get History
// =======================

const getHistory = async()=>{

try{


const {data}=await api.get(

"/appointments/doctor/reschedule-history"

);



history.value=data;



}
catch(error){


console.log(error);


history.value=[];


}



};






// =======================
// Approve
// =======================

const approveRequest = async(id)=>{


if(processing.value)
return;



processing.value=true;


try{


await api.put(

`/appointments/${id}/approve-reschedule`

);



window.notify(
"Appointment approved"
);



await getRequests();

await getHistory();



}
catch(error){


window.notify(

error.response?.data?.message ||
"Approve failed"

);


}
finally{

processing.value=false;

}


};







// =======================
// Reject
// =======================

const rejectRequest = async(id)=>{


if(processing.value)
return;


processing.value=true;



try{


await api.put(

`/appointments/${id}/reject-reschedule`

);



window.notify(
"Request rejected"
);



await getRequests();

await getHistory();



}
catch(error){


window.notify(

error.response?.data?.message ||
"Reject failed"

);


}
finally{

processing.value=false;

}


};






onMounted(()=>{


getRequests();

getHistory();


});


// Display-only helper (no backend / data change)

const initials = (name) => {
  if (!name || name === "Unknown") return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};



</script>





<template>


<div class="container">

<BackButton/>

<div class="page-header">
  <p class="eyebrow">Scheduling</p>
  <h2 class="page-title">Reschedule Requests</h2>
</div>



<!-- ================= -->
<!-- Pending Requests -->
<!-- ================= -->


<div class="section">


<div class="section-head">
  <h2 class="section-title">Pending Requests</h2>
  <span class="section-count" v-if="requests.length">{{ requests.length }} awaiting response</span>
</div>



<div
v-if="requests.length===0"
class="empty"
>

<svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 5v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
<p>No pending requests.</p>

</div>



<div
v-for="item in requests"
:key="item._id"
class="card"
>



<div class="card__head">

<img
v-if="item.patient?.user?.profileImage"
:src="item.patient.user.profileImage"
class="avatar avatar-img"
/>

<span v-else class="avatar">
{{ initials(item.patient?.user?.name) }}
</span>

<div class="card__head-info">

<h3>
{{ item.patient?.user?.name || "Unknown" }}
</h3>

<span class="status status--pending">
Pending
</span>

</div>

</div>



<div class="date-compare">

<div class="date-block">
  <span class="date-label">Current</span>
  <span class="date-value">{{formatDateTime(item.appointmentDateTime)}}</span>
</div>

<svg class="date-arrow" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>

<div class="date-block date-block--requested">
  <span class="date-label">Requested</span>
  <span class="date-value">{{formatDateTime(item.rescheduledDateTime)}}</span>
</div>

</div>




<div class="buttons">


<button

class="approve"

@click="approveRequest(item._id)"

:disabled="processing"

>
<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
Accept

</button>



<button

class="reject"

@click="rejectRequest(item._id)"

:disabled="processing"

>
<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
Reject

</button>



</div>



</div>


</div>









<!-- ================= -->
<!-- History -->
<!-- ================= -->


<div class="section">


<div class="section-head">
  <h2 class="section-title">Reschedule History</h2>
  <span class="section-count" v-if="history.length">{{ history.length }} patient(s)</span>
</div>



<div

v-if="history.length===0"

class="empty"

>

<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
<p>No history yet.</p>

</div>




<div

v-for="item in history"

:key="item._id"

class="card"

>


<div class="card__head">

<img
v-if="item.patient?.user?.profileImage"
:src="item.patient.user.profileImage"
class="avatar avatar-img"
/>

<span v-else class="avatar avatar--muted">
{{ initials(item.patient?.user?.name) }}
</span>


<div>

<h3>
{{ item.patient?.user?.name || "Unknown" }}
</h3>

<span
v-if="item.doctor?.user?.name"
class="doctor-text"
>
{{ item.doctor.user.name }}
</span>

</div>


</div>



<div

v-for="(h,index) in item.rescheduleHistory"

:key="index"

class="history-box"

>


<div class="date-compare date-compare--compact">

<div class="date-block">
  <span class="date-label">Old Date</span>
  <span class="date-value">{{formatDateTime(h.oldDateTime)}}</span>
</div>

<svg class="date-arrow" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>

<div class="date-block date-block--requested">
  <span class="date-label">New Date</span>
  <span class="date-value">{{formatDateTime(h.newDateTime)}}</span>
</div>

</div>


<div class="history-box__footer">

<span
:class="`status status--${h.status}`"
>

{{h.status}}

</span>

<p class="reply" v-if="h.doctorReply">

<b>Reply:</b> {{h.doctorReply}}

</p>

</div>



</div>



</div>



</div>





</div>


</template>




<style scoped>

.container {
  padding: 30px;
}

.page-header {
  margin-bottom: 25px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--primary);
  margin: 0 0 6px;
}

.page-title {
  font-size: 30px;
  color: var(--text);
  margin: 0;
  letter-spacing: -.01em;
}

.section {
  margin-bottom: 40px;
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 8px;
}

.section-title {
  margin: 0;
  color: var(--text);
  font-size: 20px;
}

.section-count {
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}

/* ---------- Card (Premium) ---------- */

.card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 25px;
  border-radius: 18px;
  margin-bottom: 20px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
  transition: box-shadow .3s ease;
}

.card:hover {
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 16px 28px -12px rgba(15, 23, 42, 0.14);
}

.card__head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.card__head h3 {
  margin: 0;
  color: var(--text);
  font-size: 16px;
  font-weight: 700;
}

.card__head-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.card__head-info h3 {
  margin: 0;
}

.avatar {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 6px 14px -4px rgba(20, 184, 166, .5);
}

.avatar--muted {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  box-shadow: 0 6px 14px -4px rgba(100, 116, 139, .4);
}

/* ---------- Date compare ---------- */

.date-compare {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.date-compare--compact {
  margin-bottom: 12px;
}

.date-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.date-block--requested .date-value {
  color: var(--primary);
}

.date-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--muted);
}

.date-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  overflow-wrap: break-word;
}

.date-arrow {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: var(--muted);
  transition: transform .2s ease;
}

.history-box {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  margin-top: 15px;
  border: 1px solid var(--border);
}

.history-box__footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.reply {
  margin: 0;
  font-size: 13px;
  color: var(--text);
  overflow-wrap: break-word;
}

/* ---------- Buttons (Premium) ---------- */

.buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

button {
  padding: 11px 22px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 3px 8px -2px rgba(0, 0, 0, .15);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease,
              opacity .15s ease;
}

button svg {
  width: 16px;
  height: 16px;
}

button:hover:not(:disabled) {
  transform: translateY(-3px);
  filter: brightness(1.05);
  box-shadow: 0 10px 18px -6px rgba(0, 0, 0, .22);
}

button:active:not(:disabled) {
  transform: translateY(-1px);
}

button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.approve {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
}

.reject {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
}

/* ---------- Status badges ---------- */

.status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  text-transform: capitalize;
  white-space: nowrap;
}

.status--pending {
  background: rgba(234, 179, 8, .15);
  color: #ca8a04;
}

.status--approved {
  background: rgba(22, 163, 74, .15);
  color: #16a34a;
}

.status--rejected {
  background: rgba(220, 38, 38, .15);
  color: #dc2626;
}

/* ---------- Empty state ---------- */

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 50px 20px;
  text-align: center;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
  color: var(--muted);
}

.empty svg {
  width: 36px;
  height: 36px;
  opacity: .6;
}

.empty p {
  margin: 0;
  font-size: 14px;
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .container {
    padding: 26px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .card {
    padding: 22px;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .container {
    padding: 22px;
  }

  .page-title {
    font-size: 26px;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .container {
    padding: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .section {
    margin-bottom: 30px;
  }

  .section-title {
    font-size: 18px;
  }

  .card {
    padding: 18px;
    border-radius: 16px;
    margin-bottom: 16px;
  }

  .card__head {
    margin-bottom: 16px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    font-size: 13px;
  }

  .date-compare {
    flex-direction: column;
    align-items: stretch;
    padding: 14px;
    gap: 12px;
  }

  .date-arrow {
    transform: rotate(90deg);
    align-self: center;
  }

  .history-box {
    padding: 14px;
  }

  .buttons {
    flex-direction: column;
  }

  button {
    width: 100%;
  }

  .empty {
    padding: 40px 16px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .container {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .section-title {
    font-size: 16px;
  }

  .card {
    padding: 14px;
    border-radius: 14px;
  }

  .card__head {
    gap: 10px;
  }

  .card__head-info {
    gap: 8px;
  }

  .date-value {
    font-size: 13px;
  }

  .date-label {
    font-size: 10px;
  }

  .history-box__footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  button {
    padding: 10px 16px;
    font-size: 13px;
  }

}
.avatar-img{
width:44px;
height:44px;
border-radius:50%;
object-fit:cover;
}
</style>