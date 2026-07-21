<script setup>

import {
    ref,
    onMounted,
    reactive
} from "vue";

import api from "../../api/axios";

import {
    useRouter
} from "vue-router";



const router = useRouter();



const appointments = ref([]);


const showFeedback = ref(false);

const selectedAppointment = ref(null);




const selectedDate = ref("");

const selectedTime = ref("");

// =======================
// Reschedule
// =======================


const showReschedule = ref(false);


const selectedRescheduleAppointment = ref(null);




// Open Reschedule Modal

const openReschedule = (appointment)=>{


    selectedRescheduleAppointment.value = appointment;


    showReschedule.value = true;


    selectedDate.value = "";

    selectedTime.value = "";


};





// Submit Reschedule Request

const submitReschedule = async()=>{


if(!selectedDate.value || !selectedTime.value){


alert(
"Please select date and time"
);


return;


}



try{


await api.post(

`/appointments/${selectedRescheduleAppointment.value._id}/reschedule`,

{

newDate:selectedDate.value,

newTime:selectedTime.value

}

);



alert(
"Reschedule request sent successfully"
);



showReschedule.value=false;


selectedDate.value="";

selectedTime.value="";


getAppointments();



}

catch(error){


console.log(

error.response?.data || error

);



alert(

error.response?.data?.message ||
"Slot already booked"

);



}



};

// =======================
// Navigation
// =======================


const openPrescription = ()=>{


    router.push(
        "/patient/prescriptions"
    );


};









// =======================
// Feedback
// =======================


const feedback = reactive({

    rating:5,

    comment:""

});





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









// =======================
// Get Appointments
// =======================


const getAppointments = async()=>{


    try{


        const res = await api.get(

            "/patient/appointments"

        );



        console.log(

            "Appointments:",

            res.data

        );



        appointments.value = res.data.appointments;



    }

    catch(error){


        console.log(

            error

        );


    }


};









// =======================
// Open Feedback
// =======================


const openFeedback = (appointment)=>{


    if(appointment.status !== "completed"){


        alert(

            "Please complete your appointment first before giving feedback"

        );


        return;


    }



    selectedAppointment.value = appointment;



    showFeedback.value = true;



};









// =======================
// Submit Feedback
// =======================


const submitFeedback = async()=>{


    try{


        const data = {


            doctor:selectedAppointment.value.doctor._id,


            appointment:selectedAppointment.value._id,


            rating:feedback.rating,


            comment:feedback.comment


        };




        await api.post(

            "/feedback/create",

            data

        );




        alert(

            "Feedback submitted successfully"

        );



        showFeedback.value = false;



        feedback.rating = 5;


        feedback.comment = "";



    }


    catch(error){



        console.log(

            "Feedback Error:",

            error.response?.data || error

        );


    }


};









onMounted(()=>{


    getAppointments();


});



</script>

<template>

<div class="appointments-page">

    <h2 class="page-title">
        My Appointments
    </h2>

    <div class="table-card">

        <table class="appointments-table">

            <tr>
                <th>Doctor</th>
                <th>Speciality</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
            </tr>

            <tr
                v-for="appointment in appointments"
                :key="appointment._id"
            >

                <td class="doctor-name">
                  {{ appointment.doctor?.user?.name || appointment.doctor?.name || "Doctor" }}
                </td>

                <td class="speciality">
                    {{ appointment.doctor?.specialties?.join(", ") }}
                </td>

                <td class="appointment-date">
                    {{ formatDateTime(appointment.appointmentDateTime) }}
                </td>

                <td>
                    <span class="status">
                        {{ appointment.status }}
                    </span>
                </td>

                <td>

                    <button
                        v-if="appointment.status==='confirmed'"
                        class="reschedule-btn"
                        @click="openReschedule(appointment)"
                    >
                        🔄 Reschedule
                    </button>

<button
class="feedback-btn"
:class="{ disabled: appointment.status !== 'completed' }"
:disabled="appointment.status !== 'completed'"
@click="openFeedback(appointment)"
>
⭐ Give Feedback
</button>

                    <button
                        v-if="appointment.status==='completed'"
                        class="prescription-btn"
                       @click="openPrescription(appointment)"
                    >
                        📄 Prescription
                    </button>

                </td>

            </tr>

        </table>

    </div>



    <!-- ========================= -->
    <!-- Reschedule Modal -->
    <!-- ========================= -->

<!-- ========================= -->
<!-- Reschedule Modal -->
<!-- ========================= -->

<div
    v-if="showReschedule"
    class="modal-overlay"
>

    <div class="feedback-modal">

        <h2>
            Reschedule Appointment
        </h2>


        <p>
            <b>Current Appointment:</b><br>

            {{
                formatDateTime(
                    selectedRescheduleAppointment.appointmentDateTime
                )
            }}

        </p>
<label>
Select Date
</label>


<input

type="date"

v-model="selectedDate"

/>



<label>
Select Time
</label>


<input

type="time"

v-model="selectedTime"

/>
        <button

        class="submit-btn"

        @click="submitReschedule"

        >

            Submit Request

        </button>




        <button

        class="cancel-btn"

        @click="showReschedule=false"

        >

            Cancel

        </button>



    </div>

</div>



    <!-- ========================= -->
    <!-- Feedback Modal -->
    <!-- ========================= -->

    <div
        v-if="showFeedback"
        class="modal-overlay"
    >

        <div class="feedback-modal">

            <h2>
                Give Feedback
            </h2>

            <label>
                Rating
            </label>

            <select v-model="feedback.rating">

                <option :value="5">⭐⭐⭐⭐⭐</option>
                <option :value="4">⭐⭐⭐⭐</option>
                <option :value="3">⭐⭐⭐</option>
                <option :value="2">⭐⭐</option>
                <option :value="1">⭐</option>

            </select>

            <textarea
                v-model="feedback.comment"
                placeholder="Write your experience..."
            ></textarea>

            <button
                class="submit-btn"
                @click="submitFeedback"
            >
                Submit
            </button>

            <button
                class="cancel-btn"
                @click="showFeedback=false"
            >
                Cancel
            </button>

        </div>

    </div>

</div>

</template>







<style scoped>


.appointments-page{

min-height:100%;

}



.page-title{

color:var(--text);

font-size:32px;

margin-bottom:30px;

}





.table-card{

background:var(--white);

padding:30px;

border-radius:22px;

box-shadow:var(--shadow);

border:1px solid var(--border);

overflow-x:auto;

}




.appointments-table{

width:100%;

border-collapse:collapse;

}





.appointments-table th{

background:linear-gradient(
135deg,
var(--primary),
var(--primary-dark)
);

color:white;

padding:16px;

text-align:left;

}





.appointments-table td{

padding:16px;

border-bottom:1px solid var(--border);

}





.doctor-name{

font-weight:700;

color:var(--primary);

}




.status{

display:inline-block;

padding:8px 15px;

border-radius:20px;

background:rgba(20,184,166,.15);

color:var(--primary);

font-weight:700;

}



button{

margin:5px;

padding:8px 15px;

border:none;

border-radius:10px;

cursor:pointer;

}



.reschedule-btn{

background:#f59e0b;

color:white;

}



.feedback-btn{

background:#2563eb;

color:white;

}



.feedback-btn.disabled{

background:#9ca3af;

cursor:not-allowed;

}



.prescription-btn{

background:#16a34a;

color:white;

}



.modal-overlay{

position:fixed;

top:0;

left:0;

width:100%;

height:100%;

background:rgba(0,0,0,.4);

display:flex;

align-items:center;

justify-content:center;

}



.feedback-modal{

background:white;

padding:30px;

border-radius:20px;

width:350px;

display:flex;

flex-direction:column;

gap:15px;

}



.feedback-modal input,
.feedback-modal textarea,
.feedback-modal select{

padding:10px;

}



.submit-btn{

background:#16a34a;

color:white;

}



.cancel-btn{

background:#dc2626;

color:white;

}


</style>