<script setup>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
ref,
onMounted
} from "vue";

import api from "../../api/axios";


const prescriptions = ref([]);

const loading = ref(true);



const getMyPrescriptions = async()=>{


try{


const res = await api.get(
"/prescription/my"
);

console.log(
"Prescription API:",
JSON.stringify(res.data,null,2)
);

console.log(
"My Prescriptions:",
res.data
);



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


    <div class="header">

      <div class="header-info">

        <h3><span class="header-icon">👤</span> {{ item.patient?.user?.name || "Patient" }}</h3>


        <h3 class="doctor-line"><span class="header-icon">👨‍⚕️</span> Dr. {{ item.doctor?.user?.name || item.doctor?.name || "Doctor" }}</h3>


        <div class="header-tags">

          <!-- <span class="tag" v-if="item.doctor?.specialties">
            specialties {{ item.doctor.specialties.join(", ") }}
          </span> -->


          <span class="tag tag--muted" v-if="item.doctor?.department">
            Department : {{ item.doctor.department }}
          </span>

        </div>


      </div>




      <div class="date-box">


        <p>

        📅

        {{

        new Date(item.createdAt)
        .toLocaleDateString()

        }}

        </p>


        <p>

        ⏰

        {{

        new Date(item.createdAt)
        .toLocaleTimeString(
        "en-US",
        {
        hour:"2-digit",
        minute:"2-digit"
        }
        )

        }}

        </p>


      </div>



    </div>





    <div class="section-divider"></div>





    <h4 class="section-label">💊 Medicines</h4>




    <table>


      <thead>


      <tr>

      <th>
      Medicine
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

      v-for="med in item.medicines"

      :key="med._id"

      >


      <td class="med-name">

      {{ med.name }}

      </td>



      <td>

      {{ med.dosage || "-" }}

      </td>



      <td>

      {{ med.frequency || "-" }}

      </td>



      </tr>



      </tbody>



    </table>


    <div class="appointment-info">

      <h4>
      📋 Appointment Information
      </h4>


      <p>
      Status:
      <span class="status">
      Completed
      </span>
      </p>


      <p v-if="item.doctor?.experience">

      Dr's Experience: {{item.doctor.experience}} Years

      </p>


    </div>


    <div class="info">


      <h4>

      📝 Instructions

      </h4>


      <p>

      {{ item.instructions || "No instructions" }}

      </p>





      <h4>

      📌 Notes

      </h4>


      <p>

      {{ item.notes || "No notes" }}

      </p>



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

/* ---------- Prescription card (Premium) ---------- */

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

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.header-info h3 {
  font-size: 17px;
  color: var(--clinical-navy);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-wrap: break-word;
}

.doctor-line {
  color: var(--clinical-teal) !important;
}

.header-icon {
  font-size: 15px;
}

.header-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  font-size: 12px;
  font-weight: 600;
  color: var(--clinical-teal);
  background: var(--clinical-teal-light);
  padding: 4px 10px;
  border-radius: 999px;
}

.tag--muted {
  color: var(--clinical-text-muted);
  background: var(--clinical-bg);
  border: 1px solid var(--clinical-border);
}

.date-box {
  text-align: right;
  color: var(--clinical-text-muted);
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  flex-shrink: 0;
}

.date-box p {
  margin: 2px 0;
}

.section-divider {
  height: 1px;
  background: var(--clinical-border);
  margin: 20px 0;
}

.section-label {
  color: var(--clinical-navy);
  font-size: 15px;
  margin: 0 0 4px;
  font-weight: 700;
}

/* ---------- Medicine table ---------- */

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 10px;
}

th {
  background: var(--clinical-bg);
  color: var(--clinical-text-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
  font-weight: 700;
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid var(--clinical-border);
  white-space: nowrap;
}

td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--clinical-border);
  font-size: 14px;
}

.med-name {
  font-weight: 600;
  color: var(--clinical-navy);
}

tbody tr {
  transition: background .2s ease;
}

tbody tr:hover {
  background: var(--clinical-bg);
}

tbody tr:last-child td {
  border-bottom: none;
}

/* ---------- Appointment info & notes ---------- */

.appointment-info {
  margin-top: 20px;
  background: var(--clinical-teal-light);
  padding: 18px 20px;
  border-radius: 12px;
}

.appointment-info h4 {
  color: var(--clinical-navy);
  margin: 0 0 10px;
  font-size: 14px;
}

.appointment-info p {
  margin: 6px 0;
  font-size: 14px;
  color: var(--clinical-text);
}

.status {
  background: var(--clinical-green-light);
  color: var(--clinical-green);
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
}

.info {
  margin-top: 22px;
  background: var(--clinical-bg);
  padding: 18px 20px;
  border-radius: 12px;
}

.info h4 {
  color: var(--clinical-navy);
  margin: 14px 0 4px;
  font-size: 14px;
}

.info h4:first-child {
  margin-top: 0;
}

.info p {
  margin: 0;
  color: var(--clinical-text);
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: break-word;
}

/* ---------- Download button (Premium) ---------- */

.download-btn {
  margin-top: 20px;
  padding: 11px 22px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--clinical-teal), #0b7a70);
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 8px 18px -6px rgba(13, 148, 136, .4);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
}

.download-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-3px);
  box-shadow: 0 12px 22px -6px rgba(13, 148, 136, .45);
}

.download-btn:active {
  transform: translateY(-1px);
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
   Mobile
========================== */
@media (max-width: 768px) {

  .page {
    padding: 14px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 16px;
  }

  .title {
    font-size: 20px;
  }

  .prescription-card {
    padding: 18px;
    border-radius: 16px;
    margin-bottom: 16px;
  }

  .header {
    flex-direction: column;
    gap: 12px;
  }

  .date-box {
    text-align: left;
  }

  .header-info h3 {
    font-size: 15.5px;
  }

  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  th,
  td {
    padding: 10px 12px;
    font-size: 13px;
  }

  .info,
  .appointment-info {
    padding: 14px 16px;
  }

  .download-btn {
    width: 100%;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page {
    padding: 10px;
  }

  .title {
    font-size: 18px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .prescription-card {
    padding: 14px;
  }

  .header-info h3 {
    font-size: 14.5px;
  }

  .tag {
    font-size: 11px;
    padding: 4px 8px;
  }

  .section-label {
    font-size: 14px;
  }

  .info h4,
  .appointment-info h4 {
    font-size: 13px;
  }

  .info p,
  .appointment-info p {
    font-size: 13px;
  }

  .download-btn {
    padding: 10px 16px;
    font-size: 13px;
  }

}

</style>