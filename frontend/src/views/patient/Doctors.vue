<script setup>

import {ref,onMounted} from "vue";
import {useRouter} from "vue-router";
import api from "../../api/axios";


const doctors = ref([]);

const router = useRouter();



const getDoctors = async()=>{


try{


const res = await api.get("/admin/doctors");


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

{{doctor.specialties}}

</td>


<td>


<button

@click="router.push(
`/patient/book/${doctor._id}`
)"

>

Book

</button>


</td>


</tr>


</table>


</div>


</template>