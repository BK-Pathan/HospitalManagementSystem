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



// Get all doctors

const getDoctors = async()=>{

    try{

        const res = await api.get("/admin/doctors");

        doctors.value = res.data;

    }catch(error){

        console.log(error);

    }

}



// Add / Update Doctor

const saveDoctor = async()=>{


try{


if(editMode.value){


    await api.put(`/admin/doctor/${doctorId.value}`,{

        name:name.value,
        specialties:specialties.value,
        qualifications:qualifications.value,
        experience:experience.value,
        contactInformation:contactInformation.value

    });


    alert("Doctor Updated");


}
else{


    await api.post("/admin/doctor",{

        name:name.value,
        specialties:specialties.value,
        qualifications:qualifications.value,
        experience:experience.value,
        contactInformation:contactInformation.value

    });


    alert("Doctor Added");


}



clearForm();

getDoctors();



}catch(error){

    console.log(error);

}


}




// Edit Doctor

const editDoctor = (doctor)=>{


    editMode.value=true;

    doctorId.value=doctor._id;


    name.value=doctor.name;
    specialties.value=doctor.specialties;
    qualifications.value=doctor.qualifications;
    experience.value=doctor.experience;
    contactInformation.value=doctor.contactInformation;


}



// Delete Doctor

const deleteDoctor = async(id)=>{


    try{


        await api.delete(`/admin/doctor/${id}`);


        alert("Doctor Deleted");


        getDoctors();


    }catch(error){

        console.log(error);

    }

}



// Clear Form

const clearForm=()=>{


name.value="";
specialties.value="";
qualifications.value="";
experience.value="";
contactInformation.value="";


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