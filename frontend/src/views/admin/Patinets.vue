<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


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


</script>



<template>


<div>


<h2>
Patients Management
</h2>



<table border="1">


<tr>

<th>
Name
</th>


<th>
Email
</th>


<th>
Role
</th>

<th>
  VisitReason  
</th>

<th>
Created At
</th>


</tr>



<tr
v-for="patient in patients"
:key="patient._id"
>


<td>
{{patient.user.name}}
</td>

<td>
{{patient.user.email}}
</td>




<td>
{{patient.user.role}}
</td>

<td>
{{patient.DescribeYourProblem}}
</td>


<td>
{{patient.createdAt}}
</td>



</tr>


</table>



</div>


</template>