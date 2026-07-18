<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";


// ======================
// States
// ======================

const patients = ref([]);

const name = ref("");
const email = ref("");
const password = ref("");
const age = ref("");
const gender = ref("");
const contactInformation = ref("");
const medicalHistory = ref("");
const DescribeYourProblem = ref("");
const insuranceDetails = ref("");



// ======================
// Get Patients
// ======================

const getPatients = async()=>{

try{

const res = await api.get("/admin/patients");

patients.value = res.data;


}catch(error){

console.log(error.response?.data || error.message);

}

};




// ======================
// Create Patient
// ======================

const createPatient = async()=>{


try{


const data = {

name:name.value,

email:email.value,

password:password.value,

age:Number(age.value),

gender:gender.value,

contactInformation:contactInformation.value,

medicalHistory:medicalHistory.value,

DescribeYourProblem:DescribeYourProblem.value,

insuranceDetails:insuranceDetails.value

};



await api.post(
"/admin/patient",
data
);



alert("Patient Created Successfully");



clearForm();

getPatients();



}
catch(error){

console.log(
error.response?.data || error.message
);

}

};




// ======================
// Clear Form
// ======================

const clearForm=()=>{

name.value="";
email.value="";
password.value="";
age.value="";
gender.value="";
contactInformation.value="";
medicalHistory.value="";
DescribeYourProblem.value="";
insuranceDetails.value="";

};





onMounted(()=>{

getPatients();

});


</script>



<template>


<div class="page">


<div class="header">

<div>

<h2>
🧑‍🤝‍🧑 Patients Management
</h2>

<p>
Create and manage hospital patients
</p>

</div>


<div class="badge">
Hospital Admin
</div>


</div>





<!-- Create Patient -->

<div class="card">


<h3>
Add New Patient
</h3>



<div class="form-grid">


<input
v-model="name"
placeholder="Patient Name"
/>


<input
v-model="email"
placeholder="Email"
/>


<input
v-model="password"
type="password"
placeholder="Password"
/>


<input
v-model="age"
placeholder="Age"
/>



<select v-model="gender">

<option value="">
Select Gender
</option>

<option>
Male
</option>

<option>
Female
</option>


</select>




<input
v-model="contactInformation"
placeholder="Contact Number"
/>



<input
v-model="medicalHistory"
placeholder="Medical History"
/>


<input
v-model="DescribeYourProblem"
placeholder="Problem"
/>



<input
v-model="insuranceDetails"
placeholder="Insurance Details"
/>



</div>



<button
class="save-btn"
@click="createPatient"
>

Create Patient

</button>



</div>







<!-- Patient List -->

<div class="card">


<h3>
Patient List
</h3>



<table>


<tr>

<th>Name</th>

<th>Email</th>

<th>Age</th>

<th>Gender</th>

<th>Contact</th>

<th>Medical History</th>

</tr>




<tr
v-for="patient in patients"
:key="patient._id"
>


<td>
{{patient.user?.name}}
</td>


<td>
{{patient.user?.email}}
</td>


<td>
{{patient.age}}
</td>


<td>
{{patient.gender}}
</td>


<td>
{{patient.contactInformation}}
</td>


<td>
{{patient.medicalHistory}}
</td>


</tr>



</table>



</div>


</div>


</template>





<style scoped>


.page{
min-height:100%;
}



.header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:30px;

}



.header h2{

font-size:30px;

color:var(--text);

}



.header p{

color:var(--muted);

}



.badge{

background:linear-gradient(
135deg,
var(--primary),
var(--secondary)
);

color:white;

padding:12px 20px;

border-radius:30px;

font-weight:600;

}




.card{

background:var(--white);

padding:30px;

border-radius:20px;

box-shadow:var(--shadow);

border:1px solid var(--border);

margin-bottom:30px;

}



.card h3{

margin-bottom:25px;

color:var(--text);

}



.form-grid{

display:grid;

grid-template-columns:repeat(2,1fr);

gap:20px;

}



input,
select{


padding:14px;

border-radius:12px;

border:1px solid var(--border);

font-size:15px;

}



.save-btn{


margin-top:25px;

padding:12px 30px;

border:none;

border-radius:10px;

cursor:pointer;

background:linear-gradient(
135deg,
var(--primary),
var(--secondary)
);

color:white;

font-weight:600;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:var(--primary);

color:white;

padding:15px;

text-align:left;

}



td{

padding:15px;

border-bottom:1px solid var(--border);

}



@media(max-width:800px){

.form-grid{

grid-template-columns:1fr;

}


.header{

flex-direction:column;

align-items:flex-start;

gap:15px;

}


}



</style>