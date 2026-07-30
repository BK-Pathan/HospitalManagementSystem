<script setup>

import {ref,onMounted} from "vue";
import {useRouter} from "vue-router";
import api from "../../api/axios";

console.log("🔥 Doctors FILE LOADED");

const doctors=ref([]);

const router=useRouter();


const getRelatedDoctors = async()=>{

if(!doctor.value?.department) return;


relatedLoading.value = true;


try{

const res = await api.get(
"/patient/doctors",
{
params:{
department: doctor.value.department
}
}
);


const list = Array.isArray(res.data)
? res.data
: (res.data.doctors || []);


relatedDoctors.value = list.filter(
(item)=> item._id !== doctor.value._id
);


}
catch(error){

console.log(error);

}
finally{

relatedLoading.value=false;

}

};

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


// Display-only helper (no backend / data change)
// Deterministically assigns one of the theme accent colors to a
// doctor based on their name, purely for visual variety.

const accentPalette = ["teal", "blue", "purple", "indigo", "amber", "green"];

const accentFor = (name) => {
  if (!name) return accentPalette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return accentPalette[Math.abs(hash) % accentPalette.length];
};


</script>



<template>

<div class="page">


    <div class="header">

        <div>

            <p class="eyebrow">Directory</p>

            <h2>
                Available Doctors
            </h2>


            <p class="subtitle">
                Find and book an appointment with our specialists
            </p>

        </div>

        <span class="count-badge" v-if="doctors.length">
            {{ doctors.length }} specialist{{ doctors.length === 1 ? "" : "s" }}
        </span>


    </div>




    <div class="doctor-grid" v-if="doctors.length">


        <div
        v-for="doctor in doctors"
        :key="doctor._id"
        class="doctor-card"
        :class="`accent--${accentFor(doctor.name)}`"
        >

            <div class="card-top">

                <span class="avatar">{{ initials(doctor.name) }}</span>

                <div class="doctor-identity">
                    <h3 class="doctor-name">Dr. {{doctor.name}}</h3>
                    <span class="dept-pill"> Department :{{doctor.department}}</span>
                </div>

            </div>


            <p class="specialties" v-if="doctor.specialties?.length">
               Specialties : {{doctor.specialties.join(", ")}}
            </p>


            <div class="stat-row">

                <div class="stat">
                    <span class="stat-icon">🎓</span>
                    <span>{{doctor.qualifications}}</span>
                </div>

                <div class="stat">
                    <span class="stat-icon">📈</span>
                    <span>{{doctor.experience}} yrs experience</span>
                </div>

            </div>


            <div class="card-divider"></div>


            <div class="availability-block">

                <p class="availability-label">Availability</p>

                <div class="availability" v-if="doctor.availability?.length">

                    <span
                    v-for="item in doctor.availability.slice(0,3)"
                    :key="item._id"
                    class="time-slot"
                    >
                        <span class="time-slot__day">{{item.day}}</span>
                        {{item.startTime}} – {{item.endTime}}
                    </span>

                    <span class="more-slots" v-if="doctor.availability.length > 3">
                        +{{ doctor.availability.length - 3 }} more
                    </span>

                </div>

                <span class="no-data" v-else>Not set</span>

            </div>


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

        </div>


    </div>

    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <p>No doctors available right now.</p>
    </div>



</div>


</template>

<style scoped>

.page {
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

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 22px;
  gap: 16px;
  flex-wrap: wrap;
}

.eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--clinical-teal);
  margin: 0 0 6px;
}

.header h2 {
  color: var(--clinical-navy);
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -.01em;
}

.header .subtitle {
  color: var(--clinical-text-muted);
  margin-top: 6px;
  font-size: 14px;
}

.count-badge {
  font-size: 13px;
  font-weight: 600;
  color: var(--clinical-teal);
  background: var(--clinical-teal-light);
  padding: 6px 14px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ---------- Doctor grid ---------- */

.doctor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* ---------- Doctor card (Premium) ---------- */

.doctor-card {
  --card-accent: var(--clinical-teal);
  --card-accent-light: var(--clinical-teal-light);

  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--clinical-surface) 0%, #fbfdfe 100%);
  border: 1px solid var(--clinical-border);
  border-radius: 18px;
  padding: 22px;
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 8px 20px -10px rgba(15, 42, 67, 0.08);
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              box-shadow .3s cubic-bezier(.22,1,.36,1),
              border-color .3s ease;
  overflow: hidden;
}

.doctor-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-accent), var(--card-accent));
}

.doctor-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 20px 34px -14px rgba(15, 42, 67, 0.18);
  border-color: var(--card-accent);
}

.accent--teal   { --card-accent: var(--clinical-teal);   --card-accent-light: var(--clinical-teal-light); }
.accent--blue   { --card-accent: var(--clinical-blue);   --card-accent-light: var(--clinical-blue-light); }
.accent--purple { --card-accent: var(--clinical-purple); --card-accent-light: var(--clinical-purple-light); }
.accent--indigo { --card-accent: var(--clinical-indigo); --card-accent-light: var(--clinical-indigo-light); }
.accent--amber  { --card-accent: var(--clinical-amber);  --card-accent-light: var(--clinical-amber-light); }
.accent--green  { --card-accent: var(--clinical-green);  --card-accent-light: var(--clinical-green-light); }

.card-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.avatar {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-accent);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: .02em;
  box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--card-accent) 60%, transparent);
}

.doctor-identity {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.doctor-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--clinical-navy);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dept-pill {
  display: inline-block;
  width: fit-content;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--card-accent-light);
  color: var(--card-accent);
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .03em;
}

.specialties {
  color: var(--clinical-text-muted);
  font-size: 13px;
  margin: 0 0 14px;
  line-height: 1.5;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--clinical-text);
}

.stat-icon {
  font-size: 13px;
}

.card-divider {
  height: 1px;
  background: var(--clinical-border);
  margin-bottom: 16px;
}

.availability-block {
  margin-bottom: 18px;
  flex-grow: 1;
}

.availability-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--clinical-text-muted);
  margin: 0 0 10px;
}

.no-data {
  color: var(--clinical-text-muted);
  font-style: italic;
  font-size: 13px;
}

.availability {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-slot {
  background: var(--card-accent-light);
  color: var(--card-accent);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.time-slot__day {
  font-weight: 700;
  margin-right: 5px;
}

.more-slots {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px dashed var(--clinical-border);
  color: var(--clinical-text-muted);
  font-size: 12px;
  font-weight: 600;
}

/* ---------- Action buttons (Premium) ---------- */

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.book-btn,
.profile-btn {
  padding: 11px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease,
              background .18s ease;
}

.book-btn svg,
.profile-btn svg {
  width: 15px;
  height: 15px;
}

.book-btn {
  color: white;
  background: var(--card-accent);
  box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--card-accent) 50%, transparent);
}

.profile-btn {
  background: var(--clinical-surface);
  color: var(--clinical-navy);
  border: 1px solid var(--clinical-border);
}

.book-btn:hover,
.profile-btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.05);
  box-shadow: 0 10px 20px -8px rgba(15, 42, 67, .18);
}

.book-btn:active,
.profile-btn:active {
  transform: translateY(-1px);
}

/* ---------- Empty state ---------- */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 70px 20px;
  color: var(--clinical-text-muted);
  background: linear-gradient(180deg, var(--clinical-surface) 0%, #fbfdfe 100%);
  border: 1px solid var(--clinical-border);
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 8px 20px -10px rgba(15, 42, 67, 0.08);
}

.empty-state svg {
  width: 36px;
  height: 36px;
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

  .page {
    padding: 20px 22px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .doctor-grid {
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .page {
    padding: 18px;
  }

  .header h2 {
    font-size: 23px;
  }

  .doctor-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .page {
    padding: 14px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 18px;
  }

  .header h2 {
    font-size: 21px;
  }

  .doctor-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .doctor-card {
    padding: 18px;
    border-radius: 16px;
  }

  .avatar {
    width: 46px;
    height: 46px;
    font-size: 14px;
  }

  .doctor-name {
    font-size: 15px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page {
    padding: 10px;
  }

  .header h2 {
    font-size: 19px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .count-badge {
    font-size: 12px;
    padding: 5px 12px;
  }

  .doctor-card {
    padding: 14px;
  }

  .card-top {
    gap: 10px;
    margin-bottom: 10px;
  }

  .avatar {
    width: 42px;
    height: 42px;
    font-size: 13px;
    border-radius: 12px;
  }

  .specialties {
    font-size: 12.5px;
  }

  .time-slot,
  .more-slots {
    font-size: 11px;
    padding: 5px 8px;
  }

  .book-btn,
  .profile-btn {
    padding: 10px 14px;
    font-size: 12.5px;
  }

}

</style>