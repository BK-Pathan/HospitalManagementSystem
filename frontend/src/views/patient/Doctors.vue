<script setup>

import {ref,onMounted} from "vue";
import {useRouter} from "vue-router";
import api from "../../api/axios";


const doctors=ref([]);

const router=useRouter();



const getDoctors=async()=>{


try{


const res=await api.get(
"/doctor/available"
);


doctors.value=res.data;


}catch(error){

console.log(error);

}


}



onMounted(()=>{

getDoctors();

});


</script>



<template>


<div>


<h2>
Available Doctors
</h2>



<table border="1">


<tr>

<th>Name</th>
<th>Speciality</th>
<th>Qualification</th>
<th>Experience</th>
<th>Availability</th>
<th>Action</th>


</tr>



<tr
v-for="doctor in doctors"
:key="doctor._id"
>



<td>

{{doctor.name}}

</td>



<td>

{{doctor.specialties.join(",")}}

</td>



<td>

{{doctor.qualifications}}

</td>



<td>

{{doctor.experience}}

</td>



<td>


<div
v-for="item in doctor.availability"
:key="item._id"
>


{{item.day}}

<br>

{{item.startTime}} -
{{item.endTime}}


</div>


</td>



<td>


<button
@click="router.push(`/patient/book-appointment/${doctor._id}`)"
>
Book Appointment
</button>


</td>



</tr>



</table>


</div>


</template>