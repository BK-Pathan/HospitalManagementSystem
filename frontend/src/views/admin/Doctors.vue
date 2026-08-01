<script setup>

import { ref, onMounted, reactive } from "vue";
import api from "../../api/axios";


// ======================
// States
// ======================

const doctors = ref([]);
const profileImage = ref("");
const name = ref("");
const department = ref("");
const specialties = ref("");
const qualifications = ref("");
const experience = ref("");
const contactInformation = ref("");
const email = ref("");
const password = ref("");
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


// UI-only: mobile card expand/collapse state (no backend impact)
const openCards = reactive({});

const toggleCard = (id) => {
    openCards[id] = !openCards[id];
};




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
console.log(res.data.doctors);

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
window.notify("Please fill availability");

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

department:department.value,


specialties:

Array.isArray(specialties.value)

?

specialties.value

:

specialties.value.split(",")
.map(item=>item.trim()),


qualifications:qualifications.value,


experience:Number(experience.value),


contactInformation:contactInformation.value,


availability:availability.value

};



// ADD DOCTOR
if(!editMode.value){

data.email=email.value;

data.password=password.value;

}



// UPDATE DOCTOR
else{


// agar admin password change karna chahta hai
if(password.value.trim()){

data.password=password.value;

}


}



if(editMode.value){


await api.put(

`/admin/doctor/${doctorId.value}`,

data

);


window.notify("Doctor Updated");


}

else{


await api.post(

"/admin/doctor",

data

);


window.notify("Doctor Added");


}



clearForm();

getDoctors();



}

catch(error){

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



name.value = doctor.name || "";


department.value = doctor.department || "";

profileImage.value = doctor.profileImage || "";

specialties.value =
doctor.specialties?.join(", ") || "";


qualifications.value =
doctor.qualifications || "";


experience.value =
doctor.experience || "";


contactInformation.value =
doctor.contactInformation || "";



email.value =
doctor.user?.email || "";



// password empty because old password show nahi karna
password.value="";



availability.value =
doctor.availability || [];



scrollToForm();


};

// ======================
// Delete Doctor
// ======================

const deleteDoctor = async(id)=>{

try{

await api.delete(

`/admin/doctor/${id}`

);

window.notify("Doctor Deleted");

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

department.value="";

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
const scrollToForm = ()=>{

    document
    .querySelector(".doctor-form")
    ?.scrollIntoView({
        behavior:"smooth"
    });

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
            <span class="eyebrow">Hospital Admin</span>
            <h2>👨‍⚕️ Doctors Management</h2>
            <p>Manage doctors profiles, qualifications and availability</p>
        </div>


      <div class="header-actions">

    <div class="badge">
        {{ doctors.length }} on this page
    </div>


    <button 
    class="scroll-form-btn"
    @click="scrollToForm"
    >
        Add Doctor ↓
    </button>

</div>

        

    </div>


    <div class="search-bar">

        <span class="search-icon">🔍</span>

        <input
        v-model="search"
        placeholder="Search doctor by name, department or speciality..."
        @input="searchDoctors"
        />

    </div>





<div class="card table-card">

    <div class="form-head">
        <h3>Doctor List</h3>
    </div>

    <div class="doctor-grid">

        <div 
        class="doctor-card"
        :class="{ expanded: openCards[doctor._id] }"
        v-for="doctor in doctors"
        :key="doctor._id"
        >

            <div class="doctor-top">

<div class="doctor-avatar">

    <img
    v-if="doctor.profileImage"
    :src="doctor.profileImage"
    :alt="doctor.name"
    />

    <span v-else>
        {{ doctor.name?.charAt(0) }}
    </span>

</div>

                <div class="doctor-heading">
                    <h4>{{doctor.name}}</h4>
                    <p>{{doctor.department}}</p>
                </div>

                <button
                class="card-expand-btn"
                @click="toggleCard(doctor._id)"
                :aria-expanded="!!openCards[doctor._id]"
                >
                    <span class="chevron">›</span>
                </button>

            </div>


            <div class="doctor-info">

                <div>
                    <span>Email</span>
                    <strong>{{doctor.user?.email}}</strong>
                </div>

            </div>


            <div class="doctor-collapsible">


                <div class="doctor-info doctor-info--sub">

                    <div>
                        <span>Speciality</span>
                        <strong>
                            {{doctor.specialties?.join(", ")}}
                        </strong>
                    </div>


                    <div>
                        <span>Qualification</span>
                        <strong>
                            {{doctor.qualifications}}
                        </strong>
                    </div>


                    <div>
                        <span>Experience</span>
                        <strong>
                            {{doctor.experience}} Years
                        </strong>
                    </div>

                </div>



                <div class="availability-card">

                    <span class="label">
                        Availability
                    </span>


                    <div 
                    class="slot"
                    v-for="(item,index) in doctor.availability"
                    :key="index"
                    >

                        <span>{{item.day}}</span>

                        <small>
                            {{item.startTime}} - {{item.endTime}}
                        </small>

                    </div>


                    <p v-if="!doctor.availability?.length">
                        No slots available
                    </p>


                </div>



                <div class="doctor-actions">

                    <button 
                    class="edit"
                    @click="editDoctor(doctor)"
                    >
                        ✏ Edit
                    </button>


                    <button 
                    class="delete"
                    @click="deleteDoctor(doctor._id)"
                    >
                        🗑 Delete
                    </button>

                </div>


            </div>


        </div>



        <p 
        v-if="!doctors.length"
        class="empty-hint table-empty"
        >
            No doctors found.
        </p>


    </div>



    <div class="pagination">

        <button 
        @click="previousPage" 
        :disabled="page===1"
        >
            ← Previous
        </button>


        <span class="page-info">
            Page {{page}} of {{totalPages}}
        </span>


        <button 
        @click="nextPage" 
        :disabled="page===totalPages"
        >
            Next →
        </button>

    </div>


</div>

    <div class="doctor-form card">

        <div class="form-head">
            <h3>{{editMode ? "Update Doctor" : "Add New Doctor"}}</h3>
            <span v-if="editMode" class="edit-pill">Editing existing profile</span>
        </div>


        <div class="field-group">

            <span class="group-label">Basic Information</span>

            <div class="form-grid">

                <label class="field">
                    <span>Doctor Name</span>
                    <input v-model="name" placeholder="e.g. Dr. Ayesha Khan" />
                </label>

                <label class="field">
                    <span>Department</span>
                    <input v-model="department" placeholder="e.g. Cardiology" />
                </label>

                <label class="field">
                    <span>Speciality</span>
                    <input v-model="specialties" placeholder="Comma separated e.g. Heart, ECG" />
                </label>

                <label class="field">
                    <span>Qualification</span>
                    <input v-model="qualifications" placeholder="e.g. MBBS, FCPS" />
                </label>

                <label class="field">
                    <span>Experience (years)</span>
                    <input v-model="experience" placeholder="e.g. 5" />
                </label>

                <label class="field">
                    <span>Contact</span>
                    <input v-model="contactInformation" placeholder="Phone number" />
                </label>

            </div>

        </div>


        <div class="field-group">

            <span class="group-label">Login Credentials</span>

            <div class="form-grid">

                <label class="field">
                    <span>Doctor Email</span>
          <input 

v-model="email"

placeholder="doctor@hospital.com"

:disabled="editMode"

/>
                </label>

                <label class="field">
                    <span>Doctor Password</span>
                   <input 
v-model="password"

:placeholder="
editMode 
? 'Enter new password (optional)' 
: 'Doctor password'
"

type="password"
/>
                </label>

            </div>

        </div>


        <div class="field-group">

            <span class="group-label">Availability</span>

            <div class="availability-box">

                <select v-model="day">
                    <option value="">Select Day</option>
                    <option>Mon</option>
                    <option>Tue</option>
                    <option>Wed</option>
                    <option>Thu</option>
                    <option>Fri</option>
                    <option>Sat</option>
                    <option>Sun</option>
                </select>

                <input type="time" v-model="startTime" />

                <input type="time" v-model="endTime" />

                <button class="primary-btn" @click="addAvailability">
                    + Add Time
                </button>

            </div>

            <div class="availability-list" v-if="availability.length">

                <span v-for="(item,index) in availability" :key="index">
                    {{item.day}} · {{item.startTime}} - {{item.endTime}}
                    <button class="chip-remove" @click="removeAvailability(index)">✕</button>
                </span>

            </div>

            <p class="empty-hint" v-else>No availability slots added yet.</p>

        </div>


        <div class="form-actions">

            <button class="save-btn" @click="saveDoctor">
                {{editMode ? "Update Doctor" : "Add Doctor"}}
            </button>

            <button v-if="editMode" class="cancel-btn" @click="clearForm">
                Cancel
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
    margin-bottom:24px;
}

.eyebrow{
    text-transform:uppercase;
    letter-spacing:1.5px;
    font-size:12px;
    font-weight:700;
    color:var(--secondary,#14b8a6);
}

.header h2{
    color:var(--text);
    font-size:28px;
    margin-top:6px;
}

.header p{
    color:var(--muted);
    margin-top:6px;
    font-size:14px;
}

.badge{
    background:linear-gradient(135deg,var(--primary),var(--secondary));
    color:white;
    padding:12px 20px;
    border-radius:30px;
    font-weight:600;
    font-size:13px;
    white-space:nowrap;
}


.search-bar{
    display:flex;
    align-items:center;
    gap:10px;
    background:var(--white);
    border:1px solid var(--border);
    border-radius:14px;
    padding:4px 16px;
    margin-bottom:24px;
    box-shadow:var(--shadow);
}

.search-icon{
    font-size:15px;
    opacity:.6;
}

.search-bar input{
    border:none;
    padding:12px 0;
    flex:1;
}

.search-bar input:focus{
    box-shadow:none;
}


.card{
    background:var(--white);
    border-radius:20px;
    padding:30px;
    box-shadow:var(--shadow);
    border:1px solid var(--border);
    margin-bottom:30px;
}

.form-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:22px;
}

.card h3{
    color:var(--text);
}

.edit-pill{
    background:#fef3c7;
    color:#b45309;
    font-size:12px;
    font-weight:700;
    padding:6px 14px;
    border-radius:20px;
}


.field-group{
    margin-bottom:26px;
    padding-bottom:26px;
    border-bottom:1px dashed var(--border);
}

.field-group:last-of-type{
    border-bottom:none;
    padding-bottom:0;
    margin-bottom:0;
}

.group-label{
    display:block;
    font-size:12px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.6px;
    color:var(--muted);
    margin-bottom:14px;
}


.form-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:18px;
}

.field{
    display:flex;
    flex-direction:column;
    gap:6px;
}

.field span{
    font-size:12px;
    font-weight:600;
    color:var(--muted);
}


input,
select{
    padding:13px 14px;
    border-radius:12px;
    border:1px solid var(--border);
    outline:none;
    font-size:14px;
    background:#fff;
    width:100%;
}

input:focus,
select:focus{
    border-color:var(--secondary);
    box-shadow:0 0 0 4px rgba(20,184,166,.15);
}


.availability-box{
    display:flex;
    gap:14px;
    flex-wrap:wrap;
}

.availability-box select,
.availability-box input{
    flex:1;
    min-width:130px;
}


button{
    border:none;
    cursor:pointer;
    border-radius:10px;
    padding:12px 18px;
    font-weight:600;
    font-size:14px;
}

button:disabled{
    opacity:.4;
    cursor:not-allowed;
}

.primary-btn,
.save-btn{
    background:linear-gradient(135deg,var(--primary),var(--secondary));
    color:white;
    white-space:nowrap;
}

.form-actions{
    display:flex;
    align-items:center;
    margin-top:26px;
}

.save-btn{
    min-width:200px;
}

.cancel-btn{
    background:#e2e8f0;
    margin-left:10px;
}


.availability-list{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin-top:16px;
}

.availability-list span{
    display:inline-flex;
    align-items:center;
    gap:8px;
    background:rgba(20,184,166,.15);
    color:var(--primary);
    padding:8px 8px 8px 14px;
    border-radius:20px;
    font-size:13px;
    font-weight:600;
}

.chip-remove{
    background:rgba(255,255,255,.6);
    color:inherit;
    padding:2px 7px;
    border-radius:50%;
    font-size:11px;
    line-height:1;
}

.empty-hint{
    color:var(--muted);
    font-size:13px;
    margin-top:14px;
}

.table-empty{
    text-align:center;
    padding:30px 0;
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
    padding:14px 15px;
    text-align:left;
    font-size:12px;
    text-transform:uppercase;
    letter-spacing:.5px;
}

th:first-child{ border-radius:10px 0 0 10px; }
th:last-child{ border-radius:0 10px 10px 0; }

td{
    padding:15px;
    border-bottom:1px solid var(--border);
    color:var(--text);
    font-size:14px;
}

tr:hover td{
    background:#f8fafc;
}

.doctor-name-cell{
    display:flex;
    align-items:center;
    gap:10px;
    font-weight:600;
}

.avatar{
    width:32px;
    height:32px;
    flex-shrink:0;
    border-radius:10px;
    background:linear-gradient(135deg,var(--primary),var(--secondary));
    color:white;
    font-weight:700;
    font-size:13px;
    display:flex;
    align-items:center;
    justify-content:center;
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

.no-slots{
    color:var(--muted);
}


.pagination{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:18px;
    margin-top:22px;
}

.pagination button{
    background:#f1f5f9;
    color:var(--text);
}

.page-info{
    font-size:13px;
    font-weight:600;
    color:var(--muted);
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

.doctor-grid{

display:grid;
grid-template-columns:
repeat(auto-fill,minmax(320px,1fr));

gap:22px;

}



.doctor-card{

background:linear-gradient(
145deg,
#ffffff,
#f8fafc
);

border:1px solid var(--border);

border-radius:22px;

padding:22px;

box-shadow:0 10px 25px rgba(0,0,0,.06);

transition:.3s;

}


.doctor-card:hover{

transform:translateY(-5px);

box-shadow:
0 20px 35px rgba(0,0,0,.10);

}




.doctor-top{

display:flex;

align-items:center;

gap:15px;

padding-bottom:18px;

border-bottom:1px solid var(--border);

}


.doctor-heading{

min-width:0;

}


.card-expand-btn{

display:none;

}



.doctor-avatar{

height:55px;

width:55px;

flex-shrink:0;

border-radius:18px;

background:
linear-gradient(
135deg,
var(--primary),
var(--secondary)
);

display:flex;

align-items:center;

justify-content:center;

font-size:22px;

font-weight:700;

color:white;

}



.doctor-top h4{

margin:0;

font-size:18px;

color:var(--text);

}



.doctor-top p{

margin-top:5px;

font-size:13px;

color:var(--secondary);

font-weight:600;

}




.doctor-info{

display:grid;

grid-template-columns:1fr;

gap:12px;

margin-top:18px;

}


.doctor-info--sub{

margin-top:12px;

}



.doctor-info div{

display:flex;

flex-direction:column;

gap:4px;

}



.doctor-info span,
.label{

font-size:11px;

text-transform:uppercase;

letter-spacing:.7px;

font-weight:700;

color:var(--muted);

}



.doctor-info strong{

font-size:14px;

color:var(--text);

}




.availability-card{

margin-top:20px;

background:#f1f5f9;

padding:15px;

border-radius:15px;

}



.slot{

display:flex;

justify-content:space-between;

align-items:center;

background:white;

padding:8px 12px;

border-radius:10px;

margin-top:8px;

font-size:13px;

}



.slot span{

font-weight:700;

color:var(--primary);

}


.slot small{

color:var(--muted);

}




.availability-card p{

font-size:13px;

color:var(--muted);

margin:10px 0 0;

}




.doctor-actions{

display:flex;

gap:10px;

margin-top:20px;

}



.doctor-actions button{

flex:1;

}



.edit{

background:#dbeafe;

color:#2563eb;

}



.delete{

background:#fee2e2;

color:#dc2626;

}



@media(max-width:600px){

.doctor-grid{

grid-template-columns:1fr;

}

}

/* ================= RESPONSIVE ================= */


/* Tablet + Small Laptop */
@media(max-width:1100px){

    .page{
        padding:0;
    }


    .form-grid{
        grid-template-columns:repeat(2,1fr);
    }


    .doctor-grid{

        grid-template-columns:
        repeat(2,1fr);

    }


    .card{

        padding:24px;

    }

}



/* Tablet */
@media(max-width:800px){


    .header{

        flex-direction:column;
        align-items:flex-start;
        gap:15px;

    }


    .header h2{

        font-size:24px;

    }


    .badge{

        
width:50%;
        text-align:center;

    }



    .search-bar{

        margin-bottom:18px;

    }



    .form-grid{

        grid-template-columns:1fr;

    }



    .availability-box{

        flex-direction:column;

    }


    .availability-box select,
    .availability-box input,
    .availability-box button{

        width:100%;

    }



    .doctor-grid{

        grid-template-columns:1fr;

    }



    .form-actions{

        flex-direction:column;
        align-items:stretch;
        gap:10px;

    }


    .save-btn{

        width:100%;

    }


    .cancel-btn{

        margin-left:0;
        width:100%;

    }



    .pagination{

        gap:10px;

    }


}



/* Mobile — collapsed doctor cards, arrow to expand */
@media(max-width:600px){


    .page{

        padding:10px;

    }



    .header h2{

        font-size:21px;

    }


    .header p{

        font-size:13px;

    }



    .card{

        padding:16px;
        border-radius:16px;

    }



    .form-head{

        flex-direction:column;
        align-items:flex-start;
        gap:10px;

    }



    .search-bar input{

        font-size:13px;

    }



    .group-label{

        font-size:11px;

    }



    input,
    select{

        padding:11px;

        font-size:13px;

    }



    .availability-list span{

        font-size:12px;

    }



    /* Doctor Cards - collapsed by default */

    .doctor-card{

        padding:16px;

        border-radius:18px;

    }



    .doctor-top{

        gap:12px;

        justify-content:space-between;

    }



    .doctor-avatar{

        width:45px;
        height:45px;

        font-size:18px;

    }



    .doctor-top h4{

        font-size:16px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;

    }



    .doctor-info strong{

        font-size:13px;

        word-break:break-word;

    }


    /* Only Email row stays visible by default */

    .doctor-info{

        margin-top:12px;

    }


    /* Extra details hidden until expanded */

    .doctor-collapsible{

        display:none;

    }


    .doctor-card.expanded .doctor-collapsible{

        display:block;

    }


    /* Expand arrow button */

    .card-expand-btn{

        display:flex;

        align-items:center;

        justify-content:center;

        width:34px;

        height:34px;

        flex-shrink:0;

        margin-left:auto;

        border:none;

        border-radius:50%;

        background:#eef2f7;

        color:var(--primary);

        padding:0;

        cursor:pointer;

        transition:.25s ease;

    }


    .card-expand-btn:active{

        transform:scale(.92);

    }


    .chevron{

        font-size:20px;

        font-weight:700;

        line-height:1;

        transition:transform .25s ease;

    }


    .doctor-card.expanded .card-expand-btn{

        background:linear-gradient(135deg,var(--primary),var(--secondary));

        color:white;

    }


    .doctor-card.expanded .chevron{

        transform:rotate(90deg);

    }



    .doctor-actions{

        flex-direction:column;

    }



    .doctor-actions button{

        width:100%;

    }



    /* Pagination */

    .pagination{

        flex-wrap:wrap;

    }


    .pagination button{

        padding:10px 14px;

    }


}



/* Very Small Mobile */
@media(max-width:380px){


    .page{

        padding:5px;

    }



    .card{

        padding:14px;

    }



    .doctor-grid{

        grid-template-columns:1fr;

    }



    .doctor-top{

        align-items:flex-start;

    }



    .availability-card{

        padding:12px;

    }



    .slot{

        flex-direction:column;

        align-items:flex-start;

        gap:5px;

    }

}

/* Header Actions */
.header-actions{

    display:flex;
    align-items:center;
    gap:12px;
    flex-wrap:wrap;

}


/* Scroll Form Button */

.scroll-form-btn{

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    color:white;

    padding:11px 18px;

    border-radius:30px;

    font-size:13px;

    font-weight:600;

    white-space:nowrap;

    box-shadow:var(--shadow);

    transition:.3s;

}


.scroll-form-btn:hover{

    transform:translateY(-3px);

}


/* Tablet */

@media(max-width:800px){

.header-actions{

    width:100%;

    flex-direction:column;

    align-items:stretch;

}


.badge,
.scroll-form-btn{

    width:50%;

    text-align:center;

}


.scroll-form-btn{

    padding:12px;

    font-size:14px;

}

}



/* Mobile */

@media(max-width:600px){


.header-actions{

    gap:10px;

}


.scroll-form-btn{

    padding:11px 14px;

    font-size:13px;

    border-radius:12px;

}


.badge{

    padding:10px 14px;

    font-size:12px;

}


}



/* Small Mobile */

@media(max-width:380px){


.scroll-form-btn{

    padding:10px;

    font-size:12px;

}


}

.doctor-avatar img{

width:100%;

height:100%;

border-radius:18px;

object-fit:cover;

}
</style>