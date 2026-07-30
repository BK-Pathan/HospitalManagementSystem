<script setup>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
ref,
onMounted
} from "vue";

import api from "../../api/axios";

console.log("🔥 Prescription History FILE LOADED");

const prescriptions = ref([]);

const loading = ref(true);



const getMyPrescriptions = async()=>{


try{


const res = await api.get(
"/prescription/my"
);

// console.log(
// "Prescription API:",
// JSON.stringify(res.data,null,2)
// );

// console.log(
// "My Prescriptions:",
// res.data
// );



prescriptions.value = res.data;



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

const downloadPDF = (item)=>{


const doc = new jsPDF();



doc.setFontSize(20);

doc.text(
"Medical Prescription",
20,
20
);




doc.setFontSize(12);



doc.text(
`Patient: ${item.patient?.user?.name || "N/A"}`,
20,
35
);



doc.text(
`Doctor: ${item.doctor?.user?.name || "N/A"}`,
20,
45
);


doc.text(
`Date: ${new Date(item.createdAt).toLocaleDateString()}`,
20,
55
);




doc.text(
"Medicines",
20,
70
);





autoTable(doc,{

startY:80,


head:[

[
"Medicine",
"Dosage",
"Frequency"
]

],


body:item.medicines.map(med=>[

med.name,

med.dosage || "-",

med.frequency || "-"

])


});





let finalY =
doc.lastAutoTable.finalY + 15;





doc.text(

"Instructions:",

20,

finalY

);



doc.text(

item.instructions || "No instructions",

20,

finalY+10

);






doc.text(

"Notes:",

20,

finalY+30

);



doc.text(

item.notes || "No notes",

20,

finalY+40

);






doc.save(

`Prescription-${item.patient?.user?.name || "Patient"}.pdf`

);



};
onMounted(()=>{

getMyPrescriptions();

});


</script>

<template>

<div class="page">


  <div class="page-header">

    <div>
      <p class="eyebrow">Patient Records</p>
      <h2 class="title">Prescription History</h2>
    </div>

    <span class="count-badge" v-if="prescriptions.length">
      {{ prescriptions.length }} record{{ prescriptions.length === 1 ? '' : 's' }}
    </span>

  </div>



  <div v-if="loading" class="loading-state">

    <div class="spinner"></div>
    <p>Loading prescriptions...</p>

  </div>




  <div

  v-else-if="!prescriptions.length"

  class="empty"

  >

    <div class="empty-icon">📄</div>
    <p>No Prescription Available</p>

  </div>






  <div

  v-for="item in prescriptions"

  :key="item._id"

  class="prescription-card"

  >


    <!-- Patient group header (like reference: "PATIENT: Name") -->
    <div class="patient-header">

      <span class="patient-label">PATIENT:</span>
      <span class="patient-name">{{ item.patient?.user?.name || "Patient" }}</span>

      <span class="doctor-chip" v-if="item.doctor">
        <span class="header-icon">👨‍⚕️</span> Dr. {{ item.doctor?.user?.name || item.doctor?.name || "Doctor" }}
      </span>

    </div>


    <!-- Each medicine styled as its own row + info grid, like the reference cards -->
    <div
    v-for="med in item.medicines"
    :key="med._id"
    class="med-block"
    >

      <div class="med-row">

        <div class="med-icon">💊</div>

        <div class="med-info">
          <p class="med-name">{{ med.name }}</p>
          <p class="med-sub">{{ med.dosage || "-" }} · {{ med.frequency || "-" }}</p>
        </div>

        <span class="status status--track">Completed</span>

      </div>

      <div class="info-grid">

        <div class="info-col">
          <span class="info-label">date</span>
          <span class="info-value">{{ new Date(item.createdAt).toLocaleDateString() }}</span>
        </div>

        <div class="info-col">
          <span class="info-label">prescriber</span>
          <span class="info-value">{{ item.doctor?.user?.name || item.doctor?.name || "N/A" }}</span>
        </div>

        <div class="info-col" v-if="item.doctor?.department">
          <span class="info-label">department</span>
          <span class="info-value">{{ item.doctor.department }}</span>
        </div>

        <div class="info-col" v-else-if="item.doctor?.experience">
          <span class="info-label">experience</span>
          <span class="info-value">{{ item.doctor.experience }} yrs</span>
        </div>

      </div>

    </div>


    <!-- Instructions & notes -->
    <div class="info">

      <h4>📝 Instructions</h4>
      <p>{{ item.instructions || "No instructions" }}</p>

      <h4>📌 Notes</h4>
      <p>{{ item.notes || "No notes" }}</p>

    </div>


    <button
    class="download-btn"
    @click="downloadPDF(item)"
    >
      ⬇️ Download PDF
    </button>


  </div>


</div>


</template>


<style scoped>

.page {
  --clinical-navy: #0F2A43;
  --clinical-teal: #0D9488;
  --clinical-teal-light: #CCFBF1;
  --clinical-bg: #F4F7FA;
  --clinical-surface: #FFFFFF;
  --clinical-border: #E2E8F0;
  --clinical-text: #1E293B;
  --clinical-text-muted: #64748B;
  --clinical-amber: #D97706;
  --clinical-amber-light: #FEF3C7;
  --clinical-green: #16A34A;
  --clinical-green-light: #DCFCE7;
  --clinical-blue: #2563EB;
  --clinical-blue-light: #DBEAFE;
  --clinical-purple: #7C3AED;
  --clinical-purple-light: #EDE9FE;
  --clinical-indigo: #4F46E5;
  --clinical-indigo-light: #E0E7FF;

  padding: 20px 24px;
  background: var(--clinical-bg);
  font-family: -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif;
  color: var(--clinical-text);
}

/* ---------- Header ---------- */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: 12px;
  font-weight: 700;
  color: var(--clinical-teal);
  margin: 0 0 6px;
}

.title {
  font-size: 25px;
  font-weight: 700;
  margin: 0;
  color: var(--clinical-navy);
  letter-spacing: -.01em;
}

.count-badge {
  font-size: 13px;
  font-weight: 600;
  color: var(--clinical-teal);
  background: var(--clinical-teal-light);
  padding: 5px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ---------- Loading ---------- */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 70px 0;
  color: var(--clinical-text-muted);
}

.spinner {
  width: 34px;
  height: 34px;
  border: 3px solid var(--clinical-border);
  border-top-color: var(--clinical-teal);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- Empty state ---------- */

.empty {
  background: linear-gradient(180deg, var(--clinical-surface) 0%, #fbfdfe 100%);
  padding: 50px 30px;
  border-radius: 18px;
  text-align: center;
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 8px 20px -10px rgba(15, 42, 67, 0.08);
  border: 1px solid var(--clinical-border);
  color: var(--clinical-text-muted);
}

.empty-icon {
  font-size: 34px;
  margin-bottom: 10px;
}

/* ---------- Prescription card ---------- */

.prescription-card {
  background: linear-gradient(180deg, var(--clinical-surface) 0%, #fbfdfe 100%);
  padding: 26px;
  border-radius: 18px;
  margin-bottom: 20px;
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 8px 20px -10px rgba(15, 42, 67, 0.08);
  border: 1px solid var(--clinical-border);
  transition: box-shadow .3s ease;
}

.prescription-card:hover {
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 16px 28px -12px rgba(15, 42, 67, 0.14);
}

/* ---------- Patient group header (reference: "PATIENT: Name") ---------- */

.patient-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 14px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--clinical-border);
}

.patient-label {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: .05em;
  color: var(--clinical-text-muted);
  text-transform: uppercase;
}

.patient-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--clinical-navy);
}

.doctor-chip {
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--clinical-teal);
  background: var(--clinical-teal-light);
  padding: 4px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.header-icon {
  font-size: 13px;
}

/* ---------- Medicine block: row + divided info-grid (reference style) ---------- */

.med-block {
  border: 1px solid var(--clinical-border);
  border-radius: 14px;
  margin-top: 14px;
  overflow: hidden;
  background: var(--clinical-surface);
}

.med-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}

.med-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: var(--clinical-teal-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.med-info {
  min-width: 0;
  flex: 1;
}

.med-name {
  font-weight: 700;
  color: var(--clinical-navy);
  font-size: 14.5px;
  margin: 0 0 2px;
  overflow-wrap: break-word;
}

.med-sub {
  font-size: 12.5px;
  color: var(--clinical-text-muted);
  margin: 0;
}

.status {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 11.5px;
  padding: 6px 14px;
  border-radius: 999px;
  white-space: nowrap;
}

.status--track {
  background: var(--clinical-green-light);
  color: var(--clinical-green);
}

.status--pending {
  background: var(--clinical-amber-light);
  color: var(--clinical-amber);
}

/* Divided info-grid: label above value, columns separated by vertical lines */

.info-grid {
  display: flex;
  border-top: 1px solid var(--clinical-border);
  background: var(--clinical-bg);
}

.info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 8px;
  text-align: center;
  border-right: 1px solid var(--clinical-border);
}

.info-col:last-child {
  border-right: none;
}

.info-label {
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--clinical-text-muted);
  font-weight: 600;
}

.info-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--clinical-navy);
  overflow-wrap: anywhere;
}

/* ---------- Instructions / notes ---------- */

.info {
  margin-top: 16px;
  background: var(--clinical-bg);
  padding: 16px 18px;
  border-radius: 12px;
}

.info h4 {
  color: var(--clinical-navy);
  margin: 12px 0 4px;
  font-size: 13.5px;
}

.info h4:first-child {
  margin-top: 0;
}

.info p {
  margin: 0;
  color: var(--clinical-text);
  font-size: 13.5px;
  line-height: 1.5;
  overflow-wrap: break-word;
}

/* ---------- Download button ---------- */

.download-btn {
  margin-top: 18px;
  padding: 13px 22px;
  width: 100%;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--clinical-teal), #0b7a70);
  color: white;
  font-weight: 700;
  font-size: 14.5px;
  cursor: pointer;
  box-shadow: 0 8px 18px -6px rgba(13, 148, 136, .4);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
}

.download-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
  box-shadow: 0 12px 22px -6px rgba(13, 148, 136, .45);
}

.download-btn:active {
  transform: translateY(0);
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .page {
    padding: 20px 22px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .prescription-card {
    padding: 22px;
  }

  .download-btn {
    width: auto;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .page {
    padding: 18px;
  }

  .title {
    font-size: 22px;
  }

}

/* ==========================
   Mobile — main polish target
========================== */
@media (max-width: 768px) {

  .page {
    padding: 12px;
  }

  .page-header {
    flex-direction: row;
    align-items: center;
    margin-bottom: 14px;
  }

  .title {
    font-size: 19px;
  }

  .eyebrow {
    font-size: 10.5px;
  }

  .prescription-card {
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 14px;
  }

  .patient-header {
    padding-bottom: 12px;
  }

  .patient-name {
    font-size: 14px;
  }

  .doctor-chip {
    font-size: 11.5px;
    padding: 3px 9px;
  }

  .med-block {
    margin-top: 12px;
    border-radius: 12px;
  }

  .med-row {
    padding: 11px 12px;
    gap: 10px;
  }

  .med-icon {
    width: 34px;
    height: 34px;
    min-width: 34px;
    font-size: 15px;
  }

  .med-name {
    font-size: 13px;
  }

  .med-sub {
    font-size: 11.5px;
  }

  .status {
    font-size: 10.5px;
    padding: 5px 10px;
  }

  .info-col {
    padding: 8px 4px;
  }

  .info-label {
    font-size: 9.5px;
  }

  .info-value {
    font-size: 11.5px;
  }

  .info {
    padding: 12px 14px;
    margin-top: 14px;
  }

  .download-btn {
    width: 100%;
    padding: 12px 18px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page {
    padding: 8px;
  }

  .title {
    font-size: 17px;
  }

  .prescription-card {
    padding: 12px;
    border-radius: 14px;
  }

  .patient-name {
    font-size: 13px;
  }

  .doctor-chip {
    font-size: 10.5px;
  }

  .med-row {
    gap: 8px;
    padding: 9px 10px;
  }

  .med-icon {
    width: 28px;
    height: 28px;
    min-width: 28px;
    font-size: 13px;
  }

  .med-name {
    font-size: 12.5px;
  }

  .med-sub {
    font-size: 11px;
  }

  .status {
    font-size: 10px;
    padding: 4px 9px;
  }

  .info-grid {
    flex-wrap: wrap;
  }

  .info-col {
    flex: 1 1 50%;
    border-right: none;
    border-bottom: 1px solid var(--clinical-border);
  }

  .info-col:nth-child(2n) {
    border-right: 1px solid var(--clinical-border);
  }

  .info-col:last-child,
  .info-col:nth-last-child(2):nth-child(odd) {
    border-bottom: none;
  }

  .info h4 {
    font-size: 12px;
  }

  .info p {
    font-size: 12.5px;
  }

  .download-btn {
    padding: 11px 16px;
    font-size: 13px;
  }

}

</style>