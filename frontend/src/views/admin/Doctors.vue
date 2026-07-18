<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";


// ======================
// States
// ======================

const doctors = ref([]);

const name = ref("");
const specialties = ref("");
const qualifications = ref("");
const experience = ref("");
const contactInformation = ref("");

const search = ref("");


// Pagination

const page = ref(1);
const totalPages = ref(1);


// Edit

const editMode = ref(false);
const doctorId = ref(null);


// Availability

const day = ref("");
const startTime = ref("");
const endTime = ref("");

const availability = ref([]);




// ======================
// Convert Time
// ======================

const convertTo12Hour = (time)=>{

    let [hour, minute] = time.split(":");

    hour = parseInt(hour);

    let ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;


    return `${hour.toString().padStart(2,"0")}:${minute} ${ampm}`;

};




// ======================
// Get Doctors
// ======================

const getDoctors = async()=>{

try{


const res = await api.get("/admin/doctors",{

params:{
page:page.value,
search:search.value
}

});


doctors.value = res.data.doctors;

totalPages.value = res.data.totalPages;



}catch(error){

console.log(
error.response?.data || error.message
);

}

};




// ======================
// Search
// ======================

const searchDoctors = ()=>{

page.value = 1;

getDoctors();

};




// ======================
// Add Availability
// ======================

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


};




// ======================
// Remove Availability
// ======================

const removeAvailability=(index)=>{

availability.value.splice(index,1);

};




// ======================
// Save Doctor
// ======================

const saveDoctor = async()=>{


try{


const data={


name:name.value,


specialties:
Array.isArray(specialties.value)
?
specialties.value
:
specialties.value.split(","),



qualifications:qualifications.value,


experience:Number(experience.value),


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

console.log(
error.response?.data || error.message
);

}


};




// ======================
// Edit Doctor
// ======================

const editDoctor=(doctor)=>{


editMode.value=true;


doctorId.value=doctor._id;


name.value=doctor.name;


specialties.value =
doctor.specialties.join(",");


qualifications.value =
doctor.qualifications;


experience.value =
doctor.experience;


contactInformation.value =
doctor.contactInformation;


availability.value =
doctor.availability || [];



};




// ======================
// Delete Doctor
// ======================

const deleteDoctor = async(id)=>{


try{


await api.delete(

`/admin/doctor/${id}`

);


alert("Doctor Deleted");


getDoctors();



}catch(error){

console.log(
error.response?.data || error.message
);

}


};




// ======================
// Clear Form
// ======================

const clearForm=()=>{


name.value="";

specialties.value="";

qualifications.value="";

experience.value="";

contactInformation.value="";


availability.value=[];


editMode.value=false;

doctorId.value=null;


};




// ======================
// Pagination
// ======================

const nextPage=()=>{

if(page.value < totalPages.value){

page.value++;

getDoctors();

}

};



const previousPage=()=>{

if(page.value > 1){

page.value--;

getDoctors();

}

};




// ======================
// Mounted
// ======================

onMounted(()=>{

getDoctors();

});


</script>



<template>

<div class="page">


    <div class="header">

        <div>
            <h2>
                👨‍⚕️ Doctors Management
            </h2>

            <p>
                Manage doctors profiles, qualifications and availability
            </p>
        </div>


        <div class="badge">
            Hospital Admin
        </div>

    </div>

<input
v-model="search"
placeholder="Search Doctor..."
@input="searchDoctors"
/>


    <div class="doctor-form card">


        <h3>
            {{editMode ? "Update Doctor" : "Add Doctor"}}
        </h3>



        <div class="form-grid">


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


        </div>




        <h4>
            Doctor Availability
        </h4>



        <div class="availability-box">


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



            <button 
            class="primary-btn"
            @click="addAvailability"
            >

                Add Time

            </button>


        </div>





        <div class="availability-list">


            <span
            v-for="(item,index) in availability"
            :key="index"
            >

                {{item.day}}
                {{item.startTime}}
                -
                {{item.endTime}}

            </span>


        </div>





        <button 
        class="save-btn"
        @click="saveDoctor"
        >

            {{editMode ? "Update Doctor" : "Add Doctor"}}

        </button>




        <button 
        v-if="editMode"
        class="cancel-btn"
        @click="clearForm"
        >

            Cancel

        </button>



    </div>







    <div class="card table-card">


        <h3>
            Doctor List
        </h3>



        <div class="table-wrapper">


        <table>


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
        {{doctor.specialties}}
        </td>


        <td>
        {{doctor.qualifications}}
        </td>


        <td>
        {{doctor.experience}}
        </td>




        <td>


        <div class="times">


        <span
        v-for="(item,index) in doctor.availability"
        :key="index"
        >

        {{item.day}}

        {{item.startTime}}

        -

        {{item.endTime}}

        </span>


        </div>


        </td>




        <td>


        <button 
        class="edit"
        @click="editDoctor(doctor)"
        >

            Edit

        </button>



        <button 
        class="delete"
        @click="deleteDoctor(doctor._id)"
        >

            Delete

        </button>


        </td>


        </tr>



        </table>
<button 
@click="previousPage"
:disabled="page===1"
>
Previous
</button>


<span>
{{page}} / {{totalPages}}
</span>


<button
@click="nextPage"
:disabled="page===totalPages"
>
Next
</button>
        </div>



    </div>


</div>

</template>

<style scoped>


.page{

    min-height:100%;

}



.header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:30px;

}



.header h2{

    color:var(--text);

    font-size:30px;

}



.header p{

    color:var(--muted);

    margin-top:8px;

}



.badge{

    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    color:white;

    padding:12px 20px;

    border-radius:30px;

    font-weight:600;

}





.card{

    background:var(--white);

    border-radius:20px;

    padding:30px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

    margin-bottom:30px;

}



.card h3{

    color:var(--text);

    margin-bottom:25px;

}





.form-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:20px;

}



input,
select{


    padding:14px;

    border-radius:12px;

    border:1px solid var(--border);

    outline:none;

    font-size:15px;

    background:#fff;

}



input:focus,
select:focus{

    border-color:var(--secondary);

    box-shadow:0 0 0 4px rgba(20,184,166,.15);

}





.availability-box{

    display:flex;

    gap:15px;

    margin-top:15px;

}





button{

    border:none;

    cursor:pointer;

    border-radius:10px;

    padding:12px 18px;

    font-weight:600;

}



.primary-btn,
.save-btn{

    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    color:white;

}



.save-btn{

    margin-top:25px;

    width:220px;

}



.cancel-btn{

    background:#e2e8f0;

    margin-left:10px;

}





.availability-list{

    display:flex;

    gap:10px;

    flex-wrap:wrap;

    margin-top:20px;

}



.availability-list span,
.times span{

    background:rgba(20,184,166,.15);

    color:var(--primary);

    padding:8px 12px;

    border-radius:20px;

    font-size:13px;

}





.table-wrapper{

    overflow-x:auto;

}



table{

    width:100%;

    border-collapse:collapse;

}



th{

    background:var(--primary);

    color:white;

    padding:15px;

    text-align:left;

}



td{

    padding:15px;

    border-bottom:1px solid var(--border);

    color:var(--text);

}



tr:hover{

    background:#f8fafc;

}





.edit{

    background:#dbeafe;

    color:#1d4ed8;

    margin-right:8px;

}



.delete{

    background:#fee2e2;

    color:#dc2626;

}





.times{

    display:flex;

    flex-direction:column;

    gap:5px;

}





@media(max-width:800px){


.form-grid{

    grid-template-columns:1fr;

}


.header{

    flex-direction:column;

    align-items:flex-start;

    gap:15px;

}


.availability-box{

    flex-direction:column;

}


}



</style>