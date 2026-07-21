<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";


const requests = ref([]);

const history = ref([]);

const loading = ref(false);

const processing = ref(false);



// =======================
// Formatter
// =======================

const formatDateTime = (date)=>{

if(!date)
return "N/A";


return new Date(date).toLocaleString(
"en-US",
{
year:"numeric",
month:"short",
day:"numeric",
hour:"2-digit",
minute:"2-digit",
hour12:true
}
);

};





// =======================
// Get Pending Requests
// =======================

const getRequests = async()=>{

try{


const {data}=await api.get(

"/appointments/doctor/reschedule-requests"

);



requests.value=data;



}
catch(error){


console.log(error);


requests.value=[];


}


};






// =======================
// Get History
// =======================

const getHistory = async()=>{

try{


const {data}=await api.get(

"/appointments/doctor/reschedule-history"

);



history.value=data;



}
catch(error){


console.log(error);


history.value=[];


}



};






// =======================
// Approve
// =======================

const approveRequest = async(id)=>{


if(processing.value)
return;



processing.value=true;


try{


await api.put(

`/appointments/${id}/approve-reschedule`

);



alert(
"Appointment approved"
);



await getRequests();

await getHistory();



}
catch(error){


alert(

error.response?.data?.message ||
"Approve failed"

);


}
finally{

processing.value=false;

}


};







// =======================
// Reject
// =======================

const rejectRequest = async(id)=>{


if(processing.value)
return;


processing.value=true;



try{


await api.put(

`/appointments/${id}/reject-reschedule`

);



alert(
"Request rejected"
);



await getRequests();

await getHistory();



}
catch(error){


alert(

error.response?.data?.message ||
"Reject failed"

);


}
finally{

processing.value=false;

}


};






onMounted(()=>{


getRequests();

getHistory();


});



</script>





<template>


<div class="container">


<h1>
🔄 Reschedule Requests
</h1>



<!-- ================= -->
<!-- Pending Requests -->
<!-- ================= -->


<div class="section">


<h2>
Pending Requests
</h2>



<div
v-if="requests.length===0"
class="empty"
>

No Pending Requests

</div>



<div
v-for="item in requests"
:key="item._id"
class="card"
>



<h3>

Patient:
{{item.patient?.user?.name || "Unknown"}}

</h3>




<p>

<b>Current:</b>

<br>

{{formatDateTime(item.appointmentDateTime)}}

</p>




<p>

<b>Requested:</b>

<br>

{{formatDateTime(item.rescheduledDateTime)}}

</p>




<p>

<b>Status:</b>

<span class="pending">
Pending
</span>

</p>




<div class="buttons">


<button

class="approve"

@click="approveRequest(item._id)"

:disabled="processing"

>

Accept

</button>



<button

class="reject"

@click="rejectRequest(item._id)"

:disabled="processing"

>

Reject

</button>



</div>



</div>


</div>









<!-- ================= -->
<!-- History -->
<!-- ================= -->


<div class="section">


<h2>

Reschedule History

</h2>



<div

v-if="history.length===0"

class="empty"

>

No History

</div>




<div

v-for="item in history"

:key="item._id"

class="card"

>


<h3>

Patient:
{{item.patient?.user?.name || "Unknown"}}

</h3>



<div

v-for="(h,index) in item.rescheduleHistory"

:key="index"

class="history-box"

>


<p>

<b>Old Date:</b>

<br>

{{formatDateTime(h.oldDateTime)}}

</p>



<p>

<b>New Date:</b>

<br>

{{formatDateTime(h.newDateTime)}}

</p>



<p>

<b>Status:</b>


<span
:class="h.status"
>

{{h.status}}

</span>


</p>


<p v-if="h.doctorReply">

<b>Reply:</b>

{{h.doctorReply}}

</p>



</div>



</div>



</div>





</div>


</template>





<style scoped>


.container{

padding:30px;

}



h1{

font-size:32px;

margin-bottom:30px;

}



.section{

margin-bottom:40px;

}



.section h2{

margin-bottom:20px;

}



.card{

background:white;

padding:25px;

border-radius:20px;

margin-bottom:20px;

box-shadow:0 10px 25px rgba(0,0,0,.08);

}



.history-box{

background:#f8fafc;

padding:15px;

border-radius:12px;

margin-top:15px;

}



.buttons{

display:flex;

gap:15px;

margin-top:20px;

}



button{

padding:10px 25px;

border:none;

border-radius:10px;

cursor:pointer;

}



.approve{

background:#16a34a;

color:white;

}



.reject{

background:#dc2626;

color:white;

}



.pending{

color:#f59e0b;

font-weight:bold;

}



.approved{

color:#16a34a;

font-weight:bold;

}



.rejected{

color:#dc2626;

font-weight:bold;

}



.empty{

padding:30px;

text-align:center;

color:#777;

font-size:18px;

}



</style>