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


</script>


<template>


<div class="page">


<h2>
Write Prescription
</h2>



<div v-if="patient" class="patient-card">


<h3>
Patient Information
</h3>


<p>
Name:
{{patient.patient?.user?.name}}
</p>


<p>
Problem:
{{patient.patient?.DescribeYourProblem}}
</p>


</div>


<div
v-if="previousPrescriptions.length"
class="card"
>

<h3>
Previous Prescription
</h3>


<div
v-for="pres in previousPrescriptions"
:key="pres._id"
>

<p>
Date:
{{ new Date(pres.createdAt).toLocaleDateString() }}
</p>


<h4>
Medicines
</h4>


<ul>

<li
v-for="med in pres.medicines"
:key="med._id"
>

{{med.name}}
-
{{med.dosage}}
-
{{med.frequency}}

</li>

</ul>


<p>
Instructions:
{{pres.instructions}}
</p>


<p>
Notes:
{{pres.notes}}
</p>


<hr>

</div>


</div>


<div class="card">


<h3>
Medicines
</h3>



<div
v-for="(medicine,index) in medicines"
:key="index"
class="medicine-row"
>



<input
v-model="medicine.name"
placeholder="Medicine Name"
/>


<input
v-model="medicine.dosage"
placeholder="Dosage"
/>



<input
v-model="medicine.frequency"
placeholder="Frequency"
/>



<button
@click="removeMedicine(index)"
>
❌
</button>



</div>



<button
class="add"
@click="addMedicine"
>
+ Add Medicine
</button>



</div>






<div class="card">


<h3>
Instructions
</h3>


<textarea
v-model="instructions"
placeholder="Enter instructions"
></textarea>



<h3>
Medical Notes
</h3>


<textarea
v-model="notes"
placeholder="Enter notes"
></textarea>




<button
class="save"
@click="savePrescription"
>
Save Prescription
</button>



</div>



</div>


</template>



<style scoped>


.page{

padding:30px;

}



h2{

color:var(--text);

margin-bottom:25px;

}




.card,
.patient-card{

background:white;

padding:25px;

border-radius:20px;

box-shadow:var(--shadow);

margin-bottom:25px;

border:1px solid var(--border);

}



.medicine-row{

display:flex;

gap:10px;

margin-bottom:15px;

}



input,
textarea{

padding:12px;

border-radius:10px;

border:1px solid var(--border);

width:100%;

}



textarea{

height:120px;

margin-bottom:20px;

}




button{

border:none;

padding:10px 15px;

border-radius:10px;

cursor:pointer;

}



.add{

background:var(--secondary);

color:white;

}



.save{

background:var(--primary);

color:white;

width:100%;

font-size:16px;

margin-top:20px;

}


</style>