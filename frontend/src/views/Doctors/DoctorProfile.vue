<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const name=ref("");
const specialties=ref("");
const qualifications=ref("");
const experience=ref("");
const contactInformation=ref("");


const availability=ref([]);



const day=ref("");
const startTime=ref("");
const endTime=ref("");



const addAvailability=()=>{


availability.value.push({

day:day.value,
startTime:startTime.value,
endTime:endTime.value

});


};



const saveProfile=async()=>{


try{


await api.post("/doctor/profile",{

name:name.value,

specialties:[
specialties.value
],

qualifications:qualifications.value,

experience:experience.value,

contactInformation:contactInformation.value,

availability:availability.value


});


alert("Profile Saved");


}catch(error){

console.log(error);

}


};




const getProfile=async()=>{


const res=await api.get("/doctor/profile");


if(res.data){


name.value=res.data.name;

specialties.value=res.data.specialties.join(",");

qualifications.value=res.data.qualifications;

experience.value=res.data.experience;

contactInformation.value=res.data.contactInformation;

availability.value=res.data.availability;


}


}



onMounted(()=>{

getProfile();

});


</script>



<template>

<div>


<h2>
Doctor Dashboard
</h2>


<h3>
Profile
</h3>


<input v-model="name" placeholder="Name">


<input v-model="specialties" placeholder="Speciality">


<input v-model="qualifications" placeholder="Qualification">


<input v-model="experience" placeholder="Experience">


<input v-model="contactInformation" placeholder="Contact">



<h3>
Availability
</h3>


<input v-model="day" placeholder="Day">


<input v-model="startTime" placeholder="Start Time">


<input v-model="endTime" placeholder="End Time">


<button @click="addAvailability">
Add Time
</button>



<ul>

<li
v-for="item in availability"
>

{{item.day}}
{{item.startTime}}
-
{{item.endTime}}

</li>

</ul>



<button @click="saveProfile">
Save Profile
</button>



</div>


</template>