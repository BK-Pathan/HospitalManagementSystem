<script setup>

import {ref,onMounted} from "vue";
import {useRoute} from "vue-router";
import api from "../../api/axios";


const route = useRoute();


const prescriptions = ref([]);

const loading = ref(true);



// ============================
// GET PRESCRIPTIONS
// ============================

const getPrescriptions = async()=>{


try{


console.log(
"Patient ID:",
route.params.patientId
);



const res = await api.get(

`/prescription/patient/${route.params.patientId}`

);



console.log(
"Prescription Response:",
res.data
);



prescriptions.value=res.data;



}

catch(error){


console.log(
"Prescription Error:",
error.response?.data || error.message
);


}

finally{


loading.value=false;


}


};




onMounted(()=>{


getPrescriptions();


});


</script>





<template>


<div class="page">


<h2>
Patient Prescriptions
</h2>



<div v-if="loading">

Loading prescriptions...

</div>





<div 
v-else-if="prescriptions.length===0"
class="empty"
>


No Prescription Found


</div>







<div
v-for="prescription in prescriptions"
:key="prescription._id"
class="card"
>




<h3>
Prescription Details
</h3>




<p>
<b>Date:</b>

{{new Date(prescription.createdAt).toLocaleDateString()}}

</p>




<p>
<b>Doctor:</b>

{{prescription.doctor?.user?.name}}

</p>




<p>
<b>Patient:</b>

{{prescription.patient?.user?.name}}

</p>






<hr>





<h4>
Medicines
</h4>




<table>


<tr>

<th>
Name
</th>


<th>
Dosage
</th>


<th>
Frequency
</th>


</tr>





<tr
v-for="medicine in prescription.medicines"
:key="medicine._id"
>


<td>
{{medicine.name}}
</td>


<td>
{{medicine.dosage}}
</td>


<td>
{{medicine.frequency}}
</td>


</tr>



</table>







<h4>
Instructions
</h4>


<p>
{{prescription.instructions || "No instructions"}}
</p>





<h4>
Notes
</h4>


<p>
{{prescription.notes || "No notes"}}
</p>





</div>



</div>


</template>






<style scoped>


.page{

padding:30px;

}



.card{

background:white;

padding:25px;

border-radius:20px;

margin-bottom:25px;

box-shadow:var(--shadow);

border:1px solid var(--border);

}



table{

width:100%;

border-collapse:collapse;

}



th,td{

padding:12px;

border:1px solid #ddd;

text-align:left;

}



.empty{

background:white;

padding:30px;

border-radius:15px;

}



h2{

margin-bottom:25px;

}


</style>