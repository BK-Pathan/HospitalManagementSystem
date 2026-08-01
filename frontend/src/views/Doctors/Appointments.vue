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

// track which mobile cards are expanded
const expandedCards = ref(new Set());

const toggleCard = (id)=>{

if(expandedCards.value.has(id)){
    expandedCards.value.delete(id);
}else{
    expandedCards.value.add(id);
}

expandedCards.value = new Set(expandedCards.value);

};

const isExpanded = (id)=> expandedCards.value.has(id);

console.log("🔥 DOCTOR appointment FILE LOADED");


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


// console.log(
// "Opened Appointment:",
// found
// );

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

window.notify("Unable to update status");

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


window.notify("Appointment cancelled successfully");



cancelReason.value="";

selectedAppointment.value=null;



await getAppointments();



}
catch(error){


console.log(
error.response?.data || error.message
);


window.notify("Cancel failed");


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


<!-- ================= DESKTOP TABLE ================= -->

<div class="table-scroll">

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

<img
v-if="item.patient?.user?.profileImage"
:src="item.patient.user.profileImage"
class="avatar-img"
/>

<span v-else class="avatar">
{{ initials(item.patient?.user?.name || item.patient?.name) }}
</span>

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



<!-- ================= MOBILE CARDS ================= -->

<div class="mobile-list">

    <div
    v-for="item in appointments"
    :key="item._id"
    class="mobile-card"
    :class="{highlight:item._id === route.params.id}"
    >

        <div
        class="mobile-card-main"
        @click="toggleCard(item._id)"
        >

<img
v-if="item.patient?.user?.profileImage"
:src="item.patient.user.profileImage"
class="avatar-img"
/>

<span v-else class="avatar">
{{ initials(item.patient?.user?.name || item.patient?.name) }}
</span>

            <div class="mobile-card-info">

                <span class="mobile-card-name">
                    {{ item.patient?.user?.name || item.patient?.name || "Unknown" }}
                </span>

                <span class="mobile-card-email">
                    {{ item.patient?.user?.email || item.patient?.email || "N/A" }}
                </span>

                <span class="mobile-card-date">
                    {{ new Date(item.appointmentDateTime).toLocaleString() }}
                </span>

            </div>

            <div class="mobile-card-side">

                <span :class="`status status--${item.status}`">
                    {{ item.status }}
                </span>

                <button
                class="chevron"
                :class="{open:isExpanded(item._id)}"
                >
                    ›
                </button>

            </div>

        </div>

        <transition name="expand">

        <div
        v-if="isExpanded(item._id)"
        class="mobile-card-details"
        >

            <button
            class="icon-btn confirm-btn"
            @click="updateStatus(item._id,'confirmed')"
            >
            <svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>
            Confirm
            </button>

            <button
            class="icon-btn complete-btn"
            @click="updateStatus(item._id,'completed')"
            >
            <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Complete
            </button>

            <button
            class="icon-btn cancel-btn"
            @click="selectedAppointment=item._id"
            >
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Cancel
            </button>

            <button
            class="icon-btn history-btn"
            @click="viewHistory(item.patient)"
            >
            <svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 5v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            History
            </button>

        </div>

        </transition>

    </div>

    <div
    v-if="appointments.length===0"
    class="empty-data"
    >
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <p>No appointments found</p>
      </div>
    </div>

</div>


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

.appointments-page {
  min-height: 100%;
}

/* ---------- Header ---------- */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 30px;
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
  color: var(--text);
  font-size: 30px;
  margin: 0;
  letter-spacing: -.01em;
}

.count-pill {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--white);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}

/* ---------- Loading ---------- */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 60px 0;
  color: var(--muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
}

.table-scroll{

  overflow-x: auto;

}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
}

.appointments-table th {
  padding: 16px 12px;
  text-align: left;
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .05em;
  font-weight: 700;
  background: transparent;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.appointments-table td {
  padding: 16px 12px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  font-size: 14px;
  vertical-align: middle;
}

.appointments-table tbody tr {
  transition: background .2s ease;
}

.appointments-table tbody tr:last-child td {
  border-bottom: none;
}

.appointments-table tr:hover {
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
.avatar-img{

width:36px;
height:36px;
border-radius:50%;
object-fit:cover;
flex-shrink:0;

}
.patient-name {
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}

/* ---------- Status badges ---------- */

.status {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
  background: rgba(20, 184, 166, .15);
  color: var(--primary);
  white-space: nowrap;
}

.status--pending   { background: rgba(234, 179, 8, .15); color: #ca8a04; }
.status--confirmed { background: rgba(37, 99, 235, .15); color: #2563eb; }
.status--completed { background: rgba(22, 163, 74, .15); color: #16a34a; }
.status--cancelled { background: rgba(220, 38, 38, .15); color: #dc2626; }

/* ---------- Action buttons (Premium) ---------- */

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 260px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  padding: 9px 14px;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 3px 8px -2px rgba(0, 0, 0, .18);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
  white-space: nowrap;
}

.icon-btn svg {
  width: 14px;
  height: 14px;
}

.confirm-btn  { background: linear-gradient(135deg, #16a34a, #15803d); }
.complete-btn { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
.cancel-btn   { background: linear-gradient(135deg, #dc2626, #b91c1c); }
.history-btn  { background: linear-gradient(135deg, var(--muted), #475569); }

.icon-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 18px -6px rgba(0, 0, 0, .25);
  filter: brightness(1.06);
}

.icon-btn:active {
  transform: translateY(-1px);
}

/* ---------- Cancel Modal (Premium) ---------- */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  animation: fadeIn .2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cancel-box {
  width: 100%;
  max-width: 440px;
  background: var(--white);
  padding: 28px;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, .25);
  animation: slideUp .25s cubic-bezier(.22,1,.36,1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.cancel-box__header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.cancel-box__icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(220,38,38,.18), rgba(220,38,38,.06));
  color: #dc2626;
  box-shadow: inset 0 1px 1px rgba(255,255,255,.5);
}

.cancel-box__icon svg {
  width: 22px;
  height: 22px;
}

.cancel-box__header h3 {
  color: var(--text);
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 700;
}

.cancel-box__header p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.cancel-box textarea {
  width: 100%;
  height: 100px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  resize: none;
  margin-bottom: 18px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
  box-sizing: border-box;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.cancel-box textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, .15);
}

.cancel-box__actions {
  display: flex;
  gap: 10px;
}

.confirm-cancel {
  flex: 1;
  border: none;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  font-weight: 700;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  box-shadow: 0 6px 14px -4px rgba(220, 38, 38, .4);
  transition: transform .15s ease, filter .15s ease;
}

.close-btn {
  flex: 1;
  border: none;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  font-weight: 700;
  background: var(--muted);
  transition: transform .15s ease, filter .15s ease;
}

.confirm-cancel:hover,
.close-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

/* ---------- Empty state ---------- */

.empty-data {
  text-align: center;
  padding: 0;
}

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

.highlight {
  background: #ecfeff !important;
  border-left: 4px solid var(--primary);
}

/* ================= MOBILE CARD LIST (hidden on desktop) ================= */

.mobile-list{

  display:none;

}


.mobile-card{

  background:var(--white);
  border:1px solid var(--border);
  border-radius:16px;
  box-shadow:0 1px 2px rgba(15,23,42,.04), 0 6px 16px -8px rgba(15,23,42,.08);
  margin-bottom:12px;
  overflow:hidden;
  transition:.3s;

}


.mobile-card.highlight{

  border-left:4px solid var(--primary);
  background:#ecfeff;

}


.mobile-card-main{

  display:flex;
  align-items:center;
  gap:12px;
  padding:14px 16px;
  cursor:pointer;

}


.mobile-card-info{

  flex:1;
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:2px;

}


.mobile-card-name{

  font-weight:700;
  font-size:15px;
  color:var(--text);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;

}


.mobile-card-email{

  font-size:12px;
  color:var(--muted);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;

}


.mobile-card-date{

  font-size:12px;
  color:var(--muted);

}


.mobile-card-side{

  display:flex;
  flex-direction:column;
  align-items:flex-end;
  gap:8px;
  flex-shrink:0;

}


.chevron{

  background:#f3f4f6;
  color:var(--muted);
  border:none;
  width:26px;
  height:26px;
  padding:0;
  border-radius:50%;
  font-size:16px;
  font-weight:900;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:.3s;

}


.chevron.open{

  transform:rotate(90deg);
  background:linear-gradient(135deg, var(--primary), var(--primary-dark));
  color:white;

}


.mobile-card-details{

  padding:14px 16px 16px;
  border-top:1px solid var(--border);
  display:flex;
  flex-direction:column;
  gap:8px;

}


.mobile-card-details .icon-btn{

  width:100%;
  justify-content:center;

}


/* expand transition */

.expand-enter-active,
.expand-leave-active{

  transition:.25s ease;

}


.expand-enter-from,
.expand-leave-to{

  opacity:0;

}


/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .table-card {
    padding: 10px 20px 20px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .action-buttons{
    flex-direction: column;
    gap:6px;
    min-width:130px;
  }


  .icon-btn{
    width:100%;
    justify-content:center;
    padding:7px 10px;
    font-size:12px;
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

  .appointments-table {
    min-width: 760px;
  }

  .icon-btn span {
    display: inline;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .appointments-page {
    padding: 0;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 24px;
  }

  .page-title {
    font-size: 24px;
  }

  .count-pill {
    width: 100%;
    justify-content: center;
  }

  .table-card {
    padding: 8px 12px 16px;
    border-radius: 14px;
  }

  /* swap table for cards on mobile */

  .table-scroll{

    display:none;

  }


  .mobile-list{

    display:block;

  }

  .cancel-box {
    padding: 22px;
    border-radius: 16px;
  }

  .cancel-box__icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .cancel-box__header h3 {
    font-size: 16px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page-title {
    font-size: 21px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .count-pill {
    font-size: 13px;
    padding: 9px 14px;
  }

  .cancel-box {
    padding: 18px;
  }

  .cancel-box__header {
    gap: 10px;
    margin-bottom: 14px;
  }

  .cancel-box textarea {
    height: 84px;
    padding: 12px;
    font-size: 13px;
  }

  .cancel-box__actions {
    flex-direction: column;
  }

}

</style>