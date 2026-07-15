<script setup>

import {ref} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";


const route = useRoute();

const router = useRouter();


const appointmentDateTime = ref("");



const book = async()=>{


try{


await api.post(
"/patient/appointment",
{


doctor:route.params.doctorId,

appointmentDateTime:
appointmentDateTime.value


}
);



alert("Appointment booked");


router.push(
"/patient/appointments"
);



}catch(error){

console.log(error);

}


}



</script>




<template>


<div>


<h2>
Book Appointment
</h2>



<input

type="datetime-local"

v-model="appointmentDateTime"

/>



<br>


<button @click="book">

Confirm Appointment

</button>


</div>


</template>