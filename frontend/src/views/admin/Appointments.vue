<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";
const formatDateTime = (date)=>{

return new Date(date).toLocaleString(
"en-US",
{
    year:"numeric",
    month:"short",
    day:"numeric",
    hour:"2-digit",
    minute:"2-digit",
    hour12:true
}

);

};
const appointments = ref([]);



const getAppointments = async()=>{

try{


const res = await api.get("/admin/appointments");


appointments.value = res.data;


}
catch(error){

console.log(error);

}


}



onMounted(()=>{

getAppointments();

});


</script>



<template>

<div class="page">


    <div class="header">

        <div>

            <h2>
                📅 Appointments Management
            </h2>

            <p>
                Monitor and manage all hospital appointments
            </p>

        </div>



        <div class="badge">
            Hospital Admin
        </div>


    </div>





    <div class="card">


        <div class="table-wrapper">


        <table>


        <thead>

        <tr>

        <th>
            Doctor
        </th>


        <th>
            Speciality
        </th>


        <th>
            Patient
        </th>


        <th>
            Appointment Date
        </th>


        <th>
            Status
        </th>


        </tr>


        </thead>





        <tbody>


        <tr
        v-for="appointment in appointments"
        :key="appointment._id"
        >



        <td>

        <div class="doctor">

            <div class="avatar">
                👨‍⚕️
            </div>


            <span>
                {{appointment.doctor?.name || "N/A"}}
            </span>

        </div>

        </td>





        <td>

        <span class="speciality">

            {{appointment.doctor?.specialties || "N/A"}}

        </span>

        </td>






        <td>

        {{appointment.patient?.user?.name || "Not Booked"}}

        </td>






        <td>

        {{formatDateTime(appointment.appointmentDateTime)}}

        </td>






        <td>


        <span
        class="status"
        :class="appointment.status"
        >

        {{appointment.status}}

        </span>


        </td>




        </tr>






        <tr v-if="appointments.length===0">


        <td colspan="5" class="empty">


            No Appointments Found


        </td>


        </tr>





        </tbody>


        </table>


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


    font-size:30px;

    color:var(--text);

}



.header p{


    margin-top:8px;

    color:var(--muted);


}




.badge{


    padding:12px 20px;

    border-radius:30px;

    color:white;


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );


    font-weight:600;


}




.card{


    background:var(--white);

    padding:30px;

    border-radius:20px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);


}




.table-wrapper{


    overflow-x:auto;


}



table{


    width:100%;

    border-collapse:collapse;


}



thead th{


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--primary-dark)
    );


    color:white;

    padding:16px;

    text-align:left;

    font-size:15px;


}




tbody td{


    padding:16px;

    border-bottom:1px solid var(--border);

    color:var(--text);


}




tbody tr{


    transition:.3s;


}




tbody tr:hover{


    background:#f8fafc;

}




.doctor{


    display:flex;

    align-items:center;

    gap:12px;

    font-weight:600;


}



.avatar{


    width:40px;

    height:40px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;


    background:rgba(20,184,166,.15);


}




.speciality{


    padding:7px 14px;

    border-radius:20px;


    background:rgba(15,118,110,.12);

    color:var(--primary);

    font-size:13px;

    font-weight:600;


}





.status{


    padding:8px 15px;

    border-radius:20px;

    font-size:13px;

    font-weight:700;

    text-transform:capitalize;


}




.status.pending{


    background:#fef3c7;

    color:#92400e;


}




.status.confirmed{


    background:#dcfce7;

    color:#166534;


}




.status.completed{


    background:#dbeafe;

    color:#1d4ed8;


}




.status.cancelled{


    background:#fee2e2;

    color:#dc2626;


}





.empty{


    text-align:center;

    padding:40px;

    color:var(--muted);

    font-size:16px;


}





@media(max-width:700px){


.header{

    flex-direction:column;

    align-items:flex-start;

    gap:15px;

}


.card{

    padding:15px;

}


}



</style>


