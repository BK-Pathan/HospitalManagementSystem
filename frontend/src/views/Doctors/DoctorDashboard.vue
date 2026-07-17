<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const stats=ref({

patients:0,
appointments:0,
pending:0,
confirmed:0,
completed:0,
cancelled:0,
recentAppointments:[]

});



const getStats=async()=>{


const res=await api.get(
"/doctor/dashboard"
);


stats.value=res.data;


}



onMounted(()=>{

getStats();

});


</script>



<template>

<div class="dashboard-page">


<h2 class="page-title">
Doctor Dashboard
</h2>




<div class="cards">



<div class="stat-card">

<h3>
Patients
</h3>

<h1>
{{stats.patients}}
</h1>

</div>





<div class="stat-card">

<h3>
Pending
</h3>

<h1>
{{stats.pending}}
</h1>

</div>





<div class="stat-card">

<h3>
Confirmed
</h3>

<h1>
{{stats.confirmed}}
</h1>

</div>





<div class="stat-card">

<h3>
Completed
</h3>

<h1>
{{stats.completed}}
</h1>

</div>





<h2 class="section-title">
Recent Appointments
</h2>





<div class="table-card">


<table class="appointments-table">


<tr>

<th>
Patient
</th>

<th>
Email
</th>

<th>
Status
</th>

</tr>





<tr
v-for="item in stats.recentAppointments"
:key="item._id"
>


<td>
{{item.patient.user.name}}
</td>




<td>
{{item.patient.user.email}}
</td>




<td>

<span class="status">

{{item.status}}

</span>

</td>




</tr>



</table>


</div>




</div>



</div>

</template>

<style scoped>


.dashboard-page{

    min-height:100%;

}



.page-title{

    font-size:32px;

    color:var(--text);

    margin-bottom:30px;

}





.cards{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:25px;

}





.stat-card{

    background:var(--white);

    padding:25px;

    border-radius:20px;

    border:1px solid var(--border);

    box-shadow:var(--shadow);

    transition:.3s;

}





.stat-card:hover{

    transform:translateY(-5px);

}





.stat-card h3{

    color:var(--muted);

    font-size:16px;

}





.stat-card h1{

    color:var(--primary);

    font-size:38px;

    margin-top:15px;

}





.section-title{

    grid-column:1/-1;

    margin-top:30px;

    color:var(--text);

}





.table-card{

    grid-column:1/-1;

    background:var(--white);

    padding:30px;

    border-radius:20px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

    overflow-x:auto;

}





.appointments-table{

    width:100%;

    border-collapse:collapse;

}





.appointments-table th{

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--primary-dark)
    );

    color:white;

    padding:15px;

    text-align:left;

}





.appointments-table td{

    padding:15px;

    color:var(--text);

    border-bottom:1px solid var(--border);

}





.appointments-table tr:hover{

    background:#f8fafc;

}





.status{

    padding:8px 14px;

    border-radius:20px;

    background:rgba(20,184,166,.15);

    color:var(--primary);

    font-weight:700;

    font-size:13px;

    text-transform:capitalize;

}





@media(max-width:1000px){


.cards{

    grid-template-columns:repeat(2,1fr);

}


}



@media(max-width:600px){


.cards{

    grid-template-columns:1fr;

}


}


</style>