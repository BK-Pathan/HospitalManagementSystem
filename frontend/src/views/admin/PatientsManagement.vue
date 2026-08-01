<script setup>

import { ref, onMounted, reactive } from "vue";
import api from "../../api/axios";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ======================
// States
// ======================
// Edit

const editMode = ref(false);
const patientId = ref(null);

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
const search = ref("");
// Pagination

const page = ref(1);
const totalPages = ref(1);

// UI-only: mobile row expand/collapse state (no backend impact)
const openRows = reactive({});

const toggleRow = (id) => {
    openRows[id] = !openRows[id];
};



// ======================
// Get Patients
// ======================

const getPatients = async()=>{

try{


const res = await api.get(
"/admin/patients",
{
params:{
page:page.value,
search:search.value
}
}
);



patients.value = res.data.patients;

totalPages.value = res.data.totalPages;



}catch(error){

console.log(
error.response?.data || error.message
);

}

};




// ======================
// Create Patient
// ======================

const createPatient = async()=>{


try{


const data={


name:name.value,

age:Number(age.value),

gender:gender.value,

contactInformation:contactInformation.value,

medicalHistory:medicalHistory.value,

DescribeYourProblem:DescribeYourProblem.value,

insuranceDetails:insuranceDetails.value


};



// New Patient
if(!editMode.value){


data.email=email.value;

data.password=password.value;


}



// Update Patient

else{


if(password.value.trim()){

data.password=password.value;

}


}



if(editMode.value){


await api.put(

`/admin/patient/${patientId.value}`,

data

);


window.notify("Patient Updated Successfully");


}

else{


await api.post(

"/admin/patient",

data

);


window.notify("Patient Created Successfully");


}



clearForm();

getPatients();



}

catch(error){

console.log(
error.response?.data || error.message
);

}


};

const editPatient=(patient)=>{


editMode.value=true;


patientId.value=patient._id;



name.value =
patient.user?.name || "";



email.value =
patient.user?.email || "";



age.value =
patient.age || "";



gender.value =
patient.gender || "";



contactInformation.value =
patient.contactInformation || "";



medicalHistory.value =
patient.medicalHistory || "";



DescribeYourProblem.value =
patient.DescribeYourProblem || "";



insuranceDetails.value =
patient.insuranceDetails || "";



// old password show nahi karna
password.value="";



scrollToForm();


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



editMode.value=false;

patientId.value=null;


};

// ======================
// Export Patients PDF
// ======================

const exportPDF = async()=>{


try{


const res = await api.get(
"/admin/patients/export"
);



const allPatients = res.data;



const doc = new jsPDF();



doc.text(
"Patients Report",
14,
15
);



const tableData = allPatients.map(patient=>[


patient.user?.name || "N/A",

patient.user?.email || "N/A",

patient.age || "N/A",

patient.gender || "N/A",

patient.contactInformation || "N/A",

patient.medicalHistory || "N/A"


]);




autoTable(doc,{

head:[

[
"Name",
"Email",
"Age",
"Gender",
"Contact",
"Medical History"
]

],


body:tableData,


startY:25


});



doc.save(
"all-patients-report.pdf"
);



}
catch(error){

console.log(error);

}


};

// ======================
// Search
// ======================

const searchPatients = ()=>{

page.value = 1;

getPatients();

};


// ======================
// Pagination
// ======================

const nextPage=()=>{

if(page.value < totalPages.value){

page.value++;

getPatients();

}

};



const previousPage=()=>{

if(page.value > 1){

page.value--;

getPatients();

}

};


const scrollToForm = ()=>{

    document
    .querySelector(".patient-form")
    ?.scrollIntoView({
        behavior:"smooth"
    });

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


        <!-- <div class="badge">
            Hospital Admin
        </div> -->


<div class="header-actions">


    <div class="badge">
        Hospital Admin
    </div>

    <button 
    class="scroll-form-btn"
    @click="scrollToForm"
    >
        Add Patient ↓
    </button>

        <button
    class="pdf-btn"
    @click="exportPDF"
    >
        📄 PDF
    </button>


</div>

    </div>

        <div class="search-bar">

        <span class="search-icon">🔍</span>

       <input
v-model="search"
placeholder="Search patient by name..."
@input="searchPatients"
/>

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

                    <th>
 Actions
</th>

                </tr>

            </thead>




            <tbody>


            <tr
            v-for="patient in patients"
            :key="patient._id"
            :class="{ expanded: openRows[patient._id] }"
            >


                <td data-label="Patient" class="cell-patient">

                    <div class="patient-row">

                        <div class="patient">

<div class="avatar">

<img
v-if="patient.user?.profileImage"
:src="patient.user.profileImage"
alt="Patient"
/>

<span v-else>
{{patient.user?.name?.charAt(0)}}
</span>

</div>


                            <div class="patient-heading">

                                <strong>
                                    {{patient.user?.name}}
                                </strong>

                                <small class="email-mobile">
                                    {{patient.user?.email}}
                                </small>

                            </div>

                        </div>


                        <button
                        class="row-expand-btn"
                        @click="toggleRow(patient._id)"
                        :aria-expanded="!!openRows[patient._id]"
                        >
                            <span class="chevron">›</span>
                        </button>


                    </div>


                </td>



                <td data-label="Email" class="cell-hide-mobile">
                    {{patient.user?.email}}
                </td>



                <td data-label="Age" class="cell-collapsible">
                    {{patient.age}}
                </td>



                <td data-label="Gender" class="cell-collapsible">

                    <span class="gender">
                        {{patient.gender}}
                    </span>

                </td>




                <td data-label="Contact" class="cell-collapsible">
                    {{patient.contactInformation}}
                </td>



                <td data-label="Medical History" class="cell-collapsible">
                    {{patient.medicalHistory || "N/A"}}
                </td>

<td data-label="Actions" class="cell-collapsible">

<button
class="edit-btn"
@click="editPatient(patient)"
>
✏ Edit
</button>

</td>

            </tr>



            </tbody>


        </table>

        <div class="pagination">


<button
@click="previousPage"
:disabled="page===1"
>
← Previous
</button>


<span>
Page {{page}} / {{totalPages}}
</span>


<button
@click="nextPage"
:disabled="page===totalPages"
>
Next →
</button>


</div>

        </div>



    </div>

        <!-- Create Patient -->


    <div class="card form-card patient-form">


        <div class="card-head">

            <div>

         <h3>
{{editMode ? "Update Patient" : "Add New Patient"}}
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

:disabled="editMode"

/>

            </div>




            <div class="field">

                <label>
                    Password
                </label>

              <input

v-model="password"

type="password"

:placeholder="
editMode 
? 'Enter new password (optional)'
: 'Password'
"

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

{{editMode ? "Update Patient" : "+ Create Patient"}}

</button>


<button

v-if="editMode"

class="cancel-btn"

@click="clearForm"

>

Cancel

</button>



    </div>

        <p 
        v-if="!patients.length"
        class="empty-hint table-empty"
        >
            No doctors found.
        </p>

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

flex-shrink:0;

border-radius:14px;

background:var(--gradient-primary);

color:white;

display:flex;

align-items:center;

justify-content:center;

font-weight:800;

}


.patient-row{

display:flex;

align-items:center;

justify-content:space-between;

gap:10px;

width:100%;

}


.patient-heading{

display:flex;

flex-direction:column;

min-width:0;

}


.email-mobile,
.row-expand-btn{

display:none;

}




.gender{

background:var(--info-bg);

color:var(--info);

padding:6px 14px;

border-radius:var(--radius-pill);

font-size:12px;

font-weight:700;

}


.edit-btn{

width: 100%;    

border:none;

padding:9px 16px;

border-radius:var(--radius-pill);

background:var(--info-bg);

color:var(--info);

font-weight:700;

font-size:13px;

cursor:pointer;

}

.cancel-btn{

margin-top:25px;

margin-left: 15px;

padding:14px 30px;

border:none;

border-radius:var(--radius-pill);

background:var(--gradient-primary);

color:white;

font-weight:700;

cursor:pointer;

box-shadow:var(--shadow-lg);

}



/* ===========================
   Tablet (992px)
=========================== */
@media (max-width: 992px) {

  .header{
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .badge{
    align-self: flex-start;
  }

  .card{
    padding: 22px;
  }

  .form-grid{
    grid-template-columns: 1fr;
  }

  .full{
    grid-column: span 1;
  }

  .card-head{
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }



}


/* ===========================
   Mobile (768px)
=========================== */
@media (max-width:768px){

  .page{
    padding: 10px;
  }

  .header h2{
    font-size:24px;
  }

  .card{
    padding:18px;
    border-radius:16px;
  }

  .badge{
    width:100%;
    text-align:center;
    padding:12px;
  }

  input,
  select{
    font-size:14px;
    padding:12px;
  }



}


/* ===========================
   Mobile Table -> Collapsed Cards (700px)
=========================== */

@media (max-width:700px){

  thead{
    display:none;
  }

  .table-wrapper{
    overflow-x:hidden;
  }

  table{
    min-width:0;
  }

  table,
  tbody{
    display:block;
    width:100%;
  }

  tbody{
    display:flex;
    flex-direction:column;
    gap:12px;
  }

  tbody tr{
    display:flex;
    flex-direction:column;
    box-shadow:0 5px 18px rgba(15,23,42,.06);
    border-radius:18px;
    padding:14px;
  }

  tbody tr:hover{
    transform:none;
  }

  td{
    border:none !important;
    border-radius:0 !important;
    padding:0;
    white-space:normal;
  }

  .cell-patient{
    padding:0;
  }

  /* Email duplicate column hidden, shown inline instead */

  tbody tr .cell-hide-mobile{
    display:none;
  }

  /* Extra fields hidden until row expanded */

  tbody tr .cell-collapsible{
    display:none;
  }

  tbody tr.expanded .cell-collapsible{
    display:flex;
    align-items:center;
    justify-content:space-between;
    padding-top:12px;
    margin-top:12px;
    border-top:1px dashed var(--border) !important;
    font-size:13px;
  }

  tbody tr.expanded .cell-collapsible::before{
    content:attr(data-label);
    font-size:10.5px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.4px;
    color:var(--muted);
  }

  .patient{
    gap:10px;
  }

  .avatar{
    width:40px;
    height:40px;
    border-radius:12px;
    font-size:15px;
  }

  .patient-heading strong{
    font-size:14.5px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width:150px;
    display:block;
  }

  .email-mobile{
    display:block;
    font-size:11.5px;
    color:var(--muted);
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    max-width:170px;
  }

  .row-expand-btn{
    display:flex;
    align-items:center;
    justify-content:center;
    width:32px;
    height:32px;
    flex-shrink:0;
    border:none;
    border-radius:50%;
    background:var(--surface-solid,#eef2f7);
    color:var(--primary);
    padding:0;
    cursor:pointer;
    transition:.25s ease;
  }

  .row-expand-btn:active{
    transform:scale(.92);
  }

  .chevron{
    font-size:19px;
    font-weight:700;
    line-height:1;
    transition:transform .25s ease;
  }

  tbody tr.expanded .row-expand-btn{
    background:var(--gradient-primary);
    color:white;
  }

  tbody tr.expanded .chevron{
    transform:rotate(90deg);
  }

  .edit-btn{
    width:30%;
  }

}


/* ===========================
   Small Mobile (480px)
=========================== */
@media (max-width:480px){

  .header h2{
    font-size:20px;
  }

  .header p{
    font-size:13px;
  }

  .card{
    padding:14px;
  }

  .card-head h3{
    font-size:18px;
  }

  .field label{
    font-size:12px;
  }

  input,
  select{
    padding:10px 12px;
    font-size:13px;
  }

  .save-btn{
    font-size:14px;
  }

}


/* Header Actions */
.header-actions{

    display:flex;
    align-items:center;
    gap:12px;
    flex-wrap:wrap;

}


/* Scroll Form Button */

.scroll-form-btn,
.pdf-btn
{

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    color:white;

    padding:11px 18px;

    border-radius:30px;

    font-size:13px;

    font-weight:600;

    white-space:nowrap;

    box-shadow:var(--shadow);

    transition:.3s;

}


.scroll-form-btn:hover{

    transform:translateY(-3px);

}





/* ===========================
   Pagination
=========================== */

.pagination{

display:flex;

justify-content:center;

align-items:center;

gap:15px;

margin-top:25px;

padding-top:20px;

border-top:1px solid var(--border);

}



.pagination button{

padding:10px 20px;

border:none;

border-radius:var(--radius-pill);

background:var(--gradient-primary);

color:white;

font-size:13px;

font-weight:700;

cursor:pointer;

box-shadow:var(--shadow);

transition:.3s ease;

}



.pagination button:hover:not(:disabled){

transform:translateY(-3px);

box-shadow:var(--shadow-lg);

}



.pagination button:disabled{

opacity:.45;

cursor:not-allowed;

transform:none;

}



.pagination span{

padding:10px 18px;

background:var(--surface-solid);

border:1px solid var(--border);

border-radius:var(--radius-pill);

font-size:13px;

font-weight:700;

color:var(--text);

}





/* ===========================
   Tablet
=========================== */

@media(max-width:800px){
        .pagination{

        gap:10px;

    }

}
@media(max-width:768px){


.pagination{

gap:10px;

}


.pagination button{

padding:9px 15px;

font-size:12px;

}


.pagination span{

padding:9px 14px;

font-size:12px;

}


}


@media(max-width:600px){
        .pagination{

        flex-wrap:wrap;

    }


    .pagination button{

        padding:10px 14px;

    }
}
/* ===========================
   Small Mobile
=========================== */

@media(max-width:480px){



.pagination{

flex-direction:row;

justify-content:center;

align-items:center;

width:100%;

gap:8px;

}



.pagination button{

width:auto;

flex:1;

padding:10px 8px;

font-size:12px;

}



.pagination span{

flex:1;

width:auto;

padding:10px 6px;

font-size:12px;

text-align:center;

white-space:nowrap;

}



}

/* ===========================
   Search Bar
=========================== */

.search-bar{

display:flex;

align-items:center;

gap:12px;

background:var(--surface);

border:1px solid var(--border);

border-radius:var(--radius-xl);

padding:12px 18px;

margin-bottom:25px;

box-shadow:var(--shadow);

backdrop-filter:blur(15px);

transition:.3s ease;

}



.search-bar:focus-within{

border-color:var(--secondary);

box-shadow:
0 0 0 4px rgba(20,184,166,.15),
var(--shadow);

}



.search-icon{

font-size:18px;

display:flex;

align-items:center;

justify-content:center;

color:var(--primary);

}



.search-bar input{

flex:1;

border:none;

outline:none;

background:transparent;

padding:8px 5px;

font-size:14px;

color:var(--text);

}



.search-bar input::placeholder{

color:var(--muted);

}



.search-bar input:focus{

box-shadow:none;

border:none;

}





/* ===========================
   Tablet
=========================== */

@media(max-width:768px){


.search-bar{

padding:11px 15px;

border-radius:16px;

}



.search-icon{

font-size:16px;

}



.search-bar input{

font-size:13px;

}


}




/* ===========================
   Small Mobile
=========================== */

@media(max-width:480px){


.search-bar{

gap:8px;

padding:10px 12px;

}



.search-icon{

font-size:15px;

}


.search-bar input{

font-size:12px;

}


}
/* ===========================
   PDF BUTTON
=========================== */


.pdf-btn{

background:var(--danger);

color:white;

padding:11px 18px;

border:none;

border-radius:30px;

font-size:13px;

font-weight:700;

cursor:pointer;

box-shadow:var(--shadow);

transition:.3s;

white-space:nowrap;

}


.pdf-btn:hover{

transform:translateY(-3px);

box-shadow:var(--shadow-lg);

}



@media(max-width:800px){


.pdf-btn{

width:50%;

text-align:center;

}


}

.avatar img{

width:100%;
height:100%;
object-fit:cover;
border-radius:14px;

}
</style>