<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const appointments=ref([]);



const getAppointments=async()=>{


const res=await api.get(
"/doctor/appointments"
);


appointments.value=res.data;


}



const updateStatus=async(id,status)=>{


await api.put(
`/doctor/appointment/${id}`,
{
status
}
);


getAppointments();


}



onMounted(()=>{

getAppointments();

});


</script>



<template>


<h2>
My Patients Appointments
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
v-for="item in appointments"
:key="item._id"
>


<td>
{{item.patient.name}}
</td>


<td>
{{item.patient.email}}
</td>


<td>
{{item.appointmentDateTime}}
</td>


<td>
{{item.status}}
</td>


<td>


<button
@click="updateStatus(item._id,'confirmed')"
>
Confirm
</button>


<button
@click="updateStatus(item._id,'completed')"
>
Complete
</button>


</td>


</tr>


</table>


</template>