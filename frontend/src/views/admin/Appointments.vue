<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";
import BackButton from "../../components/BackButton.vue"

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

// track which mobile cards are expanded
const expandedCards = ref(new Set());

const toggleCard = (id)=>{

if(expandedCards.value.has(id)){
    expandedCards.value.delete(id);
}else{
    expandedCards.value.add(id);
}

// re-trigger reactivity for Set
expandedCards.value = new Set(expandedCards.value);

};

const isExpanded = (id)=> expandedCards.value.has(id);





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


window.notify("Appointment cancelled");


getAppointments();



}catch(error){


console.log(error);


}



};


</script>



<template>

<div class="page">

 <BackButton/>

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


<!-- ================= DESKTOP TABLE ================= -->

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

<img
v-if="appointment.doctor?.user?.profileImage"
:src="appointment.doctor.user.profileImage"
alt="Doctor"
/>

<span v-else>
👨‍⚕️
</span>

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



<!-- ================= MOBILE CARDS ================= -->

<div class="mobile-list">

    <div
    v-for="(appointment,index) in appointments"
    :key="appointment._id"
    class="mobile-card"
    >

        <div
        class="mobile-card-main"
        @click="toggleCard(appointment._id)"
        >

<div class="avatar">

<img
v-if="appointment.doctor?.user?.profileImage"
:src="appointment.doctor.user.profileImage"
alt="Doctor"
/>

<span v-else>
👨‍⚕️
</span>

</div>

            <div class="mobile-card-info">

                <span class="mobile-card-name">
                    {{ appointment.doctor?.name || "N/A" }}
                </span>

                <span class="mobile-card-role">
                    {{ appointment.doctor?.department || "N/A" }}
                </span>

                <span class="mobile-card-email">
                    {{ appointment.patient?.user?.name || "Not Booked" }}
                </span>

            </div>

            <div class="mobile-card-side">

                <span
                class="status"
                :class="appointment.status"
                >
                    {{ appointment.status }}
                </span>

                <button
                class="chevron"
                :class="{open:isExpanded(appointment._id)}"
                >
                    ›
                </button>

            </div>

        </div>

        <transition name="expand">

        <div
        v-if="isExpanded(appointment._id)"
        class="mobile-card-details"
        >

            <div class="detail-row">
                <span class="detail-label">Speciality</span>
                <span class="detail-value">
                    {{ appointment.doctor?.specialties?.join(", ") || "N/A" }}
                </span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Appointment Date</span>
                <span class="detail-value">
                    {{ formatDateTime(appointment.appointmentDateTime) }}
                </span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Cancel Reason</span>
                <span class="detail-value">
                    {{ appointment.cancelReason || "No cancellation" }}
                </span>
            </div>

            <button
            v-if="appointment.status !== 'cancelled'"
            class="mobile-cancel-btn"
            @click="cancelAppointment(appointment._id)"
            >
                Cancel Appointment
            </button>

            <span v-else class="already-cancelled">
                Already Cancelled
            </span>

        </div>

        </transition>

    </div>

    <div
    v-if="appointments.length===0"
    class="empty"
    >
        No Appointments Found
    </div>

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
    width:220px;
    max-width:100%;
    position:relative;
    z-index:10;
    padding: 10px;
    margin-bottom:10px
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

    /* background:var(--surface); */

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

    /* background:var(--white); */

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

.avatar img{

width:100%;
height:100%;

object-fit:cover;

border-radius:14px;

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
    white-space:nowrap;

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



/* ================= MOBILE CARD LIST (hidden on desktop) ================= */

.mobile-list{

    display:none;

}


.mobile-card{

    background:var(--white);

    border:1px solid var(--border);

    border-radius:18px;

    box-shadow:var(--shadow);

    margin-bottom:14px;

    overflow:hidden;

    transition:.3s;

}


.mobile-card-main{

    display:flex;

    align-items:center;

    gap:12px;

    padding:14px 16px;

    cursor:pointer;

}


.mobile-card-main .avatar{

    background:var(--gradient-teal);

}


.mobile-card-info{

    flex:1;

    min-width:0;

    display:flex;

    flex-direction:column;

    gap:2px;

}


.mobile-card-name{

    font-weight:800;

    font-size:15px;

    color:var(--text);

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}


.mobile-card-role{

    font-size:12px;

    font-weight:700;

    color:var(--primary);

}


.mobile-card-email{

    font-size:12px;

    color:var(--muted);

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}


.mobile-card-side{

    display:flex;

    flex-direction:column;

    align-items:flex-end;

    gap:8px;

    flex-shrink:0;

}


.chevron{

    background:var(--surface-solid, #f3f4f6);

    color:var(--muted);

    border:none;

    width:26px;

    height:26px;

    padding:0;

    border-radius:50%;

    font-size:16px;

    font-weight:900;

    display:flex;

    align-items:center;

    justify-content:center;

    transition:.3s;

}


.chevron.open{

    transform:rotate(90deg);

    background:var(--gradient-primary);

    color:white;

}


.chevron:hover{

    background:var(--gradient-primary);

    color:white;

    transform:none;

}


.chevron.open:hover{

    transform:rotate(90deg);

}


.mobile-card-details{

    padding:0 16px 16px;

    border-top:1px solid var(--border);

    display:flex;

    flex-direction:column;

    gap:10px;

    padding-top:14px;

}


.detail-row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:10px;

    font-size:13px;

}


.detail-label{

    color:var(--muted);

    font-weight:600;

}


.detail-value{

    color:var(--text-soft);

    text-align:right;

    font-weight:600;

}


.mobile-cancel-btn{

    width:100%;

    margin-top:4px;

    padding:11px;

    font-size:13px;

}


.already-cancelled{

    display:block;

    text-align:center;

    color:var(--muted);

    font-size:12px;

    font-weight:700;

    margin-top:4px;

}


/* expand transition */

.expand-enter-active,
.expand-leave-active{

    transition:.25s ease;

}


.expand-enter-from,
.expand-leave-to{

    opacity:0;

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


/* select{

    width:100%;

} */

select{

        width:25%;

        padding:12px 14px;

        font-size:14px;

        border-radius:14px;

    }

/* swap table for cards on mobile */

.table-wrapper{

    display:none;

}


.mobile-list{

    display:block;

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

    min-width:28px;

    height:28px;

    padding:0 10px;

    font-size:13px;

}


}
</style>