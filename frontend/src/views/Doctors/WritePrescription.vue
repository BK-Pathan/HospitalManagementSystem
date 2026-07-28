<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();
const router = useRouter();
const previousPrescriptions = ref([]);

const patient = ref(null);


const medicines = ref([
{
name:"",
dosage:"",
frequency:""
}
]);


const instructions = ref("");

const notes = ref("");



// ==============================
// GET PATIENT HISTORY
// ==============================

const getPatient = async()=>{


try{


console.log(
"Fetching Patient History ID:",
route.params.patientId
);



const res = await api.get(
`/doctor/patient-history/${route.params.patientId}`
);

previousPrescriptions.value =
res.data.previousPrescriptions || [];

console.log(
"Patient History Response:",
res.data
);





// myAppointments me se patient uthao

if(
res.data.myAppointments &&
res.data.myAppointments.length
){


const appointment = res.data.myAppointments[0];


console.log(
"First Appointment:",
appointment
);



patient.value = appointment;



console.log(
"Patient Saved:",
patient.value
);


}

else if(
res.data.otherAppointments &&
res.data.otherAppointments.length
){


const appointment = res.data.otherAppointments[0];


patient.value = appointment;


console.log(
"Patient Saved From Other:",
patient.value
);


}

else{


console.log(
"No appointment found"
);


}



}
catch(error){


console.log(
"Patient History Error:",
error.response?.data || error.message
);


}


};




// ==============================
// ADD MEDICINE
// ==============================


const addMedicine=()=>{


medicines.value.push({

name:"",
dosage:"",
frequency:""

});


console.log(
"Medicines After Add:",
medicines.value
);


};





// ==============================
// REMOVE MEDICINE
// ==============================


const removeMedicine=(index)=>{


medicines.value.splice(index,1);


console.log(
"Medicines After Remove:",
medicines.value
);


};





// ==============================
// SAVE PRESCRIPTION
// ==============================


const savePrescription = async()=>{


console.log(
"Save Button Clicked"
);



console.log(
"Current Patient:",
patient.value
);



if(!patient.value){


alert(
"Patient loading..."
);


return;


}




const data={


patient:
patient.value._id,


appointment:
route.params.appointmentId,


medicines:
medicines.value,


instructions:
instructions.value,


notes:
notes.value


};



console.log(
"Sending Prescription Data:",
data
);




try{


const res = await api.post(
"/prescription",
data
);



console.log(
"Prescription Save Response:",
res.data
);



alert(
"Prescription saved successfully"
);



router.push("/doctor");



}
catch(error){


console.log(
"Prescription Save Error:",
error.response?.data || error.message
);


}


};





onMounted(()=>{


console.log(
"Component Mounted"
);


getPatient();


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


<div class="page">


<div class="page-header">
  <p class="eyebrow">Consultation</p>
  <h2 class="page-title">Write Prescription</h2>
</div>



<div v-if="patient" class="patient-card">

  <span class="avatar">{{ initials(patient.patient?.user?.name) }}</span>

  <div class="patient-card__info">
    <h3>{{ patient.patient?.user?.name || "N/A" }}</h3>
    <p><span class="label">Problem:</span> {{ patient.patient?.DescribeYourProblem || "N/A" }}</p>
  </div>

</div>

<div v-else class="patient-card patient-card--loading">
  <span class="spinner"></span>
  <p>Loading patient details...</p>
</div>


<div
v-if="previousPrescriptions.length"
class="card"
>

<div class="card__head">
  <h3>Previous Prescriptions</h3>
  <span class="section-count">{{ previousPrescriptions.length }} record(s)</span>
</div>


<div class="prescription-timeline">

<div
v-for="pres in previousPrescriptions"
:key="pres._id"
class="prescription-entry"
>

<div class="prescription-entry__date">

{{ new Date(pres.createdAt).toLocaleDateString() }}

</div>


<div class="prescription-entry__body">

<h4>Medicines</h4>


<ul class="medicine-list">

<li
v-for="med in pres.medicines"
:key="med._id"
>

<span class="medicine-name">{{med.name}}</span>
<span class="medicine-meta">{{med.dosage}} · {{med.frequency}}</span>

</li>

</ul>


<p v-if="pres.instructions"><span class="label">Instructions:</span> {{pres.instructions}}</p>


<p v-if="pres.notes"><span class="label">Notes:</span> {{pres.notes}}</p>

</div>

</div>


</div>


</div>


<div class="card">


<div class="card__head">
  <h3>Medicines</h3>
</div>


<div class="medicine-table-head">
  <span>Medicine Name</span>
  <span>Dosage</span>
  <span>Frequency</span>
  <span></span>
</div>


<div
v-for="(medicine,index) in medicines"
:key="index"
class="medicine-row"
>



<input
v-model="medicine.name"
placeholder="e.g. Amoxicillin"
/>


<input
v-model="medicine.dosage"
placeholder="e.g. 500mg"
/>



<input
v-model="medicine.frequency"
placeholder="e.g. Twice a day"
/>



<button
class="remove-btn"
title="Remove medicine"
@click="removeMedicine(index)"
>
<svg viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>



</div>



<button
class="add"
@click="addMedicine"
>
<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
Add Medicine
</button>



</div>






<div class="card">


<h3>
Instructions
</h3>


<textarea
v-model="instructions"
placeholder="Enter instructions for the patient"
></textarea>



<h3>
Medical Notes
</h3>


<textarea
v-model="notes"
placeholder="Enter internal medical notes"
></textarea>




<button
class="save"
@click="savePrescription"
>
<svg viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
Save Prescription
</button>



</div>



</div>


</template>



<style scoped>


.page{

padding:30px;

}


.page-header{

margin-bottom:25px;

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

margin:0;

font-size:28px;

}




.card,
.patient-card{

background:var(--white);

padding:25px;

border-radius:20px;

box-shadow:var(--shadow);

margin-bottom:25px;

border:1px solid var(--border);

}


/* ---------- Patient card ---------- */

.patient-card{

display:flex;

align-items:center;

gap:18px;

}


.patient-card--loading{

display:flex;

flex-direction:row;

align-items:center;

gap:14px;

color:var(--muted);

}


.spinner{

width:24px;

height:24px;

border-radius:50%;

border:3px solid var(--border);

border-top-color:var(--primary);

animation:spin .8s linear infinite;

flex-shrink:0;

}


@keyframes spin{

to{ transform:rotate(360deg); }

}


.avatar{

flex-shrink:0;

width:56px;

height:56px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

background:linear-gradient(135deg,var(--primary),var(--primary-dark));

color:#fff;

font-size:18px;

font-weight:700;

}


.patient-card__info h3{

margin:0 0 6px;

color:var(--text);

font-size:18px;

}


.patient-card__info p{

margin:0;

color:var(--muted);

font-size:14px;

}


.label{

font-weight:600;

color:var(--text);

}


/* ---------- Card head ---------- */

.card__head{

display:flex;

align-items:baseline;

justify-content:space-between;

margin-bottom:16px;

}


.card__head h3{

margin:0;

color:var(--text);

}


.section-count{

font-size:13px;

color:var(--muted);

font-weight:500;

}


h3{

color:var(--text);

margin:0 0 16px;

}


/* ---------- Previous prescriptions ---------- */

.prescription-timeline{

display:flex;

flex-direction:column;

gap:18px;

}


.prescription-entry{

display:flex;

gap:18px;

padding:18px;

border-radius:14px;

background:#f8fafc;

border:1px solid var(--border);

}


.prescription-entry__date{

flex-shrink:0;

width:110px;

font-size:13px;

font-weight:700;

color:var(--primary);

}


.prescription-entry__body h4{

margin:0 0 8px;

color:var(--text);

font-size:14px;

}


.medicine-list{

list-style:none;

margin:0 0 10px;

padding:0;

display:flex;

flex-direction:column;

gap:6px;

}


.medicine-list li{

display:flex;

align-items:center;

gap:10px;

font-size:14px;

color:var(--text);

}


.medicine-name{

font-weight:600;

}


.medicine-meta{

color:var(--muted);

}


.prescription-entry__body p{

margin:4px 0 0;

font-size:13px;

color:var(--muted);

}


/* ---------- Medicine form ---------- */

.medicine-table-head{

display:grid;

grid-template-columns:1fr 1fr 1fr 44px;

gap:10px;

padding:0 2px;

margin-bottom:8px;

font-size:12px;

font-weight:700;

text-transform:uppercase;

letter-spacing:.03em;

color:var(--muted);

}


.medicine-row{

display:grid;

grid-template-columns:1fr 1fr 1fr 44px;

gap:10px;

align-items:center;

margin-bottom:12px;

}



input,
textarea{

padding:12px 14px;

border-radius:10px;

border:1px solid var(--border);

width:100%;

box-sizing:border-box;

font-family:inherit;

font-size:14px;

color:var(--text);

}


input:focus,
textarea:focus{

outline:none;

border-color:var(--primary);

}



textarea{

height:110px;

margin-bottom:20px;

resize:vertical;

}




button{

border:none;

padding:10px 16px;

border-radius:10px;

cursor:pointer;

font-weight:600;

font-size:14px;

display:inline-flex;

align-items:center;

justify-content:center;

gap:8px;

transition:transform .15s ease, opacity .15s ease;

}


button svg{

width:16px;

height:16px;

}


.remove-btn{

width:44px;

height:44px;

padding:0;

background:rgba(220,38,38,.1);

color:#dc2626;

}


.remove-btn:hover{

background:rgba(220,38,38,.18);

}



.add{

background:var(--secondary, var(--primary));

color:white;

}



.save{

background:linear-gradient(135deg,var(--primary),var(--primary-dark));

color:white;

width:100%;

font-size:15px;

margin-top:6px;

padding:14px 16px;

}


button:hover{

transform:translateY(-2px);

}


@media (max-width:700px){

.medicine-table-head{

display:none;

}


.medicine-row{

grid-template-columns:1fr;

background:#f8fafc;

padding:14px;

border-radius:12px;

border:1px solid var(--border);

}


.remove-btn{

justify-self:flex-end;

width:auto;

padding:8px 12px;

}

}


</style>