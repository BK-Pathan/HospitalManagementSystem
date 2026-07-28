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

    <div class="page-header">

        <div>
            <p class="eyebrow">Patient Portal</p>
            <h2 class="page-title">My Appointments</h2>
        </div>

        <span class="count-badge" v-if="appointments.length">
            {{ appointments.length }} total
        </span>

    </div>

    <div class="table-card">

        <table class="appointments-table" v-if="appointments.length">

            <thead>
            <tr>
                <th>Doctor</th>
                <th>Speciality</th>
                <th>Date &amp; Time</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            </thead>

            <tbody>
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
                    <span class="status" :class="`status--${appointment.status}`">
                        {{ appointment.status }}
                    </span>
                </td>

                <td class="actions-cell">

                    <button
                        v-if="appointment.status==='confirmed'"
                        class="action-btn reschedule-btn"
                        @click="openReschedule(appointment)"
                    >
                        🔄 Reschedule
                    </button>

                    <button
                        class="action-btn feedback-btn"
                        :class="{ disabled: appointment.status !== 'completed' }"
                        :disabled="appointment.status !== 'completed'"
                        @click="openFeedback(appointment)"
                    >
                        ⭐ Give Feedback
                    </button>

                    <button
                        v-if="appointment.status==='completed'"
                        class="action-btn prescription-btn"
                       @click="openPrescription(appointment)"
                    >
                        📄 Prescription
                    </button>

                </td>

            </tr>
            </tbody>

        </table>

        <div class="empty-state" v-else>
            <div class="empty-icon">📅</div>
            <p>No appointments yet</p>
        </div>

    </div>



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


        <p class="modal-subtext">
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

        <div class="modal-actions">

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

            <div class="modal-actions">

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

</div>

</template>







<style scoped>

.appointments-page{

  --clinical-navy:#0F2A43;
  --clinical-teal:#0D9488;
  --clinical-teal-light:#CCFBF1;
  --clinical-bg:#F4F7FA;
  --clinical-surface:#FFFFFF;
  --clinical-border:#E2E8F0;
  --clinical-text:#1E293B;
  --clinical-text-muted:#64748B;
  --clinical-amber:#D97706;
  --clinical-amber-light:#FEF3C7;
  --clinical-green:#16A34A;
  --clinical-green-light:#DCFCE7;
  --clinical-blue:#2563EB;
  --clinical-blue-light:#DBEAFE;
  --clinical-red:#DC2626;
  --clinical-red-light:#FEE2E2;
  --clinical-purple:#7C3AED;
  --clinical-purple-light:#EDE9FE;
  --clinical-indigo:#4F46E5;
  --clinical-indigo-light:#E0E7FF;

  min-height:100%;

  padding:28px;

  background:var(--clinical-bg);

  font-family:-apple-system,"Segoe UI",Roboto,Inter,Arial,sans-serif;

  color:var(--clinical-text);

}


.page-header{

  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  margin-bottom:22px;

}

.eyebrow{

  text-transform:uppercase;
  letter-spacing:.08em;
  font-size:12px;
  font-weight:700;
  color:var(--clinical-teal);
  margin:0 0 6px;

}


.page-title{

  color:var(--clinical-navy);

  font-size:26px;

  font-weight:700;

  margin:0;

}

.count-badge{

  font-size:13px;
  font-weight:600;
  color:var(--clinical-teal);
  background:var(--clinical-teal-light);
  padding:5px 12px;
  border-radius:999px;

}




.table-card{

  background:var(--clinical-surface);

  padding:8px;

  border-radius:16px;

  box-shadow:0 1px 2px rgba(15,42,67,0.04);

  border:1px solid var(--clinical-border);

  overflow-x:auto;

}




.appointments-table{

  width:100%;

  border-collapse:collapse;

}





.appointments-table th{

  background:var(--clinical-bg);

  color:var(--clinical-text-muted);

  font-size:12px;

  text-transform:uppercase;

  letter-spacing:.04em;

  font-weight:700;

  padding:14px 18px;

  text-align:left;

  border-bottom:1px solid var(--clinical-border);

}





.appointments-table td{

  padding:16px 18px;

  border-bottom:1px solid var(--clinical-border);

  font-size:14px;

}

.appointments-table tbody tr:last-child td{

  border-bottom:none;

}

.appointments-table tbody tr:hover{

  background:var(--clinical-bg);

}





.doctor-name{

  font-weight:700;

  color:var(--clinical-navy);

}

.speciality{

  color:var(--clinical-text-muted);

}

.appointment-date{

  color:var(--clinical-text);

}




.status{

  display:inline-block;

  padding:6px 14px;

  border-radius:999px;

  font-weight:700;

  font-size:12px;

  text-transform:capitalize;

  background:var(--clinical-teal-light);

  color:var(--clinical-teal);

}

.status--pending{

  background:var(--clinical-amber-light);
  color:var(--clinical-amber);

}

.status--confirmed{

  background:var(--clinical-blue-light);
  color:var(--clinical-blue);

}

.status--completed{

  background:var(--clinical-green-light);
  color:var(--clinical-green);

}

.status--cancelled{

  background:var(--clinical-red-light);
  color:var(--clinical-red);

}



.actions-cell{

  white-space:nowrap;

}

.action-btn{

  margin:3px;

  padding:8px 14px;

  border:none;

  border-radius:8px;

  cursor:pointer;

  font-size:13px;

  font-weight:600;

  color:white;

  transition:opacity .15s ease, transform .15s ease;

}

.action-btn:hover{

  opacity:.9;
  transform:translateY(-1px);

}



.reschedule-btn{

  background:var(--clinical-amber);

}



.feedback-btn{

  background:var(--clinical-blue);

}



.feedback-btn.disabled{

  background:#9CA3AF;

  cursor:not-allowed;

  transform:none;

}



.prescription-btn{

  background:var(--clinical-green);

}


.empty-state{

  text-align:center;

  padding:56px 0;

  color:var(--clinical-text-muted);

}

.empty-icon{

  font-size:34px;

  margin-bottom:10px;

}



.modal-overlay{

  position:fixed;

  top:0;

  left:0;

  width:100%;

  height:100%;

  background:rgba(15,42,67,.5);

  display:flex;

  align-items:center;

  justify-content:center;

  z-index:50;

}



.feedback-modal{

  background:var(--clinical-surface);

  padding:28px;

  border-radius:16px;

  width:360px;

  max-width:90vw;

  display:flex;

  flex-direction:column;

  gap:12px;

  box-shadow:0 20px 40px rgba(15,42,67,0.2);

}

.feedback-modal h2{

  margin:0 0 4px;

  font-size:19px;

  color:var(--clinical-navy);

}

.feedback-modal label{

  font-size:13px;

  font-weight:600;

  color:var(--clinical-text-muted);

  margin-bottom:-6px;

}

.modal-subtext{

  font-size:13px;

  color:var(--clinical-text-muted);

  background:var(--clinical-bg);

  padding:10px 12px;

  border-radius:10px;

  margin:0;

}



.feedback-modal input,
.feedback-modal textarea,
.feedback-modal select{

  padding:10px 12px;

  border:1px solid var(--clinical-border);

  border-radius:8px;

  font-size:14px;

  font-family:inherit;

  color:var(--clinical-text);

}

.feedback-modal textarea{

  min-height:80px;
  resize:vertical;

}

.modal-actions{

  display:flex;

  gap:10px;

  margin-top:6px;

}

.modal-actions button{

  flex:1;

}



.submit-btn{

  background:var(--clinical-green);

  color:white;

  border:none;

  padding:11px;

  border-radius:10px;

  font-weight:600;

  cursor:pointer;

}



.cancel-btn{

  background:var(--clinical-bg);

  color:var(--clinical-text);

  border:1px solid var(--clinical-border);

  padding:11px;

  border-radius:10px;

  font-weight:600;

  cursor:pointer;

}


@media(max-width:700px){

  .appointments-page{
    padding:16px;
  }

  .page-header{

    flex-direction:column;
    align-items:flex-start;
    gap:10px;

  }

}


</style>