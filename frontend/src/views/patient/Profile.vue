<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";


const age = ref("");
const gender = ref("");
const contactInformation = ref("");
const medicalHistory = ref("");
const insuranceDetails = ref("");
const DescribeYourProblem = ref("");

const isEdit = ref(false);



const saveProfile = async()=>{

try{


await api.post("/patient/profile",{

age:age.value,
gender:gender.value,
contactInformation:contactInformation.value,
medicalHistory:medicalHistory.value,
insuranceDetails:insuranceDetails.value,
DescribeYourProblem:DescribeYourProblem.value

});


alert("Profile Updated");


isEdit.value=false;


}catch(error){

console.log(error);

}

}




const getProfile = async()=>{


try{


const res = await api.get("/patient/profile");


if(res.data){

age.value = res.data.age || "";
gender.value = res.data.gender || "";
contactInformation.value = res.data.contactInformation || "";
medicalHistory.value = res.data.medicalHistory || "";
insuranceDetails.value = res.data.insuranceDetails || "";
DescribeYourProblem.value = res.data.DescribeYourProblem || "";

}


}catch(error){

console.log(error);

}


}




onMounted(()=>{

getProfile();

});


</script>




<template>

<div>


<h2>
My Profile
</h2>



<input
placeholder="Age"
v-model="age"
:disabled="!isEdit"
/>


<br><br>



<input
placeholder="Gender"
v-model="gender"
:disabled="!isEdit"
/>


<br><br>



<input
placeholder="Contact"
v-model="contactInformation"
:disabled="!isEdit"
/>


<br><br>



<input
placeholder="Describe your problem"
v-model="DescribeYourProblem"
:disabled="!isEdit"
/>


<br><br>



<textarea
placeholder="Medical History"
v-model="medicalHistory"
:disabled="!isEdit">
</textarea>


<br><br>



<textarea
placeholder="Insurance Details"
v-model="insuranceDetails"
:disabled="!isEdit">
</textarea>


<br><br>




<button 
v-if="!isEdit"
@click="isEdit=true">

Edit Profile

</button>



<button 
v-if="isEdit"
@click="saveProfile">

Update Profile

</button>



</div>

</template>