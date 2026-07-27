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


    <!-- Header -->

    <div class="header">

        <div>

            <span class="eyebrow">
                Hospital Admin
            </span>

            <h2>
                🧑‍🤝‍🧑 Patients Management
            </h2>

            <p>
                Create and manage hospital patient records
            </p>

        </div>


        <div class="badge">
            Hospital Admin
        </div>


    </div>






    <!-- Create Patient -->


    <div class="card form-card">


        <div class="card-head">

            <div>

                <h3>
                    Add New Patient
                </h3>

                <p>
                    Register a new patient account
                </p>

            </div>


            <span>
                Patient Form
            </span>


        </div>





        <div class="form-grid">


            <div class="field">

                <label>
                    Full Name
                </label>

                <input
                v-model="name"
                placeholder="Patient name"
                />

            </div>




            <div class="field">

                <label>
                    Email
                </label>

                <input
                v-model="email"
                placeholder="Email address"
                />

            </div>




            <div class="field">

                <label>
                    Password
                </label>

                <input
                v-model="password"
                type="password"
                placeholder="Password"
                />

            </div>




            <div class="field">

                <label>
                    Age
                </label>

                <input
                v-model="age"
                placeholder="Age"
                />

            </div>




            <div class="field">

                <label>
                    Gender
                </label>

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

            </div>




            <div class="field">

                <label>
                    Contact
                </label>

                <input
                v-model="contactInformation"
                placeholder="Phone number"
                />

            </div>





            <div class="field">

                <label>
                    Medical History
                </label>

                <input
                v-model="medicalHistory"
                placeholder="Previous medical history"
                />

            </div>




            <div class="field">

                <label>
                    Problem Description
                </label>

                <input
                v-model="DescribeYourProblem"
                placeholder="Patient problem"
                />

            </div>





            <div class="field full">

                <label>
                    Insurance Details
                </label>

                <input
                v-model="insuranceDetails"
                placeholder="Insurance information"
                />

            </div>



        </div>





        <button
        class="save-btn"
        @click="createPatient"
        >

            + Create Patient

        </button>



    </div>








    <!-- Patient List -->


    <div class="card">


        <div class="card-head">

            <h3>
                Patient List
            </h3>


            <span>
                {{patients.length}} Records
            </span>


        </div>




        <div class="table-wrapper">


        <table>


            <thead>

                <tr>

                    <th>
                        Patient
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
                        Contact
                    </th>

                    <th>
                        Medical History
                    </th>

                </tr>

            </thead>




            <tbody>


            <tr
            v-for="patient in patients"
            :key="patient._id"
            >


                <td>

                    <div class="patient">

                        <div class="avatar">

                            {{patient.user?.name?.charAt(0)}}

                        </div>


                        <strong>
                            {{patient.user?.name}}
                        </strong>

                    </div>


                </td>



                <td>
                    {{patient.user?.email}}
                </td>



                <td>
                    {{patient.age}}
                </td>



                <td>

                    <span class="gender">
                        {{patient.gender}}
                    </span>

                </td>




                <td>
                    {{patient.contactInformation}}
                </td>



                <td>
                    {{patient.medicalHistory || "N/A"}}
                </td>



            </tr>



            </tbody>


        </table>


        </div>



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



.eyebrow{

font-size:12px;

font-weight:800;

letter-spacing:1px;

color:var(--secondary);

text-transform:uppercase;

}



.header h2{

font-size:30px;

margin:8px 0;

color:var(--text);

}



.header p{

color:var(--muted);

}





.badge{

background:var(--gradient-primary);

color:white;

padding:14px 22px;

border-radius:var(--radius-pill);

font-weight:700;

box-shadow:var(--shadow-lg);

}






.card{

background:var(--surface);

backdrop-filter:blur(15px);

border:1px solid var(--border);

border-radius:var(--radius-xl);

padding:30px;

box-shadow:var(--shadow);

margin-bottom:30px;

}





.card-head{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:25px;

}



.card-head h3{

margin:0;

font-size:20px;

color:var(--text);

}



.card-head p{

color:var(--muted);

font-size:13px;

}



.card-head span{

background:var(--surface-solid);

padding:8px 15px;

border-radius:var(--radius-pill);

font-size:12px;

font-weight:700;

color:var(--primary);

}





.form-grid{

display:grid;

grid-template-columns:repeat(2,1fr);

gap:20px;

}





.field{

display:flex;

flex-direction:column;

gap:8px;

}



.field label{

font-size:13px;

font-weight:700;

color:var(--muted);

}




input,
select{

padding:14px 16px;

border-radius:var(--radius-md);

border:1px solid var(--border);

outline:none;

font-size:14px;

}



input:focus,
select:focus{

border-color:var(--secondary);

box-shadow:

0 0 0 4px rgba(20,184,166,.15);

}



.full{

grid-column:span 2;

}





.save-btn{

margin-top:25px;

padding:14px 30px;

border:none;

border-radius:var(--radius-pill);

background:var(--gradient-primary);

color:white;

font-weight:700;

cursor:pointer;

box-shadow:var(--shadow-lg);

}





.table-wrapper{

overflow-x:auto;

}




table{

width:100%;

border-collapse:separate;

border-spacing:0 12px;

}



thead th{

background:var(--gradient-primary);

color:white;

padding:15px;

font-size:12px;

text-transform:uppercase;

letter-spacing:.5px;

}



thead th:first-child{

border-radius:12px 0 0 12px;

}



thead th:last-child{

border-radius:0 12px 12px 0;

}




tbody tr{

background:white;

box-shadow:var(--shadow);

transition:.3s;

}



tbody tr:hover{

transform:translateY(-3px);

box-shadow:var(--shadow-lg);

}




td{

padding:16px;

border-top:1px solid var(--border);

border-bottom:1px solid var(--border);

color:var(--text-soft);

}



td:first-child{

border-left:1px solid var(--border);

border-radius:12px 0 0 12px;

}



td:last-child{

border-right:1px solid var(--border);

border-radius:0 12px 12px 0;

}




.patient{

display:flex;

align-items:center;

gap:12px;

}



.avatar{

width:42px;

height:42px;

border-radius:14px;

background:var(--gradient-primary);

color:white;

display:flex;

align-items:center;

justify-content:center;

font-weight:800;

}




.gender{

background:var(--info-bg);

color:var(--info);

padding:6px 14px;

border-radius:var(--radius-pill);

font-size:12px;

font-weight:700;

}





@media(max-width:800px){


.header{

flex-direction:column;

align-items:flex-start;

gap:15px;

}



.form-grid{

grid-template-columns:1fr;

}



.full{

grid-column:auto;

}



table{

min-width:900px;

}



}



</style>