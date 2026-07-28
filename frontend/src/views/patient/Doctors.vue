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

const viewDoctorProfile = (doctorId)=>{


router.push(
`/patient/doctors/profile/${doctorId}`
);


};


onMounted(()=>{

getDoctors();

});


// Display-only helper (no backend / data change)

const initials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};


</script>



<template>

<div class="page">


    <div class="header">

        <p class="eyebrow">Directory</p>

        <h2>
            Available Doctors
        </h2>


        <p class="subtitle">
            Find and book an appointment with our specialists
        </p>


    </div>




    <div class="table-card">


    <table v-if="doctors.length">


    <thead>
    <tr>

    <th>Doctor</th>

    <th>Department</th>

    <th>Speciality</th>

    <th>Qualification</th>

    <th>Experience</th>

    <th>Availability</th>

    <th>Action</th>


    </tr>
    </thead>




    <tbody>
    <tr
    v-for="doctor in doctors"
    :key="doctor._id"
    >



    <td>
      <div class="doctor-cell">
        <span class="avatar">{{ initials(doctor.name) }}</span>
        <span class="doctor-name">{{doctor.name}}</span>
      </div>
    </td>


    <td>

    <span class="dept-pill">{{doctor.department}}</span>

    </td>


    <td class="muted-cell">

    {{doctor.specialties.join(", ")}}

    </td>





    <td class="muted-cell">

    {{doctor.qualifications}}

    </td>





    <td class="muted-cell">

    {{doctor.experience}}

    </td>






    <td>


    <div class="availability" v-if="doctor.availability?.length">


    <div
    v-for="item in doctor.availability"
    :key="item._id"
    class="time-slot"
    >


    <span class="time-slot__day">{{item.day}}</span>
    {{item.startTime}} - {{item.endTime}}


    </div>


    </div>

    <span class="no-data" v-else>Not set</span>


    </td>







    <td>

    <div class="action-buttons">

    <button
    class="book-btn"
    @click="router.push(`/patient/book-appointment/${doctor._id}`)"
    >
    <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    Book Appointment
    </button>

    <button

    class="profile-btn"

    @click="viewDoctorProfile(doctor._id)"

    >
    <svg viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
    View Doctor
    </button>

    </div>
    </td>





    </tr>
    </tbody>





    </table>

    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <p>No doctors available right now.</p>
    </div>


    </div>



</div>


</template>

<style scoped>

.page{

    min-height:100%;

}



.header{

    margin-bottom:30px;

}


.eyebrow{

    font-size:13px;

    font-weight:600;

    letter-spacing:.04em;

    text-transform:uppercase;

    color:var(--primary);

    margin:0 0 6px;

}


.header h2{

    color:var(--text);

    font-size:30px;

    margin:0;

}



.header .subtitle{

    color:var(--muted);

    margin-top:8px;

}




.table-card{

    background:var(--white);

    padding:10px 24px 24px;

    border-radius:20px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

    overflow-x:auto;

}




table{

    width:100%;

    border-collapse:collapse;

}




thead th{

    color:var(--muted);

    font-size:12px;

    text-transform:uppercase;

    letter-spacing:.04em;

    font-weight:700;

    text-align:left;

    padding:16px 12px;

    border-bottom:1px solid var(--border);

    background:transparent;

}




td{

    padding:16px 12px;

    border-bottom:1px solid var(--border);

    color:var(--text);

    font-size:14px;

    vertical-align:top;

}


tbody tr:last-child td{

    border-bottom:none;

}




tbody tr:hover{

    background:#f8fafc;

}


.muted-cell{

    color:var(--muted);

}


.doctor-cell{

    display:flex;

    align-items:center;

    gap:10px;

}


.avatar{

    flex-shrink:0;

    width:38px;

    height:38px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    background:linear-gradient(135deg,var(--primary),var(--primary-dark));

    color:#fff;

    font-size:13px;

    font-weight:700;

}




.doctor-name{

    font-weight:700;

    color:var(--text);

}


.dept-pill{

    display:inline-block;

    padding:5px 12px;

    border-radius:999px;

    background:rgba(37,99,235,.12);

    color:#2563eb;

    font-weight:600;

    font-size:12px;

}


.no-data{

    color:var(--muted);

    font-style:italic;

    font-size:13px;

}




.availability{

    display:flex;

    flex-direction:column;

    gap:8px;

}



.time-slot{

    background:rgba(20,184,166,.12);

    color:var(--primary);

    padding:8px 12px;

    border-radius:10px;

    font-size:13px;

}


.time-slot__day{

    font-weight:700;

    margin-right:6px;

}


.action-buttons{

    display:flex;

    flex-direction:column;

    gap:8px;

    min-width:170px;

}


.book-btn,
.profile-btn{

    padding:11px 16px;

    border:none;

    border-radius:10px;

    cursor:pointer;

    font-weight:700;

    font-size:13px;

    display:inline-flex;

    align-items:center;

    justify-content:center;

    gap:8px;

    transition:transform .15s ease, box-shadow .15s ease;

}


.book-btn svg,
.profile-btn svg{

    width:15px;

    height:15px;

}



.book-btn{

    color:white;


    background:linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

}


.profile-btn{

    background:var(--white);

    color:var(--primary);

    border:1px solid var(--border);

}



.book-btn:hover,
.profile-btn:hover{

    transform:translateY(-2px);

    box-shadow:0 6px 14px rgba(0,0,0,.1);

}


.empty-state{

    display:flex;

    flex-direction:column;

    align-items:center;

    justify-content:center;

    gap:12px;

    padding:50px 20px;

    color:var(--muted);

}


.empty-state svg{

    width:36px;

    height:36px;

    opacity:.6;

}


.empty-state p{

    margin:0;

    font-size:14px;

}


</style>