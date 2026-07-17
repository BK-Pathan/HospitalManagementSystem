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



onMounted(()=>{

getDoctors();

});


</script>



<template>

<div class="page">


    <div class="header">

        <h2>
            👨‍⚕️ Available Doctors
        </h2>


        <p>
            Find and book appointment with our specialists
        </p>


    </div>




    <div class="table-card">


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



    <td class="doctor-name">

    {{doctor.name}}

    </td>





    <td>

    {{doctor.specialties.join(",")}}

    </td>





    <td>

    {{doctor.qualifications}}

    </td>





    <td>

    {{doctor.experience}}

    </td>






    <td>


    <div class="availability">


    <div
    v-for="item in doctor.availability"
    :key="item._id"
    class="time-slot"
    >


    {{item.day}}

    <br>

    {{item.startTime}} -
    {{item.endTime}}


    </div>


    </div>


    </td>







    <td>


    <button
    class="book-btn"
    @click="router.push(`/patient/book-appointment/${doctor._id}`)"
    >

    Book Appointment

    </button>


    </td>





    </tr>





    </table>


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


.header h2{

    color:var(--text);

    font-size:30px;

}



.header p{

    color:var(--muted);

    margin-top:8px;

}




.table-card{

    background:var(--white);

    padding:30px;

    border-radius:20px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

    overflow-x:auto;

}




table{

    width:100%;

    border-collapse:collapse;

}




th{

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--primary-dark)
    );

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




.doctor-name{

    font-weight:700;

    color:var(--primary);

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




.book-btn{

    padding:12px 18px;

    border:none;

    border-radius:12px;

    cursor:pointer;

    color:white;

    font-weight:700;


    background:linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

}



.book-btn:hover{

    transform:translateY(-2px);

}


</style>