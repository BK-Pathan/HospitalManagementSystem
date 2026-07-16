<script setup>

import {ref,onMounted} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();
const router = useRouter();


const doctor = ref(null);


const appointmentDateTime = ref("");



// Get Doctor Details

const getDoctor = async()=>{


try{


const res = await api.get(
`/patient/doctors/${route.params.doctorId}`
);

doctor.value=res.data;


}catch(error){

console.log(error);

}


}



// Book Appointment

const bookAppointment = async()=>{


console.log("BOOK BUTTON CLICKED");

console.log("Doctor ID:", route.params.doctorId);

console.log("Date:", appointmentDateTime.value);



try{


const res = await api.post("/patient/appointment",{


doctor:route.params.doctorId,


appointmentDateTime:appointmentDateTime.value


});


console.log(res.data);


alert("Appointment booked successfully");


}catch(error){


console.log(error.response?.data || error.message);


alert(
error.response?.data?.message ||
"Error booking appointment"
);


}


}




onMounted(()=>{


getDoctor();


});


</script>





<template>


<div>


<h2>
Book Appointment
</h2>




<div v-if="doctor">



<h3>
{{doctor.name}}
</h3>



<p>
Speciality:
{{doctor.specialties.join(", ")}}
</p>



<p>
Qualification:
{{doctor.qualifications}}
</p>



<p>
Experience:
{{doctor.experience}}
</p>




<h3>
Available Times
</h3>



<ul>


<li
v-for="item in doctor.availability"
:key="item.day"
>


{{item.day}}

:

{{item.startTime}}

-

{{item.endTime}}



</li>


</ul>




<h3>
Select Appointment Date & Time
</h3>



<input

type="datetime-local"

v-model="appointmentDateTime"

/>




<br><br>



<button
@click="bookAppointment"
>

Confirm Appointment

</button>




</div>



</div>



</template>