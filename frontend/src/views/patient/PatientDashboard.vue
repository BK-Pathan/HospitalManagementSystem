<script setup>

import {
ref,
onMounted
} from "vue";

import {
RouterView
} from "vue-router";

import api from "../../api/axios";
console.log("🔥 Patient Dashbaord FILE LOADED");
const stats = ref({

totalAppointments:0,
pendingAppointments:0,
upcomingAppointments:0,
completedAppointments:0,
totalPrescriptions:0,
doctorsVisited:0,
latestFeedback:null,
upcomingAppointmentList:[]

});



const getStats = async()=>{


try{


const res = await api.get(
"/patient/dashboard"
);



// console.log(
// "FULL DASHBOARD RESPONSE:",
// res.data
// );



if(res.data.success){


stats.value = res.data.data;


}
else{


stats.value = res.data;


}



// console.log(
// "FINAL STATS:",
// stats.value
// );



}
catch(error){


console.log(
"Dashboard Error:",
error.response?.data || error.message
);


}


}



onMounted(()=>{

getStats();

});


</script>



<template>

<div class="dashboard">

  <div class="dashboard-header">
    <div>
      <p class="eyebrow">Patient Overview</p>
      <h1>Your Health Dashboard</h1>
    </div>
  </div>


  <div class="cards">


    <div class="card">
      <div class="card-icon card-icon--total">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div class="card-body">
        <h3>Total Appointments</h3>
        <h1>{{stats.totalAppointments}}</h1>
      </div>
    </div>


    <div class="card">
      <div class="card-icon card-icon--pending">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div class="card-body">
        <h3>Pending Appointments</h3>
        <h1>{{stats.pendingAppointments}}</h1>
      </div>
    </div>

    <div class="card">
      <div class="card-icon card-icon--completed">
        <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="card-body">
        <h3>Completed</h3>
        <h1>{{stats.completedAppointments}}</h1>
      </div>
    </div>


    <div class="card">
      <div class="card-icon card-icon--prescriptions">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="7" rx="3.5" stroke="currentColor" stroke-width="2"/><path d="M8 11v7M16 11v7" stroke="currentColor" stroke-width="2"/></svg>
      </div>
      <div class="card-body">
        <h3>Prescriptions</h3>
        <h1>{{stats.totalPrescriptions}}</h1>
      </div>
    </div>


    <div class="card">
      <div class="card-icon card-icon--doctors">
        <svg viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div class="card-body">
        <h3>Doctors Visited</h3>
        <h1>{{stats.doctorsVisited}}</h1>
      </div>
    </div>


    <div class="card">
      <div class="card-icon card-icon--upcoming">
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="15" r="2" fill="currentColor"/></svg>
      </div>
      <div class="card-body">
        <h3>Upcoming Appointments</h3>
        <h1>{{stats.upcomingAppointments}}</h1>
      </div>
    </div>


    <!-- <div class="card">


    <h3>
    Latest Feedback
    </h3>


    <div v-if="stats.latestFeedback">


    ⭐ {{stats.latestFeedback.rating}}


    <br>


    {{stats.latestFeedback.comment}}


    </div>


    <p v-else>

    No Feedback

    </p>


    </div> -->



  </div>


  <div class="upcoming-panel">


    <div class="panel-header">
      <h2>Upcoming Appointments</h2>
      <span class="panel-count" v-if="stats.upcomingAppointmentList.length">
        {{stats.upcomingAppointmentList.length}} scheduled
      </span>
    </div>



    <div
    v-if="stats.upcomingAppointmentList.length"
    class="appointment-list"
    >



      <div

      class="appointment-card"

      v-for="appointment in stats.upcomingAppointmentList"

      :key="appointment._id"

      >

        <div class="appointment-avatar">
          {{ (appointment.doctor?.name || "D").charAt(0) }}
        </div>

        <div class="appointment-info">

          <h3>
          Dr. {{appointment.doctor?.name}}
          </h3>

          <p class="meta-row">
            <span class="tag">{{appointment.doctor?.department}}</span>
            <span class="specialty" v-if="appointment.doctor?.specialties?.length">
              {{appointment.doctor?.specialties?.join(", ")}}
            </span>
          </p>


        </div>



        <div class="date-box">


          <p class="date-line">

          {{

          new Date(
          appointment.appointmentDateTime
          )
          .toLocaleDateString(
          "en-US",
          {
          weekday:"long",
          year:"numeric",
          month:"short",
          day:"numeric"
          }
          )

          }}

          </p>


          <p class="time-line">

          {{

          new Date(
          appointment.appointmentDateTime
          )
          .toLocaleTimeString(
          "en-US",
          {
          hour:"2-digit",
          minute:"2-digit"
          }
          )

          }}

          </p>


        </div>


      </div>



    </div>


    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <p>No upcoming appointments.</p>
    </div>


  </div>




  <RouterView />


</div>


</template>



<style scoped>

.dashboard {
  padding: 28px;
  color: var(--text);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 14px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: .04em;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 6px;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  letter-spacing: -.01em;
}

/* ---------- Stat cards (Premium) ---------- */

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}

.card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 22px;
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              box-shadow .3s cubic-bezier(.22,1,.36,1);
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  opacity: 0;
  transition: opacity .3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 16px 28px -10px rgba(15, 23, 42, 0.16);
}

.card:hover::before {
  opacity: 1;
}

.card-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(20,184,166,.18), rgba(20,184,166,.06));
  color: var(--primary);
  box-shadow: inset 0 1px 1px rgba(255,255,255,.5);
  transition: transform .3s ease;
}

.card:hover .card-icon {
  transform: scale(1.08) rotate(-2deg);
}

.card-icon svg {
  width: 24px;
  height: 24px;
}

.card-icon--total         { background: linear-gradient(135deg, rgba(20,184,166,.18), rgba(20,184,166,.06)); color: var(--primary); }
.card-icon--pending       { background: linear-gradient(135deg, rgba(234,179,8,.20), rgba(234,179,8,.06)); color: #ca8a04; }
.card-icon--completed     { background: linear-gradient(135deg, rgba(34,197,94,.20), rgba(34,197,94,.06)); color: #16a34a; }
.card-icon--prescriptions { background: linear-gradient(135deg, rgba(37,99,235,.20), rgba(37,99,235,.06)); color: #2563eb; }
.card-icon--doctors       { background: linear-gradient(135deg, rgba(124,58,237,.20), rgba(124,58,237,.06)); color: #7c3aed; }
.card-icon--upcoming      { background: linear-gradient(135deg, rgba(79,70,229,.20), rgba(79,70,229,.06)); color: #4f46e5; }

.card-body h3 {
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: .03em;
}

.card-body h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  line-height: 1;
  letter-spacing: -.02em;
}

/* ---------- Upcoming panel (Premium) ---------- */

.upcoming-panel {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 8px;
}

.upcoming-panel h2 {
  color: var(--text);
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.panel-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  background: rgba(20, 184, 166, .12);
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.appointment-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
  transition: background .2s ease, transform .2s ease;
}

.appointment-card:hover {
  background: #eef3f8;
  transform: translateX(2px);
}

.appointment-avatar {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 6px 14px -4px rgba(20, 184, 166, .5);
}

.appointment-info {
  flex: 1;
  min-width: 0;
}

.appointment-info h3 {
  color: var(--text);
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 6px;
  overflow-wrap: break-word;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin: 0;
}

.tag {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  background: rgba(20, 184, 166, .12);
  padding: 3px 9px;
  border-radius: 999px;
  white-space: nowrap;
}

.specialty {
  font-size: 13px;
  color: var(--muted);
}

.date-box {
  text-align: right;
  min-width: 150px;
  flex-shrink: 0;
}

.date-line {
  font-weight: 600;
  font-size: 13px;
  color: var(--text);
  margin: 0 0 4px;
}

.time-line {
  font-weight: 700;
  font-size: 14px;
  color: var(--primary);
  margin: 0;
}

/* ---------- Empty state ---------- */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  padding: 44px 0;
  color: var(--muted);
}

.empty-state svg {
  width: 34px;
  height: 34px;
  opacity: .6;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .dashboard {
    padding:24px;
  }

}


/* ==========================
   Laptop
========================== */
@media (max-width:1200px){

  .cards{
    grid-template-columns:repeat(3,1fr);
    gap:16px;
  }


  .card{
    padding:18px;
  }


  .card-body h1{
    font-size:26px;
  }

}



/* ==========================
   Tablet
========================== */
@media(max-width:992px){

  .dashboard-header h1{
    font-size:24px;
  }


  .cards{
    grid-template-columns:repeat(2,1fr);
    gap:14px;
  }


  .card{
    gap:12px;
  }


  .card-icon{

    width:42px;
    height:42px;
    min-width:42px;

  }


  .card-body h3{
    font-size:11px;
  }


  .card-body h1{
    font-size:23px;
  }


}



/* ==========================
   Mobile
========================== */
@media(max-width:768px){


.dashboard{

padding:16px;

}


.dashboard-header{

align-items:flex-start;
margin-bottom:20px;

}


.dashboard-header h1{

font-size:22px;

}



.cards{

grid-template-columns:repeat(2,1fr);
gap:12px;

}



.card{

padding:14px;
border-radius:15px;
gap:10px;
min-height:100px;

}



.card-icon{

width:36px;
height:36px;
min-width:36px;
border-radius:10px;

}



.card-icon svg{

width:18px;
height:18px;

}



.card-body{

min-width:0;

}



.card-body h3{

font-size:10px;
white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;

}



.card-body h1{

font-size:20px;

}



/* Upcoming */

.upcoming-panel{

padding:16px;
border-radius:16px;

}



.panel-header h2{

font-size:16px;

}



.appointment-card{

padding:14px;
gap:12px;

}


}



/* ==========================
   Small Mobile
========================== */
@media(max-width:480px){


.dashboard{

padding:12px;

}



.dashboard-header h1{

font-size:20px;

}



/* Keep 2 cards */

.cards{

grid-template-columns:repeat(2,1fr);
gap:10px;

}



.card{

padding:12px;
min-height:95px;
gap:8px;

}



/* Icon */

.card-icon{

width:32px;
height:32px;
min-width:32px;

}



.card-icon svg{

width:15px;
height:15px;

}



.card-body h3{

font-size:9px;

}



.card-body h1{

font-size:18px;

}



/* Appointment */

.appointment-card{

flex-direction:column;
align-items:flex-start;

}



.date-box{

width:100%;
text-align:left;
min-width:auto;

}



.meta-row{

gap:5px;

}



.tag{

font-size:10px;

}



.specialty{

font-size:11px;

}


}
</style>