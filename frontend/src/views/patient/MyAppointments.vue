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


// track which mobile cards are expanded (UI only)
const expandedCards = ref(new Set());

const toggleCard = (id)=>{

if(expandedCards.value.has(id)){
    expandedCards.value.delete(id);
}else{
    expandedCards.value.add(id);
}

expandedCards.value = new Set(expandedCards.value);

};

const isExpanded = (id)=> expandedCards.value.has(id);


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


window.notify(
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



window.notify(
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



window.notify(

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


      window.notify(

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




      window.notify  (

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

        <!-- ===== DESKTOP TABLE ===== -->

        <div class="table-scroll">

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



        <!-- ===== MOBILE CARDS ===== -->

        <div class="mobile-list" v-if="appointments.length">

            <div
            v-for="appointment in appointments"
            :key="appointment._id"
            class="mobile-card"
            >

                <div
                class="mobile-card-main"
                @click="toggleCard(appointment._id)"
                >

                    <span class="mobile-avatar">
                        {{ (appointment.doctor?.user?.name || appointment.doctor?.name || "D").charAt(0).toUpperCase() }}
                    </span>

                    <div class="mobile-card-info">

                        <span class="mobile-card-name">
                            {{ appointment.doctor?.user?.name || appointment.doctor?.name || "Doctor" }}
                        </span>

                        <span class="mobile-card-speciality">
                            {{ appointment.doctor?.specialties?.join(", ") || "—" }}
                        </span>

                        <span class="mobile-card-date">
                            {{ formatDateTime(appointment.appointmentDateTime) }}
                        </span>

                    </div>

                    <div class="mobile-card-side">

                        <span class="status" :class="`status--${appointment.status}`">
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

                </div>

                </transition>

            </div>

        </div>

        <div class="empty-state" v-else-if="!appointments.length">
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

.appointments-page {
  --clinical-navy: #0F2A43;
  --clinical-teal: #0D9488;
  --clinical-teal-light: #CCFBF1;
  --clinical-bg: #F4F7FA;
  --clinical-surface: #FFFFFF;
  --clinical-border: #E2E8F0;
  --clinical-text: #1E293B;
  --clinical-text-muted: #64748B;
  --clinical-amber: #D97706;
  --clinical-amber-light: #FEF3C7;
  --clinical-green: #16A34A;
  --clinical-green-light: #DCFCE7;
  --clinical-blue: #2563EB;
  --clinical-blue-light: #DBEAFE;
  --clinical-red: #DC2626;
  --clinical-red-light: #FEE2E2;
  --clinical-purple: #7C3AED;
  --clinical-purple-light: #EDE9FE;
  --clinical-indigo: #4F46E5;
  --clinical-indigo-light: #E0E7FF;

  min-height: 100%;
  padding: 20px 24px;
  background: var(--clinical-bg);
  font-family: -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif;
  color: var(--clinical-text);
}

/* ---------- Header ---------- */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: 12px;
  font-weight: 700;
  color: var(--clinical-teal);
  margin: 0 0 6px;
}

.page-title {
  color: var(--clinical-navy);
  font-size: 25px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -.01em;
}

.count-badge {
  font-size: 13px;
  font-weight: 600;
  color: var(--clinical-teal);
  background: var(--clinical-teal-light);
  padding: 5px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ---------- Table card (Premium) ---------- */

.table-card {
  background: linear-gradient(180deg, var(--clinical-surface) 0%, #fbfdfe 100%);
  padding: 8px;
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 8px 20px -10px rgba(15, 42, 67, 0.08);
  border: 1px solid var(--clinical-border);
}

.table-scroll {
  overflow-x: auto;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
}

.appointments-table th {
  background: var(--clinical-bg);
  color: var(--clinical-text-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
  font-weight: 700;
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid var(--clinical-border);
  white-space: nowrap;
}

.appointments-table td {
  padding: 16px 18px;
  border-bottom: 1px solid var(--clinical-border);
  font-size: 14px;
}

.appointments-table tbody tr {
  transition: background .2s ease;
}

.appointments-table tbody tr:last-child td {
  border-bottom: none;
}

.appointments-table tbody tr:hover {
  background: var(--clinical-bg);
}

.doctor-name {
  font-weight: 700;
  color: var(--clinical-navy);
  white-space: nowrap;
}

.speciality {
  color: var(--clinical-text-muted);
}

.appointment-date {
  color: var(--clinical-text);
  white-space: nowrap;
}

/* ---------- Status badges ---------- */

.status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  text-transform: capitalize;
  background: var(--clinical-teal-light);
  color: var(--clinical-teal);
  white-space: nowrap;
}

.status--pending {
  background: var(--clinical-amber-light);
  color: var(--clinical-amber);
}

.status--confirmed {
  background: var(--clinical-blue-light);
  color: var(--clinical-blue);
}

.status--completed {
  background: var(--clinical-green-light);
  color: var(--clinical-green);
}

.status--cancelled {
  background: var(--clinical-red-light);
  color: var(--clinical-red);
}

/* ---------- Action buttons (Premium) ---------- */

.actions-cell {
  white-space: nowrap;
}

.action-btn {
  margin: 3px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: white;
  box-shadow: 0 3px 8px -2px rgba(0, 0, 0, .15);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease,
              opacity .15s ease;
}

.action-btn:hover:not(.disabled) {
  filter: brightness(1.06);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -6px rgba(0, 0, 0, .22);
}

.reschedule-btn {
  background: linear-gradient(135deg, var(--clinical-amber), #b45f04);
}

.feedback-btn {
  background: linear-gradient(135deg, var(--clinical-blue), #1e4fc4);
}

.feedback-btn.disabled {
  background: #9CA3AF;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.prescription-btn {
  background: linear-gradient(135deg, var(--clinical-green), #128038);
}

/* ---------- Empty state ---------- */

.empty-state {
  text-align: center;
  padding: 56px 0;
  color: var(--clinical-text-muted);
}

.empty-icon {
  font-size: 34px;
  margin-bottom: 10px;
}

/* ---------- Mobile card list (hidden on desktop) ---------- */

.mobile-list {
  display: none;
}

.mobile-card {
  background: var(--clinical-surface);
  border: 1px solid var(--clinical-border);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(15,42,67,.04), 0 6px 16px -8px rgba(15,42,67,.08);
  margin-bottom: 12px;
  overflow: hidden;
}

.mobile-card-main {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
}

.mobile-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--clinical-teal), var(--clinical-navy));
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 4px 10px -3px rgba(13, 148, 136, .4);
}

.mobile-card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-card-name {
  font-weight: 700;
  font-size: 15px;
  color: var(--clinical-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-card-speciality {
  font-size: 12px;
  color: var(--clinical-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-card-date {
  font-size: 12px;
  color: var(--clinical-text-muted);
}

.mobile-card-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.chevron {
  background: var(--clinical-bg);
  color: var(--clinical-text-muted);
  border: none;
  width: 26px;
  height: 26px;
  padding: 0;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .3s;
}

.chevron.open {
  transform: rotate(90deg);
  background: linear-gradient(135deg, var(--clinical-teal), var(--clinical-navy));
  color: #fff;
}

.mobile-card-details {
  padding: 14px 16px 16px;
  border-top: 1px solid var(--clinical-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-card-details .action-btn {
  width: 100%;
  margin: 0;
  text-align: center;
}

.expand-enter-active,
.expand-leave-active {
  transition: .25s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

/* ---------- Modals (Premium) ---------- */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 42, 67, .55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  box-sizing: border-box;
  animation: fadeIn .2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.feedback-modal {
  background: var(--clinical-surface);
  padding: 28px;
  border-radius: 18px;
  width: 360px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 24px 48px -12px rgba(15, 42, 67, 0.28);
  animation: slideUp .25s cubic-bezier(.22,1,.36,1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.feedback-modal h2 {
  margin: 0 0 4px;
  font-size: 19px;
  color: var(--clinical-navy);
  font-weight: 700;
}

.feedback-modal label {
  font-size: 13px;
  font-weight: 600;
  color: var(--clinical-text-muted);
  margin-bottom: -6px;
}

.modal-subtext {
  font-size: 13px;
  color: var(--clinical-text-muted);
  background: var(--clinical-bg);
  padding: 10px 12px;
  border-radius: 10px;
  margin: 0;
}

.feedback-modal input,
.feedback-modal textarea,
.feedback-modal select {
  padding: 10px 12px;
  border: 1px solid var(--clinical-border);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: var(--clinical-text);
  box-sizing: border-box;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.feedback-modal input:focus,
.feedback-modal textarea:focus,
.feedback-modal select:focus {
  outline: none;
  border-color: var(--clinical-teal);
  box-shadow: 0 0 0 3px rgba(13, 148, 136, .15);
}

.feedback-modal textarea {
  min-height: 80px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.modal-actions button {
  flex: 1;
}

.submit-btn {
  background: linear-gradient(135deg, var(--clinical-green), #128038);
  color: white;
  border: none;
  padding: 11px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 14px -4px rgba(22, 163, 74, .4);
  transition: transform .18s ease, filter .18s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.cancel-btn {
  background: var(--clinical-bg);
  color: var(--clinical-text);
  border: 1px solid var(--clinical-border);
  padding: 11px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform .18s ease, background .18s ease;
}

.cancel-btn:hover {
  transform: translateY(-2px);
  background: #eef2f5;
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .appointments-page {
    padding: 20px 22px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .action-btn {
    padding: 7px 12px;
    font-size: 12.5px;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .appointments-page {
    padding: 18px;
  }

  .page-title {
    font-size: 22px;
  }

  .appointments-table {
    min-width: 720px;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .appointments-page {
    padding: 14px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .table-card {
    border-radius: 16px;
  }

  /* swap table for cards on mobile */

  .table-scroll {
    display: none;
  }

  .mobile-list {
    display: block;
  }

  .feedback-modal {
    padding: 22px;
    border-radius: 16px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .appointments-page {
    padding: 10px;
  }

  .page-title {
    font-size: 18px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .count-badge {
    font-size: 12px;
    padding: 4px 10px;
  }

  .feedback-modal {
    padding: 18px;
    width: 100%;
  }

  .modal-actions {
    flex-direction: column;
  }

}

</style>