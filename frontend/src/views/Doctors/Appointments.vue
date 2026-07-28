<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../api/axios";


const appointments = ref([]);
const loading = ref(false);

const cancelReason = ref("");
const selectedAppointment = ref(null);

const router = useRouter();
const route = useRoute();



// Get Appointments

const getAppointments = async()=>{

try{

loading.value=true;


const res = await api.get("/doctor/appointments");


appointments.value = res.data;



// Notification se aya hua appointment id

if(route.params.id){

const found =
appointments.value.find(
item=>item._id === route.params.id
);


if(found){

selectedAppointment.value = found._id;


console.log(
"Opened Appointment:",
found
);

}

}



}
catch(error){

console.log(error);

}
finally{

loading.value=false;

}

};





// Confirm / Complete

const updateStatus = async(id,status)=>{

try{


await api.put(
`/doctor/appointment/${id}`,
{
status
}
);



await getAppointments();



}
catch(error){

console.log(error);

alert("Unable to update status");

}

};






// Cancel Appointment

const cancelAppointment = async()=>{


try{


await api.put(
`/doctor/appointment/${selectedAppointment.value}`,
{
status:"cancelled",
cancelReason:cancelReason.value
}
);



alert("Appointment cancelled successfully");



cancelReason.value="";

selectedAppointment.value=null;



await getAppointments();



}
catch(error){


console.log(
error.response?.data || error.message
);


alert("Cancel failed");


}


};






// Patient History

const viewHistory=(patient)=>{


router.push(
`/doctor/patient-history/${patient._id}`
);


};



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




onMounted(()=>{

getAppointments();

});

</script>


<template>

<div class="appointments-page">


<div class="page-header">
  <div>
    <p class="eyebrow">Appointments</p>
    <h2 class="page-title">My Patient Appointments</h2>
  </div>
  <span class="count-pill" v-if="!loading">{{ appointments.length }} total</span>
</div>



<div v-if="loading" class="loading-state">
  <span class="spinner"></span>
  <p>Loading appointments...</p>
</div>




<div v-else class="table-card">


<table class="appointments-table">


<thead>

<tr>

<th>
Patient
</th>

<th>
Email
</th>

<th>
Date &amp; Time
</th>

<th>
Status
</th>

<th>
Action
</th>


</tr>


</thead>




<tbody>


<tr v-if="appointments.length===0">

<td colspan="5" class="empty-data">
  <div class="empty-state">
    <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <p>No appointments found</p>
  </div>
</td>

</tr>





<tr
v-for="item in appointments"
:key="item._id"

:class="{
highlight:item._id === route.params.id
}"

>


<td class="patient-name">
  <div class="patient-cell">
    <span class="avatar">{{ initials(item.patient?.user?.name || item.patient?.name) }}</span>
    {{item.patient?.user?.name || item.patient?.name || "Unknown"}}
  </div>
</td>



<td class="muted-cell">

{{item.patient?.user?.email || item.patient?.email || "N/A"}}

</td>



<td class="muted-cell">

{{
new Date(item.appointmentDateTime)
.toLocaleString()
}}

</td>



<td>

<span :class="`status status--${item.status}`">

{{item.status}}

</span>


</td>




<td class="action-buttons">



<button
class="icon-btn confirm-btn"
title="Confirm"
@click="updateStatus(item._id,'confirmed')"
>
<svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>
Confirm

</button>




<button
class="icon-btn complete-btn"
title="Complete"
@click="updateStatus(item._id,'completed')"
>
<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
Complete

</button>





<button
class="icon-btn cancel-btn"
title="Cancel"
@click="selectedAppointment=item._id"
>
<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
Cancel

</button>

<button
class="icon-btn history-btn"
title="History"
@click="viewHistory(item.patient)"
>
<svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 5v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
History
</button>

</td>


</tr>


</tbody>


</table>


</div>





<!-- Cancel Modal -->


<Teleport to="body">
<div v-if="selectedAppointment" class="modal-overlay" @click.self="selectedAppointment=null">

<div class="cancel-box">

  <div class="cancel-box__header">
    <div class="cancel-box__icon">
      <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </div>
    <div>
      <h3>Cancel Appointment</h3>
      <p>This will notify the patient and free up the slot.</p>
    </div>
  </div>



<textarea

v-model="cancelReason"

placeholder="Enter cancellation reason"

></textarea>




<div class="cancel-box__actions">


<button
class="confirm-cancel"
@click="cancelAppointment"
>

Confirm Cancel

</button>




<button
class="close-btn"
@click="selectedAppointment=null"
>

Close

</button>


</div>


</div>

</div>
</Teleport>



</div>


</template>



<style scoped>


.appointments-page{

min-height:100%;

}


/* ---------- Header ---------- */

.page-header{

display:flex;
align-items:flex-end;
justify-content:space-between;
flex-wrap:wrap;
gap:16px;
margin-bottom:30px;

}


.eyebrow{

font-size:13px;
font-weight:600;
letter-spacing:.04em;
text-transform:uppercase;
color:var(--primary);
margin:0 0 6px;

}


.page-title{

color:var(--text);

font-size:30px;

margin:0;

}


.count-pill{

display:inline-flex;
align-items:center;
padding:10px 18px;
border-radius:999px;
background:var(--white);
border:1px solid var(--border);
box-shadow:var(--shadow);
color:var(--muted);
font-size:14px;
font-weight:500;

}



/* ---------- Loading ---------- */


.loading-state{

display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:14px;
padding:60px 0;
color:var(--muted);

}


.spinner{

width:32px;
height:32px;
border-radius:50%;
border:3px solid var(--border);
border-top-color:var(--primary);
animation:spin .8s linear infinite;

}


@keyframes spin{

to{ transform:rotate(360deg); }

}



.table-card{

background:var(--white);

padding:10px 24px 24px;

border-radius:18px;

box-shadow:var(--shadow);

border:1px solid var(--border);

overflow-x:auto;

}




.appointments-table{

width:100%;

border-collapse:collapse;

}



.appointments-table th{

padding:16px 12px;

text-align:left;

color:var(--muted);

font-size:12px;

text-transform:uppercase;

letter-spacing:.04em;

font-weight:700;

background:transparent;

border-bottom:1px solid var(--border);

}



.appointments-table td{

padding:16px 12px;

color:var(--text);

border-bottom:1px solid var(--border);

font-size:14px;

vertical-align:middle;

}


.appointments-table tbody tr:last-child td{

border-bottom:none;

}



.appointments-table tr:hover{

background:#f8fafc;

}



.muted-cell{

color:var(--muted);

}


.patient-cell{

display:flex;
align-items:center;
gap:10px;

}


.avatar{

flex-shrink:0;
width:34px;
height:34px;
border-radius:50%;
display:flex;
align-items:center;
justify-content:center;
background:linear-gradient(135deg,var(--primary),var(--primary-dark));
color:#fff;
font-size:12px;
font-weight:700;

}



.patient-name{

font-weight:700;

color:var(--text);

}



.status{

display:inline-block;

padding:6px 14px;

border-radius:999px;

font-size:12px;

font-weight:700;

text-transform:capitalize;

background:rgba(20,184,166,.15);

color:var(--primary);

}


.status--pending{ background:rgba(234,179,8,.15); color:#ca8a04; }
.status--confirmed{ background:rgba(37,99,235,.15); color:#2563eb; }
.status--completed{ background:rgba(22,163,74,.15); color:#16a34a; }
.status--cancelled{ background:rgba(220,38,38,.15); color:#dc2626; }



.action-buttons{

display:flex;

gap:8px;

flex-wrap:wrap;

}



.icon-btn{

display:inline-flex;
align-items:center;
gap:6px;
border:none;

padding:9px 13px;

border-radius:10px;

cursor:pointer;

color:white;

font-weight:600;

font-size:13px;

transition:transform .15s ease, box-shadow .15s ease;

}


.icon-btn svg{

width:14px;
height:14px;

}



.confirm-btn{

background:#16a34a;

}



.complete-btn{

background:#2563eb;

}



.cancel-btn{

background:#dc2626;

}


.history-btn{

background:var(--muted);

}



.icon-btn:hover{

transform:translateY(-2px);

box-shadow:0 6px 14px rgba(0,0,0,.12);

}




/* ---------- Cancel Modal ---------- */


.modal-overlay{

position:fixed;
inset:0;
background:rgba(15,23,42,.5);
display:flex;
align-items:center;
justify-content:center;
padding:20px;
z-index:1000;

}


.cancel-box{

width:100%;
max-width:440px;

background:var(--white);

padding:28px;

border-radius:18px;

border:1px solid var(--border);

box-shadow:0 20px 40px rgba(0,0,0,.18);

}


.cancel-box__header{

display:flex;
align-items:flex-start;
gap:14px;
margin-bottom:18px;

}


.cancel-box__icon{

flex-shrink:0;
width:42px;
height:42px;
border-radius:12px;
display:flex;
align-items:center;
justify-content:center;
background:rgba(220,38,38,.12);
color:#dc2626;

}


.cancel-box__icon svg{

width:22px;
height:22px;

}


.cancel-box__header h3{

color:var(--text);

margin:0 0 4px;

font-size:17px;

}


.cancel-box__header p{

margin:0;

color:var(--muted);

font-size:13px;

}



.cancel-box textarea{

width:100%;

height:100px;

padding:14px;

border-radius:10px;

border:1px solid var(--border);

resize:none;

margin-bottom:18px;

font-family:inherit;

font-size:14px;

color:var(--text);

box-sizing:border-box;

}


.cancel-box textarea:focus{

outline:none;

border-color:var(--primary);

}



.cancel-box__actions{

display:flex;

gap:10px;

}



.confirm-cancel{

flex:1;

border:none;

padding:12px 14px;

border-radius:10px;

cursor:pointer;

color:white;

font-weight:700;

background:#dc2626;

}



.close-btn{

flex:1;

border:none;

padding:12px 14px;

border-radius:10px;

cursor:pointer;

color:white;

font-weight:700;

background:var(--muted);

}


.confirm-cancel:hover,
.close-btn:hover{

opacity:.9;

}



.empty-data{

text-align:center;

padding:0;

}


.empty-state{

display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:12px;
padding:50px 20px;
color:var(--muted);

}


.empty-state svg{

width:36px;
height:36px;
opacity:.6;

}


.empty-state p{

margin:0;

font-size:14px;

}



.highlight{

background:#ecfeff !important;

border-left:4px solid var(--primary);

}

</style>