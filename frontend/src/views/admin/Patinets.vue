<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";
import Papa from "papaparse";
import {saveAs} from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const patients = ref([]);


// Get all patients

const getPatients = async()=>{

    try{


        const res = await api.get("/admin/patients");



        patients.value = res.data;


    }catch(error){

        console.log(error);

    }

}



onMounted(()=>{

    getPatients();

});

// serach by name
const search = ref("");

const searchPatients = async()=>{

const res = await api.get("/admin/patients",{

params:{
search:search.value
}

});

patients.value = res.data;

}

// Export Patients CSV

const exportCSV = ()=>{

    const data = patients.value.map(patient=>({

        Name: patient.user.name,
        Email: patient.user.email,
        Role: patient.user.role,
        VisitReason: patient.DescribeYourProblem,
        ProfileCompleted: patient.profilecompleted ? "Completed" : "Incomplete",
        CreatedAt: new Date(patient.createdAt).toLocaleDateString()

    }));


    const csv = Papa.unparse(data);


    const blob = new Blob(
        [csv],
        {
            type:"text/csv;charset=utf-8;"
        }
    );


    saveAs(blob,"patients.csv");

};

// Export Patients PDF

const exportPDF = ()=>{

    const doc = new jsPDF();


    doc.text(
        "Patients Report",
        14,
        15
    );


    const tableData = patients.value.map(patient=>[

        patient.user.name,
        patient.user.email,
        patient.user.role,
        patient.DescribeYourProblem,
        patient.profilecompleted ? "Completed" : "Incomplete"

    ]);



    autoTable(doc,{

        head:[
            [
                "Name",
                "Email",
                "Role",
                "Visit Reason",
                "Profile"
            ]
        ],

        body:tableData,

        startY:25

    });



    doc.save("patients.pdf");

};

</script>



<template>

<div class="patients-container">


    <div class="page-header">

        <div>
            <span class="eyebrow">
                Hospital Admin
            </span>

            <h2>
                👥 Patients Management
            </h2>

            <p>
                Manage and monitor registered patients
            </p>

        </div>


        <div class="header-actions">


            <div class="total-card">

                <span>
                    Total Patients
                </span>

                <strong>
                    {{patients.length}}
                </strong>

            </div>



            <button 
            class="export csv"
            @click="exportCSV"
            >
                ⬇ CSV
            </button>


            <button 
            class="export pdf"
            @click="exportPDF"
            >
                📄 PDF
            </button>


        </div>


    </div>



    <div class="search-box">

        🔍

        <input
        v-model="search"
        placeholder="Search patient..."
        @input="searchPatients"
        />

    </div>




    <div class="patients-grid">


        <div
        class="patient-card"
        v-for="patient in patients"
        :key="patient._id"
        >



            <div class="patient-top">


                <div class="avatar">
                    {{patient.user.name.charAt(0)}}
                </div>


                <div>

                    <h3>
                        {{patient.user.name}}
                    </h3>

                    <p>
                        {{patient.user.email}}
                    </p>

                </div>


            </div>




            <div class="patient-info">


                <div>

                    <span>
                        Role
                    </span>

                    <strong class="role">
                        {{patient.user.role}}
                    </strong>

                </div>



                <div>

                    <span>
                        Visit Reason
                    </span>

                    <strong>
                        {{patient.DescribeYourProblem || "N/A"}}
                    </strong>

                </div>




                <div>

                    <span>
                        Profile Status
                    </span>


                    <strong
                    :class="
                    patient.profilecompleted
                    ? 'completed'
                    :'pending'
                    "
                    >

                    {{
                    patient.profilecompleted
                    ?
                    "Completed"
                    :
                    "Incomplete"
                    }}

                    </strong>

                </div>




                <div>

                    <span>
                        Registered
                    </span>


                    <strong>
                        {{new Date(patient.createdAt)
                        .toLocaleDateString()}}
                    </strong>

                </div>



            </div>



        </div>



        <p 
        v-if="!patients.length"
        class="empty"
        >
            No patients found.
        </p>



    </div>



</div>

</template>



<style scoped>


.patients-container{

padding:0px;

min-height:100%;

}



.page-header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:25px;

}



.eyebrow{

font-size:12px;

font-weight:700;

letter-spacing:1px;

color:var(--secondary);

text-transform:uppercase;

}



.page-header h2{

margin:6px 0;

font-size:28px;

color:var(--text);

}



.page-header p{

margin:0;

color:var(--muted);

}



.header-actions{

    display:flex;

    align-items:center;

    justify-content:flex-end;

    gap:10px;

    flex-wrap:nowrap;

}



.total-card{

    width:60px;
    height:62px;

    /* background:var(--white); */

    padding:12px 14px;

    border-radius:var(--radius-md);

    box-shadow:var(--shadow);

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    text-align:center;

}


.total-card span{

font-size:12px;

color:var(--muted);

font-weight:600;

}



.total-card strong{

font-size:20px;

color:var(--primary);

}




.export{
     padding:12px 14px;
    min-width:80px;
    white-space:nowrap;
    font-size:13px;

border:none;

padding:12px 18px;

border-radius:var(--radius-md);

font-weight:600;

cursor:pointer;

color:white;

}



.csv{

background:var(--success);

}



.pdf{

background:var(--danger);

}





.search-box{

background:var(--white);

border:1px solid var(--border);

padding:12px 18px;

border-radius:var(--radius-lg);

display:flex;

align-items:center;

gap:10px;

margin-bottom:25px;

box-shadow:var(--shadow);

}



.search-box input{

border:none;

outline:none;

flex:1;

font-size:14px;

}




.patients-grid{

display:grid;

grid-template-columns:
repeat(auto-fill,minmax(320px,1fr));

gap:22px;

}




.patient-card{

background:var(--surface);

backdrop-filter:blur(10px);

border:1px solid var(--border);

border-radius:var(--radius-xl);

padding:22px;

box-shadow:var(--shadow);

transition:.3s;

}



.patient-card:hover{

transform:translateY(-5px);

box-shadow:var(--shadow-lg);

}




.patient-top{

display:flex;

align-items:center;

gap:15px;

padding-bottom:18px;

border-bottom:1px solid var(--border);

}




.avatar{

width:55px;

height:55px;

border-radius:18px;

background:var(--gradient-primary);

color:white;

display:flex;

align-items:center;

justify-content:center;

font-size:22px;

font-weight:700;

}




.patient-top h3{

margin:0;

font-size:18px;

color:var(--text);

}



.patient-top p{

margin:5px 0 0;

font-size:13px;

color:var(--muted);

}




.patient-info{

margin-top:18px;

display:flex;

flex-direction:column;

gap:14px;

}



.patient-info div{

display:flex;

flex-direction:column;

gap:5px;

}



.patient-info span{

font-size:11px;

font-weight:700;

color:var(--muted);

text-transform:uppercase;

}



.patient-info strong{

font-size:14px;

color:var(--text-soft);

}



.role{

background:var(--info-bg);

color:var(--info);

padding:5px 12px;

border-radius:var(--radius-pill);

width:max-content;

font-size:12px!important;

}




.completed{

background:var(--success-bg);

color:var(--success)!important;

padding:5px 12px;

border-radius:var(--radius-pill);

width:max-content;

font-size:12px!important;

}



.pending{

background:var(--danger-bg);

color:var(--danger)!important;

padding:5px 12px;

border-radius:var(--radius-pill);

width:max-content;

font-size:12px!important;

}



.empty{

text-align:center;

color:var(--muted);

padding:40px;

}



/* ===========================================
   LARGE TABLETS
=========================================== */

@media (max-width: 1024px){

.patients-container{
    padding:20px;
}

.page-header{
    flex-direction:column;
    align-items:flex-start;
    gap:18px;
}

.header-actions{
    width:100%;
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:12px;
}

.total-card,
.export{
    width:100%;
}

.patients-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
}

}


/* ===========================================
   TABLETS
=========================================== */

@media (max-width:768px){

.patients-container{
    padding:16px;
}

/* Header */

.page-header{
    gap:16px;
    margin-bottom:18px;
}

.eyebrow{
    font-size:11px;
}

.page-header h2{
    font-size:24px;
    line-height:1.2;
}

.page-header p{
    font-size:14px;
}

/* Actions */

.header-actions{
    grid-template-columns:1fr;
}

.total-card{
    padding:14px;
}

.total-card strong{
    font-size:24px;
}

.export{
    padding:13px;
    font-size:14px;
}

/* Search */

.search-box{
    padding:12px 14px;
    margin-bottom:18px;
}

.search-box input{
    font-size:14px;
}

/* Cards */

.patients-grid{
    grid-template-columns:1fr;
    gap:16px;
}

.patient-card{
    padding:18px;
    border-radius:18px;
}

.patient-top{
    gap:12px;
    padding-bottom:14px;
}

.avatar{
    width:48px;
    height:48px;
    border-radius:14px;
    font-size:18px;
}

.patient-top h3{
    font-size:17px;
}

.patient-top p{
    font-size:12px;
    word-break:break-word;
}

.patient-info{
    gap:12px;
}

.patient-info strong{
    word-break:break-word;
}

}


/* ===========================================
   SMALL PHONES
=========================================== */

@media (max-width:480px){

.patients-container{
    padding:12px;
}

.page-header h2{
    font-size:20px;
}

.page-header p{
    font-size:13px;
}

.header-actions{
    gap:10px;
}

.total-card{
    padding:12px;
}

.total-card span{
    font-size:11px;
}

.total-card strong{
    font-size:22px;
}

.export{
    width:10%;
    padding:12px;
    font-size:13px;
}

.search-box{
    padding:10px 12px;
}

.search-box input{
    font-size:13px;
}

.patient-card{
    padding:16px;
}

.patient-top{
    align-items:flex-start;
}

.avatar{
    width:42px;
    height:42px;
    font-size:16px;
}

.patient-top h3{
    font-size:16px;
}

.patient-top p{
    font-size:11px;
}

.patient-info span{
    font-size:10px;
}

.patient-info strong{
    font-size:13px;
}

.role,
.completed,
.pending{
    font-size:11px !important;
    padding:4px 10px;
}

}


/* ===========================================
   EXTRA SMALL DEVICES (320px)
=========================================== */

@media (max-width:360px){

.page-header h2{
    font-size:18px;
}

.patient-card{
    padding:14px;
}

.avatar{
    width:38px;
    height:38px;
}

.patient-top h3{
    font-size:15px;
}

.export{
    font-size:12px;
}

}

@media (max-width:480px){

.header-actions{
    display:flex;
    gap:8px;
    align-items:stretch;
}

.total-card{
    flex:1;
}

.export{
    min-width:70px;
    padding:10px 12px;
    font-size:12px;
}

}
</style>