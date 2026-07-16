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

<div>


<h2>
Doctor Dashboard
</h2>



<div class="cards">


<div>
<h3>
Patients
</h3>

<h1>
{{stats.patients}}
</h1>

</div>


<div>
<h3>
Pending
</h3>

<h1>
{{stats.pending}}
</h1>

</div>


<div>
<h3>
Confirmed
</h3>

<h1>
{{stats.confirmed}}
</h1>

</div>


<div>
<h3>
Completed
</h3>

<h1>
{{stats.completed}}
</h1>

</div>

<h2>
Recent Appointments
</h2>


<table border="1">

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
{{item.status}}
</td>


</tr>


</table>
</div>



</div>

</template>