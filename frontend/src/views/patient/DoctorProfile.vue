<script setup>

import {
ref,
onMounted
} from "vue";

import {
useRoute,
useRouter
} from "vue-router";

import api from "../../api/axios";

console.log("🔥 Docotr Profile FILE LOADED");

const route = useRoute();

const router = useRouter();
const relatedDoctors = ref([]);

const doctor = ref(null);

const feedbacks = ref([]);

const averageRating = ref(0);

const loading = ref(true);

// UI-only, not persisted to backend
const isFavorite = ref(false);




const getDoctorProfile = async()=>{


try{


const res = await api.get(

`/patient/doctors/profile/${route.params.id}`

);



// console.log(
// "Doctor Profile:",
// res.data
// );



doctor.value =
res.data.doctor;


feedbacks.value =
res.data.feedbacks;


averageRating.value =
res.data.averageRating;

relatedDoctors.value = res.data.relatedDoctors || [];

}
catch(error){


console.log(
error
);


}
finally{


loading.value=false;


}



};







const bookAppointment = ()=>{


router.push(

`/patient/appointments/book/${doctor.value._id}`

);


};







onMounted(()=>{


getDoctorProfile();


});




</script>





<template>


<div class="profile-page">



  <div v-if="loading" class="loading-state">

    <div class="spinner"></div>
    <p>Loading doctor profile...</p>

  </div>






  <div

  v-else-if="doctor"

  class="profile-card"

  >




    <!-- ===== MOBILE HERO (reference-style) ===== -->

    <div class="mobile-hero">

      <div class="mobile-hero-photo">

<img
:src="
doctor.profileImage 
? doctor.profileImage 
: 'https://cdn-icons-png.flaticon.com/512/387/387561.png'
"
class="doctor-img"
/>
        <button class="hero-icon-btn hero-icon-btn--back" @click="router.back()">
          <svg viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <button
        class="hero-icon-btn hero-icon-btn--fav"
        :class="{active:isFavorite}"
        @click="isFavorite = !isFavorite"
        >
          <svg viewBox="0 0 24 24" :fill="isFavorite ? 'currentColor' : 'none'"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9.5 7c-2.5 4.5-9.5 9-9.5 9z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        </button>

      </div>

      <div class="mobile-hero-card">

        <h1 class="mobile-hero-name">Dr. {{doctor.name}}</h1>

        <p class="mobile-hero-role" v-if="doctor.specialties?.length">
          {{doctor.specialties.join(", ")}}
        </p>

        <p class="mobile-hero-role" v-else>{{doctor.department}}</p>

        <div class="mobile-stat-row">

          <div class="mobile-stat">
            <span class="mobile-stat-value">⭐ {{averageRating}}</span>
            <span class="mobile-stat-label">Ratings</span>
          </div>

          <span class="mobile-stat-divider"></span>

          <div class="mobile-stat">
            <span class="mobile-stat-value">{{doctor.experience}}</span>
            <span class="mobile-stat-label">Experience</span>
          </div>

          <span class="mobile-stat-divider"></span>

          <div class="mobile-stat">
            <span class="mobile-stat-value">{{feedbacks.length}}</span>
            <span class="mobile-stat-label">Reviews</span>
          </div>

        </div>

      </div>

    </div>


    


    <div class="doctor-header">


      <div class="doctor-img-wrap">
<img
:src="
doctor.profileImage 
? doctor.profileImage 
: 'https://cdn-icons-png.flaticon.com/512/387/387561.png'
"
class="doctor-img"
/>
      </div>



      <div class="doctor-header-info">


        <p class="eyebrow">Doctor Profile</p>

        <h1>

        Dr. {{doctor.name}}

        </h1>


        <div class="header-meta">

          <span class="tag">🏥 {{doctor.department}}</span>

          <span class="tag tag--muted" v-if="doctor.specialties?.length">
            {{doctor.specialties.join(", ")}}
          </span>

        </div>



        <div class="rating">

          <span class="rating-stars">⭐ {{averageRating}}</span>
          <span class="rating-label">{{feedbacks.length}} review{{feedbacks.length === 1 ? '' : 's'}}</span>

        </div>


      </div>


      <button
      class="book-btn book-btn--header"
      @click="router.push(`/patient/book-appointment/${doctor._id}`)"
      >

      Book Appointment

      </button>



    </div>









    <div class="info-grid">



      <div class="info-card">
        <span class="info-icon">🏥</span>
        <div>
          <p class="info-label">Department</p>
          <p class="info-value">{{doctor.department}}</p>
        </div>
      </div>

      <div class="info-card">
        <span class="info-icon">🎓</span>
        <div>
          <p class="info-label">Qualification</p>
          <p class="info-value">{{doctor.qualifications}}</p>
        </div>
      </div>

      <div class="info-card">
        <span class="info-icon">📈</span>
        <div>
          <p class="info-label">Experience</p>
          <p class="info-value">{{doctor.experience}} Years</p>
        </div>
      </div>

      <div class="info-card">
        <span class="info-icon">📞</span>
        <div>
          <p class="info-label">Contact</p>
          <p class="info-value">{{doctor.contactInformation}}</p>
        </div>
      </div>



    </div>









    <div class="section availability">


      <h2>Availability</h2>


      <div class="slot-list">

        <div

        v-for="slot in doctor.availability"

        :key="slot._id"

        class="slot"

        >


          <span class="slot-day">{{slot.day}}</span>


          <span class="slot-time">{{slot.startTime}} – {{slot.endTime}}</span>



        </div>

      </div>


    </div>









    <button
    class="book-btn book-btn--full"
    @click="router.push(`/patient/book-appointment/${doctor._id}`)"
    >

    Book Appointment

    </button>








    <div class="section reviews">


      <h2>

      Patient Reviews

      </h2>





      <div class="review-list" v-if="feedbacks.length">

        <div

        v-for="feedback in feedbacks"

        :key="feedback._id"

        class="review-card"

        >


<div class="review-avatar">
  {{
    (feedback.patient?.user?.name || "P")
    .charAt(0)
    .toUpperCase()
  }}
</div>

          <div class="review-body">

            <div class="review-top">

              <span class="review-stars">⭐ {{feedback.rating}}</span>
<small class="review-author">
  {{feedback.patient?.user?.name || "Anonymous Patient"}}
</small>

            </div>


            <p class="review-comment">

            {{feedback.comment}}

            </p>


          </div>



        </div>

      </div>






      <div class="empty-state" v-else>

        <div class="empty-icon">💬</div>
        <p>No reviews yet</p>

      </div>





    </div>





  </div>





</div>


<div 
class="section related-section"
v-if="relatedDoctors.length"
>


<h2>
Related Doctors
</h2>


<div class="related-grid">


<div
v-for="doc in relatedDoctors"
:key="doc._id"
class="related-card"
@click="router.push(`/patient/doctors/profile/${doc._id}`)"
>


<img
:src="
doc.profileImage 
? doc.profileImage 
: 'https://cdn-icons-png.flaticon.com/512/387/387561.png'
"
class="related-img"
/>


<div class="related-info">


<h3>
Dr. {{doc.name}}
</h3>


<p>
{{doc.department}}
</p>


<span v-if="doc.specialties?.length">
{{doc.specialties.join(', ')}}
</span>


<p>
{{doc.experience}} Years Experience
</p>


</div>


</div>


</div>


</div>

</template>








<style scoped>

.profile-page {
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

  padding: 20px 24px;
  background: var(--clinical-bg);
  font-family: -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif;
  color: var(--clinical-text);
}

/* ---------- Loading ---------- */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 80px 0;
  color: var(--clinical-text-muted);
}

.spinner {
  width: 34px;
  height: 34px;
  border: 3px solid var(--clinical-border);
  border-top-color: var(--clinical-teal);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---------- Profile card (Premium) ---------- */

.profile-card {
  background: linear-gradient(180deg, var(--clinical-surface) 0%, #fbfdfe 100%);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid var(--clinical-border);
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 8px 20px -10px rgba(15, 42, 67, 0.08);
}

/* ---------- Mobile hero (reference-style, hidden on desktop) ---------- */

.mobile-hero {
  display: none;
}

/* ---------- Doctor header ---------- */

.doctor-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--clinical-border);
  flex-wrap: wrap;
}

.doctor-img-wrap {
  width: 112px;
  height: 112px;
  padding: 4px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--clinical-teal), var(--clinical-navy));
  box-shadow: 0 8px 18px -6px rgba(15, 42, 67, .4);
  flex-shrink: 0;
}


.doctor-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  display: block;
  border: 3px solid var(--clinical-surface);
}


.doctor-header-info {
  flex: 1;
  min-width: 200px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: .08em;
  font-size: 12px;
  font-weight: 700;
  color: var(--clinical-teal);
  margin: 0 0 4px;
}

.doctor-header h1 {
  font-size: 27px;
  font-weight: 700;
  color: var(--clinical-navy);
  margin: 0 0 10px;
  letter-spacing: -.01em;
  overflow-wrap: break-word;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  font-size: 13px;
  font-weight: 600;
  color: var(--clinical-teal);
  background: var(--clinical-teal-light);
  padding: 5px 12px;
  border-radius: 999px;
}

.tag--muted {
  color: var(--clinical-text-muted);
  background: var(--clinical-bg);
  border: 1px solid var(--clinical-border);
}

.rating {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.rating-stars {
  font-size: 16px;
  font-weight: 700;
  color: var(--clinical-amber);
}

.rating-label {
  font-size: 13px;
  color: var(--clinical-text-muted);
}

/* ---------- Info grid ---------- */

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-top: 24px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--clinical-bg);
  border: 1px solid var(--clinical-border);
  border-radius: 12px;
  padding: 16px;
  transition: transform .2s ease, box-shadow .2s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -8px rgba(15, 42, 67, .12);
}

.info-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: var(--clinical-text-muted);
  margin: 0 0 4px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--clinical-navy);
  margin: 0;
  overflow-wrap: break-word;
}

/* ---------- Sections ---------- */

.section {
  margin-top: 28px;
}

.section h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--clinical-navy);
  margin: 0 0 14px;
}

.slot-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.slot {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--clinical-teal-light);
  padding: 12px 16px;
  border-radius: 12px;
  color: var(--clinical-navy);
  min-width: 130px;
  transition: transform .2s ease;
}

.slot:hover {
  transform: translateY(-2px);
}

.slot-day {
  font-weight: 700;
  font-size: 13px;
  color: var(--clinical-teal);
  text-transform: uppercase;
  letter-spacing: .03em;
}

.slot-time {
  font-weight: 600;
  font-size: 14px;
}

/* ---------- Buttons (Premium) ---------- */

.book-btn {
  background: linear-gradient(135deg, var(--clinical-teal), #0b7a70);
  color: white;
  border: none;
  padding: 13px 26px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 18px -6px rgba(13, 148, 136, .4);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
}

.book-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
  box-shadow: 0 12px 22px -6px rgba(13, 148, 136, .45);
}

.book-btn:active {
  transform: translateY(0);
}

.book-btn--header {
  white-space: nowrap;
}

.book-btn--full {
  margin-top: 28px;
  width: 100%;
}

/* ---------- Reviews ---------- */

.review-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-card {
  display: flex;
  gap: 14px;
  background: var(--clinical-bg);
  border: 1px solid var(--clinical-border);
  padding: 18px;
  border-radius: 12px;
  transition: transform .2s ease, box-shadow .2s ease;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px -10px rgba(15, 42, 67, .14);
}

.review-avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--clinical-navy), #1a3a5c);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 4px 10px -3px rgba(15, 42, 67, .4);
}

.review-body {
  flex: 1;
  min-width: 0;
}

.review-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  flex-wrap: wrap;
  gap: 6px;
}

.review-stars {
  font-weight: 700;
  color: var(--clinical-amber);
  font-size: 14px;
}

.review-author {
  color: var(--clinical-text-muted);
  font-size: 12px;
}

.review-comment {
  margin: 0;
  color: var(--clinical-text);
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: break-word;
}

/* ---------- Empty state ---------- */

.empty-state {
  text-align: center;
  padding: 36px 0;
  color: var(--clinical-text-muted);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .profile-page {
    padding: 20px 22px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .profile-card {
    padding: 24px;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .profile-page {
    padding: 18px;
  }

  .doctor-header h1 {
    font-size: 24px;
  }

  .doctor-img {
    width: 92px;
    height: 92px;
  }

}

/* ==========================
   Mobile (reference-style hero)
========================== */
@media (max-width: 768px) {

  .profile-page {
    padding: 14px;
  }

  .profile-card {
    padding: 0;
    border-radius: 16px;
    overflow: hidden;
  }

  /* hide desktop header row, show reference-style hero instead */

  .doctor-header {
    display: none;
  }

  .mobile-hero {
    display: block;
  }

  .mobile-hero-photo {
    position: relative;
    width: 100%;
    height: 260px;
    background: linear-gradient(135deg, var(--clinical-navy), var(--clinical-teal));
  }

  .mobile-hero-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hero-icon-btn {
    position: absolute;
    top: 16px;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,.92);
    color: var(--clinical-navy);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px -3px rgba(15,42,67,.25);
  }

  .hero-icon-btn svg {
    width: 17px;
    height: 17px;
  }

  .hero-icon-btn--back {
    left: 16px;
  }

  .hero-icon-btn--fav {
    right: 16px;
  }

  .hero-icon-btn--fav.active {
    color: #dc2626;
  }

  .mobile-hero-card {
    margin: -28px 14px 0;
    position: relative;
    background: var(--clinical-surface);
    border: 1px solid var(--clinical-border);
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 10px 24px -12px rgba(15,42,67,.18);
  }

  .mobile-hero-name {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: var(--clinical-navy);
  }

  .mobile-hero-role {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--clinical-text-muted);
  }

  .mobile-stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--clinical-border);
  }

  .mobile-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  .mobile-stat-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--clinical-navy);
    white-space: nowrap;
  }

  .mobile-stat-label {
    font-size: 11px;
    color: var(--clinical-text-muted);
  }

  .mobile-stat-divider {
    width: 1px;
    height: 28px;
    background: var(--clinical-border);
  }

  .profile-card > .info-grid,
  .profile-card > .section,
  .profile-card > .book-btn--full {
    margin-left: 14px;
    margin-right: 14px;
  }

  .profile-card > .book-btn--full {
    margin-bottom: 20px;
    width: calc(100% - 28px);
  }

  .profile-card > .section:last-child {
    padding-bottom: 20px;
  }

  .book-btn--header {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 18px;
  }

  .info-card {
    padding: 12px;
  }

  .section {
    margin-top: 22px;
  }

  .section h2 {
    font-size: 16px;
  }

  .slot {
    min-width: 110px;
    padding: 10px 14px;
  }

  .review-card {
    padding: 14px;
    gap: 10px;
  }

}

.mobile-hero-photo {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--clinical-navy),
    var(--clinical-teal)
  );
}


.mobile-hero-photo .doctor-img {

  width:100%;
  height:100%;

  border-radius:0;
  border:none;

  object-fit:cover;
  object-position:10% 70%;

  display:block;

}
/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .profile-page {
    padding: 10px;
  }

  .mobile-hero-photo {
    height: 220px;
  }

  .mobile-hero-name {
    font-size: 18px;
  }

  .mobile-stat-value {
    font-size: 13px;
  }

  .doctor-header h1 {
    font-size: 19px;
  }

  .doctor-img {
    width: 72px;
    height: 72px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .tag {
    font-size: 12px;
    padding: 4px 10px;
  }

  .rating-stars {
    font-size: 14px;
  }

  .slot-list {
    gap: 8px;
  }

  .slot {
    min-width: unset;
    flex: 1 1 45%;
  }

  .review-avatar {
    width: 34px;
    height: 34px;
    min-width: 34px;
    font-size: 13px;
  }

  .review-comment {
    font-size: 13px;
  }

  .book-btn {
    padding: 12px 20px;
    font-size: 14px;
  }

}

.related-grid{

display:grid;
grid-template-columns:
repeat(auto-fit,minmax(220px,1fr));

gap:16px;

}



.related-card{

background:white;

border:1px solid var(--clinical-border);

border-radius:16px;

padding:16px;

display:flex;

gap:14px;

cursor:pointer;

transition:.2s;

}



.related-card:hover{

transform:translateY(-3px);

box-shadow:0 10px 20px -10px rgba(0,0,0,.2);

}



.related-img{

width:70px;

height:70px;

border-radius:50%;

object-fit:cover;

}



.related-info h3{

margin:0;

font-size:16px;

color:var(--clinical-navy);

}



.related-info p{

margin:5px 0;

font-size:13px;

color:var(--clinical-text-muted);

}



.related-info span{

font-size:12px;

color:var(--clinical-teal);

}



@media(max-width:480px){

.related-grid{

grid-template-columns:1fr;

}


.related-card{

padding:12px;

}


}

</style>