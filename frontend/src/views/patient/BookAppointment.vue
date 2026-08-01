<script setup>

import {ref,onMounted,computed} from "vue";
import {useRoute,useRouter} from "vue-router";
import api from "../../api/axios";
import BackButton from "../../components/BackButton.vue"

console.log("🔥 book Appointment FILE LOADED");


const route = useRoute();
const router = useRouter();


const doctor = ref(null);


const appointmentDateTime = ref("");


const booking = ref(false);


// ===== UI-only state for the slot picker (no backend / data change) =====

const selectedDateISO = ref("");   // e.g. "2026-08-25"
const selectedTimeISO = ref("");   // e.g. "12:45"
const showManualInput = ref(false);
const dayScrollStart = ref(0);     // for the ‹ › paging of the day strip
const isFavorite = ref(false);     // purely cosmetic, not persisted



// Get Doctor Details

const getDoctor = async()=>{


try{


const res = await api.get(
`/patient/doctors/${route.params.doctorId}`
);

doctor.value=res.data;


}catch(error){

console.log(error);

}


}



// =======================
// Time helpers (UI only — parse the same startTime/endTime strings
// already stored on the doctor's availability, e.g. "8:00 AM")
// =======================

const parseTimeToMinutes = (t) => {

if(!t) return null;

const match = t.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);

if(!match) return null;

let [, h, m, ampm] = match;

h = parseInt(h);
m = parseInt(m);

if(ampm){
  ampm = ampm.toUpperCase();
  if(ampm === "PM" && h !== 12) h += 12;
  if(ampm === "AM" && h === 12) h = 0;
}

return h * 60 + m;

};


const minutesToDisplay = (mins) => {

let h = Math.floor(mins / 60);
const m = mins % 60;
const ampm = h >= 12 ? "PM" : "AM";

h = h % 12 || 12;

return `${h}:${m.toString().padStart(2,"0")} ${ampm}`;

};


const minutesToISO = (mins) => {

const h = Math.floor(mins / 60).toString().padStart(2,"0");
const m = (mins % 60).toString().padStart(2,"0");

return `${h}:${m}`;

};



// =======================
// Upcoming days that actually have availability
// =======================

const todayISO = new Date().toISOString().slice(0,10);

const nowMinutes = new Date().getHours()*60 + new Date().getMinutes();


const upcomingDays = computed(()=>{

if(!doctor.value?.availability?.length) return [];

const list = [];

for(let i=0;i<30;i++){

const d = new Date();

d.setDate(d.getDate()+i);

const iso = d.toISOString().slice(0,10);

// never show a date that has already passed
if(iso < todayISO) continue;

const weekdayShort = d.toLocaleDateString("en-US",{weekday:"short"});

const matches = doctor.value.availability.filter(
slot => slot.day === weekdayShort
);

if(matches.length){

list.push({

iso,

dayLabel: weekdayShort,

dateLabel: d.getDate(),

slots: matches

});

}

}

return list;

});


const visibleDays = computed(()=>{

return upcomingDays.value.slice(dayScrollStart.value, dayScrollStart.value + 7);

});


const canScrollDaysBack = computed(()=> dayScrollStart.value > 0);

const canScrollDaysForward = computed(()=>{

return dayScrollStart.value + 7 < upcomingDays.value.length;

});


const scrollDays = (dir)=>{

const next = dayScrollStart.value + (dir*7);

if(next < 0) return;

if(next >= upcomingDays.value.length) return;

dayScrollStart.value = next;

};



// =======================
// Time slots for the selected day
// =======================

const selectedDay = computed(()=>{

return upcomingDays.value.find(d => d.iso === selectedDateISO.value) || null;

});


const timeSlots = computed(()=>{

if(!selectedDay.value) return [];

const out = [];

const isToday = selectedDay.value.iso === todayISO;

selectedDay.value.slots.forEach(range=>{

const start = parseTimeToMinutes(range.startTime);
const end = parseTimeToMinutes(range.endTime);

if(start===null || end===null) return;

for(let t=start; t<end; t+=30){

// if it's today, don't offer times that have already passed
if(isToday && t <= nowMinutes) continue;

out.push(t);

}

});

return out;

});



const pickDay = (day)=>{

selectedDateISO.value = day.iso;

selectedTimeISO.value = "";

appointmentDateTime.value = "";

};


const pickTime = (mins)=>{

selectedTimeISO.value = minutesToISO(mins);

appointmentDateTime.value = `${selectedDateISO.value}T${selectedTimeISO.value}`;

};



// Book Appointment

const bookAppointment = async()=>{


if(booking.value) return;


// final guard: never allow booking a date/time that has already passed
if(appointmentDateTime.value && new Date(appointmentDateTime.value) < new Date()){

window.notify("Please choose a valid upcoming date and time");

return;

}


// console.log("BOOK BUTTON CLICKED");

// console.log("Doctor ID:", route.params.doctorId);

// console.log("Date:", appointmentDateTime.value);


booking.value = true;


try{


const res = await api.post("/patient/appointment",{


doctor:route.params.doctorId,


appointmentDateTime:appointmentDateTime.value


});


// console.log(res.data);


window.notify("Appointment booked successfully");


}catch(error){


console.log(error.response?.data || error.message);


window.notify(
error.response?.data?.message ||
"Error booking appointment"
);


}
finally{

booking.value = false;

}


}




onMounted(()=>{


getDoctor();


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


<div class="appointment-page">

  <BackButton/>

<div class="page-header">

  <p class="eyebrow">New Appointment</p>
  <h2 class="page-title">Book Appointment</h2>
</div>




<div v-if="doctor" class="doctor-card">


<!-- ===== Hero ===== -->

<div class="hero">

  <span class="hero-fav" :class="{active:isFavorite}" @click="isFavorite=!isFavorite">
    <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9.5 7c-2.5 4.5-9.5 9-9.5 9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
  </span>

  <span class="hero-avatar">{{ initials(doctor.name) }}</span>

  <span class="dept-pill" v-if="doctor.department">{{doctor.department}}</span>

  <h3 class="doctor-name">{{doctor.name}}</h3>

</div>


<!-- ===== Stat pills ===== -->

<div class="stat-pills">

  <span class="stat-pill" v-if="doctor.experience">
    <svg viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    {{doctor.experience}}
  </span>

  <span class="stat-pill" v-if="doctor.qualifications">
    <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h9M4 12h16M4 17h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    {{doctor.qualifications}}
  </span>

  <span class="stat-pill" v-if="doctor.specialties?.length">
    <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    {{doctor.specialties.join(", ")}}
  </span>

</div>



<!-- ===== Date carousel ===== -->

<h3 class="section-title">
Available Days
</h3>


<div v-if="upcomingDays.length" class="day-picker">

  <div class="day-picker__header">

    <span class="day-picker__count">{{ upcomingDays.length }} days</span>

    <div class="day-picker__nav">

      <button :disabled="!canScrollDaysBack" @click="scrollDays(-1)">‹</button>

      <button :disabled="!canScrollDaysForward" @click="scrollDays(1)">›</button>

    </div>

  </div>

  <div class="day-strip">

    <button
    v-for="day in visibleDays"
    :key="day.iso"
    class="day-chip"
    :class="{active: day.iso===selectedDateISO}"
    @click="pickDay(day)"
    >

      <span class="day-chip__label">{{day.dayLabel}}</span>

      <span class="day-chip__date">{{day.dateLabel}}</span>

    </button>

  </div>

</div>

<p class="no-data" v-else>No availability listed for this doctor.</p>



<!-- ===== Time slots ===== -->

<template v-if="selectedDay">

  <h3 class="section-title">
  Showing Available Time Only
  <span class="slot-count">{{timeSlots.length}} slots</span>
  </h3>

  <div class="slot-grid" v-if="timeSlots.length">

    <button
    v-for="mins in timeSlots"
    :key="mins"
    class="slot-chip"
    :class="{active: minutesToISO(mins)===selectedTimeISO}"
    @click="pickTime(mins)"
    >
      {{ minutesToDisplay(mins) }}
    </button>

  </div>

  <p class="no-data" v-else>No time slots available for this day.</p>

</template>



<!-- ===== Manual fallback ===== -->

<button class="manual-toggle" @click="showManualInput = !showManualInput">
  {{ showManualInput ? "Hide manual date/time" : "Pick date/time manually instead" }}
</button>

<input
v-if="showManualInput"
class="datetime-input"
type="datetime-local"
v-model="appointmentDateTime"
:min="new Date(Date.now() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,16)"
/>



<button
class="confirm-btn"
@click="bookAppointment"
:disabled="booking || !appointmentDateTime"
>

<span v-if="booking" class="btn-spinner"></span>

<svg v-else viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>

{{ booking ? "Booking..." : "Confirm Appointment" }}

</button>




</div>


<div v-else class="doctor-card doctor-card--loading">
  <span class="spinner"></span>
  <p>Loading doctor details...</p>
</div>



</div>



</template>

<style scoped>

.appointment-page {
  min-height: 100%;
}

/* ---------- Header ---------- */

.page-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;
}

/* .back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--text);
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px -2px rgba(15, 23, 42, 0.08);
  transition: transform .18s ease, box-shadow .18s ease;
}

.back-btn svg {
  width: 15px;
  height: 15px;
}

.back-btn:hover {
  transform: translateX(-3px);
  box-shadow: 0 4px 10px -3px rgba(15, 23, 42, 0.12);
} */

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--primary);
  margin: 0;
}

.page-title {
  color: var(--text);
  font-size: 28px;
  margin: 0;
  letter-spacing: -.01em;
}

/* ---------- Doctor card (Premium) ---------- */

.doctor-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 28px;
  border-radius: 20px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
  max-width: 700px;
}

.doctor-card--loading {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--muted);
}

.spinner {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  animation: spin .8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- Hero ---------- */

.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 22px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--border);
}

.hero-fav {
  position: absolute;
  top: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: .2s ease;
}

.hero-fav svg {
  width: 16px;
  height: 16px;
}

.hero-fav.active {
  color: #dc2626;
  border-color: rgba(220,38,38,.3);
}

.hero-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  box-shadow: 0 10px 22px -8px rgba(20, 184, 166, .5);
}

.dept-pill {
  display: inline-block;
  margin-top: 14px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(20, 184, 166, .12);
  color: var(--primary);
  font-weight: 700;
  font-size: 12px;
}

.doctor-name {
  color: var(--text);
  font-size: 22px;
  font-weight: 800;
  margin: 8px 0 0;
  overflow-wrap: break-word;
}

/* ---------- Stat pills ---------- */

.stat-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 6px;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
}

.stat-pill svg {
  width: 14px;
  height: 14px;
  color: var(--primary);
  flex-shrink: 0;
}

.section-title {
  color: var(--text);
  margin-top: 26px;
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slot-count {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

/* ---------- Day picker ---------- */

.day-picker {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px;
}

.day-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.day-picker__count {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.day-picker__nav {
  display: flex;
  gap: 8px;
}

.day-picker__nav button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--text);
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: .18s ease;
}

.day-picker__nav button:disabled {
  opacity: .35;
  cursor: not-allowed;
}

.day-picker__nav button:not(:disabled):hover {
  background: var(--gradient-primary, var(--primary));
  color: #fff;
}

.day-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.day-chip {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 54px;
  padding: 10px 8px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--white);
  cursor: pointer;
  transition: .18s ease;
}

.day-chip__label {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
}

.day-chip__date {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
}

.day-chip:hover {
  border-color: var(--primary);
}

.day-chip.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-color: transparent;
  box-shadow: 0 8px 16px -6px rgba(20, 184, 166, .45);
}

.day-chip.active .day-chip__label,
.day-chip.active .day-chip__date {
  color: #fff;
}

/* ---------- Time slots ---------- */

.slot-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.slot-chip {
  padding: 12px 8px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--text);
  font-weight: 700;
  font-size: 13.5px;
  cursor: pointer;
  transition: .18s ease;
}

.slot-chip:hover {
  border-color: var(--primary);
}

.slot-chip.active {
  background: rgba(20, 184, 166, .12);
  border-color: var(--primary);
  color: var(--primary);
}

.no-data {
  color: var(--muted);
  font-style: italic;
  font-size: 14px;
  margin: 0;
}

/* ---------- Manual fallback ---------- */

.manual-toggle {
  display: block;
  margin: 20px auto 0;
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}

/* ---------- Date input & button ---------- */

.datetime-input {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #f8fafc;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  color: var(--text);
  transition: border-color .2s ease, box-shadow .2s ease;
  margin-top: 12px;
}

.datetime-input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 0 4px rgba(20, 184, 166, .15);
}

.confirm-btn {
  margin-top: 24px;
  padding: 15px 25px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  box-shadow: 0 10px 22px -8px rgba(20, 184, 166, .45);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
  width: 100%;
}

.confirm-btn svg {
  width: 17px;
  height: 17px;
}

.confirm-btn:disabled {
  opacity: .65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .5);
  border-top-color: #fff;
  animation: spin .7s linear infinite;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  filter: brightness(1.05);
  box-shadow: 0 14px 26px -8px rgba(15, 118, 110, .35);
}

.confirm-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .doctor-card {
    padding: 24px;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .page-title {
    font-size: 24px;
  }

  .doctor-card {
    padding: 20px;
    border-radius: 18px;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .page-header {
    gap: 10px;
    margin-bottom: 18px;
  }

  .page-title {
    font-size: 21px;
  }

  .doctor-card {
    padding: 16px;
    border-radius: 16px;
  }

  .hero {
    padding-bottom: 18px;
    margin-bottom: 14px;
  }

  .hero-avatar {
    width: 72px;
    height: 72px;
    font-size: 24px;
  }

  .doctor-name {
    font-size: 19px;
  }

  .stat-pills {
    gap: 8px;
  }

  .stat-pill {
    font-size: 12px;
    padding: 8px 13px;
  }

  .section-title {
    font-size: 15px;
    margin-top: 20px;
    margin-bottom: 12px;
  }

  .slot-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .datetime-input {
    padding: 13px;
    font-size: 14px;
  }

  .confirm-btn {
    width: 100%;
    padding: 14px 20px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page-title {
    font-size: 19px;
  }

  .eyebrow {
    font-size: 11px;
  }

  /* .back-btn {
    padding: 8px 14px;
    font-size: 12px;
    width: 100%;
    justify-content: center;
  } */

  .doctor-card {
    padding: 14px;
  }

  .hero-avatar {
    width: 64px;
    height: 64px;
    font-size: 21px;
  }

  .doctor-name {
    font-size: 17px;
  }

  .dept-pill {
    font-size: 11px;
  }

  .day-chip {
    min-width: 46px;
    padding: 8px 6px;
  }

  .slot-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .slot-chip {
    padding: 10px 6px;
    font-size: 12.5px;
  }

  .confirm-btn {
    font-size: 13.5px;
    padding: 13px 16px;
  }

}

</style>