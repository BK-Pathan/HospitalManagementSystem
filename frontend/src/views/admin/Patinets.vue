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


<thead>

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
Visit Reason
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
Created At
</th>


</tr>

</thead>



<tbody>


<tr
v-for="patient in patients"
:key="patient._id"
>


<td>
{{ patient.user?.name || "N/A" }}
</td>


<td>
{{ patient.user?.email || "N/A" }}
</td>


<td>
{{ patient.user?.role || "N/A" }}
</td>


<td>
{{ patient.DescribeYourProblem || "N/A" }}
</td>


<td>
{{ patient.age || "N/A" }}
</td>


<td>
{{ patient.gender || "N/A" }}
</td>


<td>
{{ patient.contactInformation || "N/A" }}
</td>


<td>
{{ new Date(patient.createdAt).toLocaleDateString() }}
</td>


</tr>



<tr v-if="patients.length === 0">

<td colspan="8">
No Patients Found
</td>

</tr>


</tbody>


</table>



</div>


</template>