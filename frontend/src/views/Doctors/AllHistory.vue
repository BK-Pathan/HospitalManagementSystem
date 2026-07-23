<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();
const router = useRouter();


const patientInfo = ref(null);


const myAppointments = ref([]);

const otherAppointments = ref([]);

const prescriptions = ref([]);


const totalVisits = ref(0);

const lastVisit = ref(null);



// ===============================
// Get Patient History
// ===============================

const getHistory = async()=>{


try{


const res = await api.get(

`/doctor/patient-history/${route.params.patientId}`

);



console.log(
"PATIENT HISTORY:",
res.data
);



myAppointments.value =
res.data.myAppointments || [];



otherAppointments.value =
res.data.otherAppointments || [];



prescriptions.value =
res.data.previousPrescriptions || [];




// patient info

if(myAppointments.value.length){

patientInfo.value =
myAppointments.value[0].patient;

}



totalVisits.value =
myAppointments.value.length +
otherAppointments.value.length;



if(myAppointments.value.length){

lastVisit.value =
myAppointments.value[0];

}



}
catch(error){

console.log(error.response?.data);

}


};




// ===============================
// Write Prescription
// ===============================

const writePrescription=(patientId,appointmentId)=>{


router.push(

`/doctor/write-prescription/${patientId}/${appointmentId}`

);


};




// ===============================
// View Prescription
// ===============================

const viewPrescription=(id)=>{


router.push(

`/doctor/prescription/${id}`

);


};




onMounted(()=>{


getHistory();


});



</script>





<template>


<div class="container">


<h1>
🏥 Patient Medical History
</h1>



<!-- Patient Info -->


<div class="card"

v-if="patientInfo">


<h2>
Patient Information
</h2>


<p>
Name:
{{patientInfo.user?.name}}
</p>


<p>
Email:
{{patientInfo.user?.email}}
</p>


<p>
Age:
{{patientInfo.age || "N/A"}}
</p>


<p>
Gender:
{{patientInfo.gender || "N/A"}}
</p>


</div>





<!-- Stats -->


<div class="stats">


<div class="card">

<h3>
Total Visits
</h3>

<h1>
{{totalVisits}}
</h1>


</div>




<div class="card">


<h3>
Last Visit
</h3>


<p v-if="lastVisit">

{{new Date(
lastVisit.appointmentDateTime
).toLocaleDateString()}}

</p>


<p v-else>
No Record
</p>


</div>


</div>







<!-- My Appointments -->


<h2>
My Appointments
</h2>


<table border="1">


<tr>

<th>
Date
</th>

<th>
Problem
</th>

<th>
Status
</th>

<th>
Action
</th>


</tr>



<tr

v-for="a in myAppointments"

:key="a._id"

>


<td>

{{new Date(
a.appointmentDateTime
).toLocaleString()}}

</td>



<td>

{{a.patient?.DescribeYourProblem || "N/A"}}

</td>



<td>

{{a.status}}

</td>



<td>


<button

@click="
writePrescription(
a.patient._id,
a._id
)
"

>

Write Prescription

</button>


</td>


</tr>


</table>








<br>





<!-- Other Doctors -->


<h2>
Previous Doctors History
</h2>



<table border="1">


<tr>

<th>
Doctor
</th>

<th>
Date
</th>

<th>
Status
</th>

<th>
Action
</th>

</tr>




<tr

v-for="a in otherAppointments"

:key="a._id"

>


<td>

{{a.doctor?.user?.name || "N/A"}}

</td>



<td>

{{new Date(
a.appointmentDateTime
).toLocaleString()}}

</td>



<td>

{{a.status}}

</td>



<td>


<button

@click="
viewPrescription(a._id)
"

>

View Prescription

</button>


</td>


</tr>



</table>








<br>





<!-- Prescriptions -->


<h2>
Previous Prescriptions
</h2>



<div

v-if="prescriptions.length===0"

>

No Prescription Found

</div>



<table

v-else

border="1"

>


<tr>

<th>
Doctor
</th>

<th>
Date
</th>

<th>
Details
</th>


</tr>



<tr

v-for="p in prescriptions"

:key="p._id"

>


<td>

{{p.doctor?.user?.name}}

</td>


<td>

{{new Date(
p.createdAt
).toLocaleDateString()}}

</td>


<td>

<button

@click="
viewPrescription(p._id)
"

>

View

</button>

</td>


</tr>



</table>




</div>


</template>