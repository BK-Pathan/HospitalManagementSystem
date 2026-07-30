<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";

console.log("🔥 Patient History FILE LOADED");

const route = useRoute();
const router = useRouter();


const totalVisits = ref(0);

const lastVisit = ref(null);


const myAppointments = ref([]);

const otherAppointments = ref([]);

const previousPrescriptions = ref([]);


// mobile-only UI state: which card rows are expanded (no backend impact)
const expandedRows = ref([]);

const toggleRow = (id) => {

  const idx = expandedRows.value.indexOf(id);

  if (idx === -1) {

    expandedRows.value.push(id);

  } else {

    expandedRows.value.splice(idx, 1);

  }

};

const isExpanded = (id) => expandedRows.value.includes(id);



// ============================
// Get Patient History
// ============================

const getHistory = async()=>{


try{


const res = await api.get(
`/doctor/patient-history/${route.params.patientId}`
);



// console.log(
// "Patient History:",
// res.data
// );



myAppointments.value =
res.data.myAppointments || [];



otherAppointments.value =
res.data.otherAppointments || [];



previousPrescriptions.value =
res.data.previousPrescriptions || [];



}
catch(error){


console.log(error);



if(error.response?.status === 403){

window.notify(
error.response.data.message
);

router.back();

}



if(error.response?.status === 400){

window.notify(
"Invalid patient id"
);

router.back();

}



}


};





// ============================
// View Prescription
// ============================

const viewPrescription = (item)=>{


const patientId =
item.patient?._id ||
route.params.patientId;



router.push(
`/doctor/prescriptions/${patientId}`
);


};






// ============================
// Patient Stats
// ============================


const getPatientStats = async()=>{


try{


const res = await api.get(

`/doctor/patient-stats/${route.params.patientId}`

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





// Avatar initials

const initials = (name)=>{


if(!name || name==="N/A")

return "?";


return name

.split(" ")

.filter(Boolean)

.slice(0,2)

.map(n=>n[0]?.toUpperCase())

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

<!-- ===== Desktop / tablet table ===== -->

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


<!-- ===== Mobile expandable card list (reference-style) ===== -->

<div class="mobile-list" v-if="myAppointments.length">

  <div
  v-for="item in myAppointments"
  :key="item._id"
  class="mobile-card"
  :class="{ 'mobile-card--open': isExpanded(item._id) }"
  >

    <div
    class="mobile-card-head"
    @click="toggleRow(item._id)"
    >

      <span class="avatar">{{ initials(item.patient?.user?.name) }}</span>

      <div class="mobile-card-title">
        <h4>{{ item.patient?.user?.name || "N/A" }}</h4>
        <p>{{ item.patient?.user?.email || "N/A" }}</p>
      </div>

      <span :class="`status status--${item.status} mobile-status`">{{ item.status }}</span>

      <span class="chevron" :class="{ 'chevron--open': isExpanded(item._id) }">
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>

    </div>

    <transition name="expand">
      <div class="mobile-card-body" v-if="isExpanded(item._id)">

        <div class="detail-row">
          <span class="detail-label">Age</span>
          <span class="detail-value">{{ item.patient?.age || "N/A" }}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Gender</span>
          <span class="detail-value">{{ item.patient?.gender || "N/A" }}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Date</span>
          <span class="detail-value">{{ new Date(item.appointmentDateTime).toLocaleString() }}</span>
        </div>

        <div class="detail-row detail-row--full">
          <span class="detail-label">Problem</span>
          <p class="detail-value">{{ item.patient?.DescribeYourProblem || "N/A" }}</p>
        </div>

        <button
        class="icon-btn primary-btn full-btn"
        @click="
          router.push(
          `/doctor/write-prescription/${item.patient._id}/${item._id}`
          )
        "
        >
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
          Write Prescription
        </button>

      </div>
    </transition>

  </div>

</div>


<div class="empty-state" v-if="!myAppointments.length">
  <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  <p>No appointments with this patient yet.</p>
</div>

</div>




<div class="section-head">
  <h2 class="section-title">Previous Doctors History</h2>
  <span class="section-count" v-if="otherAppointments.length">{{ otherAppointments.length }} records</span>
</div>





<div class="table-card">

<!-- ===== Desktop / tablet table ===== -->

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


<!-- ===== Mobile expandable card list (reference-style) ===== -->

<div class="mobile-list" v-if="otherAppointments.length">

  <div
  v-for="item in otherAppointments"
  :key="item._id"
  class="mobile-card"
  :class="{ 'mobile-card--open': isExpanded('other-' + item._id) }"
  >

    <div
    class="mobile-card-head"
    @click="toggleRow('other-' + item._id)"
    >

      <span class="avatar avatar--muted">{{ initials(item.doctor?.name) }}</span>

      <div class="mobile-card-title">
        <h4>{{ item.doctor?.name || "N/A" }}</h4>
        <p>{{ new Date(item.appointmentDateTime).toLocaleDateString() }}</p>
      </div>

      <span :class="`status status--${item.status} mobile-status`">{{ item.status }}</span>

      <span class="chevron" :class="{ 'chevron--open': isExpanded('other-' + item._id) }">
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>

    </div>

    <transition name="expand">
      <div class="mobile-card-body" v-if="isExpanded('other-' + item._id)">

        <div class="detail-row">
          <span class="detail-label">Date &amp; Time</span>
          <span class="detail-value">{{ new Date(item.appointmentDateTime).toLocaleString() }}</span>
        </div>

        <button
        class="icon-btn secondary-btn full-btn"
        @click="viewPrescription(item)"
        >
          <svg viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
          View Prescription
        </button>

      </div>
    </transition>

  </div>

</div>


<div class="empty-state" v-if="!otherAppointments.length">
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
  margin: 0 0 6px;
}

.page-title {
  font-size: 30px;
  color: var(--text);
  margin: 0;
  letter-spacing: -.01em;
}

/* ---------- Stat cards (Premium) ---------- */

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-bottom: 10px;
}

.card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 22px;
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              box-shadow .3s cubic-bezier(.22,1,.36,1);
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  opacity: 0;
  transition: opacity .3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 16px 28px -10px rgba(15, 23, 42, 0.16);
}

.card:hover::before {
  opacity: 1;
}

.card-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(20,184,166,.18), rgba(20,184,166,.06));
  color: var(--primary);
  box-shadow: inset 0 1px 1px rgba(255,255,255,.5);
}

.card-icon--muted {
  background: linear-gradient(135deg, rgba(100,116,139,.18), rgba(100,116,139,.06));
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
  font-weight: 700;
  margin: 0;
  line-height: 1;
  letter-spacing: -.02em;
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
  flex-wrap: wrap;
  gap: 8px;
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

/* ---------- Table card (Premium) ---------- */

.table-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 10px 24px 24px;
  border-radius: 20px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
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
  letter-spacing: .05em;
  font-weight: 700;
  text-align: left;
  padding: 16px 12px;
  border-bottom: 1px solid var(--border);
  background: transparent;
  white-space: nowrap;
}

.history-table td {
  padding: 16px 12px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  vertical-align: middle;
}

.history-table tbody tr {
  transition: background .2s ease;
}

.history-table tbody tr:last-child td {
  border-bottom: none;
}

.history-table tbody tr:hover {
  background: #f8fafc;
}

.muted-cell {
  color: var(--muted);
  white-space: nowrap;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.avatar {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 10px -3px rgba(20, 184, 166, .5);
}

.avatar--muted {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  box-shadow: 0 4px 10px -3px rgba(100, 116, 139, .4);
}

/* ---------- Status badges ---------- */

.status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  text-transform: capitalize;
  background: rgba(20, 184, 166, .15);
  color: var(--primary);
  white-space: nowrap;
}

.status--pending   { background: rgba(234, 179, 8, .15); color: #ca8a04; }
.status--confirmed { background: rgba(37, 99, 235, .15); color: #2563eb; }
.status--completed { background: rgba(34, 197, 94, .15); color: #16a34a; }
.status--cancelled { background: rgba(239, 68, 68, .15); color: #dc2626; }

/* ---------- Buttons (Premium) ---------- */

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
  white-space: nowrap;
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
}

.icon-btn svg {
  width: 14px;
  height: 14px;
}

.icon-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 18px -6px rgba(0, 0, 0, .2);
}

.primary-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  box-shadow: 0 4px 10px -3px rgba(20, 184, 166, .4);
}

.secondary-btn {
  background: var(--white);
  color: var(--primary);
  border: 1px solid var(--border);
}

.full-btn {
  width: 100%;
  justify-content: center;
  margin-top: 4px;
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

/* ---------- Mobile expandable card list (hidden on desktop) ---------- */

.mobile-list {
  display: none;
}

.mobile-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #f8fafc;
  overflow: hidden;
  transition: border-color .2s ease, background .2s ease;
}

.mobile-card + .mobile-card {
  margin-top: 10px;
}

.mobile-card--open {
  background: #ffffff;
  border-color: rgba(20, 184, 166, .35);
  box-shadow: 0 8px 20px -12px rgba(15, 23, 42, .18);
}

.mobile-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  cursor: pointer;
}

.mobile-card-title {
  flex: 1;
  min-width: 0;
}

.mobile-card-title h4 {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-card-title p {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-status {
  flex-shrink: 0;
  padding: 4px 10px;
  font-size: 10.5px;
}

.chevron {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  background: rgba(20, 184, 166, .12);
  transition: transform .25s ease, background .25s ease;
}

.chevron svg {
  width: 14px;
  height: 14px;
}

.chevron--open {
  transform: rotate(90deg);
  background: var(--primary);
  color: #fff;
}

.mobile-card-body {
  padding: 4px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid var(--border);
  margin-top: 2px;
  padding-top: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
}

.detail-row--full {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.detail-label {
  color: var(--muted);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .03em;
  white-space: nowrap;
}

.detail-value {
  color: var(--text);
  font-weight: 600;
  text-align: right;
  margin: 0;
}

.detail-row--full .detail-value {
  text-align: left;
  font-weight: 500;
  line-height: 1.5;
}

/* expand/collapse transition */

.expand-enter-active,
.expand-leave-active {
  transition: max-height .25s ease, opacity .2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 400px;
  opacity: 1;
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .table-card {
    padding: 10px 20px 20px;
  }
   .history-table th,
  .history-table td{
    padding: 12px 8px;
    font-size: 13px;
  }


  .icon-btn{
    padding:7px 10px;
    font-size:12px;
  }


  .patient-cell{
    gap:6px;
  }


}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .icon-btn {
    padding: 8px 12px;
    font-size: 12.5px;
  }
   .table-card {
    overflow-x: auto;
  }

  .history-table {
    min-width: 900px;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .page-title {
    font-size: 26px;
  }

  .table-card {
    padding: 10px 16px 18px;
    border-radius: 16px;
  }

  .history-table {
    min-width: 700px;
  }

}

/* ==========================
   Mobile — switch table for expandable cards
========================== */
@media (max-width: 768px) {

  .history-page {
    padding: 0;
  }

  .page-header {
    gap: 10px;
    margin-bottom: 22px;
  }

  .page-title {
    font-size: 22px;
  }

 .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .card {
    padding: 14px;
    border-radius: 14px;
    gap: 10px;
  }

  .card-icon {
    width: 38px;
    height: 38px;
  }

  .card-icon svg {
    width: 20px;
    height: 20px;
  }

  .card h3 {
    font-size: 11px;
  }

  .card h1 {
    font-size: 20px;
  }

  .card-value {
    font-size: 14px;
  }

  .section-head {
    margin-top: 26px;
  }

  .section-title {
    font-size: 18px;
  }

  .table-card {
    padding: 10px;
    border-radius: 14px;
    overflow-x: visible;
  }

  /* hide the desktop table, show the expandable card list instead */

  .history-table {
    display: none;
  }

  .mobile-list {
    display: block;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page-title {
    font-size: 20px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .back-btn {
    padding: 8px 14px;
    font-size: 12px;
  }

  .card {
    flex-direction: column;
    align-items: flex-start;
    padding: 14px;
  }

  .card h1 {
    font-size: 22px;
  }

  .mobile-card-head {
    padding: 11px 12px;
    gap: 8px;
  }

  .mobile-card-title h4 {
    font-size: 13px;
  }

  .mobile-card-title p {
    font-size: 11px;
  }

  .mobile-status {
    display: none;
  }

  .avatar {
    width: 32px;
    height: 32px;
    font-size: 11px;
  }

}

</style>