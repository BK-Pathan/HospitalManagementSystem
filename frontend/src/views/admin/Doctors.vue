<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const doctors = ref([]);


const name = ref("");
const specialties = ref("");
const qualifications = ref("");
const experience = ref("");
const contactInformation = ref("");


// Edit mode

const editMode = ref(false);
const doctorId = ref(null);


// Availability

const day = ref("");
const startTime = ref("");
const endTime = ref("");

const availability = ref([]);




// Convert 24 hour to 12 hour

const convertTo12Hour = (time)=>{


let [hour,minute] = time.split(":");


hour = parseInt(hour);


let ampm = hour >= 12 ? "PM" : "AM";


hour = hour % 12 || 12;


return `${hour.toString().padStart(2,"0")}:${minute} ${ampm}`;


}





// Get all doctors

const getDoctors = async()=>{

try{

const res = await api.get("/admin/doctors");

doctors.value = res.data;


}catch(error){

console.log("ERROR:",error.response?.data || error.message);

}

}





// Add Availability

const addAvailability = ()=>{


if(
!day.value ||
!startTime.value ||
!endTime.value
){

alert("Please fill availability");

return;

}



availability.value.push({

day:day.value,

startTime:convertTo12Hour(startTime.value),

endTime:convertTo12Hour(endTime.value)

});



day.value="";
startTime.value="";
endTime.value="";


}





// Remove Availability

const removeAvailability=(index)=>{

availability.value.splice(index,1);

}





// Save Doctor

const saveDoctor = async()=>{


try{


const data={


name:name.value,


specialties:
Array.isArray(specialties.value)
?
specialties.value
:
[specialties.value],



qualifications:qualifications.value,


experience:experience.value,


contactInformation:contactInformation.value,


availability:availability.value


};





if(editMode.value){


await api.put(

`/admin/doctor/${doctorId.value}`,

data

);


alert("Doctor Updated");


}else{


await api.post(

"/admin/doctor",

data

);


alert("Doctor Added");


}




clearForm();

getDoctors();



}catch(error){

console.log(error);

}


}





// Edit Doctor

const editDoctor=(doctor)=>{


editMode.value=true;


doctorId.value=doctor._id;



name.value=doctor.name;


specialties.value=doctor.specialties.join(",");


qualifications.value=doctor.qualifications;


experience.value=doctor.experience;


contactInformation.value=doctor.contactInformation;



availability.value = doctor.availability || [];


}





// Delete Doctor

const deleteDoctor=async(id)=>{


try{


await api.delete(

`/admin/doctor/${id}`

);


alert("Doctor Deleted");


getDoctors();



}catch(error){

console.log(error);

}


}





// Clear

const clearForm=()=>{


name.value="";

specialties.value="";

qualifications.value="";

experience.value="";

contactInformation.value="";


availability.value=[];


editMode.value=false;

doctorId.value=null;


}





onMounted(()=>{

getDoctors();

});


</script>



<template>


<div>


<h2>
Doctors Management
</h2>



<h3>
{{editMode ? "Update Doctor" : "Add Doctor"}}
</h3>



<input 
v-model="name"
placeholder="Doctor Name"
/>


<input 
v-model="specialties"
placeholder="Speciality"
/>


<input 
v-model="qualifications"
placeholder="Qualification"
/>


<input 
v-model="experience"
placeholder="Experience"
/>


<input 
v-model="contactInformation"
placeholder="Contact"
/>
<h4>
Doctor Availability
</h4>


<select v-model="day">

<option value="">
Select Day
</option>

<option>
Mon
</option>

<option>
Tue
</option>

<option>
Wed
</option>

<option>
Thu
</option>

<option>
Fri
</option>

<option>
Sat
</option>

<option>
Sun
</option>

</select>


<input
type="time"
v-model="startTime"
/>

<input
type="time"
v-model="endTime"
/>


<button @click="addAvailability">
Add Time
</button>



<ul>

<li
v-for="(item,index) in availability"
:key="index"
>

{{item.day}}

{{item.startTime}}

-

{{item.endTime}}


</li>

</ul>


<button @click="saveDoctor">

{{editMode ? "Update Doctor" : "Add Doctor"}}

</button>



<button 
v-if="editMode"
@click="clearForm"
>

Cancel

</button>




<hr>



<h3>
Doctor List
</h3>


<table border="1">


<tr>

<th>Name</th>
<th>Speciality</th>
<th>Qualification</th>
<th>Experience</th>
<th>Action</th>
<th>Availability</th>

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
{{doctor.qualifications}}
</td>


<td>
{{doctor.experience}}
</td>

<td>

<ul>

<li
v-for="(item,index) in doctor.availability"
:key="index"
>

{{item.day}}

{{item.startTime}}

-

{{item.endTime}}

</li>

</ul>

</td>

<td>


<button @click="editDoctor(doctor)">
Edit
</button>



<button @click="deleteDoctor(doctor._id)">
Delete
</button>


</td>


</tr>



</table>


</div>


</template>