<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";


const patients = ref([]);
const doctors = ref([]);
const rooms = ref([]);
const beds = ref([]);
const admissions = ref([]);



const admission = ref({

patient:"",
doctor:"",
room:"",
bed:"",
reason:""

});




// ===============================
// Get Patients
// ===============================

const getPatients = async()=>{

try{

const token = localStorage.getItem("token");


const res = await api.get(
"/admin/patients",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);



patients.value = res.data;


console.log("Patients:",patients.value);


}
catch(error){

console.log(error.response?.data);

}

};




// ===============================
// Get Doctors
// ===============================

const getDoctors = async()=>{

try{

const token = localStorage.getItem("token");


const res = await api.get(
"/admin/doctors",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);



doctors.value = res.data.doctors || res.data;


}
catch(error){

console.log(error.response?.data);

}

};




// ===============================
// Get Rooms
// ===============================

const getRooms = async()=>{

try{


const res = await api.get(
"/api/rooms"
);



rooms.value=res.data;


}
catch(error){

console.log(error);

}

};




// ===============================
// Get Available Beds
// ===============================

const getBeds = async()=>{

try{


const res = await api.get(
"/api/beds/available"
);


beds.value=res.data;


}
catch(error){

console.log(error);

}

};





// ===============================
// Get Admissions
// ===============================

const getAdmissions = async()=>{

try{


const res = await api.get(
"/api/admissions"
);


admissions.value=res.data;


}
catch(error){

console.log(error);

}

};





// ===============================
// Admit Patient
// ===============================

const admitPatient = async()=>{


try{


const res = await api.post(
"/api/admissions",
admission.value
);



alert(
res.data.message
);



admission.value={

patient:"",
doctor:"",
room:"",
bed:"",
reason:""

};



getBeds();

getAdmissions();


}
catch(error){

console.log(error);


alert(
error.response?.data?.message ||
"Admission failed"
);


}


};





// ===============================
// Discharge Patient
// ===============================


const dischargePatient = async(id)=>{


try{


const res = await api.put(
`/api/admissions/discharge/${id}`
);



alert(
res.data.message
);



getBeds();

getAdmissions();


}
catch(error){

console.log(error);

}

};






onMounted(()=>{

getPatients();

getDoctors();

getRooms();

getBeds();

getAdmissions();

});


</script>





<template>


<div class="container">


<h2>
🏥 Patient Admission
</h2>



<div class="form">



<select v-model="admission.patient">


<option value="">
Select Patient
</option>


<option

v-for="p in patients"

:key="p._id"

:value="p._id"

>

{{p.user?.name || p.name}}

</option>


</select>





<select v-model="admission.doctor">


<option value="">
Select Doctor
</option>


<option

v-for="d in doctors"

:key="d._id"

:value="d._id"

>

{{d.name || d.user?.name}}

</option>


</select>





<select v-model="admission.room">


<option value="">
Select Room
</option>


<option

v-for="r in rooms"

:key="r._id"

:value="r._id"

>

Room {{r.roomNumber}}
-
{{r.type}}

</option>


</select>





<select v-model="admission.bed">


<option value="">
Select Bed
</option>


<option

v-for="b in beds"

:key="b._id"

:value="b._id"

>

{{b.bedNumber}}
-
Room {{b.room?.roomNumber}}

</option>


</select>





<textarea

v-model="admission.reason"

placeholder="Admission Reason"

></textarea>





<button @click="admitPatient">

Admit Patient

</button>


</div>





<hr>



<h2>
Current Admissions
</h2>



<table>


<thead>

<tr>

<th>Patient</th>
<th>Doctor</th>
<th>Room</th>
<th>Bed</th>
<th>Status</th>
<th>Action</th>

</tr>

</thead>



<tbody>


<tr
v-for="a in admissions"
:key="a._id"
>


<td>
{{a.patient?.user?.name || a.patient?.name}}
</td>


<td>
{{a.doctor?.user?.name || a.doctor?.name}}
</td>


<td>
{{a.room?.roomNumber}}
</td>


<td>
{{a.bed?.bedNumber}}
</td>


<td>
{{a.status}}
</td>


<td>

<button

v-if="a.status==='admitted'"

@click="dischargePatient(a._id)"

>

Discharge

</button>


</td>


</tr>


</tbody>


</table>



</div>


</template>