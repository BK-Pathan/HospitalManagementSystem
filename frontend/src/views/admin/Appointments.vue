<script setup>

import { ref, onMounted } from "vue";
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

const currentPage = ref(1);

const totalPages = ref(1);

const limit = 10;

const status = ref("");





const getAppointments = async()=>{

try{


const res = await api.get("/admin/appointments",{

params:{
    page:currentPage.value,
    limit,
    status:status.value
}

});


appointments.value = res.data.appointments;

totalPages.value = res.data.totalPages;



}
catch(error){

console.log(error);

}


};







onMounted(()=>{

getAppointments();

});






const sortAppointments = ()=>{

currentPage.value = 1;

getAppointments();

};







const changePage = (page)=>{


if(page < 1 || page > totalPages.value){

return;

}


currentPage.value = page;

getAppointments();


};








const cancelAppointment = async(id)=>{


const reason = prompt(
"Enter cancellation reason"
);



if(!reason){

return;

}





try{


await api.put(

`/admin/appointment/${id}/cancel`,

{
reason
}

);



alert("Appointment cancelled");


getAppointments();



}catch(error){


console.log(error);


}



};


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





<select
v-model="status"
@change="sortAppointments"
>


<option value="">
    All
</option>


<option value="pending">
    Pending
</option>


<option value="confirmed">
    Confirmed
</option>


<option value="completed">
    Completed
</option>


<option value="cancelled">
    Cancelled
</option>


</select>






<div class="card">


<div class="table-wrapper">


<table>


<thead>


<tr>


<th>#</th>


<th>
Doctor
</th>


<th>
Department
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


<th>
Action
</th>


<th>
Cancel Reason
</th>



</tr>


</thead>





<tbody>




<tr
v-for="(appointment,index) in appointments"
:key="appointment._id"
>



<td>

{{
(currentPage - 1) * limit + index + 1
}}

</td>






<td>


<div class="doctor">


<div class="avatar">

👨‍⚕️

</div>



<span>

{{
appointment.doctor?.name || "N/A"
}}

</span>


</div>


</td>







<td>


<span class="department">


{{
appointment.doctor?.department || "N/A"
}}


</span>


</td>







<td>


<span class="speciality">


{{
appointment.doctor?.specialties?.join(", ")
||
"N/A"
}}


</span>


</td>







<td>


{{
appointment.patient?.user?.name
||
"Not Booked"
}}


</td>







<td>


{{
formatDateTime(
appointment.appointmentDateTime
)
}}


</td>







<td>


<span
class="status"
:class="appointment.status"
>


{{appointment.status}}


</span>


</td>








<td>



<button

v-if="appointment.status !== 'cancelled'"

@click="cancelAppointment(appointment._id)"

>

Cancel

</button>



<span v-else>

Already Cancelled

</span>



</td>









<td>


{{
appointment.cancelReason
||
"No cancellation"
}}


</td>





</tr>








<tr v-if="appointments.length===0">


<td
colspan="9"
class="empty"
>


No Appointments Found


</td>


</tr>





</tbody>


</table>


</div>








<!-- Pagination -->


<div
class="pagination"
v-if="totalPages > 1"
>



<button

@click="changePage(currentPage-1)"

:disabled="currentPage===1"

>

←

</button>





<button

v-for="page in totalPages"

:key="page"

@click="changePage(page)"

:class="{active:currentPage===page}"

>

{{page}}

</button>





<button

@click="changePage(currentPage+1)"

:disabled="currentPage===totalPages"

>

→

</button>



</div>






</div>



</div>


</template>

<style scoped>

/* ================= PAGE ================= */

.page{

    width:100%;
    max-width:100%;
    min-height:100%;
    overflow:hidden;

}


/* ================= HEADER ================= */

.header{

    display:flex;
    justify-content:space-between;
    align-items:center;

    margin-bottom:28px;

    gap:20px;

}


.header h2{

    margin:0;

    font-size:28px;

    font-weight:800;

    color:var(--text);

    letter-spacing:-.5px;

}


.header p{

    margin:8px 0 0;

    color:var(--muted);

    font-size:14px;

}


.badge{

    background:var(--gradient-primary);

    color:white;

    padding:12px 24px;

    border-radius:var(--radius-pill);

    font-size:14px;

    font-weight:700;

    box-shadow:var(--shadow-lg);

    white-space:nowrap;

}


/* ================= FILTER ================= */


select{

    appearance:none;

    background:var(--white);

    border:1px solid var(--border);

    padding:13px 18px;

    border-radius:var(--radius-md);

    color:var(--text);

    font-weight:600;

    outline:none;

    margin-bottom:22px;

    cursor:pointer;

    box-shadow:var(--shadow);

    transition:.3s;

}



select:hover{

    border-color:var(--primary);

}



select:focus{

    border-color:var(--secondary);

    box-shadow:
    0 0 0 4px rgba(20,184,166,.15);

}



/* ================= CARD ================= */


.card{

    width:100%;

    max-width:100%;

    overflow:hidden;

    background:var(--surface);

    backdrop-filter:blur(14px);

    border:1px solid var(--border);

    border-radius:var(--radius-xl);

    padding:25px;

    box-shadow:var(--shadow);

}



/* ================= TABLE WRAPPER ================= */


.table-wrapper{

    width:100%;

    max-width:100%;

    overflow-x:auto;

    overflow-y:hidden;

    border-radius:18px;

}



/* Scrollbar */

.table-wrapper::-webkit-scrollbar{

    height:8px;

}


.table-wrapper::-webkit-scrollbar-thumb{

    background:var(--primary);

    border-radius:20px;

}



/* ================= TABLE ================= */


table{

    width:100%;

    min-width:1100px;

    border-collapse:separate;

    border-spacing:0 12px;

}



/* ================= TABLE HEADER ================= */


thead th{

    background:var(--gradient-primary);

    color:white;

    padding:16px;

    text-align:left;

    font-size:12px;

    text-transform:uppercase;

    letter-spacing:.6px;

    white-space:nowrap;

}


thead th:first-child{

    border-radius:14px 0 0 14px;

}


thead th:last-child{

    border-radius:0 14px 14px 0;

}



/* ================= TABLE BODY ================= */


tbody tr{

    background:var(--white);

    box-shadow:var(--shadow);

    transition:.3s;

}



tbody tr:hover{

    transform:translateY(-4px);

    box-shadow:var(--shadow-hover);

}



tbody td{

    padding:16px;

    color:var(--text-soft);

    font-size:14px;

    white-space:nowrap;

    border-top:1px solid var(--border);

    border-bottom:1px solid var(--border);

}



tbody td:first-child{

    border-left:1px solid var(--border);

    border-radius:14px 0 0 14px;

}


tbody td:last-child{

    border-right:1px solid var(--border);

    border-radius:0 14px 14px 0;

}



/* ================= DOCTOR ================= */


.doctor{

    display:flex;

    align-items:center;

    gap:12px;

    font-weight:700;

}



.avatar{

    width:44px;

    height:44px;

    flex-shrink:0;

    border-radius:14px;

    display:flex;

    justify-content:center;

    align-items:center;

    background:var(--gradient-teal);

    font-size:21px;

}



/* ================= TAGS ================= */


.department,
.speciality{

    display:inline-flex;

    align-items:center;

    padding:7px 15px;

    border-radius:var(--radius-pill);

    font-size:12px;

    font-weight:700;

}



.department{

    background:var(--gradient-blue);

    color:var(--primary);

}



.speciality{

    background:var(--gradient-purple);

    color:var(--purple);

}



/* ================= STATUS ================= */


.status{

    display:inline-flex;

    padding:7px 16px;

    border-radius:var(--radius-pill);

    font-size:12px;

    font-weight:800;

    text-transform:capitalize;

}



.status.pending{

    background:var(--warning-bg);

    color:#b45309;

}


.status.confirmed{

    background:var(--success-bg);

    color:var(--success);

}


.status.completed{

    background:var(--info-bg);

    color:var(--info);

}


.status.cancelled{

    background:var(--danger-bg);

    color:var(--danger);

}



/* ================= BUTTON ================= */


button{

    border:none;

    padding:9px 18px;

    border-radius:var(--radius-pill);

    background:var(--danger-bg);

    color:var(--danger);

    font-weight:700;

    cursor:pointer;

    transition:.3s;

}



button:hover{

    background:var(--danger);

    color:white;

    transform:translateY(-2px);

}



/* ================= EMPTY ================= */


.empty{

    text-align:center;

    padding:50px;

    color:var(--muted);

    font-size:15px;

}



/* ================= RESPONSIVE ================= */


@media(max-width:900px){


.header{

    flex-direction:column;

    align-items:flex-start;

}



.header h2{

    font-size:24px;

}


.card{

    padding:15px;

}



.badge{

    width:max-content;

}



}


@media(max-width:600px){


select{

    width:100%;

}



table{

    min-width:1000px;

}


}
/* ================= PAGINATION ================= */


.pagination{

    margin-top:28px;

    display:flex;

    justify-content:center;

    align-items:center;

    gap:10px;

    flex-wrap:wrap;

}



/* Pagination Buttons */

.pagination button{

    min-width:42px;

    height:42px;

    padding:0 14px;

    border-radius:12px;

    border:1px solid var(--border);

    background:var(--white);

    color:var(--text);

    font-size:14px;

    font-weight:700;

    cursor:pointer;

    transition:.3s;

    box-shadow:var(--shadow);

}





.pagination button:hover{

    background:var(--gradient-primary);

    color:white;

    border-color:transparent;

    transform:translateY(-3px);

}





/* Active Page */

.pagination button.active{

    background:var(--gradient-primary);

    color:white;

    border:none;

    box-shadow:var(--shadow-lg);

}





/* Disabled */

.pagination button:disabled{

    opacity:.45;

    cursor:not-allowed;

    transform:none;

    background:var(--surface-solid);

}





/* Arrow Buttons */

.pagination button:first-child,
.pagination button:last-child{

    font-size:18px;

    font-weight:800;

}





/* Mobile */

@media(max-width:600px){


.pagination{

    gap:6px;

}



.pagination button{

    min-width:36px;

    height:36px;

    padding:0 10px;

    font-size:13px;

}


}
</style>

