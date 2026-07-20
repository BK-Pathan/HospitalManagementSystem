<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";
import { useRouter } from "vue-router";


const appointments = ref([]);
const loading = ref(false);

const cancelReason = ref("");
const selectedAppointment = ref(null);

const router = useRouter();

const getAppointments = async () => {

  try {

    loading.value = true;

    const res = await api.get("/doctor/appointments");

    console.log("Appointments:", res.data);

    appointments.value = res.data;


  } catch (error) {

    console.error(error);

    appointments.value = [];

  } finally {

    loading.value = false;

  }

};



// Confirm / Complete

const updateStatus = async (id,status)=>{

try{


await api.put(
`/doctor/appointment/${id}`,
{
status
}
);


await getAppointments();



}catch(error){

console.log(error);

alert("Unable to update status");

}


};



// Cancel Appointment

const cancelAppointment = async()=>{


try{


await api.put(
`/doctor/appointment/${selectedAppointment.value}`,
{
status:"cancelled",
cancelReason:cancelReason.value
}
);



alert("Appointment cancelled successfully");



cancelReason.value="";

selectedAppointment.value=null;


await getAppointments();



}catch(error){


console.log(
error.response?.data || error.message
);


alert("Cancel failed");


}


};

const viewHistory=(patient)=>{


console.log("PATIENT OBJECT:",patient);


router.push(
`/doctor/patient-history/${patient._id}`
);


};

onMounted(()=>{

getAppointments();

});

</script>


<template>

<div class="appointments-page">


<h2 class="page-title">
My Patient Appointments
</h2>



<p v-if="loading" class="loading-text">
Loading...
</p>




<div v-else class="table-card">


<table class="appointments-table">


<thead>

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


</thead>




<tbody>


<tr
v-if="appointments.length===0"
>

<td colspan="5" class="empty-data">

No appointments found

</td>

</tr>





<tr
v-for="item in appointments"
:key="item._id"
>


<td class="patient-name">

{{item.patient?.user?.name || item.patient?.name || "Unknown"}}

</td>



<td>

{{item.patient?.user?.email || item.patient?.email || "N/A"}}

</td>



<td>

{{
new Date(item.appointmentDateTime)
.toLocaleString()
}}

</td>



<td>

<span class="status">

{{item.status}}

</span>


</td>




<td class="action-buttons">



<button
class="confirm-btn"
@click="updateStatus(item._id,'confirmed')"
>

Confirm

</button>




<button
class="complete-btn"
@click="updateStatus(item._id,'completed')"
>

Complete

</button>





<button
class="cancel-btn"
@click="selectedAppointment=item._id"
>

Cancel

</button>

<button
@click="viewHistory(item.patient)"
>
History
</button>

</td>


</tr>


</tbody>


</table>


</div>





<!-- Cancel Popup -->


<div
v-if="selectedAppointment"
class="cancel-box"
>


<h3>
Cancel Appointment
</h3>



<textarea

v-model="cancelReason"

placeholder="Enter cancellation reason"

></textarea>




<div>


<button
class="confirm-cancel"
@click="cancelAppointment"
>

Confirm Cancel

</button>




<button
class="close-btn"
@click="selectedAppointment=null"
>

Close

</button>


</div>


</div>



</div>


</template>



<style scoped>


.appointments-page{

min-height:100%;

}



.page-title{

color:var(--text);

font-size:32px;

margin-bottom:30px;

}




.loading-text{

color:var(--muted);

font-size:18px;

}



.table-card{

background:var(--white);

padding:30px;

border-radius:22px;

box-shadow:var(--shadow);

border:1px solid var(--border);

overflow-x:auto;

}




.appointments-table{

width:100%;

border-collapse:collapse;

}



.appointments-table th{

padding:16px;

text-align:left;

color:white;

background:

linear-gradient(
135deg,
var(--primary),
var(--primary-dark)
);

}



.appointments-table td{

padding:16px;

color:var(--text);

border-bottom:1px solid var(--border);

}



.appointments-table tr:hover{

background:#f8fafc;

}




.patient-name{

font-weight:700;

color:var(--primary);

}



.status{

padding:8px 15px;

border-radius:20px;

background:rgba(20,184,166,.15);

color:var(--primary);

font-size:13px;

font-weight:700;

text-transform:capitalize;

}



.action-buttons{

display:flex;

gap:8px;

}



button{

border:none;

padding:10px 14px;

border-radius:10px;

cursor:pointer;

color:white;

font-weight:700;

}



.confirm-btn{

background:#16a34a;

}



.complete-btn{

background:#2563eb;

}



.cancel-btn{

background:#dc2626;

}



button:hover{

transform:translateY(-2px);

}





/* Cancel Modal */


.cancel-box{

margin-top:30px;

background:#fff1f2;

padding:25px;

border-radius:18px;

border:1px solid #fecaca;

}



.cancel-box h3{

color:#dc2626;

margin-bottom:15px;

}



.cancel-box textarea{

width:100%;

height:100px;

padding:15px;

border-radius:10px;

border:1px solid var(--border);

resize:none;

margin-bottom:15px;

}



.confirm-cancel{

background:#dc2626;

margin-right:10px;

}



.close-btn{

background:#64748b;

}



.empty-data{

text-align:center;

padding:30px;

color:var(--muted);

}


</style>