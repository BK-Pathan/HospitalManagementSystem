<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();
const router = useRouter();
const totalVisits = ref(0);

const lastVisit = ref(null);

const myAppointments = ref([]);

const otherAppointments = ref([]);



const getHistory = async()=>{


try{


const res = await api.get(
`/doctor/patient-history/${route.params.patientId}`
);



console.log(res.data);



myAppointments.value = res.data.myAppointments;


otherAppointments.value = res.data.otherAppointments;



}catch(error){


console.log(error);


}



};

const viewPrescription = (item)=>{


console.log(
"Selected Appointment For Prescription:",
item
);



const patientId = item.patient?._id;



console.log(
"Patient ID:",
patientId
);



if(!patientId){


console.log(
"Patient ID not found"
);


return;

}



router.push(
`/doctor/prescriptions/${patientId}`
);



};

const getPatientStats = async()=>{


try{


const res = await api.get(

`/doctor/patient-stats/${route.params.patientId}`

);



console.log(
"Patient Stats:",
res.data
);



totalVisits.value =
res.data.totalVisits;



lastVisit.value =
res.data.lastVisit;



}
catch(error){

console.log(error);

}


};

onMounted(()=>{

getHistory();
getPatientStats();

});


// Display-only helper (no backend / data change)

const initials = (name) => {
  if (!name || name === "N/A") return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};


</script>



<template>


<div class="history-page">


<div class="page-header">
  <button class="back-btn" @click="router.back()">
    <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Back
  </button>
  <div>
    <p class="eyebrow">Patient Record</p>
    <h2 class="page-title">Patient History</h2>
  </div>
</div>


<div class="stats">


<div class="card">
  <div class="card-icon">
    <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  </div>
  <div>
    <h3>Total Visits</h3>
    <h1>{{totalVisits}}</h1>
  </div>
</div>



<div class="card">
  <div class="card-icon card-icon--muted">
    <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  </div>
  <div>
    <h3>Last Visit</h3>

    <p class="card-value" v-if="lastVisit">
      {{new Date(
      lastVisit.appointmentDateTime
      ).toLocaleDateString()}}
    </p>

    <p class="card-value card-value--empty" v-else>
      No visit yet
    </p>
  </div>
</div>


</div>


<div class="section-head">
  <h2 class="section-title">My Patient History</h2>
  <span class="section-count" v-if="myAppointments.length">{{ myAppointments.length }} visits</span>
</div>

<div class="table-card">

<table class="history-table" v-if="myAppointments.length">


<thead>
<tr>

<th>
Name
</th>

<th>
Email
</th>

<th>
Age
</th>

<th>
Gender
</th>

<th>
Date
</th>

<th>
Problem
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
<tr
v-for="item in myAppointments"
:key="item._id"
>



<td>
  <div class="patient-cell">
    <span class="avatar">{{ initials(item.patient?.user?.name) }}</span>
    {{item.patient?.user?.name || "N/A"}}
  </div>
</td>


<td class="muted-cell">
{{item.patient?.user?.email || "N/A"}}
</td>


<td>
{{item.patient?.age || "N/A"}}
</td>


<td>
{{item.patient?.gender || "N/A"}}
</td>



<td class="muted-cell">

{{new Date(item.appointmentDateTime).toLocaleString()}}

</td>



<td>

{{item.patient?.DescribeYourProblem || "N/A"}}

</td>



<td>

<span :class="`status status--${item.status}`">{{item.status}}</span>

</td>




<td>


<button
class="icon-btn primary-btn"
@click="
router.push(
`/doctor/write-prescription/${item.patient._id}/${item._id}`
)
"

>
<svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
Write Prescription

</button>



</td>


</tr>
</tbody>



</table>

<div class="empty-state" v-else>
  <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  <p>No appointments with this patient yet.</p>
</div>

</div>




<div class="section-head">
  <h2 class="section-title">Previous Doctors History</h2>
  <span class="section-count" v-if="otherAppointments.length">{{ otherAppointments.length }} records</span>
</div>



<div class="table-card">

<table class="history-table" v-if="otherAppointments.length">


<thead>
<tr>


<th>
Doctor
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
</thead>



<tbody>
<tr
v-for="item in otherAppointments"
:key="item._id"
>



<td>
  <div class="patient-cell">
    <span class="avatar avatar--muted">{{ initials(item.doctor?.name) }}</span>
    {{item.doctor?.name || "N/A"}}
  </div>
</td>



<td class="muted-cell">

{{new Date(item.appointmentDateTime).toLocaleString()}}

</td>



<td>

<span :class="`status status--${item.status}`">{{item.status}}</span>

</td>



<td>


<button
class="icon-btn secondary-btn"
@click="viewPrescription(item)"
>
<svg viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
View Prescription
</button>


</td>



</tr>
</tbody>



</table>

<div class="empty-state" v-else>
  <svg viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
  <p>No history with other doctors.</p>
</div>

</div>




</div>



</template>


<style scoped>

.history-page {
  min-height: 100%;
}

/* ---------- Header ---------- */

.page-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 30px;
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
  box-shadow: var(--shadow);
  transition: transform .15s ease;
}

.back-btn svg {
  width: 15px;
  height: 15px;
}

.back-btn:hover {
  transform: translateX(-2px);
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
}

/* ---------- Stat cards ---------- */

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-bottom: 10px;
}

.card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--white);
  padding: 22px;
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: transform .25s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 184, 166, .12);
  color: var(--primary);
}

.card-icon--muted {
  background: rgba(100, 116, 139, .12);
  color: var(--muted);
}

.card-icon svg {
  width: 24px;
  height: 24px;
}

.card h3 {
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .03em;
  margin: 0 0 6px;
}

.card h1 {
  color: var(--text);
  font-size: 28px;
  margin: 0;
  line-height: 1;
}

.card-value {
  color: var(--text);
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.card-value--empty {
  color: var(--muted);
  font-weight: 500;
  font-size: 15px;
}

/* ---------- Section headers ---------- */

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 34px;
  margin-bottom: 14px;
}

.section-title {
  color: var(--text);
  font-size: 20px;
  margin: 0;
}

.section-count {
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}

/* ---------- Table card ---------- */

.table-card {
  background: var(--white);
  padding: 10px 24px 24px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table thead th {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
  font-weight: 700;
  text-align: left;
  padding: 16px 12px;
  border-bottom: 1px solid var(--border);
  background: transparent;
}

.history-table td {
  padding: 16px 12px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  vertical-align: middle;
}

.history-table tbody tr:last-child td {
  border-bottom: none;
}

.history-table tbody tr:hover {
  background: #f8fafc;
}

.muted-cell {
  color: var(--muted);
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.avatar {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.avatar--muted {
  background: linear-gradient(135deg, #94a3b8, #64748b);
}

.status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  text-transform: capitalize;
  background: rgba(20, 184, 166, .15);
  color: var(--primary);
}

.status--pending { background: rgba(234, 179, 8, .15); color: #ca8a04; }
.status--confirmed { background: rgba(37, 99, 235, .15); color: #2563eb; }
.status--completed { background: rgba(34, 197, 94, .15); color: #16a34a; }
.status--cancelled { background: rgba(239, 68, 68, .15); color: #dc2626; }

/* ---------- Buttons ---------- */

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  padding: 9px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: transform .15s ease, box-shadow .15s ease;
}

.icon-btn svg {
  width: 14px;
  height: 14px;
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, .12);
}

.primary-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
}

.secondary-btn {
  background: var(--white);
  color: var(--primary);
  border: 1px solid var(--border);
}

/* ---------- Empty state ---------- */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 50px 20px;
  color: var(--muted);
}

.empty-state svg {
  width: 36px;
  height: 36px;
  opacity: .6;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 700px) {
  .stats {
    grid-template-columns: 1fr;
  }
}

</style>