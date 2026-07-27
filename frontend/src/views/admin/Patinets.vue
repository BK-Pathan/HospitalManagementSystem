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

padding:30px;

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

gap:15px;

}




.total-card{

background:var(--white);

padding:14px 25px;

border-radius:var(--radius-lg);

box-shadow:var(--shadow);

display:flex;

flex-direction:column;

text-align:center;

}



.total-card span{

font-size:12px;

color:var(--muted);

font-weight:600;

}



.total-card strong{

font-size:28px;

color:var(--primary);

}




.export{

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



@media(max-width:800px){


.page-header{

flex-direction:column;

align-items:flex-start;

gap:20px;

}


.header-actions{

flex-wrap:wrap;

}


.patients-grid{

grid-template-columns:1fr;

}



}



</style>