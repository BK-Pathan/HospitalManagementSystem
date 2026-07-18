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

    <div class="header">
        <div>
            <h2>Patients Management</h2>
            <p>Manage and monitor registered patients</p>
        </div>

        <div class="total-card">
            Total Patients
            <strong>{{ patients.length }}</strong>
        </div>
        <div class="export-buttons">

<button @click="exportCSV">
Export CSV
</button>


<button @click="exportPDF">
Export PDF
</button>

</div>
    </div>

    <input
v-model="search"
placeholder="Search Patient"
@input="searchPatients"
/>

    <div class="table-card">

        <table>

            <thead>
                <tr>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Role</th>

                    <th>Visit Reason</th>

                    <th>Profile Completed</th>

                    <th>Created At</th>

                </tr>
            </thead>


            <tbody>

                <tr
                v-for="patient in patients"
                :key="patient._id"
                >

                    <td>
                        <div class="patient-name">
                            <div class="avatar">
                                {{ patient.user.name.charAt(0) }}
                            </div>

                            {{patient.user.name}}
                        </div>
                    </td>


                    <td>
                        {{patient.user.email}}
                    </td>


                    <td>
                        <span class="role">
                            {{patient.user.role}}
                        </span>
                    </td>


                    <td>
                        {{patient.DescribeYourProblem}}
                    </td>


                    <td>

                        <span 
                        :class="patient.profilecompleted ? 'completed' : 'pending'"
                        >
                            {{ patient.profilecompleted ? "Completed" : "Incomplete" }}
                        </span>

                    </td>


                    <td>
                        {{new Date(patient.createdAt).toLocaleDateString()}}
                    </td>


                </tr>


            </tbody>


        </table>


    </div>


</div>

</template>



<style scoped>

:root{
    --primary:#0F766E;
    --primary-dark:#115E59;
    --secondary:#14B8A6;
    --bg:#5984a5;
    --white:#fff;
    --text:#1E293B;
    --muted:#64748B;
    --border:#DCE7EF;
    --shadow:0 20px 50px rgba(0,0,0,.12);
}



.patients-container{

    padding:30px;
    background:var(--bg);
    min-height:100vh;
    color:var(--text);

}



.header{

    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:25px;

}



.header h2{

    font-size:28px;
    color:var(--text);
    margin:0;

}



.header p{

    color:var(--text);
    margin-top:8px;

}



.total-card{

    background:var(--white);
    padding:18px 25px;
    border-radius:15px;
    box-shadow:var(--shadow);
    color:var(--muted);
    display:flex;
    flex-direction:column;
    text-align:center;

}



.total-card strong{

    color:var(--primary);
    font-size:28px;

}



.table-card{

    background:var(--white);
    border-radius:18px;
    padding:20px;
    box-shadow:var(--shadow);
    overflow:hidden;

}



table{

    width:100%;
    border-collapse:collapse;

}



thead{

    background:var(--primary);

}



th{

    color:var(--white);
    padding:15px;
    text-align:left;
    font-size:14px;

}



td{

    padding:15px;
    border-bottom:1px solid var(--border);
    color:var(--text);

}



tbody tr{

    transition:.3s;

}



tbody tr:hover{

    background:#f0fdfa;

}



.patient-name{

    display:flex;
    align-items:center;
    gap:12px;
    font-weight:600;

}



.avatar{

    width:38px;
    height:38px;
    border-radius:50%;
    background:var(--secondary);
    color:var(--white);
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:bold;

}



.role{

    background:#ccfbf1;
    color:var(--primary-dark);
    padding:5px 12px;
    border-radius:20px;
    font-size:12px;
    font-weight:600;

}



.completed,
.pending{

    padding:6px 14px;
    border-radius:20px;
    font-size:12px;
    font-weight:600;

}



.completed{

    background:#dcfce7;
    color:#166534;

}



.pending{

    background:#fee2e2;
    color:#991b1b;

}


</style>