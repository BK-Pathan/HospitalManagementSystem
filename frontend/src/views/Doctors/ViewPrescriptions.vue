<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();
const router = useRouter();


const prescriptions = ref([]);

const loading = ref(true);



// ============================
// GET PRESCRIPTIONS
// ============================

const getPrescriptions = async()=>{


try{


console.log(
"Patient ID:",
route.params.patientId
);



const res = await api.get(

`/prescription/patient/${route.params.patientId}`

);



console.log(
"Prescription Response:",
res.data
);



prescriptions.value=res.data;



}

catch(error){


console.log(
"Prescription Error:",
error.response?.data || error.message
);


}

finally{


loading.value=false;


}


};




onMounted(()=>{


getPrescriptions();


});


</script>





<template>


<div class="page">


<div class="page-header">
  <button class="back-btn" @click="router.back()">
    <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Back
  </button>
  <p class="eyebrow">Medical Records</p>
  <h2 class="page-title">Patient Prescriptions</h2>
</div>



<div v-if="loading" class="loading-state">
  <span class="spinner"></span>
  <p>Loading prescriptions...</p>
</div>





<div
v-else-if="prescriptions.length===0"
class="empty"
>

<svg viewBox="0 0 24 24" fill="none"><path d="M9 12h6M9 16h6M9 8h1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
<p>No prescriptions found for this patient.</p>


</div>







<div
v-for="prescription in prescriptions"
:key="prescription._id"
class="card"
>



<div class="card__head">

<div class="card__head-icon">
  <svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 2v6h6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 13h6M9 17h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
</div>

<div class="card__head-info">
  <h3>Prescription Details</h3>
  <span class="date-pill">{{new Date(prescription.createdAt).toLocaleDateString()}}</span>
</div>

</div>


<div class="meta-row">

<div class="meta-item">
  <span class="meta-label">Doctor</span>
  <span class="meta-value">{{prescription.doctor?.user?.name || "N/A"}}</span>
</div>

<div class="meta-item">
  <span class="meta-label">Patient</span>
  <span class="meta-value">{{prescription.patient?.user?.name || "N/A"}}</span>
</div>

</div>




<h4>
Medicines
</h4>




<table v-if="prescription.medicines?.length" class="medicine-table">


<thead>
<tr>

<th>
Name
</th>


<th>
Dosage
</th>


<th>
Frequency
</th>


</tr>
</thead>




<tbody>
<tr
v-for="medicine in prescription.medicines"
:key="medicine._id"
>


<td class="medicine-name-cell">
{{medicine.name}}
</td>


<td>
{{medicine.dosage}}
</td>


<td>
{{medicine.frequency}}
</td>


</tr>
</tbody>


</table>

<p v-else class="no-data">No medicines listed.</p>




<div class="notes-grid">

<div class="notes-block">
  <h4>Instructions</h4>
  <p :class="{ 'no-data': !prescription.instructions }">
    {{prescription.instructions || "No instructions"}}
  </p>
</div>

<div class="notes-block">
  <h4>Notes</h4>
  <p :class="{ 'no-data': !prescription.notes }">
    {{prescription.notes || "No notes"}}
  </p>
</div>

</div>




</div>



</div>


</template>






<style scoped>

.page {
  padding: 30px;
}

.page-header {
  margin-bottom: 25px;
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
  margin-bottom: 14px;
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
  color: var(--text);
  margin: 0;
  font-size: 28px;
  letter-spacing: -.01em;
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
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
}

.spinner {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- Card (Premium) ---------- */

.card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 25px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
  transition: box-shadow .3s ease, transform .3s ease;
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
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.card__head-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(20,184,166,.18), rgba(20,184,166,.06));
  color: var(--primary);
  box-shadow: inset 0 1px 1px rgba(255,255,255,.5);
}

.card__head-icon svg {
  width: 22px;
  height: 22px;
}

.card__head-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.card__head-info h3 {
  margin: 0;
  color: var(--text);
  font-size: 17px;
  font-weight: 700;
}

.date-pill {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(20, 184, 166, .12);
  color: var(--primary);
  white-space: nowrap;
}

/* ---------- Meta row ---------- */

.meta-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid var(--border);
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.meta-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--muted);
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  overflow-wrap: break-word;
}

h4 {
  color: var(--text);
  margin: 0 0 12px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: .03em;
  font-weight: 700;
}

/* ---------- Medicine table ---------- */

.medicine-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.medicine-table th {
  padding: 12px;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: var(--muted);
  font-weight: 700;
  border-bottom: 1px solid var(--border);
}

.medicine-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  font-size: 14px;
}

.medicine-table tbody tr {
  transition: background .2s ease;
}

.medicine-table tbody tr:hover {
  background: #f8fafc;
}

.medicine-table tbody tr:last-child td {
  border-bottom: none;
}

.medicine-name-cell {
  font-weight: 600;
}

.no-data {
  color: var(--muted);
  font-style: italic;
}

/* ---------- Instructions / notes ---------- */

.notes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.notes-block p {
  margin: 0;
  color: var(--text);
  font-size: 14px;
  line-height: 1.6;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
  overflow-wrap: break-word;
}

/* ---------- Empty state ---------- */

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 50px 20px;
  border-radius: 20px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
  color: var(--muted);
}

.empty svg {
  width: 38px;
  height: 38px;
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

  .page {
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

  .page {
    padding: 22px;
  }

  .page-title {
    font-size: 25px;
  }

  .meta-row,
  .notes-grid {
    grid-template-columns: 1fr;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .page {
    padding: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .card {
    padding: 18px;
    border-radius: 16px;
    margin-bottom: 18px;
  }

  .card__head {
    gap: 12px;
    margin-bottom: 14px;
  }

  .card__head-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .card__head-icon svg {
    width: 19px;
    height: 19px;
  }

  .card__head-info h3 {
    font-size: 15px;
  }

  .meta-row {
    padding: 14px;
    gap: 12px;
  }

  .medicine-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .medicine-table th,
  .medicine-table td {
    padding: 10px;
    font-size: 13px;
  }

  .notes-block p {
    padding: 12px;
    font-size: 13px;
  }

  .empty {
    padding: 40px 16px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
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

  .card {
    padding: 14px;
    border-radius: 14px;
  }

  .card__head {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .card__head-info {
    gap: 8px;
  }

  .date-pill {
    font-size: 11px;
    padding: 4px 10px;
  }

  .meta-row {
    padding: 12px;
  }

  .meta-value {
    font-size: 13px;
  }

  h4 {
    font-size: 13px;
  }

}

</style>