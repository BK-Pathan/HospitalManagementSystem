<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();
const router = useRouter();
const totalVisits = ref(0);

const lastVisit = ref(null);

const myAppointments = ref([]);

const otherAppointments = ref([]);



const getHistory = async()=>{


try{


const res = await api.get(
`/doctor/patient-history/${route.params.patientId}`
);



console.log(res.data);



myAppointments.value = res.data.myAppointments;


otherAppointments.value = res.data.otherAppointments;



}catch(error){


console.log(error);


}



};

const viewPrescription = (item)=>{


console.log(
"Selected Appointment For Prescription:",
item
);



const patientId = item.patient?._id;



console.log(
"Patient ID:",
patientId
);



if(!patientId){


console.log(
"Patient ID not found"
);


return;

}



router.push(
`/doctor/prescriptions/${patientId}`
);



};

const getPatientStats = async()=>{


try{


const res = await api.get(

`/doctor/patient-stats/${route.params.patientId}`

);



console.log(
"Patient Stats:",
res.data
);



totalVisits.value =
res.data.totalVisits;



lastVisit.value =
res.data.lastVisit;



}
catch(error){

console.log(error);

}


};

onMounted(()=>{

getHistory();
getPatientStats();

});


</script>



<template>


<div>


<h2>
My Patient History
</h2>


<div class="stats">


<div class="card">

<h3>Total Visits</h3>

<h1>
{{totalVisits}}
</h1>

</div>



<div class="card">

<h3>Last Visit</h3>

<p v-if="lastVisit">

{{new Date(
lastVisit.appointmentDateTime
).toLocaleDateString()}}

</p>

<p v-else>

No Visit

</p>

</div>


</div>

<table border="1">


<tr>

<th>
Name
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
v-for="item in myAppointments"
:key="item._id"
>



<td>
{{item.patient?.user?.name || "N/A"}}
</td>


<td>
{{item.patient?.user?.email || "N/A"}}
</td>


<td>
{{item.patient?.age || "N/A"}}
</td>


<td>
{{item.patient?.gender || "N/A"}}
</td>



<td>

{{new Date(item.appointmentDateTime).toLocaleString()}}

</td>



<td>

{{item.patient?.DescribeYourProblem || "N/A"}}

</td>



<td>

{{item.status}}

</td>




<td>


<button

@click="
router.push(
`/doctor/write-prescription/${item.patient._id}/${item._id}`
)
"

>

Write Prescription

</button>



</td>


</tr>



</table>







<br><br>




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
v-for="item in otherAppointments"
:key="item._id"
>



<td>

{{item.doctor?.name || "N/A"}}

</td>



<td>

{{new Date(item.appointmentDateTime).toLocaleString()}}

</td>



<td>

{{item.status}}

</td>



<td>


<button
@click="viewPrescription(item)"
>
View Prescription
</button>


</td>



</tr>




</table>




</div>



</template>